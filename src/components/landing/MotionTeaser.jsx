import { useState } from 'react';
import SmartVideo from '../SmartVideo';
import { motions } from '../../config/media';

/**
 * 2C. Motion-picker teaser (the USP). Live thumbnail loops; hovering one
 * enlarges + glows and plays it. Shows the product's range wordlessly.
 */
export default function MotionTeaser() {
  const [active, setActive] = useState(motions[2].id); // zoomies feels alive first

  return (
    <section className="relative overflow-hidden border-t border-stroke bg-panel/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Pick the motion
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold text-text-hi sm:text-5xl">
            Every mood, one tap away.
          </h2>
        </div>

        <div
          className="mt-12 flex gap-4 overflow-x-auto no-scrollbar pb-2"
          role="listbox"
          aria-label="Motion styles"
        >
          {motions.map((m) => {
            const isActive = active === m.id;
            return (
              <button
                key={m.id}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActive(m.id)}
                onFocus={() => setActive(m.id)}
                onClick={() => setActive(m.id)}
                className={`group relative shrink-0 overflow-hidden rounded-token ring-1 transition-all duration-500 ease-intent ${
                  isActive
                    ? 'w-[240px] ring-accent shadow-glow'
                    : 'w-[132px] ring-stroke opacity-80 hover:opacity-100'
                } aspect-[3/4]`}
              >
                <SmartVideo
                  videoSrc={m.videoSrc}
                  className="h-full w-full"
                  ariaLabel={`${m.label} preview`}
                />
                <span className="scrim absolute inset-0" aria-hidden="true" />
                <span className="absolute bottom-3 left-3 text-left">
                  <span
                    className={`font-display block text-base font-semibold ${
                      m.accent === 'accent-warm' ? 'text-accent-warm' : 'text-text-hi'
                    }`}
                  >
                    {m.label}
                  </span>
                  {isActive && (
                    <span className="mt-0.5 block text-xs text-text-lo">{m.blurb}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
