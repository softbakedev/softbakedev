import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import { recipes } from '../data/recipes';
import { RecipeCard } from './RecipeCard';

export function Recipes() {
  const visibleRecipes = recipes.slice(0, 3);
  const hasMoreRecipes = recipes.length > visibleRecipes.length;

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
          {visibleRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.slug} recipe={recipe} index={index} />
          ))}
        </div>

        <div className="relative z-10 mt-10 flex justify-center">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(236,72,153,0.22)] transition-transform hover:-translate-y-0.5"
          >
            {hasMoreRecipes ? 'Discover more recipes' : 'Open recipe archive'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
