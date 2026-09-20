
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Bookmark,
  Heart,
  Star,
  PenTool,
  Headphones,
  Moon,
  Sun,
  Award,
  Trophy,
  Gift,
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Music,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Download,
  Users,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import VoiceInputButton from '@/components/voice-input-button';

interface EnhancedStoryExperienceProps {
  onBack: () => void;
}

interface Story {
  id: number;
  title: string;
  description: string;
  duration: string;
  author: string;
  category: string;
  isAvailable: boolean;
  audioFile: string;
  discussionPoints: string[];
  exercises: Array<{
    title: string;
    description: string;
    type: 'reflection' | 'discussion' | 'activity';
  }>;
  learningObjectives: string[];
  emotionalTags: string[];
}

export default function EnhancedStoryExperience({ onBack }: EnhancedStoryExperienceProps) {
  // Audio controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([0.7]);
  const [currentStoryId, setCurrentStoryId] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Experience enhancement
  const [personalNotes, setPersonalNotes] = useState<{ [key: number]: string }>({});
  const [bookmarks, setBookmarks] = useState<{ [key: number]: number[] }>({});
  const [completedStories, setCompletedStories] = useState<number[]>([]);
  const [favoriteStories, setFavoriteStories] = useState<number[]>([]);
  const [listeningMood, setListeningMood] = useState<'calm' | 'focused' | 'reflective' | 'energized'>('reflective');
  const [ambientMode, setAmbientMode] = useState<'day' | 'night' | 'cozy' | 'minimal'>('cozy');
  const [emotionalResponse, setEmotionalResponse] = useState<{ [key: number]: 'positive' | 'negative' | 'mixed' }>({});
  const [currentThought, setCurrentThought] = useState('');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [listeningStreak, setListeningStreak] = useState(0);
  const [activeTab, setActiveTab] = useState('player');
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Load and save data
  useEffect(() => {
    const savedData = localStorage.getItem('storyExperience');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPersonalNotes(parsed.personalNotes || {});
        setBookmarks(parsed.bookmarks || {});
        setCompletedStories(parsed.completedStories || []);
        setFavoriteStories(parsed.favoriteStories || []);
        setEmotionalResponse(parsed.emotionalResponse || {});
        setAchievements(parsed.achievements || []);
        setListeningStreak(parsed.listeningStreak || 0);
        setAmbientMode(parsed.ambientMode || 'cozy');
      } catch (e) {
        console.log('Could not load saved data');
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      personalNotes,
      bookmarks,
      completedStories,
      favoriteStories,
      emotionalResponse,
      achievements,
      listeningStreak,
      ambientMode
    };
    localStorage.setItem('storyExperience', JSON.stringify(dataToSave));
  }, [personalNotes, bookmarks, completedStories, favoriteStories, emotionalResponse, achievements, listeningStreak, ambientMode]);

  const stories: Story[] = [
    {
      id: 1,
      title: "Broken Mirrors",
      description: "A deeply moving story about a child in care, exploring themes of identity, resilience, and hope through personal experiences.",
      duration: "12:45",
      author: "Care Voices Collection",
      category: "Personal Journey",
      isAvailable: true,
      audioFile: "/BROKEN MIRRORS.mp3",
      discussionPoints: [
        "What does 'identity' mean in the context of being in care?",
        "How do children in care develop resilience?",
        "What support systems are most effective for young people in care?",
        "How can we better understand the emotional journey of children in care?"
      ],
      exercises: [
        {
          title: "Personal Reflection Journal",
          description: "After listening, spend 10 minutes writing about a time when you faced adversity and how you overcame it.",
          type: "reflection"
        },
        {
          title: "Empathy Building Discussion",
          description: "In small groups, discuss how this story changed your understanding of the care experience.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Understand the emotional journey of children in care",
        "Develop empathy and compassion for vulnerable young people",
        "Recognize the importance of resilience and hope"
      ],
      emotionalTags: ["hopeful", "challenging", "inspiring", "real"]
    },
    {
      id: 2,
      title: "Once Upon a Time",
      description: "A thoughtful narrative exploring themes of childhood, transformation, and the power of storytelling in healing.",
      duration: "15:30",
      author: "Narrative Healing Project",
      category: "Growth & Healing",
      isAvailable: true,
      audioFile: "/Once upon a time....mp3",
      discussionPoints: [
        "How do stories help us process difficult experiences?",
        "What role does imagination play in coping with trauma?",
        "How can we use narrative therapy in care settings?"
      ],
      exercises: [
        {
          title: "Create Your Own Story",
          description: "Write or record a short story about overcoming a challenge using metaphors and symbols.",
          type: "activity"
        },
        {
          title: "Story Circle Discussion",
          description: "Share positive stories from your work with young people, focusing on breakthrough moments.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Understand the therapeutic value of storytelling",
        "Learn to use narrative techniques in professional practice",
        "Appreciate the power of metaphor and symbolism"
      ],
      emotionalTags: ["magical", "healing", "transformative", "gentle"]
    },
    {
      id: 3,
      title: "Why Me",
      description: "A raw, honest exploration of the questions young people ask when facing difficult circumstances. A deeply personal story about making sense of life's challenges.",
      duration: "16:42",
      author: "Voices of Experience",
      category: "Personal Journey",
      isAvailable: true,
      audioFile: "/Why me.mp3",
      discussionPoints: [
        "How do young people process feelings of unfairness and injustice?",
        "What role does questioning play in personal growth and understanding?",
        "How can we help young people find meaning in difficult experiences?",
        "What support do young people need when asking 'why me'?"
      ],
      exercises: [
        {
          title: "Questions and Feelings Journal",
          description: "Write down three 'why me' questions you've heard from young people or asked yourself. For each, write a compassionate response.",
          type: "reflection"
        },
        {
          title: "Finding Meaning Discussion",
          description: "In small groups, discuss how to help young people find purpose and meaning even in difficult circumstances.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Understand the importance of validating difficult questions",
        "Learn to support young people through existential struggles",
        "Recognize how questioning can lead to growth and understanding"
      ],
      emotionalTags: ["questioning", "honest", "deep", "meaningful"]
    },
    {
      id: 4,
      title: "Inside Voices",
      description: "An intimate exploration of internal dialogue, self-talk, and the journey toward self-compassion and inner strength.",
      duration: "18:20",
      author: "Inner Voice Collective",
      category: "Self-Awareness",
      isAvailable: true,
      audioFile: "/Inside Voices.mp3",
      discussionPoints: [
        "How do negative internal voices develop in vulnerable young people?",
        "What techniques help transform critical self-talk into supportive dialogue?",
        "How can care providers model positive self-talk?"
      ],
      exercises: [
        {
          title: "Inner Voice Audit",
          description: "Notice and write down your internal self-talk for one day. Categorize as supportive, neutral, or critical.",
          type: "reflection"
        },
        {
          title: "Voice Transformation Exercise",
          description: "Record yourself saying self-critical statements, then record compassionate alternatives.",
          type: "activity"
        }
      ],
      learningObjectives: [
        "Recognize patterns in internal dialogue",
        "Learn techniques for developing self-compassion",
        "Understand the impact of self-talk on well-being"
      ],
      emotionalTags: ["introspective", "empowering", "mindful", "healing"]
    },
    {
      id: 5,
      title: "Beyond the Clipboard: A New Ofsted Story",
      description: "An fresh perspective on modern inspections - how today's Ofsted visits focus on young people's voices, genuine care relationships, and meaningful outcomes rather than just paperwork.",
      duration: "8:45",
      author: "Modern Care Voices",
      category: "Quality & Innovation",
      isAvailable: true,
      audioFile: "/new-ofsted-story.mp3",
      discussionPoints: [
        "How has the inspection process evolved to prioritize young people's experiences?",
        "What does 'good' care look like from a young person's perspective?",
        "How do we demonstrate care quality beyond documentation?",
        "What role does innovation play in modern residential care?"
      ],
      exercises: [
        {
          title: "Young Person-Centered Reflection",
          description: "Interview a young person about what makes them feel safe and cared for. Compare this to inspection criteria.",
          type: "activity"
        },
        {
          title: "Innovation Showcase",
          description: "Identify three innovative practices in your setting that directly improve young people's lives.",
          type: "reflection"
        },
        {
          title: "Care Quality Discussion",
          description: "Discuss how to measure and demonstrate the 'unmeasurable' aspects of good care - love, belonging, hope.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Understand modern inspection approaches focused on outcomes",
        "Learn to articulate care quality beyond compliance",
        "Recognize the importance of young people's voices in quality assurance",
        "Develop confidence in demonstrating innovative care practices"
      ],
      emotionalTags: ["innovative", "young-person-centered", "confident", "progressive"]
    },
    {
      id: 6,
      title: "A Day in a Care Home",
      description: "Follow a complete 24-hour journey from breakfast to bedtime, experiencing the rhythms and challenges of residential care life.",
      duration: "22:15",
      author: "Daily Life Chronicles",
      category: "Life Experience",
      isAvailable: true,
      audioFile: "/A day in a care home.mp3",
      discussionPoints: [
        "What makes a care home feel like 'home' rather than an institution?",
        "How do we balance structure with flexibility in daily routines?",
        "What are the small moments that matter most to young people?"
      ],
      exercises: [
        {
          title: "Day Mapping Exercise",
          description: "Map out an ideal day for a young person in your care, considering their individual needs and preferences.",
          type: "activity"
        },
        {
          title: "Community Dynamics Discussion",
          description: "Discuss strategies for fostering positive peer relationships while managing conflicts.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Understand the complexity of daily life in residential care",
        "Learn strategies for balancing individual and group needs",
        "Appreciate the significance of ordinary moments in care work"
      ],
      emotionalTags: ["realistic", "heartwarming", "community", "everyday"]
    },
    {
      id: 7,
      title: "What We Think Sometimes",
      description: "An extended journey into the unspoken thoughts and feelings of young people in care. A deeply introspective exploration.",
      duration: "1:24:30",
      author: "Inner Voices Collective",
      category: "Deep Reflection",
      isAvailable: true,
      audioFile: "/What we think sometimes.mp3",
      discussionPoints: [
        "How do we create spaces for young people to express their deepest thoughts safely?",
        "What is the difference between negative thinking patterns and valid emotional processing?",
        "How can we validate difficult feelings while building hope and resilience?"
      ],
      exercises: [
        {
          title: "Inner Voice Mapping",
          description: "Create a visual map of different 'inner voices' young people might experience and how to strengthen positive ones.",
          type: "activity"
        },
        {
          title: "Reflective Listening Practice",
          description: "Practice deep, non-judgmental listening focused on presence rather than solutions.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Develop deeper empathy for internal experiences of young people in care",
        "Learn to differentiate between harmful and helpful internal narratives",
        "Build skills in creating psychologically safe environments"
      ],
      emotionalTags: ["introspective", "deep", "validating", "extended"]
    },
    {
      id: 8,
      title: "My Keys, My Future",
      description: "An empowering story about a young person taking charge of their transition to independence, focusing on self-advocacy, skill-building, and maintaining chosen family connections beyond care.",
      duration: "14:45",
      author: "Empowerment Voices",
      category: "Life Transitions",
      isAvailable: true,
      audioFile: "/my-keys-my-future.mp3",
      discussionPoints: [
        "How do young people define 'independence' for themselves?",
        "What does successful transition look like from a young person's perspective?",
        "How can we support young people to maintain caring relationships after leaving care?",
        "What role does self-advocacy play in successful transitions?",
        "How do we balance support with autonomy during transition periods?"
      ],
      exercises: [
        {
          title: "Future Self Visioning",
          description: "Write a letter from your future self (5 years from now) to a young person approaching independence, sharing wisdom and encouragement.",
          type: "reflection"
        },
        {
          title: "Skills and Support Mapping",
          description: "Create a comprehensive transition plan that includes practical skills, emotional support, and relationship maintenance strategies.",
          type: "activity"
        },
        {
          title: "Choice and Voice Workshop",
          description: "Practice giving young people real choices in their transition planning and honoring their decisions, even when different from what we might choose.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Understand transition from a young person's empowerment perspective",
        "Learn to support self-directed independence planning",
        "Recognize the importance of chosen family and ongoing relationships",
        "Develop skills in collaborative transition planning that centers young people's voices"
      ],
      emotionalTags: ["empowering", "future-focused", "choice-driven", "relationship-centered"]
    },
    {
      id: 9,
      title: "The Day Everything Changed",
      description: "A transformative story told from multiple perspectives - a young person, their family, and care staff - about a breakthrough moment that changed everything. Shows how small acts of understanding create ripple effects of healing and connection.",
      duration: "16:30",
      author: "Healing Voices Collective",
      category: "Transformation",
      isAvailable: true,
      audioFile: "/the-day-everything-changed.mp3",
      discussionPoints: [
        "What creates breakthrough moments in care relationships?",
        "How do small gestures of understanding create lasting change?",
        "What does healing look like from different perspectives?",
        "How can families, staff, and young people work together as a healing team?",
        "What role does hope play in transformation?"
      ],
      exercises: [
        {
          title: "Multi-Perspective Reflection",
          description: "Think of a significant moment with a young person. Write about it from three perspectives: yours, theirs, and their family's. What insights emerge?",
          type: "reflection"
        },
        {
          title: "Healing Moments Workshop",
          description: "Share stories of breakthrough moments in your practice. Identify the common elements that made transformation possible.",
          type: "discussion"
        },
        {
          title: "Creating Change Activity",
          description: "Design a simple intervention that could create positive change for a young person you're working with. Focus on relationship-building rather than behavior management.",
          type: "activity"
        }
      ],
      learningObjectives: [
        "Understand how healing happens through relationship and connection",
        "Learn to recognize and create breakthrough moments",
        "Appreciate the power of seeing situations from multiple perspectives",
        "Develop skills in collaborative care that includes families as partners"
      ],
      emotionalTags: ["transformative", "hopeful", "multi-perspective", "healing-focused"]
    },
    {
      id: 10,
      title: "My Teddy Knows Secrets",
      description: "A gentle story about childhood comfort objects and the role they play in healing and security.",
      duration: "6:45",
      author: "Childhood Voices",
      category: "Child Development",
      isAvailable: true,
      audioFile: "/teddy-secrets.mp3",
      discussionPoints: [
        "Why are comfort objects so important for children in care?",
        "How do we respect and protect these special attachments?",
        "What role do transitional objects play in healing from trauma?"
      ],
      exercises: [
        {
          title: "Comfort Object Stories",
          description: "Reflect on your own childhood comfort objects. How did they make you feel?",
          type: "reflection"
        },
        {
          title: "Creating Safety Discussion",
          description: "Discuss how to create environments where children feel safe to express their needs.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Understand the psychological importance of comfort objects",
        "Learn to respect and support children's coping mechanisms",
        "Recognize signs of attachment and security needs"
      ],
      emotionalTags: ["gentle", "childhood", "comfort", "healing"]
    },
    {
      id: 11,
      title: "The Weight of Decisions",
      description: "A profound exploration of the burden carried by professionals making life-changing decisions for young people.",
      duration: "13:20",
      author: "Professional Voices",
      category: "Professional Development",
      isAvailable: true,
      audioFile: "/weight-of-decisions.mp3",
      discussionPoints: [
        "How do professionals cope with the weight of making difficult decisions?",
        "What support systems help professionals process moral distress?",
        "How do we balance professional judgment with young people's wishes?"
      ],
      exercises: [
        {
          title: "Decision Impact Reflection",
          description: "Think of a difficult decision you've made regarding a young person. How did it affect you?",
          type: "reflection"
        },
        {
          title: "Ethical Dilemmas Workshop",
          description: "Work through case studies involving difficult decisions. Practice articulating reasoning.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Acknowledge the emotional toll of professional decision-making",
        "Learn healthy strategies for processing difficult choices",
        "Understand the importance of professional support and supervision"
      ],
      emotionalTags: ["profound", "professional", "weighty", "supportive"]
    },
    {
      id: 12,
      title: "The Line We Can't Cross",
      description: "A tense first-person story about boundaries, power dynamics, and respect in residential care.",
      duration: "7:20",
      author: "Real Voices Initiative",
      category: "Training Scenario",
      isAvailable: true,
      audioFile: "/the-line-we-cant-cross.mp3",
      discussionPoints: [
        "How do we maintain boundaries while still showing care and respect?",
        "What happens when boundary-setting feels like punishment to young people?",
        "How can staff de-escalate situations without compromising safety?"
      ],
      exercises: [
        {
          title: "Boundary Scenario Analysis",
          description: "Reflect on a time you had to set a difficult boundary. How did you communicate it?",
          type: "reflection"
        },
        {
          title: "De-escalation Practice",
          description: "Practice de-escalation techniques that preserve dignity while maintaining safety.",
          type: "discussion"
        }
      ],
      learningObjectives: [
        "Understand the difference between boundaries and punishment",
        "Learn de-escalation techniques that preserve dignity",
        "Recognize how trauma affects responses to authority"
      ],
      emotionalTags: ["challenging", "boundary-setting", "respect", "authority"]
    }
  ];

  // Audio control functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value[0];
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Enhanced experience functions
  const addBookmark = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setBookmarks(prev => ({
        ...prev,
        [currentStoryId]: [...(prev[currentStoryId] || []), time]
      }));
      
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const jumpToBookmark = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFavorite = (storyId: number) => {
    setFavoriteStories(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  };

  const markStoryCompleted = (storyId: number) => {
    if (!completedStories.includes(storyId)) {
      setCompletedStories(prev => [...prev, storyId]);
      setListeningStreak(prev => prev + 1);
      checkAchievements();
    }
  };

  const checkAchievements = () => {
    const newAchievements: string[] = [];
    
    if (completedStories.length + 1 === 1 && !achievements.includes('First Listen')) {
      newAchievements.push('First Listen');
    }
    
    if (completedStories.length + 1 === 3 && !achievements.includes('Story Explorer')) {
      newAchievements.push('Story Explorer');
    }
    
    if (Object.keys(personalNotes).length >= 3 && !achievements.includes('Thoughtful Listener')) {
      newAchievements.push('Thoughtful Listener');
    }
    
    if (favoriteStories.length >= 2 && !achievements.includes('Curator of Hearts')) {
      newAchievements.push('Curator of Hearts');
    }

    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const getAmbientStyle = () => {
    const styles = {
      day: 'bg-gradient-to-br from-blue-50 via-white to-yellow-50',
      night: 'bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white',
      cozy: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
      minimal: 'bg-white'
    };
    return styles[ambientMode];
  };

  const currentStory = stories.find(s => s.id === currentStoryId);

  return (
    <div className={`min-h-screen transition-all duration-1000 ${getAmbientStyle()}`}>
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <span className="font-semibold">Beautiful moment captured!</span>
              <Gift className="w-6 h-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer Modal */}
      <AnimatePresence>
        {showDisclaimer && (
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
              className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-2xl mx-auto shadow-lg border border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome to Your Story Journey</h2>
                  <p className="text-gray-600">A safe space for reflection and growth</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Disclaimer:</strong> These stories are works of fiction created solely for training and educational purposes. 
                  Any resemblance to actual people, events, or situations is purely coincidental.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  They are designed to encourage reflective practice, empathy, and professional development in care settings. 
                  Take your time, be kind to yourself, and remember that every story is a gift that stays with you.
                </p>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 font-medium">Created with care for meaningful learning</span>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => setShowDisclaimer(false)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-md transition-all duration-300 transform hover:scale-105"
                >
                  Begin My Journey
                  <Sparkles className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with ambient controls */}
      <div className={`${ambientMode === 'night' ? 'bg-black/20' : 'bg-white/80'} backdrop-blur-sm border-b ${ambientMode === 'night' ? 'border-white/10' : 'border-purple-100'}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className={`${ambientMode === 'night' ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'} rounded-xl`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hub
              </Button>
              <div>
                <h1 className={`text-3xl font-bold ${ambientMode === 'night' ? 'text-white' : 'text-gray-900'} mb-1`}>
                  Reflective Stories
                </h1>
                <p className={`${ambientMode === 'night' ? 'text-white/70' : 'text-gray-600'}`}>
                  Your personal audio journey of growth and connection
                </p>
              </div>
            </div>

            {/* Ambient Mode Controls */}
            <div className="flex items-center gap-2">
              <div className="flex bg-white/20 backdrop-blur-sm rounded-xl p-1">
                {(['cozy', 'day', 'night', 'minimal'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAmbientMode(mode)}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                      ambientMode === mode
                        ? 'bg-white shadow-md text-gray-900'
                        : `${ambientMode === 'night' ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'}`
                    }`}
                  >
                    {mode === 'cozy' && '🔥'}
                    {mode === 'day' && '☀️'}
                    {mode === 'night' && '🌙'}
                    {mode === 'minimal' && '⚪'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Story Library */}
          <div className="lg:col-span-1">
            <Card className={`${ambientMode === 'night' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/80 border-purple-100'} backdrop-blur-sm shadow-md`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-3 ${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>
                  <BookOpen className="w-5 h-5" />
                  Your Story Collection
                  <Badge variant="secondary" className="ml-auto">
                    {completedStories.length}/{stories.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stories.map((story) => (
                  <motion.div
                    key={story.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      onClick={() => setCurrentStoryId(story.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        currentStoryId === story.id
                          ? `${ambientMode === 'night' ? 'bg-white/20 border-white/40' : 'bg-purple-50 border-purple-200'} shadow-lg`
                          : `${ambientMode === 'night' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/50 border-gray-200 hover:bg-white/80'}`
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>
                          {story.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {completedStories.includes(story.id) && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {favoriteStories.includes(story.id) && (
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${ambientMode === 'night' ? 'text-white/70' : 'text-gray-600'} mb-3`}>
                        {story.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <Badge variant="outline" className={`${ambientMode === 'night' ? 'border-white/20 text-white/80' : ''}`}>
                          {story.category}
                        </Badge>
                        <div className={`flex items-center gap-1 ${ambientMode === 'night' ? 'text-white/60' : 'text-gray-500'}`}>
                          <Clock className="w-3 h-3" />
                          {story.duration}
                        </div>
                      </div>
                      {story.emotionalTags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {story.emotionalTags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Player */}
          <div className="lg:col-span-2">
            {currentStory && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className={`grid w-full grid-cols-4 ${ambientMode === 'night' ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-sm`}>
                  <TabsTrigger value="player" className={`${ambientMode === 'night' ? 'text-white data-[state=active]:bg-white data-[state=active]:text-gray-900' : ''}`}>
                    <Headphones className="w-4 h-4 mr-2" />
                    Player
                  </TabsTrigger>
                  <TabsTrigger value="notes" className={`${ambientMode === 'night' ? 'text-white data-[state=active]:bg-white data-[state=active]:text-gray-900' : ''}`}>
                    <PenTool className="w-4 h-4 mr-2" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="bookmarks" className={`${ambientMode === 'night' ? 'text-white data-[state=active]:bg-white data-[state=active]:text-gray-900' : ''}`}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmarks
                  </TabsTrigger>
                  <TabsTrigger value="insights" className={`${ambientMode === 'night' ? 'text-white data-[state=active]:bg-white data-[state=active]:text-gray-900' : ''}`}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="player" className="mt-6">
                  <Card className={`${ambientMode === 'night' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/90 border-purple-100'} backdrop-blur-sm shadow-lg`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className={`text-2xl ${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>
                            {currentStory.title}
                          </CardTitle>
                          <p className={`${ambientMode === 'night' ? 'text-white/70' : 'text-gray-600'} mt-2`}>
                            {currentStory.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(currentStoryId)}
                          className={`${ambientMode === 'night' ? 'text-white hover:bg-white/10' : 'hover:bg-gray-100'}`}
                        >
                          <Heart className={`w-5 h-5 ${favoriteStories.includes(currentStoryId) ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Audio Element */}
                      <audio
                        ref={audioRef}
                        src={currentStory.audioFile}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => markStoryCompleted(currentStoryId)}
                      />

                      {/* Beautiful Progress Bar */}
                      <div className="mb-6">
                        <div
                          onClick={handleProgressClick}
                          className={`h-2 ${ambientMode === 'night' ? 'bg-white/20' : 'bg-purple-100'} rounded-full cursor-pointer relative overflow-hidden`}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
                        </div>
                        <div className={`flex justify-between text-sm ${ambientMode === 'night' ? 'text-white/60' : 'text-gray-500'} mt-2`}>
                          <span>{formatTime(currentTime)}</span>
                          <span>{duration ? formatTime(duration) : currentStory.duration}</span>
                        </div>
                      </div>

                      {/* Player Controls */}
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRestart}
                          className={`${ambientMode === 'night' ? 'text-white hover:bg-white/10' : 'hover:bg-gray-100'} rounded-full w-12 h-12`}
                        >
                          <RotateCcw className="w-5 h-5" />
                        </Button>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={handlePlayPause}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-16 h-16 shadow-lg"
                          >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                          </Button>
                        </motion.div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleMute}
                          className={`${ambientMode === 'night' ? 'text-white hover:bg-white/10' : 'hover:bg-gray-100'} rounded-full w-12 h-12`}
                        >
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </Button>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-3 mb-6">
                        <Volume2 className={`w-4 h-4 ${ambientMode === 'night' ? 'text-white/60' : 'text-gray-500'}`} />
                        <Slider
                          value={volume}
                          onValueChange={handleVolumeChange}
                          max={1}
                          step={0.1}
                          className="flex-1"
                        />
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={addBookmark}
                          className={`${ambientMode === 'night' ? 'text-white hover:bg-white/10' : 'hover:bg-gray-100'} rounded-xl`}
                        >
                          <Bookmark className="w-4 h-4 mr-2" />
                          Save Moment
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab('notes')}
                            className={`${ambientMode === 'night' ? 'text-white hover:bg-white/10' : 'hover:bg-gray-100'} rounded-xl`}
                          >
                            <PenTool className="w-4 h-4 mr-2" />
                            Add Note
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="mt-6">
                  <Card className={`${ambientMode === 'night' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/90 border-purple-100'} backdrop-blur-sm shadow-lg`}>
                    <CardHeader>
                      <CardTitle className={`${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>
                        Personal Reflections
                      </CardTitle>
                      <p className={`${ambientMode === 'night' ? 'text-white/70' : 'text-gray-600'} flex items-center gap-2`}>
                        Capture your thoughts, insights, and emotional responses as you listen.
                        <VoiceInputButton onTranscript={(t) => setPersonalNotes(prev => ({ ...prev, [currentStoryId]: (prev[currentStoryId] || '') + (prev[currentStoryId] ? ' ' : '') + t }))} />
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={personalNotes[currentStoryId] || ''}
                        onChange={(e) => setPersonalNotes(prev => ({ ...prev, [currentStoryId]: e.target.value }))}
                        placeholder="What resonated with you? How did this story make you feel? (or tap 🎤 to speak)"
                        className={`min-h-[200px] ${ambientMode === 'night' ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'bg-white/80'} backdrop-blur-sm`}
                      />
                      <div className="flex justify-between items-center mt-4">
                        <p className={`text-sm ${ambientMode === 'night' ? 'text-white/60' : 'text-gray-500'}`}>
                          Your thoughts are automatically saved as you type.
                        </p>
                        <Badge variant="outline" className={`${ambientMode === 'night' ? 'border-white/20 text-white/80' : ''}`}>
                          {personalNotes[currentStoryId]?.length || 0} characters
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="bookmarks" className="mt-6">
                  <Card className={`${ambientMode === 'night' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/90 border-purple-100'} backdrop-blur-sm shadow-lg`}>
                    <CardHeader>
                      <CardTitle className={`${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>
                        Saved Moments
                      </CardTitle>
                      <p className={`${ambientMode === 'night' ? 'text-white/70' : 'text-gray-600'}`}>
                        Beautiful moments you've bookmarked during this story.
                      </p>
                    </CardHeader>
                    <CardContent>
                      {bookmarks[currentStoryId]?.length ? (
                        <div className="space-y-3">
                          {bookmarks[currentStoryId].map((time, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              className={`p-4 ${ambientMode === 'night' ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-sm rounded-xl border ${ambientMode === 'night' ? 'border-white/20' : 'border-purple-100'} cursor-pointer`}
                              onClick={() => jumpToBookmark(time)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Bookmark className="w-4 h-4 text-purple-500" />
                                  <span className={`${ambientMode === 'night' ? 'text-white' : 'text-gray-900'} font-medium`}>
                                    Moment {index + 1}
                                  </span>
                                </div>
                                <Badge variant="outline" className={`${ambientMode === 'night' ? 'border-white/20 text-white/80' : ''}`}>
                                  {formatTime(time)}
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-center py-12 ${ambientMode === 'night' ? 'text-white/60' : 'text-gray-500'}`}>
                          <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No moments bookmarked yet.</p>
                          <p className="text-sm mt-2">Click "Save Moment" while listening to capture special moments.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="insights" className="mt-6">
                  <div className="space-y-6">
                    {/* Discussion Points */}
                    <Card className={`${ambientMode === 'night' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/90 border-purple-100'} backdrop-blur-sm shadow-lg`}>
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-3 ${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>
                          <MessageSquare className="w-5 h-5" />
                          Discussion Points
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {currentStory.discussionPoints.map((point, index) => (
                            <div key={index} className={`p-4 ${ambientMode === 'night' ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-sm rounded-xl border ${ambientMode === 'night' ? 'border-white/20' : 'border-purple-100'}`}>
                              <p className={`${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>{point}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Learning Objectives */}
                    <Card className={`${ambientMode === 'night' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/90 border-purple-100'} backdrop-blur-sm shadow-lg`}>
                      <CardHeader>
                        <CardTitle className={`flex items-center gap-3 ${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>
                          <Trophy className="w-5 h-5" />
                          Learning Objectives
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {currentStory.learningObjectives.map((objective, index) => (
                            <div key={index} className={`flex items-start gap-3 p-4 ${ambientMode === 'night' ? 'bg-white/10' : 'bg-white/80'} backdrop-blur-sm rounded-xl border ${ambientMode === 'night' ? 'border-white/20' : 'border-purple-100'}`}>
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <p className={`${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>{objective}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>

        {/* Achievements Panel */}
        {achievements.length > 0 && (
          <Card className={`mt-8 ${ambientMode === 'night' ? 'bg-white/10 border-white/20 text-white' : 'bg-white/90 border-purple-100'} backdrop-blur-sm shadow-lg`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-3 ${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>
                <Award className="w-5 h-5" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 ${ambientMode === 'night' ? 'bg-white/10' : 'bg-gradient-to-br from-purple-50 to-pink-50'} backdrop-blur-sm rounded-xl border ${ambientMode === 'night' ? 'border-white/20' : 'border-purple-100'} text-center`}
                  >
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className={`font-semibold ${ambientMode === 'night' ? 'text-white' : 'text-gray-900'}`}>{achievement}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
