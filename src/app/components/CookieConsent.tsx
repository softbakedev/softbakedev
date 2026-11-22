import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';

/*
 * Cookie consent.
 *  - Necessary storage is always on (it only remembers this choice).
 *  - Analytics and marketing are off until the visitor opts in.
 *  - The choice is stored in this browser; "Cookie settings" in the footer and on the
 *    cookie policy page reopens the panel at any time.
 * Any future analytics or marketing script must check `useCookieConsent().consent`
 * (or listen for the `sb-cookie-consent` event) before it loads.
 */

export type ConsentCategory = 'analytics' | 'marketing';
export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** ISO date of the decision. */
  decidedAt: string;
  version: number;
};

const STORAGE_KEY = 'sb-cookie-consent';
const CONSENT_VERSION = 1;

export const COOKIE_CATEGORIES: Array<{
  id: 'necessary' | ConsentCategory;
  title: string;
  description: string;
  locked?: boolean;
}> = [
  {
    id: 'necessary',
    title: 'Necessary',
    description: 'Keeps the site working and remembers this cookie choice. Always on.',
    locked: true,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Lets us count visits and see which pages help people, so we can improve the site.',
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Lets us measure campaigns and show relevant SoftBake content on other sites.',
  },
];

function readConsent(): Consent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    return parsed.version === CONSENT_VERSION ? parsed : null;
  } catch {
    return null;
  }
}

function writeConsent(consent: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage blocked (private mode): the choice still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent('sb-cookie-consent', { detail: consent }));
}

type ConsentContextValue = {
  consent: Consent | null;
  openSettings: () => void;
};

const ConsentContext = React.createContext<ConsentContextValue>({ consent: null, openSettings: () => {} });

export function useCookieConsent() {
  return React.useContext(ConsentContext);
}

function Toggle({
  checked,
  disabled,
  onChange,
  id,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  id: string;
  label: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`sb-focus relative h-7 w-12 shrink-0 rounded-full border-[2.5px] border-[var(--sb-ink)] transition-colors ${
        checked ? 'bg-[var(--sb-mint)]' : 'bg-white'
      } ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[var(--sb-ink)] bg-[var(--sb-ink)] transition-[left] duration-200 ${
          checked ? 'left-[22px]' : 'left-[3px]'
        }`}
      />
    </button>
  );
}

function CookieSticker() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" aria-hidden>
      <circle cx={34} cy={34} r={26} fill="#111" />
      <path
        d="M30 4a26 26 0 1 0 28 28 9 9 0 0 1-10-9 9 9 0 0 1-9-9 9 9 0 0 1-9-10Z"
        fill="#E9B27A"
        stroke="#111"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <g fill="#5A3520">
        <circle cx={20} cy={24} r={3.5} />
        <circle cx={30} cy={40} r={3.5} />
        <circle cx={44} cy={44} r={3} />
        <circle cx={16} cy={40} r={2.5} />
        <circle cx={38} cy={28} r={2.5} />
      </g>
    </svg>
  );
}

function CookieBanner({
  initialChoices,
  startExpanded,
  onSave,
}: {
  initialChoices: Record<ConsentCategory, boolean>;
  startExpanded: boolean;
  onSave: (choices: Record<ConsentCategory, boolean>) => void;
}) {
  const reduce = useReducedMotion();
  const [expanded, setExpanded] = React.useState(startExpanded);
  const [choices, setChoices] = React.useState(initialChoices);
  const titleId = React.useId();

  return (
    <motion.div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      initial={reduce ? { opacity: 0 } : { y: 140, rotate: -4, opacity: 0 }}
      animate={{ y: 0, rotate: -1, opacity: 1 }}
      exit={reduce ? { opacity: 0 } : { y: 160, rotate: 6, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="sb-card fixed bottom-3 left-3 right-3 z-[60] max-h-[calc(100vh-24px)] overflow-y-auto bg-white p-5 sm:bottom-5 sm:left-5 sm:right-auto sm:w-[440px]"
    >
      <div className="flex items-start gap-4">
        <motion.span
          animate={reduce ? undefined : { rotate: [0, -12, 10, 0] }}
          transition={{ duration: 1.2, delay: 0.5, repeat: Infinity, repeatDelay: 4 }}
        >
          <CookieSticker />
        </motion.span>
        <div className="min-w-0">
          <h2 id={titleId} className="sb-display text-xl">
            Cookies, freshly baked
          </h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[#3a332f]">
            We use necessary storage to make this site work. With your OK we would also use analytics and marketing
            cookies. You choose, and you can change it any time under <b>Cookie settings</b>.{' '}
            <Link to="/cookie-policy" className="font-bold underline decoration-[var(--sb-orange)] decoration-2 underline-offset-2">
              Read the cookie policy
            </Link>
            .
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="settings"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="overflow-hidden"
          >
            <ul className="mt-4 grid gap-3">
              {COOKIE_CATEGORIES.map((cat) => {
                const id = `cookie-${cat.id}`;
                const checked = cat.locked ? true : choices[cat.id as ConsentCategory];
                return (
                  <li key={cat.id} className="flex items-start justify-between gap-3 rounded-xl border-[2.5px] border-[var(--sb-ink)] bg-[var(--sb-paper)] p-3">
                    <label htmlFor={id} className="min-w-0 text-sm">
                      <span className="block font-bold">{cat.title}</span>
                      <span className="block font-medium text-[#3a332f]">{cat.description}</span>
                    </label>
                    <Toggle
                      id={id}
                      label={cat.title}
                      checked={checked}
                      disabled={cat.locked}
                      onChange={(v) => setChoices((c) => ({ ...c, [cat.id]: v }))}
                    />
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onSave({ analytics: false, marketing: false })} className="sb-btn sb-btn--light !px-3 !py-2.5 text-sm">
          Reject all
        </button>
        <button type="button" onClick={() => onSave({ analytics: true, marketing: true })} className="sb-btn sb-btn--flat !px-3 !py-2.5 text-sm">
          Accept all
        </button>
        {expanded ? (
          <button
            type="button"
            onClick={() => onSave(choices)}
            className="sb-btn sb-btn--light col-span-2 !bg-[var(--sb-yellow)] !px-3 !py-2.5 text-sm"
          >
            Save my choices
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="sb-focus col-span-2 rounded-lg py-1 text-sm font-bold underline decoration-2 underline-offset-4"
          >
            Customize
          </button>
        )}
      </div>
    </motion.div>
  );
}

/** Provides the consent state to the app and shows the banner until the visitor decides. */
export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = React.useState<Consent | null>(null);
  const [ready, setReady] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const saved = readConsent();
    setConsent(saved);
    setReady(true);
    if (!saved) {
      // Let the page paint first, then slide the banner in.
      const t = window.setTimeout(() => setOpen(true), 700);
      return () => window.clearTimeout(t);
    }
  }, []);

  const save = (choices: Record<ConsentCategory, boolean>) => {
    const next: Consent = { necessary: true, ...choices, decidedAt: new Date().toISOString(), version: CONSENT_VERSION };
    writeConsent(next);
    setConsent(next);
    setOpen(false);
  };

  const openSettings = React.useCallback(() => {
    setExpanded(true);
    setOpen(true);
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, openSettings }}>
      {children}
      <AnimatePresence>
        {ready && open ? (
          <CookieBanner
            key="cookie-banner"
            startExpanded={expanded}
            initialChoices={{ analytics: consent?.analytics ?? false, marketing: consent?.marketing ?? false }}
            onSave={save}
          />
        ) : null}
      </AnimatePresence>
    </ConsentContext.Provider>
  );
}
