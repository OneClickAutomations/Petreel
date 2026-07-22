import { useInViewVideo } from '../hooks/useInViewVideo';

/**
 * A performance-aware, accessibility-aware <video>.
 *
 * - Plays only when in view (via useInViewVideo), never off-screen.
 * - preload="none" so off-screen media doesn't fetch until near viewport.
 * - Renders a gradient placeholder behind the poster so a missing media file
 *   still looks intentional (near-black + faint accent glow) — the app runs
 *   with zero media present.
 * - Under prefers-reduced-motion, shows the poster/placeholder, no motion.
 */
export default function SmartVideo({
  videoSrc,
  poster,
  className = '',
  objectFit = 'cover',
  rounded = false,
  ariaLabel,
  threshold = 0.4,
}) {
  const { ref, reducedMotion } = useInViewVideo({ threshold });

  return (
    <div
      className={`relative overflow-hidden ${rounded ? 'rounded-token' : ''} ${className}`}
      style={{
        background:
          'radial-gradient(120% 90% at 50% 20%, rgba(200,255,61,0.10), transparent 60%), linear-gradient(160deg, #16161a 0%, #0a0a0b 100%)',
      }}
    >
      {/* subtle placeholder paw motif so an empty slot never looks broken */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
        <svg width="64" height="64" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="11" cy="13" r="3" fill="#C8FF3D" />
          <circle cx="21" cy="13" r="3" fill="#C8FF3D" />
          <circle cx="8" cy="19" r="2.4" fill="#C8FF3D" />
          <circle cx="24" cy="19" r="2.4" fill="#C8FF3D" />
          <ellipse cx="16" cy="22" rx="5" ry="4" fill="#C8FF3D" />
        </svg>
      </div>

      {reducedMotion ? (
        poster ? (
          <img
            src={poster}
            alt={ariaLabel || ''}
            className="absolute inset-0 h-full w-full"
            style={{ objectFit }}
            loading="lazy"
          />
        ) : null
      ) : (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full"
          style={{ objectFit }}
          poster={poster || undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-label={ariaLabel}
        >
          {videoSrc ? <source src={videoSrc} type="video/mp4" /> : null}
        </video>
      )}
    </div>
  );
}
