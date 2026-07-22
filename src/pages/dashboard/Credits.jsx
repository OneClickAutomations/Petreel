import { useState } from 'react';
import { IconSparkle, IconCheck } from '../../components/Icons';
import { creditPacks } from '../../config/media';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../lib/toast';

/**
 * Credits screen. Checkout is stubbed — the owner wires Stripe:
 *   const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
 *   // POST to a backend that creates a Checkout Session, then redirectToCheckout.
 */
export default function Credits() {
  const { credits, addCredits } = useAuth();
  const [busy, setBusy] = useState(null);
  const [history, setHistory] = useState([]);

  const buy = async (pack) => {
    setBusy(pack.id);
    // --- stubbed Stripe checkout ---
    await new Promise((r) => setTimeout(r, 900));
    addCredits(pack.credits);
    setHistory((h) => [
      { id: Math.random().toString(36).slice(2), name: pack.name, credits: pack.credits, price: pack.price, at: Date.now() },
      ...h,
    ]);
    setBusy(null);
    toast.success(`Added ${pack.credits} credits ✨`);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="glass-panel rounded-token p-6 sm:p-8">
        <p className="text-sm text-text-lo">Your balance</p>
        <p className="font-display mt-1 flex items-center gap-2 text-5xl font-bold text-text-hi">
          <IconSparkle className="text-accent" width={32} height={32} />
          {credits}
        </p>
        <p className="mt-2 text-sm text-text-lo">Each Reel costs 20 credits.</p>
      </div>

      <h2 className="font-display mb-4 mt-10 text-lg font-semibold">Top up</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {creditPacks.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-token border p-6 transition-all ${
              p.highlight ? 'border-accent bg-accent/[0.06] shadow-glow' : 'border-stroke bg-panel/50'
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-black">
                Best value
              </span>
            )}
            <p className="font-display text-lg font-semibold">{p.name}</p>
            <p className="font-display mt-2 text-4xl font-bold">${p.price}</p>
            <p className="mt-2 flex items-center gap-1.5 text-accent">
              <IconSparkle width={16} height={16} /> {p.credits} credits
            </p>
            <p className="mt-1 text-sm text-text-lo">{p.blurb}</p>
            <button
              onClick={() => buy(p)}
              disabled={busy === p.id}
              className={`mt-5 w-full py-2.5 text-sm ${p.highlight ? 'btn-accent' : 'btn-ghost'} disabled:opacity-60`}
            >
              {busy === p.id ? 'Processing…' : 'Buy'}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-text-lo">Secure checkout via Stripe. Cancel anytime.</p>

      <h2 className="font-display mb-4 mt-10 text-lg font-semibold">History</h2>
      {history.length === 0 ? (
        <p className="rounded-token border border-stroke bg-panel/40 px-4 py-6 text-center text-sm text-text-lo">
          No purchases yet.
        </p>
      ) : (
        <ul className="divide-y divide-stroke overflow-hidden rounded-token border border-stroke">
          {history.map((h) => (
            <li key={h.id} className="flex items-center justify-between bg-panel/40 px-4 py-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/15 text-accent"><IconCheck width={14} height={14} /></span>
                {h.name} pack · {h.credits} credits
              </span>
              <span className="text-text-lo">${h.price} · {new Date(h.at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
