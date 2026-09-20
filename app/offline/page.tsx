'use client';

import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Heart } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 via-white to-pink-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="relative mx-auto w-28 h-28 mb-6">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 blur-2xl opacity-40"
          />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-xl">
            <WifiOff className="w-12 h-12 text-white" strokeWidth={2.2} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          You&apos;re offline
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry, your work is safe, and OKAYiT will reconnect as soon as you&apos;re back online.
        </p>

        <button
          onClick={() => {
            if (typeof window !== 'undefined') window.location.reload();
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl active:scale-95 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Heart className="w-4 h-4 text-pink-500" />
          <span>OKAYiT is here for you, always.</span>
        </div>
      </motion.div>
    </div>
  );
}

export const dynamic = 'force-static';
