import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

type LegalPageKind = 'privacy' | 'terms' | 'cookies';

const legalContent: Record<
  LegalPageKind,
  {
    eyebrow: string;
    title: string;
    intro: string;
    sections: Array<{ title: string; body: string }>;
  }
> = {
  privacy: {
    eyebrow: 'Privacy Policy',
    title: 'How we protect your recipe',
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
    intro:
      'These terms describe the basic rules for using the SoftBake website and starting a project conversation with us.',
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
    intro:
      'This page explains how cookies and similar technologies may be used on the SoftBake website.',
    sections: [
      {
        title: 'What cookies are',
        body:
          'Cookies are small files stored by your browser. They help websites remember preferences, measure traffic, and keep basic functionality working.',
      },
      {
        title: 'How we use cookies',
        body:
          'We may use essential cookies for website operation and lightweight analytics cookies to understand how visitors use the site. Analytics help us improve content, layout, and performance.',
      },
      {
        title: 'Third party services',
        body:
          'Some tools, hosting providers, or embedded services may set their own cookies. Their use is governed by their own policies.',
      },
      {
        title: 'Your control',
        body:
          'You can block or delete cookies in your browser settings. Some website features may work differently if cookies are disabled.',
      },
    ],
  },
};

export function LegalPage({ kind }: { kind: LegalPageKind }) {
  const content = legalContent[kind];

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-[2rem] border border-orange-100/80 bg-white/90 p-6 shadow-[0_25px_80px_rgba(251,146,60,0.14)] backdrop-blur sm:p-10"
        >
          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-orange-600">
              {content.eyebrow}
            </div>
            <h1 className="text-4xl font-bold text-gray-950 md:text-5xl">
              {content.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gray-600">
              {content.intro}
            </p>
          </div>

          <div className="grid gap-5">
            {content.sections.map((section) => (
              <section
                key={section.title}
                className="rounded-3xl border border-orange-100/70 bg-orange-50/25 p-5"
              >
                <h2 className="text-xl font-bold text-gray-950">{section.title}</h2>
                <p className="mt-3 leading-relaxed text-gray-600">{section.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-500">
            Last updated April 2026. For questions, contact{' '}
            <a href="mailto:info@softbake.dev" className="font-semibold text-orange-600 hover:text-pink-600">
              info@softbake.dev
            </a>
            .
          </p>
        </motion.div>
      </div>
    </main>
  );
}
