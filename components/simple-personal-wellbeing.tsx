
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Heart,
  Brain,
  Moon,
  Smile,
  Shield,
  Users,
  Clock,
  CheckCircle,
  Zap,
  Target,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { hapticFeedback } from '@/lib/mobile-utils';

interface SimplePersonalWellbeingProps {
  onBack: () => void;
  context?: string;
}

interface WellbeingTool {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'quick' | 'daily' | 'emergency' | 'weekly';
  time: string;
  steps: string[];
  benefits: string[];
}

export default function SimplePersonalWellbeing({ onBack, context = 'general' }: SimplePersonalWellbeingProps) {
  const [selectedTool, setSelectedTool] = useState<WellbeingTool | null>(null);
  const [completedTools, setCompletedTools] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('quick');

  const wellbeingTools: WellbeingTool[] = [
    // Quick Tools (2-5 minutes)
    {
      id: 'deep-breathing',
      title: 'Deep Breathing',
      description: 'Simple breathing exercise to calm your mind and reduce stress instantly.',
      icon: Heart,
      category: 'quick',
      time: '2 minutes',
      steps: [
        'Sit or stand comfortably',
        'Close your eyes if you feel comfortable',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Breathe out slowly through your mouth for 6 counts',
        'Repeat 5-8 times',
        'Notice how you feel after'
      ],
      benefits: ['Reduces stress', 'Calms anxiety', 'Improves focus', 'Lowers heart rate']
    },
    {
      id: 'grounding-54321',
      title: '5-4-3-2-1 Grounding',
      description: 'Use your senses to bring yourself back to the present moment.',
      icon: Brain,
      category: 'quick',
      time: '3 minutes',
      steps: [
        'Name 5 things you can see around you',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste',
        'Take a deep breath',
        'Notice how you feel now'
      ],
      benefits: ['Stops panic attacks', 'Reduces overwhelm', 'Brings you to present', 'Easy to remember']
    },
    {
      id: 'positive-affirmations',
      title: 'Quick Confidence Boost',
      description: 'Simple positive statements to improve your mood and confidence.',
      icon: Smile,
      category: 'quick',
      time: '2 minutes',
      steps: [
        'Stand or sit up straight',
        'Look in a mirror if available',
        'Say out loud: "I am capable"',
        'Say: "I am doing my best"',
        'Say: "I deserve good things"',
        'Say: "I can handle this"',
        'Smile at yourself'
      ],
      benefits: ['Boosts confidence', 'Improves mood', 'Changes negative thinking', 'Builds self-esteem']
    },
    {
      id: 'body-scan',
      title: 'Quick Body Check',
      description: 'Notice tension in your body and release it.',
      icon: Zap,
      category: 'quick',
      time: '3 minutes',
      steps: [
        'Sit comfortably',
        'Close your eyes',
        'Notice your head - relax any tension',
        'Check your shoulders - let them drop',
        'Relax your arms and hands',
        'Soften your chest and stomach',
        'Relax your legs and feet',
        'Take 3 deep breaths'
      ],
      benefits: ['Releases physical tension', 'Increases body awareness', 'Promotes relaxation', 'Reduces headaches']
    },

    // Daily Tools (10-15 minutes)
    {
      id: 'morning-routine',
      title: 'Morning Energy Boost',
      description: 'Start your day with positivity and energy.',
      icon: Moon,
      category: 'daily',
      time: '10 minutes',
      steps: [
        'Drink a glass of water',
        'Do 5 gentle stretches',
        'Write down 3 things you are grateful for',
        'Set 1 positive goal for the day',
        'Take 10 deep breaths',
        'Say something kind to yourself',
        'Plan 1 thing to look forward to'
      ],
      benefits: ['Increases energy', 'Improves mood', 'Sets positive tone', 'Builds healthy habits']
    },
    {
      id: 'evening-reflection',
      title: 'Evening Wind Down',
      description: 'End your day peacefully and prepare for good sleep.',
      icon: Moon,
      category: 'daily',
      time: '15 minutes',
      steps: [
        'Turn off screens 1 hour before bed',
        'Write down 1 good thing that happened today',
        'Write down 1 thing you learned',
        'Think of 3 people you care about',
        'Do gentle stretches',
        'Practice deep breathing',
        'Set tomorrow as a fresh start'
      ],
      benefits: ['Better sleep', 'Processes the day', 'Reduces worry', 'Promotes gratitude']
    },
    {
      id: 'mood-tracker',
      title: 'Daily Mood Check',
      description: 'Track how you feel to understand patterns.',
      icon: Target,
      category: 'daily',
      time: '5 minutes',
      steps: [
        'Rate your mood from 1-10',
        'Write what made you feel good today',
        'Write what was challenging',
        'Note what you need tomorrow',
        'Choose 1 self-care action',
        'Plan something to look forward to',
        'Be kind to yourself'
      ],
      benefits: ['Increases self-awareness', 'Identifies triggers', 'Tracks progress', 'Improves planning']
    },

    // Emergency Tools (when feeling very upset)
    {
      id: 'crisis-breathing',
      title: 'Emergency Calm Down',
      description: 'When you feel panic, anxiety, or very upset.',
      icon: Shield,
      category: 'emergency',
      time: '5 minutes',
      steps: [
        'Find a safe, quiet space',
        'Sit down if possible',
        'Put one hand on your chest, one on your stomach',
        'Breathe in through nose for 4 counts',
        'Hold for 4 counts',
        'Breathe out through mouth for 8 counts',
        'Repeat until you feel calmer',
        'Call someone if you need support'
      ],
      benefits: ['Stops panic attacks', 'Calms the nervous system', 'Gives you control', 'Prevents escalation']
    },
    {
      id: 'ice-cube-trick',
      title: 'Ice Cube Technique',
      description: 'Use cold sensation to interrupt overwhelming feelings.',
      icon: Zap,
      category: 'emergency',
      time: '2 minutes',
      steps: [
        'Get an ice cube or cold water',
        'Hold the ice cube in your hand',
        'Focus completely on the cold feeling',
        'Move the ice cube around your palm',
        'Notice how the cold changes',
        'This interrupts overwhelming emotions',
        'Follow with deep breathing'
      ],
      benefits: ['Interrupts intense emotions', 'Grounds you quickly', 'Safe and accessible', 'Works for anger and panic']
    },

    // Weekly Tools (longer activities)
    {
      id: 'gratitude-letter',
      title: 'Write a Thank You Letter',
      description: 'Write to someone who has helped or inspired you.',
      icon: BookOpen,
      category: 'weekly',
      time: '20 minutes',
      steps: [
        'Think of someone who has been kind to you',
        'Write a letter thanking them',
        'Be specific about what they did',
        'Explain how it helped you',
        'You do not have to send it',
        'Keep it to read when you feel down',
        'Notice how writing it makes you feel'
      ],
      benefits: ['Increases gratitude', 'Improves relationships', 'Boosts happiness', 'Creates positive memories']
    },
    {
      id: 'nature-connection',
      title: 'Nature Time',
      description: 'Spend time outdoors or with plants to improve wellbeing.',
      icon: Users,
      category: 'weekly',
      time: '30 minutes',
      steps: [
        'Go outside or sit by a window',
        'Find some plants, trees, or sky to look at',
        'Take deep breaths of fresh air',
        'Notice colors, sounds, and textures',
        'Touch something natural if you can',
        'Sit quietly for 5 minutes',
        'Thank nature for being there'
      ],
      benefits: ['Reduces stress hormones', 'Improves mood', 'Connects you to something bigger', 'Free and available']
    }
  ];

  const categories = [
    { id: 'quick', label: 'Quick Relief', count: wellbeingTools.filter(t => t.category === 'quick').length, icon: Zap },
    { id: 'daily', label: 'Daily Habits', count: wellbeingTools.filter(t => t.category === 'daily').length, icon: Clock },
    { id: 'emergency', label: 'Crisis Help', count: wellbeingTools.filter(t => t.category === 'emergency').length, icon: Shield },
    { id: 'weekly', label: 'Weekly Care', count: wellbeingTools.filter(t => t.category === 'weekly').length, icon: Heart }
  ];

  const filteredTools = wellbeingTools.filter(tool => tool.category === activeCategory);

  const handleToolComplete = (toolId: string) => {
    if (!completedTools.includes(toolId)) {
      setCompletedTools(prev => [...prev, toolId]);
      hapticFeedback.notification('success');
    }
  };

  const completionPercentage = (completedTools.length / wellbeingTools.length) * 100;

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page)}>
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={combineThemeClasses("sticky top-0 z-40 border-b shadow-sm", okayitTheme.backgrounds.glass)}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={combineThemeClasses("text-xl font-bold", okayitTheme.text.primary)}>
                    Personal Wellbeing
                  </h1>
                  <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
                    Simple exercises and coping strategies
                  </p>
                </div>
              </div>
            </div>
            
            {completedTools.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className={combineThemeClasses("text-sm font-medium", okayitTheme.text.primary)}>
                    {completedTools.length} / {wellbeingTools.length}
                  </p>
                  <p className="text-xs text-green-600">Tools Tried</p>
                </div>
                <div className="w-12">
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? 'default' : 'outline'}
                className="flex items-center space-x-2"
              >
                <Icon className="w-4 h-4" />
                <span>{category.label}</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-xs">
                  {category.count}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="wait">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              const isCompleted = completedTools.includes(tool.id);
              
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={combineThemeClasses(
                      "h-full cursor-pointer transition-all duration-300 border-2 hover:shadow-lg",
                      isCompleted ? "border-green-200 bg-green-50/50 dark:border-green-600 dark:bg-green-100/10" : "",
                      okayitTheme.backgrounds.card
                    )}
                    onClick={() => setSelectedTool(tool)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-xl shadow-lg ${
                            tool.category === 'quick' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                            tool.category === 'daily' ? 'bg-gradient-to-r from-green-500 to-teal-500' :
                            tool.category === 'emergency' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                            'bg-gradient-to-r from-indigo-500 to-pink-500'
                          }`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className={combineThemeClasses("text-lg font-bold", okayitTheme.text.primary)}>
                              {tool.title}
                            </CardTitle>
                            <p className="text-sm text-gray-900 flex items-center space-x-2">
                              <Clock className="w-3 h-3" />
                              <span>{tool.time}</span>
                            </p>
                          </div>
                        </div>
                        
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className={combineThemeClasses("text-sm mb-3", okayitTheme.text.secondary)}>
                        {tool.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tool.benefits.slice(0, 2).map((benefit) => (
                          <span 
                            key={benefit}
                            className="bg-gray-100 dark:bg-purple-950/20 text-xs px-2 py-1 rounded"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                      
                      <Button 
                        className="w-full text-sm"
                        variant={isCompleted ? "outline" : "default"}
                      >
                        {isCompleted ? 'Try Again' : 'Start Exercise'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Tool Detail Modal */}
      <AnimatePresence>
        {selectedTool && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTool(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-purple-950/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedTool.category === 'quick' ? 'bg-blue-100 text-blue-600' :
                    selectedTool.category === 'daily' ? 'bg-green-100 text-green-600' :
                    selectedTool.category === 'emergency' ? 'bg-red-100 text-red-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <selectedTool.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {selectedTool.title}
                    </h3>
                    <p className="text-sm text-gray-900">{selectedTool.time}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedTool(null)}
                >
                  ×
                </Button>
              </div>
              
              <p className="text-gray-900 dark:text-gray-300 mb-4">
                {selectedTool.description}
              </p>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Steps:</h4>
                <ol className="space-y-2">
                  {selectedTool.steps.map((step, index) => (
                    <li key={index} className="flex space-x-2 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-gray-900 dark:text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Benefits:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTool.benefits.map((benefit) => (
                    <span 
                      key={benefit}
                      className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-1 rounded"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleToolComplete(selectedTool.id)}
                  className="flex-1"
                  disabled={completedTools.includes(selectedTool.id)}
                >
                  {completedTools.includes(selectedTool.id) ? 'Completed!' : 'Mark Complete'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedTool(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
