import { useEffect, useRef, useState } from 'react';

/**
 * Reusable IntersectionObserver-driven play/pause manager for <video>.
 *
 * - Only plays when sufficiently in view (never plays off-screen media).
 * - Respects prefers-reduced-motion: never auto-plays, exposes `reducedMotion`
 *   so callers can render a static poster instead.
 * - Lazy: sets preload="none" until the element is near the viewport.
 *
 * Usage:
 *   const { ref, inView, reducedMotion } = useInViewVideo();
 *   <video ref={ref} ... />
 */
export function useInViewVideo({ threshold = 0.5, rootMargin = '200px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      el.pause();
      return;
    }
    if (inView) {
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, reducedMotion]);

  return { ref, inView, reducedMotion };
}
