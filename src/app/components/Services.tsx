import React from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Check } from 'lucide-react';
import { CakeScene, OvenScene, RecipeBookScene } from './bake/KitchenScenes';
import { SectionHeading } from './sticker/SectionHeading';

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

const Simulation = [RecipeBookScene, OvenScene, CakeScene];

const stageStyles = [
  { color: 'var(--sb-yellow)', tilt: -1.5, youGet: ['Clickable prototype', 'Validated UX', 'Clear product direction'] },
  { color: 'var(--sb-pink)', tilt: 1.25, youGet: ['Timeline with milestones', 'Focused sprints', 'Visible priorities'] },
  { color: 'var(--sb-mint)', tilt: -1.25, youGet: ['Code built by baker agents', 'Human review and tests', 'A release that works'] },
];

function StepBadge({ step, color, active }: { step: number; color: string; active: boolean }) {
  return (
    <motion.span
      animate={{ scale: active ? 1.15 : 1, rotate: active ? -10 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 12 }}
      className="sb-display grid h-12 w-12 shrink-0 place-items-center rounded-full border-[3px] border-[var(--sb-ink)] text-2xl shadow-[3px_3px_0_var(--sb-ink)] transition-colors duration-200"
      style={{ background: active ? color : '#fff' }}
    >
      {step}
    </motion.span>
  );
}

function StageArticle({
  index,
  onActive,
}: {
  index: number;
  onActive: (index: number) => void;
}) {
  const stage = stages[index];
  const style = stageStyles[index];
  const Sim = Simulation[index];
  const ref = React.useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' });

  React.useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <article ref={ref} id={`bake-step-${stage.step}`} className="scroll-mt-28 space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 lg:hidden">
          <StepBadge step={stage.step} color={style.color} active />
          <span className="sb-chip">{stage.focus}</span>
        </div>
        <span className="sb-chip hidden lg:inline-flex">{stage.focus}</span>
        <h3 className="sb-display text-4xl sm:text-5xl">{stage.title}</h3>
        <p className="max-w-2xl text-lg font-medium leading-relaxed text-[#3a332f]">{stage.blurb}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-[0.12em]">You get</span>
          {style.youGet.map((item, i) => (
            <motion.span
              key={item}
              initial={{ scale: 0, rotate: -12 }}
              whileInView={{ scale: 1, rotate: i % 2 ? 2 : -2 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 420, damping: 14, delay: 0.1 + i * 0.08 }}
              className="sb-chip"
              style={{ background: style.color }}
            >
              <Check className="h-4 w-4" strokeWidth={3} />
              {item}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, rotate: style.tilt * 3 }}
        whileInView={{ opacity: 1, y: 0, rotate: style.tilt }}
        whileHover={{ rotate: 0, y: -4 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ type: 'spring', stiffness: 160, damping: 16 }}
        className="relative min-w-0"
      >
        <div className="sb-card overflow-hidden">
          <div
            className="flex items-center gap-2 border-b-[2.5px] border-[var(--sb-ink)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em]"
            style={{ background: style.color }}
          >
            <span className="h-3 w-3 rounded-full border-2 border-[var(--sb-ink)] bg-white" />
            <span className="h-3 w-3 rounded-full border-2 border-[var(--sb-ink)] bg-white" />
            <span className="ml-2">
              Step {stage.step} · {stage.short}
            </span>
          </div>
          <div className="bg-white">{Sim ? <Sim /> : null}</div>
        </div>
      </motion.div>
    </article>
  );
}

export function Services() {
  const reduce = useReducedMotion();
  const [active, setActive] = React.useState(0);
  const stepsRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stepsRef, offset: ['start 50%', 'end 60%'] });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const handleActive = React.useCallback((index: number) => setActive(index), []);

  return (
    <section id="services" className="sb-grid-bg relative overflow-x-clip border-b-[3px] border-[var(--sb-ink)] bg-[var(--sb-paper)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading chip="How we bake" title="From recipe" highlight="to launch" highlightColor="var(--sb-sky)">
          We take products from first idea to working software in three simple steps. First we design and prototype the
          product. Then we set the timeline and split the work into a clear plan. Finally the master chief orchestrates
          the baker agents that build it.
        </SectionHeading>

        <div className="grid gap-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
          {/* Sticky step list: the active step stamps in while its simulation is in view. */}
          <aside className="hidden lg:block">
            <div className="sb-card sticky top-28 space-y-5 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em]">Three steps to launch</p>
              <ol className="space-y-4">
                {stages.map((stage, i) => (
                  <li key={stage.step}>
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById(`bake-step-${stage.step}`)
                          ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
                      }
                      aria-current={active === i ? 'step' : undefined}
                      className={`sb-focus flex w-full items-center gap-3 rounded-xl text-left transition-opacity duration-200 ${
                        active === i ? 'opacity-100' : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <StepBadge step={stage.step} color={stageStyles[i].color} active={active === i} />
                      <span>
                        <span className="block text-base font-bold leading-tight">{stage.title}</span>
                        <span className="block text-xs font-medium">{stage.short}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
              <div className="h-3 overflow-hidden rounded-full border-[2.5px] border-[var(--sb-ink)] bg-white">
                <motion.div className="h-full origin-left bg-[var(--sb-orange)]" style={{ scaleX: progress }} />
              </div>
            </div>
          </aside>

          <div ref={stepsRef} className="space-y-24 md:space-y-32">
            {stages.map((stage, index) => (
              <StageArticle key={stage.step} index={index} onActive={handleActive} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
