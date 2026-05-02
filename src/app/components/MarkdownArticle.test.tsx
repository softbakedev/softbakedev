import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MarkdownArticle, resolveMarkdownUrl } from './MarkdownArticle';

const articleMarkdown = [
  '---',
  'title: Hidden metadata',
  '---',
  '',
  '![Master chief](./assets/master-chief-workbench.png)',
  '',
  '## The bakery promise',
  '',
  '1. [The bakery promise](#the-bakery-promise)',
  '2. Phase A. Discover. Steps one and two.',
  '   - Nested list item',
  '',
  '| Phase | Model class |',
  '|---|---|',
  '| Prototype | Cheap and fast |',
  '',
  '```mermaid',
  'flowchart LR',
  '  A --> B',
  '```',
  '',
  '> ### Recipe. Idea into Product',
  '>',
  '> **Ingredients**',
  '',
  '[Email us](mailto:hello@example.com)',
].join('\n');

describe('MarkdownArticle', () => {
  it('renders frontmatter-free GFM article structure with assets, anchors, and Mermaid controls', () => {
    const html = renderToStaticMarkup(
      <MarkdownArticle
        markdown={articleMarkdown}
        assetBaseUrl="https://raw.githubusercontent.com/softbakedev/recipes/main/example-recipe/"
      />,
    );

    expect(html).not.toContain('title: Hidden metadata');
    expect(html).toContain('src="https://raw.githubusercontent.com/softbakedev/recipes/main/example-recipe/assets/master-chief-workbench.png"');
    expect(html).toContain('id="the-bakery-promise"');
    expect(html).toContain('<ol');
    expect(html).toContain('<ul');
    expect(html).toContain('<table');
    expect(html).toContain('href="#the-bakery-promise"');
    expect(html).not.toContain('target="_blank" href="#the-bakery-promise"');
    expect(html).toContain('href="mailto:hello@example.com"');
    expect(html).toContain('Zoom in diagram');
    expect(html).toContain('Reset diagram zoom');
    expect(html).toContain('Zoom out diagram');
    expect(html).toContain('<blockquote');
  });

  it('leaves absolute, mailto, and anchor URLs unchanged', () => {
    expect(resolveMarkdownUrl('https://example.com/image.png', 'https://raw.example/base/')).toBe('https://example.com/image.png');
    expect(resolveMarkdownUrl('mailto:hello@example.com', 'https://raw.example/base/')).toBe('mailto:hello@example.com');
    expect(resolveMarkdownUrl('#section', 'https://raw.example/base/')).toBe('#section');
  });
});
