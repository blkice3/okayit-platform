import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';

export const metadata: Metadata = {
  title: 'For homes | OKAYiT',
  description:
    'How OKAYiT supports registered managers and staff in children\u2019s residential care. A simple tool for a smoother welcome and steady wellbeing support.',
  alternates: { canonical: '/for-homes' },
};

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
      <h3 className="font-fraunces text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

export default function ForHomesPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
          <h1 className="font-fraunces text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            Built for your home and your team
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
            OKAYiT gives staff a simple tool to welcome and support young people. It fits
            your daily practice. It does not add clutter.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-fraunces text-3xl font-bold text-gray-900">Why managers choose OKAYiT</h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
          <p>New arrivals often feel scared. The first days set the tone.</p>
          <p>OKAYiT helps a young person know your home before they arrive.</p>
          <p>It gives staff gentle ways to check in each day.</p>
          <p>It keeps a clear record of care, with consent.</p>
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-purple-50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-fraunces text-3xl font-bold text-gray-900">What it gives your home</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <Card title="A smoother welcome" body="Young people arrive knowing the house and the team. First days feel calmer." />
            <Card title="Support for staff" body="A shared tool for check-ins and reflection. It works alongside your team." />
            <Card title="A record of care" body="Wellbeing check-ins are logged with consent. You can show steady support." />
            <Card title="Simple to run" body="It works on devices you already have. Setup is quick and light." />
            <Card title="Made for young people" body="The design is calm and clear. It suits ages eight to seventeen." />
            <Card title="Safe by design" body="Protective mode and helplines are always close. Safety comes first." />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-fraunces text-3xl font-bold text-gray-900">How a pilot works</h2>
        <ol className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
          <li><span className="font-semibold text-purple-700">1.</span> We have a short call. We learn about your home.</li>
          <li><span className="font-semibold text-purple-700">2.</span> We set up your home in OKAYiT. This takes little time.</li>
          <li><span className="font-semibold text-purple-700">3.</span> Your team tries it with young people. We stay close to help.</li>
          <li><span className="font-semibold text-purple-700">4.</span> We review together. You decide what happens next.</li>
        </ol>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 px-8 py-12 text-center shadow-lg">
          <h2 className="font-fraunces text-3xl font-bold text-white">Ready to talk?</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-purple-100">
            Book a short pilot conversation. There is no pressure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50">
              Book a pilot conversation
            </Link>
            <a href="/pilot-pack.pdf" className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Download the pilot pack
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
