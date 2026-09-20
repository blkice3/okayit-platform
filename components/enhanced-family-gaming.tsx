
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Trophy, Users, Star, Target, Gamepad2, Heart, Crown, 
  Award, Sparkles, Play, Zap, Brain, Flame, Medal, MessageCircle,
  Copy, Check, UserPlus, Users2, Timer, Volume2, VolumeX, RotateCcw,
  Crosshair, CircleDot, Square, Circle, Triangle, TrendingUp, Gift,
  Rocket, Sword, Shield, Battery, Bolt, Puzzle, Lightbulb, Palette,
  User, Settings, BookOpen, BarChart, Calendar, Lock, Unlock, Info,
  ChevronRight, X, Plus, Minus, Clock, TrendingDown, Eye, EyeOff,
  Share2, Download, CheckCircle, AlertCircle, Hexagon, Layers
} from 'lucide-react';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { trackActivity } from './progress-dashboard-new';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EnhancedFamilyGamingProps {
  onBack: () => void;
  user?: any;
}

interface GameType {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  minPlayers: number;
  maxPlayers: number;
  duration: string;
  difficulty: string;
  hasMultiplayer: boolean;
  hasSinglePlayer: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  requirement: number;
  category: string;
  unlocked: boolean;
  progress: number;
  color: string;
}

interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: any;
  cost: number;
  duration: number;
  color: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  gameType: string;
  target: number;
  reward: number;
  completed: boolean;
  date: string;
}

const GAME_TYPES: GameType[] = [
  {
    id: 'reaction-rush',
    title: 'Reaction Rush ⚡',
    description: 'Test your reflexes! Tap as fast as you can when you see the target',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    minPlayers: 1,
    maxPlayers: 6,
    duration: '2-5 min',
    difficulty: 'Easy',
    hasMultiplayer: true,
    hasSinglePlayer: true
  },
  {
    id: 'memory-master',
    title: 'Memory Master 🧠',
    description: 'Remember the pattern and repeat it. Each round gets harder!',
    icon: Brain,
    color: 'from-purple-400 to-pink-500',
    minPlayers: 1,
    maxPlayers: 6,
    duration: '3-7 min',
    difficulty: 'Medium',
    hasMultiplayer: true,
    hasSinglePlayer: true
  },
  {
    id: 'trivia-battle',
    title: 'Trivia Battle 📚',
    description: 'Challenge your knowledge! Answer questions faster than opponents',
    icon: Lightbulb,
    color: 'from-blue-400 to-cyan-500',
    minPlayers: 1,
    maxPlayers: 6,
    duration: '5-10 min',
    difficulty: 'Medium',
    hasMultiplayer: true,
    hasSinglePlayer: true
  },
  {
    id: 'color-clash',
    title: 'Color Clash 🎨',
    description: 'Tap the correct color before time runs out! Speed matters',
    icon: Palette,
    color: 'from-pink-400 to-rose-500',
    minPlayers: 1,
    maxPlayers: 6,
    duration: '2-4 min',
    difficulty: 'Easy',
    hasMultiplayer: true,
    hasSinglePlayer: true
  },
  {
    id: 'math-mayhem',
    title: 'Math Mayhem 🔢',
    description: 'Solve math problems faster than your friends!',
    icon: Target,
    color: 'from-green-400 to-emerald-500',
    minPlayers: 1,
    maxPlayers: 6,
    duration: '3-6 min',
    difficulty: 'Hard',
    hasMultiplayer: true,
    hasSinglePlayer: true
  },
  {
    id: 'emoji-hunt',
    title: 'Emoji Hunt 😎',
    description: 'Find matching emojis in a grid. Memory and speed combined!',
    icon: Heart,
    color: 'from-red-400 to-pink-500',
    minPlayers: 1,
    maxPlayers: 6,
    duration: '3-5 min',
    difficulty: 'Medium',
    hasMultiplayer: true,
    hasSinglePlayer: true
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble 🔤',
    description: 'Unscramble letters to form words before time runs out!',
    icon: MessageCircle,
    color: 'from-indigo-400 to-purple-500',
    minPlayers: 1,
    maxPlayers: 6,
    duration: '4-6 min',
    difficulty: 'Medium',
    hasMultiplayer: true,
    hasSinglePlayer: true
  },
  {
    id: 'pattern-pro',
    title: 'Pattern Pro 🎯',
    description: 'Identify and complete visual patterns in record time!',
    icon: Hexagon,
    color: 'from-teal-400 to-cyan-500',
    minPlayers: 1,
    maxPlayers: 6,
    duration: '3-5 min',
    difficulty: 'Hard',
    hasMultiplayer: true,
    hasSinglePlayer: true
  },
  {
    id: 'quick-math',
    title: 'Quick Math ⚡',
    description: 'Lightning-fast mental math! Beat the clock!',
    icon: Bolt,
    color: 'from-amber-400 to-orange-500',
    minPlayers: 1,
    maxPlayers: 6,
    duration: '2-4 min',
    difficulty: 'Easy',
    hasMultiplayer: true,
    hasSinglePlayer: true
  }
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_win', title: 'First Victory', description: 'Win your first game', icon: Trophy, requirement: 1, category: 'milestone', unlocked: false, progress: 0, color: 'from-yellow-400 to-orange-500' },
  { id: 'speed_demon', title: 'Speed Demon', description: 'Complete Reaction Rush under 500ms', icon: Zap, requirement: 1, category: 'skill', unlocked: false, progress: 0, color: 'from-yellow-400 to-red-500' },
  { id: 'perfect_memory', title: 'Perfect Memory', description: 'Complete Memory Master without mistakes', icon: Brain, requirement: 1, category: 'skill', unlocked: false, progress: 0, color: 'from-purple-400 to-pink-500' },
  { id: 'trivia_master', title: 'Trivia Master', description: 'Get 100% on Trivia Battle', icon: Lightbulb, requirement: 1, category: 'skill', unlocked: false, progress: 0, color: 'from-blue-400 to-cyan-500' },
  { id: 'streak_5', title: 'On Fire!', description: 'Win 5 games in a row', icon: Flame, requirement: 5, category: 'streak', unlocked: false, progress: 0, color: 'from-red-400 to-orange-500' },
  { id: 'streak_10', title: 'Unstoppable', description: 'Win 10 games in a row', icon: Rocket, requirement: 10, category: 'streak', unlocked: false, progress: 0, color: 'from-red-500 to-pink-500' },
  { id: 'games_10', title: 'Getting Started', description: 'Play 10 games', icon: Gamepad2, requirement: 10, category: 'milestone', unlocked: false, progress: 0, color: 'from-green-400 to-emerald-500' },
  { id: 'games_50', title: 'Dedicated Player', description: 'Play 50 games', icon: Medal, requirement: 50, category: 'milestone', unlocked: false, progress: 0, color: 'from-green-500 to-teal-500' },
  { id: 'games_100', title: 'Gaming Legend', description: 'Play 100 games', icon: Crown, requirement: 100, category: 'milestone', unlocked: false, progress: 0, color: 'from-yellow-500 to-amber-500' },
  { id: 'all_games', title: 'Jack of All Games', description: 'Play all game types', icon: Star, requirement: 9, category: 'variety', unlocked: false, progress: 0, color: 'from-indigo-400 to-purple-500' },
  { id: 'high_scorer', title: 'High Scorer', description: 'Score 5000+ points in any game', icon: Target, requirement: 1, category: 'skill', unlocked: false, progress: 0, color: 'from-amber-400 to-yellow-500' },
  { id: 'power_user', title: 'Power User', description: 'Use 10 power-ups', icon: Bolt, requirement: 10, category: 'special', unlocked: false, progress: 0, color: 'from-cyan-400 to-blue-500' },
  { id: 'daily_champion', title: 'Daily Champion', description: 'Complete 5 daily challenges', icon: Calendar, requirement: 5, category: 'special', unlocked: false, progress: 0, color: 'from-pink-400 to-rose-500' },
  { id: 'social_butterfly', title: 'Social Butterfly', description: 'Play 10 multiplayer games', icon: Users2, requirement: 10, category: 'social', unlocked: false, progress: 0, color: 'from-purple-400 to-pink-500' },
  { id: 'solo_master', title: 'Solo Master', description: 'Play 25 single player games', icon: User, requirement: 25, category: 'social', unlocked: false, progress: 0, color: 'from-blue-400 to-indigo-500' },
  { id: 'word_wizard', title: 'Word Wizard', description: 'Complete Word Scramble 10 times', icon: MessageCircle, requirement: 10, category: 'game_specific', unlocked: false, progress: 0, color: 'from-indigo-400 to-purple-500' },
  { id: 'pattern_genius', title: 'Pattern Genius', description: 'Complete Pattern Pro 10 times', icon: Hexagon, requirement: 10, category: 'game_specific', unlocked: false, progress: 0, color: 'from-teal-400 to-cyan-500' },
  { id: 'math_whiz', title: 'Math Whiz', description: 'Complete Quick Math 15 times', icon: Bolt, requirement: 15, category: 'game_specific', unlocked: false, progress: 0, color: 'from-amber-400 to-orange-500' },
  { id: 'collector', title: 'Achievement Hunter', description: 'Unlock 10 achievements', icon: Award, requirement: 10, category: 'meta', unlocked: false, progress: 0, color: 'from-yellow-400 to-orange-500' },
  { id: 'completionist', title: 'Completionist', description: 'Unlock all achievements', icon: Crown, requirement: 20, category: 'meta', unlocked: false, progress: 0, color: 'from-purple-500 to-pink-500' }
];

const POWER_UPS: PowerUp[] = [
  { id: 'time_freeze', name: 'Time Freeze ⏸️', description: 'Pause the timer for 5 seconds', icon: Clock, cost: 50, duration: 5, color: 'from-blue-400 to-cyan-500' },
  { id: 'double_points', name: 'Double Points 💎', description: 'Earn 2x points for 10 seconds', icon: Sparkles, cost: 75, duration: 10, color: 'from-purple-400 to-pink-500' },
  { id: 'hint', name: 'Hint 💡', description: 'Get a helpful hint', icon: Lightbulb, cost: 30, duration: 0, color: 'from-yellow-400 to-orange-500' },
  { id: 'shield', name: 'Shield 🛡️', description: 'Protect from one wrong answer', icon: Shield, cost: 100, duration: 0, color: 'from-green-400 to-emerald-500' },
  { id: 'boost', name: 'Speed Boost ⚡', description: 'Increase your speed for 15 seconds', icon: Zap, cost: 60, duration: 15, color: 'from-yellow-400 to-red-500' }
];

export default function EnhancedFamilyGaming({ onBack, user }: EnhancedFamilyGamingProps) {
  const [view, setView] = useState<'menu' | 'mode-select' | 'lobby' | 'game' | 'tutorial' | 'achievements' | 'stats' | 'settings'>('menu');
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [gameMode, setGameMode] = useState<'single' | 'multi' | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [playerName, setPlayerName] = useState(user?.firstName || 'Player');
  const [roomCode, setRoomCode] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Player customization
  const [playerAvatar, setPlayerAvatar] = useState('🎮');
  const [playerTheme, setPlayerTheme] = useState('default');
  
  // Stats
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalCoins, setTotalCoins] = useState(100);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [powerUpsOwned, setPowerUpsOwned] = useState<{ [key: string]: number }>({});
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  
  // Game state
  const [gameState, setGameState] = useState<any>(null);

  // Load data from localStorage
  useEffect(() => {
    loadGameData();
    generateDailyChallenge();
  }, []);

  const loadGameData = () => {
    const data = localStorage.getItem('enhanced_gaming_data');
    if (data) {
      const parsed = JSON.parse(data);
      setTotalGamesPlayed(parsed.gamesPlayed || 0);
      setTotalWins(parsed.wins || 0);
      setHighestScore(parsed.highestScore || 0);
      setCurrentStreak(parsed.streak || 0);
      setTotalCoins(parsed.coins || 100);
      setPlayerAvatar(parsed.avatar || '🎮');
      setPlayerTheme(parsed.theme || 'default');
      setSoundEnabled(parsed.soundEnabled !== false);
      
      if (parsed.achievements) {
        setAchievements(parsed.achievements);
      }
      if (parsed.powerUps) {
        setPowerUpsOwned(parsed.powerUps);
      }
    }
  };

  const saveGameData = (updates: any) => {
    const currentData = JSON.parse(localStorage.getItem('enhanced_gaming_data') || '{}');
    const newData = { ...currentData, ...updates };
    localStorage.setItem('enhanced_gaming_data', JSON.stringify(newData));
  };

  const generateDailyChallenge = () => {
    const today = new Date().toDateString();
    const savedChallenge = localStorage.getItem('daily_challenge');
    
    if (savedChallenge) {
      const parsed = JSON.parse(savedChallenge);
      if (parsed.date === today) {
        setDailyChallenge(parsed);
        return;
      }
    }
    
    // Generate new challenge
    const games = GAME_TYPES;
    const randomGame = games[Math.floor(Math.random() * games.length)];
    const targets = [5, 10, 15, 20];
    const rewards = [50, 75, 100, 150];
    const targetIndex = Math.floor(Math.random() * targets.length);
    
    const challenge: DailyChallenge = {
      id: `daily_${Date.now()}`,
      title: `${randomGame.title} Master`,
      description: `Play ${randomGame.title} ${targets[targetIndex]} times today!`,
      gameType: randomGame.id,
      target: targets[targetIndex],
      reward: rewards[targetIndex],
      completed: false,
      date: today
    };
    
    localStorage.setItem('daily_challenge', JSON.stringify(challenge));
    setDailyChallenge(challenge);
  };

  const checkAchievements = (gameId: string, score: number, won: boolean) => {
    const updatedAchievements = [...achievements];
    let coinsEarned = 0;
    
    // Check various achievement conditions
    if (won && !updatedAchievements.find(a => a.id === 'first_win')?.unlocked) {
      unlockAchievement('first_win', updatedAchievements);
      coinsEarned += 50;
    }
    
    if (totalGamesPlayed >= 10 && !updatedAchievements.find(a => a.id === 'games_10')?.unlocked) {
      unlockAchievement('games_10', updatedAchievements);
      coinsEarned += 75;
    }
    
    if (currentStreak >= 5 && !updatedAchievements.find(a => a.id === 'streak_5')?.unlocked) {
      unlockAchievement('streak_5', updatedAchievements);
      coinsEarned += 100;
    }
    
    if (score >= 5000 && !updatedAchievements.find(a => a.id === 'high_scorer')?.unlocked) {
      unlockAchievement('high_scorer', updatedAchievements);
      coinsEarned += 150;
    }
    
    setAchievements(updatedAchievements);
    saveGameData({ achievements: updatedAchievements });
    
    if (coinsEarned > 0) {
      const newCoins = totalCoins + coinsEarned;
      setTotalCoins(newCoins);
      saveGameData({ coins: newCoins });
      toast.success(`🎉 +${coinsEarned} coins from achievements!`);
    }
  };

  const unlockAchievement = (achievementId: string, achievementsList: Achievement[]) => {
    const achievement = achievementsList.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.progress = achievement.requirement;
      toast.success(`🏆 Achievement Unlocked: ${achievement.title}!`, {
        description: achievement.description
      });
    }
  };

  const buyPowerUp = (powerUpId: string) => {
    const powerUp = POWER_UPS.find(p => p.id === powerUpId);
    if (!powerUp) return;
    
    if (totalCoins >= powerUp.cost) {
      const newCoins = totalCoins - powerUp.cost;
      setTotalCoins(newCoins);
      
      const newOwned = { ...powerUpsOwned };
      newOwned[powerUpId] = (newOwned[powerUpId] || 0) + 1;
      setPowerUpsOwned(newOwned);
      
      saveGameData({ coins: newCoins, powerUps: newOwned });
      toast.success(`Purchased ${powerUp.name}!`);
    } else {
      toast.error('Not enough coins!');
    }
  };

  const usePowerUp = (powerUpId: string) => {
    const owned = powerUpsOwned[powerUpId] || 0;
    if (owned > 0) {
      const newOwned = { ...powerUpsOwned };
      newOwned[powerUpId] = owned - 1;
      setPowerUpsOwned(newOwned);
      setActivePowerUp(powerUpId);
      
      saveGameData({ powerUps: newOwned });
      toast.success(`Activated ${POWER_UPS.find(p => p.id === powerUpId)?.name}!`);
      
      // Deactivate after duration
      const powerUp = POWER_UPS.find(p => p.id === powerUpId);
      if (powerUp && powerUp.duration > 0) {
        setTimeout(() => setActivePowerUp(null), powerUp.duration * 1000);
      }
    }
  };

  const startGame = (game: GameType, mode: 'single' | 'multi') => {
    setSelectedGame(game);
    setGameMode(mode);
    
    if (mode === 'single') {
      setView('game');
      initializeGame(game.id);
    } else {
      setView('mode-select');
    }
  };

  const initializeGame = (gameType: string) => {
    // Initialize game state based on type
    switch(gameType) {
      case 'word-scramble':
        setGameState({
          type: 'word-scramble',
          round: 1,
          totalRounds: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10,
          currentWord: generateScrambledWord(difficulty),
          score: 0,
          timeLeft: 30
        });
        break;
      case 'pattern-pro':
        setGameState({
          type: 'pattern-pro',
          round: 1,
          totalRounds: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10,
          pattern: generatePattern(difficulty),
          score: 0,
          timeLeft: 20
        });
        break;
      case 'quick-math':
        setGameState({
          type: 'quick-math',
          round: 1,
          totalRounds: 15,
          problem: generateQuickMath(difficulty),
          score: 0,
          timeLeft: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 7 : 5
        });
        break;
      case 'reaction-rush':
        setGameState({
          type: 'reaction-rush',
          round: 1,
          totalRounds: 10,
          score: 0,
          isActive: false,
          showTarget: false,
          reactionTime: 0,
          startTime: 0
        });
        break;
      case 'memory-master':
        setGameState({
          type: 'memory-master',
          round: 1,
          totalRounds: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10,
          sequence: generateMemorySequence(difficulty),
          userSequence: [],
          score: 0,
          isShowing: true,
          currentIndex: 0
        });
        break;
      case 'trivia-battle':
        setGameState({
          type: 'trivia-battle',
          round: 1,
          totalRounds: 10,
          question: generateTriviaQuestion(difficulty),
          score: 0,
          timeLeft: 15
        });
        break;
      case 'color-clash':
        setGameState({
          type: 'color-clash',
          round: 1,
          totalRounds: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
          challenge: generateColorChallenge(difficulty),
          score: 0,
          timeLeft: 5
        });
        break;
      case 'math-mayhem':
        setGameState({
          type: 'math-mayhem',
          round: 1,
          totalRounds: 15,
          problem: generateMathProblem(difficulty),
          score: 0,
          timeLeft: difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 7
        });
        break;
      case 'emoji-hunt':
        setGameState({
          type: 'emoji-hunt',
          round: 1,
          totalRounds: difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10,
          puzzle: generateEmojiPuzzle(difficulty),
          score: 0,
          timeLeft: difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 10
        });
        break;
      default:
        setGameState({ type: gameType, score: 0 });
    }
  };

  const generateScrambledWord = (difficulty: string) => {
    const easyWords = ['CAT', 'DOG', 'SUN', 'CAR', 'TREE', 'BOOK', 'FISH', 'BIRD'];
    const mediumWords = ['HOUSE', 'WATER', 'MUSIC', 'BEACH', 'CLOCK', 'PHONE', 'DANCE'];
    const hardWords = ['ELEPHANT', 'COMPUTER', 'MOUNTAIN', 'BUTTERFLY', 'CHOCOLATE'];
    
    const words = difficulty === 'easy' ? easyWords : difficulty === 'medium' ? mediumWords : hardWords;
    const word = words[Math.floor(Math.random() * words.length)];
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
    
    return { original: word, scrambled };
  };

  const generatePattern = (difficulty: string) => {
    const shapes = ['●', '■', '▲', '★', '♦'];
    const length = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const pattern = Array.from({ length }, () => shapes[Math.floor(Math.random() * shapes.length)]);
    const missing = Math.floor(Math.random() * length);
    
    return { sequence: pattern, missingIndex: missing };
  };

  const generateQuickMath = (difficulty: string) => {
    const maxNum = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 50 : 100;
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const ops = ['+', '-'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    const answer = op === '+' ? num1 + num2 : num1 - num2;
    return { num1, num2, op, answer };
  };

  const generateMemorySequence = (difficulty: string) => {
    const length = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    return Array.from({ length }, () => colors[Math.floor(Math.random() * colors.length)]);
  };

  const generateTriviaQuestion = (difficulty: string) => {
    const easyQuestions = [
      { question: 'What color is the sky on a clear day?', options: ['Blue', 'Green', 'Red', 'Yellow'], answer: 'Blue' },
      { question: 'How many days are in a week?', options: ['5', '6', '7', '8'], answer: '7' },
      { question: 'What animal says "meow"?', options: ['Dog', 'Cat', 'Cow', 'Bird'], answer: 'Cat' },
      { question: 'How many legs does a spider have?', options: ['6', '8', '10', '4'], answer: '8' }
    ];
    const mediumQuestions = [
      { question: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Rome'], answer: 'Paris' },
      { question: 'How many continents are there?', options: ['5', '6', '7', '8'], answer: '7' },
      { question: 'What is 12 x 12?', options: ['124', '144', '134', '154'], answer: '144' },
      { question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], answer: 'Mars' }
    ];
    const hardQuestions = [
      { question: 'What year did World War II end?', options: ['1943', '1944', '1945', '1946'], answer: '1945' },
      { question: 'Who wrote "Romeo and Juliet"?', options: ['Dickens', 'Shakespeare', 'Austen', 'Wilde'], answer: 'Shakespeare' },
      { question: 'What is the square root of 169?', options: ['11', '12', '13', '14'], answer: '13' },
      { question: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answer: 'Pacific' }
    ];
    
    const questions = difficulty === 'easy' ? easyQuestions : difficulty === 'medium' ? mediumQuestions : hardQuestions;
    return questions[Math.floor(Math.random() * questions.length)];
  };

  const generateColorChallenge = (difficulty: string) => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
    const colorWords = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'CYAN'];
    
    const textIndex = Math.floor(Math.random() * colorWords.length);
    const displayColor = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      text: colorWords[textIndex],
      color: displayColor,
      correctAnswer: displayColor
    };
  };

  const generateMathProblem = (difficulty: string) => {
    const maxNum = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 50 : 100;
    const num1 = Math.floor(Math.random() * maxNum) + 1;
    const num2 = Math.floor(Math.random() * maxNum) + 1;
    const ops = difficulty === 'easy' ? ['+', '-'] : difficulty === 'medium' ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    
    let answer;
    if (op === '+') answer = num1 + num2;
    else if (op === '-') answer = num1 - num2;
    else if (op === '×') answer = num1 * num2;
    else answer = Math.floor(num1 / num2);
    
    return { num1, num2, op, answer };
  };

  const generateEmojiPuzzle = (difficulty: string) => {
    const emojis = ['😀', '😎', '🎉', '🌟', '❤️', '🎈', '🌈', '⚡', '🎵', '🍕', '🎮', '🏆'];
    const gridSize = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const target = emojis[Math.floor(Math.random() * emojis.length)];
    const grid = Array.from({ length: gridSize * gridSize }, () => 
      Math.random() > 0.7 ? target : emojis[Math.floor(Math.random() * emojis.length)]
    );
    
    return { grid, gridSize, target, count: grid.filter(e => e === target).length };
  };

  const saveGameResult = (won: boolean, score: number) => {
    const newGamesPlayed = totalGamesPlayed + 1;
    const newWins = won ? totalWins + 1 : totalWins;
    const newHighScore = Math.max(highestScore, score);
    const newStreak = won ? currentStreak + 1 : 0;
    const coinsEarned = won ? 10 + Math.floor(score / 100) : 5;
    const newCoins = totalCoins + coinsEarned;
    
    setTotalGamesPlayed(newGamesPlayed);
    setTotalWins(newWins);
    setHighestScore(newHighScore);
    setCurrentStreak(newStreak);
    setTotalCoins(newCoins);
    
    saveGameData({
      gamesPlayed: newGamesPlayed,
      wins: newWins,
      highestScore: newHighScore,
      streak: newStreak,
      coins: newCoins
    });
    
    if (selectedGame) {
      checkAchievements(selectedGame.id, score, won);
    }
    
    trackActivity('game', selectedGame?.title || 'Game');
  };

  const renderMainMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Compact Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold hover:text-purple-800 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Menu
          </button>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-bold text-gray-900">Games &amp; Fun</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setView('settings')} className="p-1.5 text-gray-500 hover:text-gray-700">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-1.5 text-gray-500 hover:text-gray-700">
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Player Info - compact */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="text-3xl">{playerAvatar}</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">{playerName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                Level {Math.floor(totalGamesPlayed / 10) + 1}
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {totalCoins} Coins
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-purple-700">{achievements.filter(a => a.unlocked).length}/{achievements.length}</p>
            <p className="text-xs text-gray-500">Badges</p>
          </div>
        </div>

        {/* Quick Stats - compact */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { icon: Gamepad2, val: totalGamesPlayed, label: 'Played', color: 'text-orange-600 bg-orange-50' },
            { icon: Crown, val: totalWins, label: 'Wins', color: 'text-green-600 bg-green-50' },
            { icon: Star, val: highestScore, label: 'Best', color: 'text-purple-600 bg-purple-50' },
            { icon: Flame, val: currentStreak, label: 'Streak', color: 'text-red-600 bg-red-50' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className={`flex flex-col items-center py-2 rounded-lg ${s.color.split(' ')[1]} border border-gray-100`}>
                <Icon className={`w-4 h-4 ${s.color.split(' ')[0]} mb-0.5`} />
                <p className={`text-base font-black ${s.color.split(' ')[0]}`}>{s.val}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Daily Challenge - compact */}
        {dailyChallenge && !dailyChallenge.completed && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-amber-800">Daily Challenge</p>
              <p className="text-xs text-gray-600 truncate">{dailyChallenge.description}</p>
            </div>
            <span className="text-sm font-black text-amber-700">+{dailyChallenge.reward}</span>
          </div>
        )}

        {/* Quick Actions - compact */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button onClick={() => setView('achievements')} className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-all">
            <Award className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-700">Badges</span>
          </button>
          <button onClick={() => setView('stats')} className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all">
            <BarChart className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700">Stats</span>
          </button>
          <button onClick={() => setRoomCode('')} className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all">
            <Users2 className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-green-700">Join Room</span>
          </button>
        </div>

        {/* Join Room Input */}
        {roomCode === '' && (
          <div className="mb-4 p-3 bg-white rounded-xl border border-gray-200">
            <p className="text-xs font-bold text-gray-700 mb-2">Join a Friend&apos;s Game</p>
            <div className="flex gap-2">
              <Input
                placeholder="Room code..."
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center text-sm font-bold uppercase h-9"
              />
              <Button
                onClick={() => {
                  if (roomCode.length === 6) {
                    toast.success(`Joined room: ${roomCode}`);
                  }
                }}
                disabled={roomCode.length !== 6}
                className="h-9 text-sm"
              >
                Join
              </Button>
            </div>
          </div>
        )}

        {/* Games Grid */}
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Choose Your Game</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {GAME_TYPES.map((game, index) => {
            const Icon = game.icon;
            return (
              <motion.div
                key={game.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <Card className={combineThemeClasses(
                  "hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden border-2",
                  okayitTheme.backgrounds.card
                )}>
                  <div className={`h-32 bg-gradient-to-br ${game.color} p-6 relative overflow-hidden`}>
                    <Icon className="w-16 h-16 text-white opacity-20 absolute -right-4 -top-4" />
                    <Icon className="w-12 h-12 text-white mb-2" />
                    <Badge className="bg-white/20 text-white border-0">
                      {game.difficulty}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className={combineThemeClasses("text-xl font-bold mb-2", okayitTheme.text.primary)}>
                      {game.title}
                    </h3>
                    <p className={combineThemeClasses("text-sm mb-4 min-h-[40px]", okayitTheme.text.muted)}>
                      {game.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-800 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {game.minPlayers}-{game.maxPlayers}
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="w-4 h-4" />
                        {game.duration}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedGame(game);
                          setView('mode-select');
                        }}
                        className={`flex-1 bg-gradient-to-r ${game.color} text-white hover:opacity-90`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedGame(game);
                          setShowTutorial(true);
                        }}
                        variant="outline"
                        className="px-3"
                      >
                        <Info className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Power-Ups Shop */}
        <div className="mt-12">
          <h2 className={combineThemeClasses("text-2xl font-bold mb-4", okayitTheme.text.primary)}>
            ⚡ Power-Ups Shop
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {POWER_UPS.map(powerUp => {
              const Icon = powerUp.icon;
              const owned = powerUpsOwned[powerUp.id] || 0;
              return (
                <Card key={powerUp.id} className="overflow-hidden">
                  <div className={`h-20 bg-gradient-to-br ${powerUp.color} flex items-center justify-center`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-sm mb-1">{powerUp.name}</h4>
                    <p className="text-xs text-gray-800 mb-3">{powerUp.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-yellow-600">{powerUp.cost} 💰</span>
                      <span className="text-xs text-gray-900">Own: {owned}</span>
                    </div>
                    <Button
                      onClick={() => buyPowerUp(powerUp.id)}
                      size="sm"
                      className="w-full"
                      disabled={totalCoins < powerUp.cost}
                    >
                      Buy
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              How to Play: {selectedGame?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedGame && renderTutorial(selectedGame.id)}
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderModeSelect = () => {
    if (!selectedGame) return null;

    return (
      <div className={combineThemeClasses("min-h-screen flex items-center justify-center p-4", okayitTheme.backgrounds.page)}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-4xl w-full"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Button onClick={() => setView('menu')} variant="ghost">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <CardTitle className="text-3xl">{selectedGame.title}</CardTitle>
                <div className="w-20" />
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Choose Game Mode</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Single Player */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setGameMode('single');
                    startGame(selectedGame, 'single');
                  }}
                  className={`p-8 bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-xl cursor-pointer`}
                >
                  <User className="w-16 h-16 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-center mb-2">Single Player</h4>
                  <p className="text-center text-sm opacity-90">Play solo and beat your high score!</p>
                  <div className="mt-6">
                    <label className="text-sm font-bold mb-2 block">Difficulty:</label>
                    <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                      <SelectTrigger className="bg-white/20 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy 😊</SelectItem>
                        <SelectItem value="medium">Medium 🤔</SelectItem>
                        <SelectItem value="hard">Hard 😤</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>

                {/* Multiplayer */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setGameMode('multi');
                    toast.info('Creating multiplayer room...');
                    setTimeout(() => {
                      toast.success('Room created! Share code with friends!');
                    }, 1000);
                  }}
                  className={`p-8 bg-gradient-to-br from-purple-400 to-pink-500 text-white rounded-xl cursor-pointer`}
                >
                  <Users2 className="w-16 h-16 mx-auto mb-4" />
                  <h4 className="text-2xl font-bold text-center mb-2">Multiplayer</h4>
                  <p className="text-center text-sm opacity-90">Challenge friends in real-time!</p>
                  <div className="mt-6 text-center">
                    <p className="text-sm opacity-90 mb-2">Up to {selectedGame.maxPlayers} players</p>
                    <Badge className="bg-white/20 text-white text-sm">Room Code System</Badge>
                  </div>
                </motion.div>
              </div>

              {/* Practice Mode */}
              <Card className="bg-gray-50">
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-800" />
                  <h4 className="font-bold mb-2">New to this game?</h4>
                  <p className="text-sm text-gray-800 mb-4">Try the tutorial first to learn how to play!</p>
                  <Button
                    onClick={() => setShowTutorial(true)}
                    variant="outline"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    View Tutorial
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  };

  const renderTutorial = (gameId: string) => {
    const tutorials: { [key: string]: any } = {
      'reaction-rush': {
        title: 'Reaction Rush',
        steps: [
          { icon: Eye, text: 'Watch the screen carefully' },
          { icon: Zap, text: 'When the target appears, tap as fast as you can!' },
          { icon: Timer, text: 'Faster reactions = More points' },
          { icon: Trophy, text: 'Beat your best time!' }
        ],
        tips: ['Don\'t tap too early!', 'Stay focused', 'Practice makes perfect']
      },
      'memory-master': {
        title: 'Memory Master',
        steps: [
          { icon: Eye, text: 'Watch the pattern appear' },
          { icon: Brain, text: 'Remember the sequence' },
          { icon: Target, text: 'Repeat it correctly' },
          { icon: TrendingUp, text: 'Each round adds one more!' }
        ],
        tips: ['Focus on the pattern', 'Say it out loud', 'Take your time']
      },
      'word-scramble': {
        title: 'Word Scramble',
        steps: [
          { icon: Eye, text: 'Look at the scrambled letters' },
          { icon: Brain, text: 'Unscramble them in your mind' },
          { icon: MessageCircle, text: 'Type the correct word' },
          { icon: Clock, text: 'Beat the clock!' }
        ],
        tips: ['Look for common patterns', 'Try different combinations', 'Use hints if stuck']
      },
      'pattern-pro': {
        title: 'Pattern Pro',
        steps: [
          { icon: Eye, text: 'Study the pattern shown' },
          { icon: Brain, text: 'Find what\'s missing' },
          { icon: Target, text: 'Select the correct answer' },
          { icon: Rocket, text: 'Speed up for bonus points!' }
        ],
        tips: ['Look for repeating sequences', 'Pay attention to colors and shapes', 'Think logically']
      },
      'quick-math': {
        title: 'Quick Math',
        steps: [
          { icon: Eye, text: 'Read the math problem' },
          { icon: Brain, text: 'Calculate in your head' },
          { icon: Bolt, text: 'Answer as fast as possible' },
          { icon: Star, text: 'Accuracy AND speed matter!' }
        ],
        tips: ['Use mental math tricks', 'Practice basic operations', 'Don\'t rush too much']
      }
    };

    const tutorial = tutorials[gameId] || tutorials['reaction-rush'];

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          {tutorial.steps.map((step: any, index: number) => {
            const StepIcon = step.icon;
            return (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <StepIcon className="w-5 h-5 text-purple-600" />
                    <h4 className="font-bold">{step.text}</h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            Pro Tips:
          </h4>
          <ul className="space-y-1">
            {tutorial.tips.map((tip: string, index: number) => (
              <li key={index} className="text-sm text-gray-900 flex items-center gap-2">
                <span className="text-blue-600">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={() => {
            setShowTutorial(false);
            if (selectedGame) {
              startGame(selectedGame, 'single');
            }
          }}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Playing!
        </Button>
      </div>
    );
  };

  const renderAchievements = () => (
    <div className={combineThemeClasses("min-h-screen pb-20", okayitTheme.backgrounds.page)}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setView('menu')}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
                <Trophy className="w-6 h-6" />
                Achievements
              </h1>
              <p className="text-sm opacity-90">
                {achievements.filter(a => a.unlocked).length}/{achievements.length} Unlocked
              </p>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="milestone">Milestone</TabsTrigger>
            <TabsTrigger value="skill">Skill</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="special">Special</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <AchievementCard key={achievement.id} achievement={achievement} index={index} />
              ))}
            </div>
          </TabsContent>

          {['milestone', 'skill', 'social', 'special'].map(category => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements
                  .filter(a => a.category === category)
                  .map((achievement, index) => (
                    <AchievementCard key={achievement.id} achievement={achievement} index={index} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className={combineThemeClasses("min-h-screen pb-20", okayitTheme.backgrounds.page)}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setView('menu')}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
                <BarChart className="w-6 h-6" />
                My Statistics
              </h1>
              <p className="text-sm opacity-90">Track your gaming progress</p>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-6 text-center">
              <Gamepad2 className="w-10 h-10 mx-auto mb-2" />
              <div className="text-4xl font-bold">{totalGamesPlayed}</div>
              <div className="text-sm opacity-90">Total Games</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="w-10 h-10 mx-auto mb-2" />
              <div className="text-4xl font-bold">{totalWins}</div>
              <div className="text-sm opacity-90">Wins</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6 text-center">
              <Target className="w-10 h-10 mx-auto mb-2" />
              <div className="text-4xl font-bold">
                {totalGamesPlayed > 0 ? Math.round((totalWins / totalGamesPlayed) * 100) : 0}%
              </div>
              <div className="text-sm opacity-90">Win Rate</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
            <CardContent className="p-6 text-center">
              <Flame className="w-10 h-10 mx-auto mb-2" />
              <div className="text-4xl font-bold">{currentStreak}</div>
              <div className="text-sm opacity-90">Current Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Games Played</span>
                  <span className="text-sm text-gray-800">{totalGamesPlayed}/100</span>
                </div>
                <Progress value={(totalGamesPlayed / 100) * 100} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Win Rate</span>
                  <span className="text-sm text-gray-800">
                    {totalGamesPlayed > 0 ? Math.round((totalWins / totalGamesPlayed) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={totalGamesPlayed > 0 ? (totalWins / totalGamesPlayed) * 100 : 0} 
                  className="bg-green-200"
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Achievements</span>
                  <span className="text-sm text-gray-800">
                    {achievements.filter(a => a.unlocked).length}/{achievements.length}
                  </span>
                </div>
                <Progress 
                  value={(achievements.filter(a => a.unlocked).length / achievements.length) * 100} 
                  className="bg-purple-200"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-yellow-600" />
                  <div>
                    <div className="font-bold">Coins</div>
                    <div className="text-sm text-gray-800">Total Balance</div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-600">{totalCoins}</div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-bold text-sm">Power-Ups Owned:</h4>
                {POWER_UPS.map(powerUp => {
                  const owned = powerUpsOwned[powerUp.id] || 0;
                  return (
                    <div key={powerUp.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{powerUp.name}</span>
                      <Badge>{owned}</Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className={combineThemeClasses("min-h-screen pb-20", okayitTheme.backgrounds.page)}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => setView('menu')}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold flex items-center gap-2 justify-center">
                <Settings className="w-6 h-6" />
                Settings
              </h1>
              <p className="text-sm opacity-90">Customize your experience</p>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Player Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Avatar</label>
              <div className="grid grid-cols-6 gap-3">
                {['🎮', '🎯', '🎨', '🎪', '🎭', '🎬', '🎵', '🎸', '🎺', '🎼', '🎹', '🎤'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setPlayerAvatar(emoji);
                      saveGameData({ avatar: emoji });
                      toast.success('Avatar updated!');
                    }}
                    className={`text-4xl p-4 rounded-lg border-2 hover:scale-110 transition-transform ${
                      playerAvatar === emoji ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Display Name</label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onBlur={() => saveGameData({ name: playerName })}
                className="max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Game Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Sound Effects</div>
                <div className="text-sm text-gray-800">Enable game sounds</div>
              </div>
              <Button
                onClick={() => {
                  const newValue = !soundEnabled;
                  setSoundEnabled(newValue);
                  saveGameData({ soundEnabled: newValue });
                }}
                variant={soundEnabled ? "default" : "outline"}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <div className="font-medium mb-2">Default Difficulty</div>
              <Select value={difficulty} onValueChange={(value: any) => {
                setDifficulty(value);
                saveGameData({ defaultDifficulty: value });
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy 😊</SelectItem>
                  <SelectItem value="medium">Medium 🤔</SelectItem>
                  <SelectItem value="hard">Hard 😤</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                if (confirm('Are you sure? This will reset ALL your progress!')) {
                  localStorage.removeItem('enhanced_gaming_data');
                  localStorage.removeItem('daily_challenge');
                  window.location.reload();
                }
              }}
              variant="destructive"
              className="w-full"
            >
              Reset All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const handleGameExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      setGameState(null);
      setSelectedGame(null);
      setView('menu');
      toast.info('Game exited');
    }
  };

  const renderGame = () => {
    if (!gameState || !selectedGame) return null;

    // Render different game UIs based on game type
    switch (gameState.type) {
      case 'word-scramble':
        return <WordScrambleGame gameState={gameState} setGameState={setGameState} onEnd={saveGameResult} generateScrambledWord={generateScrambledWord} difficulty={difficulty} onExit={handleGameExit} />;
      case 'pattern-pro':
        return <PatternProGame gameState={gameState} setGameState={setGameState} onEnd={saveGameResult} generatePattern={generatePattern} difficulty={difficulty} onExit={handleGameExit} />;
      case 'quick-math':
        return <QuickMathGame gameState={gameState} setGameState={setGameState} onEnd={saveGameResult} generateQuickMath={generateQuickMath} difficulty={difficulty} onExit={handleGameExit} />;
      case 'reaction-rush':
        return <ReactionRushGame gameState={gameState} setGameState={setGameState} onEnd={saveGameResult} difficulty={difficulty} onExit={handleGameExit} />;
      case 'memory-master':
        return <MemoryMasterGame gameState={gameState} setGameState={setGameState} onEnd={saveGameResult} generateMemorySequence={generateMemorySequence} difficulty={difficulty} onExit={handleGameExit} />;
      case 'trivia-battle':
        return <TriviaBattleGame gameState={gameState} setGameState={setGameState} onEnd={saveGameResult} generateTriviaQuestion={generateTriviaQuestion} difficulty={difficulty} onExit={handleGameExit} />;
      case 'color-clash':
        return <ColorClashGame gameState={gameState} setGameState={setGameState} onEnd={saveGameResult} generateColorChallenge={generateColorChallenge} difficulty={difficulty} onExit={handleGameExit} />;
      case 'math-mayhem':
        return <MathMayhemGame gameState={gameState} setGameState={setGameState} onEnd={saveGameResult} generateMathProblem={generateMathProblem} difficulty={difficulty} onExit={handleGameExit} />;
      case 'emoji-hunt':
        return <EmojiHuntGame gameState={gameState} setGameState={setGameState} onEnd={saveGameResult} generateEmojiPuzzle={generateEmojiPuzzle} difficulty={difficulty} onExit={handleGameExit} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full text-center">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">This Game Is Not Available Yet</h2>
                <p className="text-gray-800 mb-6">Try one of the other games from the menu instead.</p>
                <Button onClick={() => setView('menu')}>Back to Menu</Button>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  // Render current view
  switch(view) {
    case 'menu':
      return renderMainMenu();
    case 'mode-select':
      return renderModeSelect();
    case 'achievements':
      return renderAchievements();
    case 'stats':
      return renderStats();
    case 'settings':
      return renderSettings();
    case 'game':
      return renderGame();
    default:
      return renderMainMenu();
  }
}

// Achievement Card Component
function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const Icon = achievement.icon;
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={`${achievement.unlocked ? '' : 'opacity-60 grayscale'} hover:shadow-lg transition-all`}>
        <div className={`h-24 bg-gradient-to-br ${achievement.color} flex items-center justify-center relative overflow-hidden`}>
          <Icon className="w-12 h-12 text-white" />
          {achievement.unlocked && (
            <div className="absolute top-2 right-2">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          )}
          {!achievement.unlocked && (
            <div className="absolute top-2 right-2">
              <Lock className="w-6 h-6 text-white/60" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h4 className="font-bold mb-1">{achievement.title}</h4>
          <p className="text-sm text-gray-800 mb-3">{achievement.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-900">
              <span>Progress</span>
              <span>{achievement.progress}/{achievement.requirement}</span>
            </div>
            <Progress value={(achievement.progress / achievement.requirement) * 100} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Game Components
function WordScrambleGame({ gameState, setGameState, onEnd, generateScrambledWord, difficulty, onExit }: any) {
  const [answer, setAnswer] = useState('');
  const [round, setRound] = useState(gameState.round || 1);
  const [score, setScore] = useState(gameState.score || 0);
  const [currentWord, setCurrentWord] = useState(gameState.currentWord);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSkip();
    }
  }, [timeLeft]);

  const handleSubmit = () => {
    if (answer.toUpperCase() === currentWord.original) {
      const points = 100 + (timeLeft * 5);
      setScore((prev: number) => prev + points);
      toast.success(`Correct! +${points} points`);
      
      const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10;
      if (round >= totalRounds) {
        onEnd(true, score + points);
      } else {
        setRound((prev: number) => prev + 1);
        setCurrentWord(generateScrambledWord(difficulty));
        setAnswer('');
        setTimeLeft(30);
      }
    } else {
      toast.error('Wrong answer! Try again.');
      setAnswer('');
    }
  };

  const handleSkip = () => {
    toast.info(`The word was: ${currentWord.original}`);
    const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10;
    
    if (round >= totalRounds) {
      onEnd(false, score);
    } else {
      setRound((prev: number) => prev + 1);
      setCurrentWord(generateScrambledWord(difficulty));
      setAnswer('');
      setTimeLeft(30);
    }
  };

  const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Back Button */}
        <div className="mb-4">
          <Button
            onClick={() => onExit && onExit()}
            variant="outline"
            size="lg"
            className="bg-white/90 hover:bg-white border border-indigo-600 text-indigo-900 font-bold text-lg shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 mr-2 font-bold" />
            EXIT GAME
          </Button>
        </div>
        
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Word Scramble 🔤</CardTitle>
            <div className="flex justify-between text-lg mt-4">
              <span>Round: {round}/{totalRounds}</span>
              <span>Score: {score}</span>
              <span className={`${timeLeft < 10 ? 'text-red-600 font-bold' : ''}`}>⏱️ {timeLeft}s</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-12 rounded-xl mb-6">
              <h3 className="text-6xl font-black tracking-widest mb-4">
                {currentWord.scrambled}
              </h3>
              <p className="text-sm opacity-90">{currentWord.original.length} letters</p>
            </div>

            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your answer..."
              className="text-3xl text-center h-16 font-bold uppercase mb-4"
              autoFocus
              maxLength={currentWord.original.length}
            />

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!answer}
                className="flex-1 h-16 text-xl bg-gradient-to-r from-green-500 to-emerald-500"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Submit
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 h-16 text-xl"
              >
                <ChevronRight className="w-6 h-6 mr-2" />
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function PatternProGame({ gameState, setGameState, onEnd, generatePattern, difficulty, onExit }: any) {
  const [pattern, setPattern] = useState(gameState.pattern);
  const [round, setRound] = useState(gameState.round || 1);
  const [score, setScore] = useState(gameState.score || 0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const shapes = ['●', '■', '▲', '★', '♦'];

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleAnswer(null);
    }
  }, [timeLeft]);

  const handleAnswer = (answer: string | null) => {
    const correctAnswer = pattern.sequence[pattern.missingIndex];
    const isCorrect = answer === correctAnswer;
    
    if (isCorrect) {
      const points = 100 + (timeLeft * 5);
      setScore((prev: number) => prev + points);
      toast.success(`Correct! +${points} points`);
    } else {
      toast.error(`Wrong! The answer was ${correctAnswer}`);
    }
    
    const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10;
    setTimeout(() => {
      if (round >= totalRounds) {
        onEnd(isCorrect, score + (isCorrect ? 100 + (timeLeft * 5) : 0));
      } else {
        setRound((prev: number) => prev + 1);
        setPattern(generatePattern(difficulty));
        setTimeLeft(20);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Back Button */}
        <div className="mb-4">
          <Button
            onClick={() => onExit && onExit()}
            variant="outline"
            size="lg"
            className="bg-white/90 hover:bg-white border border-teal-600 text-teal-900 font-bold text-lg shadow-lg"
          >
            <ArrowLeft className="w-6 h-6 mr-2 font-bold" />
            EXIT GAME
          </Button>
        </div>
        
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Pattern Pro 🎯</CardTitle>
            <div className="flex justify-between text-lg mt-4">
              <span>Round: {round}/{totalRounds}</span>
              <span>Score: {score}</span>
              <span className={`${timeLeft < 10 ? 'text-red-600 font-bold' : ''}`}>⏱️ {timeLeft}s</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-8 rounded-xl mb-6">
              <p className="text-sm text-gray-800 mb-4">What comes next in this pattern?</p>
              <div className="flex items-center justify-center gap-4 text-6xl mb-6">
                {pattern.sequence.map((shape: string, index: number) => (
                  <span key={index} className={index === pattern.missingIndex ? 'text-gray-300' : ''}>
                    {index === pattern.missingIndex ? '?' : shape}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {shapes.map((shape) => (
                <Button
                  key={shape}
                  onClick={() => handleAnswer(shape)}
                  className={`h-24 text-5xl ${
                    selectedAnswer === shape ? 'bg-blue-500' : ''
                  }`}
                  variant="outline"
                  disabled={selectedAnswer !== null}
                >
                  {shape}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function QuickMathGame({ gameState, setGameState, onEnd, generateQuickMath, difficulty , onExit}: any) {
  const [problem, setProblem] = useState(gameState.problem);
  const [answer, setAnswer] = useState('');
  const [round, setRound] = useState(gameState.round || 1);
  const [score, setScore] = useState(gameState.score || 0);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 10 : difficulty === 'medium' ? 7 : 5);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSkip();
    }
  }, [timeLeft]);

  const handleSubmit = () => {
    if (parseInt(answer) === problem.answer) {
      const points = 50 + (timeLeft * 10);
      setScore((prev: number) => prev + points);
      toast.success(`Correct! +${points} points`);
      
      if (round >= 15) {
        onEnd(true, score + points);
      } else {
        setRound((prev: number) => prev + 1);
        setProblem(generateQuickMath(difficulty));
        setAnswer('');
        setTimeLeft(difficulty === 'easy' ? 10 : difficulty === 'medium' ? 7 : 5);
      }
    } else {
      toast.error('Wrong answer!');
      setScore((prev: number) => Math.max(0, prev - 10));
    }
  };

  const handleSkip = () => {
    toast.info(`The answer was: ${problem.answer}`);
    
    if (round >= 15) {
      onEnd(false, score);
    } else {
      setRound((prev: number) => prev + 1);
      setProblem(generateQuickMath(difficulty));
      setAnswer('');
      setTimeLeft(difficulty === 'easy' ? 10 : difficulty === 'medium' ? 7 : 5);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Quick Math ⚡</CardTitle>
            <div className="flex justify-between text-lg mt-4">
              <span>Problem: {round}/15</span>
              <span>Score: {score}</span>
              <span className={`${timeLeft < 5 ? 'text-red-600 font-bold animate-pulse' : ''}`}>⏱️ {timeLeft}s</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-12 rounded-xl mb-6">
              <h2 className="text-7xl font-black mb-8 text-purple-600">
                {problem.num1} {problem.op} {problem.num2} = ?
              </h2>
              <Input
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Your answer..."
                className="text-4xl text-center h-20 font-bold"
                autoFocus
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!answer}
                className="flex-1 h-16 text-xl bg-gradient-to-r from-green-500 to-emerald-500"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Submit
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 h-16 text-xl"
              >
                <ChevronRight className="w-6 h-6 mr-2" />
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


// Reaction Rush Game Component
function ReactionRushGame({ gameState, setGameState, onEnd, difficulty , onExit}: any) {
  const [round, setRound] = useState(gameState.round || 1);
  const [score, setScore] = useState(gameState.score || 0);
  const [isActive, setIsActive] = useState(false);
  const [showTarget, setShowTarget] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const totalRounds = 10;

  useEffect(() => {
    if (round <= totalRounds && !waitingForNext) {
      const delay = Math.random() * 2000 + 1000; // 1-3 seconds
      const timer = setTimeout(() => {
        setShowTarget(true);
        setStartTime(Date.now());
        setIsActive(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [round, waitingForNext]);

  const handleClick = () => {
    if (isActive && showTarget) {
      const reactionTime = Date.now() - startTime;
      const points = Math.max(0, 200 - reactionTime);
      setScore((prev: number) => prev + Math.floor(points));
      toast.success(`${reactionTime}ms! +${Math.floor(points)} points`);
      
      setIsActive(false);
      setShowTarget(false);
      setWaitingForNext(true);
      
      setTimeout(() => {
        if (round >= totalRounds) {
          onEnd(true, score + Math.floor(points));
        } else {
          setRound((prev: number) => prev + 1);
          setWaitingForNext(false);
        }
      }, 1000);
    } else if (!showTarget) {
      toast.error('Too early! Wait for the target!');
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-4"
      onClick={handleClick}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Reaction Rush ⚡</CardTitle>
            <div className="flex justify-between text-lg mt-4">
              <span>Round: {round}/{totalRounds}</span>
              <span>Score: {score}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center relative cursor-pointer">
              {!showTarget && !waitingForNext && (
                <p className="text-white text-2xl">Wait for the target...</p>
              )}
              {waitingForNext && (
                <p className="text-white text-2xl">Get ready...</p>
              )}
              {showTarget && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <Target className="w-20 h-20 text-white" />
                </motion.div>
              )}
            </div>
            <p className="text-gray-800 mt-4">Click the target as fast as you can!</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Memory Master Game Component
function MemoryMasterGame({ gameState, setGameState, onEnd, generateMemorySequence, difficulty , onExit}: any) {
  const [round, setRound] = useState(gameState.round || 1);
  const [score, setScore] = useState(gameState.score || 0);
  const [sequence, setSequence] = useState(gameState.sequence || []);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isShowing, setIsShowing] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10;

  const colorMap: any = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  useEffect(() => {
    if (isShowing && sequence.length > 0) {
      if (currentIndex < sequence.length) {
        const timer = setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
        }, 800);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => {
          setIsShowing(false);
          setCurrentIndex(0);
        }, 500);
      }
    }
  }, [isShowing, currentIndex, sequence]);

  const handleColorClick = (color: string) => {
    if (isShowing) return;
    
    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);
    
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      toast.error('Wrong! Sequence broken.');
      onEnd(false, score);
      return;
    }
    
    if (newUserSequence.length === sequence.length) {
      const points = sequence.length * 50;
      setScore((prev: number) => prev + points);
      toast.success(`Perfect! +${points} points`);
      
      if (round >= totalRounds) {
        onEnd(true, score + points);
      } else {
        setRound((prev: number) => prev + 1);
        setSequence(generateMemorySequence(difficulty));
        setUserSequence([]);
        setIsShowing(true);
        setCurrentIndex(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Memory Master 🧠</CardTitle>
            <div className="flex justify-between text-lg mt-4">
              <span>Round: {round}/{totalRounds}</span>
              <span>Score: {score}</span>
            </div>
            <p className="text-gray-800 mt-2">
              {isShowing ? 'Watch the sequence...' : 'Repeat the pattern!'}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {Object.keys(colorMap).map((color) => (
                <motion.button
                  key={color}
                  className={`h-24 rounded-xl ${colorMap[color]} ${
                    isShowing && sequence[currentIndex - 1] === color ? 'ring-4 ring-white' : ''
                  } ${!isShowing ? 'hover:opacity-80 cursor-pointer' : 'cursor-not-allowed'}`}
                  whileHover={!isShowing ? { scale: 1.05 } : {}}
                  whileTap={!isShowing ? { scale: 0.95 } : {}}
                  onClick={() => handleColorClick(color)}
                  disabled={isShowing}
                />
              ))}
            </div>
            <Progress value={(userSequence.length / sequence.length) * 100} className="h-2" />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Trivia Battle Game Component
function TriviaBattleGame({ gameState, setGameState, onEnd, generateTriviaQuestion, difficulty , onExit}: any) {
  const [round, setRound] = useState(gameState.round || 1);
  const [score, setScore] = useState(gameState.score || 0);
  const [question, setQuestion] = useState(gameState.question);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answered, setAnswered] = useState(false);
  const totalRounds = 10;

  useEffect(() => {
    if (timeLeft > 0 && !answered) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answered) {
      handleAnswer('');
    }
  }, [timeLeft, answered]);

  const handleAnswer = (answer: string) => {
    setAnswered(true);
    
    if (answer === question.answer) {
      const points = 100 + (timeLeft * 10);
      setScore((prev: number) => prev + points);
      toast.success(`Correct! +${points} points`);
    } else {
      toast.error(`Wrong! The answer was: ${question.answer}`);
    }
    
    setTimeout(() => {
      if (round >= totalRounds) {
        onEnd(answer === question.answer, score + (answer === question.answer ? 100 + (timeLeft * 10) : 0));
      } else {
        setRound((prev: number) => prev + 1);
        setQuestion(generateTriviaQuestion(difficulty));
        setTimeLeft(15);
        setAnswered(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Trivia Battle 🎯</CardTitle>
            <div className="flex justify-between text-lg mt-4">
              <span>Round: {round}/{totalRounds}</span>
              <span>Score: {score}</span>
              <span className={`${timeLeft < 5 ? 'text-red-600 font-bold' : ''}`}>⏱️ {timeLeft}s</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 rounded-xl mb-6">
              <h3 className="text-2xl font-bold mb-6">{question.question}</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {question.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`h-20 text-lg ${
                    answered && option === question.answer
                      ? 'bg-green-500'
                      : answered && option !== question.answer
                      ? 'bg-red-500'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Color Clash Game Component
function ColorClashGame({ gameState, setGameState, onEnd, generateColorChallenge, difficulty , onExit}: any) {
  const [round, setRound] = useState(gameState.round || 1);
  const [score, setScore] = useState(gameState.score || 0);
  const [challenge, setChallenge] = useState(gameState.challenge);
  const [timeLeft, setTimeLeft] = useState(5);
  const totalRounds = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;

  const colorMap: any = {
    red: 'text-red-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    pink: 'text-pink-500',
    cyan: 'text-cyan-500'
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleAnswer('skip');
    }
  }, [timeLeft]);

  const handleAnswer = (answer: string) => {
    if (answer === challenge.correctAnswer || answer === challenge.text.toLowerCase()) {
      const points = difficulty === 'hard' ? 100 : 50;
      setScore((prev: number) => prev + points);
      toast.success(`Correct! +${points} points`);
    } else if (answer !== 'skip') {
      toast.error('Wrong!');
    }
    
    if (round >= totalRounds) {
      onEnd(true, score);
    } else {
      setRound((prev: number) => prev + 1);
      setChallenge(generateColorChallenge(difficulty));
      setTimeLeft(5);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Color Clash 🎨</CardTitle>
            <div className="flex justify-between text-lg mt-4">
              <span>Round: {round}/{totalRounds}</span>
              <span>Score: {score}</span>
              <span className={`${timeLeft < 3 ? 'text-red-600 font-bold' : ''}`}>⏱️ {timeLeft}s</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-12 rounded-xl mb-6">
              <h3 className={`text-8xl font-black ${colorMap[challenge.color]}`}>
                {challenge.text}
              </h3>
              <p className="text-gray-800 mt-4">What COLOR is this text?</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'].map((color) => (
                <Button
                  key={color}
                  onClick={() => handleAnswer(color)}
                  className={`h-16 text-lg capitalize ${colorMap[color]} bg-white hover:bg-gray-100 border-2`}
                >
                  {color}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Math Mayhem Game Component
function MathMayhemGame({ gameState, setGameState, onEnd, generateMathProblem, difficulty , onExit}: any) {
  const [answer, setAnswer] = useState('');
  const [round, setRound] = useState(gameState.round || 1);
  const [score, setScore] = useState(gameState.score || 0);
  const [problem, setProblem] = useState(gameState.problem);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 7);
  const totalRounds = 15;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSkip();
    }
  }, [timeLeft]);

  const handleSubmit = () => {
    if (parseInt(answer) === problem.answer) {
      const points = 100 + (timeLeft * 5);
      setScore((prev: number) => prev + points);
      toast.success(`Correct! +${points} points`);
      
      if (round >= totalRounds) {
        onEnd(true, score + points);
      } else {
        setRound((prev: number) => prev + 1);
        setProblem(generateMathProblem(difficulty));
        setAnswer('');
        setTimeLeft(difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 7);
      }
    } else {
      toast.error(`Wrong! The answer was: ${problem.answer}`);
      setAnswer('');
    }
  };

  const handleSkip = () => {
    toast.info(`The answer was: ${problem.answer}`);
    
    if (round >= totalRounds) {
      onEnd(false, score);
    } else {
      setRound((prev: number) => prev + 1);
      setProblem(generateMathProblem(difficulty));
      setAnswer('');
      setTimeLeft(difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 7);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Math Mayhem 🔢</CardTitle>
            <div className="flex justify-between text-lg mt-4">
              <span>Round: {round}/{totalRounds}</span>
              <span>Score: {score}</span>
              <span className={`${timeLeft < 5 ? 'text-red-600 font-bold' : ''}`}>⏱️ {timeLeft}s</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-12 rounded-xl mb-6">
              <h3 className="text-6xl font-black mb-4">
                {problem.num1} {problem.op} {problem.num2} = ?
              </h3>
            </div>

            <Input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Your answer..."
              className="text-3xl text-center h-16 font-bold mb-4"
              autoFocus
            />

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!answer}
                className="flex-1 h-16 text-xl bg-gradient-to-r from-green-500 to-emerald-500"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Submit
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 h-16 text-xl"
              >
                <ChevronRight className="w-6 h-6 mr-2" />
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Emoji Hunt Game Component
function EmojiHuntGame({ gameState, setGameState, onEnd, generateEmojiPuzzle, difficulty , onExit}: any) {
  const [answer, setAnswer] = useState('');
  const [round, setRound] = useState(gameState.round || 1);
  const [score, setScore] = useState(gameState.score || 0);
  const [puzzle, setPuzzle] = useState(gameState.puzzle);
  const [timeLeft, setTimeLeft] = useState(difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 10);
  const totalRounds = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSkip();
    }
  }, [timeLeft]);

  const handleSubmit = () => {
    if (parseInt(answer) === puzzle.count) {
      const points = 100 + (timeLeft * 5);
      setScore((prev: number) => prev + points);
      toast.success(`Correct! +${points} points`);
      
      if (round >= totalRounds) {
        onEnd(true, score + points);
      } else {
        setRound((prev: number) => prev + 1);
        setPuzzle(generateEmojiPuzzle(difficulty));
        setAnswer('');
        setTimeLeft(difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 10);
      }
    } else {
      toast.error(`Wrong! There were ${puzzle.count}`);
      setAnswer('');
    }
  };

  const handleSkip = () => {
    toast.info(`There were ${puzzle.count} ${puzzle.target}`);
    
    if (round >= totalRounds) {
      onEnd(false, score);
    } else {
      setRound((prev: number) => prev + 1);
      setPuzzle(generateEmojiPuzzle(difficulty));
      setAnswer('');
      setTimeLeft(difficulty === 'easy' ? 20 : difficulty === 'medium' ? 15 : 10);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Emoji Hunt 🔍</CardTitle>
            <div className="flex justify-between text-lg mt-4">
              <span>Round: {round}/{totalRounds}</span>
              <span>Score: {score}</span>
              <span className={`${timeLeft < 10 ? 'text-red-600 font-bold' : ''}`}>⏱️ {timeLeft}s</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-6 rounded-xl mb-6">
              <p className="text-2xl font-bold mb-4 text-gray-900">
                How many {puzzle.target} do you see?
              </p>
              <div 
                className="grid gap-2 mb-4"
                style={{
                  gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))`
                }}
              >
                {puzzle.grid.map((emoji: string, index: number) => (
                  <div key={index} className="text-4xl bg-gray-100 p-2 rounded">
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            <Input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Your answer..."
              className="text-3xl text-center h-16 font-bold mb-4"
              autoFocus
            />

            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!answer}
                className="flex-1 h-16 text-xl bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                Submit
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 h-16 text-xl"
              >
                <ChevronRight className="w-6 h-6 mr-2" />
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
