import React from 'react';
import { motion, useReducedMotion, type MotionValue, type Variants } from 'motion/react';

const INK = '#111111';
const ORANGE = '#FF8A4C';
const PAPER = '#FFF6EE';
const YELLOW = '#FFE14D';

/** Union of every shape; drawn thick behind the art for the shadow and the white die-cut edge. */
function Silhouette() {
  return (
    <>
      <circle cx="72" cy="62" r="22" />
      <circle cx="100" cy="46" r="27" />
      <circle cx="128" cy="62" r="22" />
      <rect x="64" y="70" width="72" height="30" rx="5" />
      <rect x="38" y="104" width="124" height="74" rx="16" />
      <rect x="26" y="126" width="20" height="30" rx="7" />
      <rect x="154" y="126" width="20" height="30" rx="7" />
    </>
  );
}

function HatSilhouette() {
  return (
    <>
      <circle cx="72" cy="62" r="22" />
      <circle cx="100" cy="46" r="27" />
      <circle cx="128" cy="62" r="22" />
      <rect x="64" y="70" width="72" height="30" rx="5" />
    </>
  );
}

const hatVariants: Variants = {
  idle: {
    y: [0, -4, -4, 0],
    rotate: [0, -3, 2, 0],
    transition: { duration: 3.2, times: [0, 0.45, 0.55, 1], repeat: Infinity, ease: 'easeInOut' },
  },
  hop: {
    y: [0, -24, 2, 0],
    rotate: [0, -12, 4, 0],
    transition: { duration: 0.7, times: [0, 0.35, 0.7, 1], ease: 'easeOut' },
  },
  still: { y: 0, rotate: 0 },
};

type LogoProps = {
  /** "sticker" adds the white die-cut edge; "icon" is the simplified small-size version. */
  variant?: 'sticker' | 'icon';
  className?: string;
  title?: string;
  /** Optional extra hat rotation in degrees, e.g. driven by scroll speed. */
  hatTilt?: MotionValue<number>;
};

/**
 * softbake "Chef Window" mark: a chef hat sitting on a code window.
 * The hat bobs while idle and hops when the logo is hovered or tapped.
 */
export function Logo({ variant = 'sticker', className, title = 'softbake.dev', hatTilt }: LogoProps) {
  const reduce = useReducedMotion();
  const small = variant === 'icon';
  const [hopKey, setHopKey] = React.useState(0);

  return (
    <motion.svg
      viewBox="0 0 200 200"
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={className}
      initial="rest"
      whileHover={reduce ? undefined : 'hover'}
      onHoverStart={() => !reduce && setHopKey((k) => k + 1)}
      onTap={() => !reduce && setHopKey((k) => k + 1)}
      style={{ overflow: 'visible' }}
    >
      <motion.g
        variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -4, scale: 1.04 } }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
        style={{ transformOrigin: '50% 50%', transformBox: 'fill-box' }}
      >
        <g transform="translate(8 8)" fill={INK} stroke={INK} strokeWidth={small ? 16 : 26} strokeLinejoin="round">
          <Silhouette />
        </g>
        {small ? null : (
          <g fill="#fff" stroke="#fff" strokeWidth={26} strokeLinejoin="round">
            <Silhouette />
          </g>
        )}

        <g stroke={INK} strokeWidth={7}>
          <rect x="26" y="126" width="20" height="30" rx="7" fill={YELLOW} />
          <rect x="154" y="126" width="20" height="30" rx="7" fill={YELLOW} />
          <rect x="38" y="104" width="124" height="74" rx="16" fill={ORANGE} />
        </g>
        <rect x="54" y="118" width="92" height="46" rx="8" fill={PAPER} stroke={INK} strokeWidth={6} />
        {small ? (
          <g stroke={INK} strokeWidth={8} strokeLinecap="round">
            <line x1="67" y1="132" x2="104" y2="132" />
            <line x1="67" y1="148" x2="128" y2="148" />
          </g>
        ) : (
          <>
            <g stroke={INK} strokeWidth={6} strokeLinecap="round">
              <line x1="66" y1="131" x2="104" y2="131" />
              <line x1="66" y1="142" x2="124" y2="142" />
              <line x1="66" y1="153" x2="94" y2="153" />
            </g>
            <motion.rect
              x="100"
              y="148"
              width="8"
              height="10"
              rx="1.5"
              fill={ORANGE}
              animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity }}
            />
          </>
        )}

        <motion.g style={{ rotate: hatTilt, transformOrigin: '50% 100%', transformBox: 'fill-box' }}>
        <motion.g
          key={hopKey}
          variants={hatVariants}
          initial={false}
          animate={reduce ? 'still' : hopKey === 0 ? 'idle' : 'hop'}
          onAnimationComplete={(definition) => {
            if (definition === 'hop') setHopKey(0);
          }}
          style={{ transformOrigin: '50% 100%', transformBox: 'fill-box' }}
        >
          <g fill={INK} stroke={INK} strokeWidth={14} strokeLinejoin="round">
            <HatSilhouette />
          </g>
          <g fill="#fff">
            <circle cx="72" cy="62" r="22" />
            <circle cx="100" cy="46" r="27" />
            <circle cx="128" cy="62" r="22" />
          </g>
          {small ? null : (
            <path d="M86 40q6-8 16-6" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          )}
          <rect x="64" y="72" width="72" height="28" rx="5" fill="#fff" stroke={INK} strokeWidth={7} />
          <line x1="80" y1="86" x2="120" y2="86" stroke={ORANGE} strokeWidth={6} strokeLinecap="round" />
        </motion.g>
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}
