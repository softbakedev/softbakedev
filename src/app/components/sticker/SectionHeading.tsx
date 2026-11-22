import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

type SectionHeadingProps = {
  chip: React.ReactNode;
  chipColor?: string;
  title: string;
  highlight?: string;
  highlightColor?: string;
  children?: React.ReactNode;
  align?: 'left' | 'center';
};

/** Chip + giant display title where each word springs in like a sticker being slapped on. */
export function SectionHeading({
  chip,
  chipColor = 'var(--sb-yellow)',
  title,
  highlight,
  highlightColor = 'var(--sb-orange)',
  children,
  align = 'center',
}: SectionHeadingProps) {
  const reduce = useReducedMotion();
  const words = title.split(' ');
  const centered = align === 'center';

  return (
    <div className={`relative z-10 mb-12 ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}`}>
      <motion.span
        initial={reduce ? false : { scale: 0, rotate: -20 }}
        whileInView={{ scale: 1, rotate: -3 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 420, damping: 14 }}
        className="sb-chip mb-5"
        style={{ background: chipColor }}
      >
        {chip}
      </motion.span>
      <h2 className="sb-display text-[2.6rem] sm:text-6xl lg:text-7xl [text-wrap:balance]">
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            className="mr-[0.25em] inline-block"
            initial={reduce ? false : { y: 40, rotate: i % 2 ? 6 : -6, opacity: 0 }}
            whileInView={{ y: 0, rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 380, damping: 16, delay: i * 0.06 }}
          >
            {word}
          </motion.span>
        ))}
        {highlight ? (
          <motion.span
            className="mt-2 inline-block rounded-2xl border-[3px] border-[var(--sb-ink)] px-3 pb-1 pt-2 shadow-[5px_5px_0_var(--sb-ink)]"
            style={{ background: highlightColor }}
            initial={reduce ? false : { scale: 0.4, rotate: 8, opacity: 0 }}
            whileInView={{ scale: 1, rotate: -2, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 12, delay: words.length * 0.06 + 0.05 }}
          >
            {highlight}
          </motion.span>
        ) : null}
      </h2>
      {children ? <div className="mt-6 text-lg font-medium leading-relaxed text-[#3a332f]">{children}</div> : null}
    </div>
  );
}
