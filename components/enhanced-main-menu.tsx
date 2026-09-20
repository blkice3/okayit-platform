
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  BookOpen, 
  Gamepad2, 
  AudioLines,
  Users,
  Settings,
  Star,
  Trophy,
  Clock,
  Play,
  Compass,
  Heart,
  Sparkles,
  Shield,
  Home,
  Camera,
  Music,
  MessageSquare,
  ArrowRight,
  User,
  LogOut,
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import HomeSelector from '@/components/home-selector';
import { HomeContext } from '@/lib/home-contexts';
import { signOut } from 'next-auth/react';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

interface EnhancedMainMenuProps {
  onMenuSelect: (section: string) => void;
  user: any;
  session: any;
  currentHome: HomeContext;
  onHomeChange: (homeId: string) => void;
}

interface MenuSection {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  gradient: string;
  description: string;
  features: string[];
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isNew?: boolean;
  progress?: number;
}

export default function EnhancedMainMenu({ onMenuSelect, user, session, currentHome, onHomeChange }: EnhancedMainMenuProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const menuSections: MenuSection[] = [
    {
      id: 'house-tour',
      title: 'Interactive QR Tour',
      subtitle: 'Discover Every Corner',
      icon: QrCode,
      gradient: 'from-purple-400 via-pink-500 to-red-500',
      description: 'Take an immersive journey through your new home with our enhanced QR code tour system.',
      features: ['Room Explorer', 'QR Code Scanning', 'Location Info', 'Reflections'],
      estimatedTime: '20-30 mins',
      difficulty: 'Beginner',
      isNew: true,
      progress: 0
    },
    {
      id: 'welcome-guide',
      title: 'Welcome Guide',
      subtitle: 'Your First Steps',
      icon: BookOpen,
      gradient: 'from-blue-400 via-purple-500 to-pink-500',
      description: 'Navigate through 19 interactive slides covering everything you need to know about your new home.',
      features: ['Interactive Slides', 'Progress Tracking', 'Personalized Tips', 'Support Resources'],
      estimatedTime: '15-25 mins',
      difficulty: 'Beginner',
      progress: 0
    },
    {
      id: 'family-gaming',
      title: 'Family & Friends Hub',
      subtitle: 'Connect & Play',
      icon: Gamepad2,
      gradient: 'from-green-400 via-teal-500 to-blue-500',
      description: 'Engage with family and friends through games, challenges, and shared experiences.',
      features: ['Fun Games', 'Group Activities', 'Creative Projects', 'Challenges'],
      estimatedTime: '10-60 mins',
      difficulty: 'Intermediate',
      isNew: true,
      progress: 0
    },
    {
      id: 'reflective-stories',
      title: 'Story Experience',
      subtitle: 'Listen & Reflect',
      icon: AudioLines,
      gradient: 'from-orange-400 via-red-500 to-pink-500',
      description: 'Immerse yourself in carefully curated stories with interactive discussion tools.',
      features: ['Audio Stories', 'Discussion Cards', 'Personal Notes', 'Mood Tracking'],
      estimatedTime: '30-45 mins',
      difficulty: 'Intermediate',
      progress: 0
    },
    {
      id: 'reflection-toolkit',
      title: 'Reflection Toolkit',
      subtitle: 'Personal Growth',
      icon: Heart,
      gradient: 'from-pink-400 via-purple-500 to-indigo-500',
      description: 'Tools for self-reflection, goal setting, and personal development.',
      features: ['Mood Journal', 'Goal Setting', 'Progress Tracking', 'Wellbeing Check-ins'],
      estimatedTime: '15-30 mins',
      difficulty: 'Advanced',
      progress: 0
    },
    {
      id: 'support-center',
      title: 'Support Center',
      subtitle: '24/7 Help Available',
      icon: Shield,
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      description: 'Access help, resources, and connect with your support team anytime.',
      features: ['Verified Helplines', 'Resource Library', 'Emergency Contacts', 'Support Info'],
      estimatedTime: 'On Demand',
      difficulty: 'Beginner',
      isNew: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-purple-950/20 dark:text-gray-300';
    }
  };

  const handleSectionClick = (sectionId: string) => {
    if (soundEnabled) {
      // Play click sound effect
      const audio = new Audio('/sounds/click.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
    // Direct navigation without confirmation
    onMenuSelect(sectionId);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className={combineThemeClasses("min-h-screen transition-colors duration-500", okayitTheme.backgrounds.page)}>
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={combineThemeClasses("sticky top-0 z-50 border-b shadow-sm", okayitTheme.backgrounds.glass, "border-white/30 dark:border-purple-200/30")}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-3"
                >
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className={combineThemeClasses("text-xl font-bold", okayitTheme.text.primary)}>
                      {currentHome.fullName}
                    </h1>
                    <p className={combineThemeClasses("text-sm font-semibold", okayitTheme.text.secondary)}>
                      Interactive Experience Platform
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {currentTime}
                </Badge>

                <HomeSelector 
                  currentHome={currentHome}
                  onHomeChange={onHomeChange}
                />

                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4" />
                  <Switch 
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <Moon className="w-4 h-4" />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>

                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className={combineThemeClasses("text-sm font-bold", okayitTheme.text.primary)}>
                      {user?.name || 'Welcome'}
                    </p>
                    <p className={combineThemeClasses("text-xs font-semibold", okayitTheme.text.secondary)}>
                      {user?.userType || 'Guest'}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="p-2"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-lg">
                Welcome to Your
              </span>
            </h1>
            <h2 className={combineThemeClasses("text-3xl md:text-5xl font-bold mb-6", okayitTheme.text.primary, okayitTheme.effects.textShadow)}>
              Interactive Journey
            </h2>
            <p className={combineThemeClasses("text-xl max-w-3xl mx-auto leading-relaxed font-semibold", okayitTheme.text.secondary, okayitTheme.effects.textShadow)}>
              Explore, learn, connect, and grow in your new home. Each experience is designed to help you feel 
              comfortable, supported, and empowered.
            </p>
          </motion.div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {menuSections.map((section, index) => {
              const Icon = section.icon;

              return (
                <motion.div
                  key={section.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all duration-300"
                  onClick={() => handleSectionClick(section.id)}
                >
                  <Card className={combineThemeClasses("h-full overflow-hidden border border-transparent hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300", okayitTheme.backgrounds.card, okayitTheme.backgrounds.cardHover, okayitTheme.effects.cardShadow)}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${section.gradient} shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {section.isNew && (
                            <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              New
                            </Badge>
                          )}
                          <Badge variant="outline" className={getDifficultyColor(section.difficulty)}>
                            {section.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <CardTitle className={combineThemeClasses("text-xl font-bold", okayitTheme.text.primary)}>
                          {section.title}
                        </CardTitle>
                        <p className={combineThemeClasses("text-sm font-semibold", okayitTheme.text.accent)}>
                          {section.subtitle}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className={combineThemeClasses("text-sm leading-relaxed font-semibold", okayitTheme.text.secondary)}>
                        {section.description}
                      </p>
                      
                      {section.progress !== undefined && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className={combineThemeClasses("font-semibold", okayitTheme.text.muted)}>Progress</span>
                            <span className={combineThemeClasses("font-bold", okayitTheme.text.primary)}>{section.progress}%</span>
                          </div>
                          <Progress value={section.progress} className="h-2" />
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className={combineThemeClasses("text-xs font-bold", okayitTheme.text.primary)}>Key Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {section.features.slice(0, 2).map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {section.features.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{section.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className={combineThemeClasses("flex items-center space-x-1 text-xs font-semibold", okayitTheme.text.muted)}>
                          <Clock className="w-3 h-3" />
                          <span>{section.estimatedTime}</span>
                        </div>
                        <ArrowRight className={combineThemeClasses("w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-600", okayitTheme.text.muted)} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>


        </div>
      </div>
    </div>
  );
}
