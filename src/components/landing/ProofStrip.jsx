import BeforeAfter from './BeforeAfter';
import { proofPairs } from '../../config/media';

/**
 * 2B. "Show, don't tell" cinematic proof strip.
 * A horizontally snapping sequence of before→after pairs that PLAY.
 * Only in-view videos run (SmartVideo + IntersectionObserver).
 */
export default function ProofStrip() {
  return (
    <section id="proof" className="relative border-t border-stroke py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Watch it happen
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold text-text-hi sm:text-5xl">
            One still. Then it moves.
          </h2>
          <p className="mt-4 text-text-lo">
            Drag any card to wipe between the photo you upload and the Reel you get back.
          </p>
        </div>
      </div>

      <div
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:gap-7 sm:px-8"
        role="list"
        aria-label="Before and after examples"
      >
        {/* leading spacer so first card can center-snap on wide screens */}
        <div className="hidden shrink-0 sm:block sm:w-[calc((100vw-1280px)/2)]" aria-hidden="true" />
        {proofPairs.map((pair) => (
          <div key={pair.label} role="listitem" className="snap-center">
            <BeforeAfter {...pair} />
          </div>
        ))}
        <div className="shrink-0 pr-3 sm:pr-8" aria-hidden="true" />
      </div>
    </section>
  );
}
