'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Heart, Shield, BookOpen, Users,
  Sparkles, Star, Smile, MessageCircle, Target,
  ChevronRight, PartyPopper, Home, Phone, HelpCircle,
  Trophy, Wind
} from 'lucide-react';
import OKAYiTLogo from './okayit-logo';
import { HomeContext } from '@/lib/home-contexts';

interface WelcomeJourneyProps {
  currentHome: HomeContext;
  onComplete: () => void;
  onSkipToExplore: () => void;
  onAskQuestion: () => void;
}

const TOTAL_SLIDES = 5;
const SWIPE_THRESHOLD = 50; // minimum px to register a swipe

const confettiColors = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#fb923c'];

function MiniConfetti() {
  const [particles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 15 + (i * 4.1) % 70,
      delay: (i * 0.08) % 0.8,
      color: confettiColors[i % confettiColors.length],
      size: 6 + (i % 4) * 2,
      rotation: (i * 37) % 360,
    }))
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: 400, opacity: [0, 1, 1, 0], rotate: p.rotation + 180 }}
          transition={{ duration: 2.5, delay: p.delay, ease: 'easeOut' }}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

export default function WelcomeJourney({
  currentHome,
  onComplete,
  onSkipToExplore,
}: WelcomeJourneyProps) {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goNext = useCallback(() => {
    if (slide >= TOTAL_SLIDES - 1) {
      // Mark induction as complete
      try { localStorage.setItem('okayit_induction_done', 'true'); } catch {}
      onComplete();
      return;
    }
    setDirection(1);
    setSlide(s => s + 1);
  }, [slide, onComplete]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setSlide(s => Math.max(0, s - 1));
  }, []);

  const handleSkip = useCallback(() => {
    try { localStorage.setItem('okayit_induction_done', 'true'); } catch {}
    onSkipToExplore();
  }, [onSkipToExplore]);

  const handleEmojiPick = useCallback((picked: string) => {
    setEmoji(picked);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  }, []);

  // Swipe gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal movement is dominant
    if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        // Swipe left → next slide
        goNext();
      } else {
        // Swipe right → previous slide
        goBack();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [goNext, goBack]);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  // Progress dots
  const ProgressDots = () => (
    <div className="flex items-center gap-1.5 justify-center" role="tablist" aria-label="Induction progress">
      {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
        <button
          key={i}
          onClick={() => { setDirection(i > slide ? 1 : -1); setSlide(i); }}
          role="tab"
          aria-selected={i === slide}
          aria-label={`Step ${i + 1} of ${TOTAL_SLIDES}`}
          className={`rounded-full transition-all duration-300 ${
            i === slide
              ? 'w-7 h-2.5 bg-purple-500'
              : i < slide
              ? 'w-2.5 h-2.5 bg-purple-300'
              : 'w-2.5 h-2.5 bg-gray-300'
          }`}
        />
      ))}
    </div>
  );

  // Slide content
  const slides: React.ReactNode[] = [
    // SLIDE 0 — Welcome splash
    <div key="s0" className="flex flex-col items-center text-center gap-5 px-4">
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <OKAYiTLogo width={100} height={100} />
      </motion.div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-700 leading-tight">
        Welcome to OKAYiT!
      </h1>
      <p className="text-lg text-gray-600 max-w-md leading-relaxed">
        This is <strong>your space</strong>, made just for you.
        Let us show you around in about 60 seconds!
      </p>
      <motion.button
        onClick={goNext}
        className="flex items-center gap-2 text-purple-500 font-semibold text-sm cursor-pointer hover:text-purple-700 transition-colors"
        animate={{ y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        aria-label="Tap to start the tour"
      >
        <Sparkles className="w-4 h-4" />
        Swipe or tap to start
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>,

    // SLIDE 1 — What is OKAYiT?
    <div key="s1" className="flex flex-col items-center text-center gap-4 px-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
        <Home className="w-8 h-8 text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">What is OKAYiT?</h2>
      <p className="text-base text-gray-600 max-w-md leading-relaxed">
        OKAYiT is a friendly digital platform built for young people living in
        residential care. Think of it as your own pocket guide to your home.
      </p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-2">
        {[
          { icon: Heart, label: 'Check in with\nyour feelings', bg: 'bg-pink-50', border: 'border-pink-200', iconColor: 'text-pink-500', textColor: 'text-pink-700' },
          { icon: Shield, label: 'Know your\nrights', bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500', textColor: 'text-green-700' },
          { icon: Users, label: 'Meet the\nteam', bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', textColor: 'text-blue-700' },
          { icon: BookOpen, label: 'Write in your\nprivate journal', bg: 'bg-purple-50', border: 'border-purple-200', iconColor: 'text-purple-500', textColor: 'text-purple-700' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className={`rounded-xl border p-3 flex flex-col items-center gap-1.5 text-center ${item.bg} ${item.border}`}
          >
            <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            <span className={`text-xs font-semibold ${item.textColor} whitespace-pre-line`}>{item.label}</span>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-gray-400 mt-1"
      >
        💡 Tap the ✨ icon in the menu to make text bigger
      </motion.p>
    </div>,

    // SLIDE 2 — How do you feel right now? (interactive)
    <div key="s2" className="flex flex-col items-center text-center gap-4 px-4 relative">
      {showConfetti && <MiniConfetti />}
      <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
        <Smile className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">How are you feeling right now?</h2>
      <p className="text-sm text-gray-500">Tap one, no wrong answers!</p>
      <div className="flex gap-4 mt-1">
        {[
          { face: '😊', label: 'Good' },
          { face: '😐', label: 'Okay' },
          { face: '😔', label: 'Not great' },
          { face: '🤷', label: 'Not sure' },
        ].map((opt) => (
          <motion.button
            key={opt.face}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => handleEmojiPick(opt.face)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
              emoji === opt.face
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-purple-300'
            }`}
          >
            <span className="text-3xl">{opt.face}</span>
            <span className="text-xs font-medium text-gray-600">{opt.label}</span>
          </motion.button>
        ))}
      </div>
      {emoji && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-purple-600 mt-1"
        >
          {emoji === '😊' ? 'Awesome! Glad to hear it! 🎉'
            : emoji === '😐' ? 'That is okay, we are here for you.'
            : emoji === '😔' ? 'Thanks for being honest. You are not alone. 💜'
            : 'That is completely fine too!'}
        </motion.p>
      )}
    </div>,


    // SLIDE 3 — Quick tour of what you can do
    <div key="s3" className="flex flex-col items-center text-center gap-4 px-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
        <Target className="w-8 h-8 text-orange-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Here is what you can do</h2>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {[
          { icon: Heart, label: 'Daily Check-In', desc: 'Tell us how you are feeling each day', bg: 'bg-pink-50', border: 'border-pink-200', iconColor: 'text-pink-500', textColor: 'text-pink-700' },
          { icon: Trophy, label: 'Quests', desc: 'Fun challenges, learn your rights and level up', bg: 'bg-purple-50', border: 'border-purple-200', iconColor: 'text-purple-500', textColor: 'text-purple-700' },
          { icon: Wind, label: 'Calm Corner', desc: 'Breathe, ground, and settle when things feel big', bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', textColor: 'text-blue-700' },
          { icon: BookOpen, label: 'Private Journal', desc: 'Write your thoughts, no one else sees them', bg: 'bg-green-50', border: 'border-green-200', iconColor: 'text-green-500', textColor: 'text-green-700' },
          { icon: Users, label: 'Meet Your Team', desc: 'Get to know the staff who support you', bg: 'bg-orange-50', border: 'border-orange-200', iconColor: 'text-orange-500', textColor: 'text-orange-700' },
          { icon: Phone, label: 'Get Help Anytime', desc: 'Helplines and contacts whenever you need them', bg: 'bg-red-50', border: 'border-red-200', iconColor: 'text-red-500', textColor: 'text-red-700' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={`flex items-center gap-3 rounded-xl p-3 ${item.bg} border ${item.border} text-left`}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-sm flex-shrink-0">
              <item.icon className={`w-5 h-5 ${item.iconColor}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-bold ${item.textColor}`}>{item.label}</p>
              <p className="text-xs text-gray-600 truncate">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>,

    // SLIDE 4 — You are ready!
    <div key="s4" className="flex flex-col items-center text-center gap-5 px-4 relative">
      {showConfetti && <MiniConfetti />}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
        transition={{ type: 'spring', damping: 8, stiffness: 120 }}
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>
      </motion.div>
      <h2 className="text-2xl font-bold text-gray-800">You are all set!</h2>
      <p className="text-base text-gray-600 max-w-md leading-relaxed">
        Remember, there is no wrong way to use OKAYiT. Go at your own pace.
        You can always come back to explore more later.
      </p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-purple-50 border border-purple-200 rounded-xl px-5 py-3 max-w-sm"
      >
        <p className="text-sm text-purple-700 font-medium">
          💜 If you ever feel worried or unsafe, tap <strong>"Get Help Anytime"</strong> in the menu, someone is always there.
        </p>
      </motion.div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleSkip}
          className="text-sm text-gray-400 hover:text-purple-600 transition-colors font-medium"
          aria-label="Skip induction and go to main menu"
        >
          Skip intro →
        </button>
      </div>

      {/* Main slide area — swipe enabled */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full max-w-lg mx-auto">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={slide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {slides[slide]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation — extra padding for mobile nav bar */}
      <div className="p-4 pb-24 flex flex-col gap-3 items-center">
        <ProgressDots />
        <div className="flex items-center gap-3 w-full max-w-sm">
          {slide > 0 && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors px-3 py-2"
              aria-label="Previous step"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
          <button
            onClick={() => {
              if (slide === TOTAL_SLIDES - 1) {
                setShowConfetti(true);
                setTimeout(() => {
                  setShowConfetti(false);
                  goNext();
                }, 1200);
              } else {
                goNext();
              }
            }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 px-6 font-bold text-base transition-all shadow-sm ${
              slide === TOTAL_SLIDES - 1
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            aria-label={slide === TOTAL_SLIDES - 1 ? 'Start exploring' : 'Next step'}
          >
            {slide === 0 ? (
              <><Sparkles className="w-5 h-5" /> Let us go!</>
            ) : slide === TOTAL_SLIDES - 1 ? (
              <><PartyPopper className="w-5 h-5" /> Start Exploring!</>
            ) : (
              <>Next <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}