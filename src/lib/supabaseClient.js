/**
 * Supabase client — SCAFFOLD ONLY.
 *
 * The owner drops in real credentials via env and installs @supabase/supabase-js:
 *
 *   npm i @supabase/supabase-js
 *
 *   import { createClient } from '@supabase/supabase-js';
 *   export const supabase = createClient(
 *     import.meta.env.VITE_SUPABASE_URL,
 *     import.meta.env.VITE_SUPABASE_ANON_KEY,
 *   );
 *
 * Until then we export a tiny mock with the same surface the app uses, so
 * every screen renders and flows work end-to-end without a backend. NO
 * CREDENTIALS ARE HARDCODED — the mock reads nothing sensitive.
 */

const hasEnv =
  !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

const LS_KEY = 'petreel.mock.session';

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || 'null');
  } catch {
    return null;
  }
}
function writeSession(session) {
  if (session) localStorage.setItem(LS_KEY, JSON.stringify(session));
  else localStorage.removeItem(LS_KEY);
  listeners.forEach((cb) => cb(session ? 'SIGNED_IN' : 'SIGNED_OUT', session));
}

const listeners = new Set();
const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));
const fakeUser = (email) => ({
  id: 'mock-' + btoa(email).slice(0, 12),
  email,
  user_metadata: { name: email.split('@')[0] },
});

/** Mock client mirroring the subset of supabase-js we call. */
const mockSupabase = {
  __mock: true,
  auth: {
    async getSession() {
      const session = readSession();
      return { data: { session }, error: null };
    },
    async signUp({ email }) {
      await wait();
      const session = { user: fakeUser(email), access_token: 'mock' };
      writeSession(session);
      return { data: { user: session.user, session }, error: null };
    },
    async signInWithPassword({ email }) {
      await wait();
      const session = { user: fakeUser(email), access_token: 'mock' };
      writeSession(session);
      return { data: { user: session.user, session }, error: null };
    },
    async signInWithOAuth() {
      await wait(400);
      const session = { user: fakeUser('google.user@petreel.app'), access_token: 'mock' };
      writeSession(session);
      return { data: { provider: 'google', url: '/auth/callback' }, error: null };
    },
    async signOut() {
      writeSession(null);
      return { error: null };
    },
    onAuthStateChange(cb) {
      listeners.add(cb);
      return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
    },
  },
};

export const supabase = mockSupabase;
export const isSupabaseLive = hasEnv;
