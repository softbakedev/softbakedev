import React from 'react';
import { useAnimationFrame, useReducedMotion, useScroll } from 'motion/react';

/* ------------------------------------------------------------------ */
/* Timeline helpers: every scene is a pure function of progress p 0..1 */
/* ------------------------------------------------------------------ */

const clamp = (v: number) => Math.max(0, Math.min(1, v));
/** Progress of p inside the window [a, b], clamped to 0..1. */
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** Ease with a springy overshoot, for things that "pop" into place. */
const back = (t: number) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const c = 2.2;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
const pop = (p: number, start: number, duration = 0.06) => back(seg(p, start, start + duration));

const INK = '#111111';
const ORANGE = '#FF8A4C';
const YELLOW = '#FFE14D';
const SKY = '#B9F2FF';
const PINK = '#FFB3D1';
const MINT = '#A7F3C5';
const PAPER = '#FFF6EE';
const GREEN = '#0a8a4a';

/** Fastest a scene may advance: 0.2 of the story per second, so a full scene takes about 5 s. */
const MAX_SPEED = 0.2;

/**
 * Scroll-driven progress for a scene. Scrolling sets the target (0 when the scene enters the
 * bottom of the screen, 1 once its middle reaches the upper part), and the shown progress
 * follows that target at a limited speed. Fast scrolling therefore never rushes the story,
 * and every scene finishes while it is still fully in view.
 * Reduced motion jumps straight to the finished state.
 */
function useSceneProgress(ref: React.RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'center 45%'] });
  const shown = React.useRef(0);
  const [p, setP] = React.useState(0);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const target = scrollYProgress.get();
    const current = shown.current;
    if (Math.abs(target - current) < 0.0005) return;
    const step = MAX_SPEED * (Math.min(delta, 64) / 1000);
    const next = current + Math.max(-step, Math.min(step, target - current));
    shown.current = next;
    setP(next);
  });

  return reduce ? 1 : p;
}

/** Width of an element, kept up to date on resize. */
function useWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = React.useState(360);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

/* --------------------------- shared drawings --------------------------- */

function Robot({ color, className, style }: { color: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 40" className={className} style={{ overflow: 'visible', ...style }} aria-hidden>
      <line x1="20" y1="3" x2="20" y2="10" stroke={INK} strokeWidth="2.5" />
      <circle cx="20" cy="3" r="3" fill={ORANGE} stroke={INK} strokeWidth="2" />
      <rect x="5" y="10" width="30" height="24" rx="7" fill={color} stroke={INK} strokeWidth="2.5" />
      <rect x="10" y="16" width="20" height="10" rx="4" fill={INK} />
      <circle cx="16" cy="21" r="2" fill="#7ee2a8" />
      <circle cx="24" cy="21" r="2" fill="#7ee2a8" />
      <rect x="2" y="18" width="3" height="8" rx="1.5" fill={INK} />
      <rect x="35" y="18" width="3" height="8" rx="1.5" fill={INK} />
    </svg>
  );
}

function ChefHat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} style={{ overflow: 'visible' }} aria-hidden>
      <g fill={INK} stroke={INK} strokeWidth="14" strokeLinejoin="round">
        <circle cx="72" cy="52" r="22" />
        <circle cx="100" cy="36" r="27" />
        <circle cx="128" cy="52" r="22" />
        <rect x="64" y="60" width="72" height="30" rx="5" />
      </g>
      <g fill="#fff">
        <circle cx="72" cy="52" r="22" />
        <circle cx="100" cy="36" r="27" />
        <circle cx="128" cy="52" r="22" />
      </g>
      <rect x="64" y="62" width="72" height="28" rx="5" fill="#fff" stroke={INK} strokeWidth="7" />
      <line x1="80" y1="76" x2="120" y2="76" stroke={ORANGE} strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function Stamp({ p, start, children, className = '', style }: { p: number; start: number; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const k = pop(p, start, 0.05);
  return (
    <span
      className={`sb-display absolute whitespace-nowrap rounded-lg border-[3px] px-2.5 pb-0.5 pt-1.5 text-sm sm:text-base ${className}`}
      style={{
        color: GREEN,
        borderColor: GREEN,
        background: 'rgba(255,255,255,0.92)',
        opacity: p < start ? 0 : k,
        transform: `rotate(-10deg) scale(${p < start ? 0 : 1 + (1 - k) * 1.5})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

const sceneClass =
  'relative h-[320px] w-full overflow-hidden sm:h-[380px] select-none';

/* ---------------------- 1 · Designing the recipe ---------------------- */
/* A recipe book opens, a pencil sketches the app screen, prototype gets ready. */

const phoneBlocks = [
  { y: 8, h: 10, w: 1, kind: 'bar' as const, color: ORANGE, at: 0.16 },
  { y: 24, h: 42, w: 1, kind: 'box' as const, color: SKY, at: 0.26 },
  { y: 74, h: 6, w: 0.9, kind: 'line' as const, color: '', at: 0.36 },
  { y: 86, h: 6, w: 0.7, kind: 'line' as const, color: '', at: 0.42 },
  { y: 98, h: 6, w: 0.8, kind: 'line' as const, color: '', at: 0.48 },
  { y: 116, h: 18, w: 1, kind: 'button' as const, color: INK, at: 0.56 },
];
const PHONE_INNER = 76;

export function RecipeBookScene() {
  const ref = React.useRef<HTMLDivElement>(null);
  const p = useSceneProgress(ref);
  const big = useWidth(ref) >= 560;

  // Which block is the pencil drawing right now?
  let current = phoneBlocks.findIndex((b) => p < b.at + 0.08);
  if (current < 0) current = phoneBlocks.length - 1;
  const block = phoneBlocks[current];
  const drawn = seg(p, block.at, block.at + 0.08);
  const pencilX = 8 + drawn * PHONE_INNER * block.w - 6;
  const pencilY = block.y + block.h / 2 - 40;
  const pencilOpacity = p < 0.12 ? seg(p, 0.08, 0.12) : 1 - seg(p, 0.66, 0.72);

  const flip = easeOut(seg(p, 0, 0.12));

  return (
    <div ref={ref} className={sceneClass} style={{ background: SKY }} aria-label="A recipe book where a pencil sketches the app screen into a prototype" role="img">
      <span className="sb-chip absolute left-3 top-3 z-10 text-xs" style={{ background: YELLOW }}>
        Sketch → prototype
      </span>

      <div className="absolute left-1/2 top-14 h-[230px] w-[88%] max-w-[580px] -translate-x-1/2 sm:top-16 sm:h-[280px]" style={{ perspective: 900 }}>
        {/* left page: the written recipe */}
        <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-xl border-[2.5px] border-r-[1.25px] border-[var(--sb-ink)] bg-white p-3">
          <div className="sb-display mb-3 text-xs">The recipe</div>
          <div className="grid gap-2">
            {[0.9, 0.7, 0.8, 0.55, 0.85, 0.65].map((w, i) => (
              <div
                key={i}
                className="h-1.5 origin-left rounded-full bg-[rgba(17,17,17,0.18)]"
                style={{ width: `${w * 100}%`, transform: `scaleX(${easeOut(seg(p, 0.06 + i * 0.015, 0.14 + i * 0.015))})` }}
              />
            ))}
          </div>
          <div className="mt-4 font-mono text-[10px] font-medium">users · flows · scope</div>
          <div
            className="mt-3 inline-block rounded-md border-2 border-[var(--sb-ink)] px-1.5 text-[10px] font-bold"
            style={{ background: PINK, transform: `rotate(-4deg) scale(${pop(p, 0.3)})` }}
          >
            MVP first
          </div>
        </div>

        {/* right page: the app screen being sketched */}
        <div className="absolute inset-y-0 right-0 grid w-1/2 place-items-center rounded-r-xl border-[2.5px] border-l-[1.25px] border-[var(--sb-ink)] bg-white">
          <div className="relative h-[150px] w-[92px] rounded-[14px] border-[2.5px] border-[var(--sb-ink)] bg-white" style={{ transform: big ? 'scale(1.35)' : undefined }}>
            {phoneBlocks.map((b, i) => {
              const t = easeOut(seg(p, b.at, b.at + 0.08));
              const style: React.CSSProperties = {
                top: b.y,
                left: 8,
                width: PHONE_INNER * b.w,
                height: b.h,
                transform: `scaleX(${t})`,
                opacity: t > 0 ? 1 : 0,
              };
              if (b.kind === 'line') {
                return <div key={i} className="absolute origin-left rounded-full bg-[rgba(17,17,17,0.2)]" style={style} />;
              }
              return (
                <div
                  key={i}
                  className="absolute origin-left rounded-md border-[1.5px] border-[var(--sb-ink)]"
                  style={{ ...style, background: b.color }}
                />
              );
            })}

            {/* pencil */}
            <svg
              viewBox="0 0 44 44"
              className="pointer-events-none absolute h-11 w-11"
              style={{ left: pencilX, top: pencilY, opacity: pencilOpacity, transform: `rotate(${Math.sin(p * 90) * 4}deg)` }}
              aria-hidden
            >
              <g transform="rotate(35 22 22)">
                <rect x="17" y="2" width="10" height="30" rx="2" fill={YELLOW} stroke={INK} strokeWidth="2.5" />
                <path d="M17 32 L22 42 L27 32 Z" fill={PAPER} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
                <rect x="17" y="2" width="10" height="6" fill={PINK} stroke={INK} strokeWidth="2.5" />
              </g>
            </svg>
          </div>
        </div>

        {/* page turning open at the start */}
        <div
          className="absolute inset-y-0 right-0 w-1/2 origin-left rounded-r-xl border-[2.5px] border-[var(--sb-ink)]"
          style={{
            background: PAPER,
            transform: `rotateY(${-180 * flip}deg)`,
            backfaceVisibility: 'hidden',
            opacity: flip >= 1 ? 0 : 1,
          }}
        />
      </div>

      <span
        className="sb-chip absolute bottom-3 right-3 z-10 text-xs"
        style={{ background: MINT, transform: `rotate(-4deg) scale(${pop(p, 0.7)})` }}
      >
        Prototype ready ✓
      </span>
    </div>
  );
}

/* ----------------------- 2 · Running the kitchen ----------------------- */
/* Tasks ride a conveyor belt into the oven and come out baked, timeline moves to launch. */

const ovenTasks = ['Login', 'Pricing', 'Checkout'];

export function OvenScene() {
  const ref = React.useRef<HTMLDivElement>(null);
  const p = useSceneProgress(ref);
  const width = useWidth(ref);

  const big = width >= 560;
  const ovenLeft = width * (big ? 0.3 : 0.34);
  const ovenWidth = Math.min(width * 0.36, big ? 280 : 200);
  const ovenHeight = big ? 200 : 150;
  const trayX = Math.min(width - 108, ovenLeft + ovenWidth + 16);
  let baking = false;

  const tickets = ovenTasks.map((label, i) => {
    const s = 0.08 + i * 0.22;
    const enter = easeOut(seg(p, s, s + 0.1));
    const inside = p > s + 0.1 && p < s + 0.17;
    const done = p >= s + 0.17;
    if (inside) baking = true;
    const x = done ? trayX : -100 + enter * (ovenLeft + ovenWidth * 0.3 + 100);
    return { label, i, s, inside, done, x, waiting: p < s };
  });

  const sprint = Math.min(3, 1 + Math.floor(p * 3.2));

  return (
    <div ref={ref} className={sceneClass} style={{ background: YELLOW }} aria-label="Tasks travel on a conveyor belt into an oven and come out baked as the timeline moves toward launch" role="img">
      {/* timeline */}
      <div className="absolute inset-x-3 top-3 grid gap-1">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.06em]">
          <span>Kickoff</span>
          <span>Sprint 1</span>
          <span>Sprint 2</span>
          <span>Launch</span>
        </div>
        <div className="h-3 overflow-hidden rounded-md border-2 border-[var(--sb-ink)] bg-white">
          <div className="h-full" style={{ width: `${p * 100}%`, background: ORANGE }} />
        </div>
      </div>

      {/* oven */}
      <div
        className="sb-card absolute top-16 p-2 sm:top-[72px]"
        style={{ left: ovenLeft, width: ovenWidth, height: ovenHeight, transform: baking ? `translateY(${Math.sin(p * 400) * 1.2}px)` : undefined }}
      >
        <div className="flex items-center justify-between">
          <span className="sb-display text-xs">Oven</span>
          <svg width="26" height="26" viewBox="0 0 26 26" style={{ transform: `rotate(${p * 720}deg)` }} aria-hidden>
            <circle cx="13" cy="13" r="10" fill={YELLOW} stroke={INK} strokeWidth="2.5" />
            <line x1="13" y1="13" x2="13" y2="6" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <div
          className="mt-2 rounded-lg border-[2.5px] border-[var(--sb-ink)] transition-colors duration-150"
          style={{ height: ovenHeight - 64, background: baking ? `hsl(${30 + Math.sin(p * 200) * 8} 100% ${62 + Math.sin(p * 160) * 6}%)` : PAPER }}
        >
          {baking ? (
            <div className="flex h-full items-end justify-center gap-1.5 pb-2">
              {[0, 1, 2].map((k) => (
                <span key={k} className="block h-3 w-3 rounded-full border-2 border-[var(--sb-ink)]" style={{ background: ORANGE, transform: `translateY(${Math.sin(p * 300 + k) * 3}px)` }} />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* conveyor belt */}
      <div
        className="absolute inset-x-0 bottom-14 h-4 border-y-[2.5px] border-[var(--sb-ink)]"
        style={{ background: 'repeating-linear-gradient(90deg,#fff 0 12px,#e8e0d8 12px 24px)', backgroundPosition: `${p * 600}px 0` }}
      />

      {/* task tickets */}
      {tickets.map((t) => (
        <span
          key={t.label}
          className={`absolute whitespace-nowrap rounded-[10px] border-[2.5px] border-[var(--sb-ink)] px-2 py-1 font-bold shadow-[3px_3px_0_var(--sb-ink)] ${big ? 'text-sm' : 'text-[11px]'}`}
          style={{
            left: t.x,
            bottom: t.done ? 82 + t.i * (big ? 34 : 28) : 82,
            background: t.done ? ORANGE : '#fff',
            opacity: t.inside || t.waiting ? 0 : 1,
            transform: t.done
              ? `scale(${back(seg(p, t.s + 0.17, t.s + 0.23))}) rotate(${t.i % 2 ? 3 : -3}deg)`
              : `rotate(${Math.sin(p * 160 + t.i) * 2}deg)`,
          }}
        >
          {t.done ? '✓ ' : ''}
          {t.label}
        </span>
      ))}

      <span className="sb-chip absolute bottom-3 left-3 text-xs">Sprint {sprint} of 3</span>
      <span
        className="sb-chip absolute bottom-3 right-3 text-xs"
        style={{ background: MINT, transform: `rotate(-4deg) scale(${pop(p, 0.84)})` }}
      >
        Launch ready ✓
      </span>
    </div>
  );
}

/* --------------------- 3 · The bakery on autopilot --------------------- */
/* Robot agents stack the release cake; the master chief inspects it; seal lands. */

const cakeLayers = [
  { label: 'Tests', color: MINT, robot: MINT },
  { label: 'API', color: SKY, robot: SKY },
  { label: 'UI', color: YELLOW, robot: YELLOW },
];

export function CakeScene() {
  const ref = React.useRef<HTMLDivElement>(null);
  const p = useSceneProgress(ref);
  const width = useWidth(ref);
  const big = width >= 560;
  const LAYER_H = big ? 48 : 36;
  const plateTop = big ? 316 : 260; // layers sit on the plate near the bottom of the scene

  const sweep = seg(p, 0.62, 0.8);
  const lensX = width * 0.16 + sweep * width * 0.5;
  const lensY = (big ? 190 : 150) + Math.sin(sweep * Math.PI * 2) * 18;

  return (
    <div ref={ref} className={sceneClass} style={{ background: PINK }} aria-label="Robot agents stack the release layers, then the master chief inspects it before the human checked seal" role="img">
      <span className="sb-chip absolute left-3 top-3 text-xs">Release v1.0</span>

      {/* plate */}
      <div className={`absolute left-1/2 h-4 -translate-x-1/2 rounded-[50%] ${big ? 'w-60' : 'w-44'} border-[2.5px] border-[var(--sb-ink)] bg-white`} style={{ top: plateTop + 2 }} />

      {cakeLayers.map((layer, i) => {
        const s = 0.06 + i * 0.17;
        const drop = back(seg(p, s + 0.06, s + 0.12));
        const finalTop = plateTop - LAYER_H * (i + 1) + 4;
        const top = -60 + (finalTop + 60) * drop;
        const tilt = (1 - seg(p, s + 0.06, s + 0.14)) * 8 * (i % 2 ? 1 : -1);

        const enter = easeOut(seg(p, s, s + 0.06));
        const leave = easeOut(seg(p, s + 0.12, s + 0.18));
        const fromLeft = i % 2 === 0;
        const startX = fromLeft ? -60 : width + 10;
        const midX = width / 2 - 22;
        const robotX = startX + (midX - startX) * enter + (startX - midX) * leave;

        return (
          <React.Fragment key={layer.label}>
            <div
              className={`sb-display absolute left-1/2 grid place-items-center rounded-xl border-[2.5px] border-[var(--sb-ink)] shadow-[3px_3px_0_var(--sb-ink)] ${big ? 'w-48 text-base' : 'w-32 text-xs'}`}
              style={{
                height: LAYER_H - 2,
                top,
                background: layer.color,
                opacity: p < s + 0.04 ? 0 : 1,
                transform: `translateX(-50%) rotate(${tilt}deg)`,
              }}
            >
              {layer.label}
            </div>
            <Robot
              color={layer.robot}
              className={`absolute ${big ? 'h-14 w-14' : 'h-11 w-11'}`}
              style={{ left: robotX, top: 44, transform: `rotate(${Math.sin(p * 160 + i) * 8}deg)` }}
            />
          </React.Fragment>
        );
      })}

      {/* master chief's magnifier */}
      <div
        className="pointer-events-none absolute"
        style={{ left: lensX, top: lensY, opacity: p > 0.6 && p < 0.86 ? 1 : 0, transition: 'opacity .2s' }}
        aria-hidden
      >
        <ChefHat className="absolute -top-6 left-2 w-10" />
        <svg width="70" height="70" viewBox="0 0 70 70">
          <circle cx="28" cy="28" r="18" fill="rgba(255,255,255,.55)" stroke={INK} strokeWidth="4" />
          <line x1="41" y1="41" x2="60" y2="60" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>

      <Stamp p={p} start={0.84} className="right-3 top-12 sm:top-14">
        Human checked ✓
      </Stamp>
    </div>
  );
}
