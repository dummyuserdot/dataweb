import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { WHATSAPP_BUSINESS_NUMBER } from '../config/whatsapp';

interface ContactFormState {
  name: string;
  email: string;
  topic: string;
  message: string;
}

const INITIAL_CONTACT: ContactFormState = {
  name: '',
  email: '',
  topic: 'Private Salon Appointment',
  message: '',
};

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>(INITIAL_CONTACT);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof ContactFormState, string>> = {};
    if (form.name.trim().length < 2) nextErrors.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please provide a valid email address.';
    }
    if (form.message.trim().length < 10) {
      nextErrors.message = 'Please enter a message of at least 10 characters.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setForm(INITIAL_CONTACT);
    setErrors({});
  };

  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-10 sm:py-14">
      <div className="border-b border-white/[0.08] pb-6 sm:pb-8">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
          Private Client Services
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-normal text-[#FDFBF7]">
          Concierge & Salon Inquiries
        </h1>
      </div>

      <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left: Direct Channels & WhatsApp */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#D0C5AF]">
            Whether you seek private viewing of a limited tourbillon, bespoke strap sizing, or
            international insured delivery details, our Geneva horological advisors respond within
            two business hours.
          </p>

          <div className="space-y-5 border-y border-white/[0.08] py-6">
            <div className="flex items-start gap-3.5">
              <Mail className="h-5 w-5 text-[#D4AF37] mt-0.5 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF]">
                  Direct Email
                </p>
                <a
                  href="mailto:concierge@valmont-geneve.ch"
                  className="mt-1 block text-sm text-[#FDFBF7] hover:text-[#F2CA50] break-all"
                >
                  concierge@valmont-geneve.ch
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Phone className="h-5 w-5 text-[#D4AF37] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF]">
                  Salon Telephone
                </p>
                <a
                  href="tel:+41225550194"
                  className="mt-1 block text-sm tabular-nums text-[#FDFBF7] hover:text-[#F2CA50]"
                >
                  +41 22 555 0194
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <MapPin className="h-5 w-5 text-[#D4AF37] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF]">
                  Geneva Flagship Salon
                </p>
                <p className="mt-1 text-sm text-[#FDFBF7]">
                  Rue du Rhône 42, 1204 Genève, Switzerland
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Concierge */}
          <div>
            <a
              href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(
                'Hello Valmont Genève Concierge, I would like assistance selecting a timepiece.',
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-3 rounded border border-[#D4AF37]/50 bg-[#D4AF37]/12 px-5 sm:px-6 py-3.5 text-xs font-semibold tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[#F2CA50] hover:bg-[#D4AF37] hover:text-[#0B0C10] transition-colors text-center"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

          {/* Social Channels */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-3">
              Maison Channels
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs tracking-[0.12em] uppercase">
              {[
                { label: 'Instagram', href: 'https://instagram.com' },
                { label: 'LinkedIn', href: 'https://linkedin.com' },
                { label: 'YouTube', href: 'https://youtube.com' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center rounded border border-white/12 px-4 py-2 text-[#D0C5AF] hover:border-[#D4AF37] hover:text-[#F2CA50] transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Validated Contact Form */}
        <div className="lg:col-span-7 glass-sapphire rounded-lg p-5 sm:p-8 lg:p-10">
          {submitted ? (
            <div className="py-10 sm:py-12 text-center space-y-4">
              <CheckCircle2 className="h-10 w-10 text-[#D4AF37] mx-auto" />
              <h2 className="font-serif text-2xl text-[#FDFBF7]">
                Your Inquiry Has Been Received
              </h2>
              <p className="mx-auto max-w-md text-sm text-[#9CA3AF]">
                A dedicated Valmont Genève advisor has received your message and will reply via
                email shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 min-h-[44px] rounded border border-[#D4AF37]/40 px-6 py-2.5 text-xs font-medium tracking-[0.14em] uppercase text-[#F2CA50] hover:bg-[#D4AF37]/10 cursor-pointer"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <h2 className="font-serif text-2xl text-[#FDFBF7]">Send a Concierge Message</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Claire Beaumont"
                    className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] px-4 py-3 text-base sm:text-sm text-[#FDFBF7] focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.name && <p className="mt-1 text-xs text-[#FFB4AB]">{errors.name}</p>}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="claire@domain.com"
                    className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] px-4 py-3 text-base sm:text-sm text-[#FDFBF7] focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.email && <p className="mt-1 text-xs text-[#FFB4AB]">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-topic"
                  className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                >
                  Subject of Inquiry
                </label>
                <select
                  id="contact-topic"
                  value={form.topic}
                  onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                  className="w-full min-h-[44px] rounded border border-white/12 bg-[#0E1015] px-4 py-3 text-base sm:text-sm text-[#FDFBF7] focus:border-[#D4AF37] focus:outline-none"
                >
                  <option>Private Salon Appointment</option>
                  <option>Timepiece Allocation & Availability</option>
                  <option>Bespoke Engraving & Strap Sizing</option>
                  <option>Service & Warranty Assistance</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9CA3AF] mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Share the timepiece reference or assistance you require..."
                  className="w-full rounded border border-white/12 bg-[#0E1015] px-4 py-3 text-base sm:text-sm text-[#FDFBF7] focus:border-[#D4AF37] focus:outline-none"
                />
                {errors.message && <p className="mt-1 text-xs text-[#FFB4AB]">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto min-h-[44px] rounded bg-gradient-to-r from-[#D4AF37] to-[#C59F2E] px-8 py-3.5 text-xs font-semibold tracking-[0.16em] uppercase text-[#0B0C10] transition-all hover:brightness-110 gold-glow-hover cursor-pointer"
              >
                Submit Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
