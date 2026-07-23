import { hfHeaders, hfFetch, describeError } from './_lib/higgsfield.js';

// Higgsfield's status response doesn't include a numeric progress field, so
// while the job is queued/in_progress we synthesize a smooth ramp from the
// start time encoded in the jobId. Kling/Seedance-class image-to-video jobs
// typically land in ~15-40s; this just drives the progress bar, not billing.
const ESTIMATED_TOTAL_MS = 25000;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobId } = req.query;
  if (!jobId) return res.status(400).json({ error: 'Missing jobId' });

  const [requestId, startedAtStr] = String(jobId).split('::');
  const startedAt = Number(startedAtStr) || Date.now();

  try {
    const data = await hfFetch(`/requests/${requestId}/status`, {
      method: 'GET',
      headers: hfHeaders(),
    });

    const status = data?.status;

    if (status === 'completed') {
      return res.status(200).json({
        status: 'done',
        progress: 1,
        resultUrl: data?.video?.url || '',
        posterUrl: data?.images?.[0]?.url || '',
      });
    }

    if (status === 'failed' || status === 'nsfw') {
      return res.status(200).json({
        status: 'error',
        error:
          status === 'nsfw'
            ? 'Higgsfield flagged this photo as unsafe to animate. Try a different photo.'
            : 'Generation failed on Higgsfield’s side. Please try again.',
      });
    }

    const elapsed = Date.now() - startedAt;
    const progress = Math.min(0.92, elapsed / ESTIMATED_TOTAL_MS);
    return res.status(200).json({
      status: status === 'queued' ? 'queued' : 'processing',
      progress,
    });
  } catch (err) {
    console.error('[api/generate-status]', err);
    const { status, message } = describeError(err);
    return res.status(status).json({ error: message });
  }
}
