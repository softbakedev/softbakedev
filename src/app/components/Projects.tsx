import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import projects from '../data/freshlyBakedGoods.json';

export function Projects() {
  const accents = [
    'from-orange-500 to-amber-500',
    'from-pink-500 to-rose-500',
    'from-rose-500 to-pink-600',
  ];

  return (
    <section id="projects" className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/35 to-white py-16 sm:py-20">
      <div className="absolute left-[-12rem] top-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" aria-hidden />
      <div className="absolute right-[-10rem] bottom-10 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto mb-10 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm">
            Fresh from the oven
          </div>
          <h2 className="text-4xl font-bold md:text-5xl">
            Freshly{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Baked Goods
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Products and platforms we have already shipped. Each one was designed first, planned with a clear timeline,
            and built with our baker agents under the master chief's direction.
          </p>
          <p className="mt-3 text-sm font-medium text-orange-600">
            Slide to explore
          </p>
        </motion.div>

        <div className="relative z-10 -mx-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden">
          <div className="flex snap-x snap-mandatory gap-5 sm:gap-6">
          {projects.map((project, index) => {
            const CardElement = project.url ? 'a' : 'article';
            return (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-[82vw] max-w-[25rem] shrink-0 snap-start sm:w-[24rem] lg:w-[25rem]"
            >
              <CardElement
                href={project.url}
                target={project.url ? '_blank' : undefined}
                rel={project.url ? 'noreferrer' : undefined}
                className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-orange-100/80 bg-white/90 shadow-[0_20px_60px_rgba(251,146,60,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_28px_80px_rgba(190,18,60,0.14)] ${
                  project.url ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2' : ''
                }`}
              >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accents[index % accents.length]}`} aria-hidden />

              <div className="relative h-40 overflow-hidden sm:h-44">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className={`mb-3 h-1 w-12 rounded-full bg-gradient-to-r ${accents[index % accents.length]}`} aria-hidden />
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                  {project.category}
                </p>
                <h3 className={`mb-3 text-2xl font-bold transition-all duration-300 group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent ${accents[index % accents.length]}`}>
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                  {project.description}
                </p>
              </div>
              </CardElement>
            </motion.div>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
}
