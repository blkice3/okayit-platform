'use client';

import { toast } from 'sonner';

/**
 * PII Detection and Filtering Utility
 * Detects and warns about potential personally identifiable information
 */

// Common PII patterns
const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b((\+44)|0)\d{10}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  ukPostcode: /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/gi,
  // Basic name detection (common patterns)
  potentialName: /\b[A-Z][a-z]+\s[A-Z][a-z]+\b/g,
  // Date of birth patterns
  dateOfBirth: /\b(0[1-9]|[12][0-9]|3[01])[\/\-](0[1-9]|1[012])[\/\-](19|20)\d\d\b/g,
};

interface PIICheckResult {
  hasPII: boolean;
  detectedTypes: string[];
  cleanedText?: string;
}

/**
 * Check text for PII patterns
 */
export function checkForPII(text: string): PIICheckResult {
  if (!text || text.trim().length === 0) {
    return { hasPII: false, detectedTypes: [] };
  }

  const detectedTypes: string[] = [];

  if (PII_PATTERNS.email.test(text)) {
    detectedTypes.push('email address');
  }
  if (PII_PATTERNS.phone.test(text)) {
    detectedTypes.push('phone number');
  }
  if (PII_PATTERNS.ukPostcode.test(text)) {
    detectedTypes.push('postcode');
  }
  if (PII_PATTERNS.dateOfBirth.test(text)) {
    detectedTypes.push('date of birth');
  }
  // Only check for names if text is short (likely a name field)
  if (text.length < 50 && PII_PATTERNS.potentialName.test(text)) {
    detectedTypes.push('possible name');
  }

  return {
    hasPII: detectedTypes.length > 0,
    detectedTypes,
  };
}

/**
 * Sanitize text by removing PII patterns
 */
export function sanitizePII(text: string): string {
  let sanitized = text;

  // Replace emails
  sanitized = sanitized.replace(PII_PATTERNS.email, '[EMAIL REMOVED]');
  
  // Replace phone numbers
  sanitized = sanitized.replace(PII_PATTERNS.phone, '[PHONE REMOVED]');
  
  // Replace postcodes
  sanitized = sanitized.replace(PII_PATTERNS.ukPostcode, '[POSTCODE REMOVED]');
  
  // Replace dates of birth
  sanitized = sanitized.replace(PII_PATTERNS.dateOfBirth, '[DATE REMOVED]');

  return sanitized;
}

/**
 * Validate input and show warning if PII detected
 * Returns true if validation passes (no PII or user acknowledged)
 */
export function validateAndWarnPII(text: string, fieldName: string = 'input'): boolean {
  const check = checkForPII(text);
  
  if (check.hasPII) {
    const types = check.detectedTypes.join(', ');
    toast.error(
      `⚠️ Personal Information Detected`,
      {
        description: `Your ${fieldName} appears to contain: ${types}. Please remove personal information for your privacy.`,
        duration: 6000,
      }
    );
    return false;
  }
  
  return true;
}

/**
 * React hook for PII validation on form fields
 */
export function usePIIValidation() {
  const validateField = (value: string, fieldName: string): boolean => {
    return validateAndWarnPII(value, fieldName);
  };

  const sanitizeField = (value: string): string => {
    return sanitizePII(value);
  };

  return { validateField, sanitizeField, checkForPII };
}
