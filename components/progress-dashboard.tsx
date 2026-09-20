
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Star, Award, Target, TrendingUp, Calendar,
  BookOpen, Headphones, Gamepad2, Heart, CheckCircle2,
  Clock, Flame, Zap, Gift, Crown, Sparkles, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

interface ProgressDashboardProps {
  onBack: () => void;
  user?: any;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  earned: boolean;
  earnedDate?: Date;
  category: string;
  points: number;
  color: string;
}

export default function ProgressDashboard({ onBack, user }: ProgressDashboardProps) {
  const [stats, setStats] = useState({
    totalPoints: 0,
    storiesListened: 0,
    gamesPlayed: 0,
    reflectionsCompleted: 0,
    daysActive: 0,
    currentStreak: 0,
    certificatesEarned: 0,
    level: 1
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-story',
      title: 'Story Explorer',
      description: 'Listened to your first story',
      icon: Headphones,
      earned: false,
      category: 'stories',
      points: 50,
      color: 'purple'
    },
    {
      id: 'five-stories',
      title: 'Story Enthusiast',
      description: 'Listened to 5 different stories',
      icon: BookOpen,
      earned: false,
      category: 'stories',
      points: 100,
      color: 'blue'
    },
    {
      id: 'complete-tour',
      title: 'House Explorer',
      description: 'Completed the full house tour',
      icon: Target,
      earned: false,
      category: 'tour',
      points: 75,
      color: 'green'
    },
    {
      id: 'first-game',
      title: 'Game Master',
      description: 'Played your first game',
      icon: Gamepad2,
      earned: false,
      category: 'games',
      points: 50,
      color: 'orange'
    },
    {
      id: 'wellbeing-check',
      title: 'Self Care Champion',
      description: 'Completed 5 wellbeing check-ins',
      icon: Heart,
      earned: false,
      category: 'wellbeing',
      points: 100,
      color: 'pink'
    },
    {
      id: 'week-streak',
      title: 'Consistency King',
      description: '7 day activity streak',
      icon: Flame,
      earned: false,
      category: 'engagement',
      points: 150,
      color: 'orange'
    },
    {
      id: 'reflection-master',
      title: 'Reflection Master',
      description: 'Completed 10 reflection activities',
      icon: Sparkles,
      earned: false,
      category: 'reflection',
      points: 125,
      color: 'purple'
    },
    {
      id: 'support-seeker',
      title: 'Support Seeker',
      description: 'Explored support resources',
      icon: Trophy,
      earned: false,
      category: 'support',
      points: 75,
      color: 'blue'
    }
  ]);

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('userProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setStats(progress.stats || stats);
        setAchievements(progress.achievements || achievements);
      } catch (e) {
        console.log('Could not load progress');
      }
    }
  }, []);

  const calculateLevel = (points: number) => {
    return Math.floor(points / 500) + 1;
  };

  const calculateLevelProgress = (points: number) => {
    return (points % 500) / 500 * 100;
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const unearnedAchievements = achievements.filter(a => !a.earned);

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page, okayitTheme.backgrounds.pageDark)}>
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={combineThemeClasses("sticky top-0 z-50 border-b-4 border-purple-300", okayitTheme.backgrounds.glassPurple)}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                className={okayitTheme.interactive.navPurple}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <div>
                <h1 className={okayitTheme.text.headingPurple}>
                  My Progress
                </h1>
                <p className={okayitTheme.text.purple}>
                  Track your amazing journey
                </p>
              </div>
            </div>
            <Badge className={combineThemeClasses(okayitTheme.badges.purple, "text-lg px-4 py-2")}>
              <Crown className="w-5 h-5 mr-2" />
              Level {stats.level}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        {/* Level Progress Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={okayitTheme.backgrounds.whiteCardPurple}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={okayitTheme.icons.purple}>
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={combineThemeClasses("text-2xl", okayitTheme.text.purple)}>
                      Level {stats.level}
                    </h3>
                    <p className={okayitTheme.text.secondaryOnLight}>
                      {stats.totalPoints} Total Points
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={combineThemeClasses("text-sm", okayitTheme.text.mutedOnLight)}>
                    Next Level
                  </p>
                  <p className={combineThemeClasses("text-xl font-bold", okayitTheme.text.purple)}>
                    {500 - (stats.totalPoints % 500)} points to go
                  </p>
                </div>
              </div>
              <Progress value={calculateLevelProgress(stats.totalPoints)} className="h-4" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Stories', value: stats.storiesListened, icon: Headphones, color: 'purple' },
            { label: 'Games', value: stats.gamesPlayed, icon: Gamepad2, color: 'orange' },
            { label: 'Reflections', value: stats.reflectionsCompleted, icon: Sparkles, color: 'blue' },
            { label: 'Day Streak', value: stats.currentStreak, icon: Flame, color: 'green' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Card className={combineThemeClasses(
                  stat.color === 'purple' && okayitTheme.backgrounds.purpleCard,
                  stat.color === 'orange' && okayitTheme.backgrounds.orangeCard,
                  stat.color === 'blue' && okayitTheme.backgrounds.blueCard,
                  stat.color === 'green' && okayitTheme.backgrounds.greenCard
                )}>
                  <CardContent className="p-6 text-center">
                    <Icon className={combineThemeClasses(
                      "w-10 h-10 mx-auto mb-3",
                      stat.color === 'purple' && 'text-purple-600',
                      stat.color === 'orange' && 'text-orange-600',
                      stat.color === 'blue' && 'text-blue-600',
                      stat.color === 'green' && 'text-green-600'
                    )} />
                    <p className={combineThemeClasses("text-3xl font-black mb-1", okayitTheme.text.primaryOnLight)}>
                      {stat.value}
                    </p>
                    <p className={combineThemeClasses("text-sm font-bold", okayitTheme.text.mutedOnLight)}>
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements Section */}
        <div className="mt-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className={combineThemeClasses("text-3xl mb-6", okayitTheme.text.headingPurple)}>
              <Award className="w-8 h-8 inline mr-3" />
              Achievements
            </h2>
          </motion.div>

          {/* Earned Achievements */}
          {earnedAchievements.length > 0 && (
            <div className="mb-8">
              <h3 className={combineThemeClasses("text-2xl mb-4", okayitTheme.text.green)}>
                <CheckCircle2 className="w-6 h-6 inline mr-2" />
                Unlocked ({earnedAchievements.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedAchievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <Card className={combineThemeClasses(
                        "relative overflow-hidden",
                        achievement.color === 'purple' && okayitTheme.backgrounds.whiteCardPurple,
                        achievement.color === 'blue' && okayitTheme.backgrounds.whiteCardBlue,
                        achievement.color === 'orange' && okayitTheme.backgrounds.whiteCardOrange,
                        achievement.color === 'green' && okayitTheme.backgrounds.whiteCardGreen,
                        achievement.color === 'pink' && 'bg-white border border-pink-400'
                      )}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={combineThemeClasses(
                              okayitTheme.icons[achievement.color as keyof typeof okayitTheme.icons]
                            )}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className={combineThemeClasses("text-lg font-bold mb-1", okayitTheme.text.primaryOnLight)}>
                                {achievement.title}
                              </h4>
                              <p className={combineThemeClasses("text-sm mb-3", okayitTheme.text.secondaryOnLight)}>
                                {achievement.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <Badge className={okayitTheme.badges[achievement.color as keyof typeof okayitTheme.badges]}>
                                  +{achievement.points} points
                                </Badge>
                                {achievement.earnedDate && (
                                  <p className={combineThemeClasses("text-xs", okayitTheme.text.mutedOnLight)}>
                                    {new Date(achievement.earnedDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          <div>
            <h3 className={combineThemeClasses("text-2xl mb-4", okayitTheme.text.mutedOnLight)}>
              Locked ({unearnedAchievements.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unearnedAchievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <Card className="bg-gray-100 border border-gray-300 opacity-75">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-purple-100 p-3 rounded-2xl">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-bold mb-1 text-gray-600">
                              {achievement.title}
                            </h4>
                            <p className="text-sm mb-3 text-gray-500">
                              {achievement.description}
                            </p>
                            <Badge className="bg-gray-200 text-gray-600 border border-gray-400">
                              +{achievement.points} points
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className={okayitTheme.backgrounds.whiteCardPurple}>
            <CardContent className="p-8 text-center">
              <Sparkles className="w-16 h-16 text-purple-600 mx-auto mb-4" />
              <h3 className={combineThemeClasses("text-2xl mb-3", okayitTheme.text.headingPurple)}>
                Keep Going!
              </h3>
              <p className={combineThemeClasses("text-lg", okayitTheme.text.secondaryOnLight)}>
                Every step you take is progress. You're doing amazing things!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
