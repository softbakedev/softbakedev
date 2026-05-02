import { Link, Navigate, useParams } from 'react-router';
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { getRecipe } from '../data/recipes';
import { MarkdownArticle } from './MarkdownArticle';

export function RecipePage() {
  const { slug } = useParams();
  const recipe = getRecipe(slug);

  if (!recipe) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-orange-50/35 to-white pb-24 pt-32">
      <div className="absolute left-[-12rem] top-24 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" aria-hidden />
      <div className="absolute right-[-10rem] bottom-16 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm transition-colors hover:text-pink-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bakery
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-[2rem] border border-orange-100/80 bg-white/90 p-6 shadow-[0_25px_80px_rgba(251,146,60,0.14)] backdrop-blur sm:p-10"
        >
          <div className="mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
              <BookOpen className="h-4 w-4" />
              {recipe.category}
            </div>
            <h1 className="text-4xl font-bold text-gray-950 md:text-5xl">{recipe.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium text-gray-500">
              <span>{recipe.readTime}</span>
              <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-orange-600 hover:text-pink-600">
                Source recipe
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <MarkdownArticle markdown={recipe.markdown} assetBaseUrl={recipe.assetBaseUrl} />
        </motion.article>
      </div>
    </main>
  );
}
