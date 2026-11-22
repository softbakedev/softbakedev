import React from 'react';

/*
 * Sticker-style illustrations for the "Freshly baked goods" cards, one per project.
 * Thick ink outlines, flat brand colours and small idle loops (see `.ga-*` in sticker.css).
 */

const INK = '#111111';
const ORANGE = '#FF8A4C';
const YELLOW = '#FFE14D';
const SKY = '#B9F2FF';
const PINK = '#FFB3D1';
const MINT = '#A7F3C5';
const PAPER = '#FFF6EE';
const FONT = "'DM Sans', ui-sans-serif, system-ui, sans-serif";

function Grid({ bg }: { bg: string }) {
  return (
    <>
      <rect width={360} height={176} fill={bg} />
      <g stroke="rgba(17,17,17,.08)" strokeWidth={1}>
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 28} y1={0} x2={i * 28} y2={176} />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 28} x2={360} y2={i * 28} />
        ))}
      </g>
    </>
  );
}

function Robot({ x, y, s = 1, color, className, style }: { x: number; y: number; s?: number; color: string; className?: string; style?: React.CSSProperties }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={className} style={style}>
        <line x1={20} y1={3} x2={20} y2={10} stroke={INK} strokeWidth={2.5} />
        <circle cx={20} cy={3} r={3} fill={ORANGE} stroke={INK} strokeWidth={2} />
        <rect x={5} y={10} width={30} height={24} rx={7} fill={color} stroke={INK} strokeWidth={2.5} />
        <rect x={10} y={16} width={20} height={10} rx={4} fill={INK} />
        <circle cx={16} cy={21} r={2} fill="#7ee2a8" />
        <circle cx={24} cy={21} r={2} fill="#7ee2a8" />
      </g>
    </g>
  );
}

function Sparkle({ x, y, r = 8, fill = '#fff', delay = 0 }: { x: number; y: number; r?: number; fill?: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        className="ga-twinkle"
        style={{ animationDelay: `${delay}s` }}
        d={`M0 ${-r} Q${r * 0.18} ${-r * 0.18} ${r} 0 Q${r * 0.18} ${r * 0.18} 0 ${r} Q${-r * 0.18} ${r * 0.18} ${-r} 0 Q${-r * 0.18} ${-r * 0.18} 0 ${-r}Z`}
        fill={fill}
        stroke={INK}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </g>
  );
}

/* 1 · Nanosandbox: agents working in isolated sandboxes */
function SandboxArt() {
  const boxes = [
    { x: 62, robot: SKY, delay: 0 },
    { x: 146, robot: PINK, delay: 0.6 },
    { x: 230, robot: MINT, delay: 1.2 },
  ];
  return (
    <>
      <Grid bg={YELLOW} />
      {boxes.map((b) => (
        <g key={b.x}>
          <rect x={b.x + 5} y={71} width={72} height={86} rx={10} fill={INK} />
          <rect x={b.x} y={66} width={72} height={86} rx={10} fill="#EAFBFF" stroke={INK} strokeWidth={4} />
          <path d={`M${b.x + 4} 142 Q${b.x + 22} 124 ${b.x + 40} 134 Q${b.x + 56} 126 ${b.x + 68} 140 L${b.x + 68} 148 L${b.x + 4} 148Z`} fill="#F2C37A" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <Robot x={b.x + 16} y={92} s={1} color={b.robot} className="ga-bob" style={{ animationDelay: `${b.delay}s` }} />
          <rect x={b.x - 5} y={56} width={82} height={14} rx={5} fill={SKY} stroke={INK} strokeWidth={4} />
          <rect x={b.x + 28} y={50} width={16} height={8} rx={3} fill={INK} />
        </g>
      ))}
      {/* "isolated" shield */}
      <g transform="translate(316 36) rotate(8)">
        <path d="M0 -24 L20 -16 V2 Q20 18 0 26 Q-20 18 -20 2 V-16Z" fill={MINT} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M-9 1 L-2 8 L10 -6" fill="none" stroke={INK} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  );
}

/* 2 · GenAI Enablement: an assistant answering in a chat window */
function GenAIArt() {
  return (
    <>
      <Grid bg={SKY} />
      <rect x={126} y={30} width={204} height={128} rx={14} fill={INK} />
      <rect x={120} y={24} width={204} height={128} rx={14} fill="#fff" stroke={INK} strokeWidth={4} />
      <path d="M120 38 a14 14 0 0 1 14 -14 h176 a14 14 0 0 1 14 14 v8 h-204z" fill={PINK} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <g fill="#fff" stroke={INK} strokeWidth={2}>
        <circle cx={136} cy={36} r={4} />
        <circle cx={148} cy={36} r={4} />
        <circle cx={160} cy={36} r={4} />
      </g>
      {/* question */}
      <g className="ga-pop" style={{ transformOrigin: '140px 72px' }}>
        <rect x={136} y={58} width={118} height={26} rx={13} fill={PAPER} stroke={INK} strokeWidth={3} />
        <rect x={148} y={68} width={70} height={6} rx={3} fill="rgba(17,17,17,.25)" />
      </g>
      {/* answer */}
      <g className="ga-pop" style={{ transformOrigin: '312px 112px', animationDelay: '0.5s' }}>
        <rect x={180} y={92} width={132} height={46} rx={14} fill={YELLOW} stroke={INK} strokeWidth={3} />
        <rect x={192} y={103} width={96} height={6} rx={3} fill="rgba(17,17,17,.35)" />
        <rect x={192} y={115} width={74} height={6} rx={3} fill="rgba(17,17,17,.35)" />
        <rect x={192} y={127} width={52} height={6} rx={3} fill="rgba(17,17,17,.35)" />
      </g>
      <Robot x={34} y={66} s={1.8} color={PINK} className="ga-bob" />
      <Sparkle x={42} y={52} r={9} fill={YELLOW} />
      <Sparkle x={108} y={70} r={7} delay={0.7} />
      <Sparkle x={96} y={142} r={6} fill={MINT} delay={1.3} />
    </>
  );
}

/* 3 · Logistics Document Digitalization: a phone scans a paper document into data */
function LogisticsArt() {
  return (
    <>
      <Grid bg={PINK} />
      {/* paper delivery note */}
      <g transform="rotate(-7 74 92)">
        <path d="M40 34 H96 L112 50 V148 H40Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M96 34 V50 H112" fill={PAPER} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <text x={50} y={62} fontFamily={FONT} fontWeight={700} fontSize={11} fill={INK}>
          CMR
        </text>
        {[74, 84, 94, 104].map((y, i) => (
          <rect key={y} x={50} y={y} width={[48, 40, 52, 34][i]} height={5} rx={2.5} fill="rgba(17,17,17,.25)" />
        ))}
        <g fill={INK}>
          {[0, 4, 6, 10, 13, 15, 19, 22, 26, 28, 32, 36, 39, 42, 46].map((x) => (
            <rect key={x} x={50 + x} y={120} width={2} height={18} />
          ))}
        </g>
      </g>
      {/* phone scanning */}
      <rect x={156} y={28} width={74} height={134} rx={16} fill={INK} />
      <rect x={150} y={22} width={74} height={134} rx={16} fill={INK} stroke={INK} strokeWidth={4} />
      <rect x={158} y={34} width={58} height={110} rx={8} fill={PAPER} />
      <rect x={166} y={48} width={42} height={58} rx={3} fill="#fff" stroke={INK} strokeWidth={2} />
      {[58, 66, 74, 82].map((y) => (
        <rect key={y} x={172} y={y} width={30} height={3} rx={1.5} fill="rgba(17,17,17,.25)" />
      ))}
      <g className="ga-scan">
        <rect x={160} y={46} width={54} height={4} rx={2} fill="#22c55e" />
        <rect x={160} y={46} width={54} height={14} fill="rgba(34,197,94,.18)" />
      </g>
      <rect x={174} y={118} width={26} height={14} rx={7} fill={ORANGE} stroke={INK} strokeWidth={2.5} />
      {/* arrow to digital data */}
      <path d="M236 90 H256" stroke={INK} strokeWidth={4} strokeLinecap="round" className="ga-flow" strokeDasharray="6 6" />
      <path d="M252 82 L262 90 L252 98" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {[46, 78, 110].map((y, i) => (
        <g key={y} className="ga-pop" style={{ transformOrigin: `272px ${y + 12}px`, animationDelay: `${0.4 + i * 0.35}s` }}>
          <rect x={272} y={y} width={70} height={24} rx={8} fill={[MINT, SKY, YELLOW][i]} stroke={INK} strokeWidth={3} />
          <rect x={282} y={y + 9} width={34} height={6} rx={3} fill="rgba(17,17,17,.35)" />
          <path d={`M323 ${y + 12} l4 4 l7 -8`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </>
  );
}

/* 4 · Cloud Infrastructure Deployment: a release travels the pipeline into the cloud */
function CloudArt() {
  const stages = [
    { x: 62, label: 'Build', fill: YELLOW },
    { x: 142, label: 'Test', fill: PINK },
    { x: 222, label: 'Ship', fill: SKY },
  ];
  return (
    <>
      <Grid bg={MINT} />
      {/* cloud */}
      <g transform="translate(6 6)" fill={INK}>
        <path d="M222 70 a24 24 0 0 1 4 -47 a32 32 0 0 1 60 -6 a26 26 0 0 1 40 22 a24 24 0 0 1 -6 31z" />
      </g>
      <path d="M222 70 a24 24 0 0 1 4 -47 a32 32 0 0 1 60 -6 a26 26 0 0 1 40 22 a24 24 0 0 1 -6 31z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <g fontFamily={FONT} fontWeight={700} fontSize={10} fill={INK} textAnchor="middle">
        <text x={244} y={56}>AWS</text>
        <text x={274} y={46}>GCP</text>
        <text x={304} y={58}>Azure</text>
      </g>
      {/* pipeline */}
      <path d="M40 132 H300 Q324 132 324 108 V80" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" strokeDasharray="2 10" className="ga-flow" />
      {stages.map((s) => (
        <g key={s.label}>
          <rect x={s.x + 4} y={112} width={58} height={40} rx={10} fill={INK} />
          <rect x={s.x} y={108} width={58} height={40} rx={10} fill={s.fill} stroke={INK} strokeWidth={4} />
          <text x={s.x + 29} y={133} fontFamily={FONT} fontWeight={700} fontSize={12} fill={INK} textAnchor="middle">
            {s.label}
          </text>
        </g>
      ))}
      {/* the package riding the pipeline */}
      <g className="ga-ride">
        <rect x={-12} y={-12} width={24} height={24} rx={4} fill={ORANGE} stroke={INK} strokeWidth={3} />
        <path d="M-12 -2 H12 M0 -12 V12" stroke={INK} strokeWidth={2.5} />
      </g>
      {/* server stack */}
      <g transform="translate(146 30)">
        {[0, 20, 40].map((y) => (
          <g key={y}>
            <rect x={0} y={y} width={62} height={18} rx={5} fill="#fff" stroke={INK} strokeWidth={3.5} />
            <circle cx={12} cy={y + 9} r={3} fill="#22c55e" className="ga-blink" style={{ animationDelay: `${y / 40}s` }} />
            <rect x={22} y={y + 7} width={30} height={4} rx={2} fill="rgba(17,17,17,.3)" />
          </g>
        ))}
      </g>
    </>
  );
}

const ART: Record<string, () => React.JSX.Element> = {
  Nanosandbox: SandboxArt,
  'GenAI Enablement': GenAIArt,
  'Logistics Document Digitalization': LogisticsArt,
  'Cloud Infrastructure Deployment': CloudArt,
};

/** True when a sticker illustration exists for this project title. */
export function hasGoodsArt(title: string) {
  return title in ART;
}

export function GoodsArt({ title, label }: { title: string; label: string }) {
  const Art = ART[title];
  if (!Art) return null;
  return (
    <svg viewBox="0 0 360 176" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} className="block h-full w-full">
      <Art />
    </svg>
  );
}
