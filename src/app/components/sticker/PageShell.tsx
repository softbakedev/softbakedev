import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';

type BackLink = { to: string; label: string };

type PageShellProps = {
  /** Small sticker label above the title. */
  chip: React.ReactNode;
  chipColor?: string;
  title: string;
  intro?: React.ReactNode;
  /** Background colour of the top band (a brand token). */
  band?: string;
  backLinks?: BackLink[];
  /** Extra content under the intro in the band (search box, meta chips…). */
  bandExtra?: React.ReactNode;
  children: React.ReactNode;
  /** Width of the content column. */
  width?: 'narrow' | 'wide';
};

/**
 * Shared layout for every page that isn't the homepage: a coloured sticker band
 * with back links, chip, big display title and intro, then the page content on paper.
 */
export function PageShell({
  chip,
  chipColor = '#fff',
  title,
  intro,
  band = 'var(--sb-yellow)',
  backLinks = [{ to: '/', label: 'Back to bakery' }],
  bandExtra,
  children,
  width = 'narrow',
}: PageShellProps) {
  const reduce = useReducedMotion();
  const words = title.split(' ');
  const container = width === 'wide' ? 'max-w-7xl' : 'max-w-4xl';

  return (
    <main>
      <section className="sb-grid-bg border-b-[3px] border-[var(--sb-ink)] pb-12 pt-32 sm:pb-16 sm:pt-36" style={{ background: band }}>
        <div className={`mx-auto ${container} px-4 sm:px-6 lg:px-8`}>
          <nav aria-label="Back" className="mb-8 flex flex-wrap gap-3">
            {backLinks.map((link) => (
              <Link key={link.to} to={link.to} className="sb-chip sb-focus transition-transform hover:-translate-x-1">
                <ArrowLeft className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <motion.span
            initial={reduce ? false : { scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 420, damping: 14 }}
            className="sb-chip mb-5 text-xs uppercase tracking-[0.1em]"
            style={{ background: chipColor }}
          >
            {chip}
          </motion.span>

          <h1 className="sb-display text-[2.6rem] sm:text-6xl lg:text-7xl [text-wrap:balance]">
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="mr-[0.25em] inline-block"
                initial={reduce ? false : { y: 40, rotate: i % 2 ? 6 : -6, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.1 + i * 0.06 }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {intro ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.3 }}
              className="mt-6 max-w-3xl text-lg font-medium leading-relaxed text-[#2a2421]"
            >
              {intro}
            </motion.div>
          ) : null}

          {bandExtra ? <div className="mt-8">{bandExtra}</div> : null}
        </div>
      </section>

      <div className="sb-grid-bg overflow-x-clip bg-[var(--sb-paper)] py-14 sm:py-20">
        <div className={`mx-auto ${container} px-4 sm:px-6 lg:px-8`}>{children}</div>
      </div>
    </main>
  );
}
