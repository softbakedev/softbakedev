import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router';
import { recipes } from '../data/recipes';
import { RecipeCard } from './RecipeCard';
import { SectionHeading } from './sticker/SectionHeading';

export function Recipes() {
  const visibleRecipes = recipes.slice(0, 3);
  const hasMoreRecipes = recipes.length > visibleRecipes.length;

  return (
    <section
      id="recipes"
      className="sb-grid-bg relative overflow-hidden border-b-[3px] border-[var(--sb-ink)] bg-[var(--sb-pink)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          chip={
            <>
              <BookOpen className="h-4 w-4" />
              Recipe blog
            </>
          }
          chipColor="#fff"
          title="Fresh"
          highlight="recipes"
          highlightColor="var(--sb-yellow)"
        >
          Notes from our digital bakery. Practical recipes about product design, sprint planning, baker agents, testing,
          and delivery.
        </SectionHeading>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {visibleRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.slug} recipe={recipe} index={index} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/recipes" className="sb-btn group">
            {hasMoreRecipes ? 'Discover more recipes' : 'Open recipe archive'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
