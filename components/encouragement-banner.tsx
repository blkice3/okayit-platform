
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Heart, Star, Award, PartyPopper, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { okayitTheme, tikTokTransitions } from '@/lib/okayit-theme';

interface EncouragementMessage {
  id: string;
  title: string;
  message: string;
  icon: React.ElementType;
  gradient: string;
  trigger: 'milestone' | 'checkin' | 'time' | 'random';
}

const encouragementMessages: EncouragementMessage[] = [
  {
    id: 'morning',
    title: 'Good Morning!',
    message: 'Today is full of possibilities! What will you discover?',
    icon: Sparkles,
    gradient: 'from-yellow-400 via-orange-400 to-pink-500',
    trigger: 'time'
  },
  {
    id: 'milestone_10',
    title: 'Amazing Progress!',
    message: 'You\'re making great strides! Keep up the fantastic work!',
    icon: Trophy,
    gradient: 'from-purple-400 via-pink-500 to-red-500',
    trigger: 'milestone'
  },
  {
    id: 'checkin',
    title: 'Thank You!',
    message: 'Sharing your feelings takes courage. You\'re doing great!',
    icon: Heart,
    gradient: 'from-blue-400 via-cyan-500 to-teal-500',
    trigger: 'checkin'
  },
  {
    id: 'random_1',
    title: 'You\'re Doing Great!',
    message: 'Remember: Small steps forward are still progress!',
    icon: Star,
    gradient: 'from-indigo-400 via-purple-500 to-pink-500',
    trigger: 'random'
  },
  {
    id: 'afternoon',
    title: 'Keep Going!',
    message: 'You\'ve got this! Every effort counts!',
    icon: Award,
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    trigger: 'time'
  },
  {
    id: 'evening',
    title: 'Well Done Today!',
    message: 'Take a moment to be proud of what you\'ve accomplished!',
    icon: PartyPopper,
    gradient: 'from-pink-400 via-purple-500 to-indigo-500',
    trigger: 'time'
  }
];

interface EncouragementBannerProps {
  trigger?: 'milestone' | 'checkin' | 'time' | 'random';
  onClose?: () => void;
}

export default function EncouragementBanner({ trigger = 'time', onClose }: EncouragementBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<EncouragementMessage | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Select message based on trigger
    const selectMessage = () => {
      const relevantMessages = encouragementMessages.filter(msg => msg.trigger === trigger);
      
      if (relevantMessages.length > 0) {
        const randomMessage = relevantMessages[Math.floor(Math.random() * relevantMessages.length)];
        setCurrentMessage(randomMessage);
      }
    };

    selectMessage();
  }, [trigger]);

  if (!currentMessage) return null;

  const Icon = currentMessage.icon;

  return (
    <motion.div
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ y: -100 }}
      animate={{ y: isExpanded || isHovering ? 0 : -60 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 25 
      }}
    >
      <Card className={`${okayitTheme.backgrounds.card} ${okayitTheme.effects.glowShadow} overflow-hidden relative mt-4 cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Gradient Background */}
        <div className={`absolute inset-0 bg-gradient-to-r ${currentMessage.gradient} opacity-20`} />
        
        {/* Collapsed State - Small Tab */}
        <AnimatePresence mode="wait">
          {!isExpanded && !isHovering && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-10 p-2 flex items-center justify-center gap-2"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className={`p-2 rounded-xl bg-gradient-to-br ${currentMessage.gradient} shadow-lg flex-shrink-0`}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>
              <ChevronDown className="w-5 h-5 text-gray-900 dark:text-gray-300 animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded State - Full Content */}
        <AnimatePresence mode="wait">
          {(isExpanded || isHovering) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 p-4"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className={`p-3 rounded-2xl bg-gradient-to-br ${currentMessage.gradient} shadow-md flex-shrink-0`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-gray-900 text-xl mb-1 font-bold">
                    {currentMessage.title}
                  </h3>
                  <p className="text-gray-700 text-base">
                    {currentMessage.message}
                  </p>
                </div>

                {/* Collapse Button */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  variant="ghost"
                  className="flex-shrink-0 w-10 h-10 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronUp className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Hook to trigger encouragement banner
export function useEncouragement() {
  const [trigger, setTrigger] = useState<'milestone' | 'checkin' | 'time' | 'random' | null>(null);

  const showEncouragement = (type: 'milestone' | 'checkin' | 'time' | 'random') => {
    setTrigger(type);
    
    // Reset trigger after showing
    setTimeout(() => {
      setTrigger(null);
    }, 10000);
  };

  return { trigger, showEncouragement };
}
