import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, FileText, Mail, MapPin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock form submission
    console.log('Form submitted:', formData);
    alert('Thank you. We will get back to you with a plan and timeline soon.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-gradient-to-b from-white via-orange-50/35 to-white py-24">
      <div className="absolute left-[-12rem] top-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" aria-hidden />
      <div className="absolute right-[-10rem] bottom-16 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center mb-16"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/80 px-3 py-1 text-xs font-semibold text-orange-600 shadow-sm">
            Start your recipe
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Place Your{' '}
            <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
              Order
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tell us about your product idea. We will reply with a clear plan and timeline, and show you how we would bake it.
          </p>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-full"
          >
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-orange-200/40 to-pink-200/40 blur-2xl" />
            <form
              onSubmit={handleSubmit}
              className="flex h-full flex-col rounded-[2rem] border border-orange-100/80 bg-white/90 p-6 shadow-[0_25px_80px_rgba(251,146,60,0.14)] backdrop-blur sm:p-8"
            >
              <div className="mb-7">
                <h3 className="text-2xl font-bold text-gray-950">Tell us what to bake</h3>
                <p className="mt-2 text-gray-600">
                  Share the product idea, timeline, and what you want working first.
                </p>
              </div>
              <div className="flex flex-1 flex-col space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-xl border-orange-100 bg-orange-50/30 focus-visible:ring-orange-300"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border-orange-100 bg-orange-50/30 focus-visible:ring-orange-300"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company"
                  className="w-full rounded-xl border-orange-100 bg-orange-50/30 focus-visible:ring-orange-300"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your project idea *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you'd like us to bake for you..."
                  rows={6}
                  className="w-full rounded-xl border-orange-100 bg-orange-50/30 focus-visible:ring-orange-300"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="mt-auto w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 group"
              >
                Send Order
                <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-full space-y-8"
          >
            {/* Info Cards */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-pink-200/35 to-rose-200/35 blur-2xl" />
            <div className="flex h-full flex-col rounded-[2rem] border border-orange-100/80 bg-white/85 p-6 shadow-[0_25px_80px_rgba(190,18,60,0.12)] backdrop-blur sm:p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-950">Visit Our Bakery</h3>
                <p className="mt-2 text-gray-600">
                  Registered company details and the best inbox for new recipes.
                </p>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4">

              <div className="flex items-start gap-4 rounded-2xl border border-orange-100/70 bg-white/80 p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_10px_25px_rgba(236,72,153,0.18)]">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Email Us</div>
                  <a
                    href="mailto:info@softbake.dev"
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    info@softbake.dev
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-orange-100/70 bg-white/80 p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_10px_25px_rgba(236,72,153,0.18)]">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Company</div>
                  <p className="text-gray-600">
                    SoftBake s.r.o.
                    <br />
                    IČO: 17856566
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-orange-100/70 bg-white/80 p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_10px_25px_rgba(236,72,153,0.18)]">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Registry</div>
                  <p className="text-gray-600">
                    C 377904/MSPH
                    <br />
                    Incorporated 21. 12. 2022
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-orange-100/70 bg-white/80 p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_10px_25px_rgba(236,72,153,0.18)]">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Registered Office</div>
                  <p className="text-gray-600">
                    Štorkánova 3236/16, Smíchov
                    <br />
                    150 00 Praha 5, Czech Republic
                  </p>
                </div>
              </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}