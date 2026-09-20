

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Star, Sun, Smile, Zap, Award, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { okayitTheme, tikTokTransitions } from '@/lib/okayit-theme';

const motivationalQuotes = [
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think!",
    author: "A.A. Milne",
    icon: Star,
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    text: "Every day may not be good, but there's something good in every day.",
    author: "Alice Morse Earle",
    icon: Sun,
    gradient: "from-orange-400 to-pink-500"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    icon: Heart,
    gradient: "from-pink-400 to-rose-500"
  },
  {
    text: "Believe you can and you're halfway there!",
    author: "Theodore Roosevelt",
    icon: Zap,
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    text: "You're amazing just the way you are!",
    author: "Bruno Mars",
    icon: Sparkles,
    gradient: "from-purple-400 to-pink-500"
  },
  {
    text: "Small steps every day lead to big changes!",
    author: "Unknown",
    icon: TrendingUp,
    gradient: "from-green-400 to-emerald-500"
  },
  {
    text: "Your potential is endless. Keep going!",
    author: "Unknown",
    icon: Award,
    gradient: "from-indigo-400 to-blue-500"
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    icon: Smile,
    gradient: "from-cyan-400 to-teal-500"
  }
];

export default function MotivationalWidget() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
        setIsVisible(true);
      }, 500);
    }, 15000); // Change quote every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const quote = motivationalQuotes[currentQuote];
  const Icon = quote.icon;

  return (
    <Card className={`${okayitTheme.backgrounds.card} p-6 overflow-hidden relative`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${quote.gradient} opacity-10`} />
      
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentQuote}
            {...tikTokTransitions.fade}
            className="relative z-10"
          >
            <div className="flex items-start gap-4">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className={`p-3 rounded-xl bg-gradient-to-br ${quote.gradient} shadow-md flex-shrink-0`}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>

              <div className="flex-1">
                <p className="text-gray-900 text-lg font-bold leading-relaxed mb-2">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p className="text-gray-700 text-sm font-semibold">
                  {quote.author}
                </p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-4">
              {motivationalQuotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => {
                      setCurrentQuote(index);
                      setIsVisible(true);
                    }, 300);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuote
                      ? 'bg-gradient-to-r ' + quote.gradient + ' w-6'
                      : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                  aria-label={`View quote ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
