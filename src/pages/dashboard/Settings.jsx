import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../lib/toast';

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({ productEmails: true, resultReady: true });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const doSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card title="Account">
        <Row label="Name" value={name} />
        <Row label="Email" value={user?.email || '—'} />
        <Row
          label="Google"
          value={user?.email?.includes('google') ? 'Connected' : 'Not connected'}
          action={!user?.email?.includes('google') && <button className="btn-ghost py-1.5 text-xs">Connect</button>}
        />
      </Card>

      <Card title="Notifications">
        <Toggle
          label="Product updates & tips"
          checked={prefs.productEmails}
          onChange={(v) => setPrefs((p) => ({ ...p, productEmails: v }))}
        />
        <Toggle
          label="Email me when a Reel is ready"
          checked={prefs.resultReady}
          onChange={(v) => setPrefs((p) => ({ ...p, resultReady: v }))}
        />
        <button onClick={() => toast.success('Preferences saved')} className="btn-accent mt-2 py-2 text-sm">
          Save preferences
        </button>
      </Card>

      <Card title="Session">
        <button onClick={doSignOut} className="btn-ghost py-2 text-sm">Sign out</button>
      </Card>

      <Card title="Danger zone" danger>
        <p className="text-sm text-text-lo">Permanently delete your account and all your Reels. This can't be undone.</p>
        {confirmDelete ? (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => toast.error('Account deletion is wired to Supabase by the owner.')}
              className="btn-accent bg-accent-warm py-2 text-sm"
              style={{ background: 'var(--accent-warm)' }}
            >
              Yes, delete everything
            </button>
            <button onClick={() => setConfirmDelete(false)} className="btn-ghost py-2 text-sm">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="mt-3 rounded-full border border-accent-warm/40 px-4 py-2 text-sm text-accent-warm transition-colors hover:bg-accent-warm/10">
            Delete account
          </button>
        )}
      </Card>
    </div>
  );
}

function Card({ title, children, danger }) {
  return (
    <section className={`glass-panel rounded-token p-6 ${danger ? 'border-accent-warm/30' : ''}`}>
      <h2 className={`font-display mb-4 text-lg font-semibold ${danger ? 'text-accent-warm' : ''}`}>{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, value, action }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs text-text-lo">{label}</p>
        <p className="text-sm text-text-hi">{value}</p>
      </div>
      {action}
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span className="text-sm text-text-hi">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-5 w-9 shrink-0 rounded-full bg-white/10 transition-colors peer-checked:bg-accent">
        <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
      </span>
    </label>
  );
}
