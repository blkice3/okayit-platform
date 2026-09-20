
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Smile, Frown, Meh, CloudRain, Sun, Cloud,
  ArrowLeft, CheckCircle2, Sparkles, Phone, MessageCircle,
  Music, Palette, BookOpen, Wind, Activity, Users, Headphones,
  Video, Coffee, Star, TrendingUp, Calendar, AlertCircle,
  Lightbulb, Target, Zap, Shield, Brain, Eye, Clock, Gauge,
  Mic, Square, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { okayitTheme, combineThemeClasses, tikTokTransitions } from '@/lib/okayit-theme';
import { toast } from 'sonner';
import { trackActivity } from './progress-dashboard-new';
import { useUserContext } from '@/hooks/use-user-context';
import CelebrationMoment from '@/components/celebration-moment';
import { useMoodResponse } from '@/lib/mood-response';

// Helper functions for clickable contacts
const createPhoneLink = (phone: string) => {
  const cleanPhone = phone.replace(/\s|-/g, ''); // Remove spaces and dashes
  return `tel:${cleanPhone}`;
};

const createSmsLink = (textLine: string) => {
  // Parse text line like "Text SHOUT to 85258"
  const match = textLine.match(/(?:Text|text)\s+(\w+)\s+to\s+(\d+)/i);
  if (match) {
    const [, message, number] = match;
    return `sms:${number}?body=${encodeURIComponent(message)}`;
  }
  const numberMatch = textLine.match(/(\d+)/);
  if (numberMatch) {
    return `sms:${numberMatch[1]}`;
  }
  return null;
};

interface DailyWellbeingCheckInProps {
  onBack?: () => void;
  user?: any;
  onNavigateToSupport?: () => void;
  onNavigateToResources?: () => void;
  onNavigateToReflection?: () => void;
}

interface WellbeingHistory {
  date: string;
  mood: string;
  moodLevel: number;
  note?: string;
  timestamp: string;
}

const moodLevels = [
  {
    id: 'amazing',
    level: 5,
    label: 'Amazing',
    emoji: '😄',
    color: 'from-green-400 to-emerald-500',
    bgColor: 'bg-green-100 border-green-400',
    textColor: 'text-green-700',
    icon: Smile,
    message: 'Brilliant! You are feeling fantastic today!',
    subtitle: 'Keep riding this positive wave'
  },
  {
    id: 'good',
    level: 4,
    label: 'Good',
    emoji: '🙂',
    color: 'from-lime-400 to-green-400',
    bgColor: 'bg-lime-100 border-lime-400',
    textColor: 'text-lime-700',
    icon: Sun,
    message: 'Great! You are feeling pretty good today!',
    subtitle: 'Things are looking positive'
  },
  {
    id: 'okay',
    level: 3,
    label: 'Okay',
    emoji: '😐',
    color: 'from-yellow-400 to-amber-400',
    bgColor: 'bg-yellow-100 border-yellow-400',
    textColor: 'text-yellow-700',
    icon: Meh,
    message: 'That is okay! Not every day can be perfect.',
    subtitle: 'Let us find some things to lift your mood'
  },
  {
    id: 'struggling',
    level: 2,
    label: 'Struggling',
    emoji: '😔',
    color: 'from-orange-400 to-red-400',
    bgColor: 'bg-orange-100 border-orange-400',
    textColor: 'text-orange-700',
    icon: Cloud,
    message: 'I hear you. Some days are harder than others.',
    subtitle: 'Here are some things that might help'
  },
  {
    id: 'really-low',
    level: 1,
    label: 'Really Low',
    emoji: '😢',
    color: 'from-red-400 to-rose-500',
    bgColor: 'bg-red-100 border-red-400',
    textColor: 'text-red-700',
    icon: CloudRain,
    message: 'Your feelings matter and you are not alone.',
    subtitle: 'Let us get you some support right now'
  }
];

// Comprehensive mood-specific coping strategies
const copingStrategies = {
  immediate: [ // For any mood level - quick relief
    {
      id: 'breathing-box',
      title: 'Box Breathing',
      description: 'Calm your nervous system in under 2 minutes',
      icon: Wind,
      color: 'blue',
      type: 'technique',
      minMood: 1,
      content: 'Breathe IN for 4 counts, HOLD for 4, breathe OUT for 4, HOLD for 4. Repeat 5-10 times. This activates your calm response.'
    },
    {
      id: 'grounding-54321',
      title: '5-4-3-2-1 Grounding',
      description: 'Anchor yourself in the present moment',
      icon: Target,
      color: 'green',
      type: 'technique',
      minMood: 1,
      content: 'Name 5 things you SEE, 4 you can TOUCH, 3 you HEAR, 2 you SMELL, 1 you TASTE. This stops racing thoughts.'
    },
    {
      id: 'cold-water',
      title: 'Cold Water Reset',
      description: 'Instant physical relief from overwhelming feelings',
      icon: Zap,
      color: 'blue',
      type: 'technique',
      minMood: 1,
      content: 'Splash cold water on your face or hold an ice cube. This triggers a calming reflex in your body.'
    }
  ],
  crisis: [ // For really low moods - immediate support
    {
      id: 'talk-keyworker',
      title: 'Talk to Your Key Worker',
      description: 'Someone who knows you and can help right now',
      icon: Heart,
      color: 'pink',
      type: 'support',
      minMood: 1,
      content: 'Your key worker is here for you. Find them now or ask any staff member to get them for you.'
    },
    {
      id: 'crisis-helpline',
      title: 'Call a Crisis Helpline',
      description: 'Trained people ready to listen 24/7',
      icon: Phone,
      color: 'orange',
      type: 'support',
      minMood: 1,
      content: 'Click to contact: Childline at 0800-1111 or text SHOUT to 85258. They understand and can help you through this.',
      phone: '0800-1111',
      textLine: 'Text SHOUT to 85258'
    },
    {
      id: 'safety-plan',
      title: 'Use Your Safety Plan',
      description: 'Follow the steps you planned for hard moments',
      icon: Shield,
      color: 'purple',
      type: 'support',
      minMood: 1,
      content: 'Check your safety plan or ask staff to help you create one. It reminds you of what helps when things are really tough.'
    }
  ],
  emotional: [ // For processing feelings
    {
      id: 'emotion-naming',
      title: 'Name Your Feelings',
      description: 'Put words to what you are experiencing',
      icon: Brain,
      color: 'purple',
      type: 'technique',
      minMood: 2,
      content: 'Ask yourself: What exactly am I feeling? (Sad, angry, scared, lonely, overwhelmed?) Naming emotions reduces their intensity.'
    },
    {
      id: 'journaling',
      title: 'Write It Out',
      description: 'Express thoughts without judgment',
      icon: BookOpen,
      color: 'blue',
      type: 'activity',
      minMood: 2,
      content: 'Write freely for 10 minutes. Do not worry about grammar or making sense. Just let it out. Burn or keep it - your choice.'
    },
    {
      id: 'cry-it-out',
      title: 'Let Yourself Cry',
      description: 'Crying releases stress hormones',
      icon: CloudRain,
      color: 'blue',
      type: 'technique',
      minMood: 1,
      content: 'Find a private space and let it out. Crying is not weakness - it is your body healing. You will feel lighter afterward.'
    }
  ],
  physical: [ // For releasing physical tension
    {
      id: 'movement',
      title: 'Move Your Body',
      description: 'Release built-up energy and tension',
      icon: Activity,
      color: 'green',
      type: 'activity',
      minMood: 2,
      content: 'Go for a walk, dance to music, do jumping jacks, or stretch. Physical movement changes your emotional state.'
    },
    {
      id: 'progressive-relaxation',
      title: 'Progressive Muscle Relaxation',
      description: 'Release tension you are holding',
      icon: Activity,
      color: 'purple',
      type: 'technique',
      minMood: 2,
      content: 'Tense each muscle group for 5 seconds, then release. Start with toes, move up to head. Notice the difference between tension and relaxation.'
    },
    {
      id: 'sensory-comfort',
      title: 'Sensory Comfort',
      description: 'Soothe yourself with pleasant sensations',
      icon: Heart,
      color: 'pink',
      type: 'activity',
      minMood: 2,
      content: 'Wrap in a soft blanket, hold something warm, listen to calming sounds, smell something nice. Comfort your senses.'
    }
  ],
  creative: [ // For expression and distraction
    {
      id: 'art-expression',
      title: 'Create Something',
      description: 'Express yourself through art',
      icon: Palette,
      color: 'pink',
      type: 'activity',
      minMood: 2,
      content: 'Draw, paint, color, sculpt - anything creative. Do not judge the result. The process is what matters.'
    },
    {
      id: 'music-therapy',
      title: 'Music for Your Mood',
      description: 'Match then shift your emotional state',
      icon: Headphones,
      color: 'purple',
      type: 'activity',
      minMood: 1,
      content: 'Start with music that matches your mood, then gradually shift to more uplifting songs. Music changes brain chemistry.'
    },
    {
      id: 'creative-writing',
      title: 'Creative Writing',
      description: 'Tell your story or create a new one',
      icon: BookOpen,
      color: 'blue',
      type: 'activity',
      minMood: 3,
      content: 'Write a poem, story, or letter you will never send. Transform pain into art. Many great works came from difficult emotions.'
    }
  ],
  connection: [ // For feeling less alone
    {
      id: 'talk-someone',
      title: 'Talk to Someone You Trust',
      description: 'Share what you are going through',
      icon: Users,
      color: 'green',
      type: 'support',
      minMood: 2,
      content: 'Call or find someone who cares about you. You do not have to explain everything - just connect with another human.'
    },
    {
      id: 'peer-support',
      title: 'Connect with Peers',
      description: 'Others who understand what you are going through',
      icon: Users,
      color: 'blue',
      type: 'support',
      minMood: 3,
      content: 'Talk to others in the home who might understand. Shared experiences create powerful connections.'
    },
    {
      id: 'online-community',
      title: 'Safe Online Communities',
      description: 'Connect with supportive groups',
      icon: MessageCircle,
      color: 'purple',
      type: 'support',
      minMood: 3,
      content: 'Join moderated forums or groups for young people in care. Feeling less alone helps immensely. Ask staff for safe recommendations.'
    }
  ],
  mindfulness: [ // For present-moment awareness
    {
      id: 'mindful-moment',
      title: 'One Mindful Minute',
      description: 'Break the cycle of anxious thoughts',
      icon: Eye,
      color: 'purple',
      type: 'technique',
      minMood: 2,
      content: 'Sit quietly. Notice your breath. When thoughts come (they will), acknowledge them and return to breath. Just one minute.'
    },
    {
      id: 'body-scan',
      title: 'Body Scan Meditation',
      description: 'Reconnect with physical sensations',
      icon: Activity,
      color: 'green',
      type: 'technique',
      minMood: 3,
      content: 'Lie down. Starting at toes, notice sensations in each body part. Move slowly up to head. This grounds you in your body.'
    },
    {
      id: 'nature-connection',
      title: 'Connect with Nature',
      description: 'Natural environments reduce stress',
      icon: Sun,
      color: 'green',
      type: 'activity',
      minMood: 2,
      content: 'Go outside for 10 minutes. Notice the sky, trees, birds, weather. Nature has a calming effect on our nervous system.'
    }
  ],
  distraction: [ // For good moods or when you need a break
    {
      id: 'fun-video',
      title: 'Watch Something Funny',
      description: 'Laughter changes brain chemistry',
      icon: Video,
      color: 'orange',
      type: 'activity',
      minMood: 3,
      content: 'Watch comedy, funny animal videos, or something that makes you laugh. Laughter truly is medicine.'
    },
    {
      id: 'game-play',
      title: 'Play a Game',
      description: 'Engage your mind in something fun',
      icon: Sparkles,
      color: 'purple',
      type: 'activity',
      minMood: 3,
      content: 'Video games, board games, puzzles, or card games. Healthy distraction gives your mind a break.'
    },
    {
      id: 'learn-something',
      title: 'Learn Something New',
      description: 'Channel energy into growth',
      icon: Lightbulb,
      color: 'blue',
      type: 'activity',
      minMood: 4,
      content: 'Watch a tutorial, read about something interesting, or practice a new skill. Learning creates positive feelings.'
    }
  ]
};

// Helper function to get mood-appropriate strategies
function getStrategiesForMood(moodLevel: number) {
  const allStrategies = [];
  
  if (moodLevel <= 2) {
    // Crisis and immediate relief for low moods
    allStrategies.push(...copingStrategies.immediate);
    allStrategies.push(...copingStrategies.crisis);
    allStrategies.push(...copingStrategies.emotional);
    allStrategies.push(...copingStrategies.physical);
  } else if (moodLevel === 3) {
    // Emotional processing and support for okay moods
    allStrategies.push(...copingStrategies.immediate);
    allStrategies.push(...copingStrategies.emotional);
    allStrategies.push(...copingStrategies.connection);
    allStrategies.push(...copingStrategies.mindfulness);
    allStrategies.push(...copingStrategies.creative);
  } else {
    // Maintenance and enhancement for good moods
    allStrategies.push(...copingStrategies.creative);
    allStrategies.push(...copingStrategies.connection);
    allStrategies.push(...copingStrategies.distraction);
    allStrategies.push(...copingStrategies.mindfulness);
    allStrategies.push(...copingStrategies.physical);
  }
  
  return allStrategies.filter((strategy, index, self) =>
    index === self.findIndex((s) => s.id === strategy.id) && strategy.minMood <= moodLevel
  );
}

// Ofsted-approved help guides mapped to mood levels (Children's Homes Quality Standards)
function getOfstedGuidesForMood(moodLevel: number) {
  const guides = {
    low: [ // Levels 1-2: Really Low / Struggling
      { title: 'Your Right to Be Heard', standard: 'Standard 2', description: 'You have the right to tell staff how you feel and have your views taken seriously. Ask for a private conversation with your key worker.', content: 'Under the Children\'s Homes Regulations 2015, Standard 2 (Children\'s Wishes and Feelings), your care home MUST listen to you and take your views seriously. You can:\n\n• Ask for a private chat with any staff member\n• Request a meeting with your key worker\n• Write down your feelings if talking is hard\n• Ask for an independent advocate from Coram Voice (0808 800 5792)\n• Make a formal complaint if you feel unheard\n\nYour feelings are never "too much". Staff are trained to support you through difficult times.', iconComponent: Shield, color: 'red' },
      { title: 'Getting Professional Support', standard: 'Standard 5', description: 'You have the right to see a counsellor, therapist, or mental health professional. Your home must arrange this for you.', content: 'Under Standard 5 (Health and Wellbeing), your care home MUST ensure you can access:\n\n• CAMHS (Child and Adolescent Mental Health Services)\n• A counsellor or therapist\n• Your GP for any health concerns\n• Therapeutic support like play therapy or art therapy\n• Crisis support teams if needed urgently\n\nAsk your key worker to arrange a referral. If they do not act quickly, speak to your social worker or IRO (Independent Reviewing Officer).', iconComponent: Heart, color: 'red' },
      { title: 'Your Safety Plan', standard: 'Standard 7', description: 'You should have a safety plan for times when things feel overwhelming. Ask staff to help you create or update yours.', content: 'Standard 7 (Protection of Children) means your home must keep you safe, including from emotional harm. Your safety plan should include:\n\n• Warning signs that you are struggling\n• Things that help you feel calmer\n• People you trust to talk to\n• Phone numbers for crisis support\n• A safe space in the home you can go to\n\nIf you do not have a safety plan yet, ask your key worker to help you make one today.', iconComponent: Shield, color: 'orange' },
      { title: 'Talk to Someone Outside the Home', standard: 'Standard 6', description: 'You can speak to your social worker, an advocate, or Childline at any time. These people are independent and on your side.', content: 'Standard 6 (Positive Relationships) supports your right to relationships outside the home:\n\n• Your Social Worker. They work for YOU, not the home\n• IRO (Independent Reviewing Officer) chairs your reviews\n• Coram Voice (0808 800 5792). Free independent advocacy\n• Childline (0800 1111), free, confidential, 24/7\n• Children\'s Commissioner, protects children\'s rights nationally\n\nThese people can help if you feel the home is not supporting you properly.', iconComponent: Phone, color: 'orange' }
    ],
    mid: [ // Level 3: Okay
      { title: 'Activities to Boost Your Mood', standard: 'Standard 4', description: 'Your home should provide fun activities, hobbies, and outings. Ask about what is available this week.', content: 'Standard 4 (Enjoyment and Achievement) means your home MUST provide:\n\n• Regular activities and outings\n• Support for hobbies and interests\n• Access to sports and creative activities\n• Celebration of your achievements\n• Opportunities to try new things\n\nIdeas to ask about: cooking sessions, art clubs, sports teams, music lessons, drama groups, outdoor activities, day trips. Your home has a budget for this. Do not be afraid to suggest something new!', iconComponent: Sparkles, color: 'blue' },
      { title: 'Building Positive Relationships', standard: 'Standard 6', description: 'Healthy relationships with staff and friends can really help when you are feeling just okay. Here is how to strengthen them.', content: 'Standard 6 (Positive Relationships) means staff should:\n\n• Be warm, caring, and consistent\n• Help you maintain contact with family (if safe)\n• Support your friendships\n• Model healthy conflict resolution\n• Give you one-to-one time\n\nThings you can do:\n• Ask your key worker for a chat over a cuppa\n• Join in group activities in the home\n• Invite a friend over (ask staff)\n• Write a letter or call a family member\n• Tell staff what kind of support helps you most', iconComponent: Users, color: 'blue' },
      { title: 'Your Education Matters', standard: 'Standard 3', description: 'Feeling flat at school? Your home must support your education and help you catch up if needed.', content: 'Standard 3 (Education) ensures your home must:\n\n• Make sure you attend school regularly\n• Provide a quiet space for homework\n• Support with additional tutoring if needed\n• Attend parents\' evenings and school meetings\n• Celebrate your academic achievements\n• Help with career planning and aspirations\n\nIf school is stressful, talk to your key worker. They can liaise with your school\'s designated teacher for looked-after children, who has specific responsibility for supporting you.', iconComponent: BookOpen, color: 'purple' }
    ],
    high: [ // Levels 4-5: Good / Amazing
      { title: 'Celebrate Your Achievements', standard: 'Standard 4', description: 'You are doing brilliantly! Make sure your home celebrates your wins, big and small. You deserve recognition.', content: 'Standard 4 (Enjoyment and Achievement) says your home should celebrate you!\n\nYour achievements matter:\n• Academic progress and exam results\n• Learning a new skill\n• Being kind to others\n• Managing difficult emotions well\n• Trying something new\n• Maintaining positive relationships\n\nAsk your key worker to:\n• Record your achievements in your care plan\n• Display certificates or awards in the home\n• Share good news with your social worker\n• Plan a special outing to celebrate\n\nYou are amazing. Never let anyone tell you otherwise!', iconComponent: Star, color: 'green' },
      { title: 'Plan Your Future', standard: 'Standard 9', description: 'When you are feeling strong, it is a great time to think about your goals and dreams for the future.', content: 'Standard 9 (Care Planning) means your home must help you plan ahead:\n\n• Your Pathway Plan: what happens when you leave care\n• Education and career goals\n• Independent living skills (cooking, budgeting, laundry)\n• Finding your own accommodation\n• Building a support network for adult life\n• Accessing financial support you are entitled to\n\nAsk about:\n• Staying Put arrangements (staying with your carers after 18)\n• Personal Adviser: your support worker up to age 25\n• Setting Sail courses and independence programmes\n• Bursaries for further education', iconComponent: Target, color: 'green' },
      { title: 'Help Someone Else', standard: 'Standard 2', description: 'When you are feeling good, sharing your positivity can make a real difference to others around you.', content: 'Standard 2 (Children\'s Wishes and Feelings) values your voice:\n\nWays to help:\n• Check in on someone in the home who might be having a tough day\n• Offer to help with cooking or activities\n• Share a positive experience at a house meeting\n• Become a peer mentor or young ambassador\n• Join the Children in Care Council\n• Give feedback to improve the home for everyone\n\nYour experience and empathy are powerful. When you have been through hard times, you understand others in a way that really matters.', iconComponent: Heart, color: 'green' }
    ]
  };

  if (moodLevel <= 2) return guides.low;
  if (moodLevel === 3) return guides.mid;
  return guides.high;
}

const supportContacts = [
  {
    name: 'Childline',
    description: 'Free, confidential, 24/7, for under 19s',
    phone: '0800 1111',
    icon: Phone,
    color: 'blue'
  },
  {
    name: 'Emergency Services',
    description: 'If someone is in immediate danger',
    phone: '999',
    icon: Phone,
    color: 'red'
  },
  {
    name: 'Samaritans',
    description: 'Free to call, 24/7, any age',
    phone: '116 123',
    icon: MessageCircle,
    color: 'green'
  },
  {
    name: 'Crisis Text Line',
    description: 'Free 24/7 text support',
    phone: 'Text SHOUT to 85258',
    icon: MessageCircle,
    color: 'purple'
  }
];

export default function DailyWellbeingCheckIn({ 
  onBack, 
  user,
  onNavigateToSupport,
  onNavigateToResources,
  onNavigateToReflection
}: DailyWellbeingCheckInProps) {
  const userContext = useUserContext();
  const { setTodayMood } = useMoodResponse();
  const [step, setStep] = useState<'select' | 'response' | 'note' | 'complete' | 'history'>('select');
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedMood, setSelectedMood] = useState<typeof moodLevels[0] | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [todayCheckinCount, setTodayCheckinCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<WellbeingHistory[]>([]);
  const [deviceId, setDeviceId] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [showStrategyDialog, setShowStrategyDialog] = useState(false);
  const [sendTo, setSendTo] = useState<'none' | 'keyworker' | 'manager'>('keyworker');
  
  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize and load data
    const initializeData = async () => {
      try {
        // Get or create device ID
        let devId = localStorage.getItem('device_id');
        if (!devId) {
          devId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('device_id', devId);
        }
        setDeviceId(devId);

        // Load today's check-in count for display (multiple check-ins allowed)
        const today = new Date().toISOString().split('T')[0];
        const countKey = `checkin_count_${today}`;
        const storedCount = localStorage.getItem(countKey);
        if (storedCount) {
          setTodayCheckinCount(parseInt(storedCount));
        }
        
        // Load wellbeing history from API
        const response = await fetch(`/api/wellbeing-checkin?deviceId=${devId}&days=30`);
        if (response.ok) {
          const data = await response.json();
          setHistory(data.checkins || []);
          setStreak(data.streak || 0);
        } else {
          // Fallback to local storage
          const streakData = localStorage.getItem('checkin_streak');
          if (streakData) {
            setStreak(parseInt(streakData));
          }
        }
      } catch (error) {
        console.error('Error loading check-in data:', error);
        // Fallback to local storage
        const streakData = localStorage.getItem('checkin_streak');
        if (streakData) {
          setStreak(parseInt(streakData));
        }
      }
    };
    
    initializeData();
  }, []);

  const handleMoodSelect = (mood: typeof moodLevels[0]) => {
    setSelectedMood(mood);
    setStep('response');
  };

  const handleContinue = () => {
    setStep('note');
  };

  // NERVOUS SYSTEM: Show contextual support based on emotional state
  const showContextualSupport = useCallback((level: number, moodId: string) => {
    // For low mood levels (1-2), show immediate help resources
    if (level <= 2) {
      setTimeout(() => {
        toast.info('We noticed you are struggling', {
          description: 'Would you like to see support resources that might help?',
          action: {
            label: 'View Support',
            onClick: () => onNavigateToSupport?.()
          },
          duration: 10000
        });
        
        // If feeling very low or desperate, highlight emergency contacts with clickable links
        if (moodId === 'terrible' || moodId === 'struggling') {
          setTimeout(() => {
            toast.warning('Feeling desperate? Help is available 24/7', {
              description: (
                <div className="space-y-2">
                  <p className="font-semibold mb-2">Click to get help now:</p>
                  <div className="space-y-1">
                    <a 
                      href={createPhoneLink('0800 1111')}
                      className="block text-blue-600 hover:text-blue-800 font-bold hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Calling Childline...');
                      }}
                    >
                      📞 Childline: 0800 1111
                    </a>
                    <a 
                      href={createPhoneLink('116 123')}
                      className="block text-blue-600 hover:text-blue-800 font-bold hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Calling Samaritans...');
                      }}
                    >
                      📞 Samaritans: 116 123
                    </a>
                    <a 
                      href={createSmsLink('Text SHOUT to 85258')!}
                      className="block text-blue-600 hover:text-blue-800 font-bold hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Opening messaging app...');
                      }}
                    >
                      💬 Text SHOUT to 85258
                    </a>
                  </div>
                </div>
              ) as any,
              duration: 15000
            });
          }, 3000);
        }
      }, 2000);
    }
    
    // For medium levels (3), offer coping strategies and reflection tools
    else if (level === 3) {
      setTimeout(() => {
        toast.info('Would coping strategies help?', {
          description: 'Check out our digital resources for practical tools',
          action: {
            label: 'Explore Resources',
            onClick: () => onNavigateToResources?.()
          },
          duration: 8000
        });
      }, 2000);
    }
    
    // For high levels (4-5), suggest reflection and goal-setting
    else if (level >= 4) {
      setTimeout(() => {
        toast.success('Feeling good? Capture this moment!', {
          description: 'Use reflection tools to record what is working well',
          action: {
            label: 'Reflect',
            onClick: () => onNavigateToReflection?.()
          },
          duration: 6000
        });
      }, 2000);
    }
  }, [onNavigateToSupport, onNavigateToResources, onNavigateToReflection]);

  const handleSubmit = async () => {
    if (!selectedMood || !deviceId) return;
    
    setIsSubmitting(true);

    try {
      // Use session-aware context (falls back to localStorage)
      const userName = userContext.displayName;
      const userHome = userContext.home;
      
      // Auto-escalate to manager for low moods
      const effectiveSendTo = selectedMood.level <= 4 ? 'manager' : sendTo;

      const checkInData = {
        mood: selectedMood.id,
        moodLevel: selectedMood.level,
        level: selectedMood.level,
        note: note,
        deviceId: deviceId,
        userId: user?.id || null,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        sendTo: effectiveSendTo,
        shareWithStaff: true,
        userName: userName,
        home: userHome
      };

      // Save to API
      const response = await fetch('/api/wellbeing-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkInData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Track check-in count for today
        const today = new Date().toISOString().split('T')[0];
        const countKey = `checkin_count_${today}`;
        const newCount = todayCheckinCount + 1;
        localStorage.setItem(countKey, String(newCount));
        setTodayCheckinCount(newCount);

        // Save to mood history for Mood Trends feature
        try {
          const moodHistoryKey = 'okayit_mood_history';
          const existing = JSON.parse(localStorage.getItem(moodHistoryKey) || '[]');
          existing.push({ date: new Date().toISOString(), mood: selectedMood.id, moodLevel: selectedMood.level });
          localStorage.setItem(moodHistoryKey, JSON.stringify(existing));
        } catch { /* storage full */ }
        
        // Reload history
        const historyResponse = await fetch(`/api/wellbeing-checkin?deviceId=${deviceId}&days=30`);
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setHistory(historyData.checkins || []);
          setStreak(historyData.streak || 0);
        }

        setStep('complete');
        setShowCelebration(true);

        // Let the WHOLE platform respond to how they're feeling today
        setTodayMood(selectedMood.level, selectedMood.id);
        
        // Track wellbeing check-in for progress dashboard
        trackActivity('wellbeing', {
          id: `wellbeing-${Date.now()}`,
          feeling: selectedMood.id,
          mood: selectedMood.level,
          notes: note
        });
        
        const successMessage = sendTo !== 'none' && result.emailSent
          ? `Your check-in has been sent to your ${sendTo === 'keyworker' ? 'key worker' : 'manager'}! ${streak + 1} day streak!`
          : `Your well-being matters. ${streak + 1} day streak!`;
        
        toast.success('Thank you for checking in!', {
          description: successMessage,
          duration: 4000
        });
        
        // NERVOUS SYSTEM: Intelligent routing based on emotional state
        showContextualSupport(selectedMood.level, selectedMood.id);
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Error saving check-in:', error);
      toast.error('Could not save check-in', {
        description: 'Please try again or tell your key worker.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedMood(null);
    setNote('');
    setSendTo('none');
  };

  // Voice recording using Web Speech API (speech-to-text)
  const startVoiceRecording = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Voice recording is not supported in your browser', {
        description: 'Try using Chrome or Edge for voice recording.'
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-GB';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = note; // Start from existing note text

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + transcript;
          setNote(finalTranscript);
        } else {
          interim += transcript;
        }
      }
      // Show interim results in real-time
      if (interim) {
        setNote(finalTranscript + (finalTranscript ? ' ' : '') + interim);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error('Microphone access denied', {
          description: 'Please allow microphone access in your browser settings.'
        });
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    toast.success('🎙️ Recording started', {
      description: 'Speak clearly. Your words will appear as text.',
      duration: 3000
    });
  }, [note]);

  const stopVoiceRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    toast.success('Recording stopped', {
      description: 'Your voice has been added to your note.',
      duration: 2000
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // No daily limit - young people can check in as often as they need

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <CelebrationMoment show={showCelebration} onDone={() => setShowCelebration(false)} />
      {/* Compact Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold hover:text-purple-800 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Menu
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-gray-900">How Are You Feeling?</span>
          </div>
          <div className="flex items-center gap-2">
            {todayCheckinCount > 0 && step === 'select' && (
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                ✓ {todayCheckinCount} today
              </span>
            )}
            {history.length > 0 && step === 'select' && (
              <button
                onClick={() => setStep('history')}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5" />
                History
              </button>
            )}
            {streak > 0 && (
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                {streak} day streak
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
          <AnimatePresence mode="wait">
            {/* Step 1: Mood Selection */}
            {step === 'select' && (
              <motion.div
                key="select"
                {...tikTokTransitions.fade}
                className="space-y-8"
              >
                <Card className={combineThemeClasses("border border-purple-300", okayitTheme.backgrounds.whiteCardPurple)}>
                  <CardHeader>
                    <CardTitle className={combineThemeClasses("text-3xl text-center", okayitTheme.text.purple)}>
                      Pick the color that shows how you feel right now
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {moodLevels.map((mood, index) => {
                        const Icon = mood.icon;
                        return (
                          <motion.button
                            key={mood.id}
                            onClick={() => handleMoodSelect(mood)}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.03, x: 10 }}
                            whileTap={{ scale: 0.98 }}
                            className={combineThemeClasses(
                              "w-full p-6 rounded-2xl border-4 transition-all duration-300 text-left",
                              mood.bgColor,
                              "hover:shadow-lg"
                            )}
                          >
                            <div className="flex items-center gap-6">
                              <div className="text-6xl">{mood.emoji}</div>
                              <div className="flex-1">
                                <p className={combineThemeClasses("text-3xl font-black mb-1", mood.textColor)}>
                                  {mood.label}
                                </p>
                                <p className={combineThemeClasses("text-lg font-semibold", mood.textColor)}>
                                  Level {mood.level} of 5
                                </p>
                              </div>
                              <Icon className={combineThemeClasses("w-10 h-10", mood.textColor)} />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Response and Resources */}
            {step === 'response' && selectedMood && (
              <motion.div
                key="response"
                {...tikTokTransitions.slideLeft}
                className="space-y-8"
              >
                {/* Response Message */}
                <Card className={combineThemeClasses("border-4", selectedMood.bgColor)}>
                  <CardContent className="p-10 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-8xl mb-6"
                    >
                      {selectedMood.emoji}
                    </motion.div>
                    
                    <h2 className={combineThemeClasses("text-4xl font-black mb-3", selectedMood.textColor)}>
                      {selectedMood.message}
                    </h2>
                    
                    <p className={combineThemeClasses("text-2xl font-semibold", selectedMood.textColor)}>
                      {selectedMood.subtitle}
                    </p>
                  </CardContent>
                </Card>

                {/* Support Resources for Low Moods */}
                {selectedMood.level <= 2 && (
                  <Card className={combineThemeClasses("border border-orange-400", okayitTheme.backgrounds.orangeCard)}>
                    <CardHeader>
                      <CardTitle className={combineThemeClasses("text-2xl flex items-center gap-3", okayitTheme.text.onOrange)}>
                        <AlertCircle className="w-8 h-8" />
                        Need to Talk to Someone Right Now?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {supportContacts.map((contact) => {
                        const Icon = contact.icon;
                        return (
                          <motion.div
                            key={contact.name}
                            whileHover={{ scale: 1.02 }}
                            className={combineThemeClasses(
                              "p-6 rounded-xl border-3",
                              "bg-white border-orange-300"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={okayitTheme.icons[contact.color as keyof typeof okayitTheme.icons]}>
                                <Icon className="w-8 h-8 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className={combineThemeClasses("text-xl font-bold", okayitTheme.text.primaryOnLight)}>
                                  {contact.name}
                                </p>
                                <p className={okayitTheme.text.secondaryOnLight}>
                                  {contact.description}
                                </p>
                                <p className={combineThemeClasses("text-2xl font-mono font-bold mt-2", okayitTheme.text.orange)}>
                                  {contact.phone}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}

                {/* Coping Strategies */}
                <Card className={combineThemeClasses("border border-blue-300", okayitTheme.backgrounds.whiteCardBlue)}>
                  <CardHeader>
                    <CardTitle className={combineThemeClasses("text-2xl", okayitTheme.text.blue)}>
                      {selectedMood.level <= 2 ? 'Ways to Help You Right Now' : 'Things That Might Help You Feel Better'}
                    </CardTitle>
                    <p className={okayitTheme.text.secondaryOnLight}>
                      {selectedMood.level <= 2 
                        ? 'These are proven techniques that can help when you are struggling'
                        : 'Choose what feels right for you in this moment'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {getStrategiesForMood(selectedMood.level).map((strategy) => {
                        const Icon = strategy.icon;
                        return (
                          <motion.div
                            key={strategy.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setSelectedStrategy(strategy);
                              setShowStrategyDialog(true);
                            }}
                            className={combineThemeClasses(
                              "p-6 rounded-xl border cursor-pointer transition-all",
                              "bg-white hover:shadow-md",
                              strategy.color === 'blue' && "border-blue-300 hover:border-blue-500",
                              strategy.color === 'green' && "border-green-300 hover:border-green-500",
                              strategy.color === 'purple' && "border-purple-300 hover:border-purple-500",
                              strategy.color === 'pink' && "border-pink-300 hover:border-pink-500",
                              strategy.color === 'orange' && "border-orange-300 hover:border-orange-500"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div className={okayitTheme.icons[strategy.color as keyof typeof okayitTheme.icons]}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className={combineThemeClasses("text-lg font-bold", okayitTheme.text.primaryOnLight)}>
                                    {strategy.title}
                                  </p>
                                  {strategy.type === 'support' && selectedMood.level <= 2 && (
                                    <Badge className="bg-orange-500 text-white text-xs">Recommended</Badge>
                                  )}
                                </div>
                                <p className={combineThemeClasses("text-sm", okayitTheme.text.secondaryOnLight)}>
                                  {strategy.description}
                                </p>
                                <p className={combineThemeClasses("text-xs mt-2 font-semibold", okayitTheme.text[strategy.color as keyof typeof okayitTheme.text])}>
                                  Tap for details →
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Ofsted-Approved Help Guides — tailored per mood */}
                <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                      <BookOpen className="w-6 h-6" />
                      {selectedMood.level <= 2 ? 'Ofsted Help Guides for When You Are Struggling' :
                       selectedMood.level === 3 ? 'Guides to Lift Your Mood' :
                       'Ways to Keep Feeling Great'}
                    </CardTitle>
                    <p className="text-sm text-purple-600">
                      Based on the Children&apos;s Homes Quality Standards. Real support that works
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {getOfstedGuidesForMood(selectedMood.level).map((guide, i) => (
                      <motion.div
                        key={guide.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => { setSelectedStrategy({ ...guide, icon: guide.iconComponent, color: guide.color }); setShowStrategyDialog(true); }}
                        className="p-4 bg-white rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${guide.color === 'red' ? 'bg-red-100' : guide.color === 'orange' ? 'bg-orange-100' : guide.color === 'blue' ? 'bg-blue-100' : guide.color === 'green' ? 'bg-green-100' : 'bg-purple-100'}`}>
                            <guide.iconComponent className={`w-5 h-5 ${guide.color === 'red' ? 'text-red-600' : guide.color === 'orange' ? 'text-orange-600' : guide.color === 'blue' ? 'text-blue-600' : guide.color === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900">{guide.title}</p>
                              <Badge className="bg-purple-100 text-purple-700 text-[10px]">{guide.standard}</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{guide.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep('select')}
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6"
                  >
                    ← Change Mood
                  </Button>
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className={combineThemeClasses(okayitTheme.interactive.buttonPurple, "flex-1 text-lg px-8 py-6")}
                  >
                    Continue
                    <Sparkles className="w-6 h-6 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Optional Note */}
            {step === 'note' && selectedMood && (
              <motion.div
                key="note"
                {...tikTokTransitions.slideLeft}
                className="space-y-8"
              >
                <Card className={combineThemeClasses("border border-purple-300", okayitTheme.backgrounds.whiteCardPurple)}>
                  <CardHeader>
                    <CardTitle className={combineThemeClasses("text-3xl", okayitTheme.text.purple)}>
                      Want to share what is on your mind?
                    </CardTitle>
                    <p className={okayitTheme.text.secondaryOnLight}>
                      This is completely optional and private. Only you and your key worker can see it.
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="relative">
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What happened today? How are you really feeling? What is on your mind?&#10;&#10;Your thoughts are safe and private here...&#10;&#10;💡 Tip: Tap the microphone button to speak instead of type!"
                        className={combineThemeClasses(okayitTheme.interactive.input, "min-h-[200px] text-lg pr-14")}
                        rows={8}
                      />
                      {/* Voice Recording Button */}
                      <div className="absolute bottom-3 right-3">
                        <motion.button
                          type="button"
                          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                          whileTap={{ scale: 0.9 }}
                          className={`p-3 rounded-full shadow-lg transition-all ${
                            isRecording 
                              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                              : 'bg-purple-600 hover:bg-purple-700 text-white'
                          }`}
                          title={isRecording ? 'Stop recording' : 'Start voice recording'}
                        >
                          {isRecording ? (
                            <Square className="w-5 h-5" />
                          ) : (
                            <Mic className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                    {isRecording && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 p-3 rounded-xl border border-red-200"
                      >
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        Recording... speak clearly and your words will appear above. Tap the stop button when done.
                      </motion.div>
                    )}
                    
                    {/* Send to Keyworker/Manager Option */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                      <h4 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
                        <Users className="w-6 h-6" />
                        Would you like to share this with someone?
                      </h4>
                      <p className="text-gray-700 mb-4 text-base">
                        If you choose to share, your check-in will be sent directly to their email so they can support you better.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Button
                          type="button"
                          variant={sendTo === 'none' ? 'default' : 'outline'}
                          onClick={() => setSendTo('none')}
                          className={combineThemeClasses(
                            "h-auto py-4 px-4 flex flex-col items-center gap-2",
                            sendTo === 'none' 
                              ? "bg-purple-600 hover:bg-purple-700 text-white border border-purple-700" 
                              : "border border-gray-300 hover:border-purple-400"
                          )}
                        >
                          <Shield className="w-6 h-6" />
                          <span className="font-bold">Keep Private</span>
                          <span className="text-xs opacity-80">Just for me</span>
                        </Button>
                        <Button
                          type="button"
                          variant={sendTo === 'keyworker' ? 'default' : 'outline'}
                          onClick={() => setSendTo('keyworker')}
                          className={combineThemeClasses(
                            "h-auto py-4 px-4 flex flex-col items-center gap-2",
                            sendTo === 'keyworker' 
                              ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-700" 
                              : "border border-gray-300 hover:border-blue-400"
                          )}
                        >
                          <Heart className="w-6 h-6" />
                          <span className="font-bold">Send to Key Worker</span>
                          <span className="text-xs opacity-80">Your assigned support</span>
                        </Button>
                        <Button
                          type="button"
                          variant={sendTo === 'manager' ? 'default' : 'outline'}
                          onClick={() => setSendTo('manager')}
                          className={combineThemeClasses(
                            "h-auto py-4 px-4 flex flex-col items-center gap-2",
                            sendTo === 'manager' 
                              ? "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-700" 
                              : "border border-gray-300 hover:border-indigo-400"
                          )}
                        >
                          <Star className="w-6 h-6" />
                          <span className="font-bold">Send to Manager</span>
                          <span className="text-xs opacity-80">Home manager</span>
                        </Button>
                      </div>
                      {sendTo !== 'none' && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 text-sm text-purple-700 bg-white/70 rounded-lg p-3 border border-purple-200"
                        >
                          ✉️ Your check-in will be emailed to your {sendTo === 'keyworker' ? 'key worker' : 'home manager'} so they can reach out to support you.
                        </motion.p>
                      )}
                    </div>
                    
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setStep('response')}
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 py-6"
                      >
                        ← Back
                      </Button>
                      <Button
                        onClick={() => {
                          setNote('');
                          setSendTo('none');
                          handleSubmit();
                        }}
                        variant="outline"
                        size="lg"
                        className="text-lg px-8 py-6"
                      >
                        Skip This
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        size="lg"
                        className={combineThemeClasses(okayitTheme.interactive.buttonPurple, "flex-1 text-lg px-8 py-6")}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                              <Sparkles className="w-6 h-6" />
                            </motion.div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6" />
                            <span>Submit Check-In</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Complete */}
            {step === 'complete' && selectedMood && (
              <motion.div
                key="complete"
                {...tikTokTransitions.fade}
                className="space-y-8"
              >
                <Card className={combineThemeClasses("border border-purple-400", okayitTheme.backgrounds.purpleCard)}>
                  <CardContent className="p-12 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                      className="mb-8"
                    >
                      <CheckCircle2 className="w-32 h-32 text-purple-700 mx-auto" />
                    </motion.div>
                    
                    <h2 className={combineThemeClasses("text-5xl font-black mb-4", okayitTheme.text.onPurple)}>
                      Thank You for Checking In!
                    </h2>
                    
                    <p className={combineThemeClasses("text-2xl mb-8", okayitTheme.text.onPurple)}>
                      Your well-being matters and tracking your feelings helps us support you better.
                    </p>
                    
                    {streak > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="mb-8"
                      >
                        <Badge className={combineThemeClasses(okayitTheme.badges.green, "text-2xl px-8 py-4")}>
                          <TrendingUp className="w-8 h-8 mr-3" />
                          {streak} Day Streak - Amazing!
                        </Badge>
                      </motion.div>
                    )}
                    
                    <p className={combineThemeClasses("text-xl mb-8", okayitTheme.text.secondaryOnLight)}>
                      You can check in as many times as you need. We are always here for you.
                    </p>
                    
                    <div className="flex gap-4 justify-center flex-wrap">
                      <Button
                        onClick={handleReset}
                        size="lg"
                        className="text-xl px-10 py-8 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Heart className="w-6 h-6 mr-2" />
                        Check In Again
                      </Button>
                      <Button
                        onClick={async () => {
                          toast.loading('Notifying a trusted adult...');
                          try {
                            await fetch('/api/wellbeing-checkin', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                mood: selectedMood?.id || 'unknown',
                                moodLevel: selectedMood?.level || 5,
                                note: `${userContext.displayName} has requested to speak with a trusted adult after their check-in.${note ? ` Their note: ${note}` : ''}`,
                                shareWithStaff: true,
                                sendTo: 'manager',
                                userName: userContext.displayName,
                                home: userContext.home,
                                anonymousId: user?.id || deviceId,
                              }),
                            });
                            toast.dismiss();
                            toast.success('A trusted adult has been notified. Someone will reach out to you soon. 💜');
                          } catch {
                            toast.dismiss();
                            toast.error('Could not send notification. Please tell a staff member directly.');
                          }
                        }}
                        size="lg"
                        className="text-xl px-10 py-8 bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Shield className="w-6 h-6 mr-2" />
                        Inform a Trusted Adult
                      </Button>
                      <Button
                        onClick={onBack}
                        size="lg"
                        variant="outline"
                        className="text-xl px-10 py-8 border-purple-400 text-purple-700 hover:bg-purple-50"
                      >
                        <ArrowLeft className="w-6 h-6 mr-2" />
                        Back to Menu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* History View */}
            {step === 'history' && (
              <motion.div
                key="history"
                {...tikTokTransitions.fade}
                className="space-y-8"
              >
                <Card className={combineThemeClasses("border border-purple-300", okayitTheme.backgrounds.whiteCardPurple)}>
                  <CardHeader>
                    <CardTitle className={combineThemeClasses("text-3xl", okayitTheme.text.purple)}>
                      Your Wellbeing Journey
                    </CardTitle>
                    <p className={okayitTheme.text.secondaryOnLight}>
                      Track your progress over time and see patterns in how you are feeling
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={combineThemeClasses("p-6 rounded-xl border border-green-300", okayitTheme.backgrounds.greenCard)}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={okayitTheme.icons.green}>
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <p className={combineThemeClasses("text-lg font-bold", okayitTheme.text.onGreen)}>
                            Current Streak
                          </p>
                        </div>
                        <p className={combineThemeClasses("text-4xl font-black", okayitTheme.text.onGreen)}>
                          {streak} days
                        </p>
                      </div>
                      
                      <div className={combineThemeClasses("p-6 rounded-xl border border-blue-300", okayitTheme.backgrounds.blueCard)}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={okayitTheme.icons.blue}>
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <p className={combineThemeClasses("text-lg font-bold", okayitTheme.text.onBlue)}>
                            Total Check-ins
                          </p>
                        </div>
                        <p className={combineThemeClasses("text-4xl font-black", okayitTheme.text.onBlue)}>
                          {history.length}
                        </p>
                      </div>
                      
                      <div className={combineThemeClasses("p-6 rounded-xl border border-purple-300", okayitTheme.backgrounds.purpleCard)}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={okayitTheme.icons.purple}>
                            <Gauge className="w-6 h-6 text-white" />
                          </div>
                          <p className={combineThemeClasses("text-lg font-bold", okayitTheme.text.onPurple)}>
                            Average Mood
                          </p>
                        </div>
                        <p className={combineThemeClasses("text-4xl font-black", okayitTheme.text.onPurple)}>
                          {history.length > 0 
                            ? (history.reduce((sum, h) => sum + h.moodLevel, 0) / history.length).toFixed(1)
                            : '0'} / 5
                        </p>
                      </div>
                    </div>
                    
                    {/* History Timeline */}
                    <div className="space-y-4">
                      <h3 className={combineThemeClasses("text-2xl font-bold", okayitTheme.text.purple)}>
                        Recent Check-ins
                      </h3>
                      
                      {history.slice(0, 10).map((entry, index) => {
                        const mood = moodLevels.find(m => m.id === entry.mood);
                        if (!mood) return null;
                        
                        return (
                          <motion.div
                            key={entry.date}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={combineThemeClasses(
                              "p-6 rounded-xl border-3",
                              mood.bgColor
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-5xl">{mood.emoji}</div>
                                <div>
                                  <p className={combineThemeClasses("text-2xl font-bold", mood.textColor)}>
                                    {mood.label}
                                  </p>
                                  <p className={combineThemeClasses("text-lg", mood.textColor)}>
                                    {new Date(entry.date).toLocaleDateString('en-GB', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                  {entry.note && (
                                    <p className={combineThemeClasses("text-sm mt-2 italic", mood.textColor)}>
                                      {entry.note}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className={combineThemeClasses("text-sm font-mono", mood.textColor)}>
                                {new Date(entry.timestamp).toLocaleTimeString('en-GB', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      
                      {history.length === 0 && (
                        <div className="text-center py-12">
                          <Clock className="w-16 h-16 text-gray-900 mx-auto mb-4" />
                          <p className="text-xl text-gray-800">
                            No check-ins yet. Start tracking your wellbeing journey today!
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setStep('select')}
                        size="lg"
                        className={combineThemeClasses(okayitTheme.interactive.buttonPurple, "text-lg px-8 py-6")}
                      >
                        <ArrowLeft className="w-6 h-6 mr-2" />
                        Back
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
      
      {/* Strategy Detail Dialog */}
      <Dialog open={showStrategyDialog} onOpenChange={setShowStrategyDialog}>
        <DialogContent className="max-w-2xl">
          {selectedStrategy && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className={okayitTheme.icons[selectedStrategy.color as keyof typeof okayitTheme.icons] || okayitTheme.icons.purple}>
                    {selectedStrategy.icon && React.createElement(selectedStrategy.icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <DialogTitle className="text-3xl font-black">
                    {selectedStrategy.title}
                  </DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  {selectedStrategy.type && (
                    <Badge className={okayitTheme.badges[selectedStrategy.color as keyof typeof okayitTheme.badges] || okayitTheme.badges.purple}>
                      {selectedStrategy.type}
                    </Badge>
                  )}
                </div>
                
                <p className="text-lg text-gray-900">
                  {selectedStrategy.description}
                </p>
                
                {selectedStrategy.content && (
                  <Card className={combineThemeClasses("border-2", ({
                    blue: 'border-blue-300',
                    green: 'border-green-300',
                    purple: 'border-purple-300',
                    pink: 'border-pink-300',
                    orange: 'border-orange-300',
                    red: 'border-red-300',
                  } as Record<string, string>)[selectedStrategy.color] || 'border-purple-300')}>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold mb-4">How to do it:</h4>
                      <p className="text-base leading-relaxed whitespace-pre-line">
                        {selectedStrategy.content}
                      </p>
                    </CardContent>
                  </Card>
                )}
                
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      setShowStrategyDialog(false);
                      toast.success('Great choice! Give this a try and see how you feel.');
                    }}
                    className={okayitTheme.interactive.buttonPurple}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    I will try this
                  </Button>
                  <Button
                    onClick={() => setShowStrategyDialog(false)}
                    variant="outline"
                  >
                    Close
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