'use client';

// Theme and context providers
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { MoodResponseProvider } from '@/lib/mood-response';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
      <div className="animate-pulse text-2xl font-bold text-purple-600">Loading...</div>
    </div>;
  }

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <MoodResponseProvider>{children}</MoodResponseProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
