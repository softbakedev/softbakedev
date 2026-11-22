import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import type { Recipe } from '../data/recipes';
import { OvenTimer } from './sticker/OvenTimer';

const tagColors = ['var(--sb-yellow)', 'var(--sb-sky)', 'var(--sb-mint)'];
const tilts = [-1.5, 1, -0.75];

const MotionLink = motion.create(Link);

export function RecipeCard({ recipe, index }: { recipe: Recipe; index: number }) {
  const categoryLabel = recipe.kind === 'planned' ? `${recipe.category} · Planned` : recipe.category;
  const tilt = tilts[index % tilts.length];
  const [baking, setBaking] = React.useState(false);

  return (
    <MotionLink
      to={`/recipes/${recipe.slug}`}
      initial={{ opacity: 0, y: 40, rotate: tilt * 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={{ rotate: 0, y: -6 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 220, damping: 16, delay: Math.min(index, 5) * 0.08 }}
      onHoverStart={() => setBaking(true)}
      onHoverEnd={() => setBaking(false)}
      onFocus={() => setBaking(true)}
      onBlur={() => setBaking(false)}
      className="sb-card sb-focus group flex h-full flex-col p-6 sm:p-7"
    >
      <span className="sb-chip mb-4 self-start text-xs" style={{ background: tagColors[index % tagColors.length] }}>
        {categoryLabel}
      </span>
      <h3 className="sb-display mb-3 text-2xl leading-none">{recipe.title}</h3>
      <p className="mb-6 flex-1 text-sm font-medium leading-relaxed text-[#3a332f] sm:text-base">{recipe.description}</p>
      <div className="mt-auto flex items-end justify-between gap-3 border-t-[2.5px] border-dashed border-[var(--sb-ink)] pt-4 text-sm font-bold">
        <span className="inline-flex items-center gap-1 pb-1">
          {recipe.kind === 'planned' ? 'Preview planned recipe' : 'Open recipe'}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
        <span className="flex flex-col items-center gap-1">
          <OvenTimer readTime={recipe.readTime} running={baking} className="w-28" />
          <span className="text-xs font-bold">{recipe.readTime}</span>
        </span>
      </div>
    </MotionLink>
  );
}
