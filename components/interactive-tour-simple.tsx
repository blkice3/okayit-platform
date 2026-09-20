

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Home,
  Bed,
  Sofa,
  GamepadIcon,
  ChefHat,
  Shirt,
  Bath,
  Trees,
  CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

interface Room {
  id: string;
  name: string;
  description: string;
  icon: any;
  imagePath: string;
  features: string[];
  color: string;
}

interface InteractiveTourSimpleProps {
  onBack: () => void;
}

export default function InteractiveTourSimple({ onBack }: InteractiveTourSimpleProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [visitedRooms, setVisitedRooms] = useState<string[]>([]);

  const rooms: Room[] = [
    {
      id: 'bedroom',
      name: 'Bedroom',
      description: 'Your private space to relax and make your own',
      icon: Bed,
      imagePath: 'https://cdn.abacus.ai/images/558e8a5f-9873-4903-a875-9149d36e0b08.png',
      features: [
        'Private personal space',
        'Comfortable bed and furniture',
        'Storage for your belongings',
        'Space to decorate as you like'
      ],
      color: 'purple'
    },
    {
      id: 'lounge',
      name: 'Lounge',
      description: 'Comfortable communal space for relaxation and socializing',
      icon: Sofa,
      imagePath: 'https://cdn.abacus.ai/images/37d09c02-ed9e-4209-a0e6-39f8357d3511.png',
      features: [
        'Comfortable seating',
        'TV and entertainment',
        'Space to socialize',
        'Quiet areas available'
      ],
      color: 'blue'
    },
    {
      id: 'games-room',
      name: 'Games Room',
      description: 'Fun space with games and activities for everyone',
      icon: GamepadIcon,
      imagePath: 'https://cdn.abacus.ai/images/9a3ef75b-0a1a-4b26-b337-212181eef1b6.png',
      features: [
        'Gaming consoles',
        'Board games',
        'Pool table',
        'Activity space'
      ],
      color: 'green'
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      description: 'Learn to cook and share meals together',
      icon: ChefHat,
      imagePath: 'https://cdn.abacus.ai/images/0ed504bc-2100-4b56-b30c-00cda1bd98aa.png',
      features: [
        'Full cooking facilities',
        'Learn life skills',
        'Meal preparation',
        'Dining area'
      ],
      color: 'orange'
    },
    {
      id: 'utility-room',
      name: 'Utility Room',
      description: 'Laundry and practical skills area',
      icon: Shirt,
      imagePath: 'https://cdn.abacus.ai/images/15c0f0bf-ee88-41e6-93f3-33d994ece830.png',
      features: [
        'Washing machines',
        'Dryers',
        'Learn laundry skills',
        'Cleaning supplies'
      ],
      color: 'pink'
    },
    {
      id: 'ensuite-bedrooms',
      name: 'Ensuite Bedrooms',
      description: 'Private bedrooms with personal bathroom facilities',
      icon: Bath,
      imagePath: 'https://cdn.abacus.ai/images/0c486e1d-72d1-47f9-9f25-be2de60a0889.png',
      features: [
        'Private bathroom',
        'Extra privacy',
        'Shower facilities',
        'Personal space'
      ],
      color: 'purple'
    },
    {
      id: 'toilets',
      name: 'Toilets',
      description: 'Clean and well-maintained facilities',
      icon: Bath,
      imagePath: 'https://cdn.abacus.ai/images/f0f8d12b-70da-4fea-a58f-52c199add183.png',
      features: [
        'Multiple facilities',
        'Always clean',
        'Accessible',
        'Private'
      ],
      color: 'blue'
    },
    {
      id: 'garden',
      name: 'Garden',
      description: 'Outdoor space for fresh air and activities',
      icon: Trees,
      imagePath: 'https://cdn.abacus.ai/images/801a47d9-97fb-4f79-b471-8079b96c0fbc.png',
      features: [
        'Outdoor activities',
        'Safe play area',
        'Fresh air',
        'Gardening opportunities'
      ],
      color: 'green'
    }
  ];

  const handleRoomClick = (roomId: string) => {
    setSelectedRoom(roomId);
    if (!visitedRooms.includes(roomId)) {
      setVisitedRooms([...visitedRooms, roomId]);
    }
  };

  const selectedRoomData = rooms.find(r => r.id === selectedRoom);
  const progress = (visitedRooms.length / rooms.length) * 100;

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page)}>
      {/* Compact Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="p-2 -ml-2 flex items-center gap-1 text-purple-600 text-sm font-bold">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-gray-800">House Tour</span>
            </div>
            <Badge className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5">
              {visitedRooms.length}/{rooms.length}
            </Badge>
          </div>
          <div className="mt-1.5">
            <div className="w-full bg-blue-100 rounded-full h-1.5">
              <motion.div
                className="bg-gradient-to-r from-blue-600 to-blue-500 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {!selectedRoom ? (
          // Room List View
          <>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-8"
            >
              <h2 className={combineThemeClasses("text-sm mb-4", okayitTheme.text.headingBlue)}>
                Welcome to Our Home
              </h2>
              <p className={combineThemeClasses("text-xl", okayitTheme.text.secondaryOnLight)}>
                Click on any room to learn more about it
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rooms.map((room, index) => {
                const Icon = room.icon;
                const visited = visitedRooms.includes(room.id);

                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoomClick(room.id)}
                    className="cursor-pointer"
                  >
                    <Card className={combineThemeClasses(
                      "h-full border-4 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden",
                      room.color === 'purple' && okayitTheme.backgrounds.whiteCardPurple,
                      room.color === 'blue' && okayitTheme.backgrounds.whiteCardBlue,
                      room.color === 'orange' && okayitTheme.backgrounds.whiteCardOrange,
                      room.color === 'green' && okayitTheme.backgrounds.whiteCardGreen,
                      room.color === 'pink' && 'bg-white border border-pink-400 hover:border-pink-500'
                    )}>
                      {/* Image */}
                      <div className="relative aspect-video bg-gray-100">
                        <Image
                          src={room.imagePath}
                          alt={room.name}
                          fill
                          className="object-cover"
                        />
                        {visited && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-green-500 rounded-full p-2">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <motion.div
                            className={okayitTheme.icons[room.color as keyof typeof okayitTheme.icons]}
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4, delay: index * 0.2 }}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </motion.div>
                          <h3 className={combineThemeClasses(
                            "text-sm font-black",
                            room.color === 'purple' && okayitTheme.text.purple,
                            room.color === 'blue' && okayitTheme.text.blue,
                            room.color === 'orange' && okayitTheme.text.orange,
                            room.color === 'green' && okayitTheme.text.green,
                            room.color === 'pink' && okayitTheme.text.pink
                          )}>
                            {room.name}
                          </h3>
                        </div>

                        <p className={combineThemeClasses("text-sm mb-4", okayitTheme.text.secondaryOnLight)}>
                          {room.description}
                        </p>

                        <Button
                          className={combineThemeClasses(
                            "w-full",
                            room.color === 'purple' && okayitTheme.interactive.buttonPurple,
                            room.color === 'blue' && okayitTheme.interactive.buttonBlue,
                            room.color === 'orange' && okayitTheme.interactive.buttonOrange,
                            room.color === 'green' && okayitTheme.interactive.buttonGreen,
                            room.color === 'pink' && okayitTheme.interactive.buttonPurple
                          )}
                        >
                          Explore Room
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          // Room Detail View
          selectedRoomData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <Button
                onClick={() => setSelectedRoom(null)}
                className={combineThemeClasses("mb-6", okayitTheme.interactive.navBlue)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Room List
              </Button>

              <Card className={okayitTheme.backgrounds.whiteCardBlue}>
                {/* Large Image */}
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={selectedRoomData.imagePath}
                    alt={selectedRoomData.name}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </div>

                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={okayitTheme.icons[selectedRoomData.color as keyof typeof okayitTheme.icons]}>
                      <selectedRoomData.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className={combineThemeClasses("text-sm mb-2", okayitTheme.text.headingBlue)}>
                        {selectedRoomData.name}
                      </h2>
                      <p className={combineThemeClasses("text-xl", okayitTheme.text.secondaryOnLight)}>
                        {selectedRoomData.description}
                      </p>
                    </div>
                  </div>

                  <div className={combineThemeClasses("p-6 rounded-xl mb-6", okayitTheme.backgrounds.blueCard)}>
                    <h3 className={combineThemeClasses("text-sm mb-4", okayitTheme.text.onBlue)}>
                      What You'll Find Here
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRoomData.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 bg-white/90 p-4 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className={okayitTheme.text.primaryOnLight}>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedRoom(null)}
                    className={combineThemeClasses("w-full", okayitTheme.interactive.buttonBlue)}
                  >
                    Continue Exploring Other Rooms
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
