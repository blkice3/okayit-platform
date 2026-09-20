import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/public/public-header';
import { PublicFooter } from '@/components/public/public-footer';

export const metadata: Metadata = {
  title: 'OKAYiT | A digital wellbeing space for young people in care',
  description:
    'OKAYiT helps children’s homes settle and support young people. Pre-arrival tours, welcome guides, daily wellbeing check-ins and safe resources.',
  alternates: { canonical: '/' },
};

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
      <h3 className="font-fraunces text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      {/* (a) One-line statement of what the platform does */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              For children’s residential care
            </span>
            <h1 className="mt-4 font-fraunces text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              A calm, safe space for young people in care.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-700">
              OKAYiT helps your home welcome and support each young person. It works on any
              phone or tablet. It is private, gentle and easy to use.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Book a pilot conversation
              </Link>
              <a
                href="/pilot-pack.pdf"
                className="rounded-lg border border-purple-200 bg-white px-6 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"
              >
                Download the pilot pack
              </a>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-purple-100 shadow-lg">
            <Image
              src="/tour-living-room.jpg"
              alt="A warm, welcoming living room in a residential care home"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* (b) The problem, for a registered manager */}
      <section className="mx-auto max-w-4xl px-5 py-16">
        <h2 className="font-fraunces text-3xl font-bold text-gray-900">The problem you know well</h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
          <p>A young person arrives at your home. Often it happens fast. They are anxious.</p>
          <p>They do not know the house. They do not know your team. They feel unsure.</p>
          <p>Your staff work hard to help them settle. But those first days are hard.</p>
          <p>You also need clear records. You need to show care and good practice.</p>
          <p>OKAYiT gives you a simple tool to help. It supports your team, not replaces them.</p>
        </div>
      </section>

      {/* (c) What a young person sees */}
      <section className="bg-gradient-to-b from-white to-purple-50">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-fraunces text-3xl font-bold text-gray-900">What a young person sees</h2>
          <p className="mt-3 max-w-2xl text-lg text-gray-700">
            Everything is made for them. It is calm, clear and kind.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="Pre-arrival tour"
              body="They see the home before they arrive. Photos of rooms help them feel ready."
            />
            <Feature
              title="Welcome guide"
              body="They meet the team through real staff photos. Faces feel familiar on day one."
            />
            <Feature
              title="Daily wellbeing check-in"
              body="They share how they feel each day. It is quick, simple and private."
            />
            <Feature
              title="Protective mode"
              body="If they need help now, they reach 24 hour helplines fast. Support is always close."
            />
            <Feature
              title="Reflection space"
              body="Gentle discussion cards help them think and talk. They go at their own pace."
            />
            <Feature
              title="Resources library"
              body="Safe, age-suitable guides and activities. They can explore when they choose."
            />
            <Feature
              title="Identity and family"
              body="Activities help them hold on to who they are. They stay connected to family, where it is safe."
            />
          </div>
        </div>
      </section>

      {/* (d) What the home gets */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-fraunces text-3xl font-bold text-gray-900">What your home gets</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Feature
            title="A smoother welcome"
            body="Young people arrive knowing your home. First days feel calmer for everyone."
          />
          <Feature
            title="Support for your team"
            body="Staff get a shared tool for check-ins and reflection. It fits your daily practice."
          />
          <Feature
            title="A record of care"
            body="Wellbeing check-ins are logged with consent. You can show gentle, steady support."
          />
          <Feature
            title="Simple to run"
            body="It works on devices you already have. There is little setup and no clutter."
          />
        </div>
      </section>

      {/* (e) Safeguarding and data protection */}
      <section className="bg-purple-50">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="font-fraunces text-3xl font-bold text-gray-900">Safeguarding and data protection</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
            <p>Safety comes first in every part of OKAYiT. We design for young people in care.</p>
            <p>Protective mode gives fast access to help. Alerts can reach your staff quickly.</p>
            <p>We collect only what we need. We keep it secure.</p>
            <p>We follow UK data protection law and good safeguarding practice.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/safeguarding" className="rounded-lg border border-purple-200 bg-white px-6 py-3 text-sm font-semibold text-purple-700 hover:bg-white/70">
              Read our safeguarding approach
            </Link>
            <Link href="/privacy" className="rounded-lg border border-purple-200 bg-white px-6 py-3 text-sm font-semibold text-purple-700 hover:bg-white/70">
              Read our privacy notice
            </Link>
          </div>
        </div>
      </section>

      {/* (f) + (g) Primary and secondary CTA */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 px-8 py-12 text-center shadow-lg">
          <h2 className="font-fraunces text-3xl font-bold text-white">See OKAYiT in your home</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-purple-100">
            Start with a short pilot. We will walk you through it. There is no pressure.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50"
            >
              Book a pilot conversation
            </Link>
            <a
              href="/pilot-pack.pdf"
              className="rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Download the pilot pack
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
