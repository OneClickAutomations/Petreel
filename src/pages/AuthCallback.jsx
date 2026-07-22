import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * OAuth redirect landing. With real Supabase, the client parses the URL hash
 * and establishes the session automatically; onAuthStateChange in AuthContext
 * picks it up. We just wait for a user, then forward into the app.
 */
export default function AuthCallback() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      navigate(user ? '/app' : '/signin', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-void">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-stroke border-t-accent" />
        <p className="text-sm text-text-lo">Signing you in…</p>
      </div>
    </div>
  );
}
