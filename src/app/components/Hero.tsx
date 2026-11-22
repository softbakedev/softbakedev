import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChefHat } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Tape } from './sticker/Tape';

/** What we bake, matching the categories of our shipped Goods. */
const products = ['software.', 'web apps.', 'AI agents.', 'mobile apps.', 'cloud setups.'];

/** Second headline line: a sticker label whose word flips through what we build. */
function RotatingWord({ reduce }: { reduce: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % products.length), 2200);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <motion.span
      layout
      aria-hidden
      initial={reduce ? false : { scale: 0, rotate: 12 }}
      animate={{ scale: 1, rotate: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18, delay: reduce ? 0 : 0.6 }}
      className="mt-3 inline-flex overflow-hidden rounded-2xl border-[3px] border-[var(--sb-ink)] bg-[var(--sb-yellow)] px-3 pb-1 pt-3 text-[2.1rem] shadow-[6px_6px_0_var(--sb-ink)] [perspective:600px] sm:px-5 sm:text-[4.4rem] lg:text-[6rem]"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={products[index]}
          className="inline-block whitespace-nowrap"
          initial={{ rotateX: -90, y: '40%', opacity: 0 }}
          animate={{ rotateX: 0, y: 0, opacity: 1 }}
          exit={{ rotateX: 90, y: '-40%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{ transformOrigin: '50% 50%' }}
        >
          {products[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

const stickers = [
  {
    id: 'checked',
    label: (
      <>
        100%
        <br />
        human
        <br />
        checked
      </>
    ),
    className:
      'right-[4%] top-[18%] hidden h-28 w-28 rounded-full sm:grid bg-[var(--sb-sky)] text-sm sm:h-36 sm:w-36 sm:text-base lg:right-[8%] lg:top-[22%]',
    rotate: '-10deg',
  },
  {
    id: 'agents',
    label: '30+ baker agents',
    className: 'right-[30%] top-[58%] hidden rounded-xl bg-[var(--sb-yellow)] px-4 py-2 text-base lg:grid',
    rotate: '8deg',
  },
  {
    id: 'fresh',
    label: '✦ fresh daily',
    className: 'right-[6%] top-[66%] hidden rounded-full bg-white px-4 py-2 text-sm lg:grid',
    rotate: '-4deg',
  },
  {
    id: 'years',
    label: '8+ years baking',
    className: 'right-[22%] top-[30%] hidden rounded-xl bg-[var(--sb-pink)] px-4 py-2 text-sm xl:grid',
    rotate: '5deg',
  },
];

export function Hero() {
  const reduce = useReducedMotion();
  const constraintsRef = useRef<HTMLElement>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <section
      ref={constraintsRef}
      className="sb-grid-bg relative overflow-hidden border-b-[3px] border-[var(--sb-ink)] bg-[var(--sb-orange)] pb-28 pt-32 sm:pb-36 sm:pt-40"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.span
          initial={reduce ? false : { scale: 0, rotate: -25 }}
          animate={{ scale: 1, rotate: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.15 }}
          className="sb-chip mb-6 bg-white text-[11px] uppercase tracking-[0.08em] sm:text-sm sm:tracking-[0.12em]"
        >
          <span className="h-2 w-2 rounded-full bg-[var(--sb-ink)]" />
          Faster. Leaner. Always human checked.
        </motion.span>

        <h1 className="sb-display relative z-10">
          <span className="sr-only">We bake software: web apps, AI agents, mobile apps and cloud setups.</span>
          <span className="block text-[3.4rem] sm:text-[6rem] lg:text-[8.5rem]" aria-hidden>
            {Array.from('We bake').map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className="inline-block cursor-default"
                initial={reduce ? false : { scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={reduce ? undefined : { y: -10, rotate: -6, color: '#ffffff' }}
                transition={{ type: 'spring', stiffness: 500, damping: 12, delay: reduce ? 0 : 0.25 + i * 0.04 }}
              >
                {char === ' ' ? '\u00a0' : char}
              </motion.span>
            ))}
          </span>
          <RotatingWord reduce={Boolean(reduce)} />
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.9 }}
          className="relative z-10 mt-8 flex max-w-3xl flex-col gap-6 sm:mt-10"
        >
          <p className="sb-card max-w-xl bg-[var(--sb-paper)] px-5 py-4 text-lg font-medium leading-relaxed">
            We design your product, set the timeline, and let the baker agents do the heavy build work. A human master
            chief reviews and tests every batch, so what we ship just works.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button type="button" onClick={() => scrollTo('contact')} className="sb-btn group text-lg">
              Book a kitchen tour
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button type="button" onClick={() => scrollTo('services')} className="sb-btn sb-btn--light text-lg">
              <ChefHat className="h-5 w-5" strokeWidth={2.25} />
              How we bake
            </button>
          </div>
        </motion.div>
      </div>

      {stickers.map((sticker, i) => (
        <motion.div
          key={sticker.id}
          drag={!reduce}
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          whileDrag={{ scale: 1.12, boxShadow: '10px 10px 0 #111', zIndex: 30 }}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          initial={reduce ? false : { scale: 0, rotate: 40 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 1 + i * 0.12 }}
          className={`absolute z-20 cursor-grab touch-none select-none place-items-center border-[2.5px] border-[var(--sb-ink)] text-center font-bold leading-tight shadow-[4px_4px_0_var(--sb-ink)] active:cursor-grabbing ${
            sticker.className.includes('hidden') ? '' : 'grid'
          } sb-wobble ${sticker.className}`}
          style={{ ['--sb-r' as string]: sticker.rotate }}
          title="Drag me"
        >
          <span className="block">{sticker.label}</span>
        </motion.div>
      ))}

      <Tape
        items={['Design it', 'Plan it', 'Bake it', 'Ship it']}
        className="sb-display absolute -left-[5%] -right-[5%] bottom-6 -rotate-2 border-y-[3px] border-[var(--sb-ink)] bg-[var(--sb-ink)] py-3 text-lg text-[var(--sb-yellow)] sm:text-2xl"
      />
    </section>
  );
}
