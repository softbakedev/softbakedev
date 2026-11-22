import React from 'react';
import { AnimatePresence, animate, motion, useReducedMotion } from 'motion/react';

const INK = '#111111';
const ORANGE = '#FF8A4C';
const YELLOW = '#FFE14D';
const PAPER = '#FFF6EE';

function format(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.max(0, Math.floor(totalSeconds % 60));
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Reads "6 min read", "6 min" or "6" into minutes; null when there is no number. */
export function parseMinutes(readTime: string) {
  const match = readTime.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

type OvenTimerProps = {
  readTime: string;
  /** When true the microwave runs: the display counts down, the window glows and the dish spins. */
  running: boolean;
  className?: string;
};

/**
 * Sticker-style microwave whose display shows the recipe's read time.
 * While running it "bakes" the recipe: counts down to 0:00 and rings.
 */
export function OvenTimer({ readTime, running, className }: OvenTimerProps) {
  const reduce = useReducedMotion();
  const minutes = parseMinutes(readTime);
  const total = minutes ? Math.round(minutes * 60) : 0;
  const [seconds, setSeconds] = React.useState(total);
  const [done, setDone] = React.useState(false);
  const active = running && !reduce && total > 0;

  React.useEffect(() => {
    setDone(false);
    if (!active) {
      setSeconds(total);
      return;
    }
    const controls = animate(total, 0, {
      duration: 1.8,
      ease: [0.3, 0, 0.6, 1],
      onUpdate: (v) => setSeconds(v),
      onComplete: () => setDone(true),
    });
    return () => controls.stop();
  }, [active, total]);

  const display = minutes ? format(seconds) : 'SOON';
  const glowing = active && !done;

  return (
    <span className={`relative inline-block ${className ?? ''}`} role="img" aria-label={`Oven timer: ${readTime}`}>
      <svg viewBox="0 0 124 82" className="block h-auto w-full overflow-visible" aria-hidden>
        {/* body + hard shadow */}
        <rect x="6" y="6" width="114" height="66" rx="10" fill={INK} />
        <rect x="2" y="2" width="114" height="66" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
        {/* feet */}
        <rect x="14" y="70" width="12" height="6" rx="2" fill={INK} />
        <rect x="92" y="70" width="12" height="6" rx="2" fill={INK} />

        {/* door window */}
        <motion.rect
          x="10"
          y="10"
          width="68"
          height="50"
          rx="7"
          stroke={INK}
          strokeWidth="3"
          animate={{ fill: glowing ? YELLOW : PAPER }}
          transition={{ duration: 0.3 }}
        />
        {glowing ? (
          <motion.rect
            x="12"
            y="12"
            width="64"
            height="46"
            rx="6"
            fill={ORANGE}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.45, 0.15] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        ) : null}

        {/* turntable + bun */}
        <ellipse cx="44" cy="50" rx="24" ry="4.5" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <motion.g
          animate={glowing ? { x: [0, 7, 0, -7, 0], scaleX: [1, 0.75, 1, 0.75, 1] } : { x: 0, scaleX: 1 }}
          transition={glowing ? { duration: 0.9, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
          style={{ transformOrigin: '44px 44px', transformBox: 'view-box' }}
        >
          <path d="M32 48 Q32 33 44 33 Q56 33 56 48 Z" fill={ORANGE} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M38 40 l3 -3 M44 39 l3 -3" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        {/* door handle */}
        <rect x="80" y="14" width="3.5" height="42" rx="1.75" fill={INK} />

        {/* control panel: display */}
        <rect x="88" y="10" width="24" height="15" rx="3" fill={INK} />
        <text
          x="100"
          y="21"
          textAnchor="middle"
          fontFamily="ui-monospace, 'DM Mono', Menlo, monospace"
          fontSize={minutes ? 9 : 7.5}
          fontWeight="700"
          fill={done ? YELLOW : ORANGE}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {display}
        </text>
        {/* buttons */}
        {[0, 1, 2].map((row) =>
          [0, 1].map((col) => (
            <rect key={`${row}-${col}`} x={90 + col * 11} y={30 + row * 7} width="8" height="4.5" rx="1.5" fill="#fff" stroke={INK} strokeWidth="1.8" />
          )),
        )}
        {/* dial */}
        <motion.g
          animate={{ rotate: glowing ? 300 : 0 }}
          transition={glowing ? { duration: 1.8, ease: 'linear' } : { type: 'spring', stiffness: 300, damping: 14 }}
          style={{ transformOrigin: '100px 59px', transformBox: 'view-box' }}
        >
          <circle cx="100" cy="59" r="6" fill={YELLOW} stroke={INK} strokeWidth="2.5" />
          <line x1="100" y1="59" x2="100" y2="54" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>
      </svg>

      <AnimatePresence>
        {done && running ? (
          <motion.span
            key="ding"
            initial={{ scale: 0, rotate: -30, y: 6 }}
            animate={{ scale: 1, rotate: -10, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 12 }}
            className="sb-display absolute -right-3 -top-5 rounded-lg border-[2.5px] border-[var(--sb-ink)] bg-[var(--sb-yellow)] px-1.5 pt-1 text-[11px] leading-none shadow-[2px_2px_0_var(--sb-ink)]"
            aria-hidden
          >
            Ding!
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
