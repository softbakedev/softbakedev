import React from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

type VelocityTapeProps = {
  items: string[];
  separator?: string;
  className?: string;
  /** Base speed in % of one copy per second. */
  baseSpeed?: number;
};

/**
 * Marquee strip that drifts slowly on its own, speeds up with scroll speed
 * and flips direction when the page is scrolled up.
 */
export function VelocityTape({ items, separator = '★', className = '', baseSpeed = 2 }: VelocityTapeProps) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const direction = React.useRef(-1);

  // Four copies sit side by side; wrapping within one copy (25%) keeps the loop seamless.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const factor = velocityFactor.get();
    if (factor < 0) direction.current = 1;
    else if (factor > 0) direction.current = -1;
    const move = direction.current * baseSpeed * (delta / 1000) * (1 + Math.abs(factor));
    baseX.set(baseX.get() + move);
  });

  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-4">{item}</span>
          <span aria-hidden>{separator}</span>
        </span>
      ))}
    </span>
  );

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-hidden>
      <motion.div className="inline-flex" style={{ x }}>
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
}
