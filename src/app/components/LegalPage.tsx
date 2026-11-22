import { Link } from 'react-router';
import { motion, useReducedMotion } from 'motion/react';
import { Cookie, FileText, ShieldCheck } from 'lucide-react';
import { PageShell } from './sticker/PageShell';
import { COOKIE_CATEGORIES, useCookieConsent } from './CookieConsent';

type LegalPageKind = 'privacy' | 'terms' | 'cookies';

const legalContent: Record<
  LegalPageKind,
  {
    eyebrow: string;
    title: string;
    intro: string;
    band: string;
    updated: string;
    sections: Array<{ title: string; body: string }>;
  }
> = {
  privacy: {
    eyebrow: 'Privacy Policy',
    title: 'How we protect your recipe',
    band: 'var(--sb-sky)',
    updated: 'April 2026',
    intro:
      'This page explains how SoftBake s.r.o. handles personal information when you contact us, use this website, or discuss a product idea with us.',
    sections: [
      {
        title: 'Information we collect',
        body:
          'We collect the details you choose to send through the contact form, such as your name, email address, company name, and project message. We may also receive basic technical information from hosting and analytics tools, such as browser type, device information, and approximate location.',
      },
      {
        title: 'How we use it',
        body:
          'We use your information to reply to your request, prepare a project plan, communicate about services, improve the website, and keep basic business records. We do not sell your personal information.',
      },
      {
        title: 'Who can access it',
        body:
          'Access is limited to people and service providers who need it to operate the website, answer your request, or deliver agreed work. When we use trusted providers, we expect them to protect the data and use it only for the agreed purpose.',
      },
      {
        title: 'Your choices',
        body:
          'You can ask us to update, export, or delete your personal information where the law allows it. Send privacy requests to info@softbake.dev.',
      },
    ],
  },
  terms: {
    eyebrow: 'Terms of Service',
    title: 'The rules of the bakery',
    band: 'var(--sb-mint)',
    updated: 'April 2026',
    intro: 'These terms describe the basic rules for using the SoftBake website and starting a project conversation with us.',
    sections: [
      {
        title: 'Using this website',
        body:
          'You may browse this website and contact us about a product idea. You agree not to misuse the site, attempt to disrupt it, or send harmful, unlawful, or misleading content.',
      },
      {
        title: 'Project discussions',
        body:
          'Sending a message does not create a contract, guarantee availability, or require us to start work. Project scope, price, timeline, ownership, and delivery details are agreed separately in writing.',
      },
      {
        title: 'Content and intellectual property',
        body:
          'The website design, copy, images, logos, and code belong to SoftBake s.r.o. or their respective owners. You may not copy or reuse them without permission, except where allowed by law.',
      },
      {
        title: 'No warranty',
        body:
          'The website is provided as is. We try to keep information accurate and available, but we do not promise that the site will always be error free, complete, or uninterrupted.',
      },
    ],
  },
  cookies: {
    eyebrow: 'Cookie Policy',
    title: 'Small crumbs we may use',
    band: 'var(--sb-yellow)',
    updated: 'November 2026',
    intro: 'This page explains how cookies and similar technologies are used on the SoftBake website, and how you choose which ones are allowed.',
    sections: [
      {
        title: 'What cookies are',
        body:
          'Cookies are small files stored by your browser. Similar technologies, such as your browser’s local storage, work the same way. They help websites remember preferences, measure traffic, and keep basic functionality working.',
      },
      {
        title: 'Your consent',
        body:
          'When you first visit, we ask which cookies you allow. Necessary storage is always on; analytics and marketing cookies only run after you say yes. Your choice is saved in your browser, and you can change or withdraw it at any time with the Cookie settings button on this page or in the footer.',
      },
      {
        title: 'Third party services',
        body:
          'Some tools, hosting providers, or embedded services may set their own cookies. They only do so in the categories you allow, and their use is governed by their own policies.',
      },
      {
        title: 'Your control',
        body:
          'Besides the Cookie settings, you can block or delete cookies in your browser settings. Some website features may work differently if cookies are disabled.',
      },
    ],
  },
};

const legalLinks: Array<{ kind: LegalPageKind; to: string; label: string; icon: typeof FileText }> = [
  { kind: 'privacy', to: '/privacy-policy', label: 'Privacy', icon: ShieldCheck },
  { kind: 'terms', to: '/terms-of-service', label: 'Terms', icon: FileText },
  { kind: 'cookies', to: '/cookie-policy', label: 'Cookies', icon: Cookie },
];

const sectionId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function CookieChoices() {
  const { consent, openSettings } = useCookieConsent();
  const state = (id: string) => {
    if (id === 'necessary') return 'Always on';
    if (!consent) return 'Not decided yet';
    return consent[id as 'analytics' | 'marketing'] ? 'Allowed' : 'Off';
  };
  return (
    <section className="sb-card bg-[var(--sb-yellow)] p-6 sm:p-8" aria-labelledby="cookie-choices">
      <h2 id="cookie-choices" className="sb-display text-2xl">
        Your cookie choices
      </h2>
      <div className="mt-5 overflow-x-auto rounded-xl border-[2.5px] border-[var(--sb-ink)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b-[2.5px] border-[var(--sb-ink)] bg-[var(--sb-paper)]">
            <tr>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">What it does</th>
              <th className="px-4 py-3 font-bold">Your choice</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-dashed divide-[rgba(17,17,17,.2)] font-medium">
            {COOKIE_CATEGORIES.map((cat) => (
              <tr key={cat.id}>
                <td className="px-4 py-3 font-bold">{cat.title}</td>
                <td className="px-4 py-3 text-[#3a332f]">{cat.description}</td>
                <td className="whitespace-nowrap px-4 py-3">{state(cat.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={openSettings} className="sb-btn sb-btn--flat mt-5">
        <Cookie className="h-4 w-4" />
        Cookie settings
      </button>
    </section>
  );
}

export function LegalPage({ kind }: { kind: LegalPageKind }) {
  const content = legalContent[kind];
  const reduce = useReducedMotion();

  return (
    <PageShell
      chip={content.eyebrow}
      title={content.title}
      intro={content.intro}
      band={content.band}
      bandExtra={
        <nav aria-label="Legal pages" className="flex flex-wrap gap-2">
          {legalLinks.map((l) => {
            const Icon = l.icon;
            const active = l.kind === kind;
            return (
              <Link
                key={l.kind}
                to={l.to}
                aria-current={active ? 'page' : undefined}
                className={`sb-chip sb-focus text-xs transition-transform hover:-translate-y-0.5 ${active ? '!bg-[var(--sb-ink)] text-white' : ''}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      }
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sb-card sticky top-28 bg-white p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em]">On this page</p>
            <ol className="grid gap-2 text-sm font-bold">
              {content.sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#${sectionId(s.title)}`} onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(sectionId(s.title))?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
                  }} className="sb-focus flex gap-2 rounded-md hover:bg-[var(--sb-yellow)]">
                    <span className="text-[var(--sb-orange)]">{i + 1}.</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="grid min-w-0 gap-6">
          {content.sections.map((section, i) => (
            <motion.section
              key={section.title}
              id={sectionId(section.title)}
              initial={reduce ? false : { opacity: 0, y: 30, rotate: i % 2 ? 1 : -1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="sb-card scroll-mt-28 bg-white p-6 sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span className="sb-display grid h-10 w-10 shrink-0 -rotate-6 place-items-center rounded-full border-[2.5px] border-[var(--sb-ink)] text-base" style={{ background: content.band }}>
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold sm:text-2xl">{section.title}</h2>
                  <p className="mt-3 text-base font-medium leading-relaxed text-[#3a332f] sm:text-lg">{section.body}</p>
                </div>
              </div>
            </motion.section>
          ))}

          {kind === 'cookies' ? <CookieChoices /> : null}

          <p className="text-sm font-medium">
            Last updated {content.updated}. For questions, contact{' '}
            <a href="mailto:info@softbake.dev" className="font-bold underline decoration-[var(--sb-orange)] decoration-2 underline-offset-4 hover:bg-[var(--sb-yellow)]">
              info@softbake.dev
            </a>
            .
          </p>
        </div>
      </div>
    </PageShell>
  );
}
