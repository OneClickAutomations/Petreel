import { hfHeaders, hfFetch, describeError } from './_lib/higgsfield.js';
import { promptForMotion } from './_lib/motionPrompts.js';

// Vercel's Node serverless functions hard-cap request bodies around 4.5MB;
// the client resizes photos before sending, but reject early with a clear
// message rather than letting the platform's own opaque 413 surface.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { motion, imageBase64, contentType } = req.body || {};
  if (!motion) return res.status(400).json({ error: 'Missing motion' });
  if (!imageBase64) return res.status(400).json({ error: 'Missing image' });

  const buffer = Buffer.from(imageBase64, 'base64');
  if (buffer.length > MAX_IMAGE_BYTES) {
    return res.status(413).json({ error: 'Photo is too large. Please use a smaller image.' });
  }

  try {
    // 1. Get a pre-signed upload URL for the photo.
    const uploadLink = await hfFetch('/files/generate-upload-url', {
      method: 'POST',
      headers: hfHeaders(),
      body: JSON.stringify({ content_type: contentType || 'image/jpeg' }),
    });
    const { upload_url: uploadUrl, public_url: publicUrl } = uploadLink || {};
    if (!uploadUrl || !publicUrl) throw new Error('Higgsfield upload-url response was malformed.');

    // 2. PUT the raw photo bytes to that pre-signed URL.
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType || 'image/jpeg' },
      body: buffer,
    });
    if (!putRes.ok) throw new Error(`Photo upload to Higgsfield failed (${putRes.status}).`);

    // 3. Submit the image-to-video generation job.
    const prompt = promptForMotion(motion);
    const job = await hfFetch('/v1/image2video/dop', {
      method: 'POST',
      headers: hfHeaders(),
      body: JSON.stringify({
        params: {
          model: 'dop-turbo',
          prompt,
          input_images: [{ type: 'image_url', image_url: publicUrl }],
        },
      }),
    });

    const requestId =
      job?.request_id || job?.id || job?.job_id || job?.data?.request_id || job?.data?.id;
    if (!requestId) {
      const raw = JSON.stringify(job).slice(0, 600);
      console.error('[api/generate] unexpected submit response:', raw);
      throw new Error(`Higgsfield did not return a request_id for this job. Raw response: ${raw}`);
    }

    // Encode the start time into the opaque jobId so the status endpoint can
    // synthesize a smooth progress percentage without any server-side storage.
    const jobId = `${requestId}::${Date.now()}`;
    return res.status(200).json({ jobId, posterUrl: publicUrl });
  } catch (err) {
    console.error('[api/generate]', err);
    const { status, message } = describeError(err);
    return res.status(status).json({ error: message });
  }
}
