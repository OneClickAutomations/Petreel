/**
 * Local reels store — SCAFFOLD.
 *
 * Persists the user's generated Reels to localStorage so "My Reels" has real
 * data across the create flow without a backend. Owner swaps these four calls
 * for Supabase table queries (select/insert/delete).
 */

const KEY = 'petreel.reels';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}
function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent('petreel:reels'));
}

export function listReels() {
  return read().sort((a, b) => b.createdAt - a.createdAt);
}

export function addReel(reel) {
  const list = read();
  const record = {
    id: 'reel_' + Math.random().toString(36).slice(2, 10),
    createdAt: Date.now(),
    ...reel,
  };
  write([record, ...list]);
  return record;
}

export function deleteReel(id) {
  write(read().filter((r) => r.id !== id));
}

export function subscribeReels(cb) {
  const handler = () => cb(listReels());
  window.addEventListener('petreel:reels', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('petreel:reels', handler);
    window.removeEventListener('storage', handler);
  };
}
