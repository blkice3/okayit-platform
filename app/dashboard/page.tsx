'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

// Privacy / data banner
import { GDPRComplianceBanner } from '@/components/gdpr-compliance-banner';

// Dynamic import for better performance
const AdaptiveAppInterface = dynamic(() => import('@/components/adaptive-app-interface'), {
  loading: () => <AppLoadingScreen />,
  ssr: false
});

// Loading Screen Component
function AppLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto border-4 border-purple-600 border-t-transparent rounded-full"
        />
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            OKAYiT
          </h2>
          <p className="text-gray-600">
            Getting things ready for you...
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-purple-600 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-purple-600 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-purple-600 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}

function HomePage() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [initialSection, setInitialSection] = useState('welcome');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setInitialSection(section);
    }
    setIsReady(true);
  }, [searchParams]);

  // Show loading while checking session
  if (status === 'loading' || !isReady) {
    return <AppLoadingScreen />;
  }

  // Build user object from session (authenticated) or fallback
  const user = session?.user
    ? {
        name: session.user.displayName || session.user.email || 'User',
        email: session.user.email || null,
        image: null,
        userType: session.user.role?.toLowerCase() || 'guest',
        isAnonymous: false,
        role: session.user.role,
        status: session.user.status || 'ACTIVE',
        displayName: session.user.displayName,
        careHomeId: session.user.careHomeId,
        careHomeName: session.user.careHomeName,
      }
    : {
        name: 'Guest',
        email: null,
        image: null,
        userType: 'guest',
        isAnonymous: true,
        status: 'ACTIVE',
      };

  return (
    <>
      {/* Data usage banner */}
      <GDPRComplianceBanner />
      
      <Suspense fallback={<AppLoadingScreen />}>
        <AdaptiveAppInterface
          user={user}
          session={{ user }}
          initialSection={initialSection}
        />
      </Suspense>
    </>
  );
}

// Wrap in Suspense to handle searchParams
export default function Page() {
  return (
    <Suspense fallback={<AppLoadingScreen />}>
      <HomePage />
    </Suspense>
  );
}
