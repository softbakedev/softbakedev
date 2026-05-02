import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, Check, ChefHat, Flame, Timer, UserRound } from 'lucide-react';

const stages = [
  {
    step: 1,
    short: 'The recipe',
    title: 'Designing the recipe',
    blurb:
      'We start by shaping the product. We design the user experience, build a quick prototype, and validate the idea before any code is written. The output is a clear product direction your team can build from.',
    gradient: 'from-orange-500 to-amber-500',
    focus: 'Product design & UX',
  },
  {
    step: 2,
    short: 'The bake',
    title: 'Running the kitchen',
    blurb:
      'Next we turn the recipe into a delivery plan. We set the timeline, split the work into focused sprints, and move tasks from plan to build to release. Priorities stay visible so the product keeps moving forward.',
    gradient: 'from-pink-500 to-rose-500',
    focus: 'Project management & delivery',
  },
  {
    step: 3,
    short: 'The agent',
    title: 'The bakery on autopilot',
    blurb:
      'With the plan in place the master chief orchestrates the baker agents directly. The baker agents write and refine the code. A human master chief always reviews the work and runs the tests, so we know everything works as expected before it ships. No large and expensive development team needed.',
    gradient: 'from-rose-500 to-pink-600',
    focus: 'Baker agents & tooling',
  },
];

type RecipeDocRow =
  | { kind: 'chef'; chef: { name: string; comment: string; side: 'left' | 'right' } }
  | { kind: 'prepared'; side: 'left' | 'right' };

const recipeDocumentSteps: RecipeDocRow[] = [
  { kind: 'chef', chef: { name: 'Maya', comment: 'Cold ganache between tier 3–4 — in this recipe or separate?', side: 'left' } },
  { kind: 'chef', chef: { name: 'Sam', comment: 'Bundle the optional extras so we can cut scope fast.', side: 'right' } },
  { kind: 'chef', chef: { name: 'Alex', comment: 'I need 90 min assembly on the run sheet or we overlap.', side: 'left' } },
  { kind: 'prepared', side: 'right' },
];

const scrollViewport = {
  once: false as const,
  amount: 0.35 as const,
  margin: '0px 0px -12% 0px' as const,
};

const lineWrap = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const lineDraw = {
  hidden: { opacity: 0, scaleX: 0 },
  show: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function DocLineStack({ activityLines = 3, resolvedLines = 0 }: { activityLines?: number; resolvedLines?: number }) {
  return (
    <motion.div
      className="w-full space-y-1.5"
      initial="hidden"
      whileInView="show"
      viewport={scrollViewport}
      variants={lineWrap}
    >
      {Array.from({ length: activityLines }).map((_, j) => (
        <motion.div
          key={`a-${j}`}
          variants={lineDraw}
          className="h-0.5 w-full origin-left rounded-full bg-stone-300/90"
        />
      ))}
      {Array.from({ length: resolvedLines }).map((_, j) => (
        <motion.div
          key={`r-${j}`}
          variants={lineDraw}
          className="h-0.5 w-full origin-left rounded-full bg-emerald-500/80"
        />
      ))}
    </motion.div>
  );
}

function RecipePreparedCallout({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left';
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -12 : 12, y: 4 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: false, amount: 0.4, margin: '0px 0px -8% 0px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="pointer-events-auto flex w-full min-w-0 max-w-full items-center gap-2.5 sm:max-w-[20rem]"
      aria-label="Recipe prepared"
    >
      <Check className="h-6 w-6 shrink-0 text-emerald-600 sm:h-7 sm:w-7" strokeWidth={2.5} aria-hidden />
      <DocLineStack activityLines={0} resolvedLines={3} />
    </motion.div>
  );
}

function SideChefBubble({
  name,
  comment,
  side,
}: {
  name: string;
  comment: string;
  side: 'left' | 'right';
}) {
  const isLeft = side === 'left';
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -16 : 16, scale: 0.98 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.4, margin: '0px 0px -8% 0px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`relative z-20 flex w-full max-w-full min-w-0 items-end justify-end gap-2 md:max-w-[20rem] ${
        isLeft ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Chef cap icon only — no circle / frame */}
      <div className="flex shrink-0 items-end self-end pb-px" title={name} aria-hidden>
        <ChefHat
          className="h-7 w-7 text-amber-900/90 sm:h-8 sm:w-8"
          strokeWidth={1.4}
        />
      </div>

      {/* Comic speech bubble — fixed min width so text never collapses to one word per line */}
      <div className="relative w-full min-w-0 sm:min-w-[12rem] md:max-w-[20rem] lg:min-w-[13rem]">
        <div
          className={
            isLeft
              ? 'absolute left-0 top-1/2 z-0 h-2.5 w-2.5 -translate-x-1.5 -translate-y-1/2 rotate-45 border-b border-l border-stone-200/90 bg-white'
              : 'absolute right-0 top-1/2 z-0 h-2.5 w-2.5 translate-x-1.5 -translate-y-1/2 rotate-45 border-t border-r border-stone-200/90 bg-white'
          }
          aria-hidden
        />
        <div className="relative z-[1] rounded-2xl border border-stone-200/90 bg-white px-3 py-2.5 text-left shadow-[0_1px_4px_rgba(15,15,20,0.08)]">
          <p className="text-xs font-extrabold leading-tight text-stone-900 sm:text-[13px]">{name}</p>
          <p className="mt-1 break-words text-[11px] leading-relaxed text-stone-600 [overflow-wrap:anywhere] sm:text-xs sm:leading-relaxed">
            {comment}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SimRecipe() {
  return (
    <div
      className="h-full w-full min-w-0 max-w-full overflow-visible"
      role="region"
      aria-label="Recipe document grows as chefs discuss outside the page"
    >
      <div className="w-full py-1 sm:py-2">
        <div className="mx-auto w-full px-2 sm:px-4 lg:px-6">
          <header className="border-b border-dashed border-stone-200/60 pb-3 text-center">
            <p className="text-[9px] tracking-wide text-stone-400 sm:text-[10px]">Master recipe</p>
            <motion.div
              className="mx-auto mt-2 w-full max-w-xs space-y-1"
              initial="hidden"
              whileInView="show"
              viewport={scrollViewport}
              variants={lineWrap}
            >
              <motion.div variants={lineDraw} className="h-0.5 w-full origin-left rounded-full bg-stone-200" />
              <motion.div variants={lineDraw} className="h-0.5 w-full origin-left rounded-full bg-stone-200/80" />
              <motion.div variants={lineDraw} className="h-0.5 w-full origin-left rounded-full bg-stone-200/60" />
            </motion.div>
          </header>

          <div className="mt-3 space-y-0 sm:mt-4">
            {recipeDocumentSteps.map((row, i) => {
              const hasLeftContent =
                row.kind === 'chef' ? row.chef.side === 'left' : row.side === 'left';
              const hasRightContent =
                row.kind === 'chef' ? row.chef.side === 'right' : row.side === 'right';
              return (
                <div
                  key={`recipe-row-${i}`}
                  className="relative grid min-h-[6rem] w-full min-w-0 max-w-full grid-cols-1 items-center gap-y-2 gap-x-0 pt-2 sm:gap-x-2 md:min-h-[5rem] md:grid-cols-[minmax(10.5rem,1.05fr)_minmax(0,1.5fr)_minmax(10.5rem,1.05fr)] md:gap-x-3 md:gap-y-0 md:pt-0 lg:gap-x-4"
                >
                  {row.kind === 'chef' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={scrollViewport}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 border-b border-dotted border-stone-200/80 py-3"
                    >
                      <DocLineStack activityLines={2 + (i % 2)} />
                    </motion.div>
                  ) : null}

                  {/* left column: never display:none (would drop grid track); collapse when empty on small screens */}
                  <div
                    className={
                      hasLeftContent
                        ? 'relative z-20 order-2 flex w-full min-w-0 max-w-md flex-col items-stretch self-center sm:pt-1 md:order-none md:col-start-1 md:items-end md:justify-end md:pt-2'
                        : 'relative z-0 order-0 col-start-1 max-md:max-h-0 max-md:min-h-0 max-md:overflow-hidden max-md:py-0 md:order-none md:min-h-px md:pt-2'
                    }
                    aria-hidden={!hasLeftContent}
                  >
                    {row.kind === 'chef' && row.chef.side === 'left' ? (
                      <SideChefBubble
                        name={row.chef.name}
                        comment={row.chef.comment}
                        side="left"
                      />
                    ) : null}
                    {row.kind === 'prepared' && row.side === 'left' ? <RecipePreparedCallout side="left" /> : null}
                  </div>

                  <div
                    className={
                      row.kind === 'prepared'
                        ? 'pointer-events-none relative z-0 order-1 col-span-1 -my-1 min-h-0 w-full min-w-0 self-center md:col-start-2'
                        : 'pointer-events-none relative z-0 order-1 min-h-px w-full min-w-0 self-center md:col-start-2'
                    }
                  />

                  <div
                    className={
                      hasRightContent
                        ? 'relative z-20 order-2 flex w-full min-w-0 max-w-md flex-col items-stretch self-center sm:pt-1 md:order-none md:col-start-3 md:items-start md:pt-2'
                        : 'relative z-0 order-0 col-start-3 max-md:max-h-0 max-md:min-h-0 max-md:overflow-hidden max-md:py-0 md:order-none md:min-h-px md:pt-2'
                    }
                    aria-hidden={!hasRightContent}
                  >
                    {row.kind === 'chef' && row.chef.side === 'right' ? (
                      <SideChefBubble
                        name={row.chef.name}
                        comment={row.chef.comment}
                        side="right"
                      />
                    ) : null}
                    {row.kind === 'prepared' && row.side === 'right' ? (
                      <RecipePreparedCallout side="right" />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimKitchen() {
  const kitchenRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: kitchenRef,
    offset: ['start 85%', 'end 20%'],
  });
  const scheduleLabel = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['1', '2', '3', '4', '5']
  );
  const ovenRotate = useTransform(scrollYProgress, [0, 1], [0, 320]);
  const timerRotate = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const taskX = useTransform(
    scrollYProgress,
    [0, 0.24, 0.57, 0.9],
    ['calc(0% + 0rem)', 'calc(0% + 0rem)', 'calc(100% + 0.5rem)', 'calc(200% + 1rem)']
  );
  const planOpacity = useTransform(scrollYProgress, [0, 0.48, 0.58], [1, 1, 0]);
  const bakeOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.78, 0.88], [0, 1, 1, 0]);
  const serveOpacity = useTransform(scrollYProgress, [0.8, 0.9], [0, 1]);

  const kitchenTask = {
    title: 'Checkout flow',
    plan: ['Create task', 'Add acceptance criteria', 'Assign UX + API agents'],
    bake: ['Build payment step', 'Connect pricing API', 'Run tests'],
    serve: ['QA approved', 'Preview shipped', 'Done'],
  };

  const kitchenColumns = [
    {
      title: 'Plan',
      tint: 'from-white to-rose-50/40',
    },
    {
      title: 'Bake',
      tint: 'from-white to-pink-50/50',
    },
    {
      title: 'Serve',
      tint: 'from-white to-emerald-50/50',
    },
  ];

  return (
    <motion.div
      ref={kitchenRef}
      className="space-y-4 text-left"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.45, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative overflow-hidden rounded-[1.35rem] border border-rose-200/80 bg-gradient-to-r from-rose-50 via-white to-pink-50/70 p-3.5 shadow-[0_12px_30px_rgba(190,18,60,0.12)]"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.35 }}
        aria-label="Kitchen oven running"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-rose-200/25 to-transparent" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-white shadow-inner shadow-rose-200/70">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-rose-300/45 to-pink-300/20 blur-md" aria-hidden />
            <motion.div
              className="relative h-11 w-11 rounded-full border-[5px] border-rose-400 border-t-transparent"
              style={{ rotate: ovenRotate }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Flame className="h-[1.125rem] w-[1.125rem] text-orange-500" />
            </div>
          </div>
          <div className="hidden min-w-0 flex-1 sm:block">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.18)]" />
              <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-500/80">
                Kitchen running
              </p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-rose-100">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-rose-500"
                style={{ scaleX: scrollYProgress }}
              />
            </div>
          </div>
          </div>
          <div className="shrink-0 rounded-2xl border border-rose-100 bg-white/85 px-3 py-2 text-right shadow-sm">
            <motion.div style={{ rotate: timerRotate }} className="ml-auto w-fit origin-bottom">
              <Timer className="h-[1.125rem] w-[1.125rem] text-rose-500" />
            </motion.div>
            <motion.p className="mt-0.5 font-mono text-sm font-bold tabular-nums text-rose-800 sm:text-base">
              {scheduleLabel}
            </motion.p>
            <p className="text-[10px] font-medium text-rose-600/70">Sprint</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="relative min-h-[13rem]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.45, margin: '0px 0px -8% 0px' }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.12 } },
        }}
      >
        <div className="grid h-full min-h-[13rem] grid-cols-3 gap-2">
          {kitchenColumns.map((col) => (
            <motion.div
              key={col.title}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="relative overflow-hidden rounded-xl border border-rose-100 bg-white/90 p-2 shadow-sm"
            >
              <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-rose-500">
                {col.title}
              </p>
              <div className={`h-[9.5rem] rounded-lg border border-dashed border-rose-100 bg-gradient-to-r ${col.tint}`} />
            </motion.div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-10 z-20 grid grid-cols-3 gap-2">
          <motion.div
            style={{ x: taskX }}
            className="col-start-1 rounded-lg border border-rose-100 bg-white px-2 py-2 shadow-[0_8px_18px_rgba(190,18,60,0.12)]"
          >
            <p className="text-[9px] font-bold leading-snug text-slate-800 sm:text-[10px]">
              {kitchenTask.title}
            </p>
            <div className="relative mt-1.5 min-h-[6.75rem]">
              <motion.div style={{ opacity: planOpacity }} className="absolute inset-0 space-y-1">
                {kitchenTask.plan.map((detail) => (
                  <div
                    key={detail}
                    className="flex items-center gap-1.5 rounded-full bg-rose-50 px-1.5 py-1 text-[8px] font-medium text-rose-600 sm:text-[9px]"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                    <span className="leading-tight">{detail}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div style={{ opacity: bakeOpacity }} className="absolute inset-0 space-y-1">
                {kitchenTask.bake.map((detail) => (
                  <div
                    key={detail}
                    className="flex items-center gap-1.5 rounded-full bg-pink-50 px-1.5 py-1 text-[8px] font-medium text-pink-700 sm:text-[9px]"
                  >
                    <Timer className="h-3 w-3 shrink-0" aria-hidden />
                    <span className="leading-tight">{detail}</span>
                  </div>
                ))}
                <motion.div
                  style={{ scaleX: bakeOpacity }}
                  className="h-1.5 origin-left rounded-full bg-gradient-to-r from-pink-400 to-rose-500"
                  aria-hidden
                />
              </motion.div>
              <motion.div style={{ opacity: serveOpacity }} className="absolute inset-0 space-y-1">
                {kitchenTask.serve.map((detail, r) => (
                  <div
                    key={detail}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-1.5 py-1 text-[8px] font-semibold text-emerald-700 sm:text-[9px]"
                  >
                    {r === kitchenTask.serve.length - 1 ? (
                      <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
                    ) : (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
                    )}
                    <span className="leading-tight">{detail}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RobotHeadNoAntenna({
  className,
  strokeWidth = 1.7,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 11a2 2 0 0 0-2 2v2" />
      <path d="M19 11a2 2 0 0 1 2 2v2" />
      <rect x="6" y="8" width="12" height="10" rx="2.5" />
      <path d="M9.5 12.5v2" />
      <path d="M14.5 12.5v2" />
      <path d="M9 18h6" />
    </svg>
  );
}

function SimAgent() {
  const agentRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: agentRef,
    offset: ['start 115%', 'end 35%'],
  });
  const reviewOpacity = useTransform(scrollYProgress, [0.88, 0.98], [0, 1]);
  const reviewY = useTransform(scrollYProgress, [0.88, 0.98], [8, 0]);

  const agentTasks = [
    {
      agent: 'UX sub-agent',
      task: 'Polish checkout flow',
      detail: 'fills states + empty screens',
      progress: '92%',
      side: 'left',
      codeLines: ['w-10', 'w-16', 'w-12'],
    },
    {
      agent: 'API sub-agent',
      task: 'Wire pricing rules',
      detail: 'connects contract + tests',
      progress: '78%',
      side: 'right',
      codeLines: ['w-14', 'w-10', 'w-16'],
    },
    {
      agent: 'QA sub-agent',
      task: 'Review and finish',
      detail: 'checks build before serve',
      progress: '100%',
      side: 'left',
      codeLines: ['w-12', 'w-16', 'w-10'],
    },
  ];

  function AgentBubble({
    row,
    i,
  }: {
    key?: React.Key;
    row: (typeof agentTasks)[number];
    i: number;
  }) {
    const offset = i * 0.035;
    const thinkingOpacity = useTransform(scrollYProgress, [0 + offset, 0.1 + offset, 0.46 + offset, 0.56 + offset], [0, 1, 1, 0]);
    const writingOpacity = useTransform(scrollYProgress, [0.52 + offset, 0.62 + offset, 0.78 + offset, 0.88 + offset], [0, 1, 1, 0]);
    const doneOpacity = useTransform(scrollYProgress, [0.84 + offset, 0.96 + offset], [0, 1]);
    const progressScale = useTransform(
      scrollYProgress,
      [0.12 + offset, 0.72 + offset],
      [0, Number.parseInt(row.progress, 10) / 100]
    );

    return (
      <motion.div
        key={row.agent}
        initial={{ opacity: 0, x: row.side === 'left' ? -52 : 52, scale: 0.97 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2, margin: '0px 0px -5% 0px' }}
        transition={{ delay: 0.04 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`flex w-[90%] items-start gap-2 ${
          row.side === 'right' ? 'self-end flex-row-reverse' : 'self-start'
        }`}
      >
        <div className="relative mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center text-pink-700">
          <motion.span
            className="absolute inset-1 rounded-full bg-gradient-to-br from-pink-200/80 via-orange-100/70 to-transparent blur-md"
            animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.92, 1.05, 0.92] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }}
            aria-hidden
          />
          <ChefHat className="absolute top-1 h-5 w-5 text-pink-700 drop-shadow-sm" strokeWidth={1.45} aria-hidden />
          <RobotHeadNoAntenna className="relative mt-3 h-7 w-7 drop-shadow-sm" strokeWidth={1.55} />
        </div>

        <div className="min-w-0 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.65 }}
            transition={{ delay: 0.12 + 0.12 * i, duration: 0.28 }}
            className="relative"
          >
            <div className="mb-1">
              <p className="truncate text-xs font-bold tracking-tight text-slate-900">{row.task}</p>
              <p className="text-[9px] leading-snug text-slate-600 sm:text-[10px]">
                {row.agent} · {row.detail}
              </p>
            </div>

            <div className="relative mt-1 h-9">
              <motion.div
                style={{ opacity: thinkingOpacity }}
                className="absolute inset-x-0 top-0 rounded-lg bg-amber-50/90 px-2 py-1 shadow-[0_1px_4px_rgba(245,158,11,0.07)]"
              >
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-semibold text-amber-700">Thinking</span>
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="h-1.5 w-1.5 rounded-full bg-amber-500"
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.15 }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                style={{ opacity: writingOpacity }}
                className="absolute inset-x-0 top-0 rounded-lg bg-pink-50/90 px-2 py-1.5 shadow-[0_1px_4px_rgba(236,72,153,0.07)]"
              >
                <div className="space-y-1">
                  {row.codeLines.map((width, line) => (
                    <motion.span
                      key={line}
                      className={`block h-1 rounded-full bg-gradient-to-r from-pink-400 to-orange-300 ${width}`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: false, amount: 0.4 }}
                      transition={{ duration: 0.34, delay: 0.06 * line + 0.04 * i }}
                      style={{ transformOrigin: row.side === 'right' ? 'right' : 'left' }}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                style={{ opacity: doneOpacity }}
                className="absolute inset-x-0 top-0 flex items-center gap-1.5 rounded-lg bg-emerald-50/90 px-2 py-1.5 text-emerald-700 shadow-[0_1px_4px_rgba(16,185,129,0.07)]"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
                <span className="text-[9px] font-semibold">Done</span>
              </motion.div>
            </div>

            <div className="mt-1 h-1 overflow-hidden rounded-full bg-pink-100">
              <motion.div
                className="h-full origin-left rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-emerald-300"
                style={{ scaleX: progressScale }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={agentRef}
      className="overflow-visible"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.12, margin: '20% 0px -5% 0px' }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Agent team simulation"
    >
      <div className="relative py-1">
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto mb-3 flex w-fit items-center gap-3 rounded-2xl border border-pink-100 bg-white/90 px-4 py-2.5 shadow-[0_8px_20px_rgba(190,18,60,0.08)]"
        >
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center text-pink-700">
            <motion.span
              className="absolute inset-1 rounded-full bg-gradient-to-br from-pink-200/80 via-orange-100/70 to-transparent blur-md"
              animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.92, 1.05, 0.92] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              aria-hidden
            />
            <ChefHat className="absolute top-1 h-6 w-6 text-pink-700 drop-shadow-sm" strokeWidth={1.45} aria-hidden />
            <UserRound className="relative mt-5 h-8 w-8 drop-shadow-sm" strokeWidth={1.55} aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900">Chief chef</p>
            <p className="text-[10px] font-medium leading-tight text-slate-500">
              orchestrates baker agents
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ delay: 0.08, duration: 0.24 }}
          className="relative z-10 mx-auto mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-pink-50 text-pink-600 ring-1 ring-pink-100"
          aria-hidden
        >
          <ArrowDown className="h-3.5 w-3.5" strokeWidth={2.2} />
        </motion.div>

        <div className="relative z-10 flex flex-col gap-1.5">
          {agentTasks.map((row, i) => (
            <React.Fragment key={row.agent}>
              <AgentBubble row={row} i={i} />
              {i < agentTasks.length - 1 ? (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.35 }}
                  transition={{ delay: 0.08 * (i + 1), duration: 0.24 }}
                  className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-orange-50 text-orange-500 ring-1 ring-orange-100"
                  aria-hidden
                >
                  <ArrowDown className="h-3 w-3" strokeWidth={2.2} />
                </motion.div>
              ) : null}
            </React.Fragment>
          ))}
        </div>

        <motion.div
          style={{ opacity: reviewOpacity, y: reviewY }}
          className="mt-2 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 ring-1 ring-emerald-100">
            <div className="relative flex h-5 w-5 items-center justify-center">
              <ChefHat className="absolute -top-1 h-3.5 w-3.5 text-emerald-700" strokeWidth={1.5} aria-hidden />
              <UserRound className="mt-1 h-4 w-4" strokeWidth={1.7} aria-hidden />
            </div>
            <span className="text-[10px] font-semibold">Review</span>
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const Simulation = [SimRecipe, SimKitchen, SimAgent];

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-24 bg-gradient-to-b from-white to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="text-4xl font-bold md:text-5xl">
            How we bake{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              from recipe to launch
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We take products from first idea to working software in three simple steps. First we design and prototype the
            product. Then we set the timeline and split the work into a clear plan. Finally the master chief orchestrates
            the baker agents that build it. The simulations below show how each step moves your product closer to launch.
          </p>
        </motion.div>

        <div className="space-y-20 md:space-y-28">
          {stages.map((stage, index) => {
            const Sim = Simulation[index];
            // Step 1 keeps text left/sim right; step 2 mirrors it with sim left/text right.
            const reverse = index > 0 && index % 2 === 1;
            const isDesignRecipe = index === 0;
            const isKitchen = index === 1;
            const isBakeryAutopilot = index === 2;
            const titleUsesStageGradient = isDesignRecipe || isKitchen || isBakeryAutopilot;
            return (
              <div key={stage.step}>
                <motion.article
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55 }}
                  className={`grid items-start gap-8 sm:gap-10 md:gap-12 ${
                    isDesignRecipe
                      ? 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]'
                      : isKitchen
                        ? 'md:grid-cols-2'
                        : isBakeryAutopilot
                          ? 'md:grid-cols-2'
                          : 'lg:grid-cols-2'
                  }`}
                >
                  <div
                    className={`min-w-0 space-y-4 text-left ${
                      reverse ? 'md:order-2' : ''
                    } ${!reverse && !isDesignRecipe ? 'lg:pr-4' : ''} ${
                      reverse ? 'md:pl-4' : ''
                    } ${isDesignRecipe ? 'pr-0 md:max-w-xl md:pr-4' : ''} ${
                      isKitchen ? 'md:-mt-14 lg:-mt-20' : ''
                    }`}
                  >
                    {!titleUsesStageGradient && (
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${stage.gradient} shadow-sm`}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px]">
                          {stage.step}
                        </span>
                        {stage.short} · {stage.focus}
                      </div>
                    )}
                    <h3
                      className={`text-3xl font-bold md:text-4xl ${
                        titleUsesStageGradient
                          ? `bg-gradient-to-r ${stage.gradient} bg-clip-text text-transparent`
                          : 'text-gray-900'
                      }`}
                    >
                      {stage.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">{stage.blurb}</p>
                  </div>
                  <div
                    className={`relative min-h-0 min-w-0 w-full ${reverse ? 'md:order-1' : ''} ${
                      isKitchen ? 'md:-mt-28 lg:-mt-40' : ''
                    } ${isBakeryAutopilot ? 'md:-mt-20 lg:-mt-36' : ''
                    }`}
                  >
                    {stage.step === 2 && (
                      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-pink-200/20 to-rose-200/20 blur-2xl" />
                    )}
                    {Sim ? <Sim /> : null}
                  </div>
                </motion.article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
