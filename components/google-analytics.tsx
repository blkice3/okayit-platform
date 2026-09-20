// Google Analytics — currently disabled
// Can be re-enabled by setting NEXT_PUBLIC_GA_MEASUREMENT_ID in .env

'use client';

export function GoogleAnalytics() {
  return null;
}

// Stub analytics object for backward compatibility
export const analytics = {
  trackEvent: () => {},
  trackPageView: () => {},
  trackUserRegistration: () => {},
  trackCertificateGeneration: () => {},
};
