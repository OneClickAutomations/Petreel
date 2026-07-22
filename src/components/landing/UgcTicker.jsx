import SmartVideo from '../SmartVideo';
import { testimonials } from '../../config/media';

function PlatformGlyph({ platform }) {
  if (platform === 'tiktok') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-label="TikTok">
        <path d="M16.5 3c.3 2.1 1.6 3.7 3.5 4v2.4c-1.3 0-2.5-.4-3.5-1v6.1a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v2.6a2.9 2.9 0 1 0 2 2.8V3h2.6z" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-label="Instagram">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function ReelCard({ t }) {
  return (
    <figure className="group relative w-[172px] shrink-0 overflow-hidden rounded-token ring-1 ring-stroke sm:w-[196px]">
      <div className="aspect-[9/16]">
        <SmartVideo videoSrc={t.videoSrc} poster={t.poster} className="h-full w-full" ariaLabel={`Reel from ${t.handle}`} />
      </div>
      <span className="scrim absolute inset-0" aria-hidden="true" />
      <figcaption className="absolute inset-x-0 bottom-0 p-3">
        <div className="flex items-center gap-2">
          <span
            className="h-7 w-7 shrink-0 rounded-full bg-cover bg-center ring-1 ring-white/20"
            style={{
              backgroundImage: t.avatar ? `url(${t.avatar})` : undefined,
              background: t.avatar ? undefined : 'linear-gradient(135deg,#2a2a30,#c8ff3d33)',
            }}
          />
          <span className="truncate text-xs font-semibold text-text-hi">{t.handle}</span>
          <span className="ml-auto text-accent">
            <PlatformGlyph platform={t.platform} />
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-text-hi/90">{t.quote}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-text-lo">
          <span className="text-accent-warm">❤</span> {t.likes}
        </p>
      </figcaption>
    </figure>
  );
}

/** One marquee row; direction 'left' | 'right', duration in seconds. */
function Row({ items, direction = 'left', duration = 46 }) {
  const doubled = [...items, ...items];
  return (
    <div className="group/row relative overflow-hidden py-2.5">
      <div
        className={`flex w-max gap-4 ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'} group-hover/row:[animation-play-state:paused]`}
        style={{ '--ticker-duration': `${duration}s` }}
      >
        {doubled.map((t, i) => (
          <ReelCard key={`${t.handle}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

/**
 * 2D. Scrolling UGC testimonial ticker — a wall of "real" pet-owner Reels.
 * Two rows scroll opposite directions at different speeds; hover pauses the row.
 */
export default function UgcTicker() {
  const half = Math.ceil(testimonials.length / 2);
  const rowA = testimonials.slice(0, half);
  const rowB = testimonials.slice(half);

  return (
    <section className="relative overflow-hidden border-t border-stroke py-24 sm:py-32">
      <div className="mx-auto mb-12 max-w-7xl px-5 text-center sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Loved by pet people</p>
        <h2 className="font-display mx-auto mt-4 max-w-2xl text-4xl font-bold text-text-hi sm:text-5xl">
          A feed full of happy tears.
        </h2>
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />

      <Row items={rowA} direction="left" duration={48} />
      <Row items={rowB.length ? rowB : rowA} direction="right" duration={38} />
    </section>
  );
}
