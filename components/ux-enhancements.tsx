
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightbulb,
  Keyboard,
  Zap,
  TrendingUp,
  Award,
  Target,
  Heart,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Info,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { okayitTheme } from '@/lib/okayit-theme';

// Quick Tips Component
export function QuickTips() {
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tips = [
    { icon: <Lightbulb className="w-5 h-5" />, text: "Explore the house tour to familiarize yourself with all the rooms", color: "text-yellow-600" },
    { icon: <Award className="w-5 h-5" />, text: "Complete activities to earn achievement certificates", color: "text-purple-600" },
    { icon: <Heart className="w-5 h-5" />, text: "Use the reflection toolkit whenever you need a moment", color: "text-pink-600" },
    { icon: <Target className="w-5 h-5" />, text: "Set personal goals in your progress dashboard", color: "text-blue-600" },
    { icon: <Sparkles className="w-5 h-5" />, text: "Check daily inspiration for motivation", color: "text-purple-600" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tips.length]);

  if (!isVisible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTip}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-40"
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 border border-blue-200 dark:border-blue-800 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className={`${tips[currentTip].color} mt-1`}>
                {tips[currentTip].icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                    TIP {currentTip + 1} OF {tips.length}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {tips[currentTip].text}
                </p>
              </div>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-1 mt-3">
              {tips.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    idx === currentTip ? 'bg-blue-600' : 'bg-blue-200 dark:bg-blue-900'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

// Keyboard Shortcuts Helper
export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'H', description: 'Return to Home/Main Menu' },
    { key: 'F', description: 'Toggle Fullscreen Mode' },
    { key: 'ESC', description: 'Go Back/Close' },
    { key: 'Space', description: 'Play/Pause Audio/Video' },
    { key: '?', description: 'Show Keyboard Shortcuts' }
  ];

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && (e.shiftKey || e.key === '?')) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white z-40"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-md">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="w-6 h-6" />
                    Keyboard Shortcuts
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {shortcuts.map((shortcut, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {shortcut.description}
                        </span>
                        <Badge variant="secondary" className="font-mono font-bold">
                          {shortcut.key}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    Got it
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Progress Streak Component
export function ProgressStreak() {
  const [streak, setStreak] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const savedStreak = localStorage.getItem('dailyStreak');
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="fixed top-20 right-6 z-40"
    >
      <Card className="bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🔥</div>
            <div>
              <div className="text-2xl font-bold">{streak} Days</div>
              <div className="text-xs opacity-90">Activity Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quick Actions Menu
export function QuickActionsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: <Target className="w-5 h-5" />, label: 'Set a Goal', color: 'from-blue-500 to-blue-600' },
    { icon: <Heart className="w-5 h-5" />, label: 'Wellbeing Check', color: 'from-pink-500 to-pink-600' },
    { icon: <Award className="w-5 h-5" />, label: 'View Certificates', color: 'from-purple-500 to-purple-600' },
    { icon: <Sparkles className="w-5 h-5" />, label: 'Daily Inspiration', color: 'from-yellow-500 to-orange-600' }
  ];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="mb-4 space-y-2"
          >
            {actions.map((action, idx) => (
              <motion.button
                key={idx}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-md transition-all group`}
              >
                {action.icon}
                <span className="font-medium">{action.label}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      >
        <Zap className="w-6 h-6" />
      </Button>
    </div>
  );
}

// Loading State Component
export function EnhancedLoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xl font-medium text-slate-700 dark:text-slate-300"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}

// Success Toast Component
export function SuccessToast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <p className="font-medium">{message}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Animated Page Transitions
export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
