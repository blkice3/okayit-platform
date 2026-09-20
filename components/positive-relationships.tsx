'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Users, MessageCircle, Star, Shield, HandHeart,
  Sparkles, Target, BookOpen, ChevronRight, Award, ThumbsUp,
  Smile, Flower2, Eye, Ear, Clock, PenTool
} from 'lucide-react';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { Button } from '@/components/ui/button';
import { trackActivity } from './progress-dashboard-new';
import { toast } from 'sonner';
import VoiceInputButton from './voice-input-button';

interface PositiveRelationshipsProps {
  onBack: () => void;
  user?: any;
}

type ActivityCategory = 'communication' | 'trust' | 'gratitude' | 'conflict' | 'empathy' | 'boundaries';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  icon: any;
  color: string;
  iconBg: string;
  steps: string[];
  reflectionPrompt: string;
  timeMinutes: number;
}

const categories: { id: ActivityCategory; label: string; icon: any; color: string; description: string }[] = [
  { id: 'communication', label: 'Communication', icon: MessageCircle, color: 'bg-blue-100 text-blue-600', description: 'Learn to express yourself clearly' },
  { id: 'trust', label: 'Building Trust', icon: Shield, color: 'bg-purple-100 text-purple-600', description: 'Create safe, trusting connections' },
  { id: 'gratitude', label: 'Gratitude', icon: Heart, color: 'bg-pink-100 text-pink-600', description: 'Appreciate the good in your life' },
  { id: 'conflict', label: 'Resolving Conflict', icon: Target, color: 'bg-orange-100 text-orange-600', description: 'Handle disagreements with respect' },
  { id: 'empathy', label: 'Empathy', icon: Eye, color: 'bg-green-100 text-green-600', description: 'Understand how others feel' },
  { id: 'boundaries', label: 'Healthy Boundaries', icon: Shield, color: 'bg-amber-100 text-amber-600', description: 'Know your limits and respect others\'' },
];

const activities: Activity[] = [
  // Communication
  {
    id: 'active-listening',
    title: 'Active Listening Challenge',
    description: 'Practice really hearing what someone is saying, without interrupting or planning your reply.',
    category: 'communication',
    icon: Ear,
    color: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-100',
    steps: [
      'Find someone you trust, a key worker, friend, or housemate.',
      'Ask them to tell you about their favourite memory for 2 minutes.',
      'While they speak, focus only on listening. No interrupting!',
      'When they finish, repeat back what you heard in your own words.',
      'Ask them: "Did I get that right?", and notice how they respond.',
    ],
    reflectionPrompt: 'How did it feel to really listen without interrupting? What did you notice?',
    timeMinutes: 10,
  },
  {
    id: 'i-statements',
    title: 'Using "I" Statements',
    description: 'Learn to express feelings without blame, a powerful skill for any relationship.',
    category: 'communication',
    icon: MessageCircle,
    color: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-100',
    steps: [
      'Think of a recent situation that upset you.',
      'Instead of "You always..." or "You never...", try: "I feel [emotion] when [situation] because [reason]."',
      'Example: "I feel frustrated when plans change last minute because I need time to prepare."',
      'Practice writing 3 "I" statements about different situations.',
      'Try using one in a real conversation this week.',
    ],
    reflectionPrompt: 'Write an "I" statement about something that\'s been on your mind recently.',
    timeMinutes: 15,
  },
  // Trust
  {
    id: 'trust-circle',
    title: 'My Circle of Trust',
    description: 'Identify the people in your life you can rely on, and think about why.',
    category: 'trust',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-100',
    steps: [
      'Draw 3 circles: Inner (closest), Middle (trusted), Outer (acquaintances).',
      'Write names of people in each circle, be honest with yourself.',
      'For each person in your inner circle, write one reason you trust them.',
      'Think: Is there anyone you\'d like to move closer to the centre? What could help?',
      'Remember: It\'s okay to have a small inner circle. Quality matters more than quantity.',
    ],
    reflectionPrompt: 'What makes someone trustworthy to you? What does trust look like?',
    timeMinutes: 15,
  },
  {
    id: 'trust-building',
    title: 'Small Acts of Trust',
    description: 'Trust is built through small, consistent actions over time, not grand gestures.',
    category: 'trust',
    icon: HandHeart,
    color: 'from-purple-500 to-pink-600',
    iconBg: 'bg-purple-100',
    steps: [
      'Choose one person you\'d like to build trust with.',
      'This week, try one small trust-building action: keeping a promise, showing up on time, or checking in on them.',
      'Notice how they respond, don\'t expect instant results.',
      'If trust has been broken before, remember: rebuilding takes time, and that\'s okay.',
      'Write down one thing you did and how it went.',
    ],
    reflectionPrompt: 'What small action did you take? How did it feel?',
    timeMinutes: 5,
  },
  // Gratitude
  {
    id: 'gratitude-jar',
    title: 'Digital Gratitude Jar',
    description: 'Write down 3 things you\'re grateful for today, even small ones count.',
    category: 'gratitude',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-600',
    iconBg: 'bg-pink-100',
    steps: [
      'Find a quiet moment, maybe before bed or first thing in the morning.',
      'Think of 3 things you\'re grateful for. They can be tiny: a warm bed, a nice meal, a friendly word.',
      'Write each one down below.',
      'For one of them, think about a person connected to that good thing.',
      'If you feel brave, tell that person you appreciate them.',
    ],
    reflectionPrompt: 'What are 3 things you\'re grateful for today?',
    timeMinutes: 5,
  },
  {
    id: 'thank-you-note',
    title: 'Write a Thank You',
    description: 'Write a note of appreciation to someone who has made a difference in your life.',
    category: 'gratitude',
    icon: PenTool,
    color: 'from-pink-500 to-orange-500',
    iconBg: 'bg-pink-100',
    steps: [
      'Think of someone who has helped you, been kind, or made you smile recently.',
      'Write them a short note, it doesn\'t have to be perfect.',
      'Tell them what they did and how it made you feel.',
      'You can give it to them, read it out, or just keep it for yourself.',
      'Notice how writing it makes you feel.',
    ],
    reflectionPrompt: 'Who would you like to thank, and what would you say?',
    timeMinutes: 10,
  },
  // Conflict
  {
    id: 'cool-down-plan',
    title: 'My Cool-Down Plan',
    description: 'Create your personal plan for when emotions run high during disagreements.',
    category: 'conflict',
    icon: Clock,
    color: 'from-orange-500 to-orange-600',
    iconBg: 'bg-orange-100',
    steps: [
      'Think about what happens in your body when you get angry or upset (racing heart, clenched fists, etc).',
      'Choose a "pause signal", something you can say or do to take a break (e.g., "I need 5 minutes").',
      'Pick 3 cooling-down activities that work for you: deep breathing, walking, listening to music, counting.',
      'Write down your plan so you can remember it when emotions are high.',
      'Practice your pause signal when you\'re calm, so it feels natural when you need it.',
    ],
    reflectionPrompt: 'What\'s your go-to cooling-down strategy? How does it help?',
    timeMinutes: 10,
  },
  // Empathy
  {
    id: 'walk-in-shoes',
    title: 'Walk in Their Shoes',
    description: 'Try to see a situation from someone else\'s perspective, it changes everything.',
    category: 'empathy',
    icon: Eye,
    color: 'from-green-500 to-emerald-600',
    iconBg: 'bg-green-100',
    steps: [
      'Think of a recent disagreement or misunderstanding with someone.',
      'Close your eyes and imagine you ARE that person.',
      'What might they be feeling? What\'s going on in their life?',
      'Think of 3 possible reasons they acted the way they did.',
      'Does seeing their perspective change how you feel about the situation?',
    ],
    reflectionPrompt: 'What did you learn from trying to see things from their perspective?',
    timeMinutes: 10,
  },
  {
    id: 'kindness-challenge',
    title: '5 Acts of Kindness',
    description: 'Do 5 small kind things this week, for others and yourself.',
    category: 'empathy',
    icon: Flower2,
    color: 'from-green-500 to-teal-600',
    iconBg: 'bg-green-100',
    steps: [
      'Plan 5 small acts of kindness for the week (one per day on weekdays).',
      'Ideas: hold a door, say something nice, help with a chore, send a kind message, make someone laugh.',
      'Include at least one act of kindness towards YOURSELF (rest, treat, positive self-talk).',
      'After each one, notice how it made you, and them, feel.',
      'Write down what you did and what happened.',
    ],
    reflectionPrompt: 'Which act of kindness felt the best? Why?',
    timeMinutes: 5,
  },
  // Boundaries
  {
    id: 'saying-no',
    title: 'The Power of Saying No',
    description: 'Saying no is a sign of strength, not rudeness. Learn when and how.',
    category: 'boundaries',
    icon: Shield,
    color: 'from-amber-500 to-amber-600',
    iconBg: 'bg-amber-100',
    steps: [
      'Think of a time you said yes when you wanted to say no. How did it feel?',
      'Practice these phrases: "I\'m not comfortable with that", "I need to think about it", "No thanks, but I appreciate you asking."',
      'Remember: you don\'t need to give a reason. "No" is a complete sentence.',
      'Think about one situation this week where you could practise a healthy "no".',
      'Reflect: saying no to one thing means saying yes to something else (like your wellbeing).',
    ],
    reflectionPrompt: 'When was a time you wished you had said no? What would you do differently now?',
    timeMinutes: 10,
  },
];

const STORAGE_KEY = 'okayit-positive-relationships';

export default function PositiveRelationships({ onBack, user }: PositiveRelationshipsProps) {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | null>(null);
  const [activeActivity, setActiveActivity] = useState<Activity | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [reflectionText, setReflectionText] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setCompletedActivities(data.completed || []);
        setReflections(data.reflections || {});
      }
    } catch {}
  }, []);

  const saveProgress = (completed: string[], refs: Record<string, string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed, reflections: refs }));
    } catch {}
  };

  const handleCompleteActivity = () => {
    if (!activeActivity) return;
    const newCompleted = [...new Set([...completedActivities, activeActivity.id])];
    const newReflections = { ...reflections, [activeActivity.id]: reflectionText };
    setCompletedActivities(newCompleted);
    setReflections(newReflections);
    saveProgress(newCompleted, newReflections);
    trackActivity('resource' as any, `Completed: ${activeActivity.title}`);
    toast.success('Well done! Activity completed 🌟');
    setActiveActivity(null);
    setCurrentStep(0);
    setReflectionText('');
  };

  const filteredActivities = selectedCategory
    ? activities.filter(a => a.category === selectedCategory)
    : activities;

  const totalCompleted = completedActivities.length;
  const totalActivities = activities.length;

  // Activity detail view
  if (activeActivity) {
    const isLastStep = currentStep >= activeActivity.steps.length;
    const isReflectionStep = isLastStep;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="px-4 pt-6 pb-32 max-w-lg mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => { setActiveActivity(null); setCurrentStep(0); setReflectionText(''); }}
              className="p-2 -ml-2 rounded-xl hover:bg-white/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{activeActivity.title}</h2>
              <p className="text-xs text-gray-500">{activeActivity.timeMinutes} min activity</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1 mb-6">
            {[...activeActivity.steps, 'reflection'].map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  idx <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {!isReflectionStep ? (
            /* Step view */
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-purple-200 shadow-md p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-purple-600">{currentStep + 1}</span>
                </div>
                <span className="text-xs font-medium text-gray-500">Step {currentStep + 1} of {activeActivity.steps.length}</span>
              </div>
              <p className="text-base text-gray-800 leading-relaxed font-medium">
                {activeActivity.steps[currentStep]}
              </p>

              <div className="flex gap-2 mt-6">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {currentStep === activeActivity.steps.length - 1 ? 'Reflect' : 'Next'}
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Reflection view */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl border border-purple-200 shadow-md p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-pink-600" />
                </div>
                <span className="text-sm font-bold text-gray-900">Your Reflection</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {activeActivity.reflectionPrompt}
              </p>
              <div className="relative">
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Write your thoughts here... (optional)"
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-800 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
                />
                <div className="absolute bottom-2 right-2">
                  <VoiceInputButton onTranscript={(text) => setReflectionText(prev => prev ? prev + ' ' + text : text)} />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCompleteActivity}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Award className="w-4 h-4 mr-1.5" />
                  Complete
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  // Main view
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <div className="px-4 pt-6 pb-32 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl hover:bg-white/80 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-black text-gray-900">Positive Relationships</h1>
            <p className="text-xs text-gray-500 mt-0.5">Build connections, grow together</p>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-100 px-3 py-1.5 rounded-full">
            <Star className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs font-bold text-purple-700">{totalCompleted}/{totalActivities}</span>
          </div>
        </div>

        {/* Intro Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-5 mb-5 shadow-lg text-white relative overflow-hidden"
        >
          <div className="absolute top-3 right-3 opacity-20"><HandHeart className="w-16 h-16" /></div>
          <h2 className="text-lg font-bold relative z-10">Healthy relationships matter</h2>
          <p className="text-sm text-white/90 mt-1 relative z-10 leading-relaxed">
            Good relationships are built on trust, respect, and communication. These activities help you practise the skills that make relationships stronger.
          </p>
        </motion.div>

        {/* Category filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-bold transition-all ${
              !selectedCategory ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat.id ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Category description */}
        {selectedCategory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
            <p className="text-sm text-gray-600 bg-white/80 rounded-xl px-3 py-2 border border-gray-100">
              {categories.find(c => c.id === selectedCategory)?.description}
            </p>
          </motion.div>
        )}

        {/* Activities list */}
        <div className="space-y-3">
          {filteredActivities.map((activity, idx) => {
            const Icon = activity.icon;
            const isCompleted = completedActivities.includes(activity.id);
            return (
              <motion.button
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => { setActiveActivity(activity); setCurrentStep(0); setReflectionText(reflections[activity.id] || ''); }}
                className={`w-full bg-white rounded-2xl p-4 border shadow-sm hover:shadow-md transition-all text-left flex items-center gap-3 ${
                  isCompleted ? 'border-green-200 bg-green-50/50' : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                  {isCompleted ? (
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <Icon className={`w-5 h-5 ${activity.iconBg.replace('bg-', 'text-').replace('-100', '-600')}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">{activity.title}</p>
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">Done</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500 font-medium">{activity.timeMinutes} min</span>
                    <span className="text-[10px] text-gray-400">•</span>
                    <span className="text-[10px] text-gray-500 font-medium capitalize">{activity.category.replace('-', ' ')}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </motion.button>
            );
          })}
        </div>

        {/* Encouragement when progress is made */}
        {totalCompleted > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-500">
              {totalCompleted >= totalActivities
                ? '🌟 Amazing! You\'ve completed all activities. Keep practising these skills!'
                : totalCompleted >= 5
                ? '💪 You\'re doing brilliantly! Keep going.'
                : '🌱 Great start! Every step builds stronger relationships.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
