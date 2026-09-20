import Link from 'next/link';
import Image from 'next/image';

// Server component. Renders as real HTML with no JavaScript required.
export function PublicHeader() {
  const links = [
    { href: '/for-homes', label: 'For homes' },
    { href: '/safeguarding', label: 'Safeguarding' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2" aria-label="OKAYiT home">
          <span className="relative block h-9 w-9 overflow-hidden rounded-xl bg-purple-50">
            <Image src="/okayit-logo.png" alt="OKAYiT logo" fill sizes="36px" className="object-cover" />
          </span>
          <span className="font-fraunces text-xl font-bold text-purple-700">OKAYiT</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-2 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 sm:px-3"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-1 rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700 sm:px-4"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
