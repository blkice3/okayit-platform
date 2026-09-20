
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Trophy,
  Users,
  Star,
  Target,
  Gamepad2,
  Heart,
  Crown,
  Award,
  Sparkles,
  Play,
  Lock,
  CheckCircle,
  Clock,
  Flame,
  Medal,
  MessageCircle,
  BookOpen,
  X,
  Calendar,
  MapPin,
  Gift,
  Zap,
  Brain,
  Music,
  Palette,
  Camera,
  Mic,
  Code,
  Globe,
  Lightbulb,
  Shield,
  TrendingUp,
  Users2,
  Handshake,
  Puzzle,
  UserPlus,
  UserMinus,
  Pause,
  Volume2,
  RotateCcw,
  AlertTriangle,
  MessageSquare,
  FileText,
  Download
} from 'lucide-react';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { hapticFeedback } from '@/lib/mobile-utils';
import { trackActivity } from './progress-dashboard-new';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import VoiceInputButton from '@/components/voice-input-button';

interface FamilyGamingProps {
  onBack: () => void;
  user: any;
}

interface Game {
  id: string;
  title: string;
  description: string;
  type: string;
  players: string;
  duration: string;
  difficulty: string;
  color: string;
  icon: any;
  categories: string[];
  features: string[];
  rewards: {
    points: number;
    badge: string;
  };
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  points: number;
  duration: string;
  category: string;
  color: string;
  icon: any;
  tasks: string[];
}

interface Activity {
  id: string;
  title: string;
  description: string;
  participants: string;
  category: string;
  color: string;
  icon: any;
  activities: string[];
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: any;
  earned: boolean;
  progress: number;
  requirement: number;
  points: number;
  category: string;
  date: string | null;
}

const familyChallenges: Challenge[] = [
  {
    id: 'kindness-week',
    title: 'Kindness Week Challenge',
    description: 'Perform acts of kindness for 7 days straight',
    difficulty: 'Easy',
    points: 50,
    duration: '7 days',
    category: 'Values',
    color: 'from-pink-400 to-rose-500',
    icon: Heart,
    tasks: [
      'Help with house chores without being asked',
      'Say something nice to a staff member',
      'Share something with another resident',
      'Help someone with their homework',
      'Write a thank you note',
      'Compliment someone genuinely',
      'Volunteer to help with meals'
    ]
  },
  {
    id: 'digital-wellbeing',
    title: 'Digital Wellbeing Challenge',
    description: 'Develop healthy digital habits and online safety awareness',
    difficulty: 'Medium',
    points: 85,
    duration: '4 days',
    category: 'Digital Skills',
    color: 'from-purple-400 to-indigo-500',
    icon: Target,
    tasks: [
      'Complete online safety quiz',
      'Set up healthy screen time limits',
      'Learn about digital footprints',
      'Practice respectful online communication',
      'Share a positive message online'
    ]
  },
  {
    id: 'communication-heroes',
    title: 'Communication Heroes',
    description: 'Build confidence in expressing yourself and connecting with others',
    difficulty: 'Easy',
    points: 65,
    duration: '5 days',
    category: 'Life Skills',
    color: 'from-green-400 to-teal-500',
    icon: Star,
    tasks: [
      'Have a meaningful conversation with staff',
      'Share your feelings in a constructive way',
      'Practice active listening',
      'Help resolve a minor conflict',
      'Express gratitude to someone special'
    ]
  },
  {
    id: 'creative-expression',
    title: 'Creative Expression Quest',
    description: 'Explore your creativity through various artistic mediums',
    difficulty: 'Medium',
    points: 90,
    duration: '6 days',
    category: 'Arts & Culture',
    color: 'from-orange-400 to-red-500',
    icon: Sparkles,
    tasks: [
      'Create a piece of art (drawing, painting, etc.)',
      'Write a short story or poem',
      'Learn a new song or dance',
      'Take creative photos',
      'Share your creation with others',
      'Teach someone else a creative skill'
    ]
  },
  {
    id: 'life-skills-mastery',
    title: 'Independent Living Skills',
    description: 'Master essential skills for independent living and personal development',
    difficulty: 'Hard',
    points: 120,
    duration: '10 days',
    category: 'Life Skills',
    color: 'from-blue-400 to-cyan-500',
    icon: Award,
    tasks: [
      'Plan and cook a healthy meal',
      'Create a weekly budget',
      'Learn basic home maintenance',
      'Practice job interview skills',
      'Complete a CV or resume',
      'Research future education/career options',
      'Set personal development goals',
      'Practice time management',
      'Learn conflict resolution skills',
      'Develop a self-care routine'
    ]
  },
  {
    id: 'mindfulness-journey',
    title: 'Mindfulness Journey',
    description: 'Develop emotional awareness and mental wellbeing through mindful practices',
    difficulty: 'Easy',
    points: 70,
    duration: '5 days',
    category: 'Mental Health',
    color: 'from-emerald-400 to-teal-500',
    icon: Lightbulb,
    tasks: [
      'Practice 10 minutes of daily meditation',
      'Keep a gratitude journal for 3 days',
      'Try a breathing exercise when feeling stressed',
      'Practice mindful eating during one meal',
      'Share one positive thought with someone each day'
    ]
  },
  {
    id: 'community-connections',
    title: 'Community Connections',
    description: 'Build meaningful relationships and strengthen social bonds within the care home',
    difficulty: 'Medium',
    points: 95,
    duration: '8 days',
    category: 'Social Skills',
    color: 'from-violet-400 to-purple-500',
    icon: Users,
    tasks: [
      'Introduce yourself to someone new each day',
      'Help organize a group activity or event',
      'Practice active listening in conversations',
      'Share a meal with someone from a different background',
      'Volunteer to help a peer with their goals',
      'Lead a discussion on a topic you care about',
      'Create something together with others',
      'Offer emotional support to someone who needs it'
    ]
  }
];

const groupActivities: Activity[] = [
  {
    id: 'peer-support-circles',
    title: 'Peer Support Circles',
    description: 'Connect, share experiences, and support each other through guided discussions',
    participants: '4-8 people',
    category: 'Emotional Support',
    color: 'from-blue-400 to-purple-500',
    icon: Heart,
    activities: [
      'Weekly check-in sessions',
      'Goal-setting workshops',
      'Problem-solving together',
      'Celebrating achievements',
      'Building trust and friendship'
    ]
  },
  {
    id: 'digital-creators-club',
    title: 'Digital Creators Club',
    description: 'Learn digital skills while creating content and building online presence',
    participants: '3-10 people',
    category: 'Digital Skills',
    color: 'from-green-400 to-teal-500',
    icon: Sparkles,
    activities: [
      'Create social media content',
      'Learn video editing basics',
      'Design digital artwork',
      'Build personal portfolios',
      'Practice online communication'
    ]
  },
  {
    id: 'life-skills-lab',
    title: 'Life Skills Laboratory',
    description: 'Practical workshops for independent living and future planning',
    participants: '2-6 people',
    category: 'Life Skills',
    color: 'from-orange-400 to-red-500',
    icon: Target,
    activities: [
      'Budgeting and money management',
      'Cooking healthy meals',
      'Job application workshops',
      'Interview practice sessions',
      'Housing preparation activities'
    ]
  },
  {
    id: 'culture-celebration',
    title: 'Culture & Identity Celebration',
    description: 'Share and learn about different cultures while exploring personal identity',
    participants: 'Everyone',
    category: 'Diversity & Inclusion',
    color: 'from-purple-400 to-indigo-500',
    icon: Users,
    activities: [
      'Share traditional food and recipes',
      'Teach traditional games or activities',
      'Share cultural stories and experiences',
      'Learn basic phrases in different languages',
      'Cultural dress-up and celebration days'
    ]
  },
  {
    id: 'wellbeing-warriors',
    title: 'Wellbeing Warriors',
    description: 'Focus on mental health, physical fitness, and overall wellness',
    participants: '3-12 people',
    category: 'Health & Wellness',
    color: 'from-pink-400 to-rose-500',
    icon: Medal,
    activities: [
      'Mindfulness and meditation sessions',
      'Exercise and fitness challenges',
      'Healthy cooking competitions',
      'Stress management workshops',
      'Self-care routine building'
    ]
  },
  {
    id: 'creative-collaborators',
    title: 'Creative Collaborators',
    description: 'Work together on artistic projects and creative challenges',
    participants: '4-8 people',
    category: 'Arts & Creativity',
    color: 'from-amber-400 to-orange-500',
    icon: Palette,
    activities: [
      'Collaborative mural painting',
      'Group music composition',
      'Creative writing workshops',
      'Photography expeditions',
      'Drama and performance activities'
    ]
  }
];

const games: Game[] = [
  {
    id: 'trivia-master',
    title: 'Trivia Master',
    description: 'Test your knowledge across multiple categories',
    type: 'Quiz',
    players: '1-8 players',
    duration: '10-20 mins',
    difficulty: 'Medium',
    color: 'from-blue-500 to-indigo-600',
    icon: Brain,
    categories: ['General Knowledge', 'Science', 'History', 'Pop Culture', 'Life Skills'],
    features: [
      'Multiple difficulty levels',
      'Real-time multiplayer',
      'Custom question sets',
      'Progress tracking',
      'Achievement unlocking'
    ],
    rewards: {
      points: 25,
      badge: 'Knowledge Seeker'
    }
  },
  {
    id: 'memory-palace',
    title: 'Memory Palace',
    description: 'Challenge your memory with increasingly complex patterns',
    type: 'Memory',
    players: '1-4 players',
    duration: '5-15 mins',
    difficulty: 'Easy',
    color: 'from-purple-500 to-pink-600',
    icon: Puzzle,
    categories: ['Visual Patterns', 'Sound Sequences', 'Word Chains', 'Number Series'],
    features: [
      'Progressive difficulty',
      'Memory techniques training',
      'Pattern recognition',
      'Cognitive skill building',
      'Daily challenges'
    ],
    rewards: {
      points: 20,
      badge: 'Memory Champion'
    }
  },
  {
    id: 'creative-studio',
    title: 'Creative Studio',
    description: 'Express yourself through digital art, music, and storytelling',
    type: 'Creative',
    players: '1-6 players',
    duration: '15-45 mins',
    difficulty: 'Easy',
    color: 'from-orange-500 to-red-600',
    icon: Palette,
    categories: ['Digital Art', 'Music Creation', 'Story Writing', 'Photography', 'Video Making'],
    features: [
      'Multi-media creation tools',
      'Collaboration features',
      'Gallery showcase',
      'Peer feedback system',
      'Export and share options'
    ],
    rewards: {
      points: 40,
      badge: 'Creative Genius'
    }
  },
  {
    id: 'life-simulator',
    title: 'Life Skills Simulator',
    description: 'Practice real-world scenarios in a safe virtual environment',
    type: 'Simulation',
    players: '1-3 players',
    duration: '20-60 mins',
    difficulty: 'Medium',
    color: 'from-green-500 to-teal-600',
    icon: Globe,
    categories: ['Budget Management', 'Job Interviews', 'Housing Search', 'Social Situations', 'Emergency Response'],
    features: [
      'Realistic scenarios',
      'Decision-making practice',
      'Consequence modeling',
      'Skill assessment',
      'Personalized feedback'
    ],
    rewards: {
      points: 60,
      badge: 'Life Skills Pro'
    }
  },
  {
    id: 'social-adventures',
    title: 'Social Adventures',
    description: 'Multiplayer adventures that build teamwork and communication',
    type: 'Social',
    players: '3-12 players',
    duration: '30-90 mins',
    difficulty: 'Medium',
    color: 'from-teal-500 to-cyan-600',
    icon: Users2,
    categories: ['Team Challenges', 'Role Playing', 'Problem Solving', 'Communication Games', 'Trust Building'],
    features: [
      'Real-time collaboration',
      'Voice and text chat',
      'Character customization',
      'Story-driven adventures',
      'Social skill metrics'
    ],
    rewards: {
      points: 50,
      badge: 'Social Butterfly'
    }
  },
  {
    id: 'wellness-quest',
    title: 'Wellness Quest',
    description: 'Gamified approach to mental and physical wellbeing',
    type: 'Wellness',
    players: '1-10 players',
    duration: '10-30 mins',
    difficulty: 'Easy',
    color: 'from-pink-500 to-rose-600',
    icon: Medal,
    categories: ['Mindfulness', 'Exercise', 'Nutrition', 'Sleep', 'Stress Management'],
    features: [
      'Guided meditation',
      'Fitness challenges',
      'Mood tracking',
      'Healthy habit building',
      'Progress visualization'
    ],
    rewards: {
      points: 35,
      badge: 'Wellness Warrior'
    }
  },
  {
    id: 'future-planner',
    title: 'Future Planner',
    description: 'Interactive career and education planning game',
    type: 'Planning',
    players: '1-4 players',
    duration: '25-45 mins',
    difficulty: 'Medium',
    color: 'from-indigo-500 to-purple-600',
    icon: TrendingUp,
    categories: ['Career Planning', 'Education', 'Goal Setting', 'Financial Planning', 'Skills Assessment'],
    features: [
      'Career exploration tools',
      'Education pathway mapping',
      'Goal setting workshops',
      'Skills gap analysis',
      'Future scenario planning'
    ],
    rewards: {
      points: 55,
      badge: 'Future Ready'
    }
  },
  {
    id: 'emotion-explorer',
    title: 'Emotion Explorer',
    description: 'Learn to identify, understand and manage emotions effectively',
    type: 'Emotional',
    players: '1-6 players',
    duration: '15-25 mins',
    difficulty: 'Easy',
    color: 'from-rose-500 to-pink-600',
    icon: Heart,
    categories: ['Emotional Intelligence', 'Self-Awareness', 'Communication', 'Empathy', 'Mindfulness'],
    features: [
      'Emotion recognition activities',
      'Coping strategy builder',
      'Empathy development exercises',
      'Peer emotion sharing',
      'Mindful response practice'
    ],
    rewards: {
      points: 30,
      badge: 'Emotion Master'
    }
  }
];

const achievements: Achievement[] = [
  { 
    id: 1, 
    title: 'First Steps', 
    description: 'Complete your first challenge', 
    icon: Star, 
    earned: false, 
    progress: 0,
    requirement: 1,
    points: 10,
    category: 'Milestone',
    date: null
  },
  { 
    id: 2, 
    title: 'Kind Heart', 
    description: 'Complete 3 kindness challenges', 
    icon: Heart, 
    earned: false,
    progress: 0,
    requirement: 3,
    points: 25,
    category: 'Values',
    date: null
  },
  { 
    id: 3, 
    title: 'Digital Native', 
    description: 'Master digital wellbeing activities', 
    icon: Target, 
    earned: false,
    progress: 0,
    requirement: 5,
    points: 50,
    category: 'Digital Skills',
    date: null
  },
  { 
    id: 4, 
    title: 'Community Builder', 
    description: 'Participate in 5 group activities', 
    icon: Users, 
    earned: false,
    progress: 0,
    requirement: 5,
    points: 40,
    category: 'Social',
    date: null
  },
  { 
    id: 5, 
    title: 'Life Skills Champion', 
    description: 'Complete independent living challenges', 
    icon: Award, 
    earned: false,
    progress: 0,
    requirement: 3,
    points: 75,
    category: 'Life Skills',
    date: null
  },
  { 
    id: 6, 
    title: 'Creative Soul', 
    description: 'Express yourself through 3 creative projects', 
    icon: Sparkles, 
    earned: false,
    progress: 0,
    requirement: 3,
    points: 30,
    category: 'Creative',
    date: null
  },
  { 
    id: 7, 
    title: 'Support Network', 
    description: 'Help 5 peers with their challenges', 
    icon: Handshake, 
    earned: false,
    progress: 0,
    requirement: 5,
    points: 45,
    category: 'Community',
    date: null
  },
  { 
    id: 8, 
    title: 'Communication Pro', 
    description: 'Master all communication challenges', 
    icon: MessageCircle, 
    earned: false,
    progress: 0,
    requirement: 4,
    points: 60,
    category: 'Communication',
    date: null
  },
  { 
    id: 9, 
    title: 'Wellness Advocate', 
    description: 'Complete 10 wellbeing activities', 
    icon: Medal, 
    earned: false,
    progress: 0,
    requirement: 10,
    points: 80,
    category: 'Wellness',
    date: null
  },
  { 
    id: 10, 
    title: 'Future Ready', 
    description: 'Complete career preparation activities', 
    icon: TrendingUp, 
    earned: false,
    progress: 0,
    requirement: 6,
    points: 100,
    category: 'Career',
    date: null
  },
  { 
    id: 11, 
    title: 'Mindful Living', 
    description: 'Practice mindfulness and emotional awareness daily', 
    icon: Lightbulb, 
    earned: false,
    progress: 0,
    requirement: 7,
    points: 35,
    category: 'Mental Health',
    date: null
  },
  { 
    id: 12, 
    title: 'Game Champion', 
    description: 'Complete 8 different interactive games', 
    icon: Gamepad2, 
    earned: false,
    progress: 0,
    requirement: 8,
    points: 65,
    category: 'Gaming',
    date: null
  },
  { 
    id: 13, 
    title: 'Transition Hero', 
    description: 'Successfully complete transition planning scenarios', 
    icon: Star, 
    earned: false,
    progress: 0,
    requirement: 2,
    points: 85,
    category: 'Life Skills',
    date: null
  },
];

const getLeaderboard = (userName: string) => [
  { rank: 1, name: userName || 'You', points: 0, streak: 0, badge: 'Getting Started' },
];

const socialScenarios = [
  {
    id: 'new-resident-welcome',
    title: 'Welcome New Resident',
    description: 'Help a new young person feel welcomed and supported',
    steps: [
      {
        description: 'A new resident has just arrived and looks nervous. What\'s the best way to help them?',
        options: [
          { text: 'Introduce yourself warmly and offer to show them around', points: 10 },
          { text: 'Give them space but let them know you\'re available if needed', points: 8 },
          { text: 'Invite them to join your group immediately', points: 6 }
        ]
      },
      {
        description: 'They mention feeling homesick. How can you support them?',
        options: [
          { text: 'Share your own experience and listen to theirs', points: 12 },
          { text: 'Suggest fun activities to take their mind off it', points: 8 },
          { text: 'Tell them it gets better with time', points: 6 }
        ]
      },
      {
        description: 'At dinner, they sit alone. What do you do?',
        options: [
          { text: 'Invite them to sit with your group and include them in conversation', points: 15 },
          { text: 'Ask a staff member to check on them', points: 7 },
          { text: 'Wait to see if they approach others first', points: 4 }
        ]
      }
    ]
  },
  {
    id: 'conflict-resolution',
    title: 'Resolving Conflicts',
    description: 'Navigate a disagreement between residents with empathy',
    steps: [
      {
        description: 'Two residents are arguing loudly in the common room. What\'s your approach?',
        options: [
          { text: 'Calmly ask if you can help them work it out', points: 10 },
          { text: 'Get a staff member immediately', points: 8 },
          { text: 'Try to distract them with something else', points: 5 }
        ]
      },
      {
        description: 'Both people want to explain their side at the same time. How do you help?',
        options: [
          { text: 'Suggest each person takes turns speaking while the other listens', points: 15 },
          { text: 'Ask them to take a break and cool down first', points: 10 },
          { text: 'Help them find a compromise quickly', points: 8 }
        ]
      },
      {
        description: 'One person starts getting emotional. What do you do?',
        options: [
          { text: 'Acknowledge their feelings and offer support', points: 12 },
          { text: 'Suggest they take some time to process', points: 9 },
          { text: 'Focus on finding a practical solution', points: 6 }
        ]
      }
    ]
  },
  {
    id: 'support-friend',
    title: 'Supporting a Friend',
    description: 'Help a friend who is going through a difficult time',
    steps: [
      {
        description: 'Your friend seems upset and withdrawn lately. What\'s your first move?',
        options: [
          { text: 'Ask them gently if they want to talk about what\'s bothering them', points: 10 },
          { text: 'Give them some space but let them know you\'re there for them', points: 8 },
          { text: 'Try to cheer them up with jokes or activities', points: 5 }
        ]
      }
    ]
  },
  {
    id: 'transition-planning',
    title: 'Planning Your Future',
    description: 'Navigate decisions about your transition to independent living',
    steps: [
      {
        description: 'You\'re turning 17 and staff want to start planning your transition. How do you feel about this conversation?',
        options: [
          { text: 'I\'m excited but nervous - I want to be involved in planning my future', points: 12 },
          { text: 'I feel overwhelmed - can we take it slowly and break it down?', points: 10 },
          { text: 'I don\'t want to think about it yet - I\'m not ready', points: 6 }
        ]
      },
      {
        description: 'They ask about your goals for after leaving care. What\'s most important to you right now?',
        options: [
          { text: 'I want to continue my education and get qualifications', points: 15 },
          { text: 'I need to focus on finding stable housing and support first', points: 12 },
          { text: 'I want to maintain relationships with people who care about me', points: 14 }
        ]
      }
    ]
  },
  {
    id: 'education-choices',
    title: 'Making Education Decisions',
    description: 'Navigate choices about your education and future learning',
    steps: [
      {
        description: 'Your teacher suggests you could apply for college, but you\'re not sure if it\'s right for you. What do you do?',
        options: [
          { text: 'Ask about different options and what support would be available', points: 14 },
          { text: 'Say you need time to think and research what interests you', points: 12 },
          { text: 'Feel pressured and say you\'re not academic enough for college', points: 8 }
        ]
      }
    ]
  }
];

export default function FamilyGaming({ onBack, user }: FamilyGamingProps) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedGameState, setSelectedGameState] = useState<any>(null);
  const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('games');
  
  // Story Collections States
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [showStoryPlayer, setShowStoryPlayer] = useState(false);
  const [audioRef] = useState(new Audio());
  const [isStoryPlaying, setIsStoryPlaying] = useState(false);
  const [storyCurrentTime, setStoryCurrentTime] = useState(0);
  const [storyDuration, setStoryDuration] = useState(0);
  const [storyVolume, setStoryVolume] = useState(0.7);
  
  // Interactive Game States
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // Social Adventures Game States
  const [socialScenario, setSocialScenario] = useState<any>(null);
  const [socialStep, setSocialStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Memory Game States
  const [memorySequence, setMemorySequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [showingSequence, setShowingSequence] = useState(false);
  const [memoryLevel, setMemoryLevel] = useState(1);
  
  // Creative Studio States
  const [creativeMode, setCreativeMode] = useState<'art' | 'music' | 'story' | 'photo'>('art');
  const [creativeProject, setCreativeProject] = useState<{title: string, description: string, content: string}>({ title: '', description: '', content: '' });
  
  // Life Skills Simulator States
  const [lifeSkillScenario, setLifeSkillScenario] = useState<any>(null);
  const [scenarioStep, setScenarioStep] = useState(0);
  
  // Activity States
  const [joinedActivities, setJoinedActivities] = useState<string[]>([]);
  const [activityParticipants, setActivityParticipants] = useState<Record<string, string[]>>({});
  
  // Challenge States
  const [activeChallenges, setActiveChallenges] = useState<string[]>([]);
  const [challengeProgress, setChallengeProgress] = useState<Record<string, number>>({});
  
  // Trivia Questions for Trivia Master Game
  const triviaQuestions = [
    {
      question: "What's an important skill when living with others?",
      options: ["Sharing responsibilities", "Avoiding others", "Being loud", "Taking everything"],
      correct: 0,
      category: "Life Skills"
    },
    {
      question: "How can you best support a friend who's feeling sad?",
      options: ["Tell them to get over it", "Listen and offer comfort", "Ignore them", "Make jokes about it"],
      correct: 1,
      category: "Emotional Support"
    },
    {
      question: "What's a healthy way to handle disagreements?",
      options: ["Yell louder", "Walk away angry", "Talk calmly and listen", "Give silent treatment"],
      correct: 2,
      category: "Conflict Resolution"
    },
    {
      question: "Which activity helps build community bonds?",
      options: ["Staying in your room", "Group cooking sessions", "Avoiding shared spaces", "Competing against everyone"],
      correct: 1,
      category: "Community Building"
    },
    {
      question: "What's the best way to prepare for independence?",
      options: ["Wait for others to do things", "Practice daily life skills", "Avoid responsibilities", "Depend on staff only"],
      correct: 1,
      category: "Independence"
    }
  ];

  // Life Skills Scenarios
  const lifeSkillScenarios = [
    {
      id: 'budget-management',
      title: 'Managing Your First Budget',
      description: 'Learn to manage money when living independently',
      steps: [
        {
          situation: "You've just moved into your first flat and received your first monthly allowance of £800. You need to plan your budget.",
          question: "What should be your first priority?",
          options: [
            "Buy new clothes and entertainment items",
            "List all essential expenses first (rent, utilities, food)",
            "Save all the money for later",
            "Spend it quickly before you lose track"
          ],
          correct: 1,
          feedback: "Great! Listing essential expenses first helps you understand what you must pay for before considering wants.",
          points: 15
        },
        {
          situation: "Your essential expenses are: Rent £400, Utilities £80, Food £120, Transport £60. That's £660 total, leaving £140.",
          question: "How should you handle the remaining £140?",
          options: [
            "Spend it all on entertainment",
            "Set aside £40 for emergencies and use £100 for personal items",
            "Save it all and buy no personal items",
            "Give it all to friends"
          ],
          correct: 1,
          feedback: "Perfect! Emergency savings are crucial, and budgeting some money for personal needs helps you stick to your budget.",
          points: 20
        }
      ]
    },
    {
      id: 'job-interview',
      title: 'Job Interview Skills',
      description: 'Practice professional interview techniques',
      steps: [
        {
          situation: "You have a job interview tomorrow for a retail position. You need to prepare.",
          question: "What's the most important thing to research beforehand?",
          options: [
            "The company's values and what the role involves",
            "How much money you can ask for",
            "What other employees look like",
            "The nearest coffee shop"
          ],
          correct: 0,
          feedback: "Excellent! Understanding the company and role shows genuine interest and helps you answer questions better.",
          points: 15
        },
        {
          situation: "During the interview, they ask: 'Why do you want to work here?'",
          question: "What's the best response?",
          options: [
            "I need money",
            "It's close to where I live",
            "I'm interested in retail and believe I can contribute to your team while developing my customer service skills",
            "My friend works here"
          ],
          correct: 2,
          feedback: "Perfect! This shows enthusiasm for the role and demonstrates how you can add value to their team.",
          points: 20
        }
      ]
    }
  ];

  // Story Collections Data
  const storyCollections = [
    {
      id: 1,
      title: "My Keys, My Future",
      description: "An empowering story about a young person taking charge of their transition to independence, focusing on self-advocacy, skill-building, and maintaining chosen family connections beyond care.",
      duration: "14:45",
      category: "Life Transitions",
      audioFile: "/my-keys-my-future.mp3",
      emotionalTags: ["empowering", "future-focused", "choice-driven", "relationship-centered"],
      discussionPrompts: [
        "How do young people define 'independence' for themselves?",
        "What does successful transition look like from a young person's perspective?",
        "How can we support young people to maintain caring relationships after leaving care?",
        "What role does self-advocacy play in successful transitions?"
      ],
      resources: [
        "Independence Skills Checklist",
        "Transition Planning Template",
        "Maintaining Relationships Guide",
        "Self-Advocacy Toolkit"
      ]
    },
    {
      id: 2,
      title: "The Day Everything Changed",
      description: "A transformative story told from multiple perspectives - a young person, their family, and care staff - about a breakthrough moment that changed everything.",
      duration: "16:30",
      category: "Transformation",
      audioFile: "/the-day-everything-changed.mp3",
      emotionalTags: ["transformative", "hopeful", "multi-perspective", "healing-focused"],
      discussionPrompts: [
        "What creates breakthrough moments in care relationships?",
        "How do small gestures of understanding create lasting change?",
        "What does healing look like from different perspectives?",
        "How can families, staff, and young people work together as a healing team?"
      ],
      resources: [
        "Breakthrough Moments Guide",
        "Multi-Perspective Assessment",
        "Family Collaboration Toolkit",
        "Healing-Centered Practice Framework"
      ]
    },
    {
      id: 3,
      title: "My Teddy Knows Secrets",
      description: "A gentle story about childhood comfort objects and the role they play in healing and security.",
      duration: "6:45",
      category: "Child Development",
      audioFile: "/teddy-secrets.mp3",
      emotionalTags: ["gentle", "childhood", "comfort", "healing"],
      discussionPrompts: [
        "Why are comfort objects so important for children in care?",
        "How do we respect and protect these special attachments?",
        "What role do transitional objects play in healing from trauma?",
        "How can we create environments where children feel safe to express their needs?"
      ],
      resources: [
        "Comfort Objects in Care Guide",
        "Child Development Milestones",
        "Trauma-Informed Comfort Strategies",
        "Creating Safe Spaces Checklist"
      ]
    },
    {
      id: 4,
      title: "Broken Mirrors",
      description: "A moving story about a child in care, exploring themes of identity, resilience, and hope through personal experiences and challenges.",
      duration: "12:45",
      category: "Personal Journey",
      audioFile: "/BROKEN MIRRORS.mp3",
      emotionalTags: ["hopeful", "challenging", "inspiring", "real"],
      discussionPrompts: [
        "What does 'identity' mean in the context of being in care?",
        "How do children in care develop resilience?",
        "What support systems are most effective for young people in care?",
        "How can we better understand the emotional journey of children in care?"
      ],
      resources: [
        "Identity Development in Care",
        "Resilience Building Activities",
        "Support System Mapping",
        "Emotional Journey Timeline"
      ]
    },
    {
      id: 5,
      title: "Once upon a time",
      description: "A thoughtful narrative exploring themes of childhood, transformation, and the power of storytelling in healing and growth.",
      duration: "15:30",
      category: "Growth & Healing",
      audioFile: "/Once upon a time....mp3",
      emotionalTags: ["magical", "healing", "transformative", "gentle"],
      discussionPrompts: [
        "How do stories help us process difficult experiences?",
        "What role does imagination play in coping with trauma?",
        "How can we use narrative therapy in care settings?",
        "What makes a story therapeutic versus just entertaining?"
      ],
      resources: [
        "Narrative Therapy Techniques",
        "Storytelling for Healing",
        "Creative Expression Activities",
        "Therapeutic Storytelling Guide"
      ]
    },
    {
      id: 6,
      title: "Inside Voices",
      description: "An intimate exploration of internal dialogue, self-talk, and the journey toward self-compassion and inner strength.",
      duration: "18:20",
      category: "Self-Awareness",
      audioFile: "/Inside Voices.mp3",
      emotionalTags: ["introspective", "empowering", "mindful", "healing"],
      discussionPrompts: [
        "How do negative internal voices develop in vulnerable young people?",
        "What techniques help transform critical self-talk into supportive dialogue?",
        "How can care providers model positive self-talk?",
        "What role does mindfulness play in managing internal voices?"
      ],
      resources: [
        "Self-Talk Assessment Tool",
        "Mindfulness Practices Guide",
        "Inner Voice Transformation Exercises",
        "Self-Compassion Techniques"
      ]
    }
  ];
  
  const leaderboard = getLeaderboard(user?.name);

  // Story Audio Handler Functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStoryPlayPause = () => {
    if (isStoryPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
    setIsStoryPlaying(!isStoryPlaying);
  };

  const handleStoryRestart = () => {
    audioRef.currentTime = 0;
    setStoryCurrentTime(0);
  };

  const handleVolumeChange = (value: number[]) => {
    setStoryVolume(value[0]);
    audioRef.volume = value[0];
  };

  const openStoryPlayer = (story: any) => {
    setSelectedStory(story);
    setShowStoryPlayer(true);
    audioRef.src = story.audioFile;
    audioRef.load();
    
    audioRef.addEventListener('loadedmetadata', () => {
      setStoryDuration(audioRef.duration);
    });
    
    audioRef.addEventListener('timeupdate', () => {
      setStoryCurrentTime(audioRef.currentTime);
    });
    
    audioRef.addEventListener('ended', () => {
      setIsStoryPlaying(false);
    });
  };

  const closeStoryPlayer = () => {
    audioRef.pause();
    setIsStoryPlaying(false);
    setShowStoryPlayer(false);
    setSelectedStory(null);
  };

  // Game Handler Functions
  const startGame = () => {
    setIsPlaying(true);
    setGameScore(0);
    setCurrentQuestion(0);
  };

  const handleAnswer = (selectedAnswer: number) => {
    if (selectedAnswer === triviaQuestions[currentQuestion].correct) {
      setGameScore(prev => prev + 20);
    }
    
    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Game finished
      setTimeout(() => {
        setIsPlaying(false);
        alert(`Game Complete! Your score: ${gameScore + (selectedAnswer === triviaQuestions[currentQuestion].correct ? 20 : 0)}/100`);
      }, 1000);
    }
  };

  const exitGame = () => {
    setIsPlaying(false);
    setGameScore(0);
    setCurrentQuestion(0);
    // Reset memory game states
    setMemorySequence([]);
    setPlayerSequence([]);
    setShowingSequence(false);
    setMemoryLevel(1);
    // Reset creative studio states
    setCreativeMode('art');
    setCreativeProject({ title: '', description: '', content: '' });
  };

  // Memory Palace Game Functions
  const startMemoryRound = () => {
    const sequenceLength = memoryLevel + 2;
    const newSequence = Array.from({ length: sequenceLength }, () => 
      Math.floor(Math.random() * 9)
    );
    setMemorySequence(newSequence);
    setPlayerSequence([]);
    setShowingSequence(true);
    
    // Show sequence for a brief time
    setTimeout(() => {
      setShowingSequence(false);
    }, sequenceLength * 800 + 1000);
  };

  const handleMemoryTileClick = (tileIndex: number) => {
    if (showingSequence) return;
    
    const newPlayerSequence = [...playerSequence, tileIndex];
    setPlayerSequence(newPlayerSequence);
    
    // Check if this click is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== memorySequence[newPlayerSequence.length - 1]) {
      // Wrong sequence - game over
      setTimeout(() => {
        alert(`Wrong sequence! You reached level ${memoryLevel}. Final score: ${gameScore}`);
        setIsPlaying(false);
        setGameScore(0);
        setMemoryLevel(1);
        setMemorySequence([]);
        setPlayerSequence([]);
      }, 500);
      return;
    }
    
    // Check if sequence is complete
    if (newPlayerSequence.length === memorySequence.length) {
      // Level completed!
      const levelPoints = memoryLevel * 10 + 20;
      setGameScore(prev => prev + levelPoints);
      setMemoryLevel(prev => prev + 1);
      
      setTimeout(() => {
        startMemoryRound();
      }, 1000);
    }
  };

  // Activity Handler Functions
  const joinActivity = (activityId: string) => {
    if (!joinedActivities.includes(activityId)) {
      setJoinedActivities(prev => [...prev, activityId]);
      setActivityParticipants(prev => ({
        ...prev,
        [activityId]: [...(prev[activityId] || []), user?.name || 'You']
      }));
    }
  };

  const leaveActivity = (activityId: string) => {
    setJoinedActivities(prev => prev.filter(id => id !== activityId));
    setActivityParticipants(prev => ({
      ...prev,
      [activityId]: (prev[activityId] || []).filter(name => name !== (user?.name || 'You'))
    }));
  };

  // Challenge Handler Functions
  const startChallenge = (challengeId: string) => {
    if (!activeChallenges.includes(challengeId)) {
      setActiveChallenges(prev => [...prev, challengeId]);
      setChallengeProgress(prev => ({
        ...prev,
        [challengeId]: 0
      }));
    }
  };

  const stopChallenge = (challengeId: string) => {
    setActiveChallenges(prev => prev.filter(id => id !== challengeId));
  };

  const markTaskComplete = (challengeId: string) => {
    setChallengeProgress(prev => {
      const currentProgress = prev[challengeId] || 0;
      return {
        ...prev,
        [challengeId]: currentProgress + 1
      };
    });
  };

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page)}>
      {/* Header */}
      <div className={combineThemeClasses("sticky top-0 z-10 border-b shadow-sm", okayitTheme.backgrounds.glass, "border-white/30 dark:border-purple-200/30")}>
        <div className="max-w-7xl mx-auto px-6 py-4">
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
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Family & Friends Hub
              </h1>
              <p className="text-sm text-gray-600">Games, Challenges & Achievements</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{totalPoints} pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Games
            </TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="group-activities">Group Activities</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="story-collections" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Stories
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Interactive Games</h2>
              <p className="text-gray-600">Engage, learn, and have fun with our collection of educational games</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map((game, index) => {
                const Icon = game.icon;
                return (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="h-full hover:shadow-md transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 group cursor-pointer"
                      onClick={() => {
                        setSelectedGame(game);
                        // Track game played
                        trackActivity('game', {
                          id: game.id,
                          title: game.title,
                          duration: game.duration || 0
                        });
                      }}
                    >
                      <div className={`h-2 bg-gradient-to-r ${game.color}`} />
                      
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {game.type}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <Star className="w-4 h-4" />
                              {game.rewards.points} pts
                            </div>
                          </div>
                          
                          <CardTitle className="text-lg font-bold text-gray-900">
                            {game.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {game.description}
                          </p>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {game.players}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {game.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {game.difficulty}
                            </div>
                            <div className="flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              {game.rewards.badge}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700">Categories:</p>
                            <div className="flex flex-wrap gap-1">
                              {game.categories.slice(0, 3).map((category, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs px-2 py-0">
                                  {category}
                                </Badge>
                              ))}
                              {game.categories.length > 3 && (
                                <Badge variant="secondary" className="text-xs px-2 py-0">
                                  +{game.categories.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Button className={`w-full bg-gradient-to-r ${game.color} hover:opacity-90 text-white`}>
                            <Play className="mr-2 w-4 h-4" />
                            Play Game
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Challenges</h2>
              <p className="text-gray-600">Build skills, earn points, and grow through meaningful challenges</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyChallenges.map((challenge, index) => {
                const Icon = challenge.icon;
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="h-full hover:shadow-md transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 group cursor-pointer"
                      onClick={() => setSelectedChallenge(challenge)}
                    >
                      <div className={`h-2 bg-gradient-to-r ${challenge.color}`} />
                      
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 bg-gradient-to-r ${challenge.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {challenge.difficulty}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <Trophy className="w-4 h-4" />
                              {challenge.points} pts
                            </div>
                          </div>
                          
                          <CardTitle className="text-lg font-bold text-gray-900">
                            {challenge.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {challenge.description}
                          </p>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {challenge.duration}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {challenge.category}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700">Tasks Preview:</p>
                            {challenge.tasks.slice(0, 3).map((task, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                {task}
                              </div>
                            ))}
                            {challenge.tasks.length > 3 && (
                              <p className="text-xs text-gray-500 italic">
                                +{challenge.tasks.length - 3} more tasks... Click to see all
                              </p>
                            )}
                          </div>

                          <Button className={`w-full bg-gradient-to-r ${challenge.color} hover:opacity-90 text-white`}>
                            <Play className="mr-2 w-4 h-4" />
                            View Challenge
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Group Activities Tab */}
          <TabsContent value="group-activities" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Group Activities</h2>
              <p className="text-gray-600">Connect, collaborate, and grow together with others</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {groupActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="h-full hover:shadow-md transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 group cursor-pointer"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <div className={`h-2 bg-gradient-to-r ${activity.color}`} />
                      
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${activity.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg font-bold text-gray-900">
                              {activity.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              <Users className="w-3 h-3 mr-1" />
                              {activity.participants}
                            </Badge>
                            <Badge variant="secondary">
                              {activity.category}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Activities Include:</p>
                            {activity.activities.slice(0, 4).map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                {item}
                              </div>
                            ))}
                            {activity.activities.length > 4 && (
                              <p className="text-xs text-gray-500 italic">
                                +{activity.activities.length - 4} more activities... Click to see all
                              </p>
                            )}
                          </div>

                          <Button className={`w-full bg-gradient-to-r ${activity.color} hover:opacity-90 text-white`}>
                            <Users className="mr-2 w-4 h-4" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Achievements</h2>
              <p className="text-gray-600">Track your progress and celebrate your accomplishments</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className="h-full hover:shadow-md transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105 group cursor-pointer"
                      onClick={() => setSelectedAchievement(achievement)}
                    >
                      <div className={`h-2 ${achievement.earned ? 'bg-gradient-to-r from-yellow-400 to-green-500' : 'bg-gray-200'}`} />
                      
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 ${
                          achievement.earned 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                            : 'bg-gray-200'
                        }`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant={achievement.earned ? "default" : "secondary"} className="text-xs">
                              {achievement.category}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-yellow-600">
                              <Trophy className="w-4 h-4" />
                              {achievement.points} pts
                            </div>
                          </div>
                          
                          <CardTitle className="text-lg font-bold text-gray-900">
                            {achievement.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {achievement.description}
                          </p>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          {achievement.earned ? (
                            <div className="text-center space-y-2">
                              <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-semibold">Earned!</span>
                              </div>
                              {achievement.date && (
                                <p className="text-xs text-gray-500">
                                  Completed {new Date(achievement.date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.requirement}</span>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.requirement) * 100} 
                                className="h-2"
                              />
                              <p className="text-xs text-gray-500 text-center">
                                {achievement.requirement - achievement.progress} more to go!
                              </p>
                            </div>
                          )}

                          <Button 
                            variant={achievement.earned ? "default" : "outline"} 
                            className="w-full"
                          >
                            {achievement.earned ? (
                              <>
                                <Trophy className="mr-2 w-4 h-4" />
                                View Achievement
                              </>
                            ) : (
                              <>
                                <Target className="mr-2 w-4 h-4" />
                                View Progress
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Community Feed */}
              <Card className="bg-white/80 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-500" />
                    Community Updates
                  </CardTitle>
                  <p className="text-sm text-gray-600">See what everyone's been up to!</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100 text-center">
                    <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-900">No community updates yet</p>
                    <p className="text-xs text-blue-600 mt-1">Play games and complete activities to see updates here!</p>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Library */}
              <Card className="bg-white/80 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    Resource Library
                  </CardTitle>
                  <p className="text-sm text-gray-600">Helpful resources for your journey</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-semibold text-sm text-blue-900 mb-2">Mental Health & Wellbeing</h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li>• Mindfulness exercises and techniques</li>
                        <li>• Stress management strategies</li>
                        <li>• Building resilience guides</li>
                        <li>• Sleep hygiene tips</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h4 className="font-semibold text-sm text-green-900 mb-2">Life Skills & Independence</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li>• Budgeting and financial literacy</li>
                        <li>• Job search and interview tips</li>
                        <li>• Healthy cooking recipes</li>
                        <li>• Time management tools</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <h4 className="font-semibold text-sm text-purple-900 mb-2">Digital Safety & Skills</h4>
                      <ul className="space-y-1 text-sm text-purple-700">
                        <li>• Online safety guidelines</li>
                        <li>• Social media best practices</li>
                        <li>• Digital literacy courses</li>
                        <li>• Privacy settings guides</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                      <h4 className="font-semibold text-sm text-orange-900 mb-2">Support Networks</h4>
                      <ul className="space-y-1 text-sm text-orange-700">
                        <li>• Crisis helpline numbers</li>
                        <li>• Local support services</li>
                        <li>• Mentorship programs</li>
                        <li>• Peer support groups</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Community Challenges */}
            <Card className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white">
              <CardContent className="py-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Monthly Community Challenge</h3>
                  <p className="text-purple-100">Everyone working together towards a common goal!</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Target className="w-6 h-6 mr-2" />
                      <span className="text-2xl font-bold">250</span>
                    </div>
                    <p className="text-purple-100">Acts of Kindness</p>
                    <p className="text-xs text-purple-200">Target: 300</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 mr-2" />
                      <span className="text-2xl font-bold">45</span>
                    </div>
                    <p className="text-purple-100">Group Activities</p>
                    <p className="text-xs text-purple-200">Target: 60</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-2">
                      <Sparkles className="w-6 h-6 mr-2" />
                      <span className="text-2xl font-bold">89%</span>
                    </div>
                    <p className="text-purple-100">Participation Rate</p>
                    <p className="text-xs text-purple-200">Target: 80%</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Progress value={83} className="h-3 bg-purple-600" />
                  <p className="text-center mt-2 text-sm text-purple-100">83% towards monthly goals!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievements & Badges</h2>
              <p className="text-gray-600">Track your progress and celebrate your accomplishments</p>
            </div>
            
            {/* Achievement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-green-500 to-teal-600 border-0 text-white">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{achievements.filter(a => a.earned).length}</div>
                  <div className="text-sm text-green-100">Earned</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 text-white">
                <CardContent className="p-6 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{achievements.filter(a => a.earned).reduce((total, a) => total + a.points, 0)}</div>
                  <div className="text-sm text-blue-100">Total Points</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-pink-600 border-0 text-white">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{Math.round((achievements.filter(a => a.earned).length / achievements.length) * 100)}%</div>
                  <div className="text-sm text-purple-100">Complete</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                const progressPercent = (achievement.progress / achievement.requirement) * 100;
                
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`transition-all duration-300 border-0 hover:scale-105 cursor-pointer ${
                        achievement.earned 
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg hover:shadow-md' 
                          : 'bg-white/80 backdrop-blur-sm hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedAchievement(achievement)}
                    >
                      <CardContent className="p-6">
                        {/* Header with icon and points */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            achievement.earned 
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                              : 'bg-gray-200'
                          }`}>
                            {achievement.earned ? (
                              <Icon className="w-7 h-7 text-white" />
                            ) : (
                              <Icon className="w-7 h-7 text-gray-500" />
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className={`text-lg font-bold ${achievement.earned ? 'text-orange-600' : 'text-gray-500'}`}>
                              {achievement.points} pts
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {achievement.category}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Title and description */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {achievement.description}
                          </p>
                        </div>
                        
                        {/* Progress bar for unearned achievements */}
                        {!achievement.earned && (
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.requirement}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progressPercent, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Status badge */}
                        <div className="flex items-center justify-between">
                          {achievement.earned ? (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Earned
                              </Badge>
                              {achievement.date && (
                                <span className="text-xs text-gray-500">
                                  {new Date(achievement.date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-gray-600">
                              <Clock className="w-3 h-3 mr-1" />
                              In Progress
                            </Badge>
                          )}
                          
                          {!achievement.earned && progressPercent >= 80 && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                              <Zap className="w-3 h-3 mr-1" />
                              Almost there!
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Story Collections Tab */}
          <TabsContent value="story-collections" className="mt-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Story Collections
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Discover inspiring audio stories designed to spark reflection, build empathy, and encourage meaningful discussions about life in care.
              </p>
            </div>

            {/* Disclaimer */}
            <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-gray-700 mb-2">
                      <strong>Disclaimer:</strong> These stories are works of fiction created solely for training and educational purposes. 
                      Any resemblance to actual people, events, or situations is purely coincidental.
                    </p>
                    <p className="text-gray-600 text-sm">
                      They are designed to encourage reflective practice, empathy, and professional development in care settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Story Tiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storyCollections.map((story) => (
                <motion.div
                  key={story.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-md transition-all duration-300 cursor-pointer group"
                    onClick={() => openStoryPlayer(story)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <Badge variant="secondary" className="text-xs">
                              {story.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {story.duration}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {story.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {story.description}
                      </p>
                      
                      {/* Emotional Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {story.emotionalTags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs px-2 py-1 text-purple-600 border-purple-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Play Button */}
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white group-hover:shadow-lg transition-all duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          openStoryPlayer(story);
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Listen & Discuss
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Story Player Modal */}
          <AnimatePresence>
            {showStoryPlayer && selectedStory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
                >
                  {/* Header */}
                  <div className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedStory.title}</h2>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="secondary">{selectedStory.category}</Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              {selectedStory.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={closeStoryPlayer}
                        className="rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <p className="text-gray-600">{selectedStory.description}</p>
                  </div>

                  {/* Audio Player */}
                  <div className="p-8 border-b border-gray-100">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div 
                          className="w-full h-2 bg-purple-200 rounded-full cursor-pointer"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const percentage = x / rect.width;
                            const newTime = percentage * storyDuration;
                            audioRef.currentTime = newTime;
                            setStoryCurrentTime(newTime);
                          }}
                        >
                          <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                            style={{ width: `${(storyCurrentTime / storyDuration) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mt-1">
                          <span>{formatTime(storyCurrentTime)}</span>
                          <span>{formatTime(storyDuration)}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleStoryRestart}
                          className="rounded-xl"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </Button>
                        
                        <Button
                          onClick={handleStoryPlayPause}
                          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-md transition-all duration-300"
                        >
                          {isStoryPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                        </Button>

                        <div className="flex items-center gap-2">
                          <Volume2 className="w-5 h-5 text-gray-600" />
                          <div className="w-20">
                            <Slider
                              value={[storyVolume]}
                              max={1}
                              step={0.1}
                              onValueChange={handleVolumeChange}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Discussion Prompts & Resources */}
                  <div className="p-8">
                    <Tabs defaultValue="discussion" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                        <TabsTrigger value="discussion">Discussion Prompts</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="discussion" className="mt-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Reflection Questions
                          </h3>
                          {selectedStory.discussionPrompts.map((prompt: string, index: number) => (
                            <Card key={index} className="bg-gray-50 border-0">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5" />
                                  <p className="text-gray-700">{prompt}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="resources" className="mt-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Additional Resources
                          </h3>
                          {selectedStory.resources.map((resource: string, index: number) => (
                            <Card key={index} className="bg-gray-50 border-0">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                    <p className="text-gray-700 font-medium">{resource}</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="rounded-xl">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="mt-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Monthly Leaderboard
                </CardTitle>
                <p className="text-gray-600">See how everyone is doing this month!</p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                        entry.name === user?.name
                          ? 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          entry.rank === 1 ? 'bg-yellow-400 text-white' :
                          entry.rank === 2 ? 'bg-purple-200 text-purple-700' :
                          entry.rank === 3 ? 'bg-orange-400 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {entry.rank <= 3 ? (
                            <Crown className="w-5 h-5" />
                          ) : (
                            <span className="font-bold">#{entry.rank}</span>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{entry.name}</span>
                            {entry.name === user?.name && (
                              <Badge variant="outline" className="text-xs">You</Badge>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {entry.badge}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-lg font-bold text-gray-900">
                          <Trophy className="w-5 h-5 text-yellow-500" />
                          {entry.points}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {entry.streak} day streak
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Game Detail Modal */}
      <Dialog open={selectedGame !== null} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedGame && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${selectedGame.color} rounded-2xl flex items-center justify-center`}>
                    <selectedGame.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">{selectedGame.title}</DialogTitle>
                    <p className="text-gray-600">{selectedGame.description}</p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Game Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-semibold">{selectedGame.players}</div>
                    <div className="text-xs text-gray-500">Players</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-semibold">{selectedGame.duration}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Target className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-semibold">{selectedGame.difficulty}</div>
                    <div className="text-xs text-gray-500">Difficulty</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <Star className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
                    <div className="text-sm font-semibold">{selectedGame.rewards.points} pts</div>
                    <div className="text-xs text-yellow-600">Reward</div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Game Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGame.categories.map((category, idx) => (
                      <Badge key={idx} variant="secondary" className="px-3 py-1">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedGame.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Game Interface */}
                {selectedGame.id === 'trivia-master' && !isPlaying && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={startGame}
                      className={`flex-1 bg-gradient-to-r ${selectedGame.color} hover:opacity-90 text-white`}
                    >
                      <Play className="mr-2 w-4 h-4" />
                      Play Now
                    </Button>
                    <Button variant="outline" className="px-6">
                      <Heart className="mr-2 w-4 h-4" />
                      Add to Favorites
                    </Button>
                  </div>
                )}

                {/* Trivia Game Interface */}
                {selectedGame.id === 'trivia-master' && isPlaying && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">
                          Question {currentQuestion + 1} of {triviaQuestions.length}
                        </div>
                        <div className="flex items-center gap-2 text-blue-600">
                          <Trophy className="w-4 h-4" />
                          <span className="font-semibold">{gameScore} points</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        {triviaQuestions[currentQuestion].question}
                      </h3>
                      
                      <div className="space-y-3">
                        {triviaQuestions[currentQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start text-left p-4 hover:bg-blue-100"
                            onClick={() => handleAnswer(index)}
                          >
                            <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={exitGame}
                        className="flex-1"
                      >
                        Exit Game
                      </Button>
                    </div>
                  </div>
                )}

                {/* Memory Palace Game */}
                {selectedGame.id === 'memory-palace' && !isPlaying && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => {
                        setIsPlaying(true);
                        setGameScore(0);
                        setMemoryLevel(1);
                        setMemorySequence([]);
                        setPlayerSequence([]);
                        startMemoryRound();
                      }}
                      className={`flex-1 bg-gradient-to-r ${selectedGame.color} hover:opacity-90 text-white`}
                    >
                      <Play className="mr-2 w-4 h-4" />
                      Start Memory Challenge
                    </Button>
                    <Button variant="outline" className="px-6">
                      <Heart className="mr-2 w-4 h-4" />
                      Add to Favorites
                    </Button>
                  </div>
                )}

                {/* Memory Palace Game Interface */}
                {selectedGame.id === 'memory-palace' && isPlaying && (
                  <div className="space-y-6">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">
                          Level {memoryLevel} • Sequence Length: {memoryLevel + 2}
                        </div>
                        <div className="flex items-center gap-2 text-purple-600">
                          <Trophy className="w-4 h-4" />
                          <span className="font-semibold">{gameScore} points</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-4 text-gray-800">
                        {showingSequence ? 'Watch the sequence!' : 'Repeat the pattern'}
                      </h3>
                      
                      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                        {Array.from({ length: 9 }).map((_, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            disabled={showingSequence}
                            className={`w-16 h-16 text-2xl font-bold transition-all duration-200 ${
                              memorySequence.includes(index) && showingSequence
                                ? 'bg-purple-200 border-purple-400 animate-pulse'
                                : 'hover:bg-purple-100'
                            }`}
                            onClick={() => handleMemoryTileClick(index)}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                          Your sequence: {playerSequence.map(i => i + 1).join(' → ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={exitGame}
                        className="flex-1"
                      >
                        Exit Game
                      </Button>
                    </div>
                  </div>
                )}

                {/* Creative Studio Game */}
                {selectedGame.id === 'creative-studio' && !isPlaying && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => {
                        setIsPlaying(true);
                        setGameScore(0);
                        setCreativeMode('art');
                        setCreativeProject({ title: '', description: '', content: '' });
                      }}
                      className={`flex-1 bg-gradient-to-r ${selectedGame.color} hover:opacity-90 text-white`}
                    >
                      <Play className="mr-2 w-4 h-4" />
                      Start Creating
                    </Button>
                    <Button variant="outline" className="px-6">
                      <Heart className="mr-2 w-4 h-4" />
                      Add to Favorites
                    </Button>
                  </div>
                )}

                {/* Creative Studio Game Interface */}
                {selectedGame.id === 'creative-studio' && isPlaying && (
                  <div className="space-y-6">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">
                          Creative Mode: {creativeMode.charAt(0).toUpperCase() + creativeMode.slice(1)}
                        </div>
                        <div className="flex items-center gap-2 text-orange-600">
                          <Trophy className="w-4 h-4" />
                          <span className="font-semibold">{gameScore} points</span>
                        </div>
                      </div>
                      
                      {/* Mode Selection */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-gray-800">Choose Your Creative Medium:</h4>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            { mode: 'art', icon: Palette, label: 'Digital Art' },
                            { mode: 'music', icon: Music, label: 'Music' },
                            { mode: 'story', icon: BookOpen, label: 'Story' },
                            { mode: 'photo', icon: Camera, label: 'Photography' }
                          ].map(({ mode, icon: Icon, label }) => (
                            <Button
                              key={mode}
                              variant={creativeMode === mode ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCreativeMode(mode as 'art' | 'music' | 'story' | 'photo')}
                              className="flex items-center gap-1"
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Project Creation Interface */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Project Title</label>
                          <input
                            type="text"
                            placeholder="Give your creation a name..."
                            value={creativeProject.title}
                            onChange={(e) => setCreativeProject(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium mb-1">
                            <span>
                              {creativeMode === 'art' && 'Describe your artwork'}
                              {creativeMode === 'music' && 'Describe your song or composition'}
                              {creativeMode === 'story' && 'Write your story'}
                              {creativeMode === 'photo' && 'Describe your photo concept'}
                            </span>
                            <VoiceInputButton onTranscript={(t) => setCreativeProject(prev => ({ ...prev, content: prev.content ? prev.content + ' ' + t : t }))} color="pink" />
                          </label>
                          <textarea
                            placeholder={
                              creativeMode === 'art' ? 'What colors, shapes, or emotions will your art express?' :
                              creativeMode === 'music' ? 'What mood or story will your music tell?' :
                              creativeMode === 'story' ? 'Write your creative story here...' :
                              'What will your photo capture? What story will it tell?'
                            }
                            value={creativeProject.content}
                            onChange={(e) => setCreativeProject(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full p-2 border rounded-md h-32 resize-none"
                          />
                        </div>

                        <Button
                          onClick={() => {
                            if (creativeProject.title && creativeProject.content) {
                              const points = creativeProject.content.length > 100 ? 40 : 25;
                              setGameScore(prev => prev + points);
                              setTimeout(() => {
                                alert(`Great work! You've created "${creativeProject.title}" and earned ${points} points!`);
                                setCreativeProject({ title: '', description: '', content: '' });
                              }, 500);
                            } else {
                              alert('Please add a title and description to complete your project!');
                            }
                          }}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Sparkles className="mr-2 w-4 h-4" />
                          Complete Project
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={exitGame}
                        className="flex-1"
                      >
                        Exit Studio
                      </Button>
                    </div>
                  </div>
                )}

                {/* Life Skills Simulator Game */}
                {selectedGame.id === 'life-simulator' && !isPlaying && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => {
                        setIsPlaying(true);
                        setGameScore(0);
                        setLifeSkillScenario(lifeSkillScenarios[0]);
                        setScenarioStep(0);
                      }}
                      className={`flex-1 bg-gradient-to-r ${selectedGame.color} hover:opacity-90 text-white`}
                    >
                      <Play className="mr-2 w-4 h-4" />
                      Start Simulation
                    </Button>
                    <Button variant="outline" className="px-6">
                      <Heart className="mr-2 w-4 h-4" />
                      Add to Favorites
                    </Button>
                  </div>
                )}

                {/* Social Adventures Game */}
                {selectedGame.id === 'social-adventures' && !isPlaying && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => {
                        setIsPlaying(true);
                        setGameScore(0);
                        setSocialScenario(socialScenarios[0]);
                        setSocialStep(0);
                      }}
                      className={`flex-1 bg-gradient-to-r ${selectedGame.color} hover:opacity-90 text-white`}
                    >
                      <Play className="mr-2 w-4 h-4" />
                      Join Adventure
                    </Button>
                    <Button variant="outline" className="px-6">
                      <Heart className="mr-2 w-4 h-4" />
                      Add to Favorites
                    </Button>
                  </div>
                )}

                {/* Social Adventures Game Interface */}
                {selectedGame.id === 'social-adventures' && isPlaying && (
                  <div className="space-y-6">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-600">
                          Adventure: {socialScenario?.title} • Step {socialStep + 1} of {socialScenario?.steps.length}
                        </div>
                        <div className="text-sm font-semibold text-teal-600">
                          Team Points: {gameScore}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-lg font-semibold text-gray-900">
                          {socialScenario?.steps[socialStep]?.description}
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {socialScenario?.steps[socialStep]?.options.map((option: any, idx: number) => (
                            <Button
                              key={idx}
                              variant="outline"
                              onClick={() => {
                                setGameScore(prev => prev + option.points);
                                if (socialStep < socialScenario.steps.length - 1) {
                                  setSocialStep(prev => prev + 1);
                                } else {
                                  const finalScore = gameScore + option.points;
                                  setIsPlaying(false);
                                  alert(`Adventure Complete! Final Score: ${finalScore}/37\n${finalScore > 30 ? 'Excellent teamwork and empathy!' : finalScore > 20 ? 'Good social skills!' : 'Keep practicing - you\'re learning!'}`);
                                }
                              }}
                              className="text-left p-4 h-auto hover:bg-teal-50"
                            >
                              <div className="flex justify-between items-center w-full">
                                <span>{option.text}</span>
                                <Badge variant="secondary" className="ml-2">{option.points} pts</Badge>
                              </div>
                            </Button>
                          ))}
                        </div>

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (socialStep > 0) {
                                setSocialStep(prev => prev - 1);
                              }
                            }}
                            disabled={socialStep === 0}
                            className="text-gray-600"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsPlaying(false)}
                            className="text-gray-600"
                          >
                            Exit Adventure
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Non-Interactive Game Buttons */}
                {selectedGame.id !== 'trivia-master' && selectedGame.id !== 'memory-palace' && selectedGame.id !== 'creative-studio' && selectedGame.id !== 'life-simulator' && selectedGame.id !== 'social-adventures' && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={() => {
                        hapticFeedback.impact('medium');
                        toast.success(`${selectedGame.title} is now available! Starting your experience...`);
                        // Simulate game launch
                        setTimeout(() => {
                          setSelectedGameState({ ...selectedGame, isPlaying: true });
                          toast.success('Experience launched successfully!');
                        }, 2000);
                      }}
                      className={`flex-1 bg-gradient-to-r ${selectedGame.color} hover:opacity-90 text-white`}
                    >
                      <Play className="mr-2 w-4 h-4" />
                      Start Experience
                    </Button>
                    <Button 
                      variant="outline" 
                      className="px-6"
                      onClick={() => {
                        hapticFeedback.selection();
                        // Toggle favorite status
                        const updatedFavorites = favoriteGames.includes(selectedGame.id) 
                          ? favoriteGames.filter(id => id !== selectedGame.id)
                          : [...favoriteGames, selectedGame.id];
                        setFavoriteGames(updatedFavorites);
                        toast.success(
                          favoriteGames.includes(selectedGame.id) 
                            ? 'Removed from favorites' 
                            : 'Added to favorites'
                        );
                      }}
                    >
                      <Heart className={`mr-2 w-4 h-4 ${favoriteGames.includes(selectedGame.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      {favoriteGames.includes(selectedGame.id) ? 'Favorited' : 'Add to Favorites'}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Challenge Detail Modal */}
      <Dialog open={selectedChallenge !== null} onOpenChange={() => setSelectedChallenge(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedChallenge && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${selectedChallenge.color} rounded-2xl flex items-center justify-center`}>
                    <selectedChallenge.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">{selectedChallenge.title}</DialogTitle>
                    <p className="text-gray-600">{selectedChallenge.description}</p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Challenge Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-semibold">{selectedChallenge.duration}</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <Target className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <div className="text-sm font-semibold">{selectedChallenge.difficulty}</div>
                    <div className="text-xs text-gray-500">Difficulty</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <BookOpen className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <div className="text-sm font-semibold">{selectedChallenge.category}</div>
                    <div className="text-xs text-purple-500">Category</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
                    <div className="text-sm font-semibold">{selectedChallenge.points} pts</div>
                    <div className="text-xs text-yellow-600">Reward</div>
                  </div>
                </div>

                {/* Progress Bar for Active Challenges */}
                {activeChallenges.includes(selectedChallenge.id) && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-green-800">Challenge Progress</span>
                      <span className="text-sm text-green-600">
                        {challengeProgress[selectedChallenge.id] || 0}/{selectedChallenge.tasks.length}
                      </span>
                    </div>
                    <Progress 
                      value={((challengeProgress[selectedChallenge.id] || 0) / selectedChallenge.tasks.length) * 100}
                      className="h-3"
                    />
                  </div>
                )}

                {/* Interactive Tasks */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Challenge Tasks ({selectedChallenge.tasks.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedChallenge.tasks.map((task, idx) => {
                      const isCompleted = (challengeProgress[selectedChallenge.id] || 0) > idx;
                      const isActive = activeChallenges.includes(selectedChallenge.id);
                      const isCurrentTask = (challengeProgress[selectedChallenge.id] || 0) === idx && isActive;
                      
                      return (
                        <div 
                          key={idx} 
                          className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                            isCompleted ? 'bg-green-50 border border-green-200' :
                            isCurrentTask ? 'bg-blue-50 border border-blue-200' :
                            'bg-gray-50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold mt-0.5 ${
                            isCompleted ? 'bg-green-500 text-white' :
                            isCurrentTask ? 'bg-blue-500 text-white' :
                            'bg-purple-500 text-white'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-sm flex-1 ${isCompleted ? 'text-green-800' : ''}`}>
                            {task}
                          </span>
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : isCurrentTask ? (
                            <Button
                              size="sm"
                              onClick={() => markTaskComplete(selectedChallenge.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 h-auto"
                            >
                              Complete
                            </Button>
                          ) : (
                            <CheckCircle className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {activeChallenges.includes(selectedChallenge.id) ? (
                    <Button 
                      variant="outline" 
                      onClick={() => stopChallenge(selectedChallenge.id)}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="mr-2 w-4 h-4" />
                      Stop Challenge
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => startChallenge(selectedChallenge.id)}
                      className={`flex-1 bg-gradient-to-r ${selectedChallenge.color} hover:opacity-90 text-white`}
                    >
                      <Play className="mr-2 w-4 h-4" />
                      Start Challenge
                    </Button>
                  )}
                  <Button variant="outline" className="px-6">
                    <Calendar className="mr-2 w-4 h-4" />
                    Schedule Later
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Activity Detail Modal */}
      <Dialog open={selectedActivity !== null} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedActivity && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${selectedActivity.color} rounded-2xl flex items-center justify-center`}>
                    <selectedActivity.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">{selectedActivity.title}</DialogTitle>
                    <p className="text-gray-600">{selectedActivity.description}</p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Activity Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="text-lg font-semibold">{selectedActivity.participants}</div>
                    <div className="text-sm text-gray-500">Participants</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-lg font-semibold">{selectedActivity.category}</div>
                    <div className="text-sm text-purple-500">Category</div>
                  </div>
                </div>

                {/* All Activities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Included Activities</h3>
                  <div className="space-y-3">
                    {selectedActivity.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <span className="text-sm flex-1">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Participants */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Current Participants</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        {activityParticipants[selectedActivity.id]?.length || 0} people joined
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activityParticipants[selectedActivity.id]?.map((participant, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-100 text-blue-800">
                          {participant}
                        </Badge>
                      ))}
                      {(!activityParticipants[selectedActivity.id] || activityParticipants[selectedActivity.id].length === 0) && (
                        <span className="text-gray-500 text-sm">Be the first to join!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {joinedActivities.includes(selectedActivity.id) ? (
                    <Button 
                      variant="outline" 
                      onClick={() => leaveActivity(selectedActivity.id)}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <UserMinus className="mr-2 w-4 h-4" />
                      Leave Activity
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => joinActivity(selectedActivity.id)}
                      className={`flex-1 bg-gradient-to-r ${selectedActivity.color} hover:opacity-90 text-white`}
                    >
                      <UserPlus className="mr-2 w-4 h-4" />
                      Join Activity
                    </Button>
                  )}
                  <Button variant="outline" className="px-6">
                    <MessageCircle className="mr-2 w-4 h-4" />
                    Ask Questions
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Achievement Detail Modal */}
      <Dialog open={selectedAchievement !== null} onOpenChange={() => setSelectedAchievement(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAchievement && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
                    selectedAchievement.earned 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                      : 'bg-gray-200'
                  }`}>
                    <selectedAchievement.icon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold">{selectedAchievement.title}</DialogTitle>
                    <p className="text-gray-600">{selectedAchievement.description}</p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Achievement Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                    <div className="text-lg font-semibold">{selectedAchievement.points}</div>
                    <div className="text-sm text-gray-500">Points</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <Target className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-lg font-semibold">{selectedAchievement.category}</div>
                    <div className="text-sm text-purple-500">Category</div>
                  </div>
                  <div className={`p-4 rounded-lg text-center ${
                    selectedAchievement.earned ? 'bg-green-50' : 'bg-blue-50'
                  }`}>
                    {selectedAchievement.earned ? (
                      <>
                        <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                        <div className="text-lg font-semibold">Earned</div>
                        <div className="text-sm text-green-500">
                          {selectedAchievement.date ? new Date(selectedAchievement.date).toLocaleDateString() : ''}
                        </div>
                      </>
                    ) : (
                      <>
                        <Clock className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <div className="text-lg font-semibold">{selectedAchievement.progress}/{selectedAchievement.requirement}</div>
                        <div className="text-sm text-blue-500">Progress</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Bar for Unearned */}
                {!selectedAchievement.earned && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress to Achievement</span>
                      <span>{Math.round((selectedAchievement.progress / selectedAchievement.requirement) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((selectedAchievement.progress / selectedAchievement.requirement) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedAchievement.requirement - selectedAchievement.progress} more to go!
                    </div>
                  </div>
                )}

                {/* Next Steps */}
                {!selectedAchievement.earned && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      How to earn this achievement
                    </h4>
                    <p className="text-sm text-blue-800">
                      Continue participating in {selectedAchievement.category.toLowerCase()} activities and challenges to make progress toward this achievement.
                    </p>
                  </div>
                )}

                {selectedAchievement.earned && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
                    <h4 className="font-bold text-green-900 mb-1">Congratulations!</h4>
                    <p className="text-sm text-green-800">
                      You've successfully earned this achievement and gained {selectedAchievement.points} points!
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
