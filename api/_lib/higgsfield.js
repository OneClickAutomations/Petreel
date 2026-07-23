/**
 * Minimal server-side client for Higgsfield's platform API.
 *
 * Base URL, auth headers, and endpoint shapes below are taken from the
 * official Node SDK source (github.com/higgsfield-ai/higgsfield-js):
 *   - Base URL: https://platform.higgsfield.ai
 *   - Auth: 'hf-api-key' + 'hf-secret' headers
 *   - Upload: POST /files/generate-upload-url {content_type} -> {upload_url, public_url}
 *             then PUT the raw bytes to upload_url
 *   - Generate: POST /v1/image2video/dop {params:{model, prompt, input_images}}
 *               -> {request_id, status, ...}
 *   - Status:  GET /requests/{request_id}/status
 *               -> {status: queued|in_progress|nsfw|failed|completed, video:{url}, images:[...]}
 *
 * Credentials are read from server-only env vars (never VITE_-prefixed, so
 * they never ship to the client bundle): HIGGSFIELD_API_KEY, HIGGSFIELD_API_SECRET.
 */

export const HF_BASE = 'https://platform.higgsfield.ai';

export class MissingCredentialsError extends Error {
  constructor() {
    super('HIGGSFIELD_API_KEY / HIGGSFIELD_API_SECRET are not set on the server.');
    this.name = 'MissingCredentialsError';
  }
}

export function hfHeaders(extra = {}) {
  const apiKey = process.env.HIGGSFIELD_API_KEY;
  const apiSecret = process.env.HIGGSFIELD_API_SECRET;
  if (!apiKey || !apiSecret) throw new MissingCredentialsError();
  return {
    'hf-api-key': apiKey,
    'hf-secret': apiSecret,
    'Content-Type': 'application/json',
    ...extra,
  };
}

/** JSON fetch wrapper against the Higgsfield API. Throws with upstream status/message on failure. */
export async function hfFetch(path, options = {}) {
  const res = await fetch(`${HF_BASE}${path}`, options);
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response body */
  }
  if (!res.ok) {
    const message = data?.message || data?.error || `Higgsfield API error (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

/** Maps a caught error to an HTTP status + user-facing message for our API routes. */
export function describeError(err) {
  if (err instanceof MissingCredentialsError) {
    return { status: 500, message: err.message };
  }
  if (err.status === 401) {
    return { status: 401, message: 'Higgsfield rejected the API key/secret. Check HIGGSFIELD_API_KEY and HIGGSFIELD_API_SECRET.' };
  }
  if (err.status === 403) {
    return { status: 403, message: 'Higgsfield: out of credits, or this key does not have access to this feature.' };
  }
  if (err.status === 422 || err.status === 400) {
    return { status: 422, message: err.message || 'Higgsfield rejected the request as invalid.' };
  }
  return { status: 502, message: err.message || 'Failed to reach Higgsfield.' };
}
