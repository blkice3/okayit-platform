'use client';

// Read aloud support for the young person facing text.
// Uses the browser speech engine. It is client only and
// guarded so it never runs during server render.

import { useCallback, useEffect, useRef, useState } from 'react';

export function useSpeech() {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const currentText = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    currentText.current = null;
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!text) return;
    // Tapping the same speaking button stops it.
    window.speechSynthesis.cancel();
    if (currentText.current === text && speaking) {
      setSpeaking(false);
      currentText.current = null;
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.lang = 'en-GB';
    utter.onend = () => {
      setSpeaking(false);
      currentText.current = null;
    };
    utter.onerror = () => {
      setSpeaking(false);
      currentText.current = null;
    };
    currentText.current = text;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  }, [speaking]);

  return { supported, speaking, speak, stop };
}
