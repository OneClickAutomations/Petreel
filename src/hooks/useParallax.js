import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight scroll parallax. Returns a ref + the translateY (px) to apply to
 * a layer, moving it at `speed` relative to scroll. Disabled under
 * prefers-reduced-motion. rAF-throttled so it stays cheap.
 */
export function useParallax(speed = 0.3) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const viewCenter = window.innerHeight / 2;
          const dist = rect.top + rect.height / 2 - viewCenter;
          setOffset(-dist * speed);
        }
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return { ref, offset };
}
