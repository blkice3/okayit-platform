import Link from 'next/link';
import { Home, ArrowLeft, Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-sm text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-4xl" role="img" aria-label="Confused face">😕</span>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Hmm, we can&apos;t find that page. It might have moved or been removed.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-xs text-purple-700 flex items-center justify-center gap-1">
            <Heart className="w-3 h-3" />
            Don&apos;t worry, let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-gray-200 hover:border-purple-300 text-sm font-medium rounded-lg text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
