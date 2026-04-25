import { motion } from 'motion/react';
import { BookOpen, Clock, Sparkles } from 'lucide-react';
import recipes from '../data/recipeBlog.json';

const accents = [
  'from-orange-500 to-amber-500',
  'from-pink-500 to-rose-500',
  'from-rose-500 to-pink-600',
];

export function Recipes() {
  return (
    <section id="recipes" className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/35 to-white py-20 sm:py-24">
      <div className="absolute left-[-12rem] top-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" aria-hidden />
      <div className="absolute right-[-10rem] bottom-10 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm">
            <BookOpen className="h-4 w-4" />
            Recipe blog
          </div>
          <h2 className="text-4xl font-bold md:text-5xl">
            Fresh{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Recipes
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Notes from our digital bakery. We will share practical recipes about product design, sprint planning, baker
            agents, testing, and delivery.
          </p>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {recipes.map((recipe, index) => (
            <motion.article
              key={recipe.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-orange-100/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(251,146,60,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_28px_80px_rgba(190,18,60,0.14)] sm:p-7"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accents[index % accents.length]}`} aria-hidden />
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accents[index % accents.length]} text-white shadow-[0_12px_30px_rgba(236,72,153,0.22)] transition-transform duration-300 group-hover:scale-110`}>
                <Sparkles className="h-7 w-7" />
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
                {recipe.category}
              </p>
              <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-950">
                {recipe.title}
              </h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                {recipe.description}
              </p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 pt-4 text-sm text-gray-500">
                <span>{recipe.date}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {recipe.readTime}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
