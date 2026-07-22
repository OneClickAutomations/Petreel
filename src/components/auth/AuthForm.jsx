import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C39.9 36.1 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/**
 * Shared sign in / sign up form. mode = 'signin' | 'signup'.
 * All auth calls route through AuthContext -> Supabase (mock until wired).
 */
export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) return setError('Please fill in both fields.');
    if (isSignup && password.length < 6)
      return setError('Password needs at least 6 characters.');
    setBusy(true);
    try {
      const fn = isSignup ? signUp : signIn;
      const { error: err } = await fn(email, password);
      if (err) throw err;
      navigate('/app');
    } catch (err) {
      setError(err?.message || 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setError('');
    setBusy(true);
    try {
      const { error: err } = await signInWithGoogle();
      if (err) throw err;
      // Real Supabase OAuth redirects; the mock lands us straight in.
      navigate('/app');
    } catch (err) {
      setError(err?.message || 'Google sign-in failed.');
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <button
        type="button"
        onClick={onGoogle}
        disabled={busy}
        className="btn-ghost w-full py-3 text-sm disabled:opacity-50"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-stroke" />
        <span className="text-xs text-text-lo">or</span>
        <span className="h-px flex-1 bg-stroke" />
      </div>

      <Field
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
      />
      <Field
        label="Password"
        type="password"
        autoComplete={isSignup ? 'new-password' : 'current-password'}
        value={password}
        onChange={setPassword}
        placeholder={isSignup ? 'At least 6 characters' : '••••••••'}
      />

      {error && (
        <p role="alert" className="rounded-xl border border-accent-warm/40 bg-accent-warm/10 px-3 py-2 text-sm text-accent-warm">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-accent w-full py-3 text-base disabled:opacity-60">
        {busy ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
        ) : isSignup ? (
          'Create account'
        ) : (
          'Sign in'
        )}
      </button>

      <p className="pt-1 text-center text-xs leading-relaxed text-text-lo">
        {isSignup ? (
          <>
            By creating an account you agree to our Terms & Privacy Policy.
            <br />
            Already have one?{' '}
            <Link to="/signin" className="font-medium text-accent hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to PetReel?{' '}
            <Link to="/signup" className="font-medium text-accent hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function Field({ label, type, value, onChange, placeholder, autoComplete }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-text-lo">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-token border border-stroke bg-void/60 px-4 py-3 text-text-hi placeholder:text-text-lo/50 transition-shadow duration-300 focus:border-accent/50 focus:shadow-[0_0_0_3px_rgba(200,255,61,0.15)] focus:outline-none"
      />
    </label>
  );
}
