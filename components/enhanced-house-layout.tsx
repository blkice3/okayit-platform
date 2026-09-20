
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bed, 
  Flame, 
  ChefHat, 
  Heart, 
  Home, 
  Users,
  QrCode,
  CheckCircle2,
  Lock,
  ArrowLeft,

  Info,
  Play,
  Trophy,
  Star,
  Compass,
  Camera,
  Volume2,
  VolumeX,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Map,
  Navigation,
  Award,
  Clock,
  Target,
  Gift,
  Search,
  Filter,
  BookOpen,
  Lightbulb,
  HeartHandshake,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

interface EnhancedHouseLayoutProps {
  completedLocations: string[];
  onLocationSelect: (locationId: string) => void;
  onBackToMenu: () => void;
  currentSession?: any;
}

interface LocationDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  icon: any;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  features: string[];
  learningObjectives: string[];
  interactiveElements: number;
  isUnlocked: boolean;
  prerequisites?: string[];
  rewards: string[];
  category: 'safety' | 'comfort' | 'community' | 'learning';
}

export default function EnhancedHouseLayout({ 
  completedLocations, 
  onLocationSelect, 
  onBackToMenu, 
  currentSession 
}: EnhancedHouseLayoutProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | 'list'>('2d');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHints, setShowHints] = useState(true);


  const locationDetails: { [key: string]: LocationDetail } = {
    bedroom: {
      id: 'bedroom',
      title: 'Bedroom',
      subtitle: 'Safe Sleep & Personal Space',
      description: 'Discover the importance of personal space, dignity, and creating a comfortable sleeping environment.',
      color: 'from-pink-400 via-purple-500 to-indigo-600',
      position: { top: '20%', right: '15%' },
      icon: Bed,
      difficulty: 'Easy',
      estimatedTime: '8-12 mins',
      features: ['Privacy Settings', 'Comfort Tips', 'Personal Boundaries', 'Sleep Hygiene'],
      learningObjectives: ['Understand personal space rights', 'Learn bedroom safety', 'Explore comfort options'],
      interactiveElements: 5,
      isUnlocked: true,
      rewards: ['Comfort Badge', '10 XP', 'Room Personalization Tips'],
      category: 'comfort'
    },
    'fire-exit': {
      id: 'fire-exit',
      title: 'Fire Exit',
      subtitle: 'Emergency Preparedness',
      description: 'Learn essential fire safety procedures and emergency protocols to keep everyone safe.',
      color: 'from-red-400 via-orange-500 to-yellow-600',
      position: { top: '35%', left: '10%' },
      icon: Flame,
      difficulty: 'Medium',
      estimatedTime: '10-15 mins',
      features: ['Emergency Procedures', 'Exit Routes', 'Alarm Systems', 'Safety Equipment'],
      learningObjectives: ['Master evacuation routes', 'Understand fire safety', 'Practice emergency procedures'],
      interactiveElements: 7,
      isUnlocked: true,
      rewards: ['Safety Hero Badge', '15 XP', 'Emergency Contact Card'],
      category: 'safety'
    },
    kitchen: {
      id: 'kitchen',
      title: 'Kitchen',
      subtitle: 'Hygiene & Cultural Food',
      description: 'Explore food safety, hygiene practices, and celebrate diverse culinary traditions.',
      color: 'from-green-400 via-teal-500 to-blue-600',
      position: { bottom: '35%', right: '20%' },
      icon: ChefHat,
      difficulty: 'Medium',
      estimatedTime: '12-18 mins',
      features: ['Food Safety', 'Cultural Recipes', 'Hygiene Standards', 'Cooking Skills'],
      learningObjectives: ['Learn food hygiene', 'Explore cultural diversity', 'Practice kitchen safety'],
      interactiveElements: 9,
      isUnlocked: completedLocations.includes('bedroom'),
      prerequisites: ['bedroom'],
      rewards: ['Chef Badge', '20 XP', 'Recipe Collection'],
      category: 'learning'
    },
    'chill-room': {
      id: 'chill-room',
      title: 'Chill Room',
      subtitle: 'Mindfulness & Wellbeing',
      description: 'Discover relaxation techniques, mindfulness practices, and emotional wellbeing tools.',
      color: 'from-purple-400 via-pink-500 to-rose-600',
      position: { top: '15%', left: '45%' },
      icon: Heart,
      difficulty: 'Easy',
      estimatedTime: '15-20 mins',
      features: ['Relaxation Techniques', 'Mindfulness Exercises', 'Emotion Regulation', 'Stress Management'],
      learningObjectives: ['Practice mindfulness', 'Learn coping strategies', 'Explore wellbeing tools'],
      interactiveElements: 6,
      isUnlocked: true,
      rewards: ['Mindfulness Badge', '15 XP', 'Wellness Toolkit'],
      category: 'comfort'
    },
    'entrance-hall': {
      id: 'entrance-hall',
      title: 'Entrance Hall',
      subtitle: 'Values & Safeguarding',
      description: 'Learn about home values, safeguarding policies, and your rights and responsibilities.',
      color: 'from-yellow-400 via-orange-500 to-red-600',
      position: { bottom: '25%', left: '15%' },
      icon: Shield,
      difficulty: 'Medium',
      estimatedTime: '10-14 mins',
      features: ['Home Values', 'Rights & Responsibilities', 'Safeguarding', 'Community Guidelines'],
      learningObjectives: ['Understand your rights', 'Learn home values', 'Explore safeguarding'],
      interactiveElements: 8,
      isUnlocked: completedLocations.includes('chill-room'),
      prerequisites: ['chill-room'],
      rewards: ['Guardian Badge', '18 XP', 'Rights Charter'],
      category: 'safety'
    },
    office: {
      id: 'office',
      title: 'Office',
      subtitle: 'Meet the Team',
      description: 'Get to know your care team, understand support structures, and learn communication channels.',
      color: 'from-blue-400 via-indigo-500 to-purple-600',
      position: { top: '45%', right: '10%' },
      icon: Users,
      difficulty: 'Easy',
      estimatedTime: '8-12 mins',
      features: ['Team Introductions', 'Communication Channels', 'Support Services', 'Feedback Systems'],
      learningObjectives: ['Meet your team', 'Understand support', 'Learn communication'],
      interactiveElements: 4,
      isUnlocked: completedLocations.length >= 2,
      prerequisites: ['bedroom', 'chill-room'],
      rewards: ['Community Badge', '12 XP', 'Contact Directory'],
      category: 'community'
    }
  };

  const filteredLocations = Object.values(locationDetails).filter(location => {
    const matchesSearch = location.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || location.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const progressPercentage = (completedLocations.length / Object.keys(locationDetails).length) * 100;

  const handleLocationClick = (locationId: string) => {
    const location = locationDetails[locationId];
    if (!location.isUnlocked) {
      return; // Show locked message
    }

    if (soundEnabled) {
      const audio = new Audio('/sounds/location-click.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }

    setSelectedLocation(locationId);
  };

  const handleLocationConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return 'bg-red-200 text-red-900 dark:bg-red-800/60 dark:text-red-100 font-semibold border border-red-300 dark:border-red-600 shadow-sm';
      case 'comfort': return 'bg-purple-200 text-purple-900 dark:bg-purple-800/60 dark:text-purple-100 font-semibold border border-purple-300 dark:border-purple-600 shadow-sm';
      case 'community': return 'bg-blue-200 text-blue-900 dark:bg-blue-800/60 dark:text-blue-100 font-semibold border border-blue-300 dark:border-blue-600 shadow-sm';
      case 'learning': return 'bg-green-200 text-green-900 dark:bg-green-800/60 dark:text-green-100 font-semibold border border-green-300 dark:border-green-600 shadow-sm';
      default: return 'bg-gray-200 text-gray-900 dark:bg-purple-900/20/60 dark:text-gray-100 font-semibold border border-gray-300 dark:border-gray-500 shadow-sm';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-600 shadow-md border border-green-700';
      case 'Medium': return 'bg-amber-600 shadow-md border border-amber-700';
      case 'Hard': return 'bg-red-600 shadow-md border border-red-700';
      default: return 'bg-purple-100 shadow-sm border border-purple-200';
    }
  };

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page)}>
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={combineThemeClasses("sticky top-0 z-50 border-b shadow-sm", okayitTheme.backgrounds.glass, "border-white/30 dark:border-purple-200/30")}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToMenu}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className={combineThemeClasses("text-2xl font-bold", okayitTheme.text.primary)}>
                  Interactive House Tour
                </h1>
                <p className={combineThemeClasses("text-sm font-semibold", okayitTheme.text.secondary)}>
                  Explore your new home with enhanced QR experiences
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">{completedLocations.length}/6 Completed</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 mb-2">
              <span>Tour Progress</span>
              <span>{progressPercentage.toFixed(0)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="mb-8 space-y-4">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <TabsList className="grid w-full md:w-auto grid-cols-2">
                <TabsTrigger value="2d" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Enhanced Floor Plan
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Detailed Room List
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-900" />
                  <Input
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full md:w-48"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="comfort">Comfort</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="learning">Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>



            <TabsContent value="2d" className="mt-6">
              {/* Enhanced 2D Floor Plan View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-purple-950/30 rounded-3xl p-8 shadow-md border border-gray-200 dark:border-purple-200/30"
              >
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Interactive Floor Plan
                  </h3>
                  <p className="text-gray-900 dark:text-gray-300 text-lg">
                    Explore each room and discover what makes our home special
                  </p>
                </div>

                {/* Enhanced Floor Plan with Detailed Layout */}
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 min-h-[600px] shadow-inner">
                  {/* House Structure SVG Background */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <svg viewBox="0 0 1000 600" className="w-full h-full opacity-20">
                      {/* Main house structure */}
                      <rect x="100" y="150" width="800" height="350" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-700 dark:text-gray-300"/>
                      
                      {/* Room divisions */}
                      <line x1="350" y1="150" x2="350" y2="500" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-gray-900"/>
                      <line x1="650" y1="150" x2="650" y2="500" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-gray-900"/>
                      <line x1="100" y1="320" x2="900" y2="320" stroke="currentColor" strokeWidth="2" className="text-gray-300 dark:text-gray-900"/>
                      
                      {/* Doorways */}
                      <rect x="340" y="315" width="20" height="10" fill="white" stroke="currentColor" strokeWidth="1" className="text-gray-900"/>
                      <rect x="640" y="315" width="20" height="10" fill="white" stroke="currentColor" strokeWidth="1" className="text-gray-900"/>
                      <rect x="495" y="145" width="10" height="10" fill="white" stroke="currentColor" strokeWidth="1" className="text-gray-900"/>
                      
                      {/* Windows */}
                      <rect x="150" y="145" width="40" height="5" fill="lightblue" opacity="0.7"/>
                      <rect x="300" y="145" width="40" height="5" fill="lightblue" opacity="0.7"/>
                      <rect x="710" y="145" width="40" height="5" fill="lightblue" opacity="0.7"/>
                      <rect x="850" y="145" width="40" height="5" fill="lightblue" opacity="0.7"/>
                    </svg>
                  </div>

                  {/* Room Location Cards with Enhanced Positioning */}
                  {filteredLocations.map((location) => {
                    const Icon = location.icon;
                    const isCompleted = completedLocations.includes(location.id);
                    const isSelected = selectedLocation === location.id;

                    // Enhanced positioning for realistic layout
                    const enhancedPositions: { [key: string]: React.CSSProperties } = {
                      bedroom: { top: '15%', left: '15%' },
                      bathroom: { top: '15%', right: '15%' },
                      kitchen: { top: '55%', left: '15%' },
                      'living-room': { top: '55%', left: '42%' },
                      garden: { top: '55%', right: '15%' },
                      office: { top: '15%', left: '42%' }
                    };

                    const position = enhancedPositions[location.id] || { top: '50%', left: '50%' };

                    return (
                      <motion.div
                        key={location.id}
                        className={`absolute cursor-pointer group ${!location.isUnlocked ? 'cursor-not-allowed' : ''}`}
                        style={position}
                        onClick={() => handleLocationClick(location.id)}
                        whileHover={{ scale: location.isUnlocked ? 1.08 : 1 }}
                        whileTap={{ scale: location.isUnlocked ? 0.95 : 1 }}
                        animate={isSelected ? { scale: 1.15, rotate: [0, -2, 2, 0] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Enhanced Room Card */}
                        <div className={`
                          relative p-6 rounded-2xl transition-all duration-300 min-w-[260px] max-w-[300px]
                          ${location.isUnlocked 
                            ? 'bg-white/95 dark:bg-purple-950/20/95 shadow-md border border-white/50' 
                            : 'bg-gray-200/90 dark:bg-purple-900/20/90 shadow-md'
                          }
                          ${isSelected 
                            ? 'ring-4 ring-blue-500 shadow-lg' 
                            : 'shadow-lg hover:shadow-lg'
                          }
                          ${!location.isUnlocked ? 'opacity-70' : ''}
                          backdrop-blur-sm
                        `}>
                          <div className="flex items-start space-x-4">
                            <div className={`
                              p-4 rounded-xl bg-gradient-to-br ${location.color} 
                              ${!location.isUnlocked ? 'grayscale' : ''}
                              relative shadow-lg
                            `}>
                              <Icon className="w-7 h-7 text-white" />
                              {!location.isUnlocked && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Lock className="w-5 h-5 text-gray-900" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                {location.title}
                              </h3>
                              <p className="text-sm text-gray-900 dark:text-gray-300 mb-3">
                                {location.subtitle}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="secondary" 
                                  className={`${getCategoryColor(location.category)} text-xs px-2 py-1`}
                                >
                                  {location.category}
                                </Badge>
                                {isCompleted && (
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Complete</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Room Details */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3 h-3 text-blue-500" />
                                <span className="text-gray-900 dark:text-gray-300 font-medium">
                                  {location.estimatedTime}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Target className="w-3 h-3 text-purple-500" />
                                <span className="text-gray-900 dark:text-gray-300 font-medium">
                                  {location.interactiveElements} activities
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${getDifficultyColor(location.difficulty)}`} />
                                <span className="text-gray-900 dark:text-gray-300 font-medium">
                                  {location.difficulty}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span className="text-gray-900 dark:text-gray-300 font-medium">
                                  Must visit
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Prerequisites */}
                          {!location.isUnlocked && location.prerequisites && (
                            <div className="mt-3 text-xs text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3">
                              <div className="flex items-center space-x-2">
                                <Lock className="w-3 h-3" />
                                <span className="font-medium">Complete {location.prerequisites.join(', ')} first</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Interactive QR Code Indicator */}
                        {location.isUnlocked && (
                          <div className="absolute -top-3 -right-3 animate-bounce">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                              <QrCode className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        )}

                        {/* Completion Badge */}
                        {isCompleted && (
                          <div className="absolute -top-2 -left-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}

                  {/* Room Labels */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 dark:bg-purple-950/20/90 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">Room Guide</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-900 dark:text-gray-300">Completed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-900 dark:text-gray-300">Available</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Lock className="w-3 h-3 text-gray-900" />
                          <span className="text-gray-900 dark:text-gray-300">Locked</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <QrCode className="w-3 h-3 text-purple-500" />
                          <span className="text-gray-900 dark:text-gray-300">Interactive</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-white/90 dark:bg-purple-950/20/90 rounded-lg p-3 shadow-lg backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {Math.round((completedLocations.length / Object.keys(locationDetails).length) * 100)}%
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                          Tour Complete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              {/* List View */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {filteredLocations.map((location, index) => {
                  const Icon = location.icon;
                  const isCompleted = completedLocations.includes(location.id);

                  return (
                    <motion.div
                      key={location.id}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={`
                          cursor-pointer transition-all duration-300 hover:shadow-lg
                          ${!location.isUnlocked ? 'opacity-60' : ''}
                          ${selectedLocation === location.id ? 'ring-2 ring-purple-500' : ''}
                        `}
                        onClick={() => handleLocationClick(location.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className={`
                              p-3 rounded-xl bg-gradient-to-r ${location.color}
                              ${!location.isUnlocked ? 'grayscale' : ''}
                            `}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {location.title}
                                  </h3>
                                  <p className="text-sm text-purple-600 dark:text-purple-400">
                                    {location.subtitle}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {isCompleted && (
                                    <Badge className="bg-green-100 text-green-800">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Completed
                                    </Badge>
                                  )}
                                  {!location.isUnlocked && (
                                    <Badge variant="outline" className="text-orange-600">
                                      <Lock className="w-3 h-3 mr-1" />
                                      Locked
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {location.description}
                              </p>

                              <div className="flex flex-wrap gap-2 items-center">
                                <Badge variant="outline" className={getCategoryColor(location.category)}>
                                  {location.category}
                                </Badge>
                                <Badge variant="outline">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {location.estimatedTime}
                                </Badge>
                                <Badge variant="outline">
                                  <Target className="w-3 h-3 mr-1" />
                                  {location.interactiveElements} activities
                                </Badge>
                                <div className="flex items-center space-x-1">
                                  <div className={`w-2 h-2 rounded-full ${getDifficultyColor(location.difficulty)}`} />
                                  <span className="text-xs text-gray-700 dark:text-gray-300">
                                    {location.difficulty}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1">
                                {location.features.slice(0, 3).map((feature) => (
                                  <Badge key={feature} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                                {location.features.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{location.features.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Selection Confirmation Modal */}
        <AnimatePresence>
          {selectedLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-purple-950/20 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                {(() => {
                  const location = locationDetails[selectedLocation];
                  const Icon = location.icon;
                  const isCompleted = completedLocations.includes(selectedLocation);

                  return (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className={`p-4 mx-auto w-fit rounded-2xl bg-gradient-to-r ${location.color} mb-4`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {location.title}
                        </h2>
                        <p className="text-lg text-purple-600 dark:text-purple-400 mb-4">
                          {location.subtitle}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {location.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Learning Objectives
                          </h3>
                          <ul className="space-y-2">
                            {location.learningObjectives.map((objective, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <Gift className="w-4 h-4 mr-2" />
                            Rewards
                          </h3>
                          <ul className="space-y-2">
                            {location.rewards.map((reward, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm">
                                <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700 dark:text-gray-300">{reward}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center">
                        {location.features.map((feature) => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="outline"
                          onClick={() => setSelectedLocation(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleLocationConfirm}
                          disabled={!location.isUnlocked}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {isCompleted ? 'Revisit Location' : 'Enter Location'}
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
