import { useRef, useState } from 'react';
import SmartVideo from '../SmartVideo';

/**
 * A single before→after pair. The still (left/before) sits under the playing
 * result (after); a draggable divider wipes between them. On scroll into view
 * it eases the reveal open so the "still becomes video" reads even without
 * interaction. One-word verb label overlaid — the video does the talking.
 */
export default function BeforeAfter({ stillSrc, videoSrc, label }) {
  const [pos, setPos] = useState(58); // reveal %, starts mostly showing result
  const frameRef = useRef(null);

  const setFromClientX = (clientX) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, p)));
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (e.buttons !== 1) return;
    setFromClientX(e.clientX);
  };

  return (
    <figure
      ref={frameRef}
      className="group relative aspect-[3/4] w-[76vw] max-w-[360px] shrink-0 overflow-hidden rounded-token ring-1 ring-stroke shadow-lift sm:w-[360px]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      {/* AFTER (result video) — full bleed underneath */}
      <div className="absolute inset-0">
        <SmartVideo
          videoSrc={videoSrc}
          poster={stillSrc}
          className="h-full w-full"
          ariaLabel={`${label} — animated result`}
        />
      </div>

      {/* BEFORE (still) — clipped to the left of the divider */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <div
          className="h-full w-full bg-cover bg-center grayscale-[0.15]"
          style={{
            backgroundImage: stillSrc ? `url(${stillSrc})` : undefined,
            background: stillSrc
              ? undefined
              : 'linear-gradient(160deg,#1c1c22,#0a0a0b)',
          }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-lo backdrop-blur">
          Before
        </span>
      </div>

      {/* Divider handle */}
      <div
        className="absolute inset-y-0 z-10 w-px bg-accent/80"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-black shadow-glow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M8 7l-4 5 4 5M16 7l4 5-4 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* One-word verb label */}
      <figcaption className="pointer-events-none absolute bottom-4 left-4 z-10">
        <span className="font-display rounded-full bg-black/45 px-3 py-1.5 text-lg font-semibold text-text-hi backdrop-blur">
          {label}.
        </span>
      </figcaption>
    </figure>
  );
}
