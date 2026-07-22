import { useEffect, useState } from 'react';
import { IconCheck, IconClose } from './Icons';

/** Dark-glass toasts. Accent for success, warm for errors. */
export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const onToast = (e) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, ...e.detail }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 4200);
    };
    window.addEventListener('petreel:toast', onToast);
    return () => window.removeEventListener('petreel:toast', onToast);
  }, []);

  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 md:bottom-6 md:left-auto md:right-6 md:translate-x-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`glass pointer-events-auto flex items-center gap-3 rounded-token px-4 py-3 shadow-lift ${
            t.type === 'error' ? 'border-accent-warm/40' : 'border-accent/40'
          }`}
        >
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
              t.type === 'error' ? 'bg-accent-warm/20 text-accent-warm' : 'bg-accent/20 text-accent'
            }`}
          >
            {t.type === 'error' ? '!' : <IconCheck width={14} height={14} />}
          </span>
          <p className="flex-1 text-sm text-text-hi">{t.message}</p>
          <button onClick={() => dismiss(t.id)} className="text-text-lo hover:text-text-hi" aria-label="Dismiss">
            <IconClose width={16} height={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
