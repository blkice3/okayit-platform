import type { Metadata } from 'next';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';
import { ContactForm } from '@/components/public/contact-form';

export const metadata: Metadata = {
  title: 'Contact | OKAYiT',
  description:
    'Talk to the OKAYiT team. Book a pilot conversation or ask a question. We reply by email.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
          <h1 className="font-fraunces text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Let us talk
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
            Book a pilot conversation or ask a question. We will reply by email.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-fraunces text-2xl font-bold text-gray-900">Send us a message</h2>
            <p className="mt-2 text-sm text-gray-600">
              Tell us about your home or local authority. We will be in touch soon.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
              <h3 className="font-fraunces text-lg font-bold text-gray-900">Email us</h3>
              <p className="mt-2 text-sm text-gray-600">
                Prefer email? Write to us directly.
              </p>
              <a href="mailto:admin@okayit.uk" className="mt-3 inline-block text-sm font-semibold text-purple-700 hover:text-purple-800" suppressHydrationWarning>
                admin@okayit.uk
              </a>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6">
              <h3 className="font-fraunces text-lg font-bold text-gray-900">What to expect</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                <li>A short, friendly reply from our team.</li>
                <li>A chance to book a pilot conversation.</li>
                <li>No pressure and no sales talk.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
