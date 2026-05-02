import { describe, expect, it } from 'vitest';
import {
  createRecipeSource,
  orderRecipes,
  parseFrontmatter,
  parseRecipeMarkdown,
  stripFrontmatter,
} from './recipes';

describe('recipe data layer', () => {
  it('uses frontmatter metadata for recipe card fields and generated URLs', () => {
    const recipe = parseRecipeMarkdown({
      slug: 'new-recipe',
      kind: 'published',
      sourceUrl: 'https://github.com/softbakedev/recipes/tree/main/new-recipe',
      assetBaseUrl: 'https://raw.githubusercontent.com/softbakedev/recipes/main/new-recipe/',
      markdown: [
        '---',
        'title: "Frontmatter title"',
        'category: Product',
        'date: 2026-04-27',
        'order: 2',
        'readTime: 7 min read',
        'excerpt: Build the right thing faster.',
        '---',
        '',
        '# Ignored fallback title',
        '',
        'Article body.',
      ].join('\n'),
    });

    expect(recipe).toMatchObject({
      slug: 'new-recipe',
      title: 'Frontmatter title',
      category: 'Product',
      date: '2026-04-27',
      order: 2,
      readTime: '7 min read',
      description: 'Build the right thing faster.',
      sourceUrl: 'https://github.com/softbakedev/recipes/tree/main/new-recipe',
      assetBaseUrl: 'https://raw.githubusercontent.com/softbakedev/recipes/main/new-recipe/',
      kind: 'published',
    });
    expect(recipe.markdown).not.toContain('title:');
  });

  it('falls back to Markdown title and first structural paragraph when metadata is missing', () => {
    const recipe = parseRecipeMarkdown({
      slug: 'fallback-recipe',
      kind: 'published',
      sourceUrl: 'https://github.com/softbakedev/recipes/tree/main/fallback-recipe',
      assetBaseUrl: 'https://raw.githubusercontent.com/softbakedev/recipes/main/fallback-recipe/',
      markdown: [
        '# Fallback title',
        '',
        '![Hero](./assets/hero.png)',
        '',
        '| Phase | Result |',
        '|---|---|',
        '| One | Done |',
        '',
        'This paragraph becomes the description.',
      ].join('\n'),
    });

    expect(recipe.title).toBe('Fallback title');
    expect(recipe.description).toBe('This paragraph becomes the description.');
    expect(recipe.category).toBe('Recipe');
    expect(recipe.readTime).toBe('Read time soon');
  });

  it('parses and strips frontmatter as pure helpers', () => {
    const markdown = [
      '---',
      'title: Helper title',
      'excerpt: Helper excerpt',
      '---',
      '',
      'Body content.',
    ].join('\n');

    expect(parseFrontmatter(markdown)).toEqual({
      title: 'Helper title',
      excerpt: 'Helper excerpt',
    });
    expect(stripFrontmatter(markdown)).toBe('Body content.');
  });

  it('creates published and planned recipe sources from repository paths', () => {
    expect(createRecipeSource('../../../../recipes/product-recipe/README.md', 'published body')).toMatchObject({
      slug: 'product-recipe',
      kind: 'published',
      sourceUrl: 'https://github.com/softbakedev/recipes/tree/main/product-recipe',
      assetBaseUrl: 'https://raw.githubusercontent.com/softbakedev/recipes/main/product-recipe/',
    });
    expect(createRecipeSource('../../../../recipes/planning/planning-a-sprint-kitchen-for-baker-agents.md', 'planned body')).toMatchObject({
      slug: 'planning-a-sprint-kitchen-for-baker-agents',
      kind: 'planned',
      sourceUrl: 'https://github.com/softbakedev/recipes/blob/main/planning/planning-a-sprint-kitchen-for-baker-agents.md',
      assetBaseUrl: 'https://raw.githubusercontent.com/softbakedev/recipes/main/planning/',
    });
    expect(createRecipeSource('../../../../recipes/planning/README.md', 'index')).toBeNull();
  });

  it('orders recent published articles first, planned articles next, then older published articles', () => {
    const recipes = [
      parseRecipeMarkdown({
        slug: 'old-published',
        kind: 'published',
        sourceUrl: 'https://example.com/old-published',
        assetBaseUrl: 'https://example.com/old-published/',
        markdown: [
          '---',
          'title: Old published',
          'date: 2026-02-01',
          'order: 1',
          '---',
          '',
          'Old body.',
        ].join('\n'),
      }),
      parseRecipeMarkdown({
        slug: 'planned',
        kind: 'planned',
        sourceUrl: 'https://example.com/planned',
        assetBaseUrl: 'https://example.com/planning/',
        markdown: [
          '---',
          'title: Planned',
          'status: coming-soon',
          'order: 3',
          '---',
          '',
          'Planned body.',
        ].join('\n'),
      }),
      parseRecipeMarkdown({
        slug: 'recent-published',
        kind: 'published',
        sourceUrl: 'https://example.com/recent-published',
        assetBaseUrl: 'https://example.com/recent-published/',
        markdown: [
          '---',
          'title: Recent published',
          'date: 2026-04-10',
          'order: 2',
          '---',
          '',
          'Recent body.',
        ].join('\n'),
      }),
    ];

    expect(orderRecipes(recipes, new Date('2026-04-27T00:00:00Z')).map((recipe) => recipe.slug)).toEqual([
      'recent-published',
      'planned',
      'old-published',
    ]);
  });
});
