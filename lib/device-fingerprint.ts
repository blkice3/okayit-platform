
// Device Fingerprinting for One-Time Registration
// Ensures users only register once per device

export class DeviceFingerprint {
  private static STORAGE_KEY = 'device_fingerprint';
  private static REGISTRATION_KEY = 'device_registration_complete';

  /**
   * Generate a unique device fingerprint based on available browser/device data
   */
  static async generateFingerprint(): Promise<string> {
    const components: string[] = [];

    // Screen resolution
    components.push(`screen-${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`);

    // Timezone
    components.push(`tz-${Intl.DateTimeFormat().resolvedOptions().timeZone}`);

    // Language
    components.push(`lang-${navigator.language}`);

    // Platform
    components.push(`platform-${navigator.platform}`);

    // Hardware concurrency (CPU cores)
    components.push(`cores-${navigator.hardwareConcurrency || 0}`);

    // Device memory (if available)
    if ('deviceMemory' in navigator) {
      components.push(`mem-${(navigator as any).deviceMemory}`);
    }

    // User agent
    components.push(`ua-${navigator.userAgent}`);

    // Canvas fingerprint
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('OKAYiT Device', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Fingerprint', 4, 17);
        const canvasData = canvas.toDataURL();
        components.push(`canvas-${this.simpleHash(canvasData)}`);
      }
    } catch (e) {
      // Canvas fingerprinting blocked or failed
      components.push('canvas-blocked');
    }

    // WebGL vendor and renderer
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          components.push(`webgl-${vendor}-${renderer}`);
        }
      }
    } catch (e) {
      // WebGL not available
      components.push('webgl-unavailable');
    }

    // Combine all components and hash
    const combined = components.join('|');
    const fingerprint = await this.hash(combined);

    return fingerprint;
  }

  /**
   * Check if this device has already completed registration
   */
  static async isDeviceRegistered(): Promise<boolean> {
    try {
      // Check localStorage first
      const registered = localStorage.getItem(this.REGISTRATION_KEY);
      if (registered === 'true') {
        return true;
      }

      // Check if fingerprint matches stored fingerprint
      const storedFingerprint = localStorage.getItem(this.STORAGE_KEY);
      if (storedFingerprint) {
        const currentFingerprint = await this.generateFingerprint();
        return storedFingerprint === currentFingerprint;
      }

      return false;
    } catch (error) {
      console.error('Error checking device registration:', error);
      return false;
    }
  }

  /**
   * Mark this device as registered
   */
  static async markDeviceRegistered(): Promise<void> {
    try {
      const fingerprint = await this.generateFingerprint();
      localStorage.setItem(this.STORAGE_KEY, fingerprint);
      localStorage.setItem(this.REGISTRATION_KEY, 'true');
      localStorage.setItem('registration_timestamp', new Date().toISOString());
    } catch (error) {
      console.error('Error marking device as registered:', error);
      throw error;
    }
  }

  /**
   * Get device ID (same as fingerprint for consistency)
   */
  static async getDeviceId(): Promise<string> {
    let deviceId = localStorage.getItem(this.STORAGE_KEY);
    
    if (!deviceId) {
      deviceId = await this.generateFingerprint();
      localStorage.setItem(this.STORAGE_KEY, deviceId);
    }

    return deviceId;
  }

  /**
   * Clear registration (for testing or reset)
   */
  static clearRegistration(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.REGISTRATION_KEY);
    localStorage.removeItem('registration_timestamp');
    localStorage.removeItem('user_registration');
  }

  /**
   * Simple hash function for strings
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * SHA-256 hash using Web Crypto API
   */
  private static async hash(message: string): Promise<string> {
    try {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (error) {
      // Fallback to simple hash if Web Crypto API not available
      console.warn('Web Crypto API not available, using simple hash');
      return this.simpleHash(message);
    }
  }

  /**
   * Get registration metadata
   */
  static getRegistrationMetadata(): {
    isRegistered: boolean;
    timestamp?: string;
    deviceId?: string;
  } {
    const isRegistered = localStorage.getItem(this.REGISTRATION_KEY) === 'true';
    const timestamp = localStorage.getItem('registration_timestamp') || undefined;
    const deviceId = localStorage.getItem(this.STORAGE_KEY) || undefined;

    return {
      isRegistered,
      timestamp,
      deviceId
    };
  }
}
