import { HF_BASE, hfHeaders, describeError } from './_lib/higgsfield.js';

/**
 * Lightweight credentials check — calls a harmless authenticated Higgsfield
 * endpoint and reports whether the configured key/secret actually work.
 * Wired to the "Test connection" button on the Settings page.
 */
export default async function handler(req, res) {
  try {
    const headers = hfHeaders();
    const r = await fetch(`${HF_BASE}/v1/motions`, { headers });
    if (r.ok) return res.status(200).json({ ok: true });
    const err = new Error(`Unexpected response (${r.status})`);
    err.status = r.status;
    const { message } = describeError(err);
    return res.status(200).json({ ok: false, error: message });
  } catch (err) {
    const { message } = describeError(err);
    return res.status(200).json({ ok: false, error: message });
  }
}
