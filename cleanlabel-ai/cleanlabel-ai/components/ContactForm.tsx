'use client';
// components/ContactForm.tsx
// Footer contact/feedback form that posts to Formspree
// Replace YOUR_FORMSPREE_ID with your actual Formspree form ID

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Mail } from 'lucide-react';

// ⚠️ Replace this with your actual Formspree form ID
// Get one free at https://formspree.io
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [values, setValues] = useState({ name: '', email: '', message: '' });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('message', values.message);

      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('success');
        setValues({ name: '', email: '', message: '' });
      } else {
        throw new Error('Formspree error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <footer
      id="contact"
      className="bg-[#F0EDE8] border-t border-[#E8E4DD] py-16 px-6"
    >
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#E8E4DD] mb-4">
            <Mail className="w-5 h-5 text-ink-secondary" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-ink-primary mb-2">
            Share Feedback
          </h2>
          <p className="text-ink-secondary font-body text-sm">
            Found a bug? Have a suggestion? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Success message */}
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-12 text-center"
          >
            <div className="w-14 h-14 rounded-full bg-sage-50 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-sage-600" />
            </div>
            <h3 className="font-display font-semibold text-ink-primary text-lg">
              Thanks for reaching out!
            </h3>
            <p className="text-ink-secondary font-body text-sm max-w-xs">
              We&apos;ve received your message and will get back to you soon.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-2 text-sm font-body text-ink-muted underline-offset-2 hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-body font-medium text-ink-secondary mb-1.5 uppercase tracking-wide">
                Message
              </label>
              <textarea
                name="message"
                value={values.message}
                onChange={handleChange}
                rows={4}
                placeholder="Your message…"
                required
                className="w-full px-4 py-3 rounded-xl border border-[#D8D3CC] bg-white/70 text-sm font-body text-ink-primary placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-sage-100 focus:border-sage-400 resize-none transition-all"
              />
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 text-sm font-body">
                <AlertCircle className="w-4 h-4" />
                Something went wrong. Please try again or email us directly.
              </div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={status === 'submitting'}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ink-primary text-white text-sm font-body font-medium shadow-soft hover:bg-[#333] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-ink-muted mt-8 font-body">
          Built with ❤️ using Next.js · Gemini AI · Supabase
        </p>
      </div>
    </footer>
  );
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-body font-medium text-ink-secondary mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-[#D8D3CC] bg-white/70 text-sm font-body text-ink-primary placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-sage-100 focus:border-sage-400 transition-all"
      />
    </div>
  );
}
