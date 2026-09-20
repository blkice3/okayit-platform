import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';

export const metadata: Metadata = {
  title: 'Safeguarding and data protection | OKAYiT',
  description:
    'How OKAYiT keeps young people safe. Protective mode, 24 hour helplines and UK data protection practice.',
  alternates: { canonical: '/safeguarding' },
};

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
      <h3 className="font-fraunces text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

export default function SafeguardingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
          <h1 className="font-fraunces text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Safety comes first
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
            OKAYiT is made for young people in care. We design every part around their safety.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-fraunces text-3xl font-bold text-gray-900">How we keep young people safe</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card title="Protective mode" body="A young person can reach help fast. It is always one tap away." />
          <Card title="24 hour helplines" body="Trusted helplines are built in. Support is there day and night." />
          <Card title="Staff alerts" body="Wellbeing alerts can reach your team quickly. Concerns are not missed." />
          <Card title="Age-suitable content" body="All content suits ages eight to seventeen. It is calm and kind." />
          <Card title="Private by default" body="Young people control what they share. Consent guides what we store." />
          <Card title="Clear records" body="Check-ins are logged with care. Staff can review them safely." />
        </div>
      </section>

      <section className="bg-purple-50">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="font-fraunces text-3xl font-bold text-gray-900">Data protection</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
            <p>We collect only what we need. We do not sell data.</p>
            <p>We keep data secure at all times.</p>
            <p>We follow UK data protection law. We follow good safeguarding practice.</p>
            <p>You can ask about the data we hold. We will help you.</p>
          </div>
          <div className="mt-8">
            <Link href="/privacy" className="rounded-lg border border-purple-200 bg-white px-6 py-3 text-sm font-semibold text-purple-700 hover:bg-white/70">
              Read our full privacy notice
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 px-8 py-12 text-center shadow-lg">
          <h2 className="font-fraunces text-3xl font-bold text-white">Have a safeguarding question?</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-purple-100">
            We are happy to talk it through. Get in touch with our team.
          </p>
          <div className="mt-8">
            <Link href="/contact" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
