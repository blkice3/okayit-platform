
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, BookOpen, Gamepad2, QrCode, Users, Sparkles, Heart, HandHeart,
  ArrowRight, HeadphonesIcon, MessageCircle, Star, Award,
  Trophy, Lightbulb, Shield, Target, FileText, ChevronRight, TrendingUp, HardDrive, Clock,
  Search, X, Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import OKAYiTLogo from './okayit-logo';
import HomeSelector from '@/components/home-selector';
import { HomeContext } from '@/lib/home-contexts';
import MoodResponseBanner from './mood-response-banner';
import GettingStartedCard from './getting-started-card';

interface ComprehensiveMainMenuProps {
  onMenuSelect: (section: string) => void;
  user?: any;
  session?: any;
  currentHome: HomeContext;
  onHomeChange: (homeId: string) => void;
  userName?: string;
  onBackToWelcome?: () => void;
  defaultTab?: number;
  onTabChange?: (tab: number) => void;
  onAccessibilityOpen?: () => void;
}

export default function ComprehensiveMainMenu({ 
  onMenuSelect, 
  user, 
  session, 
  currentHome, 
  onHomeChange,
  userName = 'Friend',
  onBackToWelcome,
  defaultTab = 0,
  onTabChange,
  onAccessibilityOpen
}: ComprehensiveMainMenuProps) {

  const categories = [
    {
      label: 'Get Started',
      items: [
        { id: 'house-tour', title: 'QR House Tour', desc: 'Scan QR codes to explore', icon: QrCode, color: 'purple' },
        { id: 'welcome-guide', title: 'Welcome Guide', desc: 'Everything about your new home', icon: BookOpen, color: 'blue' },
        { id: 'meet-team', title: 'Meet the People', desc: 'Who is here to support you', icon: Users, color: 'purple' },
        { id: 'understanding-system', title: 'Your Rights', desc: 'What protects you and how', icon: Shield, color: 'blue' },
        { id: 'care-standards', title: '9 Standards of Care', desc: 'What your home must provide', icon: Award, color: 'green' },
        { id: 'what-happens-next', title: 'What Happens Next', desc: 'Your first day, week, and month', icon: Clock, color: 'green' },
      ]
    },
    {
      label: 'Explore',
      items: [
        { id: 'care-quests', title: 'Quests', desc: 'Fun challenges, learn your rights & level up', icon: Trophy, color: 'purple' },
        { id: 'positive-relationships', title: 'Positive Relationships', desc: 'Build connections, grow together', icon: HandHeart, color: 'orange' },
        { id: 'family-gaming', title: 'Games and Fun', desc: 'Play, relax, and have fun', icon: Gamepad2, color: 'orange' },
        { id: 'reflective-stories', title: 'Real Stories', desc: 'Hear from other young people', icon: HeadphonesIcon, color: 'green' },
        { id: 'reflection-toolkit', title: 'Reflection Space', desc: 'Think, write, and express', icon: Lightbulb, color: 'pink' },
        { id: 'digital-resources', title: 'Useful Guides', desc: 'Life skills, education, and more', icon: BookOpen, color: 'blue' },
        { id: 'yp-resources', title: 'Your Resources', desc: 'Activities, tools and support just for you', icon: Sparkles, color: 'pink' },
      ]
    },
    {
      label: 'Support',
      items: [
        { id: 'personal-wellbeing', title: 'How Are You Feeling?', desc: 'Check in with yourself', icon: Heart, color: 'green' },
        { id: 'calm-corner', title: 'Calm Corner', desc: 'Breathe, ground, and settle, a quiet space', icon: Wind, color: 'blue' },
        { id: 'support-center', title: 'Get Help Anytime', desc: 'Someone to talk to, any time', icon: Heart, color: 'pink' },
        { id: 'keyworker-resources', title: 'Your Key Worker', desc: 'What they do and how they help', icon: Users, color: 'purple' },
        { id: 'safety-plan', title: 'My Safety Plan', desc: 'People and places that help me feel safe', icon: Shield, color: 'red' },
        { id: 'feedback', title: 'Tell Us What You Think', desc: 'Your opinion matters', icon: MessageCircle, color: 'green' },
      ]
    },
    {
      label: 'My Stuff',
      items: [
        { id: 'my-journal', title: 'My Private Journal', desc: 'Write your thoughts, just for you', icon: BookOpen, color: 'purple' },
        { id: 'identity-profile', title: 'About Me', desc: 'Your profile, interests, and dreams', icon: Sparkles, color: 'pink' },
        { id: 'my-info', title: 'My Important Info', desc: 'Contacts, dates, and key details', icon: Users, color: 'blue' },
        { id: 'mood-trends', title: 'My Wellbeing Story', desc: 'Gentle insights into how you have been feeling', icon: TrendingUp, color: 'green' },
        { id: 'progress', title: 'My Progress', desc: 'See what you have explored', icon: Target, color: 'purple' },
        { id: 'achievements', title: 'My Certificates', desc: 'View and download your certificates', icon: Trophy, color: 'yellow' },
        { id: 'saved-work', title: 'My Saved Work', desc: 'Reflections, forms, and writing', icon: FileText, color: 'blue' },
        { id: 'data-backup', title: 'Backup My Data', desc: 'Download or restore your data', icon: HardDrive, color: 'green' },
      ]
    },
  ];

  const staffItems = [
    { id: 'admin-dashboard', title: 'Staff Area', desc: 'Login to view wellbeing data', icon: Shield, color: 'purple' },
    { id: 'accessibility-settings', title: 'Make It Easier to Read', desc: 'Change text size and colours', icon: Sparkles, color: 'blue' },
  ];

  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tab: number) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  const [searchQuery, setSearchQuery] = useState('');

  const colorMap: Record<string, { bg: string; text: string; icon: string; border: string; hover: string }> = {
    purple: { bg: 'bg-purple-50', text: 'text-purple-800', icon: 'text-purple-600', border: 'border-purple-200', hover: 'hover:bg-purple-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-800', icon: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-800', icon: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-100' },
    green: { bg: 'bg-green-50', text: 'text-green-800', icon: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-100' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-800', icon: 'text-pink-600', border: 'border-pink-200', hover: 'hover:bg-pink-100' },
    yellow: { bg: 'bg-amber-50', text: 'text-amber-800', icon: 'text-amber-600', border: 'border-amber-200', hover: 'hover:bg-amber-100' },
    red: { bg: 'bg-red-50', text: 'text-red-800', icon: 'text-red-600', border: 'border-red-200', hover: 'hover:bg-red-100' },
  };

  const tabMeta = [
    { label: 'Start', emoji: '🏠' },
    { label: 'Explore', emoji: '🎮' },
    { label: 'Support', emoji: '💜' },
    { label: 'My Stuff', emoji: '📓' },
  ];

  // Flatten all items for search
  const allItems = useMemo(() => {
    const items: Array<typeof categories[0]['items'][0] & { category: string }> = [];
    categories.forEach(cat => cat.items.forEach(item => items.push({ ...item, category: cat.label })));
    staffItems.forEach(item => items.push({ ...item, category: 'Settings' }));
    return items;
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allItems.filter(
      item => item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [searchQuery, allItems]);

  const isSearching = searchQuery.trim().length > 0;

  const MenuItem = ({ item, index }: { item: typeof categories[0]['items'][0]; index: number }) => {
    const Icon = item.icon;
    const c = colorMap[item.color] || colorMap.purple;
    return (
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.03 * index }}
        onClick={() => onMenuSelect(item.id)}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border ${c.border} ${c.bg} ${c.hover} transition-all duration-200 text-left group cursor-pointer`}
      >
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${c.text} leading-tight`}>{item.title}</p>
          <p className="text-xs text-gray-600 font-medium leading-tight mt-0.5 truncate">{item.desc}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Compact Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onBackToWelcome && (
              <button
                onClick={onBackToWelcome}
                className="text-purple-600 text-sm font-bold hover:text-purple-800 transition-colors mr-1"
              >
                &larr;
              </button>
            )}
            <OKAYiTLogo width={32} height={32} />
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">{currentHome.fullName}</p>
              <p className="text-xs text-gray-500 font-medium">Hello, {userName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onAccessibilityOpen && (
              <button
                onClick={onAccessibilityOpen}
                className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center hover:bg-blue-100 transition-colors"
                aria-label="Accessibility settings"
                title="Make it easier to read"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
              </button>
            )}
            <HomeSelector currentHome={currentHome} onHomeChange={onHomeChange} />
          </div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="mood-strip mt-1.5" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 transition-all"
              />
              {isSearching && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>

          {/* Search Results */}
          {isSearching ? (
            <div className="space-y-2">
              {searchResults.length > 0 ? (
                <>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 mb-2">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResults.map((item, idx) => (
                      <MenuItem key={item.id} item={item} index={idx} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 font-medium text-sm">No results for &ldquo;{searchQuery}&rdquo;</p>
                  <p className="text-gray-400 text-xs mt-1">Try a different word or browse the tabs below</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Getting Started — gentle onboarding checklist for new users */}
              <GettingStartedCard
                userName={userName}
                onMenuSelect={onMenuSelect}
                onReplayTour={onBackToWelcome}
              />

              {/* Adaptive mood response — the platform reacts to today's check-in */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <MoodResponseBanner userName={userName} onSelect={onMenuSelect} />
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="grid grid-cols-3 gap-2 mb-5"
              >
                {[
                  { id: 'personal-wellbeing', label: 'How Am I Feeling?', icon: Heart, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
                  { id: 'support-center', label: 'Need Help?', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200' },
                  { id: 'meet-team', label: 'Meet the Team', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
                ].map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.id}
                      onClick={() => onMenuSelect(q.id)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border ${q.bg} hover:shadow-md transition-all cursor-pointer`}
                    >
                      <Icon className={`w-5 h-5 ${q.color}`} />
                      <span className="text-xs font-bold text-gray-800 text-center leading-tight">{q.label}</span>
                    </button>
                  );
                })}
              </motion.div>

              {/* Tab Bar */}
              <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
                {tabMeta.map((tab, idx) => (
                  <button
                    key={tab.label}
                    onClick={() => handleTabChange(idx)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                      activeTab === idx
                        ? 'bg-white text-purple-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>{tab.emoji}</span>
                    <span className="hidden xs:inline">{tab.label}</span>
                    <span className="xs:hidden">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Active Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">
                    {categories[activeTab].label}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {categories[activeTab].items.map((item, idx) => (
                      <MenuItem key={item.id} item={item} index={idx} />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Settings — always visible */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5"
              >
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {staffItems.map((item, idx) => (
                    <MenuItem key={item.id} item={item} index={20 + idx} />
                  ))}
                </div>
              </motion.div>

              {/* Reassuring Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 mb-4 text-center"
              >
                <div className="inline-block bg-purple-50 border border-purple-200 rounded-xl px-5 py-3">
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    You are safe here. There is no wrong way to use this.
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
