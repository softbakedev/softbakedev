import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChefHat, DrawnFace, FACE_RX, type Person } from './DrawnFaces';

const INK = '#111111';
const ORANGE = '#FF8A4C';

type Prop = 'rollingPin' | 'whisk';

type BobbleheadProps = {
  /** Whose hand-drawn caricature face to show. */
  person: Person;
  /** Any CSS colour, including var(--sb-…) tokens. */
  background: string;
  apron: string;
  prop: Prop;
  label: string;
};

const HEAD_X = 200;
const HEAD_Y = 138;
const HEAD_SCALE = 1.08;
const NECK = { x: 200, y: 214 };

function Body({ apron }: { apron: string }) {
  // Small chef body, drawn at full size then scaled down around the bottom centre.
  return (
    <g transform="translate(200 300) scale(0.62) translate(-200 -300)">
      <path d="M86 300 C90 228 128 198 172 190 L228 190 C272 198 310 228 314 300 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M172 190 L200 224 L228 190" fill="#f3ece6" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M146 216 L254 216 L268 300 L132 300 Z" style={{ fill: apron }} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M146 216 L174 194 M254 216 L226 194" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <rect x={176} y={250} width={48} height={30} rx={5} fill="rgba(255,255,255,.4)" stroke={INK} strokeWidth={3.5} />
      <g fill="#fff" stroke={INK} strokeWidth={3}>
        <circle cx={116} cy={252} r={5} />
        <circle cx={112} cy={278} r={5} />
        <circle cx={284} cy={252} r={5} />
        <circle cx={288} cy={278} r={5} />
      </g>
    </g>
  );
}

function PropArt({ prop }: { prop: Prop }) {
  if (prop === 'rollingPin') {
    return (
      <g transform="rotate(-6 200 262)">
        <rect x={132} y={254} width={136} height={18} rx={9} fill="#E9B27A" stroke={INK} strokeWidth={4} />
        <rect x={112} y={257} width={24} height={12} rx={6} fill={ORANGE} stroke={INK} strokeWidth={3.5} />
        <rect x={264} y={257} width={24} height={12} rx={6} fill={ORANGE} stroke={INK} strokeWidth={3.5} />
      </g>
    );
  }
  return (
    <g transform="rotate(18 262 236)">
      <rect x={258} y={238} width={9} height={40} rx={4} fill={ORANGE} stroke={INK} strokeWidth={3.5} />
      <g fill="none" stroke={INK} strokeWidth={3.5}>
        <ellipse cx={262} cy={214} rx={12} ry={26} />
        <ellipse cx={262} cy={214} rx={5} ry={26} />
      </g>
    </g>
  );
}

/**
 * Sticker-style bobblehead: a hand-drawn caricature of the person on a cartoon chef body,
 * mounted on a spring. The head wobbles gently and bobbles harder on hover or tap.
 */
export function Bobblehead({ person, background, apron, prop, label }: BobbleheadProps) {
  const reduce = useReducedMotion();
  const [excited, setExcited] = React.useState(false);

  const wobble = excited
    ? { rotate: [-9, 9, -9], y: [2, -5, 2], transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' as const } }
    : { rotate: [-3, 3, -3], y: 0, transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' as const } };

  return (
    <motion.svg
      viewBox="0 0 400 300"
      role="img"
      aria-label={label}
      className="block h-full w-full"
      onHoverStart={() => setExcited(true)}
      onHoverEnd={() => setExcited(false)}
      onTapStart={() => setExcited(true)}
      onTap={() => window.setTimeout(() => setExcited(false), 1200)}
    >
      {/* flat brand background with a faint grid */}
      <rect width={400} height={300} style={{ fill: background }} />
      <g stroke="rgba(17,17,17,.08)" strokeWidth={1}>
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`v${i}`} x1={i * 28} y1={0} x2={i * 28} y2={300} />
        ))}
        {Array.from({ length: 11 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 28} x2={400} y2={i * 28} />
        ))}
      </g>

      {/* cake stand, body, spring and prop */}
      <ellipse cx={200} cy={296} rx={120} ry={16} fill="#fff" stroke={INK} strokeWidth={5} />
      <Body apron={apron} />
      <path
        d="M200 212 l-10 5 l20 5 l-20 5 l20 5 l-20 5 l10 4"
        fill="none"
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <PropArt prop={prop} />

      {/* the bobbling head pivots on the top of the spring */}
      <motion.g
        animate={reduce ? undefined : wobble}
        style={{ transformBox: 'view-box', transformOrigin: `${NECK.x}px ${NECK.y}px` }}
      >
        <g transform={`translate(${HEAD_X} ${HEAD_Y}) scale(${HEAD_SCALE})`}>
          <DrawnFace person={person} />
          <ChefHat rx={FACE_RX[person]} />
        </g>
      </motion.g>
    </motion.svg>
  );
}
