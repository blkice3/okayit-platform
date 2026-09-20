'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface UserContext {
  displayName: string;
  home: string;
  role: string | null;
  isAuthenticated: boolean;
  userId: string | null;
}

/**
 * Returns user context from NextAuth session (if logged in)
 * or falls back to localStorage values.
 * When a YP logs in via invite code, their session provides
 * displayName and careHomeName automatically.
 */
export function useUserContext(): UserContext {
  const { data: session } = useSession();
  const [localName, setLocalName] = useState('');
  const [localHome, setLocalHome] = useState('');

  useEffect(() => {
    // Only read localStorage on mount (client-side)
    setLocalName(localStorage.getItem('user_name') || '');
    setLocalHome(localStorage.getItem('selected_home') || '');
  }, []);

  // If user has a NextAuth session, use that
  if (session?.user) {
    return {
      displayName: session.user.displayName || localName || 'A young person',
      home: session.user.careHomeName || localHome || 'the care home',
      role: session.user.role || null,
      isAuthenticated: true,
      userId: session.user.id,
    };
  }

  // Otherwise fall back to localStorage
  return {
    displayName: localName || 'A young person',
    home: localHome || 'the care home',
    role: null,
    isAuthenticated: false,
    userId: null,
  };
}
