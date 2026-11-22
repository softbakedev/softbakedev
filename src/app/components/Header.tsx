import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { Logo } from './sticker/Logo';

const navItems = [
  { label: 'How we bake', id: 'services' },
  { label: 'Goods', id: 'projects' },
  { label: 'Bakery', id: 'about' },
  { label: 'Recipes', id: 'recipes' },
  { label: 'Contact', id: 'contact' },
];

/** Returns the id of the homepage section currently in the middle of the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const connect = () => {
      observer?.disconnect();
      const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
      if (elements.length === 0) {
        setActive(null);
        return;
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      elements.forEach((el) => observer?.observe(el));
    };

    connect();
    const onTop = () => {
      if (window.scrollY < 200) setActive(null);
    };
    window.addEventListener('scroll', onTop, { passive: true });
    window.addEventListener('hashchange', connect);
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onTop);
      window.removeEventListener('hashchange', connect);
    };
  }, [ids]);

  return active;
}

const sectionIds = navItems.map((item) => item.id);

export function Header() {
  const reduce = useReducedMotion();
  const [isCompact, setIsCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useActiveSection(sectionIds);

  // Header shrinks after the first scroll; the logo's hat tips with scroll speed.
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const hatTiltRaw = useTransform(scrollVelocity, [-2500, 0, 2500], [22, 0, -22], { clamp: true });
  const hatTilt = useSpring(hatTiltRaw, { stiffness: 260, damping: 14 });
  useMotionValueEvent(scrollY, 'change', (y) => setIsCompact(y > 40));

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
      return;
    }
    window.location.hash = '/';
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }, 80);
  };

  const goHome = () => {
    window.location.hash = '/';
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 80);
    setMobileMenuOpen(false);
  };

  const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };

  return (
    <motion.header
      initial={reduce ? false : { y: -120 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5"
    >
      <motion.div
        animate={{
          marginTop: isCompact ? 8 : 16,
          paddingTop: isCompact ? 4 : 8,
          paddingBottom: isCompact ? 4 : 8,
          maxWidth: isCompact ? 1120 : 1280,
        }}
        transition={reduce ? { duration: 0 } : spring}
        className={`mx-auto flex items-center justify-between gap-4 rounded-2xl border-[2.5px] border-[var(--sb-ink)] bg-white px-3 transition-shadow duration-200 sm:px-4 ${
          isCompact ? 'shadow-[5px_5px_0_var(--sb-ink)]' : 'shadow-[3px_3px_0_var(--sb-ink)]'
        }`}
      >
        <button
          type="button"
          aria-label="Home"
          title="Home"
          onClick={goHome}
          className="sb-focus flex items-center gap-2 rounded-xl"
        >
          <motion.span
            className="block"
            animate={{ width: isCompact ? 40 : 54, height: isCompact ? 40 : 54 }}
            transition={reduce ? { duration: 0 } : spring}
          >
            <Logo className="h-full w-full" title="" hatTilt={reduce ? undefined : hatTilt} />
          </motion.span>
          <span className="sb-display hidden -rotate-2 rounded-md border-[2.5px] border-[var(--sb-ink)] bg-[var(--sb-yellow)] px-2 pb-0.5 pt-1 text-base shadow-[3px_3px_0_var(--sb-ink)] sm:inline-block">
            softbake
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex lg:gap-2" aria-label="Main">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? 'true' : undefined}
                className="sb-focus group relative whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold"
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border-[2.5px] border-[var(--sb-ink)] bg-[var(--sb-yellow)] shadow-[2px_2px_0_var(--sb-ink)]"
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 26 }}
                  />
                ) : (
                  <span className="absolute inset-0 rounded-full border-[2.5px] border-transparent transition-colors group-hover:border-[var(--sb-ink)] group-hover:bg-[var(--sb-sky)]" />
                )}
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToSection('contact')}
            className="sb-btn sb-btn--flat hidden !px-4 !py-2 text-sm md:inline-flex"
          >
            Order now
          </button>
          <button
            type="button"
            className="sb-focus rounded-xl border-[2.5px] border-[var(--sb-ink)] bg-[var(--sb-yellow)] p-2 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, rotate: -2, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, rotate: 2, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 24 }}
            className="sb-card mx-auto mt-3 max-w-7xl p-4 md:hidden"
          >
            <div className="grid gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`sb-focus rounded-xl border-[2.5px] border-[var(--sb-ink)] px-4 py-2.5 text-left font-bold hover:bg-[var(--sb-sky)] ${
                    activeSection === item.id ? 'bg-[var(--sb-yellow)]' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button type="button" onClick={() => scrollToSection('contact')} className="sb-btn sb-btn--flat mt-2 w-full">
                Order now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
