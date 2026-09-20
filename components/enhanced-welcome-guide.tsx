
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, Heart, Shield, Phone, MapPin, Calendar, 
  BookOpen, Gamepad2, Clock, AlertCircle, CheckCircle, 
  ArrowLeft, ArrowRight, Play, Pause, Volume2, VolumeX,
  Star, Award, Target, Lightbulb, MessageSquare, Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HomeContext } from '@/lib/home-contexts';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

interface EnhancedWelcomeGuideProps {
  onBack: () => void;
  currentHome: HomeContext;
}

interface SlideContent {
  id: number;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  interactiveElement?: React.ReactNode;
  backgroundColor: string;
  textColor: string;
  audioFile?: string;
  duration?: number;
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
}

export default function EnhancedWelcomeGuide({ onBack, currentHome }: EnhancedWelcomeGuideProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completedSlides, setCompletedSlides] = useState<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [slideTime, setSlideTime] = useState(0);

  const slides: SlideContent[] = [
    {
      id: 1,
      title: `Welcome to ${currentHome.name}! 🏠`,
      subtitle: "Your new beginning starts here",
      icon: <Home className="w-12 h-12" />,
      content: (
        <div className="space-y-6">
          {/* Welcome Video */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 rounded-2xl p-4 backdrop-blur-sm shadow-lg"
          >
            <div className="text-center mb-2">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome Video from {currentHome.name}</h3>
              <p className="text-gray-800 text-sm">Watch this special welcome message just for you!</p>
            </div>
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-md">
              {currentHome.welcomeVideoUrl.includes('youtube.com') || currentHome.welcomeVideoUrl.includes('youtu.be') ? (
                <iframe
                  src={currentHome.welcomeVideoUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                  title={`Welcome to ${currentHome.name}`}
                ></iframe>
              ) : (
                <video
                  src={currentHome.welcomeVideoUrl}
                  controls
                  className="w-full h-full object-contain"
                  title={`Welcome to ${currentHome.name}`}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 rounded-2xl p-3 backdrop-blur-sm shadow-lg"
          >
            <h3 className="text-sm font-bold text-center mb-2 text-gray-800">🌟 You Matter Here! 🌟</h3>
            <p className="text-gray-900 text-lg leading-relaxed">
              Every young person who walks through our doors brings something special. 
              You're not just moving into a house - you're joining a family that believes in your potential!
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 text-center shadow-sm">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">You're Valued</p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-4 text-center shadow-sm">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-semibold text-gray-800">You're Special</p>
              </div>
            </div>
          </motion.div>
        </div>
      ),
      backgroundColor: "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100",
      textColor: "text-gray-800",
      audioFile: "/audio/welcome.mp3",
      duration: 45
    },
    {
      id: 2,
      title: "Your Rights & Responsibilities 📜",
      icon: <Shield className="w-12 h-12" />,
      content: (
        <div className="grid gap-4">
          <motion.div 
            className="bg-white/90 rounded-xl p-4"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="font-bold text-lg mb-3 flex items-center text-gray-900">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              Your Rights Include:
            </h4>
            <ul className="space-y-2">
              {[
                "Privacy and dignity in your personal space",
                "Having your voice heard in decisions that affect you", 
                "Access to education and opportunities to grow",
                "Fair treatment regardless of background",
                "Support when you need it most"
              ].map((right, idx) => (
                <motion.li 
                  key={idx}
                  className="flex items-center text-gray-900 font-medium"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  {right}
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div 
            className="bg-white/90 rounded-xl p-4"
            whileHover={{ scale: 1.02 }}
          >
            <h4 className="font-bold text-lg mb-3 flex items-center text-gray-900">
              <Target className="w-6 h-6 text-blue-500 mr-2" />
              Your Responsibilities:
            </h4>
            <ul className="space-y-2">
              {[
                "Respect others and their belongings",
                "Follow house rules for everyone's safety",
                "Communicate openly with staff",
                "Take care of your personal space",
                "Support your housemates"
              ].map((resp, idx) => (
                <motion.li 
                  key={idx}
                  className="flex items-center text-gray-900 font-medium"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: (idx * 0.1) + 0.5 }}
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  {resp}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      ),
      backgroundColor: "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500",
      textColor: "text-white",
      quiz: {
        question: "What's one of your key rights in the care home?",
        options: [
          "Having your voice heard in decisions",
          "Staying up all night",
          "Not following house rules", 
          "Avoiding all responsibilities"
        ],
        correct: 0
      }
    },
    {
      id: 3,
      title: "House Rules - Living Together 🏡",
      icon: <Users className="w-12 h-12" />,
      content: (
        <div className="space-y-4">
          <div className="bg-white/95 rounded-xl p-3">
            <h3 className="text-sm font-bold text-center mb-3 text-gray-800">
              🤝 Our House, Our Rules, Our Community
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              <motion.div 
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-l-2 border-green-500"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-bold text-green-700 mb-3 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Daily Schedule
                </h4>
                <ul className="text-sm space-y-1 text-green-600">
                  <li>• Breakfast: 7:00-9:00 AM</li>
                  <li>• Quiet time: 10:00-11:00 PM</li>
                  <li>• Lights out: 11:00 PM (school nights)</li>
                  <li>• Weekend flexibility available</li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg p-4 border-l-2 border-blue-500"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-bold text-blue-700 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Safety First
                </h4>
                <ul className="text-sm space-y-1 text-blue-600">
                  <li>• No smoking in the building</li>
                  <li>• Visitors welcome with notice</li>
                  <li>• Personal belongings stay secure</li>
                  <li>• Emergency exits always clear</li>
                </ul>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border-l-2 border-purple-500"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-bold text-purple-700 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Respect Zone
                </h4>
                <ul className="text-sm space-y-1 text-purple-600">
                  <li>• Knock before entering rooms</li>
                  <li>• Keep noise levels considerate</li>
                  <li>• Clean up after yourself</li>
                  <li>• Everyone's opinion matters</li>
                </ul>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border-l-2 border-orange-500"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-bold text-orange-700 mb-3 flex items-center">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Fun & Growth
                </h4>
                <ul className="text-sm space-y-1 text-orange-600">
                  <li>• Weekly house meetings</li>
                  <li>• Activity planning together</li>
                  <li>• Homework support available</li>
                  <li>• Skills development programs</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      ),
      backgroundColor: "bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400",
      textColor: "text-white",
      interactiveElement: (
        <motion.div 
          className="mt-4 bg-white rounded-lg p-4 shadow-lg border border-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-center font-bold mb-2 text-gray-900">💡 Quick Tip!</p>
          <p className="text-center text-sm text-gray-700 font-medium">
            Rules aren't restrictions - they're agreements that help us all thrive together!
          </p>
        </motion.div>
      )
    },
    {
      id: 4,
      title: "Support Network - We've Got You! 🤗",
      icon: <Phone className="w-12 h-12" />,
      content: (
        <div className="space-y-4">
          <div className="bg-white/95 rounded-xl p-3">
            <h3 className="text-sm font-bold text-center mb-3 text-gray-800">
              🌟 Your Support Squad 🌟
            </h3>
            <div className="grid gap-4">
              {[
                {
                  role: "Key Worker",
                  name: "Your dedicated support person",
                  contact: "Available daily 9am-5pm",
                  icon: <Users className="w-8 h-8 text-blue-500" />,
                  description: "Your main point of contact for planning, goals, and everyday support",
                  color: "from-blue-50 to-indigo-50 border-blue-500"
                },
                {
                  role: "Night Staff",
                  name: "Always here when you need us",
                  contact: "24/7 on-site support",
                  icon: <Shield className="w-8 h-8 text-purple-500" />,
                  description: "Ensuring safety and providing support during evening hours",
                  color: "from-purple-50 to-violet-50 border-purple-500"
                },
                {
                  role: "Manager",
                  name: "Emma Hempsall",
                  contact: "Open door policy",
                  icon: <Award className="w-8 h-8 text-green-500" />,
                  description: "Overall home management and escalated support needs",
                  color: "from-green-50 to-emerald-50 border-green-500"
                },
                {
                  role: "Emergency Contacts",
                  name: "Crisis Support",
                  contact: "999 / Childline: 0800 1111",
                  icon: <Phone className="w-8 h-8 text-red-500" />,
                  description: "Immediate help when you need it most - never hesitate to reach out",
                  color: "from-red-50 to-rose-50 border-red-500"
                }
              ].map((support, idx) => (
                <motion.div
                  key={idx}
                  className={`bg-gradient-to-r ${support.color} rounded-lg p-4 border-l-2`}
                  whileHover={{ scale: 1.02, x: 5 }}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {support.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">{support.role}</h4>
                      <p className="font-semibold text-gray-900">{support.name}</p>
                      <p className="text-sm text-gray-800 mb-2">{support.contact}</p>
                      <p className="text-sm text-gray-900">{support.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ),
      backgroundColor: "bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400",
      textColor: "text-white",
      interactiveElement: (
        <motion.div 
          className="mt-4 bg-white rounded-lg p-4 shadow-lg border border-gray-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg"
            onClick={() => alert("Emergency contact card saved to your phone!")}
          >
            📱 Save Emergency Contacts
          </Button>
        </motion.div>
      )
    }
  ];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  // Reset slide time when changing slides
  useEffect(() => {
    setSlideTime(0);
  }, [currentSlide]);

  const handleNext = () => {
    setCompletedSlides(prev => new Set([...prev, currentSlide]));
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setShowQuiz(false);
      setQuizAnswer(null);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setShowQuiz(false);
      setQuizAnswer(null);
    }
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setQuizAnswer(answerIndex);
    const currentQuiz = slides[currentSlide].quiz;
    if (currentQuiz && answerIndex === currentQuiz.correct) {
      setScore(prev => prev + 10);
    }
    setTimeout(() => {
      setShowQuiz(false);
      handleNext();
    }, 2000);
  };

  const currentSlideData = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;

  return (
    <div className={combineThemeClasses("min-h-screen relative overflow-hidden", okayitTheme.backgrounds.page)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="min-h-screen p-4"
        >
          {/* Header */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-gray-800 hover:bg-gray-200 font-semibold"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Menu
              </Button>
              
              <div className="flex items-center space-x-4">
                <div className="text-gray-700 text-sm font-semibold">
                  ⏱️ {Math.floor(slideTime / 60)}:{(slideTime % 60).toString().padStart(2, '0')}
                </div>
                <Badge variant="secondary" className="bg-purple-600 text-white font-bold">
                  {currentSlide + 1} / {slides.length}
                </Badge>
                <div className="text-gray-700 text-sm font-semibold">
                  🏆 Score: {score}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <Progress value={progress} className="h-2 bg-purple-100" />
            </div>

            {/* Main Content */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center mb-2"
              >
                {currentSlideData.icon}
              </motion.div>
              
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-lg font-black mb-2 text-gray-900"
              >
                {currentSlideData.title}
              </motion.h1>
              
              {currentSlideData.subtitle && (
                <motion.p
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-gray-700 font-semibold"
                >
                  {currentSlideData.subtitle}
                </motion.p>
              )}
            </div>

            {/* Slide Content */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              {currentSlideData.content}
            </motion.div>

            {/* Interactive Element */}
            {currentSlideData.interactiveElement && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {currentSlideData.interactiveElement}
              </motion.div>
            )}

            {/* Quiz Section */}
            {currentSlideData.quiz && (
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={() => setShowQuiz(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Take Quick Quiz
                </Button>
              </motion.div>
            )}
          </div>

          {/* Navigation */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 shadow-md border border-gray-200">
              <Button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                variant="ghost"
                size="sm"
                className="text-gray-800 hover:bg-gray-200 disabled:opacity-50 font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide 
                        ? 'bg-purple-600' 
                        : completedSlides.has(index)
                        ? 'bg-green-500'
                        : 'bg-purple-200'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
              
              <Button
                onClick={handleNext}
                disabled={currentSlide === slides.length - 1}
                variant="ghost"
                size="sm"
                className="text-gray-800 hover:bg-gray-200 disabled:opacity-50 font-bold"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && currentSlideData.quiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-sm font-bold mb-2 text-gray-800 text-center">
                🧠 Quick Knowledge Check
              </h3>
              <p className="text-gray-900 mb-3 text-center">
                {currentSlideData.quiz.question}
              </p>
              
              <div className="space-y-3">
                {currentSlideData.quiz.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      quizAnswer === null
                        ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-900'
                        : quizAnswer === index
                        ? index === currentSlideData.quiz!.correct
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : index === currentSlideData.quiz!.correct
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-gray-50 text-gray-900'
                    }`}
                    disabled={quizAnswer !== null}
                    whileHover={{ scale: quizAnswer === null ? 1.02 : 1 }}
                    whileTap={{ scale: quizAnswer === null ? 0.98 : 1 }}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full border border-current mr-3 flex items-center justify-center text-sm font-bold">
                        {String.fromCharCode(65 + index)}
                      </div>
                      {option}
                      {quizAnswer === index && (
                        <div className="ml-auto">
                          {index === currentSlideData.quiz!.correct ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
              
              {quizAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                >
                  <p className="text-gray-800">
                    {quizAnswer === currentSlideData.quiz.correct 
                      ? "🎉 Correct! Well done!" 
                      : "💪 Keep learning - you've got this!"}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
