import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { recipes } from '../data/recipes';
import { RecipeCard } from './RecipeCard';

function searchableText(recipe: (typeof recipes)[number]) {
  return [
    recipe.title,
    recipe.category,
    recipe.description,
    recipe.readTime,
    recipe.markdown,
  ].join(' ').toLowerCase();
}

export function RecipeArchivePage() {
  const [query, setQuery] = React.useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredRecipes = normalizedQuery
    ? recipes.filter((recipe) => searchableText(recipe).includes(normalizedQuery))
    : recipes;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-orange-50/35 to-white pb-24 pt-32">
      <div className="absolute left-[-12rem] top-24 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" aria-hidden />
      <div className="absolute right-[-10rem] bottom-16 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <label htmlFor="recipe-search" className="sr-only">
            Search recipes
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500" />
            <input
              id="recipe-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, category, or article content..."
              className="w-full rounded-2xl border border-orange-100 bg-orange-50/30 py-4 pl-12 pr-4 text-gray-900 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </motion.div>

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.slug} recipe={recipe} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-orange-100/80 bg-white/90 p-8 text-center text-gray-600 shadow-[0_20px_60px_rgba(251,146,60,0.12)]">
            No recipes found. Try a different word from the kitchen.
          </div>
        )}
      </div>
    </main>
  );
}
