import { Github, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { VelocityTape } from './sticker/VelocityTape';
import { Logo } from './sticker/Logo';
import { useCookieConsent } from './CookieConsent';

export function Footer() {
  const { openSettings } = useCookieConsent();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About the Bakery', href: '#about' },
      { label: 'Recipes', href: '#recipes' },
      { label: 'Contact', href: '#contact' },
    ],
    services: [
      { label: 'Claude Infrastructure', href: '#projects' },
      { label: 'GenAI', href: '#projects' },
      { label: 'Product & App Development', href: '#projects' },
    ],
    resources: [
      { label: 'Recipe Blog', href: '/recipes' },
      { label: 'Baked Goods', href: '#projects' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/softbakedev', label: 'GitHub' },
    { icon: Mail, href: 'mailto:info@softbake.dev', label: 'Email' },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('/')) {
      window.location.hash = href;
      return;
    }
    if (href.startsWith('#')) {
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      window.location.hash = '/';
      window.setTimeout(() => {
        document.getElementById(href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  };

  const columns = [
    { title: 'Company', links: footerLinks.company },
    { title: 'Services', links: footerLinks.services },
    { title: 'Resources', links: footerLinks.resources },
  ];

  return (
    <footer className="relative overflow-hidden bg-[var(--sb-ink)] text-white">
      <VelocityTape
        items={['Freshly baked software', 'Human checked', 'Agent built', 'Design first']}
        separator="✺"
        className="sb-display border-b-[3px] border-[var(--sb-ink)] bg-[var(--sb-yellow)] py-3 text-lg text-[var(--sb-ink)]"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-4">
              <Logo className="h-16 w-16" title="" />
              <span className="sb-display text-4xl text-[var(--sb-orange)]">softbake.dev</span>
            </div>
            <p className="mb-6 max-w-md font-medium leading-relaxed text-white/75">
              We design products, plan the timeline, and let our baker agents build them. A human master chief always
              reviews and tests the work, so what we ship just works.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="sb-focus grid h-11 w-11 place-items-center rounded-xl border-[2.5px] border-white bg-[var(--sb-ink)] text-white shadow-[3px_3px_0_var(--sb-orange)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[var(--sb-orange)] hover:text-[var(--sb-ink)]"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="sb-display mb-4 text-lg text-[var(--sb-yellow)]">{column.title}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(link.href)}
                      className="sb-focus text-left font-medium text-white/80 transition hover:translate-x-1 hover:text-[var(--sb-orange)]"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t-[2.5px] border-dashed border-white/30 pt-8 md:flex-row">
          <p className="text-sm text-white/60">© {currentYear} softbake.dev. All rights reserved. Baked with care.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/privacy-policy" className="text-white/60 transition-colors hover:text-[var(--sb-orange)]">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-white/60 transition-colors hover:text-[var(--sb-orange)]">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="text-white/60 transition-colors hover:text-[var(--sb-orange)]">
              Cookie Policy
            </Link>
            <button type="button" onClick={openSettings} className="sb-focus text-white/60 underline decoration-dotted underline-offset-4 transition-colors hover:text-[var(--sb-orange)]">
              Cookie settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
