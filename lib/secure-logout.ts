'use client';

import { signOut } from 'next-auth/react';

/**
 * P0-01 / P0-02: Secure logout — clears ALL client-side user data
 * before triggering NextAuth signOut.
 *
 * Clears: localStorage, sessionStorage, IndexedDB, Cache Storage (via SW),
 * and all cookies. This prevents the next user on a shared device from
 * reading the previous user's cached API responses or stored data.
 */
export async function secureLogout() {
  try {
    // 1. Clear localStorage & sessionStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }

    // 2. Tell the Service Worker to purge all caches
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_ALL_CACHES' });
      // Give the SW a moment to process
      await new Promise((r) => setTimeout(r, 300));
    }

    // 3. Also clear caches directly from the main thread (belt & braces)
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }

    // 4. Clear IndexedDB databases
    if ('indexedDB' in window) {
      const dbs = await indexedDB.databases?.() || [];
      for (const db of dbs) {
        if (db.name) indexedDB.deleteDatabase(db.name);
      }
    }

    // 5. Call our server-side logout API to clear httpOnly cookies
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

  } catch (err) {
    console.error('[SecureLogout] Error during cleanup:', err);
  } finally {
    // 6. Trigger NextAuth signOut (clears session cookie + redirects)
    await signOut({ callbackUrl: '/login' });
  }
}
