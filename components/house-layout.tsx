
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HouseLayoutProps {
  completedLocations: string[];
  onLocationSelect: (locationId: string) => void;
  onBackToMenu: () => void;
  currentSession?: any;
}

const locationIcons = {
  bedroom: Bed,
  'fire-exit': Flame,
  kitchen: ChefHat,
  'chill-room': Heart,
  'entrance-hall': Home,
  office: Users
};

const locationDetails = {
  bedroom: {
    title: 'Bedroom',
    subtitle: 'Safe Sleep & Dignity',
    color: 'from-pink-400 to-purple-500',
    position: { top: '20%', right: '15%' }
  },
  'fire-exit': {
    title: 'Fire Exit',
    subtitle: 'Emergency Preparedness', 
    color: 'from-red-400 to-orange-500',
    position: { top: '35%', left: '10%' }
  },
  kitchen: {
    title: 'Kitchen',
    subtitle: 'Hygiene & Cultural Food',
    color: 'from-green-400 to-blue-500',
    position: { bottom: '35%', right: '20%' }
  },
  'chill-room': {
    title: 'Chill Room',
    subtitle: 'Mindfulness & Wellbeing',
    color: 'from-purple-400 to-pink-500',
    position: { top: '15%', left: '45%' }
  },
  'entrance-hall': {
    title: 'Entrance Hall',
    subtitle: 'Values & Safeguarding',
    color: 'from-yellow-400 to-orange-500',
    position: { bottom: '25%', left: '15%' }
  },
  office: {
    title: 'Office',
    subtitle: 'Meet the Team',
    color: 'from-blue-400 to-purple-500',
    position: { top: '45%', right: '10%' }
  }
};

export default function HouseLayout({ completedLocations, onLocationSelect, onBackToMenu, currentSession }: HouseLayoutProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId);
    setTimeout(() => {
      onLocationSelect(locationId);
    }, 300);
  };

  const isLocationUnlocked = (locationId: string) => {
    // First location (entrance-hall) is always unlocked
    if (locationId === 'entrance-hall') return true;
    
    // Other locations unlock after completing entrance-hall
    if (completedLocations?.includes?.('entrance-hall')) return true;
    
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={onBackToMenu}
              className="flex items-center gap-2 hover:bg-purple-100"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Menu
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <QrCode className="w-8 h-8 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Interactive House Tour
              </h1>
            </div>
            <p className="text-lg text-gray-900 max-w-2xl mx-auto">
              Explore our care home through an engaging QR code experience. 
              Complete activities in each location to earn your completion certificate!
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Your Progress</h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {completedLocations?.length || 0}/6 Completed
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((completedLocations?.length || 0) / 6) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* House Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Background House Shape */}
          <div className="relative bg-white rounded-3xl shadow-lg border-0 min-h-[600px] max-w-4xl mx-auto overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
            
            {/* House Outline */}
            <svg
              viewBox="0 0 800 600"
              className="absolute inset-0 w-full h-full opacity-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M100 500 L100 200 L400 50 L700 200 L700 500 Z" />
              <path d="M200 500 L200 300 L600 300 L600 500" />
              <path d="M350 500 L350 350 L450 350 L450 500" />
            </svg>

            {/* Location Buttons */}
            {Object.entries(locationDetails).map(([locationId, details]) => {
              const IconComponent = locationIcons[locationId as keyof typeof locationIcons];
              const isCompleted = completedLocations?.includes?.(locationId);
              const isUnlocked = isLocationUnlocked(locationId);
              const isSelected = selectedLocation === locationId;

              return (
                <motion.div
                  key={locationId}
                  className="absolute"
                  style={details.position}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + Object.keys(locationDetails).indexOf(locationId) * 0.1 }}
                >
                  <motion.div
                    whileHover={isUnlocked ? { scale: 1.1 } : {}}
                    whileTap={isUnlocked ? { scale: 0.95 } : {}}
                  >
                    <Button
                      onClick={() => isUnlocked && handleLocationClick(locationId)}
                      disabled={!isUnlocked}
                      variant="ghost"
                      className={`
                        relative p-0 h-auto bg-transparent hover:bg-transparent group
                        ${isSelected ? 'animate-pulse' : ''}
                      `}
                    >
                      <Card className={`
                        w-32 h-32 transition-all duration-300 border-2
                        ${isCompleted 
                          ? 'border-green-400 shadow-lg shadow-green-200 bg-gradient-to-br from-green-50 to-green-100' 
                          : isUnlocked
                          ? `border-transparent shadow-lg bg-gradient-to-br ${details.color} hover:shadow-md`
                          : 'border-gray-300 bg-gray-100 opacity-60'
                        }
                      `}>
                        <CardContent className="p-0 h-full flex flex-col items-center justify-center relative">
                          {/* Completion Checkmark */}
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-lg"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                          
                          {/* Lock Icon for Locked Locations */}
                          {!isUnlocked && (
                            <div className="absolute -top-2 -right-2 bg-purple-400 rounded-full p-1 shadow-lg">
                              <Lock className="w-4 h-4 text-white" />
                            </div>
                          )}

                          <IconComponent className={`
                            w-8 h-8 mb-2 transition-colors
                            ${isCompleted 
                              ? 'text-green-600' 
                              : isUnlocked 
                              ? 'text-white group-hover:text-white' 
                              : 'text-gray-900'
                            }
                          `} />
                          <h4 className={`
                            text-sm font-semibold text-center leading-tight
                            ${isCompleted 
                              ? 'text-green-700' 
                              : isUnlocked 
                              ? 'text-white' 
                              : 'text-gray-900'
                            }
                          `}>
                            {details.title}
                          </h4>
                          <p className={`
                            text-xs text-center mt-1 px-2
                            ${isCompleted 
                              ? 'text-green-600' 
                              : isUnlocked 
                              ? 'text-white/90' 
                              : 'text-gray-900'
                            }
                          `}>
                            {details.subtitle}
                          </p>
                        </CardContent>
                      </Card>
                    </Button>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3">How it works</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-900">
                <div className="flex flex-col items-center">
                  <QrCode className="w-6 h-6 mb-2 text-purple-600" />
                  <p>Scan QR codes at each location</p>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="w-6 h-6 mb-2 text-purple-600" />
                  <p>Complete interactive activities</p>
                </div>
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 mb-2 text-purple-600" />
                  <p>Earn your completion certificate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
