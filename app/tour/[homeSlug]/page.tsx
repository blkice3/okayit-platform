// /tour/[homeSlug] — the PUBLIC pre-arrival tour.
// Public, unauthenticated, cacheable, indexable. It contains the house,
// the staff team, routines and rights. It contains NOTHING about any
// individual child. The QR code points here and that is fine.

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getHome(slug: string) {
  const home = await prisma.careHome.findFirst({
    where: { name: slug.toLowerCase(), isActive: true },
    select: {
      id: true,
      name: true,
      displayName: true,
      description: true,
      address: true,
      phone: true,
      // NOTE: no child-identifying fields are selected. None exist on this model.
    },
  });
  if (!home) return null;
  const staff = await prisma.staffMember.findMany({
    where: { careHomeId: home.id, isActive: true },
    orderBy: { displayOrder: 'asc' },
    select: { id: true, name: true, role: true, photo: true, description: true, whenToTalkTo: true },
  });
  return { home, staff };
}

export async function generateMetadata({ params }: { params: { homeSlug: string } }): Promise<Metadata> {
  const data = await getHome(params.homeSlug);
  if (!data) return { title: 'Home tour' };
  return {
    title: `${data.home.displayName} | Pre-arrival tour`,
    description: `A look around ${data.home.displayName} before you arrive: the house, the team, routines and your rights.`,
    robots: { index: true, follow: true },
  };
}

const ROUTINES = [
  { title: 'Mornings', body: 'A calm start to the day. Breakfast is relaxed and there is time to get ready for school or college.' },
  { title: 'After school', body: 'Time to unwind, have a snack, do homework if you have any, and see the staff on shift.' },
  { title: 'Evenings', body: 'A shared meal, some free time, and a settled wind down before bed.' },
  { title: 'Weekends', body: 'A slower pace. Activities, seeing people who matter to you where it is safe, and rest.' },
];

const RIGHTS = [
  'You will be listened to and treated with respect.',
  'You can talk to staff about anything that worries you.',
  'You have a say in decisions about your day to day life.',
  'You can raise a concern or make a complaint, and it will be taken seriously.',
  'You can keep in touch with people who matter to you, where it is safe.',
];

export default async function TourPage({ params }: { params: { homeSlug: string } }) {
  const data = await getHome(params.homeSlug);
  if (!data) notFound();
  const { home, staff } = data;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <section className="mx-auto max-w-4xl px-5 py-14">
        <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          Pre-arrival tour
        </span>
        <h1 className="mt-4 font-fraunces text-4xl font-bold text-gray-900">{home.displayName}</h1>
        {home.description && (
          <p className="mt-4 text-lg leading-relaxed text-gray-700">{home.description}</p>
        )}
        {(home.address || home.phone) && (
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
            {home.address && <span suppressHydrationWarning>{home.address}</span>}
            {home.phone && <span suppressHydrationWarning>{home.phone}</span>}
          </div>
        )}
      </section>

      {staff.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 pb-14">
          <h2 className="font-fraunces text-2xl font-bold text-gray-900">Meet the team</h2>
          <p className="mt-2 text-gray-600">These are some of the people who will be here to help you settle in.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {staff.map((s) => (
              <div key={s.id} className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-700">
                  {s.photo}
                </div>
                <h3 className="mt-4 font-fraunces text-lg font-bold text-gray-900">{s.name}</h3>
                <p className="text-sm font-semibold text-purple-600">{s.role}</p>
                {s.description && <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white/60">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="font-fraunces text-2xl font-bold text-gray-900">A normal day</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {ROUTINES.map((r) => (
              <div key={r.title} className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                <h3 className="font-fraunces text-lg font-bold text-gray-900">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-14">
        <h2 className="font-fraunces text-2xl font-bold text-gray-900">Your rights here</h2>
        <ul className="mt-6 space-y-3">
          {RIGHTS.map((r) => (
            <li key={r} className="flex gap-3 text-lg leading-relaxed text-gray-700">
              <span className="mt-1 h-2 w-2 flex-none rounded-full bg-purple-500" aria-hidden />
              <span>{r}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-2xl bg-purple-50 p-6">
          <h3 className="font-fraunces text-lg font-bold text-gray-900">If something is not right</h3>
          <p className="mt-2 text-base leading-relaxed text-gray-700">
            You can speak to any member of staff, or ask to speak to the manager. You can also
            ask for help to contact your social worker or an independent advocate.
          </p>
        </div>
      </section>
    </main>
  );
}
