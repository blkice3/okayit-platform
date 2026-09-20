
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, MapPin, Camera, Star, Clock, Users, 
  ArrowLeft, ArrowRight, Award, Target, Zap,
  CheckCircle, PlayCircle, PauseCircle, Volume2,
  Compass, Map, Eye, Lightbulb, MessageSquare,
  Heart, Home, Coffee, Bed, Utensils, Gamepad2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface Location {
  id: string;
  name: string;
  icon: React.ReactNode;
  shortDescription: string;
  fullDescription: string;
  interactiveElements: Array<{
    type: 'quiz' | 'challenge' | 'photo' | 'audio' | 'fact';
    title: string;
    content: any;
  }>;
  qrCode: string;
  estimatedTime: number;
  funFacts: string[];
  safetyTips: string[];
  color: string;
  coordinates: { x: number; y: number };
}

interface EnhancedQRTourProps {
  onBack: () => void;
  completedLocations: string[];
  onLocationSelect: (locationId: string) => void;
}

export default function EnhancedQRTour({ onBack, completedLocations, onLocationSelect }: EnhancedQRTourProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [tourMode, setTourMode] = useState<'explore' | 'guided' | 'challenge'>('explore');
  const [userPosition, setUserPosition] = useState({ x: 50, y: 50 });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const locations: Location[] = [
    {
      id: 'entrance',
      name: 'Main Entrance',
      icon: <Home className="w-8 h-8" />,
      shortDescription: 'Where every journey begins',
      fullDescription: 'The welcoming entrance sets the tone for your experience. Notice the safety features, accessibility options, and the warm atmosphere we\'ve created.',
      qrCode: 'QR_ENTRANCE_001',
      estimatedTime: 5,
      coordinates: { x: 20, y: 80 },
      color: 'from-blue-500 to-cyan-500',
      funFacts: [
        '🎨 The entrance artwork was designed by young residents',
        '🌱 Plants here are cared for by our gardening club',
        '📚 The welcome board shows our latest achievements'
      ],
      safetyTips: [
        'Fire exits are clearly marked in green',
        'Emergency assembly point is in the front garden',
        'Reception is staffed 24/7 for support'
      ],
      interactiveElements: [
        {
          type: 'quiz',
          title: 'Entrance Knowledge',
          content: {
            question: 'What makes our entrance special?',
            options: ['Security cameras only', 'Artwork by residents', 'Just a door', 'Nothing special'],
            correct: 1
          }
        },
        {
          type: 'photo',
          title: 'Capture the Welcome',
          content: 'Take a photo of the welcome board and share what excites you most!'
        }
      ]
    },
    {
      id: 'living-room',
      name: 'Community Living Room',
      icon: <Users className="w-8 h-8" />,
      shortDescription: 'Where connections are made',
      fullDescription: 'The heart of our home where residents gather, share stories, watch movies, and build lifelong friendships.',
      qrCode: 'QR_LIVING_002',
      estimatedTime: 8,
      coordinates: { x: 40, y: 60 },
      color: 'from-green-500 to-emerald-500',
      funFacts: [
        '🎬 Movie nights happen every Friday',
        '🎮 Gaming tournaments monthly',
        '📖 Book club meets here weekly',
        '🍿 Popcorn machine for special occasions'
      ],
      safetyTips: [
        'Furniture is secured for safety',
        'Fire blanket located near the fireplace',
        'First aid kit in the wall cabinet'
      ],
      interactiveElements: [
        {
          type: 'challenge',
          title: 'Community Connection',
          content: 'Find 3 things in this room that help people connect with each other'
        },
        {
          type: 'audio',
          title: 'Resident Stories',
          content: 'Listen to testimonials from current residents about their favorite living room memories'
        }
      ]
    },
    {
      id: 'kitchen',
      name: 'Kitchen & Dining',
      icon: <Utensils className="w-8 h-8" />,
      shortDescription: 'Nourishment and life skills',
      fullDescription: 'More than just meals - this is where life skills are learned, cultures are shared, and independence is built.',
      qrCode: 'QR_KITCHEN_003',
      estimatedTime: 10,
      coordinates: { x: 70, y: 40 },
      color: 'from-orange-500 to-red-500',
      funFacts: [
        '👨‍🍳 Cooking classes every Tuesday',
        '🌍 Cultural food nights monthly',
        '🥗 Healthy eating workshops',
        '🍰 Birthday celebrations happen here'
      ],
      safetyTips: [
        'Sharp knives stored securely',
        'Fire extinguisher and fire blanket present',
        'Non-slip mats for wet areas'
      ],
      interactiveElements: [
        {
          type: 'challenge',
          title: 'Kitchen Safety Hunt',
          content: 'Locate all safety equipment and learn proper kitchen etiquette'
        },
        {
          type: 'quiz',
          title: 'Nutrition Knowledge',
          content: {
            question: 'What makes our kitchen special for learning?',
            options: ['Just cooking food', 'Life skills development', 'Storage only', 'Staff use only'],
            correct: 1
          }
        }
      ]
    },
    {
      id: 'bedroom',
      name: 'Personal Bedrooms',
      icon: <Bed className="w-8 h-8" />,
      shortDescription: 'Your private sanctuary',
      fullDescription: 'Each bedroom is designed as a personal sanctuary where residents can express themselves, find peace, and call home.',
      qrCode: 'QR_BEDROOM_004',
      estimatedTime: 6,
      coordinates: { x: 80, y: 20 },
      color: 'from-purple-500 to-pink-500',
      funFacts: [
        '🎨 Rooms can be personalized with artwork',
        '🔐 Each room has secure storage',
        '🌟 High-quality bedding provided',
        '💡 Good lighting for reading and studying'
      ],
      safetyTips: [
        'Windows have secure locks',
        'Smoke detectors in every room',
        'Emergency contact numbers posted'
      ],
      interactiveElements: [
        {
          type: 'fact',
          title: 'Your Space, Your Rules',
          content: 'Learn about personalization options and how to make your room truly yours'
        }
      ]
    },
    {
      id: 'garden',
      name: 'Garden & Outdoor Space',
      icon: <Coffee className="w-8 h-8" />,
      shortDescription: 'Nature and fresh air',
      fullDescription: 'Outdoor spaces for relaxation, gardening, sports, and connecting with nature. A place for reflection and growth.',
      qrCode: 'QR_GARDEN_005',
      estimatedTime: 12,
      coordinates: { x: 30, y: 30 },
      color: 'from-green-600 to-lime-500',
      funFacts: [
        '🌻 Vegetable garden tended by residents',
        '⚽ Sports equipment available',
        '🦋 Wildlife watching opportunities',
        '🏡 Outdoor seating areas for quiet reflection'
      ],
      safetyTips: [
        'Paths are well-lit for evening use',
        'Garden tools stored safely',
        'Outdoor first aid station available'
      ],
      interactiveElements: [
        {
          type: 'challenge',
          title: 'Nature Detective',
          content: 'Find 5 different types of plants or wildlife in the garden'
        },
        {
          type: 'photo',
          title: 'Garden Gallery',
          content: 'Capture the beauty of our outdoor space and seasonal changes'
        }
      ]
    },
    {
      id: 'activities',
      name: 'Activities & Learning Hub',
      icon: <Gamepad2 className="w-8 h-8" />,
      shortDescription: 'Growth and creativity',
      fullDescription: 'Dedicated spaces for learning, creativity, skill development, and pursuing passions in a supportive environment.',
      qrCode: 'QR_ACTIVITIES_006',
      estimatedTime: 15,
      coordinates: { x: 60, y: 70 },
      color: 'from-indigo-500 to-purple-600',
      funFacts: [
        '🎵 Music room with instruments',
        '💻 Computer lab for digital skills',
        '🎨 Art studio with professional supplies',
        '📚 Library with study spaces'
      ],
      safetyTips: [
        'All equipment regularly safety checked',
        'Supervised activities for specialized equipment',
        'Clean-up protocols for shared spaces'
      ],
      interactiveElements: [
        {
          type: 'challenge',
          title: 'Skill Explorer',
          content: 'Try 3 different activities and rate your interest level'
        },
        {
          type: 'quiz',
          title: 'Learning Opportunities',
          content: {
            question: 'What can you do in the Activities Hub?',
            options: ['Only watch TV', 'Learn new skills', 'Sleep', 'Store items'],
            correct: 1
          }
        }
      ]
    }
  ];

  const selectedLocationData = selectedLocation ? locations.find(l => l.id === selectedLocation) : null;
  const completionPercentage = (completedLocations.length / locations.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <QrCode className="w-8 h-8 mr-3 text-cyan-400" />
                Enhanced QR House Tour
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/10 text-white">
                {completedLocations.length}/{locations.length} Complete
              </Badge>
              <Button
                onClick={() => setShowQRScanner(!showQRScanner)}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Camera className="w-4 h-4 mr-2" />
                Scan QR
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={completionPercentage} className="h-2 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Tour Mode Selection */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="bg-black/30 backdrop-blur-md rounded-full p-2 flex space-x-2">
            {[
              { mode: 'explore', label: 'Free Explore', icon: <Eye className="w-4 h-4" /> },
              { mode: 'guided', label: 'Guided Tour', icon: <Compass className="w-4 h-4" /> },
              { mode: 'challenge', label: 'Challenge Mode', icon: <Target className="w-4 h-4" /> }
            ].map(({ mode, label, icon }) => (
              <Button
                key={mode}
                onClick={() => setTourMode(mode as any)}
                variant={tourMode === mode ? "default" : "ghost"}
                className={`text-white ${
                  tourMode === mode 
                    ? 'bg-cyan-500 hover:bg-cyan-600' 
                    : 'hover:bg-white/10'
                }`}
              >
                {icon}
                <span className="ml-2">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Interactive House Map */}
        <div className="relative">
          <Card className="bg-black/40 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center text-2xl">
                🏠 Interactive House Layout
              </CardTitle>
              <p className="text-white/80 text-center">
                {tourMode === 'explore' && "Click any location to explore at your own pace"}
                {tourMode === 'guided' && "Follow the guided path for the best experience"}
                {tourMode === 'challenge' && "Complete challenges to unlock achievements"}
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl overflow-hidden">
                {/* House Floor Plan Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* Floor plan outline */}
                    <rect x="50" y="50" width="300" height="200" fill="none" stroke="white" strokeWidth="2" />
                    <rect x="50" y="120" width="100" height="80" fill="none" stroke="white" strokeWidth="1" />
                    <rect x="160" y="120" width="100" height="80" fill="none" stroke="white" strokeWidth="1" />
                    <rect x="270" y="120" width="80" height="80" fill="none" stroke="white" strokeWidth="1" />
                    <rect x="50" y="50" width="300" height="60" fill="none" stroke="white" strokeWidth="1" />
                    <rect x="50" y="210" width="300" height="40" fill="none" stroke="white" strokeWidth="1" />
                  </svg>
                </div>

                {/* Location Points */}
                {locations.map((location) => {
                  const isCompleted = completedLocations.includes(location.id);
                  const isSelected = selectedLocation === location.id;
                  
                  return (
                    <motion.div
                      key={location.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ 
                        left: `${location.coordinates.x}%`, 
                        top: `${location.coordinates.y}%` 
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedLocation(location.id);
                        onLocationSelect(location.id);
                      }}
                    >
                      <motion.div
                        className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${location.color} 
                          flex items-center justify-center shadow-lg border-4 ${
                          isCompleted ? 'border-green-400' : isSelected ? 'border-yellow-400' : 'border-white/50'
                        }`}
                        animate={isSelected ? { 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0] 
                        } : {}}
                        transition={{ duration: 2, repeat: isSelected ? Infinity : 0 }}
                      >
                        <div className="text-white">
                          {location.icon}
                        </div>
                        
                        {/* Completion Badge */}
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}

                        {/* QR Code Indicator */}
                        <motion.div
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                          animate={{ y: [0, -3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <QrCode className="w-5 h-5 text-cyan-300" />
                        </motion.div>
                      </motion.div>
                      
                      {/* Location Name */}
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
                          <p className="text-white text-sm font-semibold whitespace-nowrap">
                            {location.name}
                          </p>
                          <p className="text-white/70 text-xs">
                            {location.estimatedTime} min
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* User Position Indicator */}
                <motion.div
                  className="absolute w-4 h-4 bg-yellow-400 rounded-full border border-white transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${userPosition.x}%`, top: `${userPosition.y}%` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>

              {/* Location Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  className="bg-white/10 rounded-lg p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <MapPin className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">{locations.length}</p>
                  <p className="text-white/70 text-sm">Locations</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 rounded-lg p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">
                    {locations.reduce((sum, loc) => sum + loc.estimatedTime, 0)} min
                  </p>
                  <p className="text-white/70 text-sm">Total Time</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 rounded-lg p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">{completedLocations.length}</p>
                  <p className="text-white/70 text-sm">Completed</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white/10 rounded-lg p-4 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">
                    {Math.round(completionPercentage)}%
                  </p>
                  <p className="text-white/70 text-sm">Progress</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Details Panel */}
        <AnimatePresence>
          {selectedLocationData && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="mt-6"
            >
              <Card className="bg-black/40 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedLocationData.color} flex items-center justify-center`}>
                        {selectedLocationData.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {selectedLocationData.name}
                        </h3>
                        <p className="text-white/70">
                          {selectedLocationData.shortDescription}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary" className="bg-white/10 text-white">
                            <Clock className="w-3 h-3 mr-1" />
                            {selectedLocationData.estimatedTime} min
                          </Badge>
                          <Badge variant="secondary" className="bg-white/10 text-white">
                            <QrCode className="w-3 h-3 mr-1" />
                            {selectedLocationData.qrCode}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => onLocationSelect(selectedLocationData.id)}
                      className="bg-cyan-500 hover:bg-cyan-600"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Experience
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-bold text-white mb-3 flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                          Fun Facts
                        </h4>
                        <ul className="space-y-2">
                          {selectedLocationData.funFacts.map((fact, idx) => (
                            <motion.li
                              key={idx}
                              className="text-white/80 text-sm"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              {fact}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4">
                        <h4 className="font-bold text-white mb-3 flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-green-400" />
                          Safety Information
                        </h4>
                        <ul className="space-y-2">
                          {selectedLocationData.safetyTips.map((tip, idx) => (
                            <motion.li
                              key={idx}
                              className="text-white/80 text-sm flex items-start"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                              {tip}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Elements Preview */}
                  <div className="mt-6">
                    <h4 className="font-bold text-white mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-orange-400" />
                      Interactive Elements
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedLocationData.interactiveElements.map((element, idx) => (
                        <motion.div
                          key={idx}
                          className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center mb-2">
                            {element.type === 'quiz' && <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />}
                            {element.type === 'challenge' && <Target className="w-5 h-5 text-red-400 mr-2" />}
                            {element.type === 'photo' && <Camera className="w-5 h-5 text-blue-400 mr-2" />}
                            {element.type === 'audio' && <Volume2 className="w-5 h-5 text-green-400 mr-2" />}
                            {element.type === 'fact' && <Star className="w-5 h-5 text-purple-400 mr-2" />}
                            <p className="font-semibold text-white text-sm">{element.title}</p>
                          </div>
                          <p className="text-white/70 text-xs">
                            {typeof element.content === 'string' 
                              ? element.content 
                              : `${element.type.charAt(0).toUpperCase() + element.type.slice(1)} activity`}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Access Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/30 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <QrCode className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-white font-bold mb-2">QR Scanner</h3>
              <p className="text-white/70 text-sm mb-4">
                Scan location QR codes to unlock interactive content
              </p>
              <Button 
                onClick={() => setShowQRScanner(true)}
                className="bg-cyan-500 hover:bg-cyan-600 w-full"
              >
                Open Scanner
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Map className="w-12 h-12 text-green-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-white font-bold mb-2">Tour Progress</h3>
              <p className="text-white/70 text-sm mb-4">
                Track your exploration and earn achievements
              </p>
              <div className="bg-white/10 rounded-lg p-3">
                <Progress value={completionPercentage} className="h-2 mb-2" />
                <p className="text-white text-sm">
                  {completedLocations.length} of {locations.length} completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-md border-white/20">
            <CardContent className="p-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-white font-bold mb-2">Achievements</h3>
              <p className="text-white/70 text-sm mb-4">
                Unlock badges and certificates as you explore
              </p>
              <div className="flex justify-center space-x-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      idx < Math.floor(completionPercentage / 33) 
                        ? 'bg-yellow-500' 
                        : 'bg-white/20'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${
                      idx < Math.floor(completionPercentage / 33) 
                        ? 'text-white' 
                        : 'text-white/40'
                    }`} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <QrCode className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">QR Code Scanner</h3>
                <p className="text-gray-900 mb-6">
                  Point your camera at any location QR code to start the interactive experience!
                </p>
                
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-900 mb-2">Demo QR Codes:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {locations.slice(0, 4).map((loc) => (
                      <Button
                        key={loc.id}
                        onClick={() => {
                          setShowQRScanner(false);
                          onLocationSelect(loc.id);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {loc.qrCode}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button
                  onClick={() => setShowQRScanner(false)}
                  className="w-full"
                >
                  Close Scanner
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
