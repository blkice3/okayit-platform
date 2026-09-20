'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Home, Users, BookOpen, Shield, MessageCircle,
  Smile, ArrowRight, Sparkles, ChevronRight, CheckCircle2,
  Star, Lock, HandHeart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import OKAYiTLogo from './okayit-logo';

interface GuidedWelcomeProps {
  onStartJourney: () => void;
  onContinueJourney: () => void;
  onSelectStep: (stepId: string) => void;
  journeyProgress: Record<string, boolean>;
  userName?: string;
}

const JOURNEY_STEPS = [
  {
    id: 'welcome-guide',
    step: 1,
    title: 'Welcome to Your New Home',
    description: 'Find out what this place is all about and what to expect.',
    icon: Home,
    color: 'blue',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-300',
    iconBg: 'bg-blue-500',
    textColor: 'text-blue-800',
    reassurance: 'Take your time, there is no rush.',
  },
  {
    id: 'meet-team',
    step: 2,
    title: 'Meet the People Here',
    description: 'Get to know the team who will be looking after you.',
    icon: Users,
    color: 'purple',
    bgGradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-300',
    iconBg: 'bg-purple-500',
    textColor: 'text-purple-800',
    reassurance: 'Everyone here wants to help you feel at home.',
  },
  {
    id: 'daily-life',
    step: 3,
    title: 'Understand Daily Life',
    description: 'See what a typical day looks like and how things work here.',
    icon: BookOpen,
    color: 'green',
    bgGradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-300',
    iconBg: 'bg-green-500',
    textColor: 'text-green-800',
    reassurance: 'We have a few simple routines to help everyone feel comfortable.',
  },
  {
    id: 'understanding-system',
    step: 4,
    title: 'Know Your Rights',
    description: 'Learn about your rights and the people who are here to protect them.',
    icon: Shield,
    color: 'blue',
    bgGradient: 'from-cyan-50 to-blue-50',
    borderColor: 'border-cyan-300',
    iconBg: 'bg-cyan-600',
    textColor: 'text-cyan-800',
    reassurance: 'You have a voice and it matters.',
  },
  {
    id: 'explore-more',
    step: 5,
    title: 'Explore & Have Fun',
    description: 'Games, stories, activities, and things to do when you want to relax.',
    icon: Sparkles,
    color: 'orange',
    bgGradient: 'from-orange-50 to-amber-50',
    borderColor: 'border-orange-300',
    iconBg: 'bg-orange-500',
    textColor: 'text-orange-800',
    reassurance: 'This space is yours to enjoy at your own pace.',
  },
  {
    id: 'support-center',
    step: 6,
    title: 'Get Help Anytime',
    description: 'Find out who to talk to and how to get support whenever you need it.',
    icon: HandHeart,
    color: 'pink',
    bgGradient: 'from-pink-50 to-rose-50',
    borderColor: 'border-pink-300',
    iconBg: 'bg-pink-500',
    textColor: 'text-pink-800',
    reassurance: 'You are never alone, someone is always here for you.',
  },
  {
    id: 'personal-wellbeing',
    step: 7,
    title: 'How Are You Feeling?',
    description: 'Check in with yourself. It is okay to feel however you feel.',
    icon: Heart,
    color: 'green',
    bgGradient: 'from-emerald-50 to-green-50',
    borderColor: 'border-emerald-300',
    iconBg: 'bg-emerald-500',
    textColor: 'text-emerald-800',
    reassurance: 'Your feelings are important and always valid.',
  },
];

export { JOURNEY_STEPS };

export default function GuidedWelcome({
  onStartJourney,
  onContinueJourney,
  onSelectStep,
  journeyProgress,
  userName = 'there',
}: GuidedWelcomeProps) {
  const [showSteps, setShowSteps] = useState(false);
  const completedCount = Object.values(journeyProgress).filter(Boolean).length;
  const hasStarted = completedCount > 0;
  const progressPercent = Math.round((completedCount / JOURNEY_STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Privacy reassurance - gentle, not a legal banner */}
      <div className="bg-white/70 border-b border-blue-100 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-sm">
          <Lock className="w-4 h-4 text-blue-600" />
          <span className="text-gray-700 font-medium">
            This space is private. You do not have to share anything you do not want to.
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-6">
            <OKAYiTLogo width={80} height={80} />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
            {hasStarted
              ? `Welcome back${userName !== 'there' && userName !== 'Guest' ? `, ${userName}` : ''}! 👋`
              : `Hello${userName !== 'there' && userName !== 'Guest' ? `, ${userName}` : ''}! 👋`}
          </h1>

          <p className="text-lg md:text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed mb-2">
            {hasStarted
              ? 'Great to see you again. Pick up where you left off, or explore something new.'
              : 'This space is here to help you get to know your new home, at your own pace.'}
          </p>

          {!hasStarted && (
            <p className="text-base text-gray-600 font-medium max-w-xl mx-auto leading-relaxed">
              There is no rush, no pressure, and no wrong way to use this.
              Just start whenever you are ready.
            </p>
          )}
        </motion.div>

        {/* Reassurance Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-10"
        >
          <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="bg-blue-500 p-3 rounded-full flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">You are safe here</h3>
                <p className="text-gray-700 font-medium leading-relaxed">
                  This is your space to explore. Nobody can see what you look at.
                  You can always talk to a member of staff if you need anything.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Bar (only if started) */}
        {hasStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">
                Your Journey
              </span>
              <span className="text-sm font-bold text-purple-700">
                {completedCount} of {JOURNEY_STEPS.length} explored
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* Start / Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
        >
          {!hasStarted ? (
            <Button
              onClick={() => setShowSteps(true)}
              className="h-16 px-10 text-lg font-black bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl shadow-lg"
            >
              <Smile className="w-6 h-6 mr-3" />
              Start Here
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          ) : (
            <>
              <Button
                onClick={onContinueJourney}
                className="h-16 px-10 text-lg font-black bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl shadow-lg"
              >
                Continue Where You Left Off
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <Button
                onClick={() => setShowSteps(!showSteps)}
                variant="outline"
                className="h-16 px-10 text-lg font-bold border border-purple-300 text-purple-700 rounded-2xl"
              >
                {showSteps ? 'Hide Steps' : 'See All Steps'}
              </Button>
            </>
          )}
        </motion.div>

        {/* Journey Steps */}
        <AnimatePresence>
          {(showSteps || !hasStarted) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                  Your Welcome Journey
                </h2>
                <p className="text-gray-600 font-medium">
                  Seven simple steps to help you settle in. You can do them in any order.
                </p>
              </div>

              <div className="space-y-4">
                {JOURNEY_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = journeyProgress[step.id];

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.07 }}
                    >
                      <button
                        onClick={() => onSelectStep(step.id)}
                        className="w-full text-left"
                      >
                        <Card
                          className={`border-2 ${step.borderColor} bg-gradient-to-r ${step.bgGradient} shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer`}
                        >
                          <CardContent className="p-4 md:p-5 flex items-center gap-4">
                            {/* Step number / check */}
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCompleted
                                  ? 'bg-green-500'
                                  : step.iconBg
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-7 h-7 text-white" />
                              ) : (
                                <Icon className="w-6 h-6 text-white" />
                              )}
                            </div>

                            <div className="flex-grow min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold ${step.textColor} uppercase tracking-wide`}>
                                  Step {step.step}
                                </span>
                                {isCompleted && (
                                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                    Explored ✓
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-black text-gray-900 leading-tight">
                                {step.title}
                              </h3>
                              <p className="text-sm text-gray-700 font-medium mt-1">
                                {step.description}
                              </p>
                              <p className="text-xs text-gray-500 font-medium mt-1.5 flex items-center gap-1">
                                <Heart className="w-3 h-3 text-pink-400" />
                                {step.reassurance}
                              </p>
                            </div>

                            <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                          </CardContent>
                        </Card>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Explore Everything link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 text-center"
              >
                <Button
                  onClick={onStartJourney}
                  variant="outline"
                  className="h-14 px-8 text-base font-bold border border-purple-300 text-purple-900 bg-white rounded-2xl hover:bg-purple-50"
                >
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Explore Everything
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-sm text-gray-500 font-medium mt-2">
                  See all the resources, games, and activities available to you.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
