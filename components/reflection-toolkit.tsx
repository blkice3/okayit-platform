
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle,
  Heart,
  Brain,
  Lightbulb,
  Book,
  Users,
  Star,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share2,
  ThumbsUp,
  Eye,
  Clock,
  Target,
  Trophy,
  Sparkles,
  Palette,
  Music,
  Camera,
  Mic,
  PenTool,
  FileText,
  Globe,
  Phone,
  Mail,
  ExternalLink,
  Download,
  Play,
  Headphones,
  BookOpen,
  Users2,
  Shield,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  RotateCcw,
  Save,
  Archive,
  Tag,
  Filter,
  Search,
  Calendar,
  MapPin,
  Zap,
  TrendingUp,
  Award,
  Gift,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { trackActivity } from './progress-dashboard-new';
import VoiceInputButton from '@/components/voice-input-button';

interface ReflectionToolkitProps {
  onBack?: () => void;
  context?: 'welcome-guide' | 'stories' | 'family-hub' | 'general';
  currentSection?: string;
}

interface DiscussionCard {
  id: string;
  category: 'personal' | 'relationships' | 'future' | 'feelings' | 'experiences' | 'support';
  title: string;
  question: string;
  followUp: string[];
  difficulty: 'easy' | 'medium' | 'deep';
  ageGroup: '8-12' | '13-15' | '16-18' | 'all';
  icon: any;
  color: string;
}

interface ReflectionActivity {
  id: string;
  title: string;
  description: string;
  type: 'writing' | 'creative' | 'discussion' | 'mindfulness' | 'goal-setting' | 'self-care';
  duration: string;
  materials: string[];
  steps: string[];
  outcomes: string[];
  icon: any;
  color: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'website' | 'book' | 'video' | 'app' | 'helpline' | 'activity';
  category: 'support' | 'education' | 'wellbeing' | 'creative' | 'social' | 'emergency';
  ageAppropriate: string[];
  url?: string;
  phone?: string;
  trusted: boolean;
  icon: any;
  color: string;
}

export default function ReflectionToolkit({ onBack, context = 'general', currentSection }: ReflectionToolkitProps) {
  const [activeTab, setActiveTab] = useState('discussions');
  const [selectedCard, setSelectedCard] = useState<DiscussionCard | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ReflectionActivity | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [userResponses, setUserResponses] = useState<{ [key: string]: string }>({});
  const [savedReflections, setSavedReflections] = useState<string[]>([]);
  const [moodTracker, setMoodTracker] = useState<{ [key: string]: number }>({});
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [favoriteResources, setFavoriteResources] = useState<string[]>([]);
  const [currentMood, setCurrentMood] = useState<number>(5);
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAge, setFilterAge] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('reflectionToolkit');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserResponses(parsed.userResponses || {});
        setSavedReflections(parsed.savedReflections || []);
        setMoodTracker(parsed.moodTracker || {});
        setCompletedActivities(parsed.completedActivities || []);
        setFavoriteResources(parsed.favoriteResources || []);
      } catch (e) {
        console.log('Could not load saved reflection data');
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    const dataToSave = {
      userResponses,
      savedReflections,
      moodTracker,
      completedActivities,
      favoriteResources
    };
    localStorage.setItem('reflectionToolkit', JSON.stringify(dataToSave));
  }, [userResponses, savedReflections, moodTracker, completedActivities, favoriteResources]);

  const discussionCards: DiscussionCard[] = [
    {
      id: 'identity-1',
      category: 'personal',
      title: 'Who Am I?',
      question: 'What are three things that make you uniquely you?',
      followUp: [
        'What are your strongest qualities?',
        'What would your best friend say about you?',
        'What are you most proud of about yourself?'
      ],
      difficulty: 'easy',
      ageGroup: 'all',
      icon: Star,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'feelings-1',
      category: 'feelings',
      title: 'Emotional Check-in',
      question: 'How are you really feeling today, beneath the surface?',
      followUp: [
        'What emotions have you been carrying this week?',
        'What would help you feel better right now?',
        'Who can you talk to when you feel this way?'
      ],
      difficulty: 'medium',
      ageGroup: 'all',
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'future-1',
      category: 'future',
      title: 'Dream Big',
      question: 'If you could wake up tomorrow with any superpower, what would it be and why?',
      followUp: [
        'What would you do with this power to help others?',
        'What real-world skills could give you similar abilities?',
        'What steps could you take today toward this dream?'
      ],
      difficulty: 'easy',
      ageGroup: '8-12',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'relationships-1',
      category: 'relationships',
      title: 'Connection Matters',
      question: 'Who makes you feel most like yourself when you\'re with them?',
      followUp: [
        'What qualities do they have that you appreciate?',
        'How do you show care for the people important to you?',
        'What kind of friend do you want to be?'
      ],
      difficulty: 'medium',
      ageGroup: 'all',
      icon: Users,
      color: 'from-green-500 to-blue-500'
    },
    {
      id: 'support-1',
      category: 'support',
      title: 'My Support Network',
      question: 'Who are the adults in your life you can trust?',
      followUp: [
        'What makes someone trustworthy to you?',
        'How do you know when you need help?',
        'What would make it easier for you to ask for support?'
      ],
      difficulty: 'deep',
      ageGroup: 'all',
      icon: Shield,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'experiences-1',
      category: 'experiences',
      title: 'Overcoming Challenges',
      question: 'Think of a time you faced something difficult. What helped you get through it?',
      followUp: [
        'What did you learn about yourself from that experience?',
        'What would you tell another young person facing something similar?',
        'What strengths did you discover you had?'
      ],
      difficulty: 'deep',
      ageGroup: '16-18',
      icon: Trophy,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'personal-2',
      category: 'personal',
      title: 'Values & Beliefs',
      question: 'What matters most to you in life?',
      followUp: [
        'Where do these values come from?',
        'How do your values guide your decisions?',
        'How do you stay true to yourself?'
      ],
      difficulty: 'deep',
      ageGroup: '16-18',
      icon: Navigation,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'feelings-2',
      category: 'feelings',
      title: 'Managing Big Emotions',
      question: 'When you feel overwhelmed, what helps you calm down?',
      followUp: [
        'What are your warning signs when emotions get too big?',
        'Who taught you your coping strategies?',
        'What would you like to try next time you feel this way?'
      ],
      difficulty: 'medium',
      ageGroup: 'all',
      icon: Brain,
      color: 'from-teal-500 to-green-500'
    }
  ];

  const reflectionActivities: ReflectionActivity[] = [
    {
      id: 'gratitude-journal',
      title: 'Gratitude Snapshot',
      description: 'Capture three things you\'re grateful for today and why they matter to you.',
      type: 'writing',
      duration: '10 minutes',
      materials: ['Paper/Phone', 'Pen or app'],
      steps: [
        'Find a quiet, comfortable space',
        'Think about your day so far',
        'Write down 3 things you\'re grateful for',
        'For each item, write 1-2 sentences about why it matters',
        'Notice how you feel after writing'
      ],
      outcomes: ['Improved mood', 'Better perspective', 'Increased awareness of positives'],
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'future-self-letter',
      title: 'Letter to Future Me',
      description: 'Write a letter to yourself one year from now.',
      type: 'writing',
      duration: '20 minutes',
      materials: ['Paper', 'Pen', 'Envelope (optional)'],
      steps: [
        'Imagine yourself one year from today',
        'Write about your current hopes and dreams',
        'Share what you\'re learning about yourself',
        'Include advice you\'d want to remember',
        'Seal it to open next year (or save digitally)'
      ],
      outcomes: ['Goal clarity', 'Self-awareness', 'Time capsule of growth'],
      icon: Mail,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'strengths-collage',
      title: 'My Strengths Collage',
      description: 'Create a visual representation of your unique strengths and abilities.',
      type: 'creative',
      duration: '30 minutes',
      materials: ['Magazines/printed images', 'Scissors', 'Glue', 'Large paper', 'Markers'],
      steps: [
        'Think about your strengths and positive qualities',
        'Look for images and words that represent these qualities',
        'Cut out anything that resonates with you',
        'Arrange them on paper in a way that feels right',
        'Add your own words or drawings',
        'Display somewhere you\'ll see it regularly'
      ],
      outcomes: ['Visual reminder of strengths', 'Increased self-confidence', 'Creative expression'],
      icon: Palette,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'mindful-moment',
      title: '5-4-3-2-1 Grounding',
      description: 'A quick mindfulness exercise to bring you into the present moment.',
      type: 'mindfulness',
      duration: '5 minutes',
      materials: ['Just yourself'],
      steps: [
        'Find a comfortable position, sitting or standing',
        'Take three deep breaths',
        'Name 5 things you can see',
        'Name 4 things you can touch or feel',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste',
        'Take three more deep breaths'
      ],
      outcomes: ['Reduced anxiety', 'Present-moment awareness', 'Calm focus'],
      icon: Brain,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'support-map',
      title: 'My Support Network Map',
      description: 'Create a visual map of all the people who support you.',
      type: 'goal-setting',
      duration: '25 minutes',
      materials: ['Large paper', 'Colored pens/pencils'],
      steps: [
        'Draw yourself in the center of the page',
        'Around you, write the names of people who support you',
        'Use different colors for different types of support',
        'Draw lines connecting you to each person',
        'Add what each person helps you with',
        'Notice any gaps where you might want more support'
      ],
      outcomes: ['Awareness of support system', 'Appreciation for relationships', 'Identification of support needs'],
      icon: Users2,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'worry-box',
      title: 'Worry Box Exercise',
      description: 'A technique for managing worries and anxious thoughts.',
      type: 'self-care',
      duration: '15 minutes',
      materials: ['Small box or container', 'Small pieces of paper', 'Pen'],
      steps: [
        'Decorate a small box as your "worry box"',
        'When you have a worry, write it on a small piece of paper',
        'Fold the paper and put it in the box',
        'Tell yourself "I\'ve given this worry to my box"',
        'Set aside time once a week to review your worries',
        'Notice which ones resolved themselves'
      ],
      outcomes: ['Worry management', 'Reduced rumination', 'Perspective on problems'],
      icon: Archive,
      color: 'from-gray-500 to-slate-500'
    }
  ];

  const resources: Resource[] = [
    {
      id: 'childline',
      title: 'Childline',
      description: 'Free, confidential support for young people under 19. Available 24/7.',
      type: 'helpline',
      category: 'support',
      ageAppropriate: ['8-12', '13-15', '16-18'],
      phone: '0800 1111',
      url: 'https://www.childline.org.uk',
      trusted: true,
      icon: Phone,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'young-minds',
      title: 'YoungMinds',
      description: 'Mental health support and information specifically for young people.',
      type: 'website',
      category: 'wellbeing',
      ageAppropriate: ['13-15', '16-18'],
      url: 'https://www.youngminds.org.uk',
      trusted: true,
      icon: Brain,
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'mix',
      title: 'The Mix',
      description: 'Support for under-25s including crisis messenger and webchat.',
      type: 'website',
      category: 'support',
      ageAppropriate: ['16-18'],
      url: 'https://www.themix.org.uk',
      phone: '0808 808 4994',
      trusted: true,
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'samaritans',
      title: 'Samaritans',
      description: 'Free emotional support for anyone in distress. Available 24/7.',
      type: 'helpline',
      category: 'emergency',
      ageAppropriate: ['all'],
      phone: '116 123',
      url: 'https://www.samaritans.org',
      trusted: true,
      icon: Heart,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'headspace-teens',
      title: 'Headspace for Teens',
      description: 'Meditation and mindfulness app designed specifically for teenagers.',
      type: 'app',
      category: 'wellbeing',
      ageAppropriate: ['13-15', '16-18'],
      url: 'https://www.headspace.com/teens',
      trusted: true,
      icon: Sparkles,
      color: 'from-teal-500 to-green-500'
    },
    {
      id: 'kooth',
      title: 'Kooth',
      description: 'Free online counselling and emotional well-being platform for young people.',
      type: 'website',
      category: 'support',
      ageAppropriate: ['13-15', '16-18'],
      url: 'https://www.kooth.com',
      trusted: true,
      icon: Users,
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'who-cares-scotland',
      title: 'Who Cares? Scotland',
      description: 'Support and advocacy for care-experienced young people in Scotland.',
      type: 'website',
      category: 'support',
      ageAppropriate: ['all'],
      url: 'https://www.whocaresscotland.org',
      trusted: true,
      icon: Shield,
      color: 'from-blue-500 to-green-500'
    },
    {
      id: 'care-leavers-association',
      title: 'Care Leavers Association',
      description: 'Support network for people who have experienced care.',
      type: 'website',
      category: 'support',
      ageAppropriate: ['16-18'],
      url: 'https://careleavers.com',
      trusted: true,
      icon: Users2,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handleSaveResponse = (cardId: string, response: string) => {
    setUserResponses(prev => ({ ...prev, [cardId]: response }));
    
    // Track reflection activity
    const card = discussionCards.find(c => c.id === cardId);
    if (card) {
      trackActivity('reflection', {
        id: cardId,
        type: card.category,
        duration: 5 // Estimated time for reflection
      });
    }
  };

  const handleCompleteActivity = (activityId: string) => {
    if (!completedActivities.includes(activityId)) {
      setCompletedActivities(prev => [...prev, activityId]);
      
      // Track completion
      const activity = reflectionActivities.find((a: ReflectionActivity) => a.id === activityId);
      if (activity) {
        trackActivity('reflection', {
          id: activityId,
          type: activity.type,
          duration: parseInt(activity.duration.replace(' mins', '')) || 10
        });
      }
    }
  };

  const handleToggleFavoriteResource = (resourceId: string) => {
    setFavoriteResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const filteredCards = discussionCards.filter(card => {
    const categoryMatch = filterCategory === 'all' || card.category === filterCategory;
    const ageMatch = filterAge === 'all' || card.ageGroup === filterAge || card.ageGroup === 'all';
    const searchMatch = searchTerm === '' || 
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.question.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && ageMatch && searchMatch;
  });

  const filteredActivities = reflectionActivities.filter(activity => {
    const searchMatch = searchTerm === '' || 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  const filteredResources = resources.filter(resource => {
    const categoryMatch = filterCategory === 'all' || resource.category === filterCategory;
    const searchMatch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Compact Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {onBack && (
            <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold hover:text-purple-800 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Menu
            </button>
          )}
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-pink-600" />
            <span className="text-sm font-bold text-gray-900">Reflection Space</span>
          </div>
          {/* Mood Check-in */}
          <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
            <DialogTrigger asChild>
              <button className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                Mood
              </button>
            </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Daily Mood Check-in</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="text-center">
                    <p className="text-gray-900 mb-4">How would you rate your mood today?</p>
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="text-center">
                        <Frown className="w-8 h-8 mx-auto text-red-500 mb-1" />
                        <span className="text-xs">Low</span>
                      </div>
                      <div className="text-center">
                        <Meh className="w-8 h-8 mx-auto text-yellow-500 mb-1" />
                        <span className="text-xs">Okay</span>
                      </div>
                      <div className="text-center">
                        <Smile className="w-8 h-8 mx-auto text-green-500 mb-1" />
                        <span className="text-xs">Good</span>
                      </div>
                    </div>
                    <Slider
                      value={[currentMood]}
                      onValueChange={(value) => setCurrentMood(value[0])}
                      max={10}
                      min={1}
                      step={1}
                      className="mb-4"
                    />
                    <p className="text-sm text-gray-900">
                      Current mood: {currentMood}/10
                    </p>
                  </div>
                  <Button 
                    onClick={() => {
                      const today = new Date().toDateString();
                      setMoodTracker(prev => ({ ...prev, [today]: currentMood }));
                      setShowMoodDialog(false);
                    }}
                    className="w-full"
                  >
                    Save Mood Check-in
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Search and Filters */}
        <div className="mb-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search discussions, activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm border border-gray-200 rounded-lg"
            />
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filterCategory === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterAge('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${filterAge === 'all' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
            >
              All Ages
            </button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 h-9">
            <TabsTrigger value="discussions" className="flex items-center gap-1.5 text-xs font-bold">
              <MessageCircle className="w-3.5 h-3.5" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-1.5 text-xs font-bold">
              <PenTool className="w-3.5 h-3.5" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1.5 text-xs font-bold">
              <Globe className="w-3.5 h-3.5" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* Discussion Cards Tab */}
          <TabsContent value="discussions" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map((card) => {
                const Icon = card.icon;
                const hasResponse = userResponses[card.id];
                return (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="cursor-pointer bg-white/80 backdrop-blur-sm border-2 hover:border-purple-200 transition-all duration-300 h-full"
                      onClick={() => setSelectedCard(card)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={card.difficulty === 'easy' ? 'secondary' : card.difficulty === 'medium' ? 'default' : 'destructive'}>
                              {card.difficulty}
                            </Badge>
                            {hasResponse && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-900 text-sm mb-4">
                          {card.question}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-900">
                          <Badge variant="outline" className="text-xs">
                            {card.category}
                          </Badge>
                          <span>{card.ageGroup}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredActivities.map((activity) => {
                const Icon = activity.icon;
                const isCompleted = completedActivities.includes(activity.id);
                return (
                  <motion.div
                    key={activity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="cursor-pointer bg-white/80 backdrop-blur-sm border-2 hover:border-purple-200 transition-all duration-300"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${activity.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{activity.type}</Badge>
                            {isCompleted && <Trophy className="w-4 h-4 text-yellow-500" />}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-900 text-sm mb-4">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-900">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {activity.duration}
                          </div>
                          <Badge variant="secondary">{activity.outcomes.length} outcomes</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const Icon = resource.icon;
                const isFavorite = favoriteResources.includes(resource.id);
                return (
                  <motion.div
                    key={resource.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="bg-white/80 backdrop-blur-sm border-2 hover:border-purple-200 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${resource.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                            {resource.trusted && <Shield className="w-4 h-4 text-green-500" />}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFavoriteResource(resource.id)}
                            >
                              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-900'}`} />
                            </Button>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-900 text-sm mb-4">
                          {resource.description}
                        </p>
                        <div className="space-y-2">
                          {resource.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-green-500" />
                              <span className="font-mono">{resource.phone}</span>
                            </div>
                          )}
                          {resource.url && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-2" />
                              Visit Website
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4 text-xs text-gray-900">
                          <Badge variant="outline">{resource.category}</Badge>
                          <Badge variant="secondary">{resource.type}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Discussion Card Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCard && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedCard.color} flex items-center justify-center`}>
                    <selectedCard.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedCard.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedCard.category}</Badge>
                      <Badge variant={selectedCard.difficulty === 'easy' ? 'secondary' : selectedCard.difficulty === 'medium' ? 'default' : 'destructive'}>
                        {selectedCard.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 text-purple-900">Main Question</h3>
                    <p className="text-purple-800 text-lg">{selectedCard.question}</p>
                  </CardContent>
                </Card>

                {selectedCard.followUp.length > 0 && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3 text-blue-900">Follow-up Questions</h3>
                      <ul className="space-y-2">
                        {selectedCard.followUp.map((question, index) => (
                          <li key={index} className="flex items-start gap-2 text-blue-800">
                            <ChevronRight className="w-4 h-4 mt-1 flex-shrink-0" />
                            {question}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">Your Thoughts <VoiceInputButton onTranscript={(t) => handleSaveResponse(selectedCard.id, (userResponses[selectedCard.id] || '') + (userResponses[selectedCard.id] ? ' ' : '') + t)} /></h3>
                  <Textarea
                    placeholder="Take your time to think and write your response... (or tap 🎤 to speak)"
                    value={userResponses[selectedCard.id] || ''}
                    onChange={(e) => handleSaveResponse(selectedCard.id, e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-xs text-gray-900 mt-2">
                    Your responses are saved automatically and kept private.
                  </p>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCard(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      if (userResponses[selectedCard.id]) {
                        // Show success message
                        setSelectedCard(null);
                      }
                    }}
                    disabled={!userResponses[selectedCard.id]}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Reflection
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Activity Modal */}
      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedActivity && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedActivity.color} flex items-center justify-center`}>
                    <selectedActivity.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedActivity.title}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{selectedActivity.type}</Badge>
                      <Badge variant="secondary">{selectedActivity.duration}</Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <p className="text-gray-900 text-lg">{selectedActivity.description}</p>

                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 text-yellow-900 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      You'll Need
                    </h3>
                    <ul className="space-y-1">
                      {selectedActivity.materials.map((material, index) => (
                        <li key={index} className="flex items-center gap-2 text-yellow-800">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          {material}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 text-green-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Step-by-Step Guide
                    </h3>
                    <ol className="space-y-2">
                      {selectedActivity.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-3 text-green-800">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 text-purple-900 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      What You'll Gain
                    </h3>
                    <ul className="space-y-1">
                      {selectedActivity.outcomes.map((outcome, index) => (
                        <li key={index} className="flex items-center gap-2 text-purple-800">
                          <Star className="w-4 h-4 text-purple-500" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedActivity(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      handleCompleteActivity(selectedActivity.id);
                      setSelectedActivity(null);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
