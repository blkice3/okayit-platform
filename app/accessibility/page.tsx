import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Eye, Keyboard, Volume2, Smartphone, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: 'OKAYiT accessibility commitment and features.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-purple-600 font-semibold hover:text-purple-800 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Accessibility Statement</h1>
            <p className="text-sm text-gray-500">Last updated: 3 June 2025</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <h2 className="text-lg font-bold text-blue-800 mb-2">Our Commitment</h2>
          <p className="text-sm text-blue-900 leading-relaxed">
            OKAYiT is committed to ensuring digital accessibility for all young people, staff and visitors.
            We are continually improving the user experience for everyone, working towards conformance with
            the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 text-sm text-gray-700 leading-relaxed">

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-blue-500" /> Visual Accessibility
            </h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>High-contrast colour scheme with a minimum 4.5:1 contrast ratio for body text.</li>
              <li>Dark mode support for users who prefer reduced brightness.</li>
              <li>Scalable text, the platform works with browser zoom up to 200%.</li>
              <li>Colour-coded mood indicators always include text labels and emoji, never colour alone.</li>
              <li>All images and icons have descriptive alternative text.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4 text-blue-500" /> Keyboard &amp; Navigation
            </h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>All interactive elements are reachable by keyboard (Tab / Shift+Tab).</li>
              <li>Visible focus indicators on all buttons, links and form fields.</li>
              <li>Logical tab order throughout all pages.</li>
              <li>Skip-to-content links for screen reader users.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Volume2 className="w-4 h-4 text-blue-500" /> Screen Readers
            </h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>Semantic HTML headings and landmarks for screen reader navigation.</li>
              <li>ARIA labels on interactive components where native labels are insufficient.</li>
              <li>Form inputs linked to visible labels.</li>
              <li>Status messages announced via ARIA live regions.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Smartphone className="w-4 h-4 text-blue-500" /> Mobile &amp; Touch
            </h3>
            <ul className="list-disc ml-5 space-y-1">
              <li>Responsive design optimised for mobile-first use.</li>
              <li>Minimum 44×44px touch targets on all interactive elements.</li>
              <li>Swipe-friendly navigation and gesture support.</li>
              <li>Installable as a Progressive Web App (PWA) on iOS and Android.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <MessageCircle className="w-4 h-4 text-blue-500" /> Known Limitations
            </h3>
            <p>We are aware of the following areas for improvement and are actively working on them:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Some third-party embedded content (e.g. video players) may not be fully accessible.</li>
              <li>Complex interactive components (360° tours) may have limited screen reader support.</li>
              <li>PDF downloads may not yet be fully tagged for assistive technology.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-2">Feedback &amp; Contact</h3>
            <p>If you encounter any accessibility barriers on OKAYiT, please let us know:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Email: <a href="mailto:accessibility@okayit.uk" className="text-purple-600 underline">accessibility@okayit.uk</a></li>
              <li>Speak to your key worker or care home staff.</li>
            </ul>
            <p className="mt-2">We aim to respond to accessibility feedback within 5 working days.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-900 mb-2">Enforcement</h3>
            <p>
              If you are not satisfied with our response, you can contact the{' '}
              <a href="https://www.equalityadvisoryservice.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">Equality Advisory Support Service (EASS)</a>.
            </p>
          </section>
        </div>

        <div className="text-center mt-8 mb-4">
          <Link href="/login" className="text-sm text-purple-600 font-semibold hover:underline">
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
