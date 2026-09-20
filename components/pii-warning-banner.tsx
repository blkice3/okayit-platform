'use client';

import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { okayitTheme } from '@/lib/okayit-theme';

/**
 * PII Warning Banner Component
 * Displays on forms to warn users against entering personal information
 */
export function PIIWarningBanner() {
  return (
    <Alert 
      className="border-2 mb-6"
      style={{
        borderColor: okayitTheme.colors.amber,
        background: `${okayitTheme.colors.amber}10`,
      }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle 
          className="w-5 h-5 flex-shrink-0 mt-0.5" 
          style={{ color: okayitTheme.colors.amber }} 
        />
        <div className="flex-1">
          <p className="font-bold mb-2 text-gray-900">
            ⚠️ DO NOT ENTER PERSONAL INFORMATION
          </p>
          <AlertDescription className="text-sm space-y-1">
            <p>For your safety and privacy, please <strong>DO NOT</strong> enter:</p>
            <ul className="list-disc list-inside ml-2 space-y-0.5">
              <li>Real names</li>
              <li>Email addresses</li>
              <li>Phone numbers</li>
              <li>Addresses or postcodes</li>
              <li>Dates of birth</li>
              <li>Any other personal details</li>
            </ul>
            <p className="mt-2 font-semibold">
              Use placeholder text like "Test User" or "Example" instead.
            </p>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}

/**
 * Mini PII Warning (for inline use)
 */
export function PIIWarningInline() {
  return (
    <div 
      className="flex items-center gap-2 text-xs p-2 rounded-lg mb-2"
      style={{
        background: `${okayitTheme.colors.amber}10`,
      }}
    >
      <AlertTriangle className="w-3 h-3" style={{ color: okayitTheme.colors.amber }} />
      <span>
        <strong>Privacy Notice:</strong> Do not enter real personal information
      </span>
    </div>
  );
}
