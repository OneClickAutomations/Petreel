/**
 * Thin generation fetch layer.
 *
 * By default this calls our own same-origin Vercel serverless functions
 * (/api/generate, /api/generate-status), which hold the real Higgsfield
 * credentials server-side and call platform.higgsfield.ai — see api/generate.js.
 *
 * Set VITE_GENERATION_API_URL to point at a fully separate backend instead
 * (e.g. a non-Vercel deployment); the same /generate + /generate-status
 * contract applies.
 *
 * If neither is reachable — e.g. running `npm run dev` locally without
 * `vercel dev`, where /api/* doesn't exist — this transparently falls back
 * to an in-memory mock so the create flow still works offline. Once our own
 * API route DOES respond (even with an error), that response is always
 * surfaced rather than masked, so misconfiguration (missing keys, bad
 * credentials, no credits) is visible instead of silently faked.
 */

const EXPLICIT_API = import.meta.env.VITE_GENERATION_API_URL?.replace(/\/$/, '') ?? '';
const API_BASE = EXPLICIT_API || '/api';

class NoBackendError extends Error {}

async function postJSON(url, body) {
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new NoBackendError();
  }
  let data;
  try {
    data = await res.json();
  } catch {
    // Not JSON — our routes always return JSON, so this means no real
    // backend answered (e.g. local `vite dev` serving its SPA fallback).
    throw new NoBackendError();
  }
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

async function getJSON(url) {
  const res = await fetch(url);
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Unexpected response from the generation backend.');
  }
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
  return data;
}

export async function createJob(payload) {
  try {
    return await postJSON(`${API_BASE}/generate`, payload);
  } catch (err) {
    if (!(err instanceof NoBackendError)) throw err;
    // --- mock fallback (no backend reachable) ---
    const jobId = 'mock_' + Math.random().toString(36).slice(2, 10);
    MOCK_JOBS.set(jobId, { started: Date.now(), payload });
    return { jobId };
  }
}

export async function getJob(jobId) {
  if (jobId.startsWith('mock_')) return getMockJob(jobId);
  return getJSON(`${API_BASE}/generate-status?jobId=${encodeURIComponent(jobId)}`);
}

/**
 * Convenience: create + poll to completion with progress callbacks.
 * Returns the final job payload.
 */
export async function generateAndPoll(payload, { onProgress, signal } = {}) {
  const { jobId } = await createJob(payload);
  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
      try {
        const job = await getJob(jobId);
        onProgress?.(job);
        if (job.status === 'done') return resolve({ ...job, jobId });
        if (job.status === 'error') return reject(new Error(job.error || 'Generation failed'));
        setTimeout(tick, 700);
      } catch (err) {
        reject(err);
      }
    };
    tick();
  });
}

/* ---- mock fallback (only used when no real backend is reachable) ---- */

const MOCK_JOBS = new Map();

function getMockJob(jobId) {
  const job = MOCK_JOBS.get(jobId);
  if (!job) return { status: 'error', error: 'Unknown job.' };
  const elapsed = Date.now() - job.started;
  const total = 6000;
  if (elapsed >= total) {
    return {
      status: 'done',
      progress: 1,
      resultUrl: job.payload?.previewSrc || '',
      posterUrl: job.payload?.stillUrl || '',
    };
  }
  return {
    status: elapsed < 900 ? 'queued' : 'processing',
    progress: Math.min(0.95, elapsed / total),
  };
}
