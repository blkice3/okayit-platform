'use client';

import { useState } from 'react';
import { Phone, X, MessageCircle, AlertTriangle } from 'lucide-react';

const VERIFIED_HELPLINES = [
  {
    name: 'Childline',
    number: '0800 1111',
    description: 'Free, confidential, 24/7, for under 19s',
    href: 'tel:08001111',
    color: 'bg-green-600',
  },
  {
    name: 'Samaritans',
    number: '116 123',
    description: 'Free to call, 24/7, any age',
    href: 'tel:116123',
    color: 'bg-blue-600',
  },
  {
    name: 'Crisis Text Line',
    number: 'Text SHOUT to 85258',
    description: 'Free 24/7 text support',
    href: 'sms:85258?body=SHOUT',
    color: 'bg-purple-600',
  },
  {
    name: 'Emergency Services',
    number: '999',
    description: 'If someone is in immediate danger',
    href: 'tel:999',
    color: 'bg-red-600',
  },
];

export default function HelpNowButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button — positioned above bottom nav */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="I need help now"
        className="fixed bottom-20 right-3 z-[9998] flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-full shadow-lg transition-all text-xs font-bold opacity-90 hover:opacity-100 sm:bottom-6 sm:right-4 sm:px-4 sm:py-2.5 sm:text-sm"
      >
        <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">I Need Help</span>
        <span className="sm:hidden">Help</span>
      </button>

      {/* Help panel overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
            {/* Header */}
            <div className="bg-red-600 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <h2 className="text-base font-bold">Need Help Right Now?</h2>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close" className="p-1 hover:bg-white/20 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reassurance */}
            <div className="px-5 py-3 bg-red-50 border-b border-red-100">
              <p className="text-xs text-red-800 font-medium">
                These are real, verified UK helplines. All calls are free and confidential. You will not get in trouble for calling.
              </p>
            </div>

            {/* Helplines */}
            <div className="p-4 space-y-2.5">
              {VERIFIED_HELPLINES.map((line) => (
                <a
                  key={line.name}
                  href={line.href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <div className={`${line.color} p-2 rounded-lg text-white flex-shrink-0`}>
                    {line.href.startsWith('sms') ? <MessageCircle className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900">{line.name}</div>
                    <div className="text-xs text-gray-500">{line.description}</div>
                  </div>
                  <div className="text-sm font-bold text-gray-700 group-hover:text-gray-900 flex-shrink-0">
                    {line.number}
                  </div>
                </a>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                You can also talk to a trusted adult at your care home at any time.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
