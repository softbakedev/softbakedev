import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('lists Goods-focused services', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(html).toContain('Claude Infrastructure');
    expect(html).toContain('GenAI');
    expect(html).toContain('Product &amp; App Development');
  });
});
