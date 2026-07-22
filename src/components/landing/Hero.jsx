import { Link } from 'react-router-dom';
import SmartVideo from '../SmartVideo';
import { useParallax } from '../../hooks/useParallax';
import { hero } from '../../config/media';

export default function Hero() {
  const { ref: bgRef, offset } = useParallax(0.25);
  const { ref: fgRef, offset: fgOffset } = useParallax(-0.08);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Parallax background video layer (moves slower) */}
      <div
        ref={bgRef}
        className="absolute inset-0 -z-10 will-change-transform"
        style={{ transform: `translateY(${offset}px) scale(1.1)` }}
      >
        <SmartVideo
          videoSrc={hero.videoSrc}
          poster={hero.poster}
          className="h-full w-full"
          ariaLabel="Pets coming to life — a bright, cinematic montage"
        />
      </div>
      {/* Legibility scrim */}
      <div className="scrim absolute inset-0 -z-10" aria-hidden="true" />

      {/* Foreground content (drifts at a different rate) */}
      <div
        ref={fgRef}
        className="mx-auto w-full max-w-7xl px-5 will-change-transform sm:px-8"
        style={{ transform: `translateY(${fgOffset}px)` }}
      >
        <div className="max-w-2xl pt-20">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Bring them to life
          </p>
          <h1
            className="font-display mt-5 text-5xl font-bold leading-[0.95] text-text-hi sm:text-7xl md:text-8xl"
            style={{ animationDelay: '80ms' }}
          >
            <span className="block animate-fade-up">Your pet.</span>
            <span className="block animate-fade-up text-glow" style={{ animationDelay: '160ms' }}>
              In motion.
            </span>
          </h1>
          <p
            className="mt-6 max-w-md animate-fade-up text-lg text-text-lo"
            style={{ animationDelay: '240ms' }}
          >
            One photo. One tap. A Reel that feels alive.
          </p>
          <div
            className="mt-9 flex animate-fade-up flex-col items-start gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: '320ms' }}
          >
            <Link to="/signup" className="btn-accent text-base">
              Animate my pet →
            </Link>
            <p className="text-sm text-text-lo">No app install · First animation free</p>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-glow" aria-hidden="true">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-stroke p-1.5">
          <span className="h-2 w-1 rounded-full bg-accent" />
        </div>
      </div>
    </section>
  );
}
