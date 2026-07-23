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

    const status = data?.status || data?.data?.status;

    if (status === 'completed') {
      const resultUrl =
        data?.video?.url || data?.data?.video?.url || data?.output?.video?.url || '';
      const posterUrl =
        data?.images?.[0]?.url || data?.data?.images?.[0]?.url || '';
      if (!resultUrl) {
        const raw = JSON.stringify(data).slice(0, 600);
        console.error('[api/generate-status] completed with no video url:', raw);
        return res.status(200).json({
          status: 'error',
          error: `Higgsfield marked the job complete but returned no video URL. Raw response: ${raw}`,
        });
      }
      return res.status(200).json({ status: 'done', progress: 1, resultUrl, posterUrl });
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

    if (status === 'queued' || status === 'in_progress') {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(0.92, elapsed / ESTIMATED_TOTAL_MS);
      return res.status(200).json({ status: status === 'queued' ? 'queued' : 'processing', progress });
    }

    // Unknown status shape — surface the raw payload instead of polling forever.
    const raw = JSON.stringify(data).slice(0, 600);
    console.error('[api/generate-status] unrecognized status response:', raw);
    return res.status(200).json({
      status: 'error',
      error: `Unrecognized status response from Higgsfield. Raw response: ${raw}`,
    });
  } catch (err) {
    console.error('[api/generate-status]', err);
    const { status, message } = describeError(err);
    return res.status(status).json({ error: message });
  }
}
