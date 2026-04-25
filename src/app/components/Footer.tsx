import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router';
import logo from '../../assets/chef_logo_256x256.svg';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About the Bakery', href: '#about' },
      { label: 'Recipes', href: '#recipes' },
      { label: 'Contact', href: '#contact' },
    ],
    services: [
      { label: 'How we bake ?', href: '#services' },
      { label: 'Product Design and Prototype', href: '#services' },
      { label: 'Baker Agents', href: '#services' },
      { label: 'Cloud Infrastructure', href: '#services' },
    ],
    resources: [
      { label: 'Recipe Blog', href: '#recipes' },
      { label: 'Baked Goods', href: '#projects' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
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

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/35 to-white text-gray-700">
      <div className="absolute left-[-10rem] top-10 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" aria-hidden />
      <div className="absolute right-[-10rem] bottom-10 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12 rounded-[2rem] border border-orange-100/80 bg-white/90 p-6 shadow-[0_25px_80px_rgba(251,146,60,0.14)] backdrop-blur sm:p-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="softbake.dev" className="w-10 h-10" />
              <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">softbake.dev</span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We design products, plan the timeline, and let our baker agents build them. A human master chief always
              reviews and tests the work, so what we ship just works.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl border border-orange-100 bg-orange-50/70 text-orange-600 flex items-center justify-center hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-600 hover:text-white transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-gray-950 font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-950 font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-gray-950 font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-orange-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500">
              © {currentYear} softbake.dev. All rights reserved. Baked with care.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-orange-600 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-gray-500 hover:text-orange-600 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookie-policy" className="text-gray-500 hover:text-orange-600 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}