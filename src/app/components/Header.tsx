import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navItems = [
    { label: 'How we bake', id: 'services' },
    { label: 'Goods', id: 'projects' },
    { label: 'Bakery', id: 'about' },
    { label: 'Recipes', id: 'recipes' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[3.5rem] sm:min-h-16 py-3 sm:py-3.5">
          {/* Mobile: brand + menu */}
          <div className="flex md:hidden w-full items-center justify-between gap-4">
            <div className="min-w-0">
              <button
                type="button"
                aria-label="softbake.dev — scroll to top"
                onClick={goHome}
                className="rounded-lg -ml-1 px-1 py-0.5 sm:px-1.5"
              >
                <span className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  softbake.dev
                </span>
              </button>
            </div>
            <button
              type="button"
              className="shrink-0 -mr-1 p-2.5 text-gray-800 hover:text-orange-600 transition-colors rounded-lg hover:bg-white/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop: brand | centered nav | CTA */}
          <div className="hidden md:grid w-full grid-cols-[1fr_minmax(0,auto)_1fr] items-center gap-4 lg:gap-6">
            <div className="min-w-0 justify-self-start">
              <button
                type="button"
                aria-label="softbake.dev — scroll to top"
                onClick={goHome}
                className="rounded-lg px-1 py-0.5 sm:px-1.5"
              >
                <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                  softbake.dev
                </span>
              </button>
            </div>
            <nav
              className="flex min-w-0 items-center justify-center gap-3 lg:gap-4 xl:gap-6"
              aria-label="Main"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="whitespace-nowrap text-sm lg:text-[0.95rem] text-gray-800 hover:text-orange-600 transition-colors font-medium px-0.5 py-1"
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="justify-self-end">
              <Button
                onClick={() => scrollToSection('contact')}
                className="shrink-0 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
              >
                Order Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection('contact')}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600"
              >
                Order Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}