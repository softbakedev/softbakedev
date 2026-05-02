import { Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import type { Recipe } from '../data/recipes';

const accents = [
  'from-orange-500 to-amber-500',
  'from-pink-500 to-rose-500',
  'from-rose-500 to-pink-600',
];

export function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const categoryLabel = recipe.kind === 'planned' ? `${recipe.category} · Planned` : recipe.category;

  return (
    <motion.div
      key={recipe.title}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index, 5) * 0.08 }}
    >
      <Link
        to={`/recipes/${recipe.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-orange-100/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(251,146,60,0.12)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-pink-200 hover:shadow-[0_28px_80px_rgba(190,18,60,0.14)] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 sm:p-7"
      >
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accents[index % accents.length]}`} aria-hidden />
        <p className="mb-3 mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">
          {categoryLabel}
        </p>
        <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-950">
          {recipe.title}
        </h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600 sm:text-base">
          {recipe.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 pt-4 text-sm text-gray-500">
          <span>{recipe.kind === 'planned' ? 'Preview planned recipe' : 'Open recipe'}</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {recipe.readTime}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
