import { useMemo } from 'react';

/** A brief, tasteful confetti burst. Respects reduced-motion (renders nothing). */
export default function Confetti({ count = 36 }) {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 0.8 + Math.random() * 0.7,
        size: 5 + Math.random() * 7,
        color: ['#C8FF3D', '#FF7A45', '#F5F5F7'][i % 3],
        rotate: Math.random() * 360,
      })),
    [count]
  );

  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {bits.map((b) => (
        <span
          key={b.id}
          style={{
            position: 'absolute',
            bottom: '38%',
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            background: b.color,
            borderRadius: b.id % 2 ? '2px' : '50%',
            transform: `rotate(${b.rotate}deg)`,
            animation: `confetti ${b.duration}s cubic-bezier(0.16,1,0.3,1) ${b.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
