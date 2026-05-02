import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clock3, Rocket, Target, Users, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const masterChiefPortrait = new URL('../../assets/master-chief-agents-portrait.png', import.meta.url).href;
const masterChiefWorkbench = new URL('../../assets/master-chief-agents-workbench.png', import.meta.url).href;
const danielLinkedIn = 'https://www.linkedin.com/in/barabdaniel/';
const janLinkedIn = 'https://www.linkedin.com/in/jan-vaca-a335a2152/';

const values = [
  {
    icon: Target,
    title: 'Design First',
    description: 'Every product starts with a clear design and a working prototype, so we know what to build before any code is written.',
  },
  {
    icon: Clock3,
    title: 'Clear Timeline',
    description: 'We split the work into a real timeline with simple milestones, so progress stays visible from day one.',
  },
  {
    icon: Users,
    title: 'Baker Agents Do The Heavy Lifting',
    description: "Our baker agents write the code under the master chief's direction. They handle the repetitive build work so the team can focus on the product.",
  },
  {
    icon: CheckCircle2,
    title: 'Human Quality Check',
    description: 'A human master chief reviews the code and runs the tests on every batch, so what reaches your users actually works.',
  },
  {
    icon: Zap,
    title: 'Faster And Leaner',
    description: 'You get working software in a fraction of the time and at a fraction of the cost of a traditional development team.',
  },
  {
    icon: Rocket,
    title: 'Launch Ready',
    description: 'We prepare every release with clear handover, working infrastructure, and tested product flows ready for real users.',
  },
];

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-orange-100/80 bg-white/80 p-5 text-center shadow-[0_18px_45px_rgba(251,146,60,0.12)] backdrop-blur">
      <div className="mb-2 bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
        {value}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/35 to-white py-24">
      <div className="absolute left-[-12rem] top-28 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" aria-hidden />
      <div className="absolute right-[-10rem] bottom-24 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center mb-16"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm">
            Human led delivery
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About Our{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Digital Bakery
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A new way to build software. We design first, plan the timeline, and orchestrate the baker agents to ship it.
            A human master chief reviews and tests every release.
          </p>
        </motion.div>

        <div className="relative z-10 mb-20 space-y-14 lg:space-y-20">
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12"
          >
            <div className="relative">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-200/40 to-pink-200/40 blur-2xl" />
              <a
                href={danielLinkedIn}
                target="_blank"
                rel="noreferrer"
                aria-label="Open Daniel Barab LinkedIn profile"
                className="block rounded-[2rem] border border-orange-100/80 bg-white/80 p-3 shadow-[0_25px_80px_rgba(251,146,60,0.16)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_30px_90px_rgba(251,146,60,0.22)] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                  <ImageWithFallback
                    src={masterChiefWorkbench}
                    alt="Master chief orchestrating baker agents at the workbench"
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
              </a>
            </div>

            <div className="space-y-5 text-left lg:-mt-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px]">1</span>
                Product direction
              </div>
              <h3 className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                A new way to build software
              </h3>
              <p className="text-lg leading-relaxed text-gray-600">
                We start where it matters most. We design and prototype the product, focus on the user
                experience, and validate the idea early. Then we turn it into a clear timeline and scope
                before any code is written.
              </p>
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
            className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12"
          >
            <div className="space-y-5 text-left lg:order-1 lg:-mt-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-[11px]">2</span>
                Team orchestration
              </div>
              <h3 className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                Master chief leads the bake
              </h3>
              <p className="text-lg leading-relaxed text-gray-600">
                From there we orchestrate baker agents directly. The master chief drives the development
                workflow, reviews what the agents produce, and keeps the product on the roadmap. A human
                master chief reviews every change, runs the tests, and only ships when everything works as expected.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                The result is a faster and leaner delivery process. Products go from idea to working
                software in less time and at a fraction of the cost of traditional development companies.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <StatCard value="8+" label="Years Baking" />
                <StatCard value="30+" label="Agent Bakers" />
              </div>
            </div>

            <div className="relative lg:order-2">
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-pink-200/40 to-rose-200/40 blur-2xl" />
              <a
                href={janLinkedIn}
                target="_blank"
                rel="noreferrer"
                aria-label="Open Jan Vaca LinkedIn profile"
                className="block rounded-[2rem] border border-orange-100/80 bg-white/80 p-3 shadow-[0_25px_80px_rgba(190,18,60,0.14)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_30px_90px_rgba(190,18,60,0.2)] focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                  <ImageWithFallback
                    src={masterChiefPortrait}
                    alt="Master chief with baker agents"
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
              </a>
            </div>
          </motion.article>
        </div>

        {/* Values */}
        <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex h-full flex-col items-center rounded-[1.75rem] border border-orange-100/80 bg-white/85 p-6 text-center shadow-[0_18px_50px_rgba(251,146,60,0.1)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_24px_70px_rgba(190,18,60,0.12)]"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-orange-500 to-pink-600 shadow-[0_12px_30px_rgba(236,72,153,0.25)] ring-4 ring-orange-50 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-8 w-8 text-white" strokeWidth={2.25} />
                </div>
                <h4 className="mb-3 text-lg font-bold leading-tight text-gray-950">{value.title}</h4>
                <p className="text-sm leading-relaxed text-gray-600">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}