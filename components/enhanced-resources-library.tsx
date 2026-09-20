
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, FileText, Heart, Shield, Star, CheckCircle, BookOpen, Users, 
  Smile, Award, Calendar, Target, Eye, Edit, ArrowLeft, Play, Pause,
  Brain, Coffee, Lightbulb, Music, Palette, Phone, MessageCircle,
  Clock, Activity, Sparkles, Sun, Moon, Wind, Zap, AlertCircle,
  GraduationCap, Video, Smartphone, Headphones as HeadphonesIcon, Mic
} from 'lucide-react';
import { okayitTheme, combineThemeClasses, tikTokTransitions } from '@/lib/okayit-theme';
import OkayitLogo from './okayit-logo';
import { trackActivity } from './progress-dashboard-new';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import VoiceInputButton from '@/components/voice-input-button';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'guide' | 'form' | 'activity' | 'wellbeing' | 'mental-health' | 'life-skills' | 'education';
  icon: any;
  color: string;
  hasView: boolean;
  hasForm: boolean;
  hasDownload: boolean;
  content?: {
    introduction?: string;
    sections?: Array<{title: string; content: string}>;
    tips?: string[];
    contacts?: Array<{name: string; phone: string; description: string}>;
    multimedia?: Array<{type: string; title: string; url: string; description: string}>;
  };
  formFields?: Array<{
    type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
    label: string;
    name: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
  }>;
}

const resources: Resource[] = [
  // WELLBEING RESOURCES
  {
    id: 'feelings-chart',
    title: 'Understanding My Feelings',
    description: 'Learn to identify and express your emotions in healthy ways',
    category: 'wellbeing',
    icon: Smile,
    color: okayitTheme.colors.amber,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Your feelings are important and valid. This resource helps you understand and express them.',
      sections: [
        {
          title: 'Common Feelings',
          content: 'Happy, Sad, Angry, Scared, Confused, Excited, Worried, Calm, Frustrated, Proud, Jealous, Lonely, Content, Overwhelmed, Peaceful.'
        },
        {
          title: 'Why Feelings Matter',
          content: 'Feelings give us important information about ourselves and our environment. They help us make decisions and connect with others. No feeling is wrong or bad - they all serve a purpose.'
        },
        {
          title: 'Healthy Ways to Express Feelings',
          content: 'Talk to someone you trust. Write in a journal. Create art or music. Exercise or move your body. Practice deep breathing. Use "I feel" statements.'
        }
      ],
      tips: [
        'Name your feeling - this helps reduce its intensity',
        'Remember feelings come and go like waves',
        'It is okay to feel multiple emotions at once',
        'Your feelings are valid even if others do not understand them'
      ]
    },
    formFields: [
      { type: 'date', label: 'Date', name: 'date', required: true },
      { type: 'select', label: 'How am I feeling today?', name: 'mood', options: ['Happy', 'Sad', 'Angry', 'Scared', 'Confused', 'Excited', 'Worried', 'Calm', 'Other'], required: true },
      { type: 'text', label: 'What made me feel this way?', name: 'trigger', placeholder: 'Describe what happened...', required: false },
      { type: 'textarea', label: 'How did my body feel?', name: 'physical', placeholder: 'E.g., tight chest, butterflies in stomach, relaxed...', required: false },
      { type: 'textarea', label: 'What did I do about it?', name: 'action', placeholder: 'How did you cope or respond?', required: false },
      { type: 'select', label: 'How well did I manage this feeling?', name: 'management', options: ['Very well', 'Well', 'Okay', 'Struggled', 'Need help'], required: false }
    ]
  },
  {
    id: 'breathing-exercises',
    title: 'Calm Breathing Techniques',
    description: 'Learn powerful breathing exercises to calm your mind and body',
    category: 'wellbeing',
    icon: Wind,
    color: okayitTheme.colors.blue,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Your breath is a powerful tool that is always with you. These techniques can help you feel calmer in just minutes.',
      sections: [
        {
          title: 'Box Breathing (4-4-4-4)',
          content: 'Breathe IN for 4 counts, HOLD for 4, breathe OUT for 4, HOLD for 4. Repeat 5-10 times. This activates your calm response and is used by athletes and military personnel.'
        },
        {
          title: '5-5 Breathing',
          content: 'Breathe in slowly through your nose for 5 counts, then breathe out slowly through your mouth for 5 counts. Do this for 2 minutes. Perfect for when you are feeling anxious.'
        },
        {
          title: 'Belly Breathing',
          content: 'Place one hand on your chest and one on your belly. Breathe so that only your belly hand moves. This engages your diaphragm and triggers relaxation.'
        },
        {
          title: 'When to Use Breathing',
          content: 'Before an exam or important event. When you feel angry or upset. Before bed to help you sleep. When you notice your heart racing. Anytime you want to feel more calm.'
        }
      ],
      tips: [
        'Practice when you are calm so it is easier when you are stressed',
        'You cannot do it wrong - any conscious breathing helps',
        'Notice how your body feels before and after',
        'Breathing exercises are science-based and really work'
      ]
    }
  },
  {
    id: 'sleep-guide',
    title: 'Better Sleep Guide',
    description: 'Tips and techniques for getting quality rest every night',
    category: 'wellbeing',
    icon: Moon,
    color: okayitTheme.colors.indigo,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Good sleep is essential for your physical and mental health. These strategies can help you sleep better.',
      sections: [
        {
          title: 'Why Sleep Matters',
          content: 'Sleep helps your brain process emotions and memories. It strengthens your immune system. It improves concentration and mood. Teens need 8-10 hours per night.'
        },
        {
          title: 'Creating a Sleep Routine',
          content: 'Go to bed at the same time each night. Stop screens 1 hour before bed. Keep your room cool, dark, and quiet. Do a calming activity before bed (reading, gentle music).'
        },
        {
          title: 'What to Avoid',
          content: 'Caffeine after 3pm. Large meals before bed. Intense exercise close to bedtime. Stressful conversations at night. Bright lights and screens.'
        }
      ],
      tips: [
        'If you cannot sleep after 20 minutes, get up and do something calm',
        'Write down worries before bed so they do not keep you awake',
        'Use your bed only for sleep - not for homework or screens',
        'Talk to staff if sleep problems continue for more than 2 weeks'
      ]
    },
    formFields: [
      { type: 'date', label: 'Date', name: 'date', required: true },
      { type: 'text', label: 'What time did I go to bed?', name: 'bedtime', placeholder: 'E.g., 10:30 PM', required: true },
      { type: 'text', label: 'What time did I wake up?', name: 'waketime', placeholder: 'E.g., 7:00 AM', required: true },
      { type: 'select', label: 'How was my sleep quality?', name: 'quality', options: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'], required: true },
      { type: 'textarea', label: 'What helped or hurt my sleep?', name: 'factors', placeholder: 'E.g., avoided screens, felt worried about something...', required: false },
      { type: 'checkbox', label: 'I followed my bedtime routine', name: 'routine', required: false }
    ]
  },
  {
    id: 'mindfulness-intro',
    title: 'Introduction to Mindfulness',
    description: 'Simple mindfulness practices for young people',
    category: 'wellbeing',
    icon: Brain,
    color: okayitTheme.colors.purple,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Mindfulness means paying attention to the present moment without judgment. It is a skill anyone can learn.',
      sections: [
        {
          title: 'What is Mindfulness?',
          content: 'Mindfulness is being aware of where you are and what you are doing, without being overwhelmed by what is going on around you. It is not about stopping your thoughts - it is about noticing them without getting caught up in them.'
        },
        {
          title: 'One-Minute Mindfulness',
          content: 'Sit comfortably. Close your eyes or look down. Notice your breath - where do you feel it? In your nose? Your chest? Your belly? When your mind wanders (it will!), gently bring attention back to your breath. That is it. You are being mindful.'
        },
        {
          title: '5-4-3-2-1 Grounding',
          content: 'Name 5 things you can SEE. 4 things you can TOUCH. 3 things you can HEAR. 2 things you can SMELL. 1 thing you can TASTE. This brings you into the present moment.'
        },
        {
          title: 'Mindful Activities',
          content: 'Mindful eating - really taste your food. Mindful walking - notice each step. Mindful listening - really hear the music. Any activity can be mindful if you pay full attention.'
        }
      ],
      tips: [
        'Start with just 1 minute per day',
        'There is no way to do it wrong',
        'Your mind will wander - that is normal and okay',
        'Mindfulness is a practice, not a perfect'
      ]
    }
  },

  // MENTAL HEALTH RESOURCES
  {
    id: 'anxiety-management',
    title: 'Managing Anxiety and Worry',
    description: 'Practical tools for when worry feels overwhelming',
    category: 'mental-health',
    icon: AlertCircle,
    color: okayitTheme.colors.orange,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Anxiety is your body trying to protect you, but sometimes it overreacts. These tools can help you feel more in control.',
      sections: [
        {
          title: 'Understanding Anxiety',
          content: 'Anxiety is worry about future events. Physical symptoms: racing heart, sweaty palms, tight chest, stomach upset. Mental symptoms: racing thoughts, difficulty concentrating, expecting the worst. Anxiety is treatable and manageable.'
        },
        {
          title: 'Immediate Relief Techniques',
          content: 'Deep breathing (4-4-4-4). Cold water on face or ice cube. Ground yourself (5-4-3-2-1). Move your body. Talk to someone. Challenge worried thoughts.'
        },
        {
          title: 'Worry Time Technique',
          content: 'Set aside 15 minutes per day as "worry time." When anxious thoughts come up during the day, tell yourself "I will think about this during worry time." This helps contain worry instead of it taking over your whole day.'
        },
        {
          title: 'When to Get Help',
          content: 'If anxiety interferes with school, relationships, or daily activities. If you avoid things you used to enjoy. If physical symptoms are frequent. If you have panic attacks. If worry is constant. Talk to your key worker, doctor, or therapist.'
        }
      ],
      tips: [
        'Anxiety often makes you think the worst will happen - challenge these thoughts',
        'Avoidance makes anxiety worse in the long run',
        'You are stronger than your anxiety',
        'Many people experience anxiety - you are not alone'
      ],
      contacts: [
        { name: 'YoungMinds Crisis Messenger', phone: 'Text YM to 85258', description: '24/7 mental health text support' },
        { name: 'Anxiety UK', phone: '03444 775 774', description: 'Helpline for anxiety support' },
        { name: 'NSPCC Helpline', phone: '0800 800 5000', description: 'Help for children and young people' }
      ]
    },
    formFields: [
      { type: 'date', label: 'Date', name: 'date', required: true },
      { type: 'select', label: 'Anxiety level today', name: 'anxiety_level', options: ['1 - Minimal', '2 - Mild', '3 - Moderate', '4 - Severe', '5 - Extreme'], required: true },
      { type: 'textarea', label: 'What triggered my anxiety?', name: 'trigger', placeholder: 'What was I worried about?', required: false },
      { type: 'textarea', label: 'Physical symptoms I noticed', name: 'symptoms', placeholder: 'E.g., fast heartbeat, sweating, stomach ache...', required: false },
      { type: 'textarea', label: 'What coping strategies did I use?', name: 'coping', placeholder: 'E.g., breathing, talking to someone, went for a walk...', required: false },
      { type: 'select', label: 'How well did the strategies work?', name: 'effectiveness', options: ['Very helpful', 'Somewhat helpful', 'A little helpful', 'Not helpful'], required: false }
    ]
  },
  {
    id: 'depression-support',
    title: 'Understanding Low Mood and Depression',
    description: 'Information and support for when everything feels heavy',
    category: 'mental-health',
    icon: Heart,
    color: okayitTheme.colors.pink,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Depression is more than just feeling sad. It is a real medical condition that affects how you think, feel, and function. It is treatable.',
      sections: [
        {
          title: 'Signs of Depression',
          content: 'Persistent sad or empty mood. Loss of interest in things you used to enjoy. Changes in sleep (too much or too little). Changes in appetite. Feeling tired all the time. Difficulty concentrating. Feelings of worthlessness or hopelessness. Thoughts of death or suicide. If you have several of these for more than 2 weeks, talk to someone.'
        },
        {
          title: 'What Helps',
          content: 'Talk to a professional - depression responds well to treatment. Stay connected to people even when you do not feel like it. Stick to a routine. Get some physical activity (even a short walk helps). Eat regular meals. Be patient with yourself - recovery takes time.'
        },
        {
          title: 'What Does NOT Help',
          content: 'Isolating yourself completely. Using substances to numb feelings. Making big life decisions while depressed. Believing you will always feel this way. Blaming yourself - depression is not your fault.'
        },
        {
          title: 'For Friends Supporting Someone',
          content: 'Listen without judging. Tell them you care. Encourage them to get help. Spend time with them. Do not say "just cheer up" or "others have it worse." Take suicide thoughts seriously and tell an adult.'
        }
      ],
      tips: [
        'Depression is not weakness - it is an illness',
        'You deserve help and support',
        'Small steps count - even getting out of bed is an achievement',
        'If you are thinking about suicide, tell someone NOW - call 999 or text SHOUT to 85258'
      ],
      contacts: [
        { name: 'CRISIS - Call 999', phone: '999', description: 'If you or someone else is in immediate danger' },
        { name: 'Crisis Text Line', phone: 'Text SHOUT to 85258', description: 'Free 24/7 text support' },
        { name: 'Childline', phone: '0800 1111', description: 'Confidential support for young people' },
        { name: 'Samaritans', phone: '116 123', description: '24/7 listening service' }
      ]
    }
  },
  {
    id: 'trauma-healing',
    title: 'Healing from Difficult Experiences',
    description: 'Gentle guidance for processing trauma and building resilience',
    category: 'mental-health',
    icon: Shield,
    color: okayitTheme.colors.teal,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'If you have been through difficult or traumatic experiences, healing is possible. You are not defined by what happened to you.',
      sections: [
        {
          title: 'What is Trauma?',
          content: 'Trauma is your emotional response to a terrible event like an accident, abuse, neglect, loss, or violence. Trauma can affect how you think, feel, and behave. It is a normal response to abnormal events.'
        },
        {
          title: 'Common Trauma Responses',
          content: 'Flashbacks or nightmares. Feeling numb or disconnected. Being easily startled. Difficulty trusting people. Anger or irritability. Guilt or shame. Avoiding reminders of the event. These are normal survival responses.'
        },
        {
          title: 'Healing Takes Time',
          content: 'Healing is not linear - some days will be harder than others. Professional help (therapy) really works. Talking about it when YOU are ready (not before). Building safe relationships. Creating a sense of safety in your environment.'
        },
        {
          title: 'Grounding When Triggered',
          content: 'If you feel overwhelmed or flashback: Notice 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste. This reminds your brain you are safe NOW. Splash cold water on your face. Remind yourself: "That was then, this is now, I am safe here."'
        }
      ],
      tips: [
        'What happened to you is not your fault',
        'Healing is possible - your brain can rewire itself',
        'You are incredibly strong for surviving',
        'Asking for help is brave, not weak'
      ],
      contacts: [
        { name: 'NSPCC', phone: '0800 1111', description: 'Support for children and young people' },
        { name: 'The Survivors Trust', phone: '08088 010 818', description: 'Support for survivors of trauma and abuse' },
        { name: 'Victim Support', phone: '08 08 16 89 111', description: 'Free and confidential support' }
      ]
    }
  },

  // LIFE SKILLS RESOURCES
  {
    id: 'money-basics',
    title: 'Money Management Basics',
    description: 'Essential financial skills for independent living',
    category: 'life-skills',
    icon: Coffee,
    color: okayitTheme.colors.green,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Learning to manage money is an essential life skill that will serve you well throughout your life.',
      sections: [
        {
          title: 'Budgeting Basics',
          content: 'Income (money coming in): allowance, job earnings, benefits. Expenses (money going out): essentials (food, transport, phone), wants (entertainment, clothes, treats). The rule: Income should be greater than expenses. Track where your money goes for one month to learn your patterns.'
        },
        {
          title: '50-30-20 Rule',
          content: '50% for NEEDS (essentials you must have). 30% for WANTS (things you enjoy but do not need). 20% for SAVINGS (building your future). Adjust these percentages to fit your situation.'
        },
        {
          title: 'Saving Strategies',
          content: 'Pay yourself first - save before you spend. Start small - even £5/week adds up. Use a separate savings account so you are not tempted. Save for specific goals (phone, laptop, future flat). Emergency fund: try to save £50-100 for unexpected expenses.'
        },
        {
          title: 'Avoiding Money Problems',
          content: 'Only spend what you have - avoid debt when young. Watch out for "must have" marketing tricks. Wait 24 hours before buying non-essentials. Compare prices. Ask: Do I need this or want this?'
        }
      ],
      tips: [
        'Financial mistakes are learning opportunities',
        'Saving feels hard at first but gets easier with practice',
        'Talk to staff about money - they can help you learn',
        'Building good money habits now sets you up for life'
      ]
    },
    formFields: [
      { type: 'date', label: 'Week Starting', name: 'date', required: true },
      { type: 'text', label: 'Total Income This Week', name: 'income', placeholder: '£', required: true },
      { type: 'text', label: 'Spent on Essentials', name: 'essentials', placeholder: '£ (food, transport, phone)', required: false },
      { type: 'text', label: 'Spent on Wants', name: 'wants', placeholder: '£ (entertainment, clothes)', required: false },
      { type: 'text', label: 'Saved This Week', name: 'saved', placeholder: '£', required: false },
      { type: 'textarea', label: 'Biggest expense this week', name: 'biggest_expense', placeholder: 'What did you spend the most on?', required: false },
      { type: 'textarea', label: 'Money lessons learned', name: 'lessons', placeholder: 'What went well or what would you do differently?', required: false }
    ]
  },
  {
    id: 'cooking-basics',
    title: 'Simple Cooking and Nutrition',
    description: 'Learn to prepare healthy, affordable meals',
    category: 'life-skills',
    icon: Coffee,
    color: okayitTheme.colors.orange,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Cooking is an essential skill for independent living. You do not need to be a chef - just learn a few basic, healthy meals.',
      sections: [
        {
          title: 'Kitchen Safety First',
          content: 'Always wash hands before cooking. Keep raw meat separate from other foods. Use different chopping boards for meat and vegetables. Turn pan handles inward so you do not knock them. Never leave cooking food unattended. Keep a fire extinguisher nearby and know how to use it.'
        },
        {
          title: 'Five Meals Everyone Should Know',
          content: '1. Pasta with tomato sauce and vegetables. 2. Scrambled eggs on toast. 3. Chicken and rice. 4. Bean chili or curry. 5. Jacket potato with tuna/beans/cheese. Master these and you will never go hungry.'
        },
        {
          title: 'Budget-Friendly Shopping',
          content: 'Make a list before shopping. Buy store brands - often same quality, lower price. Buy frozen vegetables - just as nutritious, less waste. Plan meals for the week. Cook bigger portions and freeze leftovers. Check reduced sections for deals.'
        },
        {
          title: 'Nutrition Basics',
          content: 'Aim for balanced meals: protein (meat, fish, eggs, beans), carbs (rice, pasta, bread, potatoes), vegetables (fill half your plate). Drink water, not sugary drinks. Eat breakfast - your brain needs fuel. Limit processed foods high in sugar, salt, and fat.'
        }
      ],
      tips: [
        'Start with simple recipes and build confidence',
        'Cooking together with housemates can be fun and save money',
        'Keep basic staples in stock: rice, pasta, tinned tomatoes, beans, eggs',
        'Ask staff to teach you - they are usually happy to help'
      ]
    }
  },
  {
    id: 'job-readiness',
    title: 'Getting Ready for Work',
    description: 'CV writing, interviews, and workplace skills',
    category: 'life-skills',
    icon: Target,
    color: okayitTheme.colors.blue,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Getting your first job is exciting! These skills will help you find work and succeed once you are hired.',
      sections: [
        {
          title: 'Creating a CV',
          content: 'Personal details: name, phone, email (use a professional email address). Personal statement: 2-3 sentences about who you are and what you want. Education: schools attended, qualifications. Experience: jobs, volunteering, responsibilities at home/school. Skills: communication, teamwork, IT, languages. References: teachers, youth workers, previous employers (ask permission first).'
        },
        {
          title: 'Job Search Tips',
          content: 'Start with entry-level positions. Look at: supermarkets, cafes, restaurants, retail, leisure centers. Use: Indeed, Reed, local job centers, company websites. Apply in person - shows initiative. Follow up a few days after applying. Keep track of where you have applied.'
        },
        {
          title: 'Interview Success',
          content: 'Research the company beforehand. Arrive 10 minutes early. Dress smartly (clean, ironed clothes). Make eye contact and smile. Prepare answers to: Tell me about yourself. Why do you want this job? What are your strengths/weaknesses? Do you have any questions for us?'
        },
        {
          title: 'Workplace Skills',
          content: 'Punctuality: arrive on time, every time. Reliability: do what you say you will do. Communication: ask if you do not understand. Teamwork: help colleagues when you can. Professionalism: phones away, focus on work. Positive attitude: be pleasant even on hard days.'
        }
      ],
      tips: [
        'Everyone feels nervous at interviews - it is normal',
        'Rejection is part of job searching - keep trying',
        'Start building experience through volunteering',
        'Ask staff or mentors to review your CV and do practice interviews'
      ]
    },
    formFields: [
      { type: 'text', label: 'Your Full Name', name: 'name', required: true },
      { type: 'text', label: 'Phone Number', name: 'phone', required: true },
      { type: 'text', label: 'Email Address', name: 'email', required: true },
      { type: 'textarea', label: 'Personal Statement', name: 'statement', placeholder: 'Write 2-3 sentences about yourself and your goals', required: true },
      { type: 'textarea', label: 'Education', name: 'education', placeholder: 'List schools attended and qualifications', required: true },
      { type: 'textarea', label: 'Work Experience', name: 'experience', placeholder: 'Jobs, volunteering, responsibilities', required: false },
      { type: 'textarea', label: 'Skills', name: 'skills', placeholder: 'What are you good at?', required: true },
      { type: 'textarea', label: 'References', name: 'references', placeholder: 'Name, position, contact details (ask permission first)', required: false }
    ]
  },

  // EDUCATION RESOURCES
  {
    id: 'study-skills',
    title: 'Effective Study Techniques',
    description: 'Learn how to study smarter, not harder',
    category: 'education',
    icon: BookOpen,
    color: okayitTheme.colors.indigo,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Good study skills can make learning easier and more enjoyable. These techniques are based on research about how the brain learns best.',
      sections: [
        {
          title: 'Active Learning Methods',
          content: 'Do not just read passively. Instead: Summarize in your own words. Teach someone else. Create flashcards. Practice problems. Draw diagrams or mind maps. Test yourself regularly. Active methods work better than just reading and highlighting.'
        },
        {
          title: 'The Pomodoro Technique',
          content: 'Study for 25 minutes with full focus. Take a 5-minute break. After 4 sessions, take a longer 15-30 minute break. This keeps your brain fresh and prevents burnout. Use a timer on your phone.'
        },
        {
          title: 'Creating a Study Space',
          content: 'Find a quiet place with good lighting. Keep it tidy and organized. Remove distractions (phone, TV). Have all materials ready before you start. Use the same space regularly - your brain will associate it with learning.'
        },
        {
          title: 'Memory Techniques',
          content: 'Spaced repetition: review material over increasing intervals. Mnemonics: create memorable phrases or images. Chunking: break information into smaller pieces. Sleep: memory consolidation happens during sleep. Understanding beats memorization.'
        },
        {
          title: 'Before Exams',
          content: 'Start revising early - cramming does not work. Practice past papers under timed conditions. Get enough sleep. Eat breakfast on exam day. Stay hydrated. Arrive early to feel calm. Read questions carefully. Start with questions you know.'
        }
      ],
      tips: [
        'Everyone learns differently - experiment to find what works for you',
        'Mistakes help you learn - do not be afraid to get things wrong',
        'Take breaks - your brain needs rest to process information',
        'Ask for help early if you are struggling'
      ]
    },
    formFields: [
      { type: 'date', label: 'Study Session Date', name: 'date', required: true },
      { type: 'text', label: 'Subject Studied', name: 'subject', required: true },
      { type: 'text', label: 'Topic Covered', name: 'topic', required: true },
      { type: 'select', label: 'Study Method Used', name: 'method', options: ['Reading and highlighting', 'Flashcards', 'Practice problems', 'Teaching someone', 'Mind maps', 'Past papers', 'Other'], required: false },
      { type: 'text', label: 'Time Spent', name: 'duration', placeholder: 'E.g., 45 minutes', required: false },
      { type: 'select', label: 'How well did I understand this?', name: 'understanding', options: ['Completely understood', 'Mostly understood', 'Partially understood', 'Struggling', 'Very confused'], required: true },
      { type: 'textarea', label: 'What do I still need to review?', name: 'review_needed', placeholder: 'Topics or concepts that need more work', required: false },
      { type: 'textarea', label: 'Questions to ask teacher', name: 'questions', required: false }
    ]
  },
  {
    id: 'goal-setting',
    title: 'Setting and Achieving Goals',
    description: 'Learn to set SMART goals and create action plans',
    category: 'education',
    icon: Target,
    color: okayitTheme.colors.purple,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Goals give you direction and motivation. Learning to set and achieve goals is a skill that will help you throughout life.',
      sections: [
        {
          title: 'SMART Goals',
          content: 'Specific: exactly what do you want to achieve? Measurable: how will you know when you have achieved it? Achievable: is it realistic for you right now? Relevant: does it matter to you? Time-bound: when will you achieve it by? Example: Instead of "Get fit" try "Go to the gym 3 times per week for 8 weeks."'
        },
        {
          title: 'Breaking Down Big Goals',
          content: 'Big goals can feel overwhelming. Break them into smaller steps. Example: Goal - Pass my GCSEs. Steps: 1. Create study timetable. 2. Complete one practice paper per subject. 3. Ask teacher for help on weak areas. 4. Review notes weekly. 5. Get enough sleep before exams. Small steps make big goals achievable.'
        },
        {
          title: 'Staying Motivated',
          content: 'Write down WHY the goal matters to you. Visualize achieving it - how will you feel? Track your progress - celebrate small wins. Tell someone about your goal - accountability helps. Review and adjust if needed - flexibility is okay. Do not give up after setbacks - they are part of the process.'
        },
        {
          title: 'When Goals Change',
          content: 'It is okay to change or abandon goals if they no longer serve you. Your priorities can shift - that is normal. What matters is that your goals align with what YOU want, not what others expect. Reflect regularly: Is this still important to me?'
        }
      ],
      tips: [
        'Start with one or two goals - do not overwhelm yourself',
        'Write goals down and put them somewhere you will see them',
        'Review progress weekly',
        'Ask staff or mentors to support you'
      ]
    },
    formFields: [
      { type: 'text', label: 'My Goal', name: 'goal', placeholder: 'What do I want to achieve?', required: true },
      { type: 'textarea', label: 'Why is this important to me?', name: 'why', placeholder: 'Your motivation', required: true },
      { type: 'date', label: 'Target Achievement Date', name: 'target_date', required: true },
      { type: 'textarea', label: 'Steps to achieve this goal', name: 'steps', placeholder: 'Break it down into small, actionable steps', required: true },
      { type: 'textarea', label: 'Potential obstacles', name: 'obstacles', placeholder: 'What might get in the way?', required: false },
      { type: 'textarea', label: 'How will I overcome obstacles?', name: 'solutions', placeholder: 'Your strategies', required: false },
      { type: 'textarea', label: 'Who can support me?', name: 'support', placeholder: 'People or resources that can help', required: false },
      { type: 'select', label: 'Priority Level', name: 'priority', options: ['High - Very important', 'Medium - Important', 'Low - Nice to have'], required: true }
    ]
  },

  // TRADITIONAL RESOURCES (Updated)
  {
    id: 'welcome-pack',
    title: 'Welcome to Your New Home',
    description: 'A friendly guide to help you settle in and feel comfortable',
    category: 'guide',
    icon: Heart,
    color: okayitTheme.colors.pink,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'We are so happy you are here. This is your new home, and we want you to feel comfortable, safe, and happy.',
      sections: [
        {
          title: 'About Your New Home',
          content: 'This is a place where you can feel safe, be yourself, and grow. We have a great team of staff who care about you and want to help you thrive. Your room is your personal space where you can relax and be yourself.'
        },
        {
          title: 'First Few Days',
          content: 'Take your time settling in. Meet the staff and other young people when you feel ready. Explore the house and grounds. Ask questions - no question is silly. Your key worker will help you get familiar with everything.'
        },
        {
          title: 'House Rules',
          content: 'Be kind and respectful to everyone. Keep common areas tidy. Follow your daily routine. Tell us if something is wrong or you need help. These rules help everyone feel safe and comfortable.'
        },
        {
          title: 'Getting Help',
          content: 'Your key worker is your main contact. Any staff member can help you in an emergency. We have regular house meetings where you can share ideas. There is a complaints and compliments procedure if you need it.'
        }
      ]
    }
  },
  {
    id: 'rights-guide',
    title: 'Know Your Rights',
    description: 'Learn about your rights in a fun and easy way',
    category: 'guide',
    icon: Shield,
    color: okayitTheme.colors.blue,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'You have rights that keep you safe and help you thrive. Here are your most important rights.',
      sections: [
        {
          title: 'Your Core Rights',
          content: '1. Right to Be Safe - protected from harm. 2. Right to Be Heard - your opinions matter. 3. Right to Privacy - private time and space. 4. Right to Education - learn and develop. 5. Right to Healthcare - medical care when needed. 6. Right to Have Fun - play and enjoy activities. 7. Right to Be Yourself - express who you are. 8. Right to Get Help - ask for support anytime.'
        },
        {
          title: 'What This Means in Practice',
          content: 'You can say no to things that make you uncomfortable. You can ask questions and give your opinion. You can spend time alone in your room. You will go to school and get support with learning. You will see a doctor/dentist regularly. You can join activities and have hobbies. You can be proud of your culture, religion, and identity. Staff are here to help you.'
        },
        {
          title: 'If Your Rights Are Not Respected',
          content: 'Talk to your key worker or another trusted adult. Use the complaints procedure. Contact your social worker. Call an advocate - they support young people in care. Rights are not just words - they are real and should be protected.'
        }
      ],
      contacts: [
        { name: 'Childline', phone: '0800 1111', description: 'Confidential support and advice' },
        { name: 'Children\'s Commissioner', phone: 'help.team@childrenscommissioner.gov.uk', description: 'Helping children know their rights' },
        { name: 'Coram Voice', phone: '0808 800 5792', description: 'Advocacy for children in care' }
      ]
    }
  },
  {
    id: 'daily-routine',
    title: 'My Daily Routine Planner',
    description: 'Plan your day with this colorful and interactive schedule',
    category: 'form',
    icon: Calendar,
    color: okayitTheme.colors.purple,
    hasView: false,
    hasForm: true,
    hasDownload: true,
    formFields: [
      { type: 'date', label: 'Date', name: 'date', required: true },
      { type: 'text', label: '7:00 AM - 8:00 AM', name: 'slot_1', placeholder: 'Morning Routine', required: false },
      { type: 'text', label: '8:00 AM - 9:00 AM', name: 'slot_2', placeholder: 'Breakfast', required: false },
      { type: 'text', label: '9:00 AM - 12:00 PM', name: 'slot_3', placeholder: 'School / Learning Time', required: false },
      { type: 'text', label: '12:00 PM - 1:00 PM', name: 'slot_4', placeholder: 'Lunch Break', required: false },
      { type: 'text', label: '1:00 PM - 3:00 PM', name: 'slot_5', placeholder: 'Afternoon Activities', required: false },
      { type: 'text', label: '3:00 PM - 5:00 PM', name: 'slot_6', placeholder: 'Free Time / Hobbies', required: false },
      { type: 'text', label: '5:00 PM - 6:00 PM', name: 'slot_7', placeholder: 'Dinner', required: false },
      { type: 'text', label: '6:00 PM - 8:00 PM', name: 'slot_8', placeholder: 'Evening Activities', required: false },
      { type: 'text', label: '8:00 PM - 9:00 PM', name: 'slot_9', placeholder: 'Wind Down Time', required: false },
      { type: 'text', label: '9:00 PM', name: 'slot_10', placeholder: 'Bedtime', required: false }
    ]
  },
  {
    id: 'achievement-tracker',
    title: 'My Achievement Tracker',
    description: 'Track your progress and celebrate your wins',
    category: 'activity',
    icon: Award,
    color: okayitTheme.colors.green,
    hasView: false,
    hasForm: true,
    hasDownload: true,
    formFields: [
      { type: 'date', label: 'Date', name: 'date', required: true },
      { type: 'text', label: 'My Achievement', name: 'achievement', placeholder: 'What did I accomplish?', required: true },
      { type: 'select', label: 'Category', name: 'category', options: ['School/Learning', 'Personal Growth', 'Relationships', 'Health/Wellbeing', 'Life Skills', 'Creativity', 'Other'], required: true },
      { type: 'textarea', label: 'Why this matters to me', name: 'significance', placeholder: 'What makes this achievement special?', required: false },
      { type: 'textarea', label: 'What helped me achieve this?', name: 'support', placeholder: 'Skills, people, or strategies that helped', required: false },
      { type: 'textarea', label: 'My next goal', name: 'next_goal', placeholder: 'Where do I want to go from here?', required: false }
    ]
  },

  // MENTAL HEALTH APPS & TOOLS
  {
    id: 'headspace-app',
    title: 'Headspace - Meditation App',
    description: 'Guided meditation and mindfulness exercises for better mental health',
    category: 'mental-health',
    icon: Brain,
    color: okayitTheme.colors.purple,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Headspace offers guided meditation sessions designed for young people.',
      sections: [
        {
          title: 'What is Headspace?',
          content: 'Headspace is an app that teaches meditation and mindfulness. It has special programs for stress, anxiety, sleep, and focus.'
        },
        {
          title: 'How to Use It',
          content: 'Download the app from App Store or Google Play. Start with the basics course (10 minutes per day). Try different topics like stress, sleep, or focus. Use it daily for best results.'
        },
        {
          title: 'Free vs Paid',
          content: 'Free: Basic meditation courses and some sleep sounds. Paid subscription (£12.99/month): Full library of meditations, sleep sounds, and specialized courses. Student discount available.'
        }
      ],
      tips: [
        'Start with just 5 minutes per day',
        'Use the sleep sounds at bedtime',
        'Try the SOS exercises when feeling overwhelmed',
        'Track your progress in the app'
      ],
      multimedia: [
        {
          type: 'app',
          title: 'Download Headspace',
          url: 'https://www.headspace.com',
          description: 'Available on iOS and Android'
        }
      ]
    }
  },
  {
    id: 'calm-app',
    title: 'Calm - Sleep & Meditation',
    description: 'Relaxation app with sleep stories, meditations, and breathing exercises',
    category: 'wellbeing',
    icon: Heart,
    color: okayitTheme.colors.blue,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Calm helps you sleep better, reduce stress, and feel more relaxed.',
      sections: [
        {
          title: 'Key Features',
          content: 'Sleep Stories: Bedtime stories read by soothing voices. Meditation: Guided sessions from 3-25 minutes. Music: Relaxing soundscapes. Breathing: Guided breathing exercises. Masterclasses: Learn about mindfulness, stress, and anxiety.'
        },
        {
          title: 'Best For',
          content: 'Trouble falling asleep. Feeling anxious or stressed. Need to relax and unwind. Want to learn meditation. Improve focus and concentration.'
        }
      ],
      tips: [
        'Listen to sleep stories at bedtime',
        'Use the 7-day trial before subscribing',
        'Try different meditation teachers to find your favorite',
        'Use the breathing exercises during stressful moments'
      ],
      multimedia: [
        {
          type: 'app',
          title: 'Download Calm',
          url: 'https://www.calm.com',
          description: 'Available on iOS and Android'
        }
      ]
    }
  },

  // EDUCATIONAL APPS & WEBSITES
  {
    id: 'khan-academy',
    title: 'Khan Academy - Free Learning',
    description: 'Free online courses in math, science, and more',
    category: 'education',
    icon: GraduationCap,
    color: okayitTheme.colors.green,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Khan Academy offers completely free education for anyone, anywhere.',
      sections: [
        {
          title: 'What You Can Learn',
          content: 'Math: From basic arithmetic to calculus. Science: Biology, chemistry, physics. Computing: Programming, computer science. Arts & Humanities: History, grammar, art history. Test Prep: SAT, LSAT, MCAT prep. Life Skills: Financial literacy, college admissions.'
        },
        {
          title: 'How It Works',
          content: 'Create a free account. Choose your subjects and grade level. Watch video lessons at your own pace. Practice with interactive exercises. Earn points and badges for learning. Track your progress on the dashboard.'
        }
      ],
      tips: [
        'Set a daily learning goal (even 15 minutes helps)',
        'Watch videos at 1.5x speed once you understand basics',
        'Use practice exercises to reinforce learning',
        'Download the mobile app for learning on the go'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'Khan Academy',
          url: 'https://www.khanacademy.org',
          description: 'Start learning for free'
        }
      ]
    }
  },
  {
    id: 'bbc-bitesize',
    title: 'BBC Bitesize - UK Curriculum',
    description: 'Free revision resources aligned with UK schools',
    category: 'education',
    icon: BookOpen,
    color: okayitTheme.colors.orange,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'BBC Bitesize provides free educational resources for all UK school levels.',
      sections: [
        {
          title: 'What Is Available',
          content: 'All subjects: Math, English, Science, History, Geography, Languages. All levels: KS1, KS2, KS3, GCSE, A-Level. All exam boards: AQA, Edexcel, OCR, WJEC, SQA. Videos, quizzes, and study guides.'
        },
        {
          title: 'How to Use for Revision',
          content: '1. Find your subject and exam board. 2. Watch video lessons on topics you find difficult. 3. Read the revision guides. 4. Do practice questions. 5. Use the quizzes to test yourself.'
        }
      ],
      tips: [
        'Bookmark topics you need to review',
        'Use it alongside your school textbooks',
        'Watch videos before exams to refresh your memory',
        'Practice questions are great for understanding what examiners want'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'BBC Bitesize',
          url: 'https://www.bbc.co.uk/bitesize',
          description: 'Start learning now'
        }
      ]
    }
  },

  // ONLINE SAFETY & DIGITAL WELLBEING
  {
    id: 'instagram-safety',
    title: 'Instagram Safety Guide',
    description: 'Stay safe on Instagram with privacy settings and reporting tools',
    category: 'life-skills',
    icon: Shield,
    color: okayitTheme.colors.pink,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Learn how to use Instagram safely and protect yourself online.',
      sections: [
        {
          title: 'Privacy Settings',
          content: 'Make your account private: Go to Settings > Privacy > Private Account. Control who can comment: Settings > Privacy > Comments. Hide your story from specific people: Settings > Privacy > Story.'
        },
        {
          title: 'Reporting & Blocking',
          content: 'To report: Tap the three dots on a post/profile > Report. To block: Tap three dots on profile > Block. Report bullying, harassment, or inappropriate content.'
        },
        {
          title: 'Healthy Usage Tips',
          content: 'Set daily time limits in Settings. Turn off notifications at night. Unfollow accounts that make you feel bad. Remember: people only post their best moments.'
        }
      ],
      tips: [
        'Never share your password with anyone',
        'Do not accept DMs from strangers',
        'Be careful what you post - it can be screenshotted',
        'If something makes you uncomfortable, report it'
      ],
      multimedia: []
    }
  },
  {
    id: 'tiktok-safety',
    title: 'TikTok Safety & Privacy',
    description: 'How to use TikTok safely and manage your privacy',
    category: 'life-skills',
    icon: Video,
    color: okayitTheme.colors.purple,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'TikTok can be fun, but it is important to stay safe and protect your privacy.',
      sections: [
        {
          title: 'Make Your Account Private',
          content: 'Go to Settings and Privacy > Privacy. Turn on Private Account. This means only approved followers can see your videos.'
        },
        {
          title: 'Control Who Can Interact',
          content: 'Comments: Choose Everyone, Friends, or Nobody. Duets & Stitch: Control who can use your videos. Messages: Choose Friends or Nobody.'
        },
        {
          title: 'Red Flags to Watch For',
          content: 'Adults asking to chat privately. Requests for personal information. Inappropriate comments or messages. Challenges that could be dangerous.'
        }
      ],
      tips: [
        'Never share personal info in videos',
        'Report and block accounts that make you uncomfortable',
        'Do not participate in dangerous challenges',
        'Tell a trusted adult if something worries you'
      ],
      multimedia: []
    }
  },

  // HOBBIES & CREATIVE RESOURCES
  {
    id: 'youtube-learning',
    title: 'YouTube Learning Channels',
    description: 'Best educational and creative YouTube channels for young people',
    category: 'activity',
    icon: Video,
    color: okayitTheme.colors.orange,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'YouTube has thousands of channels where you can learn new skills for free.',
      sections: [
        {
          title: 'Educational Channels',
          content: 'Crash Course: Fast-paced lessons on science, history, literature. TED-Ed: Animated lessons. Khan Academy: Detailed tutorials. Kurzgesagt: Science videos. SciShow: Science news.'
        },
        {
          title: 'Creative & Hobby Channels',
          content: 'Art: Draw with Jazza, Moriah Elizabeth. Music: Andrew Huang, David Bennett Piano. Cooking: Binging with Babish, Tasty. DIY & Crafts: 5-Minute Crafts, Mr Kate.'
        }
      ],
      tips: [
        'Subscribe to channels you love',
        'Create playlists to organize videos by topic',
        'Watch at 1.5x or 2x speed to learn faster',
        'Turn on parental controls if needed'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'YouTube Learning',
          url: 'https://www.youtube.com/learning',
          description: 'Curated educational content'
        }
      ]
    }
  },

  // MUSIC & ENTERTAINMENT
  {
    id: 'spotify-wellbeing',
    title: 'Spotify Wellbeing Playlists',
    description: 'Curated playlists for relaxation, focus, and mood boosting',
    category: 'wellbeing',
    icon: Music,
    color: okayitTheme.colors.green,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Music can significantly improve your mood and mental health. Spotify has specialized playlists for every situation.',
      sections: [
        {
          title: 'Wellbeing Playlists',
          content: 'Search for these on Spotify: "Peaceful Piano" - Calming piano music. "Deep Focus" - Ambient music for concentration. "Chill Vibes" - Relaxing background music. "Sleep" - Soothing sounds for bedtime. "Confidence Boost" - Uplifting tracks.'
        },
        {
          title: 'How Music Helps',
          content: 'Reduces stress and anxiety. Improves focus and productivity. Boosts mood and motivation. Helps you sleep better. Provides emotional release. Creates positive associations.'
        }
      ],
      tips: [
        'Free Spotify has ads - upgrade to Premium for ad-free (student discount available)',
        'Download playlists for offline listening',
        'Use Daily Mix for personalized music',
        'Discover Weekly suggests new music every Monday'
      ],
      multimedia: [
        {
          type: 'app',
          title: 'Spotify',
          url: 'https://www.spotify.com',
          description: 'Download the app'
        }
      ]
    }
  },

  // NEW COMPREHENSIVE RESOURCES FROM PDFs
  {
    id: 'emotional-regulation-toolkit',
    title: 'Emotional Regulation Toolkit',
    description: 'Practical strategies for understanding and managing emotions, including coping techniques and mindfulness exercises',
    category: 'mental-health',
    icon: Heart,
    color: okayitTheme.colors.pink,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Emotions are a normal and important part of life. This toolkit will help you recognize, understand, and manage your emotions in healthy ways.',
      sections: [
        {
          title: 'The Emotion Wheel',
          content: 'Primary Emotions: Happy (joyful, excited, content, proud), Sad (disappointed, lonely, hurt, grief), Angry (frustrated, irritated, furious, annoyed), Scared (anxious, worried, terrified, nervous), Surprised (amazed, confused, startled), Disgusted (revolted, disappointed, ashamed). Learn to identify what you\'re feeling by understanding these core emotions and their variations.'
        },
        {
          title: 'Coping Strategies Toolbox',
          content: 'When feeling overwhelmed: Deep breathing (4-7-8 technique), Progressive muscle relaxation, Grounding exercises (5-4-3-2-1 method), Safe space visualization. When feeling angry: Physical exercise or movement, Punch a pillow or scream into it, Write in a journal, Talk to someone you trust, Count to 10 (or 100). When feeling sad: Allow yourself to cry, Listen to music that matches your mood, Do something creative, Reach out to friends or support people, Practice self-care activities. When feeling anxious: Focus on your breathing, Challenge negative thoughts, Do a calming activity (drawing, music), Ground yourself in the present moment, Talk through your worries.'
        },
        {
          title: 'Mindfulness Exercises',
          content: '5-4-3-2-1 Grounding: 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, 1 thing you can taste. Body Scan: Sit or lie comfortably, Focus on each part of your body, Notice any tension or sensations, Breathe into areas that feel tight.'
        },
        {
          title: 'Building Emotional Intelligence',
          content: 'Recognizing Triggers: What situations make you feel strong emotions? What thoughts or memories trigger difficult feelings? How does your body respond to stress? Healthy Expression: Talk about your feelings, Write in a journal, Create art or music, Physical movement or exercise.'
        },
        {
          title: 'Daily Emotional Check-ins',
          content: 'Rate your emotions each day (1-10): How am I feeling overall? What emotions am I experiencing? What might be causing these feelings? What do I need right now?'
        }
      ],
      tips: [
        'Name your feeling - this helps reduce its intensity',
        'Remember feelings come and go like waves',
        'Your feelings are valid even if others don\'t understand',
        'Practice self-compassion when experiencing difficult emotions'
      ],
      contacts: [
        { name: 'Childline', phone: '0800 1111', description: 'Free confidential helpline for young people' },
        { name: 'Shout Crisis Text Line', phone: 'Text SHOUT to 85258', description: '24/7 text support for mental health crises' }
      ]
    },
    formFields: [
      { type: 'date', label: 'Date', name: 'date', required: true },
      { type: 'select', label: 'Primary emotion today', name: 'emotion', options: ['Happy', 'Sad', 'Angry', 'Scared', 'Surprised', 'Disgusted', 'Mixed'], required: true },
      { type: 'text', label: 'What triggered this feeling?', name: 'trigger', placeholder: 'What happened?', required: false },
      { type: 'textarea', label: 'Physical sensations', name: 'physical', placeholder: 'How did your body feel?', required: false },
      { type: 'textarea', label: 'Coping strategy used', name: 'coping', placeholder: 'What did you do to manage?', required: false },
      { type: 'select', label: 'How well did it work?', name: 'effectiveness', options: ['Very well', 'Well', 'Somewhat', 'Not well', 'Didn\'t try'], required: false }
    ]
  },
  {
    id: 'healthy-relationships-guide',
    title: 'Healthy Relationships Guide',
    description: 'Understanding healthy vs unhealthy relationships, communication skills, and recognizing red flags',
    category: 'life-skills',
    icon: Users,
    color: okayitTheme.colors.green,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Healthy relationships involve respect, trust and consideration for each other. This guide helps you understand what makes relationships healthy or unhealthy.',
      sections: [
        {
          title: 'Types of Relationships',
          content: 'You have relationships with: Family members (mums, dads, grandparents, siblings), Friends (peers at school, people your age), Romantic partners (boyfriends, girlfriends), Acquaintances (people you know but wouldn\'t call friends). Each type of relationship has different boundaries and expectations.'
        },
        {
          title: 'Healthy vs Unhealthy Relationships',
          content: 'Healthy: Mutual respect - you value each other and respect boundaries. Trust - you give each other benefit of the doubt. Good communication - you speak honestly and openly. Individuality - you accept people for who they are. Unhealthy: Disrespect - boundaries are not respected. Distrust - trust issues on one or both sides. Miscommunication - issues aren\'t discussed openly. Co-dependence - lack of freedom to express individuality.'
        },
        {
          title: 'Signs of Abuse',
          content: 'Verbal: Shouting, silent treatment, swearing, threatening. Emotional: Manipulation, humiliation, making you scared to leave. Financial: Controlling your finances, stopping you from earning. Physical: Any form of physical harm - hitting, pushing, hurting. Sexual: Any sexual activity without consent, unwanted touching, pressure.'
        },
        {
          title: 'Communication Skills',
          content: 'Use "I feel" statements instead of "You always". Listen actively without interrupting. Ask questions to understand better. Express your needs clearly. Respect when someone says no. Take breaks if discussions get heated.'
        },
        {
          title: 'Building Healthy Relationships',
          content: 'Ask people if they want to be friends - it\'s okay if they say no. Explore your own interests to meet like-minded people. Join clubs and activities you enjoy. Show interest in what interests them. Respect their boundaries and time. Be yourself - don\'t pretend to be someone else.'
        }
      ],
      tips: [
        'Disagreements are normal - it\'s how you handle them that matters',
        'You can\'t change another person, only your own behavior',
        'Trust your instincts - if something feels wrong, it probably is',
        'It\'s okay to end relationships that make you unhappy'
      ],
      contacts: [
        { name: 'Childline', phone: '0800 1111', description: 'Talk about relationship concerns' },
        { name: 'My CWA', phone: '01270 250390', description: '24/7 helpline for relationship abuse' }
      ]
    },
    formFields: [
      { type: 'text', label: 'Relationship I\'m thinking about', name: 'relationship_type', placeholder: 'Friend, family member, romantic partner...', required: true },
      { type: 'textarea', label: 'What makes this relationship good?', name: 'positives', placeholder: 'Positive aspects...', required: false },
      { type: 'textarea', label: 'What concerns me?', name: 'concerns', placeholder: 'Things that worry me...', required: false },
      { type: 'textarea', label: 'How do I feel in this relationship?', name: 'feelings', placeholder: 'My emotional experience...', required: false },
      { type: 'checkbox', label: 'This relationship has mutual respect', name: 'respect', required: false },
      { type: 'checkbox', label: 'I can be myself in this relationship', name: 'authenticity', required: false },
      { type: 'checkbox', label: 'We communicate openly', name: 'communication', required: false }
    ]
  },
  {
    id: 'dating-safety-guide',
    title: 'Dark Sides to Dating - Safety Guide',
    description: 'Essential safety information about dating risks, red flags, and protecting yourself in relationships',
    category: 'life-skills',
    icon: Shield,
    color: okayitTheme.colors.rose,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Dating should be fun and safe. This guide helps you recognize warning signs and stay safe in romantic relationships.',
      sections: [
        {
          title: 'Understanding Consent',
          content: 'Consent occurs when one person voluntarily agrees to a proposal from another. Remember: When asking for consent, no means no. Saying yes to one thing doesn\'t mean consenting to others. Consenting once doesn\'t mean you have to consent again. If someone doesn\'t respond yes or no, assume they haven\'t consented. Everyone has the right to change their mind. Someone under 16 cannot legally give consent to sexual acts.'
        },
        {
          title: 'Warning Signs in Dating',
          content: 'Red flags: Extreme jealousy or possessiveness. Trying to control who you see or what you wear. Checking your phone or social media. Putting you down or making you feel bad. Pressuring you to do things you\'re uncomfortable with. Blaming you for their anger. Threatening to hurt you or themselves. Moving too fast (love bombing).'
        },
        {
          title: 'Types of Dating Abuse',
          content: 'Physical: Hitting, pushing, shoving, hair pulling, any unwanted physical contact. Emotional: Name-calling, humiliation, threats, manipulation, isolation from friends. Sexual: Any unwanted sexual contact, pressure for sexual activity, sharing intimate images without consent. Digital: Excessive messaging, tracking your location, demanding passwords, posting about you without permission.'
        },
        {
          title: 'Staying Safe',
          content: 'Meet in public places for first dates. Tell someone where you\'re going. Keep your phone charged. Trust your instincts. Don\'t feel pressured to drink alcohol. Have your own transport home. Keep boundaries clear. It\'s okay to leave if you feel uncomfortable.'
        },
        {
          title: 'Breaking Up Safely',
          content: 'If you don\'t feel safe, don\'t break up in person - phone or text is okay. If in person, do it in a public place with friends nearby. Don\'t go to the door if your ex comes to your house. Trust your instincts. Block them on social media if needed. Tell trusted adults about the situation.'
        },
        {
          title: 'After a Breakup',
          content: 'Talk to family, friends and support people. Avoid isolated areas. Try not to walk alone. Call 999 if in immediate danger. Memorize important phone numbers. Change passwords if they knew them. Document any harassment or threats.'
        }
      ],
      tips: [
        'You deserve to be treated with respect',
        'Abuse is never your fault',
        'It\'s not love if it hurts',
        'You can leave at any time'
      ],
      contacts: [
        { name: 'Childline', phone: '0800 1111', description: 'Confidential support for relationship concerns' },
        { name: 'My CWA', phone: '01270 250390', description: '24/7 helpline for relationship abuse' },
        { name: 'Emergency', phone: '999', description: 'If you\'re in immediate danger' }
      ]
    }
  },
  {
    id: 'personal-safety-guide',
    title: 'Safety and Me - Personal Safety Guide',
    description: 'Comprehensive personal safety resource covering various situations and how to stay safe',
    category: 'guide',
    icon: Shield,
    color: okayitTheme.colors.purple,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Your safety matters. This guide helps you create personal safety plans for different situations in your life.',
      sections: [
        {
          title: 'Safety at School/College',
          content: 'Use different routes if you don\'t feel safe. Walk with friends or classmates. Choose safe times and places to speak to trusted adults. Eat in safe places with others. Know who your trusted adult at school is. Report bullying or harassment immediately.'
        },
        {
          title: 'Safety Out and About',
          content: 'Meet in public places when with friends. Plan your route and timing. Keep your mobile phone charged. Know who to ring if you feel unsafe. Have a pre-arranged pickup or meeting place. Stay in well-lit areas. Walk with confidence. Trust your instincts.'
        },
        {
          title: 'Online Safety',
          content: 'Not everybody online is who they say they are. Never post personal information like your address or phone number. Think before posting text, pictures or videos - most people can download and share them. Keep privacy settings high. Never meet up with people you\'ve only met online. If something worries you online, tell a trusted adult. This includes sexting, pornography and cyberbullying.'
        },
        {
          title: 'Safety with Images and Messages',
          content: 'You might feel pressure to send pictures of yourself. Never feel pressured to do this. Talk it over with someone you trust before making decisions. Don\'t say or do anything online you wouldn\'t do in person. Never give out passwords or security information. Know how to change privacy settings and find report/delete buttons. Download the Zipit app to help with tricky direct message conversations.'
        },
        {
          title: 'Looking After Your Feelings',
          content: 'Talk to trusted people. Write down your feelings. Draw pictures. Exercise. Practice calm breathing. Do something that makes you happy. Create a safe space with music, mobile phone, pens and paper, sensory items.'
        },
        {
          title: 'Creating Your Safety Plan',
          content: 'Identify safe routes to places you go regularly. List trusted adults you can talk to. Know emergency numbers by heart. Have a code word with family for emergencies. Keep important numbers saved in your phone. Plan what to do if you feel unsafe.'
        }
      ],
      tips: [
        'Trust your instincts - they\'re usually right',
        'It\'s never wrong to ask for help',
        'You have the right to feel safe',
        'Your safety is more important than being polite'
      ],
      contacts: [
        { name: 'Childline', phone: '0800 1111', description: 'Free confidential helpline' },
        { name: 'My CWA', phone: '01270 250390', description: 'Support service' },
        { name: 'Emergency', phone: '999', description: 'If you\'re in immediate danger' }
      ]
    },
    formFields: [
      { type: 'textarea', label: 'Safe routes to school/college', name: 'safe_routes_school', placeholder: 'How can I get to school safely?', required: false },
      { type: 'text', label: 'Friends to walk with', name: 'walk_with', placeholder: 'Names of friends or classmates', required: false },
      { type: 'text', label: 'Trusted adult at school', name: 'trusted_adult', placeholder: 'Name and role', required: false },
      { type: 'textarea', label: 'Safe public meeting places', name: 'safe_places', placeholder: 'Where can I meet friends safely?', required: false },
      { type: 'text', label: 'Emergency contact person', name: 'emergency_contact', placeholder: 'Who to call if unsafe', required: false },
      { type: 'textarea', label: 'My safe space has', name: 'safe_space', placeholder: 'Music, phone, pens, sensory items...', required: false }
    ]
  },
  {
    id: 'looking-after-yourself',
    title: 'Looking After Yourself - Wellbeing Guide',
    description: 'Practical self-care strategies, emotional wellbeing techniques, and building resilience',
    category: 'wellbeing',
    icon: Heart,
    color: okayitTheme.colors.amber,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'This guide has been designed by and for people who need ideas about how to take better care of themselves. It\'s your resource to support you in finding ways to achieve better health and wellbeing.',
      sections: [
        {
          title: 'What is Wellbeing?',
          content: 'Wellbeing is the state of being comfortable, healthy and happy. It includes how satisfied you are with your life, your sense of purpose and how in control you feel. People who are confident and have a positive outlook generally seem better able to cope with life\'s challenges, make healthier choices and have more control over their lives.'
        },
        {
          title: 'Getting Started - Simple Steps',
          content: 'Be kind to yourself. Make a list of things you like to do and do one each week. Practice mindfulness - be aware of your thoughts and sensations without reacting. Write in a journal to process feelings. Do something creative (coloring, art, music). Relax for at least 10 minutes each day. Drink more water. Be active - even 10 minutes of walking helps. Get some daylight every day. Stretch your body morning and night. Connect with friendly, supportive people. Keep learning new skills.'
        },
        {
          title: 'Pleasurable Activities List',
          content: 'Exercise you enjoy. Sit outside and watch clouds or listen to birds. Play on swings or throw a ball. Give yourself a hand massage. Dance to loud music. Watch a box set. Play online games. Post positive memories on social media. Create a scrapbook. Write a blog. Visit or call a friend. Go for a swim. Feed the ducks. Join a local group or class. Do puzzles. Read your favorite book. Draw or paint. Take photos. Go to a library or coffee shop. Get a haircut. Do some gardening. Eat something delicious or cook a meal. Meditate. Sing or play music. Polish furniture. Make a movie on your phone. Make lists of things you admire or aspire to. Write a bucket list.'
        },
        {
          title: 'Mindfulness Practice',
          content: 'Two key elements: 1) Focus on this moment - your breathing, thoughts, feelings, sounds. 2) Acceptance - recognize your thoughts and feelings without judgment, just acknowledge them. Practicing mindfulness daily, even for 5-10 minutes, helps you self-soothe so you\'re ready to deal with difficult experiences without becoming overwhelmed. Imagine difficult thoughts as butterflies dancing away or clouds floating by.'
        },
        {
          title: 'Soothing Yourself',
          content: 'When overwhelmed, relax your body. Use fragrant oils for hand massage. Visit a bakery or florist for pleasant aromas. Lie on grass and smell the fresh scent. Identify different instruments in music. Listen to TV with eyes closed and guess programs. Focus on touch (feet on ground) and taste (flavors in food). Center yourself in the present moment.'
        },
        {
          title: 'Mood Mapping',
          content: 'Track your moods over time to understand patterns. Plot your energy level (vertical axis) and how positive you feel (horizontal axis). Mark your mood point and note what might affect it (sleep, incidents, alcohol). Over time, you\'ll learn what helps and what harms your mood. Reflect on happy and sad times to understand where your mood and energy were.'
        },
        {
          title: 'Journaling Your Journey',
          content: 'Use a journal to offload troublesome thoughts and track progress. Write about feelings, poetry, stories, memories, plans - anything you want. Be creative - draw, doodle, paint, stick quotes. It becomes a treasured companion. Many people who\'ve experienced trauma find journals help manage and untangle feelings. It\'s like a special vault for thoughts only you should see.'
        },
        {
          title: 'Self-Care To-Do List',
          content: 'Write down thoughts that haunt you. Be kind no matter what. Bring home flowers. Talk, think, and when you can\'t talk, try reading. Try not to lie, even to yourself. Treat yourself as your highest priority mentally and physically. Like putting your oxygen mask on first on a plane - you can\'t help others unless you\'re strong and well.'
        }
      ],
      tips: [
        'Small changes in behavior make huge differences over time',
        'Taking care of yourself isn\'t selfish - it makes you stronger',
        'You can\'t pour from an empty cup',
        'Treat yourself as if you were your own closest friend'
      ],
      contacts: [
        { name: 'My CWA', phone: '01270 250390', description: '24/7 helpline' },
        { name: 'My CWA Email', phone: 'info@mycwa.org.uk', description: 'Email support' }
      ]
    },
    formFields: [
      { type: 'date', label: 'Date', name: 'date', required: true },
      { type: 'textarea', label: 'Pleasurable activities I enjoy', name: 'activities', placeholder: 'List things that make you happy...', required: false },
      { type: 'textarea', label: 'How I practiced self-care today', name: 'self_care', placeholder: 'What did you do for yourself?', required: false },
      { type: 'select', label: 'Energy level', name: 'energy', options: ['Very low', 'Low', 'Moderate', 'High', 'Very high'], required: false },
      { type: 'select', label: 'Mood', name: 'mood', options: ['Very negative', 'Negative', 'Neutral', 'Positive', 'Very positive'], required: false },
      { type: 'textarea', label: 'What affected my mood today?', name: 'mood_factors', placeholder: 'Sleep, events, people, activities...', required: false }
    ]
  },
  {
    id: 'identity-life-story',
    title: 'Identity & Life Story Work',
    description: 'Comprehensive guide for exploring identity, understanding personal history, and building a positive sense of self',
    category: 'guide',
    icon: BookOpen,
    color: okayitTheme.colors.teal,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Understanding who you are and where you come from is an important part of growing up. This guide helps you explore your identity and create your life story.',
      sections: [
        {
          title: 'Understanding Identity',
          content: 'Identity is made up of many parts: Your name and what it means. Your family background and culture. Your interests and hobbies. Your values and beliefs. Your strengths and talents. Your goals and dreams. Your experiences and memories. All of these things together make you unique and special.'
        },
        {
          title: 'Exploring Your Story',
          content: 'Everyone has a story. Your story includes: Where you were born. Important people in your life. Significant events and memories. Places you\'ve lived. Schools you\'ve attended. Friends you\'ve made. Challenges you\'ve overcome. Achievements you\'re proud of. It\'s okay if parts of your story are difficult or unclear.'
        },
        {
          title: 'Creating Your Life Story Book',
          content: 'A life story book helps organize your memories and experiences. Include: Photos of yourself at different ages. Pictures of important people. Drawings or artwork. Written memories. Certificates and awards. Letters or cards. Maps of places you\'ve lived. Timeline of important events. You can add to it over time.'
        },
        {
          title: 'Understanding Your Feelings About Your Story',
          content: 'It\'s normal to have mixed feelings about your story. You might feel: Proud of things you\'ve overcome. Sad about difficult times. Angry about things that happened. Confused about missing pieces. Happy about good memories. Grateful for people who helped. All of these feelings are valid and okay.'
        },
        {
          title: 'Building a Positive Sense of Self',
          content: 'Focus on your strengths and positive qualities. Remember times you showed courage. Celebrate your achievements, big and small. Surround yourself with supportive people. Practice self-compassion. Set goals for your future. Remember that your past doesn\'t define your future.'
        }
      ],
      tips: [
        'Your story is unique and valuable',
        'It\'s okay to ask questions about your past',
        'You can decide what to include in your life story',
        'Take breaks if exploring your story feels overwhelming'
      ]
    },
    formFields: [
      { type: 'text', label: 'My full name and what it means', name: 'name_meaning', placeholder: 'Your name and its significance', required: false },
      { type: 'textarea', label: 'Important people in my life', name: 'important_people', placeholder: 'Who matters to you?', required: false },
      { type: 'textarea', label: 'Places I\'ve lived', name: 'places', placeholder: 'Where have you lived?', required: false },
      { type: 'textarea', label: 'My strengths and talents', name: 'strengths', placeholder: 'What are you good at?', required: false },
      { type: 'textarea', label: 'Achievements I\'m proud of', name: 'achievements', placeholder: 'What have you accomplished?', required: false },
      { type: 'textarea', label: 'My hopes and dreams for the future', name: 'future_goals', placeholder: 'What do you dream of?', required: false }
    ]
  },
  {
    id: 'building-resilience',
    title: 'Building Resilience Workbook',
    description: 'Interactive workbook focusing on developing resilience, coping skills, and emotional strength',
    category: 'mental-health',
    icon: Award,
    color: okayitTheme.colors.amber,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Resilience is the ability to bounce back from difficult situations. It\'s not about avoiding problems, but learning how to cope with and overcome them.',
      sections: [
        {
          title: 'What is Resilience?',
          content: 'Resilience means: Being able to cope with stress and adversity. Bouncing back from setbacks. Learning from difficulties. Growing stronger through challenges. Maintaining hope during hard times. Adapting to change. Everyone can build resilience - it\'s a skill you can learn and strengthen.'
        },
        {
          title: 'Building Blocks of Resilience',
          content: 'Connection - Having supportive relationships. Self-care - Taking care of your physical and mental health. Purpose - Having goals and things that matter to you. Hope - Maintaining optimism about the future. Healthy thinking - Challenging negative thoughts. Self-awareness - Understanding your emotions. Problem-solving - Finding ways to address challenges. Self-regulation - Managing your emotions and behavior.'
        },
        {
          title: 'Developing Coping Skills',
          content: 'Healthy coping strategies: Talking to someone you trust. Physical exercise. Creative expression (art, music, writing). Mindfulness and relaxation. Setting and achieving small goals. Helping others. Spending time in nature. Maintaining routines. Unhealthy coping to avoid: Substance use. Self-harm. Isolation. Avoidance. Excessive screen time.'
        },
        {
          title: 'Learning from Setbacks',
          content: 'When facing challenges: Acknowledge your feelings. Identify what you can control. Break problems into smaller parts. Try different solutions. Ask for help when needed. Reflect on what worked and what didn\'t. Celebrate small wins. Remember past successes. Each challenge is an opportunity to build strength.'
        },
        {
          title: 'Building Your Support Network',
          content: 'Identify people who: Listen without judgment. Offer practical help. Encourage and support you. Make you feel valued. Are reliable and trustworthy. This might include: Family members. Friends. Teachers or mentors. Support workers. Counselors or therapists. Community members.'
        }
      ],
      tips: [
        'Resilience grows stronger with practice',
        'Small steps lead to big changes',
        'It\'s okay to ask for help - that\'s being resilient',
        'Your struggles don\'t define you, but overcoming them strengthens you'
      ]
    },
    formFields: [
      { type: 'textarea', label: 'My support network', name: 'support_network', placeholder: 'Who can I turn to for support?', required: false },
      { type: 'textarea', label: 'Challenges I\'ve overcome', name: 'past_challenges', placeholder: 'What difficulties have you faced and conquered?', required: false },
      { type: 'textarea', label: 'My healthy coping strategies', name: 'coping_strategies', placeholder: 'What helps when things are tough?', required: false },
      { type: 'textarea', label: 'My strengths', name: 'strengths', placeholder: 'What makes you resilient?', required: false },
      { type: 'textarea', label: 'Current challenge I\'m facing', name: 'current_challenge', placeholder: 'What are you dealing with now?', required: false },
      { type: 'textarea', label: 'Small steps I can take', name: 'action_steps', placeholder: 'What can you do today?', required: false }
    ]
  },
  
  // CARE STANDARDS & RIGHTS
  {
    id: 'childrens-rights-guide',
    title: 'Your Rights in Care',
    description: 'Understanding your rights as a young person in residential care',
    category: 'guide',
    icon: Shield,
    color: okayitTheme.colors.purple,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Every young person in care has important rights that are protected by law. Knowing your rights helps you speak up and ensures you get the support you deserve.',
      sections: [
        {
          title: 'Your Basic Rights',
          content: 'You have the right to: Be treated with respect and dignity. Have your views heard and considered in decisions about you. Contact with family and friends (unless it\'s unsafe). Privacy and confidentiality. Education and healthcare. Information about your care. Complain if things aren\'t right. Be kept safe from harm. Express your culture, religion, and identity. Have fun and enjoy your childhood.'
        },
        {
          title: 'The Children Act 1989',
          content: 'This important law says: Your welfare must be the paramount concern. You should be kept safe and protected. Your wishes and feelings must be considered. You should be involved in decisions about your life. Local authorities must promote your welfare. You have a right to advocacy. The law requires regular reviews of your care plan.'
        },
        {
          title: 'Article 12 - United Nations Convention',
          content: 'This international law gives children the right to: Express views freely in all matters affecting them. Have those views given due weight according to age and maturity. Be heard in any judicial or administrative proceedings. This means adults must listen to you and take your opinions seriously!'
        },
        {
          title: 'CQC Standards',
          content: 'The Care Quality Commission (CQC) requires your home to: Be safe, effective, caring, responsive, and well-led. Protect you from abuse and harm. Respect your dignity and human rights. Involve you in your care. Provide person-centered care. Have enough skilled staff. Maintain good standards. CQC inspects your home regularly to check these standards are met.'
        },
        {
          title: 'Ofsted Standards',
          content: 'Ofsted inspects children\'s homes and looks at: Quality of care. Safeguarding. Leadership and management. How well you\'re supported. Your education and activities. Your relationships. Whether your rights are respected. Homes are rated: Outstanding, Good, Requires Improvement, or Inadequate.'
        },
        {
          title: 'What If Your Rights Are Not Respected?',
          content: 'You can: Talk to your key worker or manager. Contact your social worker. Speak to an independent advocate. Contact the Children\'s Commissioner. Make a formal complaint. Talk to Ofsted or CQC. Contact Childline: 0800 1111. Remember: Speaking up is brave and important!'
        }
      ],
      tips: [
        'Keep a copy of your care plan - it\'s yours',
        'You can request an advocate to help you',
        'Your views matter regardless of your age',
        'Don\'t be afraid to ask questions or challenge decisions',
        'Rights and responsibilities go together'
      ],
      contacts: [
        { name: 'Childline', phone: '0800 1111', description: '24/7 confidential support for young people' },
        { name: 'Children\'s Commissioner', phone: '0800 528 0731', description: 'Helps children know their rights and speak up' },
        { name: 'Coram Voice (Advocacy)', phone: '020 7833 5792', description: 'Independent advocacy for children in care' },
        { name: 'Ofsted', phone: '0300 123 1231', description: 'Report concerns about your children\'s home' }
      ]
    }
  },
  {
    id: 'advocacy-guide',
    title: 'Advocacy and Speaking Up',
    description: 'How to use your voice and access independent advocacy support',
    category: 'guide',
    icon: Mic,
    color: okayitTheme.colors.blue,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Advocacy means having your voice heard and your rights upheld. An advocate is someone independent who speaks up for you and with you.',
      sections: [
        {
          title: 'What is Advocacy?',
          content: 'Advocacy helps you: Understand your rights. Express your views. Make informed decisions. Challenge decisions you disagree with. Access services and support. Resolve problems. Participate in meetings. Have your wishes heard. Advocates are independent - they work for YOU, not the local authority or care provider.'
        },
        {
          title: 'When to Request an Advocate',
          content: 'You might want an advocate when: Making a complaint. Preparing for a review meeting. Facing a placement move. Dealing with education issues. Having contact disputes. Preparing for leaving care. Feeling unheard or misunderstood. Needing help to express your views. You have the RIGHT to an advocate - it\'s free and confidential.'
        },
        {
          title: 'How Advocates Help',
          content: 'An advocate will: Listen to what you want. Explain your options. Help you prepare what to say. Attend meetings with you. Speak up for you if you want. Support you to speak for yourself. Make sure adults listen. Follow up on actions. They won\'t judge you or tell you what to do - they support YOUR choices.'
        },
        {
          title: 'Speaking Up Yourself',
          content: 'Tips for self-advocacy: Know your rights. Prepare what you want to say. Write down key points. Ask for meetings to be explained. Request information in writing. Bring a supporter. Stay calm and clear. Ask questions if unsure. Follow up in writing. Don\'t give up if initially unsuccessful.'
        },
        {
          title: 'Participating in Decisions',
          content: 'You should be involved in: Your care plan. Review meetings. Education plans. Contact arrangements. Activities and routines. Rules and consequences. Spending decisions. Future planning. If you\'re not being included, ask why and request involvement.'
        }
      ],
      tips: [
        'Advocacy is YOUR right - you don\'t need permission',
        'Advocates are confidential (with safeguarding exceptions)',
        'You can have an advocate AND speak for yourself',
        'Practice what you want to say beforehand',
        'It\'s okay to change your mind'
      ],
      contacts: [
        { name: 'Coram Voice', phone: '020 7833 5792', description: 'National advocacy service for children' },
        { name: 'NYAS (National Youth Advocacy Service)', phone: '0808 808 1001', description: 'Free advocacy for children and young people' },
        { name: 'The Advocacy Project', phone: '0330 440 9000', description: 'Advocacy support across England' }
      ]
    },
    formFields: [
      { type: 'textarea', label: 'What issue do I need help with?', name: 'issue', placeholder: 'Describe the situation...', required: true },
      { type: 'textarea', label: 'What outcome do I want?', name: 'desired_outcome', placeholder: 'What would help?', required: false },
      { type: 'select', label: 'Have I discussed this with staff?', name: 'discussed_with_staff', options: ['Yes', 'No', 'Tried but not resolved'], required: false },
      { type: 'checkbox', label: 'I would like to request an independent advocate', name: 'request_advocate', required: false },
      { type: 'textarea', label: 'Additional information', name: 'additional_info', placeholder: 'Anything else that might help...', required: false }
    ]
  },
  {
    id: 'cqc-ofsted-standards',
    title: 'Understanding CQC and Ofsted',
    description: 'Learn about the organizations that inspect your home and ensure quality care',
    category: 'guide',
    icon: Award,
    color: okayitTheme.colors.green,
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'CQC and Ofsted are independent organizations that inspect and regulate children\'s homes. They make sure you\'re safe, well cared for, and your rights are respected.',
      sections: [
        {
          title: 'What is the CQC?',
          content: 'The Care Quality Commission (CQC) regulates health and social care in England. For children\'s homes, they check: Are you safe? Is your care effective? Are staff caring? Is the service responsive to your needs? Is it well-led? They rate homes as: Outstanding, Good, Requires Improvement, or Inadequate. You can find your home\'s rating online.'
        },
        {
          title: 'What is Ofsted?',
          content: 'Ofsted (Office for Standards in Education) inspects children\'s services including children\'s homes. They look at: Overall experiences and progress. How well you\'re helped and protected. The effectiveness of leaders and managers. Your education, employment, and training. Your health and wellbeing. Your relationships. Ofsted publishes inspection reports that you can read.'
        },
        {
          title: 'When Do Inspections Happen?',
          content: 'Inspections can be: Scheduled - homes know they\'re coming. Unannounced - surprise visits. Short notice - 48 hours warning. During inspections, inspectors: Observe the home. Talk to young people (you!). Review records. Interview staff. Check safety. Look at activities and routines. They might want to talk to you - this is your chance to share your experiences!'
        },
        {
          title: 'Your Voice in Inspections',
          content: 'When inspectors visit, you can: Share your experiences honestly. Talk about what\'s good. Mention any concerns. Show them your room (if you want). Discuss activities you do. Talk about relationships with staff. Everything you say is confidential and helps improve care for everyone.'
        },
        {
          title: 'What Happens After Inspection?',
          content: 'After the inspection: A report is published. Your home gets a rating. Any issues must be addressed. Action plans are created. Follow-up checks may occur. You can read the inspection report and see what was said about your home. If there are serious concerns, Ofsted can take action to protect you.'
        },
        {
          title: 'Quality of Care Matters',
          content: 'Good quality care means: You feel safe and protected. Staff are kind and respectful. You\'re involved in decisions. Your individual needs are met. You have opportunities to develop. You\'re supported to maintain relationships. You have fun and enjoy activities. Your education is supported. Your health is looked after. If any of these are lacking, speak up!'
        }
      ],
      tips: [
        'Inspection reports are public - you can read them online',
        'Your honest feedback helps improve care for everyone',
        'Inspectors are independent - they don\'t work for your home',
        'Poor ratings lead to required improvements',
        'You can contact CQC or Ofsted directly with concerns'
      ],
      contacts: [
        { name: 'CQC', phone: '03000 616161', description: 'Report concerns or ask questions about care quality' },
        { name: 'Ofsted', phone: '0300 123 1231', description: 'Concerns about children\'s social care' }
      ]
    }
  },
  {
    id: 'participation-guide',
    title: 'Participation and Having Your Say',
    description: 'Ways to get involved, influence decisions, and make changes in your home',
    category: 'guide',
    icon: Users,
    color: okayitTheme.colors.orange,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Participation means being actively involved in your care and your home. Your opinions matter and can make real differences!',
      sections: [
        {
          title: 'What is Participation?',
          content: 'Participation means: Having a say in decisions that affect you. Being consulted about home rules and routines. Influencing activities and menus. Contributing ideas for improvements. Attending resident meetings. Representing other young people. Helping interview new staff. Sharing feedback with managers. Real participation means adults listen and act on what you say - not just asking for your views.'
        },
        {
          title: 'House Meetings',
          content: 'Most homes have regular meetings where you can: Suggest activities. Raise concerns. Request changes. Celebrate successes. Plan events. Discuss rules. Make group decisions. Tips for meetings: Come prepared with ideas. Listen to others. Speak respectfully. Follow up on agreed actions. Meetings should happen regularly and young people should help set the agenda.'
        },
        {
          title: 'Care Planning and Reviews',
          content: 'You should be central to your care plan: Attend your review meetings. Share your views beforehand. Have an advocate if you want. Help set your goals. Say what\'s working and what\'s not. Influence decisions about your future. Request changes to your plan. Your care plan should reflect YOUR wishes and goals, not just what adults think is best.'
        },
        {
          title: 'Children in Care Councils',
          content: 'Many local authorities have Children in Care Councils where you can: Meet other young people in care. Influence local authority policies. Campaign for change. Share your experiences. Develop leadership skills. Represent looked after children. Make a real difference. Ask your social worker or staff about joining!'
        },
        {
          title: 'Influencing Your Home',
          content: 'You can influence: Daily routines and schedules. Food and menus. Activities and trips. House rules (within legal limits). Decoration and furnishings. How money is spent. Staff training. Anti-bullying approaches. Don\'t be afraid to suggest ideas - good managers welcome young people\'s input!'
        }
      ],
      tips: [
        'Participation is your right, not a privilege',
        'Start small - suggest one change and build from there',
        'Team up with other young people for bigger impact',
        'Document what was agreed and follow up',
        'Celebrate when your ideas are implemented'
      ]
    },
    formFields: [
      { type: 'textarea', label: 'Ideas for improving the home', name: 'improvement_ideas', placeholder: 'What changes would make life better?', required: false },
      { type: 'textarea', label: 'Activities I\'d like to do', name: 'activity_suggestions', placeholder: 'What would you enjoy?', required: false },
      { type: 'textarea', label: 'Things that are working well', name: 'positive_feedback', placeholder: 'What should stay the same?', required: false },
      { type: 'select', label: 'How often are house meetings held?', name: 'meeting_frequency', options: ['Weekly', 'Fortnightly', 'Monthly', 'Rarely', 'Never'], required: false },
      { type: 'select', label: 'Do I feel listened to?', name: 'feel_heard', options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'], required: false },
      { type: 'checkbox', label: 'I would like to be more involved in decisions', name: 'want_involvement', required: false }
    ]
  },
  {
    id: 'care-leavers-guide',
    title: 'Preparing to Leave Care',
    description: 'Everything you need to know about moving towards independence',
    category: 'life-skills',
    icon: GraduationCap,
    color: okayitTheme.colors.indigo,
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Leaving care is a big step. You\'re entitled to support and shouldn\'t have to face it alone. This guide covers your rights and the help available.',
      sections: [
        {
          title: 'When Do I Leave Care?',
          content: 'Most young people leave care between 16-18, but: You can stay in foster care until 21 (Staying Put). You can stay in residential care until 18. The age you leave depends on your circumstances. You should NEVER be rushed to leave. You\'re entitled to a Pathway Plan from age 16. This is different from your care plan and focuses on preparing you for independence.'
        },
        {
          title: 'Your Leaving Care Team',
          content: 'You\'ll have a Personal Adviser (PA) who will: Support you until at least age 21 (or 25 if in education). Help with your Pathway Plan. Assist with accommodation. Support education and employment. Help with benefits and money. Provide emotional support. Your PA is like having a key worker after you leave care.'
        },
        {
          title: 'Accommodation Options',
          content: 'Options include: Staying Put (with foster carers). Supported lodgings. Supported housing. Shared housing. Independent tenancy. Traineeships or apprenticeships with accommodation. You should visit and try accommodation before committing. The local authority must help you find suitable housing.'
        },
        {
          title: 'Money and Benefits',
          content: 'Financial support includes: Setting Up Home Grant (furniture, etc.). Personal budget for leaving care needs. Help with deposits and rent. Council tax exemption until 25. Benefits advice and support. Education bursaries. Your local authority must provide financial assistance - ask your PA about entitlements.'
        },
        {
          title: 'Education and Training',
          content: 'If you were in care at 16, you get: Free university/college tuition until 25. Bursaries and grants. Priority university accommodation. Personal Adviser support. Help with books and equipment. Your education is important and you have more support than other young people!'
        },
        {
          title: 'Practical Life Skills',
          content: 'Before leaving, make sure you can: Cook basic meals. Budget and manage money. Use public transport. Keep your home clean. Do laundry. Pay bills. Register with GP/dentist. Know who to contact in emergencies. Staff should help you develop these skills gradually.'
        }
      ],
      tips: [
        'Start preparing early - don\'t wait until you\'re leaving',
        'Keep important documents safe (birth certificate, passport, etc.)',
        'Build a support network beyond professionals',
        'Know your entitlements - you have more rights than other young people',
        'It\'s okay to ask for help even after you\'ve left care'
      ],
      contacts: [
        { name: 'Become (Care Leavers)', phone: '020 7251 3117', description: 'Charity supporting care leavers' },
        { name: 'Coram Voice', phone: '020 7833 5792', description: 'Advocacy for care leavers' },
        { name: 'The Care Leavers Association', phone: '0161 4427 617', description: 'Support network for care leavers' }
      ]
    },
    formFields: [
      { type: 'date', label: 'Expected leaving care date', name: 'leaving_date', required: false },
      { type: 'textarea', label: 'My goals for the future', name: 'future_goals', placeholder: 'Education, work, living arrangements...', required: false },
      { type: 'textarea', label: 'Skills I need to develop', name: 'skills_needed', placeholder: 'What do you need to learn?', required: false },
      { type: 'textarea', label: 'Support I need', name: 'support_needed', placeholder: 'What help would be useful?', required: false },
      { type: 'textarea', label: 'My support network', name: 'support_network', placeholder: 'Who can you rely on?', required: false },
      { type: 'select', label: 'Have I met my Personal Adviser?', name: 'met_pa', options: ['Yes', 'No', 'Don\'t have one yet'], required: false }
    ]
  },
  {
    id: 'educational-videos',
    title: 'Educational Video Library',
    description: 'Watch videos about care, rights, life skills, and wellbeing',
    category: 'education',
    icon: Video,
    color: okayitTheme.colors.rose,
    hasView: true,
    hasForm: false,
    hasDownload: false,
    content: {
      introduction: 'Learn through video! These short, engaging videos cover important topics for young people in care.',
      multimedia: [
        { type: 'video', title: 'Understanding Your Rights in Care', url: 'https://www.youtube.com/watch?v=UaUP8T6sWlk', description: 'A guide to your rights as a looked-after child. Covers participation, confidentiality, contact rights, and how to make complaints.' },
        { type: 'video', title: 'What is a Key Worker?', url: 'https://www.youtube.com/watch?v=2HXe8Iln6lk', description: 'Meet some key workers and young people talking about this important relationship. Learn what to expect and how to get the most from your key worker sessions.' },
        { type: 'video', title: 'Children\'s Rights and Participation', url: 'https://www.youtube.com/watch?v=DVKLw8xK8Qs', description: 'Understanding your rights to have your voice heard and participate in decisions that affect your life in care.' },
        { type: 'video', title: 'Making Your Voice Heard', url: 'https://www.youtube.com/watch?v=9zPwxdJpxQY', description: 'Tips and techniques for self-advocacy. Learn how to express your views effectively in meetings and reviews.' },
        { type: 'video', title: 'Managing Difficult Emotions', url: 'https://www.youtube.com/watch?v=dOIMbNHIKJ8', description: 'Practical strategies for dealing with anger, anxiety, sadness, and overwhelming feelings. Includes breathing exercises and coping techniques.' },
        { type: 'video', title: 'Building Positive Relationships', url: 'https://www.youtube.com/watch?v=StnA8_PfIJM', description: 'Understanding healthy relationships - with friends, staff, and family. Covers boundaries, trust, communication, and conflict resolution.' },
        { type: 'video', title: 'Preparing to Leave Care', url: 'https://www.youtube.com/watch?v=K7BvP8TbGrI', description: 'What happens when you leave care? Learn about your entitlements, support available, and practical life skills you\'ll need.' },
        { type: 'video', title: 'Money Management for Young People', url: 'https://www.youtube.com/watch?v=0YKtNJBcvwA', description: 'Budgeting, saving, and managing money. Learn to avoid debt and make your money work for you.' },
        { type: 'video', title: 'Education and Career Options', url: 'https://www.youtube.com/watch?v=wRp8dXW-_gA', description: 'Exploring pathways after school - A-levels, apprenticeships, university, vocational training. Understand your options and the support available.' },
        { type: 'video', title: 'Your Mental Health Matters', url: 'https://www.youtube.com/watch?v=mQTg3QU9NkE', description: 'Understanding mental health, recognizing when you need help, and accessing support. It\'s okay to not be okay.' },
        { type: 'video', title: 'Dealing with Bullying', url: 'https://www.youtube.com/watch?v=MiHDQx2HaG8', description: 'Recognizing different forms of bullying, how to respond, who to tell, and how to support others experiencing bullying.' },
        { type: 'video', title: 'Understanding Care Plans', url: 'https://www.youtube.com/watch?v=rq1GqO7VtaQ', description: 'How your care plan works, who creates it, and how you can be involved in planning your own care.' }
      ],
      tips: [
        'Watch videos at your own pace',
        'Discuss what you learn with your key worker',
        'Share videos with friends who might find them helpful',
        'Request additional topics you\'d like covered'
      ]
    }
  }
];

interface EnhancedResourcesLibraryProps {
  onBack?: () => void;
}

export default function EnhancedResourcesLibrary({ onBack }: EnhancedResourcesLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState<'view' | 'form' | 'download'>('view');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isDownloading, setIsDownloading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Resources', icon: Sparkles, color: okayitTheme.colors.purple },
    { id: 'wellbeing', label: 'Wellbeing', icon: Heart, color: okayitTheme.colors.pink },
    { id: 'mental-health', label: 'Mental Health', icon: Brain, color: okayitTheme.colors.orange },
    { id: 'life-skills', label: 'Life Skills', icon: Lightbulb, color: okayitTheme.colors.green },
    { id: 'education', label: 'Education', icon: BookOpen, color: okayitTheme.colors.blue },
    { id: 'guide', label: 'Guides', icon: Shield, color: okayitTheme.colors.indigo },
    { id: 'form', label: 'Forms', icon: FileText, color: okayitTheme.colors.teal },
    { id: 'activity', label: 'Activities', icon: Star, color: okayitTheme.colors.amber }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  const handleDownload = async (resource: Resource) => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/generate-resource-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource.id,
          resourceTitle: resource.title
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Downloaded Successfully!', {
          description: `${resource.title} has been saved to your device.`
        });
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download Failed', {
        description: 'Please try again or contact staff for help.'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Form Saved!', {
      description: 'Your responses have been saved. You can download a PDF copy.',
      duration: 4000
    });
    
    // Offer to download filled form
    if (selectedResource) {
      handleDownload(selectedResource);
    }
  };

  const handleFormChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Resource Grid View
  if (!selectedResource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Compact Header */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            {onBack && (
              <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold hover:text-purple-800 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Menu
              </button>
            )}
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-gray-900">Useful Guides</span>
            </div>
            <OkayitLogo width={28} height={28} />
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-4">
          {/* Category Filters - compact */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected 
                        ? 'bg-purple-600 text-white shadow-sm' 
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={isSelected ? "text-white" : ""} size={14} />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resources Grid */}
          <motion.div {...tikTokTransitions.fade}>
            {filteredResources.length === 0 ? (
              <div className="text-center py-20">
                <FileText size={64} className="text-gray-900 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  No Resources Found
                </h3>
                <p className="text-gray-900">
                  Try selecting a different category
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-lg font-semibold text-gray-900">
                    Showing {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        onClick={() => {
                          setSelectedResource(resource);
                          setActiveTab(resource.hasView ? 'view' : resource.hasForm ? 'form' : 'download');
                          setFormData({});
                          
                          // Track resource exploration
                          trackActivity('resource', {
                            id: resource.id,
                            title: resource.title,
                            category: resource.category
                          });
                        }}
                        className="cursor-pointer"
                      >
                        <Card className="h-full border hover:shadow-lg transition-all" style={{ borderColor: resource.color }}>
                          <CardHeader>
                            <div className="flex items-start gap-4">
                              <div 
                                className="p-3 rounded-xl"
                                style={{ background: resource.color }}
                              >
                                <Icon size={32} className="text-white" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2 text-gray-900">
                                  {resource.title}
                                </CardTitle>
                                <p className="text-sm text-gray-900">
                                  {resource.description}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {resource.hasView && (
                                <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                                  <Eye size={14} className="mr-1" />
                                  View
                                </Badge>
                              )}
                              {resource.hasForm && (
                                <Badge className="bg-green-100 text-green-700 border border-green-300">
                                  <Edit size={14} className="mr-1" />
                                  Fill Form
                                </Badge>
                              )}
                              {resource.hasDownload && (
                                <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
                                  <Download size={14} className="mr-1" />
                                  Download
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </div>

        <footer className="py-8 mt-20 border-t-2 border-purple-200" >
          <div className="container mx-auto px-6 text-center">
            <p className="text-sm text-gray-900">
              All resources are designed to support your wellbeing and development
            </p>
            <p className="text-xs mt-2 text-gray-900">
              Need help with a resource? Contact admin@okayit.uk or ask your key worker
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Individual Resource View with Tabs
  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page)}>
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={combineThemeClasses("sticky top-0 z-50 border-b-4 border-purple-300", okayitTheme.backgrounds.glassPurple)}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => {
                    setSelectedResource(null);
                    setFormData({});
                  }} 
                  size="lg" 
                  className={okayitTheme.interactive.navPurple}
                >
                  <ArrowLeft className="w-6 h-6 mr-2" />
                  Back to Library
                </Button>
              </motion.div>
              
              <div className="flex items-center gap-3">
                <div 
                  className="p-2 rounded-xl"
                  style={{ background: selectedResource.color }}
                >
                  {React.createElement(selectedResource.icon, { size: 32, className: "text-white" })}
                </div>
                <div>
                  <h1 className={okayitTheme.text.headingPurple}>
                    {selectedResource.title}
                  </h1>
                  <p className={okayitTheme.text.secondaryOnLight}>
                    {selectedResource.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-12">
        <Card className="border-4" style={{ borderColor: selectedResource.color }}>
          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                {selectedResource.hasView && (
                  <TabsTrigger value="view" disabled={!selectedResource.hasView} className="text-lg py-3">
                    <Eye className="w-5 h-5 mr-2" />
                    View Content
                  </TabsTrigger>
                )}
                {selectedResource.hasForm && (
                  <TabsTrigger value="form" disabled={!selectedResource.hasForm} className="text-lg py-3">
                    <Edit className="w-5 h-5 mr-2" />
                    Fill Form
                  </TabsTrigger>
                )}
                {selectedResource.hasDownload && (
                  <TabsTrigger value="download" disabled={!selectedResource.hasDownload} className="text-lg py-3">
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </TabsTrigger>
                )}
              </TabsList>

              {/* View Tab */}
              {selectedResource.hasView && (
                <TabsContent value="view" className="space-y-8">
                  {selectedResource.content?.introduction && (
                    <div className="p-6 rounded-xl border bg-gradient-to-r from-purple-50 to-blue-50" style={{ borderColor: selectedResource.color }}>
                      <p className="text-lg leading-relaxed text-gray-900">
                        {selectedResource.content.introduction}
                      </p>
                    </div>
                  )}
                  
                  {selectedResource.content?.sections && selectedResource.content.sections.map((section, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border-2" style={{ borderColor: selectedResource.color }}>
                        <CardHeader>
                          <CardTitle className="text-2xl" style={{ color: selectedResource.color }}>
                            {section.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-base leading-relaxed whitespace-pre-line text-gray-900">
                            {section.content}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {selectedResource.content?.tips && selectedResource.content.tips.length > 0 && (
                    <div className="p-6 rounded-xl bg-amber-50 border border-amber-300">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: okayitTheme.colors.amber }}>
                        <Lightbulb size={24} />
                        Key Tips to Remember
                      </h3>
                      <ul className="space-y-3">
                        {selectedResource.content.tips.map((tip, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Star size={20} className="text-amber-500 mt-1 flex-shrink-0" />
                            <span className="text-base text-gray-900">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedResource.content?.contacts && selectedResource.content.contacts.length > 0 && (
                    <div className="p-6 rounded-xl bg-green-50 border border-green-300">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: okayitTheme.colors.green }}>
                        <Phone size={24} />
                        Helpful Contacts
                      </h3>
                      <div className="space-y-4">
                        {selectedResource.content.contacts.map((contact, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-green-200">
                            <MessageCircle size={24} className="text-green-600 mt-1" />
                            <div className="flex-1">
                              <p className="font-bold text-lg text-gray-900">
                                {contact.name}
                              </p>
                              <p className="text-sm text-gray-900">
                                {contact.description}
                              </p>
                              <p className="text-xl font-mono font-bold mt-2" style={{ color: selectedResource.color }}>
                                {contact.phone}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              )}

              {/* Form Tab */}
              {selectedResource.hasForm && (
                <TabsContent value="form">
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    {selectedResource.formFields?.map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Label htmlFor={field.name} className="text-lg font-semibold mb-2 flex items-center gap-2">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                          {(field.type === 'textarea' || field.type === 'text') && (
                            <VoiceInputButton onTranscript={(t) => handleFormChange(field.name, (formData[field.name] || '') + ((formData[field.name] || '') ? ' ' : '') + t)} />
                          )}
                        </Label>
                        
                        {field.type === 'text' && (
                          <Input
                            id={field.name}
                            type="text"
                            placeholder={field.placeholder}
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleFormChange(field.name, e.target.value)}
                            className="text-lg p-3"
                          />
                        )}
                        
                        {field.type === 'textarea' && (
                          <Textarea
                            id={field.name}
                            placeholder={field.placeholder}
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleFormChange(field.name, e.target.value)}
                            className="text-lg p-3 min-h-[120px]"
                            rows={4}
                          />
                        )}
                        
                        {field.type === 'select' && (
                          <select
                            id={field.name}
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleFormChange(field.name, e.target.value)}
                            className="w-full text-lg p-3 border-2 rounded-lg bg-background text-foreground"
                          >
                            <option value="">Select an option...</option>
                            {field.options?.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                        
                        {field.type === 'date' && (
                          <Input
                            id={field.name}
                            type="date"
                            required={field.required}
                            value={formData[field.name] || ''}
                            onChange={(e) => handleFormChange(field.name, e.target.value)}
                            className="text-lg p-3"
                          />
                        )}
                        
                        {field.type === 'checkbox' && (
                          <div className="flex items-center gap-3">
                            <input
                              id={field.name}
                              type="checkbox"
                              required={field.required}
                              checked={formData[field.name] || false}
                              onChange={(e) => handleFormChange(field.name, e.target.checked)}
                              className="w-6 h-6"
                            />
                            <Label htmlFor={field.name} className="text-base cursor-pointer">
                              {field.label}
                            </Label>
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        size="lg"
                        className={combineThemeClasses(okayitTheme.interactive.buttonPurple, "flex-1 text-lg py-6")}
                      >
                        <CheckCircle className="w-6 h-6 mr-2" />
                        Save and Download
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              )}

              {/* Download Tab */}
              {selectedResource.hasDownload && (
                <TabsContent value="download">
                  <div className="text-center py-12 space-y-8">
                    <div 
                      className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
                      style={{ background: selectedResource.color }}
                    >
                      <Download size={64} className="text-white" />
                    </div>
                    
                    <div>
                      <h2 className="text-3xl font-black mb-4 text-gray-900">
                        Ready to Download
                      </h2>
                      <p className="text-lg mb-8 text-gray-900">
                        This resource will be downloaded as a PDF file that you can save, print, or share.
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(selectedResource)}
                      disabled={isDownloading}
                      size="lg"
                      className={combineThemeClasses(okayitTheme.interactive.buttonPurple, "text-xl px-12 py-8")}
                    >
                      {isDownloading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="mr-3"
                          >
                            <Sparkles size={24} />
                          </motion.div>
                          Preparing Download...
                        </>
                      ) : (
                        <>
                          <Download size={24} className="mr-3" />
                          Download PDF
                        </>
                      )}
                    </Button>
                    
                    <p className="text-sm text-gray-900">
                      The file will be saved to your device's Downloads folder
                    </p>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}