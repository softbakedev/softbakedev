export type RecipeSource = {
  slug: string;
  kind: 'published' | 'planned';
  markdown: string;
  sourceUrl: string;
  assetBaseUrl: string;
};

export type RecipeFrontmatter = {
  title?: string;
  category?: string;
  date?: string;
  order?: string;
  readTime?: string;
  excerpt?: string;
  status?: string;
};

export type Recipe = {
  slug: string;
  kind: 'published' | 'planned';
  title: string;
  category: string;
  date?: string;
  order?: number;
  status?: string;
  readTime: string;
  description: string;
  markdown: string;
  sourceUrl: string;
  assetBaseUrl: string;
};

const recipeModules = import.meta.glob([
  '../../../../recipes/*/README.md',
  '../../../../recipes/planning/*.md',
], {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

export function createRecipeSource(path: string, markdown: string): RecipeSource | null {
  const plannedSlug = path.match(/recipes\/planning\/([^/]+)\.md$/)?.[1];
  if (plannedSlug) {
    if (plannedSlug.toLowerCase() === 'readme') {
      return null;
    }

    return {
      slug: plannedSlug,
      kind: 'planned',
      markdown,
      sourceUrl: `https://github.com/softbakedev/recipes/blob/main/planning/${plannedSlug}.md`,
      assetBaseUrl: 'https://raw.githubusercontent.com/softbakedev/recipes/main/planning/',
    };
  }

  const publishedSlug = path.match(/recipes\/([^/]+)\/README\.md$/)?.[1];
  if (!publishedSlug) {
    return null;
  }

  return {
    slug: publishedSlug,
    kind: 'published',
    markdown,
    sourceUrl: `https://github.com/softbakedev/recipes/tree/main/${publishedSlug}`,
    assetBaseUrl: `https://raw.githubusercontent.com/softbakedev/recipes/main/${publishedSlug}/`,
  };
}

const recipeSources: RecipeSource[] = Object.entries(recipeModules)
  .flatMap(([path, markdown]) => {
    const source = createRecipeSource(path, markdown);
    return source ? [source] : [];
  })
  .sort((left, right) => left.slug.localeCompare(right.slug));

function firstParagraph(markdown: string) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => (
      line &&
      !line.startsWith('#') &&
      !line.startsWith('*Category') &&
      !line.startsWith('>') &&
      !line.startsWith('-') &&
      !/^\d+\./.test(line) &&
      !line.startsWith('![') &&
      !line.startsWith('|') &&
      !line.startsWith('```') &&
      !line.startsWith('---')
    ))[0] ?? '';
}

export function parseFrontmatter(markdown: string): RecipeFrontmatter {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return {};
  }

  return match[1].split('\n').reduce<RecipeFrontmatter>((metadata, line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      return metadata;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key) {
      metadata[key] = value.replace(/^['"]|['"]$/g, '');
    }
    return metadata;
  }, {});
}

export function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n?/, '').trimStart();
}

function parseOrder(order: string | undefined) {
  if (!order) {
    return undefined;
  }

  const parsed = Number(order);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function oneMonthAgo(referenceDate: Date) {
  const date = new Date(referenceDate);
  date.setMonth(date.getMonth() - 1);
  return date;
}

function isRecentPublished(recipe: Recipe, referenceDate: Date) {
  if (recipe.kind !== 'published' || !recipe.date) {
    return false;
  }

  const publishedAt = new Date(`${recipe.date}T00:00:00Z`);
  return Number.isFinite(publishedAt.getTime()) && publishedAt >= oneMonthAgo(referenceDate);
}

function recipeGroup(recipe: Recipe, referenceDate: Date) {
  if (isRecentPublished(recipe, referenceDate)) {
    return 0;
  }
  if (recipe.kind === 'planned') {
    return 1;
  }
  return 2;
}

function compareWithinGroup(left: Recipe, right: Recipe) {
  const leftOrder = left.order ?? Number.POSITIVE_INFINITY;
  const rightOrder = right.order ?? Number.POSITIVE_INFINITY;
  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  const dateCompare = (right.date ?? '').localeCompare(left.date ?? '');
  if (dateCompare !== 0) {
    return dateCompare;
  }

  return left.slug.localeCompare(right.slug);
}

export function orderRecipes(recipesToOrder: Recipe[], referenceDate = new Date()) {
  return [...recipesToOrder].sort((left, right) => {
    const groupCompare = recipeGroup(left, referenceDate) - recipeGroup(right, referenceDate);
    return groupCompare || compareWithinGroup(left, right);
  });
}

export function parseRecipeMarkdown(source: RecipeSource): Recipe {
  const frontmatter = parseFrontmatter(source.markdown);
  const markdown = stripFrontmatter(source.markdown);
  const title = frontmatter.title ?? markdown.match(/^#\s+(.+)$/m)?.[1] ?? source.slug;
  const metaLine = markdown.match(/^\*(?:.*?\.\s+)?Category\s+(.+?)\.\s+Read time\s+(.+?)\.\s*\*$/m)?.slice(1);
  const order = parseOrder(frontmatter.order);

  return {
    slug: source.slug,
    kind: source.kind,
    title,
    category: frontmatter.category ?? metaLine?.[0] ?? 'Recipe',
    date: frontmatter.date,
    order,
    status: frontmatter.status,
    readTime: frontmatter.readTime ?? metaLine?.[1] ?? 'Read time soon',
    description: frontmatter.excerpt ?? firstParagraph(markdown),
    markdown,
    sourceUrl: source.sourceUrl,
    assetBaseUrl: source.assetBaseUrl,
  };
}

export const recipes = orderRecipes(recipeSources.map(parseRecipeMarkdown));

export function getRecipe(slug: string | undefined) {
  return recipes.find((recipe) => recipe.slug === slug);
}
