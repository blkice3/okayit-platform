
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  BookOpen,
  Gamepad2,
  QrCode,
  Users,
  Sparkles,
  Heart,
  ArrowRight,
  HeadphonesIcon,
  MessageCircle,
  Download,
  Smartphone,
  Star,
  Zap,
  Shield,
  Clock,
  Award,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import HomeSelector from '@/components/home-selector';
import { HomeContext } from '@/lib/home-contexts';

interface MainMenuProps {
  onMenuSelect: (section: string) => void;
  user: any;
  session: any;
  currentHome: HomeContext;
  onHomeChange: (homeId: string) => void;
}

export default function MainMenu({ onMenuSelect, user, session, currentHome, onHomeChange }: MainMenuProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  
  const completedLocations = session?.locationProgress?.filter((p: any) => p?.completed)?.length || 0;
  const totalLocations = 6;
  const progressPercentage = (completedLocations / totalLocations) * 100;

  // PWA Installation handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const menuItems = [
    {
      id: 'house-tour',
      title: 'Interactive House Tour',
      description: 'Explore our care home through immersive QR experiences',
      icon: QrCode,
      gradient: 'from-rose-600 to-pink-600',
      badge: `${completedLocations}/${totalLocations} Complete`,
      features: ['QR Code Activities', 'Interactive Learning', 'Progress Tracking'],
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-200',
      stats: { completed: completedLocations, total: totalLocations }
    },
    {
      id: 'virtual-tour',
      title: '360° Virtual Tour',
      description: 'Immersive 360° video walkthrough of our care home spaces',
      icon: Home,
      gradient: 'from-purple-600 to-violet-600',
      badge: '360° Videos',
      features: ['360° Video Tour', 'Interactive Controls', 'Audio Narration', 'Full Navigation'],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      stats: { locations: 8, duration: '45 min' }
    },
    {
      id: 'welcome-guide',
      title: 'Welcome Guide',
      description: `Complete introduction to ${currentHome.name} for new residents`,
      icon: BookOpen,
      gradient: 'from-blue-600 to-indigo-600',
      badge: '19 Slides',
      features: ['Interactive Slides', 'House Rules', 'Support Info', 'Welcome Video'],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      stats: { slides: 19, completed: 0 }
    },
    {
      id: 'family-gaming',
      title: 'Family & Friends Hub',
      description: 'Interactive games and challenges for family connection',
      icon: Gamepad2,
      gradient: 'from-emerald-600 to-green-600',
      badge: 'Interactive Games',
      features: ['Family Challenges', 'Achievement System', 'Group Activities', 'Leaderboards'],
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
      stats: { games: 12, achievements: 24 }
    },
    {
      id: 'reflective-stories',
      title: 'Reflective Stories',
      description: 'Inspiring audio stories featuring the new Ofsted experience',
      icon: HeadphonesIcon,
      gradient: 'from-violet-600 to-purple-600',
      badge: 'NEW: Ofsted Story',
      features: ['Personal Journeys', 'Care Experiences', 'Professional Insights', 'Discussion Tools'],
      color: 'text-violet-600',
      bgColor: 'bg-violet-50 border-violet-200',
      stats: { stories: 6, duration: '90+ mins' }
    },
    {
      id: 'reflection-toolkit',
      title: 'Reflection Toolkit',
      description: 'Comprehensive tools for personal growth and reflection',
      icon: MessageCircle,
      gradient: 'from-amber-600 to-orange-600',
      badge: 'Growth Tools',
      features: ['Discussion Cards', 'Reflection Activities', 'Support Resources', 'Personal Journal'],
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
      stats: { tools: 50, exercises: 30 }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements - Subtle */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200 m-6 p-6 rounded-xl"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${currentHome.theme.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {currentHome.fullName}
                </h1>
                <p className="text-gray-900 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Next-Generation Care Experience
                </p>
              </div>
            </div>
            
            <HomeSelector 
              currentHome={currentHome}
              onHomeChange={onHomeChange}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right text-gray-900">
              <p className="text-sm">Welcome back</p>
              <p className="font-semibold text-gray-900">{user?.name || 'Guest'}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-900 font-medium">Overall Progress</span>
            <span className="text-gray-900 font-semibold">{completedLocations}/{totalLocations} Locations</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </motion.div>

      {/* PWA Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 left-6 right-6 z-50"
          >
            <div className="bg-white/95 backdrop-blur-sm shadow-lg border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Install QR House Tour</p>
                  <p className="text-gray-900 text-sm">Get the full offline experience</p>
                </div>
              </div>
              <Button onClick={handleInstallClick} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                <Smartphone className="w-4 h-4 mr-2" />
                Install
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-8 h-8 text-blue-500" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Choose Your Journey
            </h2>
            <Star className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-xl text-gray-900 max-w-3xl mx-auto leading-relaxed">
            Discover innovative experiences designed for young people in care. 
            Each journey offers unique insights, connections, and growth opportunities.
          </p>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 cursor-pointer relative overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${item.bgColor} ${item.color} border font-medium text-xs`}>
                      {item.badge}
                    </Badge>
                  </div>
                  
                  {/* Icon */}
                  <div className={`relative w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                        style={{backgroundImage: item.gradient.replace('from-', 'linear-gradient(135deg, ').replace(' to-', ', ').replace(' via-', ', ') + ')'}}>
                      {item.title}
                    </h3>
                    <p className="text-gray-900 text-sm mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {item.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-gray-900">
                          <div className={`w-2 h-2 ${item.color.replace('text-', 'bg-')} rounded-full flex-shrink-0`} />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* Stats */}
                    {item.stats && (
                      <div className="flex items-center justify-between text-xs text-gray-900 mb-6 p-3 bg-gray-50 rounded-lg border">
                        {Object.entries(item.stats).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-gray-900 font-semibold text-sm">{value}</div>
                            <div className="capitalize text-xs">{key}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Button */}
                    <Button
                      onClick={() => onMenuSelect(item.id)}
                      className={`w-full bg-gradient-to-r ${item.gradient} hover:opacity-90 text-white border-0 group-hover:shadow-lg transition-all duration-300 font-medium`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Start Journey
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{completedLocations}/{totalLocations}</div>
              <div className="text-gray-900 text-sm">Journey Progress</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
              <div className="text-gray-900 text-sm">Support Available</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">8-18</div>
              <div className="text-gray-900 text-sm">Age Range</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">PWA</div>
              <div className="text-gray-900 text-sm">Mobile Ready</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-200 rounded-xl p-8">
            <Lightbulb className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Innovative Care Experiences
            </h3>
            <p className="text-gray-900 text-lg max-w-3xl mx-auto mb-6 leading-relaxed">
              Our platform combines modern technology with compassionate care to create meaningful 
              experiences for young people, families, and care professionals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 font-medium">
                <Clock className="w-4 h-4 mr-2" />
                Always Available
              </Badge>
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 px-4 py-2 font-medium">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile First
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2 font-medium">
                <Star className="w-4 h-4 mr-2" />
                Youth Focused
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
