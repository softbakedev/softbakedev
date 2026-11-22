import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock3, Rocket, Target, Users, Zap } from 'lucide-react';
import { Bobblehead } from './sticker/Bobblehead';
import { SectionHeading } from './sticker/SectionHeading';

const danielLinkedIn = 'https://www.linkedin.com/in/barabdaniel/';
const janLinkedIn = 'https://www.linkedin.com/in/jan-vaca-a335a2152/';

const values = [
  {
    icon: Target,
    title: 'Design First',
    description: 'Every product starts with a clear design and a working prototype, so we know what to build before any code is written.',
    color: 'var(--sb-yellow)',
  },
  {
    icon: Clock3,
    title: 'Clear Timeline',
    description: 'We split the work into a real timeline with simple milestones, so progress stays visible from day one.',
    color: 'var(--sb-sky)',
  },
  {
    icon: Users,
    title: 'Baker Agents Do The Heavy Lifting',
    description: "Our baker agents write the code under the master chief's direction. They handle the repetitive build work so the team can focus on the product.",
    color: 'var(--sb-pink)',
  },
  {
    icon: CheckCircle2,
    title: 'Human Quality Check',
    description: 'A human master chief reviews the code and runs the tests on every batch, so what reaches your users actually works.',
    color: 'var(--sb-mint)',
  },
  {
    icon: Zap,
    title: 'Faster And Leaner',
    description: 'You get working software in a fraction of the time and at a fraction of the cost of a traditional development team.',
    color: 'var(--sb-orange)',
  },
  {
    icon: Rocket,
    title: 'Launch Ready',
    description: 'We prepare every release with clear handover, working infrastructure, and tested product flows ready for real users.',
    color: 'var(--sb-yellow)',
  },
];

function Polaroid({
  href,
  label,
  tilt,
  caption,
  children,
}: {
  href: string;
  label: string;
  tilt: number;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      // Drops in, gets taped up, then swings to rest like a pendulum hanging from the tape.
      initial={{ opacity: 0, y: -140, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={{ rotate: -tilt * 0.6, transition: { type: 'spring', stiffness: 160, damping: 6 } }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        y: { type: 'spring', stiffness: 260, damping: 20 },
        opacity: { duration: 0.2 },
        rotate: { type: 'spring', stiffness: 90, damping: 4, mass: 1.2, velocity: tilt > 0 ? 260 : -260, delay: 0.15 },
      }}
      style={{ transformOrigin: '50% -18px' }}
      className="sb-card sb-focus relative block p-3 pb-4"
    >
      <span className="absolute -top-4 left-1/2 h-7 w-28 -translate-x-1/2 rotate-[-4deg] border-2 border-[var(--sb-ink)] bg-[var(--sb-yellow)]/90" aria-hidden />
      <div className="aspect-[4/3] overflow-hidden rounded-xl border-[2.5px] border-[var(--sb-ink)]">
        {children}
      </div>
      <p className="mt-3 text-center text-sm font-bold">{caption}</p>
    </motion.a>
  );
}

export function About() {
  return (
    <section id="about" className="relative overflow-hidden border-b-[3px] border-[var(--sb-ink)] bg-[var(--sb-paper)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading chip="Human led delivery" chipColor="var(--sb-mint)" title="About our" highlight="digital bakery" highlightColor="var(--sb-pink)">
          A new way to build software. We design first, plan the timeline, and orchestrate the baker agents to ship it. A
          human master chief reviews and tests every release.
        </SectionHeading>

        <div className="mb-24 space-y-20">
          <article className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <Polaroid
              href={danielLinkedIn}
              label="Open Daniel Barab LinkedIn profile"
              tilt={-2.5}
              caption="Product direction"
            >
              <Bobblehead
                person="daniel"
                background="var(--sb-yellow)"
                apron="var(--sb-sky)"
                prop="rollingPin"
                label="Daniel Barab drawn as a bobblehead chef holding a rolling pin"
              />
            </Polaroid>
            <div className="space-y-5">
              <span className="sb-chip bg-[var(--sb-yellow)]">01 · Product direction</span>
              <h3 className="sb-display text-4xl sm:text-5xl">A new way to build software</h3>
              <p className="text-lg font-medium leading-relaxed text-[#3a332f]">
                We start where it matters most. We design and prototype the product, focus on the user experience, and
                validate the idea early. Then we turn it into a clear timeline and scope before any code is written.
              </p>
            </div>
          </article>

          <article className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <div className="space-y-5 lg:order-1">
              <span className="sb-chip bg-[var(--sb-pink)]">02 · Team orchestration</span>
              <h3 className="sb-display text-4xl sm:text-5xl">Master chief leads the bake</h3>
              <p className="text-lg font-medium leading-relaxed text-[#3a332f]">
                From there we orchestrate baker agents directly. The master chief drives the development workflow, reviews
                what the agents produce, and keeps the product on the roadmap. A human master chief reviews every change,
                runs the tests, and only ships when everything works as expected.
              </p>
              <p className="text-lg font-medium leading-relaxed text-[#3a332f]">
                The result is a faster and leaner delivery process. Products go from idea to working software in less time
                and at a fraction of the cost of traditional development companies.
              </p>
              <div className="grid grid-cols-2 gap-5 pt-2">
                {[
                  { value: '8+', label: 'Years baking', color: 'var(--sb-sky)', tilt: -3 },
                  { value: '30+', label: 'Agent bakers', color: 'var(--sb-yellow)', tilt: 2 },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ scale: 0, rotate: stat.tilt * 5 }}
                    whileInView={{ scale: 1, rotate: stat.tilt }}
                    whileHover={{ rotate: 0, scale: 1.05 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                    className="sb-card p-5 text-center"
                    style={{ background: stat.color }}
                  >
                    <div className="sb-display text-5xl">{stat.value}</div>
                    <div className="mt-1 font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:order-2">
              <Polaroid
                href={janLinkedIn}
                label="Open Jan Vaca LinkedIn profile"
                tilt={2.5}
                caption="Team orchestration"
              >
                <Bobblehead
                  person="jan"
                  background="var(--sb-pink)"
                  apron="var(--sb-orange)"
                  prop="whisk"
                  label="Jan Vaca drawn as a bobblehead chef holding a whisk"
                />
              </Polaroid>
            </div>
          </article>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, rotate: index % 2 ? 1 : -1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 240, damping: 18, delay: (index % 3) * 0.08 }}
                className="sb-card group flex h-full flex-col gap-4 p-6"
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl border-[2.5px] border-[var(--sb-ink)] shadow-[3px_3px_0_var(--sb-ink)] transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110"
                  style={{ background: value.color }}
                >
                  <Icon className="h-7 w-7" strokeWidth={2.25} />
                </span>
                <h4 className="text-xl font-bold leading-tight">{value.title}</h4>
                <p className="text-sm font-medium leading-relaxed text-[#3a332f]">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
