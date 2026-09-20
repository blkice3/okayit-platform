
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  ArrowRight,
  Home,
  Shield,
  Clock,
  Users,
  Utensils,
  Bed,
  Car,
  Heart,
  BookOpen,
  Phone,
  Coins,
  MessageCircle,
  Scale,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { HomeContext } from '@/lib/home-contexts';
import { winchesterWelcomeSlides } from '@/lib/winchester-content';
import { kingsnorthWelcomeSlides } from '@/lib/kingsnorth-content';

interface WelcomeGuideProps {
  onBack: () => void;
  currentHome: HomeContext;
}

const claudiusWelcomeSlides = [
  {
    id: 1,
    title: "Welcome to Claudius",
    icon: Home,
    gradient: "from-purple-500 to-pink-500",
    content: {
      heading: "Hi there! 👋",
      text: "Welcome to Claudius, your new home away from home. We know moving can be tough, so we've made this guide just for you to help you settle in smoothly."
    }
  },
  {
    id: 2,
    title: "About Our Home",
    icon: Home,
    gradient: "from-blue-500 to-cyan-500",
    content: {
      heading: "🏡 Your New Home",
      text: "Claudius is a cozy home for up to two young people aged 8-18. We're based in North Hykeham, Lincoln, near parks, cinemas, trampoline parks, and more. Our home is full of friendly adults who care and are here to support you."
    }
  },
  {
    id: 3,
    title: "Moving In",
    icon: Users,
    gradient: "from-green-500 to-emerald-500",
    content: {
      heading: "🛏️ Making It Yours",
      text: "If you haven't visited yet, you'll get a tour, meet the team, and settle into your new room. You can even help personalise your space! We'll talk about feelings, routines, and house expectations together."
    }
  },
  {
    id: 4,
    title: "Safety First",
    icon: Shield,
    gradient: "from-red-500 to-orange-500",
    content: {
      heading: "🧯 Staying Safe",
      text: "We do regular fire drills for your safety. The doors lock from outside, but inside, you can twist the locks to get out quickly. Always tell an adult if something doesn't feel right."
    }
  },
  {
    id: 5,
    title: "House Rules & Expectations",
    icon: BookOpen,
    gradient: "from-purple-500 to-indigo-500",
    content: {
      heading: "🧒 Simple Rules",
      text: "We have simple rules to help everyone feel safe and respected. These will be explained when you move in, and they're here for your benefit."
    }
  },
  {
    id: 6,
    title: "Rewards & Consequences",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    content: {
      heading: "🎉 Celebrating You",
      text: "Good choices and achievements are celebrated! Think movie nights, takeaways, fun trips, or even saving for something special."
    }
  },
  {
    id: 7,
    title: "Mealtimes & Health",
    icon: Utensils,
    gradient: "from-orange-500 to-yellow-500",
    content: {
      heading: "🍽️ Eating Together",
      text: "We eat together, share chores, and plan menus as a team. Fruit and snacks are always available! If you have allergies or dietary needs, we've got you covered.\n\n🩺 You'll be registered with a local doctor, dentist, and optician. Adults give out all medications safely."
    }
  },
  {
    id: 8,
    title: "Sleep & Routines",
    icon: Bed,
    gradient: "from-indigo-500 to-purple-500",
    content: {
      heading: "😴 Rest & Recovery",
      text: "Sleep helps you grow and feel good! We'll agree on a bedtime that suits your age, and maybe extend it for great behaviour. Struggling to sleep? We've got calming routines and support to help."
    }
  },
  {
    id: 9,
    title: "Getting Around",
    icon: Car,
    gradient: "from-teal-500 to-green-500",
    content: {
      heading: "🚗 Going Places",
      text: "We've got a car to take you to appointments, school, or fun stuff. Leaving the house always needs permission, your safety comes first."
    }
  },
  {
    id: 10,
    title: "Bullying & Respect",
    icon: Shield,
    gradient: "from-red-500 to-pink-500",
    content: {
      heading: "🚫 Zero Tolerance",
      text: "No bullying, no discrimination. Ever. We respect who you are, your culture, your language, and your religion. If something worries you, speak to an adult straight away."
    }
  },
  {
    id: 11,
    title: "Fun, Hobbies & Education",
    icon: BookOpen,
    gradient: "from-cyan-500 to-blue-500",
    content: {
      heading: "🏊 Explore & Learn",
      text: "Got a hobby or something you want to try? Let us know, we'll make it happen! Swimming, art, sports, local clubs, you name it. Education's important and required. We'll support you wherever you study."
    }
  },
  {
    id: 12,
    title: "Your Keyworker & Care Team",
    icon: Users,
    gradient: "from-violet-500 to-purple-500",
    content: {
      heading: "🗂️ Your Support Team",
      text: "You'll have a keyworker, and you can choose a second one too! They'll check in weekly and help with goals, plans, and anything you need."
    }
  },
  {
    id: 13,
    title: "Culture, Faith & Identity",
    icon: Heart,
    gradient: "from-emerald-500 to-teal-500",
    content: {
      heading: "🛐 Being You",
      text: "We support your beliefs, background, and identity. Need special food, skin, or hair products? We've got you. Want to attend a place of worship? Just say the word."
    }
  },
  {
    id: 14,
    title: "Meetings & Your Voice",
    icon: MessageCircle,
    gradient: "from-yellow-500 to-orange-500",
    content: {
      heading: "📋 Having Your Say",
      text: "You'll join monthly residents' meetings to share your thoughts and help shape the home. You can even take notes or lead discussions if you'd like!"
    }
  },
  {
    id: 15,
    title: "Phones & Contacting Family",
    icon: Phone,
    gradient: "from-blue-500 to-indigo-500",
    content: {
      heading: "📱 Staying Connected",
      text: "With permission, you can keep a mobile phone. We also have a landline for private calls. We'll store numbers safely so you don't lose touch with the people who matter."
    }
  },
  {
    id: 16,
    title: "Pocket Money & Shopping",
    icon: Coins,
    gradient: "from-green-500 to-yellow-500",
    content: {
      heading: "💷 Your Money",
      text: "Every Saturday = pocket money day! Tidy your room and it's yours. You'll also get a weekly allowance for clothes and toiletries, with help from adults."
    }
  },
  {
    id: 17,
    title: "Complaints & Speaking Up",
    icon: MessageCircle,
    gradient: "from-red-500 to-orange-500",
    content: {
      heading: "💬 Your Voice Matters",
      text: "If something's wrong, you can talk to:\n• An adult at Claudius\n• Your social worker\n• Your advocate\n• Childline: 0800 1111\n• NSPCC: 0800 800 5000\n• The Children's Commissioner"
    }
  },
  {
    id: 18,
    title: "What's an Advocate?",
    icon: Scale,
    gradient: "from-purple-500 to-pink-500",
    content: {
      heading: "🧑‍⚖️ Your Champion",
      text: "An advocate helps you speak up and understand your rights. They're on your side, but won't tell you what to do. Ask an adult or your social worker if you'd like one."
    }
  },
  {
    id: 19,
    title: "You're Welcome Here!",
    icon: Heart,
    gradient: "from-pink-500 to-purple-500",
    content: {
      heading: "🎉 Final Word",
      text: "We're excited to get to know you. Claudius is your space to feel safe, grow, and shine. Let's make this a great chapter in your story."
    }
  }
];

export default function WelcomeGuide({ onBack, currentHome }: WelcomeGuideProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get the appropriate slides based on the current home
  const getGuideSlidesForHome = (homeId: string) => {
    switch (homeId) {
      case 'winchester':
        return winchesterWelcomeSlides;
      case 'kingsnorth':
        return kingsnorthWelcomeSlides;
      default:
        return claudiusWelcomeSlides;
    }
  };
  
  const guideSlides = getGuideSlidesForHome(currentHome.id);
  
  const slide = guideSlides[currentSlide];
  const Icon = slide.icon;
  const progress = ((currentSlide + 1) / guideSlides.length) * 100;

  const nextSlide = () => {
    if (currentSlide < guideSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (currentSlide < guideSlides.length - 1) {
          setCurrentSlide(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="flex items-center gap-2 hover:bg-purple-100"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Menu
            </Button>
            
            <div className="text-center">
              <h1 className={`text-xl font-bold bg-gradient-to-r ${currentHome.theme.gradient.replace('500', '600')} bg-clip-text text-transparent`}>
                Welcome Guide to {currentHome.fullName}
              </h1>
              <p className="text-sm text-gray-900">
                Slide {currentSlide + 1} of {guideSlides.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Auto Play'}
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Video Introduction */}
            {currentSlide === 0 && (
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg min-h-[500px] flex flex-col mb-8">
                <CardHeader className="text-center pb-6">
                  <div className={`w-20 h-20 bg-gradient-to-r ${currentHome.theme.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                    <Play className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to {currentHome.fullName}
                  </CardTitle>
                  <Badge variant="outline" className="mx-auto">
                    Video Introduction
                  </Badge>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col items-center justify-center text-center space-y-6">
                  <p className="text-lg text-gray-900 mb-4">
                    Watch this special welcome video to get to know {currentHome.fullName} better!
                  </p>
                  
                  {/* Embedded Video */}
                  <div className="w-full max-w-2xl aspect-video">
                    <iframe
                      src={currentHome.welcomeVideoUrl}
                      title={`Welcome to ${currentHome.fullName}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <p className="text-gray-900">
                    After watching the video, continue through the guide for detailed information about your new home.
                  </p>
                </CardContent>
              </Card>
            )}
            
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg min-h-[500px] flex flex-col">
              <CardHeader className="text-center pb-6">
                <div className={`w-20 h-20 bg-gradient-to-r ${slide.gradient} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {slide.title}
                </CardTitle>
                <Badge variant="outline" className="mx-auto">
                  Step {currentSlide + 1}
                </Badge>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-center">
                <div className="text-center space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {slide.content.heading}
                  </h3>
                  <div className="text-lg text-gray-900 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                    {slide.content.text}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-8">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex gap-2 flex-wrap justify-center">
            {guideSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-purple-500 scale-125'
                    : index < currentSlide
                    ? 'bg-green-400'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            disabled={currentSlide === guideSlides.length - 1}
            variant="outline"
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {guideSlides.map((slideItem, index) => {
            const SlideIcon = slideItem.icon;
            return (
              <button
                key={slideItem.id}
                onClick={() => goToSlide(index)}
                className={`p-3 rounded-lg text-left transition-all duration-200 ${
                  index === currentSlide
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : index < currentSlide
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                }`}
              >
                <SlideIcon className="w-5 h-5 mb-1" />
                <p className="text-xs font-medium truncate">{slideItem.title}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
