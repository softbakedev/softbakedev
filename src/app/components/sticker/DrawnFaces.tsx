import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/*
 * Hand-drawn caricature faces of the two founders, in head-local coordinates
 * (face centred at 0,0). Each face keeps the features people recognise first:
 *  - Daniel: dark rectangular glasses, straight brows, long nose, short trimmed beard, calm smile.
 *  - Jan: round wide face, big open grin, arched brows, smile lines, rosy cheeks, full dark beard.
 */

const INK = '#111111';
const ORANGE = '#FF8A4C';
const SW = 5; // outline width
const EX = 1.18; // caricature exaggeration of the signature features

export type Person = 'daniel' | 'jan';

/** Half-width of each face, used to size the chef hat to the head. */
export const FACE_RX: Record<Person, number> = { daniel: 45, jan: 52 };

/** Eyes blink every few seconds (skipped with reduced motion). */
function Blink({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.g
      animate={reduce ? undefined : { scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 4.5, times: [0, 0.94, 0.96, 1], repeat: Infinity }}
      style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}
    >
      {children}
    </motion.g>
  );
}

function DanielFace() {
  const c = { skin: '#E3A27F', shade: '#C9805E', hair: '#3A271C', beard: '#4B3224', beardDark: '#2E1E15', lips: '#B86E58' };
  return (
    <>
      <ellipse cx={-45} cy={0} rx={7} ry={11} fill={c.skin} stroke={INK} strokeWidth={SW} />
      <ellipse cx={45} cy={0} rx={7} ry={11} fill={c.skin} stroke={INK} strokeWidth={SW} />
      <ellipse cx={0} cy={2} rx={45} ry={54} fill={c.skin} stroke={INK} strokeWidth={SW} />
      <path d="M16 -44 C40 -34 47 0 42 20 C36 4 28 -20 16 -44Z" fill={c.shade} opacity={0.5} />
      <path d="M-44 -40 q-2 14 2 26 l6 0 q-3 -12 -1 -26z M44 -40 q2 14 -2 26 l-6 0 q3 -12 1 -26z" fill={c.hair} />
      {/* short trimmed beard along the jaw, thicker at the chin */}
      <path
        d="M-45 -6 C-46 28 -24 56 0 56 C24 56 46 28 45 -6 L39 -6 C39 8 31 15 20 16 L-20 16 C-31 15 -39 8 -39 -6 Z"
        fill={c.beard}
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <path d="M-26 40 C-16 50 -6 53 6 53" fill="none" stroke={c.beardDark} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <path d="M-20 18 Q-9 10 0 13 Q9 10 20 18 Q9 21 0 19 Q-9 21 -20 18Z" fill={c.beardDark} />
      <path d="M-10 25 Q0 31 10 25 Q0 28 -10 25Z" fill={c.lips} stroke={INK} strokeWidth={SW * 0.5} strokeLinejoin="round" />
      <path d={`M-1 -12 L-4 7 Q0 ${11 * EX} 7 7`} fill="none" stroke={INK} strokeWidth={SW * 0.8} strokeLinecap="round" strokeLinejoin="round" />
      <Blink>
        <path d="M-31 -11 Q-22 -18 -13 -11 Q-22 -6 -31 -11Z" fill="#fff" stroke={INK} strokeWidth={SW * 0.55} />
        <circle cx={-22} cy={-11.5} r={4.2} fill="#4A3020" />
        <circle cx={-22} cy={-11.5} r={1.9} fill={INK} />
        <circle cx={-20.6} cy={-13} r={1} fill="#fff" />
        <path d="M13 -11 Q22 -18 31 -11 Q22 -6 13 -11Z" fill="#fff" stroke={INK} strokeWidth={SW * 0.55} />
        <circle cx={22} cy={-11.5} r={4.2} fill="#4A3020" />
        <circle cx={22} cy={-11.5} r={1.9} fill={INK} />
        <circle cx={23.4} cy={-13} r={1} fill="#fff" />
      </Blink>
      <path d="M-37 -28 L-8 -26 M8 -26 L37 -28" stroke={c.hair} strokeWidth={7} strokeLinecap="round" />
      {/* the signature glasses, drawn a little larger than life */}
      <g
        transform={`translate(0 -12) scale(${EX}) translate(0 12)`}
        fill="rgba(255,255,255,.22)"
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      >
        <rect x={-39} y={-21} width={33} height={19} rx={4} />
        <rect x={6} y={-21} width={33} height={19} rx={4} />
        <path d="M-6 -14 Q0 -17 6 -14 M-39 -16 L-46 -18 M39 -16 L46 -18" fill="none" />
      </g>
      <path d="M-34 -18 l6 0 M11 -18 l6 0" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
    </>
  );
}

function JanFace() {
  const c = { skin: '#EDB28C', shade: '#D88E68', hair: '#2A1B13', beard: '#2E1F16', beardDark: '#1B120C', lips: '#8E3A33', cheek: '#F08C7A' };
  return (
    <>
      <ellipse cx={-52} cy={-2} rx={7} ry={11} fill={c.skin} stroke={INK} strokeWidth={SW} />
      <ellipse cx={52} cy={-2} rx={7} ry={11} fill={c.skin} stroke={INK} strokeWidth={SW} />
      <ellipse cx={0} cy={2} rx={52 * 1.05} ry={54} fill={c.skin} stroke={INK} strokeWidth={SW} />
      <path d="M20 -44 C48 -32 54 0 48 18 C40 2 32 -22 20 -44Z" fill={c.shade} opacity={0.5} />
      <path d="M-51 -40 q-3 11 1 22 l7 0 q-3 -11 -1 -22z M51 -40 q3 11 -1 22 l-7 0 q3 -11 1 -22z" fill={c.hair} />
      <ellipse cx={-31} cy={4} rx={10 * EX} ry={6.5 * EX} fill={c.cheek} opacity={0.6} />
      <ellipse cx={31} cy={4} rx={10 * EX} ry={6.5 * EX} fill={c.cheek} opacity={0.6} />
      {/* full beard from the temples, wrapping round the jaw */}
      <path
        d="M-52 -10 C-54 30 -28 58 0 58 C28 58 54 30 52 -10 L45 -10 C45 8 36 15 24 15 L-24 15 C-36 15 -45 8 -45 -10 Z"
        fill={c.beard}
        stroke={INK}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      {/* the big grin, drawn a little wider than life */}
      <g transform={`translate(0 20) scale(${EX}) translate(0 -20)`}>
        <path d="M-21 17 Q0 40 21 17 Q0 23 -21 17Z" fill={c.lips} stroke={INK} strokeWidth={SW * 0.7} strokeLinejoin="round" />
        <path d="M-18 19 Q0 24 18 19 L16 24 Q0 28 -16 24Z" fill="#fff" />
        <path d="M-24 15 Q-11 6 0 10 Q11 6 24 15 Q11 19 0 17 Q-11 19 -24 15Z" fill={c.beardDark} />
      </g>
      <path d="M-2 -10 Q-7 2 -8 5 Q-3 10 0 8 Q3 10 8 5" fill="none" stroke={INK} strokeWidth={SW * 0.75} strokeLinecap="round" />
      <Blink>
        <path d="M-32 -12 Q-22 -21 -11 -12 Q-22 -7 -32 -12Z" fill="#fff" stroke={INK} strokeWidth={SW * 0.6} />
        <circle cx={-21} cy={-13} r={4.6} fill="#6B4226" />
        <circle cx={-21} cy={-13} r={2} fill={INK} />
        <circle cx={-19.6} cy={-14.6} r={1} fill="#fff" />
        <path d="M11 -12 Q22 -21 32 -12 Q22 -7 11 -12Z" fill="#fff" stroke={INK} strokeWidth={SW * 0.6} />
        <circle cx={21} cy={-13} r={4.6} fill="#6B4226" />
        <circle cx={21} cy={-13} r={2} fill={INK} />
        <circle cx={22.4} cy={-14.6} r={1} fill="#fff" />
      </Blink>
      <path
        d="M-31 -6 Q-22 -2 -12 -6 M12 -6 Q22 -2 31 -6 M-36 -15 l-5 -2 M-36 -11 l-5 1 M36 -15 l5 -2 M36 -11 l5 1"
        fill="none"
        stroke={INK}
        strokeWidth={SW * 0.5}
        strokeLinecap="round"
      />
      <path d="M-37 -23 Q-24 -35 -9 -26 M9 -26 Q24 -35 37 -23" fill="none" stroke={c.hair} strokeWidth={8} strokeLinecap="round" />
    </>
  );
}

/** Chef hat sized to the head: the band is as wide as the face and rests on the forehead. */
export function ChefHat({ rx }: { rx: number }) {
  const w = rx * 2 + 8;
  const x = -w / 2;
  const y = -62;
  const h = 24;
  const r1 = w * 0.25;
  const r2 = w * 0.31;
  const puffs = (fill: string, stroke?: string, strokeWidth?: number) => (
    <g fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round">
      <circle cx={-w * 0.28} cy={y - r1 * 0.55} r={r1} />
      <circle cx={0} cy={y - r2 * 0.85} r={r2} />
      <circle cx={w * 0.28} cy={y - r1 * 0.55} r={r1} />
    </g>
  );
  return (
    <>
      {puffs(INK, INK, 10)}
      {puffs('#fff')}
      <path
        d={`M${-r2 * 0.45} ${y - r2 * 1.45} q${r2 * 0.25} ${-r2 * 0.3} ${r2 * 0.6} ${-r2 * 0.2}`}
        fill="none"
        stroke={INK}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path d={`M${x} ${y} H${-x} V${y + h} Q0 ${y + h + 9} ${x} ${y + h} Z`} fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <line x1={x * 0.55} y1={y + h / 2 + 1} x2={-x * 0.55} y2={y + h / 2 + 1} stroke={ORANGE} strokeWidth={5} strokeLinecap="round" />
    </>
  );
}

export function DrawnFace({ person }: { person: Person }) {
  return person === 'daniel' ? <DanielFace /> : <JanFace />;
}
