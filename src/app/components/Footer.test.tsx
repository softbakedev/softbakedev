import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';
import { COOKIE_CATEGORIES } from './CookieConsent';

describe('Footer', () => {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  );

  it('lists Goods-focused services', () => {
    expect(html).toContain('Claude Infrastructure');
    expect(html).toContain('GenAI');
    expect(html).toContain('Product &amp; App Development');
  });

  it('has no placeholder links', () => {
    expect(html).not.toContain('href="#"');
  });

  it('offers a way to reopen cookie settings and links every legal page', () => {
    expect(html).toContain('Cookie settings');
    expect(html).toContain('href="/privacy-policy"');
    expect(html).toContain('href="/terms-of-service"');
    expect(html).toContain('href="/cookie-policy"');
  });
});

describe('Cookie categories', () => {
  it('keeps necessary storage locked on and the optional categories opt-in', () => {
    const necessary = COOKIE_CATEGORIES.find((c) => c.id === 'necessary');
    expect(necessary?.locked).toBe(true);
    expect(COOKIE_CATEGORIES.filter((c) => !c.locked).map((c) => c.id)).toEqual(['analytics', 'marketing']);
  });
});
