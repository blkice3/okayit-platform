
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Heart, Star, Sun } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

const inspirationalQuotes = [
  {
    text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
    author: "A.A. Milne"
  },
  {
    text: "Your story is not over yet. Every day is a new chapter to write.",
    author: "Unknown"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "You don't have to be perfect to be amazing. You already are.",
    author: "Care Experience Wisdom"
  },
  {
    text: "Small steps in the right direction can turn out to be the biggest step of your life.",
    author: "Naeem Callaway"
  },
  {
    text: "You are allowed to be both a masterpiece and a work in progress simultaneously.",
    author: "Sophia Bush"
  },
  {
    text: "Believe in yourself and all that you are. You have everything you need inside you.",
    author: "Christian D. Larson"
  },
  {
    text: "Your past does not define your future. You get to write your own story.",
    author: "Unknown"
  },
  {
    text: "Be proud of who you are becoming. Every day you grow stronger.",
    author: "Unknown"
  },
  {
    text: "You are not alone. There are people who care about you and want to help.",
    author: "Care Support Team"
  },
  {
    text: "It's okay to ask for help. That's not giving up, that's refusing to give up.",
    author: "Charlie Mackesy"
  },
  {
    text: "You matter. Your feelings matter. Your voice matters. You are important.",
    author: "Unknown"
  },
  {
    text: "Every accomplishment starts with the decision to try. You've got this!",
    author: "John F. Kennedy"
  },
  {
    text: "Difficult roads often lead to beautiful destinations. Keep going.",
    author: "Zig Ziglar"
  },
  {
    text: "You are enough, just as you are. You don't need to change for anyone.",
    author: "Meghan Markle"
  }
];

export default function DailyInspiration() {
  const [quote, setQuote] = useState(inspirationalQuotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Get quote of the day based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const quoteIndex = dayOfYear % inspirationalQuotes.length;
    setQuote(inspirationalQuotes[quoteIndex]);
  }, []);

  const getNewQuote = () => {
    setIsVisible(false);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      setQuote(inspirationalQuotes[randomIndex]);
      setIsVisible(true);
    }, 300);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={quote.text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={combineThemeClasses(
            "relative overflow-hidden",
            okayitTheme.backgrounds.whiteCardPurple
          )}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={okayitTheme.icons.purple}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold mb-2 text-purple-700">
                    Daily Inspiration
                  </h3>
                  <p className="text-lg font-semibold mb-2 italic text-gray-900">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  <p className="text-sm text-gray-700">
                    - {quote.author}
                  </p>
                </div>
                <Button
                  onClick={getNewQuote}
                  size="sm"
                  className={okayitTheme.interactive.navPurple}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
