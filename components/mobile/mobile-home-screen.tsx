'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, Shield, Heart, Sparkles,
  Users, QrCode, ChevronRight, ChevronDown,
  Star, MapPin, HandHeart, Building2, Trophy
} from 'lucide-react';
import { HomeContext, HOME_CONTEXTS, getHomeContext } from '@/lib/home-contexts';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import ThemeToggle from '@/components/theme-toggle';
import { useMoodResponse } from '@/lib/mood-response';
import MoodResponseBanner from '@/components/mood-response-banner';
import GettingStartedCard from '@/components/getting-started-card';

interface MobileHomeScreenProps {
  user?: any;
  currentHome: HomeContext;
  onSectionChange: (section: string) => void;
  onHomeChange?: (homeId: string) => void;
}

const moodEmojis = [
  { id: 1, emoji: '😢', label: 'Very Low', value: 1 },
  { id: 2, emoji: '😟', label: 'Low', value: 2 },
  { id: 3, emoji: '😐', label: 'Okay', value: 3 },
  { id: 4, emoji: '😊', label: 'Good', value: 4 },
  { id: 5, emoji: '😄', label: 'Great', value: 5 },
];

const quickLinks = [
  { id: 'care-quests', title: 'Quests', desc: 'Play & level up', icon: Trophy, color: 'from-fuchsia-500 to-purple-700', bg: 'bg-fuchsia-100', iconColor: 'text-fuchsia-600' },
  { id: 'house-tour', title: 'Home Tour', desc: 'Explore your home', icon: Home, color: 'from-purple-500 to-purple-700', bg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { id: 'understanding-system', title: 'My Rights', desc: 'Know your rights', icon: Shield, color: 'from-blue-500 to-blue-700', bg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { id: 'yp-resources', title: 'Resources', desc: 'Help & support', icon: BookOpen, color: 'from-green-500 to-green-700', bg: 'bg-green-100', iconColor: 'text-green-600' },
  { id: 'reflection-toolkit', title: 'Reflection', desc: 'Your space', icon: Heart, color: 'from-pink-500 to-pink-700', bg: 'bg-pink-100', iconColor: 'text-pink-600' },
];

const inspirationalQuotes = [
  'You matter. Your story matters. We\'re here with you, every step of the way.',
  'You are braver than you believe, stronger than you seem, and more than enough.',
  'Every day is a new chance to grow, learn, and be proud of yourself.',
  'Your feelings are valid. Your voice is important. You are not alone.',
  'The world is better because you are in it.',
];

export default function MobileHomeScreen({ user, currentHome, onSectionChange, onHomeChange }: MobileHomeScreenProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showMoodResponse, setShowMoodResponse] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showHomePicker, setShowHomePicker] = useState(false);

  const firstName = user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Friend';
  const { today, setTodayMood } = useMoodResponse();

  useEffect(() => {
    setMounted(true);
    const today = new Date();
    setQuoteIndex(today.getDate() % inspirationalQuotes.length);
  }, []);

  const handleMoodSelect = async (mood: typeof moodEmojis[0]) => {
    setSelectedMood(mood.value);
    setShowMoodResponse(true);

    // Let the whole platform respond to how they're feeling
    setTodayMood(mood.value, mood.label.toLowerCase().replace(/\s+/g, '-'));

    // Send email notification about mood selection
    try {
      await fetch('/api/wellbeing-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: mood.label.toLowerCase().replace(/\s+/g, '-'),
          moodLevel: mood.value * 2, // Convert 1-5 to 2-10 scale
          shareWithStaff: true,
          sendTo: mood.value <= 2 ? 'manager' : 'keyworker',
          userName: firstName,
          displayName: firstName,
          home: currentHome.fullName,
          anonymousId: user?.id || `anon_${Date.now()}`,
        }),
      });
    } catch (e) {
      console.log('Mood notification send attempted');
    }

    setTimeout(() => {
      onSectionChange('personal-wellbeing');
    }, 1200);
  };

  const getGreeting = () => {
    if (!mounted) return 'Hello';
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:bg-none relative overflow-hidden">
      {/* Subtle decorative orbs */}
      <div className="absolute top-10 -left-20 w-60 h-60 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="absolute top-60 -right-20 w-60 h-60 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative z-10 px-4 pt-6 pb-32 max-w-lg mx-auto">

        {/* Greeting + Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-start justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm font-medium">{getGreeting()}</p>
            <h1 className="text-2xl font-black text-gray-900 mt-0.5">
              Hi {firstName} 👋
            </h1>
          </div>
          <ThemeToggle />
        </motion.div>

        {/* Care Home Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-5"
        >
          <button
            onClick={() => setShowHomePicker(!showHomePicker)}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-purple-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentHome.theme.gradient} flex items-center justify-center shadow-md`}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs text-gray-500 font-medium">Your Home</p>
              <p className="text-sm font-bold text-gray-900">{currentHome.fullName}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showHomePicker ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showHomePicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-2 bg-white rounded-2xl border border-purple-200 shadow-md overflow-hidden">
                  {HOME_CONTEXTS.map((home) => {
                    const isSelected = home.id === currentHome.id;
                    return (
                      <button
                        key={home.id}
                        onClick={() => {
                          onHomeChange?.(home.id);
                          setShowHomePicker(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3.5 border-b border-gray-100 last:border-b-0 transition-colors ${
                          isSelected ? 'bg-purple-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${home.theme.gradient} flex items-center justify-center`}>
                          <Home className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-gray-900">{home.fullName}</p>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-500">{home.location}</p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mood Check-In Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-purple-200 shadow-md p-5 mb-5"
        >
          <h2 className="text-base font-bold text-gray-900 mb-4">How are you feeling today?</h2>
          
          <div className="flex items-center justify-between gap-1">
            {moodEmojis.map((mood) => (
              <motion.button
                key={mood.id}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => handleMoodSelect(mood)}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all flex-1 ${
                  selectedMood === mood.value
                    ? 'bg-purple-100 ring-2 ring-purple-400 scale-110'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-3xl" role="img" aria-label={mood.label}>{mood.emoji}</span>
                <span className="text-[10px] font-semibold text-gray-500 leading-tight text-center">{mood.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-between mt-3 px-2">
            <span className="text-[10px] text-gray-400 font-medium">Very Low</span>
            <span className="text-[10px] text-gray-400 font-medium">Great</span>
          </div>

          <AnimatePresence>
            {showMoodResponse && selectedMood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0 }}
                className={`mt-3 text-center p-3 rounded-xl ${
                  selectedMood <= 2 ? 'bg-red-50 border border-red-200' :
                  selectedMood === 3 ? 'bg-amber-50 border border-amber-200' :
                  'bg-green-50 border border-green-200'
                }`}
              >
                <p className={`text-sm font-medium ${
                  selectedMood <= 2 ? 'text-red-700' :
                  selectedMood === 3 ? 'text-amber-700' :
                  'text-green-700'
                }`}>
                  {selectedMood <= 2 ? "We're here for you 💜 Your team has been notified..." :
                   selectedMood === 3 ? "That's okay. Let's see how we can help..." :
                   "That's wonderful to hear! 🌟"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Adaptive mood-response banner — reacts to today's check-in */}
        {today && (
          <div className="mb-5">
            <MoodResponseBanner userName={firstName} onSelect={onSectionChange} />
          </div>
        )}

        {/* Getting Started — gentle onboarding checklist for new users */}
        <div className="mb-5">
          <GettingStartedCard
            userName={firstName}
            onMenuSelect={onSectionChange}
            onReplayTour={() => onSectionChange('welcome')}
          />
        </div>

        {/* Inspirational Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-5 mb-5 relative overflow-hidden shadow-lg"
        >
          <div className="absolute top-3 right-3 opacity-30">
            <Sparkles className="w-5 h-5 text-yellow-200" />
          </div>
          <div className="absolute bottom-3 left-3 opacity-20">
            <Star className="w-4 h-4 text-purple-200" />
          </div>
          
          <p className="text-lg font-bold text-white leading-snug relative z-10">
            {inspirationalQuotes[quoteIndex]}
          </p>

          <div className="flex items-center gap-2 mt-4">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 text-white" fill="currentColor" />
            </div>
            <span className="text-xs text-white/70 font-medium">OKAYiT, your safe space</span>
          </div>
        </motion.div>

        {/* Quick Links Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3 mb-5"
        >
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + idx * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSectionChange(link.id)}
                className="bg-white rounded-2xl p-4 text-left border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl ${link.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${link.iconColor}`} />
                </div>
                <p className="text-sm font-bold text-gray-900">{link.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Positive Relationships Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => onSectionChange('positive-relationships')}
            className="w-full bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-4 border border-orange-200 hover:border-orange-300 hover:shadow-md transition-all shadow-sm text-left flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md flex-shrink-0">
              <HandHeart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Positive Relationships</p>
              <p className="text-xs text-gray-500 mt-0.5">Build connections, share & grow together</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </button>
        </motion.div>

        {/* Care Home Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl border border-purple-200 shadow-sm p-5 mt-5 mb-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentHome.theme.gradient} flex items-center justify-center shadow-md`}>
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Welcome to</p>
              <p className="text-base font-black text-gray-900">{currentHome.fullName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'meet-team', label: 'Meet Our Team', desc: 'Get to know us', icon: Users, bg: 'bg-purple-100', iconColor: 'text-purple-600' },
              { id: 'welcome-guide', label: 'Your Guide', desc: 'What to expect', icon: BookOpen, bg: 'bg-blue-100', iconColor: 'text-blue-600' },
              { id: 'care-standards', label: 'House Standards', desc: 'Simple & clear', icon: Star, bg: 'bg-amber-100', iconColor: 'text-amber-600' },
              { id: 'support-center', label: 'Get Help', desc: 'Anytime, 24/7', icon: Shield, bg: 'bg-green-100', iconColor: 'text-green-600' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-purple-50 hover:border-purple-200 transition-all text-left"
                >
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-gray-500 truncate">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Footer quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-4"
        >
          <p className="text-sm text-gray-400 italic font-medium">
            "It's not just an app. It's a lifeline."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
