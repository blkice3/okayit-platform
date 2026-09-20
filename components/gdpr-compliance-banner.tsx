'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { okayitTheme } from '@/lib/okayit-theme';

/**
 * Privacy Banner Component
 * Explains honestly what data the platform stores and why.
 * Shows on first visit and can be dismissed.
 */
export function GDPRComplianceBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already seen the banner
    const bannerDismissed = localStorage.getItem('gdpr-banner-dismissed');
    if (!bannerDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('gdpr-banner-dismissed', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 p-4"
        >
          <Card 
            className="max-w-4xl mx-auto shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${okayitTheme.colors.purple}, ${okayitTheme.colors.blue})`,
              border: 'none',
            }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">
                      🔒 Your Privacy Matters
                    </h3>
                    
                    <p className="text-white/90 mb-4 leading-relaxed">
                      This is a safe space made for you. You can explore most things without signing up.
                      If you do register, we only store what you choose to share, like your first name and progress.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      {[
                        'Browse without signing up',
                        'We only keep what you share',
                        'Your care home manages access',
                        'Ask staff any questions'
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-white/90 text-sm">
                          <span className="text-green-300">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-white/10 p-4 rounded-lg text-white/90 text-sm space-y-2"
                      >
                        <p className="font-semibold">What we store and why:</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>If you register: your first name and care home, so staff can support you</li>
                          <li>Wellbeing check-ins, so your key worker can see how you are feeling (with your consent)</li>
                          <li>Your progress on activities, so you do not lose your place</li>
                          <li>We never sell your data or share it outside your care home</li>
                          <li>You can ask staff to delete your information at any time</li>
                        </ul>
                      </motion.div>
                    )}

                    <div className="flex flex-wrap gap-3 mt-4">
                      <Button
                        onClick={handleDismiss}
                        className="bg-white hover:bg-white/90 text-purple-600 font-semibold"
                      >
                        Got it 👍
                      </Button>
                      
                      <Button
                        onClick={() => setShowDetails(!showDetails)}
                        variant="outline"
                        className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        {showDetails ? 'Show Less' : 'Tell Me More'}
                      </Button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDismiss}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Footer Badge Component
 * Displays privacy-related badges at the bottom of pages
 */
export function GDPRFooterBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4 text-sm">
      <div className="flex items-center gap-2 text-green-600 font-semibold">
        <Shield className="w-4 h-4" />
        <span>Your Privacy Matters</span>
      </div>
      <div className="flex items-center gap-2 text-blue-600 font-semibold">
        <Shield className="w-4 h-4" />
        <span>Safe &amp; Supported</span>
      </div>
      <div className="flex items-center gap-2 text-purple-600 font-semibold">
        <Shield className="w-4 h-4" />
        <span>Your Space</span>
      </div>
    </div>
  );
}