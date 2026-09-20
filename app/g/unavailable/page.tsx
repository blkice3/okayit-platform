// /g/unavailable — the SINGLE neutral failure page. Unknown, expired,
// revoked and already-used links all land here with identical wording,
// so the endpoint can never confirm that a link once existed.

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Page not available',
  robots: { index: false, follow: false },
};

export default function GuideUnavailablePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-5">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-purple-100">
        <h1 className="font-fraunces text-2xl font-bold text-gray-900">This page is not available</h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">
          A member of staff can open your guide for you on a house device.
        </p>
        <p className="mt-6 text-base leading-relaxed text-gray-700">
          If you need help now, you can reach someone straight away.
        </p>
        <a
          href="/safeguarding"
          className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
        >
          Get help
        </a>
      </div>
    </main>
  );
}
