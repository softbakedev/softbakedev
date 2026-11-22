import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SectionHeading } from './sticker/SectionHeading';
import { GoodsArt, hasGoodsArt } from './sticker/GoodsArt';
import projects from '../data/freshlyBakedGoods.json';

const tagColors = ['var(--sb-sky)', 'var(--sb-pink)', 'var(--sb-mint)', 'var(--sb-orange)'];
const tilts = [-2, 1.5, -1, 2];

type Project = (typeof projects)[number];

function ProjectCard({
  project,
  index,
  lean,
  wasDragged,
  onFocusCard,
}: {
  project: Project;
  index: number;
  lean: MotionValue<number>;
  wasDragged: () => boolean;
  onFocusCard: (element: HTMLElement) => void;
}) {
  const tilt = tilts[index % tilts.length];
  const CardElement = project.url ? motion.a : motion.article;
  const cta = 'cta' in project && project.cta ? project.cta : 'Open project';

  return (
    // Outer layer leans with drag speed; inner card keeps its own sticker tilt.
    <motion.div style={{ rotate: lean, transformOrigin: '50% 0%' }} className="w-[80vw] max-w-[24rem] shrink-0 sm:w-[23rem]">
      <CardElement
        href={project.url}
        target={project.url ? '_blank' : undefined}
        rel={project.url ? 'noreferrer' : undefined}
        draggable={false}
        onFocus={(event: React.FocusEvent<HTMLElement>) => {
          if (event.currentTarget.matches(':focus-visible')) onFocusCard(event.currentTarget);
        }}
        onClick={(event: React.MouseEvent) => {
          if (wasDragged()) event.preventDefault();
        }}
        initial={{ opacity: 0, y: 50, rotate: tilt * 4 }}
        whileInView={{ opacity: 1, y: 0, rotate: tilt }}
        whileHover={{ rotate: 0, y: -8, scale: 1.02 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 220, damping: 15, delay: index * 0.08 }}
        className={`sb-card sb-focus group flex h-full flex-col overflow-hidden ${project.url ? 'cursor-pointer' : ''}`}
      >
        <div className="relative h-44 overflow-hidden border-b-[2.5px] border-[var(--sb-ink)]">
          {hasGoodsArt(project.title) ? (
            <div className="pointer-events-none h-full w-full transition-transform duration-500 group-hover:scale-105">
              <GoodsArt title={project.title} label={`Illustration for ${project.title}`} />
            </div>
          ) : (
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              draggable={false}
              className="pointer-events-none h-full w-full object-cover grayscale-[30%] transition duration-500 group-hover:scale-110 group-hover:grayscale-0"
            />
          )}
          <span className="sb-chip absolute left-3 top-3 -rotate-3 text-xs" style={{ background: tagColors[index % tagColors.length] }}>
            {project.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="sb-display text-2xl leading-none">{project.title}</h3>
          <p className="flex-1 text-sm font-medium leading-relaxed text-[#3a332f] sm:text-base">{project.description}</p>
          {project.url ? (
            <span className="mt-2 inline-flex items-center gap-1 self-start rounded-full border-[2.5px] border-[var(--sb-ink)] bg-[var(--sb-ink)] px-3 py-1 text-sm font-bold text-white transition group-hover:bg-[var(--sb-orange)] group-hover:text-[var(--sb-ink)]">
              {cta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          ) : null}
        </div>
      </CardElement>
    </motion.div>
  );
}

export function Projects() {
  const reduce = useReducedMotion();
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [minX, setMinX] = React.useState(0);
  const draggedRef = React.useRef(false);

  // Track position, and a lean derived from how fast it moves.
  const x = useMotionValue(0);
  const velocity = useVelocity(x);
  const leanRaw = useTransform(velocity, [-1800, 0, 1800], [9, 0, -9], { clamp: true });
  const lean = useSpring(leanRaw, { stiffness: 300, damping: 18 });
  const noLean = useMotionValue(0);

  React.useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      const next = Math.min(0, viewport.clientWidth - track.scrollWidth);
      setMinX(next);
      if (x.get() < next) x.set(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (trackRef.current) observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [x]);

  const step = (direction: 1 | -1) => {
    const card = trackRef.current?.firstElementChild as HTMLElement | null;
    const distance = (card?.offsetWidth ?? 360) + 32;
    const target = Math.max(minX, Math.min(0, x.get() - direction * distance));
    animate(x, target, reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 26 });
  };

  // Keyboard users: bring a focused card into view since the track is moved by transform.
  const focusCard = (element: HTMLElement) => {
    const wrapper = element.parentElement;
    if (!wrapper) return;
    const target = Math.max(minX, Math.min(0, -wrapper.offsetLeft));
    animate(x, target, reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 26 });
  };

  return (
    <section id="projects" className="relative overflow-hidden border-b-[3px] border-[var(--sb-ink)] bg-[var(--sb-yellow)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading chip="Fresh from the oven" chipColor="#fff" title="Freshly" highlight="baked goods" highlightColor="var(--sb-orange)">
          Products and platforms we have already shipped. Each one was designed first, planned with a clear timeline, and
          built with our baker agents under the master chief&apos;s direction.
        </SectionHeading>

        <div className="-mt-4 mb-6 flex items-center justify-center gap-3">
          <button type="button" onClick={() => step(-1)} aria-label="Previous project" className="sb-btn sb-btn--light !p-2.5">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold uppercase tracking-[0.14em]">Drag to explore</span>
          <button type="button" onClick={() => step(1)} aria-label="Next project" className="sb-btn sb-btn--light !p-2.5">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <div ref={viewportRef} className="-mx-4 overflow-hidden px-4 pb-10 pt-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: minX, right: 0 }}
            dragElastic={0.12}
            dragTransition={{ power: 0.25, timeConstant: 260, bounceStiffness: 300, bounceDamping: 24 }}
            onDragStart={() => {
              draggedRef.current = true;
            }}
            onDragEnd={() => {
              window.setTimeout(() => {
                draggedRef.current = false;
              }, 60);
            }}
            style={{ x }}
            className="flex w-max cursor-grab gap-8 active:cursor-grabbing"
          >
            {projects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                lean={reduce ? noLean : lean}
                onFocusCard={focusCard}
                wasDragged={() => draggedRef.current}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
