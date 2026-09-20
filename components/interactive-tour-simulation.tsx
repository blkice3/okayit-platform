
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Users, 
  Home,
  Camera,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Headphones,
  Maximize,
  RotateCw
} from 'lucide-react';
import Image from 'next/image';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

interface TourStop {
  id: number;
  title: string;
  description: string;
  area: string;
  audioDescription: string;
  interactiveElements: string[];
  safetyFeatures: string[];
  ageAppropriate: string[];
  keyMessages: string[];
  video360Url: string;
  duration: number; // in seconds
}

interface InteractiveTourProps {
  onBack: () => void;
}

export default function InteractiveTourSimulation({ onBack }: InteractiveTourProps) {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tourMode, setTourMode] = useState<'guided' | 'explore'>('guided');
  const [completedStops, setCompletedStops] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState(true);

  const tourStops: TourStop[] = [
    {
      id: 1,
      title: "Welcome to Claudius - Reception Area",
      description: "Your journey begins at our welcoming reception area. This is where families, visitors, and new residents first experience the warmth and care of Claudius.",
      area: "Reception & Entrance",
      audioDescription: "Welcome to Claudius care home. You're standing in our bright, modern reception area designed to feel like a comfortable family home rather than an institution.",
      interactiveElements: ["Welcome information board", "Comfortable seating area", "Family photos display", "Emergency contact information"],
      safetyFeatures: ["24/7 staffed reception", "Secure entry system", "Emergency procedures displayed", "CCTV monitoring"],
      ageAppropriate: ["Age-appropriate magazines and books", "Comfortable seating for all ages", "Clear signage and directions"],
      keyMessages: ["First impressions matter", "Creating a homely atmosphere", "Ensuring safety and security"],
      video360Url: "https://www.youtube.com/embed/Ao-4t0Z_P0c",
      duration: 45
    },
    {
      id: 2,
      title: "Living Together - Common Areas",
      description: "Our heart is the communal living space where young people relax, socialize, and feel at home. This area promotes community and belonging.",
      area: "Common Living Room",
      audioDescription: "This is our main living area where residents spend time together, watching TV, playing games, and building friendships that often last a lifetime.",
      interactiveElements: ["Gaming console area", "TV and entertainment center", "Board games collection", "Reading nook"],
      safetyFeatures: ["Open sightlines for supervision", "Safe furniture and fittings", "No sharp corners", "Easy clean surfaces"],
      ageAppropriate: ["Age-appropriate entertainment", "Flexible seating arrangements", "Calm color schemes", "Personal space options"],
      keyMessages: ["Building community", "Encouraging social interaction", "Respecting personal boundaries"],
      video360Url: "https://www.youtube.com/embed/mKEeIIhOhUo",
      duration: 60
    },
    {
      id: 3,
      title: "Learning Independence - Kitchen & Dining",
      description: "Our kitchen and dining area where young people learn essential life skills including cooking, nutrition, and sharing meals together as a family.",
      area: "Kitchen & Dining",
      audioDescription: "Here in our fully equipped kitchen, residents learn to cook, understand nutrition, and develop independence skills that will serve them throughout their lives.",
      interactiveElements: ["Cooking stations", "Recipe displays", "Nutritional information boards", "Meal planning area"],
      safetyFeatures: ["Safety equipment training", "Supervised cooking areas", "First aid stations", "Safety guards on appliances"],
      ageAppropriate: ["Age-appropriate cooking tasks", "Supervision levels vary by age", "Educational cooking programs"],
      keyMessages: ["Developing life skills", "Promoting independence", "Learning together"],
      video360Url: "https://www.youtube.com/embed/PlDnPgAht1c",
      duration: 75
    },
    {
      id: 4,
      title: "Personal Sanctuary - Bedrooms",
      description: "Every young person deserves their own space. Our bedrooms are designed to be personal sanctuaries where residents can express themselves and find peace.",
      area: "Private Bedrooms",
      audioDescription: "This is one of our resident bedrooms - a private space that each young person can personalize and call their own, promoting dignity and self-expression.",
      interactiveElements: ["Personal decoration options", "Study desk area", "Storage solutions", "Privacy features"],
      safetyFeatures: ["Safety glass windows", "Secure personal storage", "Emergency call systems", "Fire safety compliance"],
      ageAppropriate: ["Age-appropriate décor options", "Privacy levels by age", "Personal responsibility development"],
      keyMessages: ["Respecting personal space", "Encouraging self-expression", "Building identity"],
      video360Url: "https://www.youtube.com/embed/cJAVVCdCEug",
      duration: 50
    },
    {
      id: 5,
      title: "Growing Minds - Study Areas",
      description: "Education is key to every young person's future. Our dedicated study areas provide quiet, focused spaces for learning and homework.",
      area: "Study & Learning",
      audioDescription: "Our study areas are designed to support educational achievement, with quiet spaces for concentration and collaborative areas for group learning.",
      interactiveElements: ["Computer workstations", "Reference materials", "Quiet study booths", "Group collaboration spaces"],
      safetyFeatures: ["Internet safety filters", "Supervised computer use", "Secure equipment storage", "Emergency contacts accessible"],
      ageAppropriate: ["Age-appropriate learning materials", "Supervision levels by age", "Educational support programs"],
      keyMessages: ["Supporting educational goals", "Providing learning opportunities", "Encouraging achievement"],
      video360Url: "https://www.youtube.com/embed/bIyT_4mOJN0",
      duration: 55
    },
    {
      id: 6,
      title: "Fresh Air & Freedom - Garden Spaces",
      description: "Our outdoor areas provide safe spaces for recreation, relaxation, and connection with nature. These spaces support physical and mental wellbeing.",
      area: "Garden & Outdoor",
      audioDescription: "Step into our secure garden area where residents can enjoy fresh air, physical activities, and peaceful moments in nature.",
      interactiveElements: ["Sports equipment area", "Quiet reflection spaces", "Gardening plots", "Outdoor seating"],
      safetyFeatures: ["Secure perimeter", "Safe playground equipment", "First aid accessible", "Weather protection"],
      ageAppropriate: ["Age-appropriate outdoor activities", "Supervised and free play areas", "Sensory garden elements"],
      keyMessages: ["Promoting physical health", "Connecting with nature", "Providing recreation"],
      video360Url: "https://www.youtube.com/embed/yhYEqEqFEyI",
      duration: 65
    },
    {
      id: 7,
      title: "Professional Support - Staff Areas",
      description: "Our professional staff offices where individual meetings, assessments, and support planning happens. This is where care plans come to life.",
      area: "Staff Offices",
      audioDescription: "This professional space is where our skilled staff meet with residents for one-on-one support, planning, and guidance tailored to each individual's needs.",
      interactiveElements: ["Private meeting spaces", "Resource libraries", "Assessment tools", "Communication boards"],
      safetyFeatures: ["Confidential meeting spaces", "Emergency procedures", "Secure file storage", "Professional boundaries"],
      ageAppropriate: ["Age-appropriate communication methods", "Comfortable seating for all ages", "Visual aids and tools"],
      keyMessages: ["Providing professional support", "Individual care planning", "Building relationships"],
      video360Url: "https://www.youtube.com/embed/1BpZYoxOgxE",
      duration: 40
    },
    {
      id: 8,
      title: "Creative Expression - Activity Rooms",
      description: "Creativity and self-expression are vital for development. Our activity rooms provide spaces for arts, crafts, music, and creative exploration.",
      area: "Creative Activities",
      audioDescription: "In our activity room, residents explore their creativity through art, music, crafts, and other expressive activities that support emotional wellbeing and skill development.",
      interactiveElements: ["Art supplies and stations", "Musical instruments", "Craft materials", "Display areas for artwork"],
      safetyFeatures: ["Safe art materials", "Proper ventilation", "Easy clean surfaces", "Tool security measures"],
      ageAppropriate: ["Age-appropriate materials", "Varied activity difficulty levels", "Creative expression support"],
      keyMessages: ["Encouraging creativity", "Supporting emotional expression", "Building confidence"],
      video360Url: "https://www.youtube.com/embed/k2qLHdw-G-o",
      duration: 70
    }
  ];

  const currentStop = tourStops[currentStopIndex];
  const totalDuration = tourStops.reduce((sum, stop) => sum + stop.duration, 0);
  const completedDuration = tourStops.slice(0, currentStopIndex).reduce((sum, stop) => sum + stop.duration, 0) + progress;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < currentStop.duration) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= currentStop.duration) {
            setIsPlaying(false);
            if (!completedStops.includes(currentStop.id)) {
              setCompletedStops(prev => [...prev, currentStop.id]);
            }
            return currentStop.duration;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, currentStop.duration, currentStop.id, completedStops]);

  const nextStop = () => {
    if (currentStopIndex < tourStops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const previousStop = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(currentStopIndex - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const goToStop = (index: number) => {
    setCurrentStopIndex(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const restartStop = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page)}>
      {/* Compact Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 -ml-2 flex items-center gap-1 text-purple-600 text-sm font-bold">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-gray-800">360° Virtual Tour</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {currentStopIndex + 1}/{tourStops.length}
              </Badge>
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {formatTime(Math.floor(completedDuration))}/{formatTime(totalDuration)}
              </Badge>
            </div>
          </div>
          <div className="mt-1.5">
            <Progress value={(completedDuration / totalDuration) * 100} className="h-1.5" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-3 gap-3">
          {/* Main Tour Content */}
          <div className="lg:col-span-2 space-y-3">
            {/* Current Stop 360° Video and Controls */}
            <Card className="overflow-hidden shadow-sm border border-gray-200 dark:border-purple-200/30">
              <div className="relative aspect-video bg-gray-900 dark:bg-purple-950/20">
                <iframe
                  src={currentStop.video360Url}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; web-share; gyroscope; accelerometer"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full rounded-t-lg"
                  title={`360° View: ${currentStop.title}`}
                ></iframe>
                
                {/* 360° Video Indicator */}
                <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>360° Virtual Tour</span>
                </div>
                
                {/* Overlay Controls */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 space-y-3">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-white">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(currentStop.duration)}</span>
                      </div>
                      <Progress 
                        value={(progress / currentStop.duration) * 100} 
                        className="h-1"
                      />
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        onClick={restartStop}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        onClick={togglePlay}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 p-0"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tour Mode Indicator */}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Virtual Tour</span>
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Stop Details */}
            <Card>
              <CardContent className="p-3">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                        {currentStop.title}
                      </h2>
                      <Button
                        onClick={() => setShowDetails(!showDetails)}
                        variant="outline"
                        size="sm"
                      >
                        {showDetails ? 'Hide' : 'Show'} Details
                      </Button>
                    </div>
                    
                    <Badge variant="outline" className="mb-3">
                      {currentStop.area}
                    </Badge>
                    
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {currentStop.description}
                    </p>
                  </div>

                  {showDetails && (
                    <Tabs defaultValue="features" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="features">Features</TabsTrigger>
                        <TabsTrigger value="safety">Safety</TabsTrigger>
                        <TabsTrigger value="age">Age-Appropriate</TabsTrigger>
                        <TabsTrigger value="messages">Key Messages</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="features" className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Interactive Elements</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {currentStop.interactiveElements.map((element, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-100/10 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-blue-900 dark:text-blue-100">{element}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="safety" className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Safety Features</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {currentStop.safetyFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-100/10 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-900 dark:text-green-100">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="age" className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Age-Appropriate Features</h3>
                        <div className="space-y-3">
                          {currentStop.ageAppropriate.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm text-purple-900 dark:text-purple-100">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="messages" className="space-y-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Key Messages</h3>
                        <div className="space-y-3">
                          {currentStop.keyMessages.map((message, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                              <span className="text-sm text-amber-900 dark:text-amber-100">{message}</span>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    onClick={previousStop}
                    disabled={currentStopIndex === 0}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Headphones className="w-4 h-4 text-gray-900" />
                    <span className="text-sm text-gray-900">Audio tour available</span>
                  </div>

                  <Button
                    onClick={nextStop}
                    disabled={currentStopIndex === tourStops.length - 1}
                    className="flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tour Navigation Sidebar */}
          <div className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tour Stops</h3>
                <div className="space-y-2">
                  {tourStops.map((stop, index) => (
                    <button
                      key={stop.id}
                      onClick={() => goToStop(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        index === currentStopIndex
                          ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-300'
                          : 'bg-gray-50 dark:bg-purple-950/20 hover:bg-gray-100 dark:hover:bg-purple-100/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            completedStops.includes(stop.id)
                              ? 'bg-green-500 text-white'
                              : index === currentStopIndex
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                              {stop.area}
                            </h4>
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                              {formatTime(stop.duration)}
                            </p>
                          </div>
                        </div>
                        
                        {completedStops.includes(stop.id) && (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tour Stats */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Tour Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Completed Stops</span>
                    <span className="text-sm font-medium">{completedStops.length}/{tourStops.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Time Spent</span>
                    <span className="text-sm font-medium">{formatTime(Math.floor(completedDuration))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Estimated Remaining</span>
                    <span className="text-sm font-medium">{formatTime(totalDuration - Math.floor(completedDuration))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
