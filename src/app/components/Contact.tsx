import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, FileText, Mail, MapPin, Send } from 'lucide-react';
import { SectionHeading } from './sticker/SectionHeading';

const infoCards = [
  {
    icon: Mail,
    title: 'Email us',
    color: 'var(--sb-yellow)',
    body: (
      <a href="mailto:info@softbake.dev" className="font-medium underline decoration-2 underline-offset-4 hover:bg-[var(--sb-yellow)]">
        info@softbake.dev
      </a>
    ),
  },
  {
    icon: Building2,
    title: 'Company',
    color: 'var(--sb-sky)',
    body: (
      <>
        SoftBake s.r.o.
        <br />
        IČO: 17856566
      </>
    ),
  },
  {
    icon: FileText,
    title: 'Registry',
    color: 'var(--sb-pink)',
    body: (
      <>
        C 377904/MSPH
        <br />
        Incorporated 21. 12. 2022
      </>
    ),
  },
  {
    icon: MapPin,
    title: 'Registered office',
    color: 'var(--sb-mint)',
    body: (
      <>
        Štorkánova 3236/16, Smíchov
        <br />
        150 00 Praha 5, Czech Republic
      </>
    ),
  },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Contact request failed');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const labelClass = 'mb-2 block text-sm font-bold';

  return (
    <section
      id="contact"
      className="sb-grid-bg relative overflow-hidden border-b-[3px] border-[var(--sb-ink)] bg-[var(--sb-orange)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading chip="Start your recipe" chipColor="#fff" title="Place your" highlight="order" highlightColor="var(--sb-yellow)">
          Tell us about your product idea. We will reply with a clear plan and timeline, and show you how we would bake it.
        </SectionHeading>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: -0.75 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 160, damping: 16 }}
            className="sb-card flex flex-col gap-5 p-6 sm:p-8"
          >
            <div>
              <h3 className="sb-display text-3xl">Tell us what to bake</h3>
              <p className="mt-2 font-medium text-[#3a332f]">Share the product idea, timeline, and what you want working first.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Your name *
                </label>
                <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="sb-input" />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email address *
                </label>
                <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" className="sb-input" />
              </div>
            </div>

            <div>
              <label htmlFor="company" className={labelClass}>
                Company name
              </label>
              <input id="company" name="company" type="text" value={formData.company} onChange={handleChange} placeholder="Your Company" className="sb-input" />
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                Your project idea *
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you'd like us to bake for you..."
                rows={6}
                className="sb-input resize-y"
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="sb-btn sb-btn--flat group w-full text-lg">
              {isSubmitting ? 'Sending...' : 'Send order'}
              <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-rotate-12" />
            </button>

            {submitStatus === 'success' ? (
              <motion.p
                initial={{ scale: 0.6, rotate: -6 }}
                animate={{ scale: 1, rotate: -1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                className="rounded-xl border-[2.5px] border-[var(--sb-ink)] bg-[var(--sb-mint)] px-4 py-3 text-sm font-bold"
                role="status"
              >
                Thank you. We will get back to you with a plan and timeline soon.
              </motion.p>
            ) : null}
            {submitStatus === 'error' ? (
              <p className="rounded-xl border-[2.5px] border-[var(--sb-ink)] bg-[var(--sb-pink)] px-4 py-3 text-sm font-bold" role="alert">
                We could not send your order right now. Please email us at info@softbake.dev.
              </p>
            ) : null}
          </motion.form>

          <div className="grid gap-5">
            <h3 className="sb-display text-3xl">Visit our bakery</h3>
            {infoCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  whileHover={{ rotate: i % 2 ? 1.5 : -1.5, x: -4 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18, delay: i * 0.08 }}
                  className="sb-card flex items-start gap-4 p-4"
                >
                  <span
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border-[2.5px] border-[var(--sb-ink)]"
                    style={{ background: card.color }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={2.25} />
                  </span>
                  <div>
                    <div className="mb-1 font-bold">{card.title}</div>
                    <div className="font-medium text-[#3a332f]">{card.body}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
