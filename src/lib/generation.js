/**
 * Thin generation fetch layer — SCAFFOLD.
 *
 * Media generation runs server-side (owner's backend calls Higgsfield/Gemini
 * with the secret key — never the browser). The frontend POSTs a job and polls
 * for status. Point VITE_GENERATION_API_URL at that backend to go live.
 *
 * Contract the UI expects:
 *   POST {API}/jobs        -> { jobId }
 *   GET  {API}/jobs/:id    -> { status: 'queued'|'processing'|'done'|'error',
 *                               progress?: 0..1, resultUrl?, posterUrl? }
 *
 * With no API configured we simulate the async lifecycle so the create flow —
 * progress states, polling, confetti reveal — is fully exercisable offline.
 */

const API = import.meta.env.VITE_GENERATION_API_URL?.replace(/\/$/, '') ?? '';

export const isGenerationLive = !!API;

export async function createJob(payload) {
  if (API) {
    const res = await fetch(`${API}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to start generation');
    return res.json();
  }
  // --- mock ---
  const jobId = 'mock_' + Math.random().toString(36).slice(2, 10);
  MOCK_JOBS.set(jobId, { started: Date.now(), payload });
  return { jobId };
}

export async function getJob(jobId) {
  if (API) {
    const res = await fetch(`${API}/jobs/${jobId}`);
    if (!res.ok) throw new Error('Failed to fetch job');
    return res.json();
  }
  // --- mock: ~6s lifecycle ---
  const job = MOCK_JOBS.get(jobId);
  if (!job) return { status: 'error' };
  const elapsed = Date.now() - job.started;
  const total = 6000;
  if (elapsed >= total) {
    return {
      status: 'done',
      progress: 1,
      // reuse the chosen motion's preview loop as the "result" in mock mode
      resultUrl: job.payload?.previewSrc || '',
      posterUrl: job.payload?.stillUrl || '',
    };
  }
  return {
    status: elapsed < 900 ? 'queued' : 'processing',
    progress: Math.min(0.95, elapsed / total),
  };
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
        if (job.status === 'error') return reject(new Error('Generation failed'));
        setTimeout(tick, 700);
      } catch (err) {
        reject(err);
      }
    };
    tick();
  });
}

const MOCK_JOBS = new Map();
