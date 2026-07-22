import { Link } from 'react-router-dom';

export default function Logo({ to = '/', className = '' }) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="PetReel home"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-panel ring-1 ring-stroke transition-shadow group-hover:shadow-glow">
        <svg width="20" height="20" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="11" cy="13" r="3" fill="var(--accent)" />
          <circle cx="21" cy="13" r="3" fill="var(--accent)" />
          <circle cx="8" cy="19" r="2.4" fill="var(--accent)" />
          <circle cx="24" cy="19" r="2.4" fill="var(--accent)" />
          <ellipse cx="16" cy="22" rx="5" ry="4" fill="var(--accent)" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight text-text-hi">
        Pet<span className="text-accent">Reel</span>
      </span>
    </Link>
  );
}
