'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md';
  /** Color theme — defaults to purple */
  color?: 'purple' | 'green' | 'blue' | 'pink' | 'red' | 'orange' | 'indigo';
}

const colorMap: Record<string, { bg: string; text: string; ring: string; pulse: string }> = {
  purple: { bg: 'bg-purple-100 hover:bg-purple-200', text: 'text-purple-600', ring: 'ring-purple-300', pulse: 'bg-purple-500' },
  green: { bg: 'bg-green-100 hover:bg-green-200', text: 'text-green-600', ring: 'ring-green-300', pulse: 'bg-green-500' },
  blue: { bg: 'bg-blue-100 hover:bg-blue-200', text: 'text-blue-600', ring: 'ring-blue-300', pulse: 'bg-blue-500' },
  pink: { bg: 'bg-pink-100 hover:bg-pink-200', text: 'text-pink-600', ring: 'ring-pink-300', pulse: 'bg-pink-500' },
  red: { bg: 'bg-red-100 hover:bg-red-200', text: 'text-red-600', ring: 'ring-red-300', pulse: 'bg-red-500' },
  orange: { bg: 'bg-orange-100 hover:bg-orange-200', text: 'text-orange-600', ring: 'ring-orange-300', pulse: 'bg-orange-500' },
  indigo: { bg: 'bg-indigo-100 hover:bg-indigo-200', text: 'text-indigo-600', ring: 'ring-indigo-300', pulse: 'bg-indigo-500' },
};

export default function VoiceInputButton({ onTranscript, className = '', size = 'sm', color = 'purple' }: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const c = colorMap[color] || colorMap.purple;
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const btnSize = size === 'sm' ? 'p-1.5' : 'p-2';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) setIsSupported(false);
    }
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (_) {}
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [onTranscript]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    setIsRecording(false);
  }, []);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      className={`relative rounded-full ${btnSize} transition-all ${isRecording ? `bg-red-100 text-red-600 ring-2 ring-red-300` : `${c.bg} ${c.text}`} ${className}`}
      title={isRecording ? 'Stop recording' : 'Tap to speak'}
      aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
    >
      {isRecording ? (
        <>
          <Square className={iconSize} />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
        </>
      ) : (
        <Mic className={iconSize} />
      )}
    </button>
  );
}
