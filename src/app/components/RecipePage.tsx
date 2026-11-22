import { Navigate, useParams } from 'react-router';
import { BookOpen, Clock, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { getRecipe } from '../data/recipes';
import { MarkdownArticle } from './MarkdownArticle';
import { PageShell } from './sticker/PageShell';

export function RecipePage() {
  const { slug } = useParams();
  const recipe = getRecipe(slug);
  const reduce = useReducedMotion();

  if (!recipe) {
    return <Navigate to="/recipes" replace />;
  }

  return (
    <PageShell
      chip={
        <>
          <BookOpen className="h-4 w-4" />
          {recipe.kind === 'planned' ? `${recipe.category} · Planned` : recipe.category}
        </>
      }
      chipColor="var(--sb-yellow)"
      title={recipe.title}
      band="var(--sb-sky)"
      backLinks={[
        { to: '/recipes', label: 'All recipes' },
        { to: '/', label: 'Back to bakery' },
      ]}
      bandExtra={
        <div className="flex flex-wrap items-center gap-3">
          <span className="sb-chip">
            <Clock className="h-4 w-4" />
            {recipe.readTime}
          </span>
          <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="sb-chip sb-focus transition-transform hover:-translate-y-0.5">
            Source recipe
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      }
    >
      <motion.article
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.2 }}
        className="sb-card bg-white p-6 sm:p-10"
      >
        <MarkdownArticle markdown={recipe.markdown} assetBaseUrl={recipe.assetBaseUrl} />
      </motion.article>
    </PageShell>
  );
}
