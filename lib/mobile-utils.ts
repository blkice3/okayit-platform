
// Mobile-specific utilities for touch, gestures, and device features

export interface TouchGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
}

export interface HapticOptions {
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

// Haptic Feedback Support
export const hapticFeedback = {
  // Basic vibration
  vibrate: (pattern: number | number[] = 100) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },

  // Advanced haptic feedback for iOS
  impact: (type: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      try {
        // @ts-ignore - Haptic API not in TypeScript definitions
        if (window.navigator.vibrate) {
          const patterns = {
            light: [10],
            medium: [20],
            heavy: [30, 10, 30]
          };
          window.navigator.vibrate(patterns[type]);
        }
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  },

  // Notification feedback
  notification: (type: 'success' | 'warning' | 'error' = 'success') => {
    const patterns = {
      success: [10, 30, 10],
      warning: [20, 20, 20],
      error: [50, 30, 50, 30, 50]
    };
    hapticFeedback.vibrate(patterns[type]);
  },

  // Selection feedback
  selection: () => {
    hapticFeedback.vibrate(10);
  }
};

// Touch Gesture Detection
export class TouchGestureManager {
  private startTouch: Touch | null = null;
  private startTime: number = 0;

  constructor(private element: HTMLElement) {
    this.setupTouchListeners();
  }

  private setupTouchListeners() {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
  }

  private handleTouchStart(event: TouchEvent) {
    this.startTouch = event.touches[0];
    this.startTime = Date.now();
  }

  private handleTouchEnd(event: TouchEvent) {
    if (!this.startTouch) return;

    const endTouch = event.changedTouches[0];
    const gesture: TouchGesture = {
      startX: this.startTouch.clientX,
      startY: this.startTouch.clientY,
      endX: endTouch.clientX,
      endY: endTouch.clientY,
      duration: Date.now() - this.startTime
    };

    this.detectGesture(gesture);
  }

  private detectGesture(gesture: TouchGesture) {
    const deltaX = gesture.endX - gesture.startX;
    const deltaY = gesture.endY - gesture.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Swipe detection
    if (distance > 50 && gesture.duration < 300) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.onSwipeRight();
        } else {
          this.onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          this.onSwipeDown();
        } else {
          this.onSwipeUp();
        }
      }
    }
  }

  onSwipeLeft() {
    this.element.dispatchEvent(new CustomEvent('swipeleft'));
  }

  onSwipeRight() {
    this.element.dispatchEvent(new CustomEvent('swiperight'));
  }

  onSwipeUp() {
    this.element.dispatchEvent(new CustomEvent('swipeup'));
  }

  onSwipeDown() {
    this.element.dispatchEvent(new CustomEvent('swipedown'));
  }
}

// Device Detection
export const device = {
  isMobile: () => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  isIOS: () => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  isAndroid: () => {
    if (typeof window === 'undefined') return false;
    return /Android/.test(navigator.userAgent);
  },

  hasCamera: () => {
    if (typeof navigator === 'undefined') return false;
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  },

  isStandalone: () => {
    if (typeof window === 'undefined') return false;
    // @ts-ignore
    return window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
  },

  getOrientation: () => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }
};

// Screen utilities
export const screen = {
  isSmall: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 640;
  },

  isMedium: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 640 && window.innerWidth < 1024;
  },

  isLarge: () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 1024;
  },

  getSafeArea: () => {
    if (typeof window === 'undefined') return { top: 0, bottom: 0, left: 0, right: 0 };
    
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      top: parseInt(computedStyle.getPropertyValue('--safe-area-inset-top') || '0'),
      bottom: parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom') || '0'),
      left: parseInt(computedStyle.getPropertyValue('--safe-area-inset-left') || '0'),
      right: parseInt(computedStyle.getPropertyValue('--safe-area-inset-right') || '0')
    };
  }
};

// Camera QR Scanner
export class QRScanner {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private stream: MediaStream | null = null;

  async initialize(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
    this.video = videoElement;
    this.canvas = canvasElement;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      this.video.srcObject = this.stream;
      this.video.play();
      return true;
    } catch (error) {
      console.error('Camera access denied:', error);
      return false;
    }
  }

  startScanning(onQRDetected: (data: string) => void) {
    if (!this.video || !this.canvas) return;

    const context = this.canvas.getContext('2d');
    if (!context) return;

    const scanFrame = () => {
      if (this.video && this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        this.canvas!.width = this.video.videoWidth;
        this.canvas!.height = this.video.videoHeight;
        context.drawImage(this.video, 0, 0);

        // Here you would integrate with a QR code detection library
        // For now, we'll simulate QR detection
        this.simulateQRDetection(onQRDetected);
      }
      requestAnimationFrame(scanFrame);
    };

    scanFrame();
  }

  private simulateQRDetection(callback: (data: string) => void) {
    // Simulate QR code detection - in real implementation, use jsQR or similar
    if (Math.random() < 0.001) { // 0.1% chance per frame
      const mockQRData = `room-${Math.floor(Math.random() * 10) + 1}`;
      callback(mockQRData);
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

// App Installation Helper
export const installApp = {
  canInstall: () => {
    if (typeof window === 'undefined') return false;
    // @ts-ignore
    return !!window.deferredPrompt || device.isStandalone();
  },

  prompt: async () => {
    if (typeof window === 'undefined') return false;
    
    try {
      // @ts-ignore
      const deferredPrompt = window.deferredPrompt;
      if (!deferredPrompt) return false;

      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      
      // @ts-ignore
      window.deferredPrompt = null;
      return result.outcome === 'accepted';
    } catch (error) {
      console.error('Installation prompt failed:', error);
      return false;
    }
  }
};
