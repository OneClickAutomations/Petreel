import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * Auth + credits context.
 *
 * Wraps the Supabase client (real or mock). Protected routes read `user` and
 * `loading`; the dashboard reads/decrements `credits`. Credits are kept in
 * local state here so the create flow can do optimistic UI — the owner swaps
 * this for a Supabase table read/RPC.
 */

const AuthContext = createContext(null);

const CREDITS_KEY = 'petreel.credits';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(() => {
    const saved = Number(localStorage.getItem(CREDITS_KEY));
    return Number.isFinite(saved) && saved > 0 ? saved : 60; // welcome credits
  });

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      active = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(CREDITS_KEY, String(credits));
  }, [credits]);

  const value = useMemo(
    () => ({
      user,
      loading,
      credits,
      addCredits: (n) => setCredits((c) => c + n),
      spendCredits: (n) => setCredits((c) => Math.max(0, c - n)),
      signUp: (email, password) => supabase.auth.signUp({ email, password }),
      signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
      signInWithGoogle: () =>
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { redirectTo: window.location.origin + '/auth/callback' },
        }),
      signOut: () => supabase.auth.signOut(),
    }),
    [user, loading, credits]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
