// /g/view — renders the personalised guide from the __Host- grant cookie.
// It NEVER accepts a token. If there is no valid grant it shows the same
// neutral unavailable page as every other failure.

import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { resolveGuideGrant, GUIDE_COOKIE_NAME } from '@/lib/guide-links';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GuideViewPage() {
  const cookieStore = cookies();
  const raw = cookieStore.get(GUIDE_COOKIE_NAME)?.value;

  const h = headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  const userAgent = h.get('user-agent') || null;

  const guide = raw ? await resolveGuideGrant(raw, { ip, userAgent }) : null;

  // Fail closed: no valid grant -> the single neutral failure page.
  if (!guide) {
    redirect('/g/unavailable');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-purple-100">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">Your welcome guide</p>
          <h1 className="mt-2 font-fraunces text-3xl font-bold text-gray-900">
            Hi {guide.childPreferredName}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-gray-700">
            Welcome to {guide.homeDisplayName}. This guide is just for you. We are really glad you are here.
          </p>

          {guide.photoUrl && (
            <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-purple-100">
              {/* Photo served through a signed URL that expires with this session. */}
              <Image
                src={guide.photoUrl}
                alt={`A photo prepared for ${guide.childPreferredName}`}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {guide.childRoom && (
              <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5">
                <p className="text-sm font-semibold text-purple-700">Your room</p>
                <p className="mt-1 text-lg font-medium text-gray-900">{guide.childRoom}</p>
              </div>
            )}
            {guide.keyWorkerName && (
              <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5">
                <p className="text-sm font-semibold text-purple-700">Your key worker</p>
                <p className="mt-1 text-lg font-medium text-gray-900">{guide.keyWorkerName}</p>
              </div>
            )}
          </div>

          <p className="mt-8 text-base leading-relaxed text-gray-600">
            If you have any questions, you can ask any of the staff here. They are looking
            forward to meeting you.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          This page is private and closes itself after a short time.
        </p>
      </div>
    </main>
  );
}
