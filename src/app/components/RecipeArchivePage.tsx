import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import { recipes } from '../data/recipes';
import { RecipeCard } from './RecipeCard';
import { PageShell } from './sticker/PageShell';

function searchableText(recipe: (typeof recipes)[number]) {
  return [recipe.title, recipe.category, recipe.description, recipe.readTime, recipe.markdown].join(' ').toLowerCase();
}

export function RecipeArchivePage() {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);
  const categories = React.useMemo(() => [...new Set(recipes.map((r) => r.category))].sort(), []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredRecipes = recipes.filter(
    (recipe) =>
      (!category || recipe.category === category) && (!normalizedQuery || searchableText(recipe).includes(normalizedQuery)),
  );

  return (
    <PageShell
      chip={
        <>
          <BookOpen className="h-4 w-4" />
          Recipe blog
        </>
      }
      title="All recipes"
      band="var(--sb-pink)"
      width="wide"
      intro="Notes from our digital bakery: practical recipes about product design, sprint planning, baker agents, testing and delivery."
      bandExtra={
        <div className="grid max-w-3xl gap-4">
          <label htmlFor="recipe-search" className="sr-only">
            Search recipes
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" />
            <input
              id="recipe-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, category or article content…"
              className="sb-input !bg-white py-4 pl-12"
            />
          </div>
          {categories.length > 1 ? (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {[null, ...categories].map((c) => (
                <button
                  key={c ?? 'all'}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                  className={`sb-chip sb-focus text-xs transition-transform hover:-translate-y-0.5 ${category === c ? '!bg-[var(--sb-ink)] text-white' : ''}`}
                >
                  {c ?? 'All'}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      }
    >
      <p className="mb-8 text-sm font-bold uppercase tracking-[0.12em]" aria-live="polite">
        {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
      </p>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.slug} recipe={recipe} index={index} />
          ))}
        </div>
      ) : (
        <div className="sb-card mx-auto max-w-xl rotate-[-1deg] bg-white p-8 text-center">
          <p className="sb-display text-2xl">Nothing in the oven</p>
          <p className="mt-3 font-medium text-[#3a332f]">
            {recipes.length === 0
              ? 'The first recipes are still baking. Check back soon.'
              : 'No recipe matches that search. Try a different word from the kitchen.'}
          </p>
        </div>
      )}
    </PageShell>
  );
}
