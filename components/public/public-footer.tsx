import Link from 'next/link';

// Server component. Company details use clearly marked placeholders where facts
// are not yet confirmed. Update these once the registered details are supplied.
export function PublicFooter() {
  return (
    <footer className="border-t border-purple-100 bg-gray-50">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-fraunces text-lg font-bold text-purple-700">OKAYiT</div>
            <p className="mt-2 max-w-xs text-sm text-gray-600">
              A digital wellbeing space for young people living in residential care.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Explore</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link href="/for-homes" className="hover:text-purple-700">For homes</Link></li>
              <li><Link href="/safeguarding" className="hover:text-purple-700">Safeguarding</Link></li>
              <li><Link href="/contact" className="hover:text-purple-700">Contact</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Legal</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><Link href="/privacy" className="hover:text-purple-700">Privacy notice</Link></li>
              <li><Link href="/accessibility" className="hover:text-purple-700">Accessibility</Link></li>
              <li><Link href="/safeguarding" className="hover:text-purple-700">Data protection</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-gray-900">Get in touch</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a href="mailto:admin@okayit.uk" className="hover:text-purple-700" suppressHydrationWarning>
                  admin@okayit.uk
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 text-xs leading-relaxed text-gray-500">
          <p>
            OKAYiT is a service of OKAYIT LTD. Registered in England and Wales, company number
            17206754. Registered office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ.
          </p>
          <p className="mt-3">
            &copy; {new Date().getFullYear()} OKAYiT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
