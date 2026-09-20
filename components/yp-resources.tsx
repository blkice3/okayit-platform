'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, BookOpen, Shield, Users, Sparkles,
  Brain, Activity, Palette, Target, Phone, Gamepad2,
  AlertCircle, ChevronRight, Star, Lightbulb, Zap,
  Eye, Music, MessageCircle, Globe, Lock, CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface YPResourcesProps {
  onBack?: () => void;
  onNavigateToSection?: (section: string) => void;
}

interface ResourceCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  resources: Resource[];
}

interface Resource {
  title: string;
  description: string;
  content: string;
  icon: any;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  ageGroup?: string;
  tags?: string[];
  url?: string;
}

const categories: ResourceCategory[] = [
  {
    id: 'safety',
    title: 'Safety and Relationships',
    description: 'Learn about healthy relationships, red flags, and staying safe',
    icon: Shield,
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    resources: [
      {
        title: 'Red Flag or Green Flag?',
        description: 'Can you spot the difference between safe and unsafe situations?',
        content: 'GREEN FLAGS (healthy):\n\n\u2705 They respect your boundaries\n\u2705 They listen when you say no\n\u2705 They support your friendships and interests\n\u2705 They are honest and consistent\n\u2705 They make you feel good about yourself\n\u2705 They apologise when they are wrong\n\nRED FLAGS (unhealthy):\n\n\u274c They try to control who you see or talk to\n\u274c They check your phone without permission\n\u274c They make you feel bad about yourself\n\u274c They blame you for their behaviour\n\u274c They pressure you to do things you are not comfortable with\n\u274c They are nice one minute and mean the next\n\u274c They threaten you or make you feel scared\n\nRemember: A healthy relationship makes you feel safe, respected, and free to be yourself. If something feels wrong, trust your gut and talk to someone you trust.',
        icon: Shield,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['relationships', 'safety', 'boundaries']
      },
      {
        title: 'My Circle of Trust',
        description: 'Map out the people you can turn to for help and support',
        content: 'YOUR CIRCLE OF TRUST\n\nDraw three circles (like a target):\n\nINNER CIRCLE (closest to you):\nPeople you trust the most. You can tell them anything.\n\u2022 Who makes you feel completely safe?\n\u2022 Who would you call at 3am if you were scared?\n\nMIDDLE CIRCLE (trusted adults):\nPeople who care about you and can help.\n\u2022 Your key worker\n\u2022 Teachers or school staff\n\u2022 Social worker\n\u2022 Family members you trust\n\nOUTER CIRCLE (professional support):\nPeople trained to help young people.\n\u2022 Childline: 0800 1111\n\u2022 The Mix: 0808 808 4994\n\u2022 Your GP or counsellor\n\u2022 Coram Voice: 0808 800 5792\n\nActivity: Write the names of people in each circle. Keep this somewhere safe so you always know who to reach out to.',
        icon: Users,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['support', 'trust', 'safety']
      },
      {
        title: 'Personal Safety Toolkit',
        description: 'Build your knowledge about staying safe in different situations',
        content: 'YOUR PERSONAL SAFETY TOOLKIT\n\nONLINE SAFETY:\n\u2022 Never share your address, school name, or care home details online\n\u2022 Keep passwords private \u2014 even from friends\n\u2022 If someone online makes you uncomfortable, block and report them\n\u2022 Screenshots can be shared \u2014 think before you send\n\u2022 Report concerns to CEOP (ceop.police.uk)\n\nOUT AND ABOUT:\n\u2022 Always tell staff where you are going and when you will be back\n\u2022 Keep your phone charged\n\u2022 Trust your instincts \u2014 if something feels wrong, leave\n\u2022 Know your emergency contacts\n\u2022 Stay in well-lit, public areas\n\nAT HOME:\n\u2022 Know the fire exits and evacuation plan\n\u2022 Keep your room key/fob safe\n\u2022 Lock away valuables\n\u2022 Know who the on-duty staff are\n\nIN AN EMERGENCY:\n\u2022 Call 999 for police, fire, or ambulance\n\u2022 Tell a staff member immediately\n\u2022 Childline: 0800 1111 (24/7, free)\n\u2022 Text SHOUT to 85258 (crisis text line)',
        icon: Shield,
        difficulty: 'Medium',
        ageGroup: '13-17',
        tags: ['safety', 'online', 'practical']
      },
      {
        title: 'Dating Safety Navigator',
        description: 'Essential dating safety skills and red flag recognition',
        content: 'DATING SAFETY\n\nHEALTHY DATING LOOKS LIKE:\n\u2022 You both enjoy spending time together\n\u2022 You can be yourself without pretending\n\u2022 They respect your boundaries \u2014 always\n\u2022 You feel free to spend time with friends and family\n\u2022 Arguments are resolved with respect, not shouting or threats\n\u2022 They never pressure you physically\n\nWARNING SIGNS:\n\u2022 They want to know where you are all the time\n\u2022 They get jealous easily\n\u2022 They try to isolate you from friends\n\u2022 They make you feel guilty for saying no\n\u2022 Things moved VERY fast at the start (love-bombing)\n\u2022 They threaten to share private photos or messages\n\nWHAT TO DO IF YOU ARE WORRIED:\n1. Talk to someone you trust\n2. Call Childline: 0800 1111\n3. Contact The Mix: 0808 808 4994\n4. If in immediate danger, call 999\n\nRemember: You deserve to be treated with respect. ALWAYS.',
        icon: Heart,
        difficulty: 'Medium',
        ageGroup: '13-17',
        tags: ['relationships', 'dating', 'safety']
      }
    ]
  },
  {
    id: 'wellbeing',
    title: 'Self-Care and Wellness',
    description: 'Tools to look after your mental and physical health',
    icon: Heart,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    resources: [
      {
        title: 'Self-Care Compass',
        description: 'Find out what self-care works best for you across 6 key areas',
        content: 'YOUR SELF-CARE COMPASS\n\nRate each area 1-10 and plan one action for each:\n\n1. PHYSICAL: Sleep, food, exercise\n   \u2022 Am I getting enough sleep? (8-10 hours for teens)\n   \u2022 Am I eating regular meals?\n   \u2022 Am I moving my body?\n   Action: ________________________________\n\n2. EMOTIONAL: Feelings, expression, processing\n   \u2022 Am I acknowledging how I feel?\n   \u2022 Do I have someone to talk to?\n   \u2022 Am I bottling things up?\n   Action: ________________________________\n\n3. SOCIAL: Friends, connection, belonging\n   \u2022 Am I spending time with people I enjoy?\n   \u2022 Do I feel connected to others?\n   Action: ________________________________\n\n4. MENTAL: Learning, creativity, stimulation\n   \u2022 Am I learning something I enjoy?\n   \u2022 Am I challenging myself?\n   Action: ________________________________\n\n5. SPIRITUAL: Values, meaning, purpose\n   \u2022 What matters most to me?\n   \u2022 What gives my life meaning?\n   Action: ________________________________\n\n6. PRACTICAL: Routine, skills, independence\n   \u2022 Am I developing life skills?\n   \u2022 Am I keeping on top of things?\n   Action: ________________________________\n\nRevisit this compass every month to see how you are doing.',
        icon: Activity,
        difficulty: 'Medium',
        ageGroup: 'All Ages',
        tags: ['self-care', 'wellbeing', 'reflection']
      },
      {
        title: 'Stress-Busting Toolkit',
        description: 'Quick techniques to manage stress and overwhelming feelings',
        content: 'YOUR STRESS-BUSTING TOOLKIT\n\nQUICK RELIEF (under 2 minutes):\n\n\ud83c\udf2c\ufe0f BOX BREATHING:\nBreathe in for 4 counts\nHold for 4 counts\nBreathe out for 4 counts\nHold for 4 counts\nRepeat 5 times\n\n\ud83d\udc4b 5-4-3-2-1 GROUNDING:\nName 5 things you SEE\nName 4 things you can TOUCH\nName 3 things you HEAR\nName 2 things you SMELL\nName 1 thing you TASTE\n\n\u2744\ufe0f COLD WATER RESET:\nSplash cold water on your face or hold ice cubes. This triggers your calming reflex.\n\nMEDIUM ACTIVITIES (5-15 minutes):\n\n\ud83c\udfb5 Listen to a calming playlist\n\ud83d\udcdd Write down everything on your mind (brain dump)\n\ud83c\udfc3 Go for a short walk\n\ud83e\uddd8 Stretch or do gentle yoga\n\ud83c\udfa8 Doodle or colour\n\nLONGER STRATEGIES (30+ minutes):\n\n\ud83d\udcd6 Read a book or listen to an audiobook\n\ud83c\udfae Play a video game\n\ud83c\udf73 Cook or bake something\n\ud83c\udf33 Spend time outdoors in nature\n\ud83d\udcf1 Call a friend\n\nRemember: Stress is NORMAL. It means your body is reacting to something. These tools help you manage it, not avoid it.',
        icon: Zap,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['stress', 'coping', 'techniques']
      },
      {
        title: 'Mindful Breathing Adventures',
        description: 'Fun breathing exercises that actually work',
        content: 'MINDFUL BREATHING ADVENTURES\n\n\ud83d\ude80 ROCKET BREATHING (for energy):\nImagine you are a rocket on a launchpad\n\u2022 Breathe in slowly through your nose (filling up with fuel)\n\u2022 Hold... 3, 2, 1...\n\u2022 BLAST OFF! Breathe out fast through your mouth\n\u2022 Repeat 5 times\n\n\ud83c\udf0a OCEAN BREATHING (for calm):\nImagine the waves on a beach\n\u2022 Breathe in as the wave comes in (4 counts)\n\u2022 Breathe out as the wave goes back out (6 counts)\n\u2022 Make it slow and steady like real waves\n\u2022 Do this for 2 minutes\n\n\ud83e\udd81 LION BREATHING (for anger):\n\u2022 Take a deep breath in\n\u2022 Open your mouth wide\n\u2022 Stick your tongue out\n\u2022 ROAR the breath out\n\u2022 Feel the tension leave your body\n\n\ud83e\udeb6 FEATHER BREATHING (for sleep):\nImagine a feather on your hand\n\u2022 Breathe so gently that the feather barely moves\n\u2022 Make each breath softer and slower\n\u2022 Feel yourself becoming heavier and more relaxed\n\u2022 Keep going until you feel sleepy',
        icon: Brain,
        difficulty: 'Easy',
        ageGroup: '8-12',
        tags: ['mindfulness', 'breathing', 'calm']
      }
    ]
  },
  {
    id: 'emotions',
    title: 'Emotional Intelligence',
    description: 'Understand and manage your feelings better',
    icon: Brain,
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    resources: [
      {
        title: 'Emotion Wheel Explorer',
        description: 'Identify exactly what you are feeling \u2014 beyond just happy, sad, or angry',
        content: 'THE EMOTION WHEEL\n\nBasic emotions are just the start. Here is what is underneath:\n\nHAPPY can mean: Content, Proud, Excited, Grateful, Hopeful, Playful, Confident, Peaceful\n\nSAD can mean: Lonely, Disappointed, Homesick, Helpless, Grief, Abandoned, Rejected, Empty\n\nANGRY can mean: Frustrated, Betrayed, Jealous, Disrespected, Overwhelmed, Defensive, Powerless\n\nSCARED can mean: Anxious, Insecure, Vulnerable, Worried, Panicked, Nervous, Threatened\n\nSURPRISED can mean: Shocked, Confused, Amazed, Curious, Startled, Awed\n\nDISGUSTED can mean: Ashamed, Embarrassed, Judged, Violated, Let down\n\n\ud83d\udca1 WHY THIS MATTERS:\nWhen you can name EXACTLY what you feel, the feeling becomes less overwhelming. "I am angry" is vague. "I feel disrespected because no one asked my opinion" is specific \u2014 and much easier to deal with.\n\nTRY THIS:\nNext time you feel a strong emotion, try to find the more specific word for it. Write it down. Then ask yourself: What caused this? What do I need right now?',
        icon: Eye,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['emotions', 'self-awareness', 'vocabulary']
      },
      {
        title: 'Anger Management Workshop',
        description: 'Healthy ways to deal with anger before it deals with you',
        content: 'MANAGING ANGER\n\nAnger is NOT bad. It is a signal that something feels wrong. The problem is not the anger \u2014 it is what we DO with it.\n\nTHE ANGER SCALE (1-10):\n1-3: Annoyed, irritated, tense\n4-6: Frustrated, wound up, hot\n7-8: Furious, aggressive thoughts\n9-10: Rage, out of control\n\nCATCH IT EARLY (levels 1-3):\n\u2022 Notice body signs: clenched fists, tight jaw, hot face\n\u2022 Take slow breaths\n\u2022 Walk away if you can\n\u2022 Tell someone: "I am feeling wound up"\n\nMANAGE IT (levels 4-6):\n\u2022 Remove yourself from the situation\n\u2022 Count backwards from 20\n\u2022 Squeeze ice cubes\n\u2022 Do press-ups or jumping jacks\n\u2022 Write down what made you angry\n\nCOOL DOWN (levels 7-10):\n\u2022 Go somewhere safe\n\u2022 Splash cold water on your face\n\u2022 Scream into a pillow\n\u2022 Tear up paper or newspaper\n\u2022 Ask for help from staff\n\nAFTERWARDS:\n\u2022 Talk about what happened\n\u2022 Think about what triggered it\n\u2022 Plan what to do differently next time\n\nRemember: Managing anger takes practice. Be patient with yourself.',
        icon: Zap,
        difficulty: 'Medium',
        ageGroup: 'All Ages',
        tags: ['anger', 'emotions', 'coping']
      }
    ]
  },
  {
    id: 'life-skills',
    title: 'Life Skills and Independence',
    description: 'Practical skills for growing up and becoming independent',
    icon: Target,
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    resources: [
      {
        title: 'Budget Master Challenge',
        description: 'Learn to manage money \u2014 the skill nobody teaches you at school',
        content: 'MONEY SKILLS FOR REAL LIFE\n\nTHE 50/30/20 RULE:\n\u2022 50% on NEEDS (food, transport, phone)\n\u2022 30% on WANTS (clothes, entertainment, going out)\n\u2022 20% on SAVINGS (emergency fund, future goals)\n\nPRACTICE CHALLENGE:\nImagine you have \u00a3100 for the week. Plan your spending:\n\nNeeds (\u00a350):\n\u2022 Food: \u00a3____\n\u2022 Transport: \u00a3____\n\u2022 Phone top-up: \u00a3____\n\nWants (\u00a330):\n\u2022 ________: \u00a3____\n\u2022 ________: \u00a3____\n\nSavings (\u00a320):\n\u2022 Put aside for: ________\n\nMONEY TIPS:\n\u2022 Track what you spend for a week \u2014 you will be surprised\n\u2022 Wait 24 hours before buying anything over \u00a320\n\u2022 Compare prices online before buying\n\u2022 Use free stuff: library, parks, youth clubs\n\u2022 Start saving \u2014 even \u00a32/week adds up to \u00a3100 a year\n\nWHEN YOU LEAVE CARE:\nYou may be entitled to:\n\u2022 Setting Up Home Allowance\n\u2022 Bursary for education/training\n\u2022 Junior ISA (if eligible)\n\u2022 Council Tax exemption (until 25)\nAsk your Personal Adviser about these!',
        icon: Target,
        difficulty: 'Medium',
        ageGroup: '13-17',
        tags: ['money', 'independence', 'budgeting']
      },
      {
        title: 'Independent Living Quest',
        description: 'Essential skills for when you start living on your own',
        content: 'INDEPENDENT LIVING SKILLS CHECKLIST\n\nCOOKING \ud83c\udf73:\n\u2022 Can you cook 5 basic meals? (pasta, omelette, stir-fry, baked potato, rice dish)\n\u2022 Do you know basic food hygiene? (wash hands, check dates, store food properly)\n\u2022 Can you plan meals for a week?\n\nCLEANING \ud83e\uddf9:\n\u2022 Can you do your own laundry? (sorting, temperature, drying)\n\u2022 Do you know how to clean a kitchen and bathroom?\n\u2022 Can you hoover and change bed sheets?\n\nMONEY \ud83d\udcb7:\n\u2022 Do you have a bank account?\n\u2022 Can you budget for a month?\n\u2022 Do you understand bills (rent, gas, electric, water, council tax)?\n\nHEALTH \ud83c\udfe5:\n\u2022 Can you register with a GP and dentist?\n\u2022 Do you know how to get a prescription?\n\u2022 Can you book your own appointments?\n\nPAPERWORK \ud83d\udcc4:\n\u2022 Do you have your ID documents? (birth certificate, NI number, passport)\n\u2022 Can you fill in forms?\n\u2022 Do you understand tenancy agreements?\n\nStart practising these skills NOW with support from your care home. Do not wait until you leave!',
        icon: Star,
        difficulty: 'Hard',
        ageGroup: '13-17',
        tags: ['independence', 'practical', 'leaving-care']
      },
      {
        title: 'Decision-Making Guide',
        description: 'A simple framework for making better choices',
        content: 'THE 3-QUESTION DECISION FRAMEWORK\n\nBefore making any important decision, ask yourself:\n\n1. WHAT COULD HAPPEN?\n   \u2022 Best case scenario?\n   \u2022 Worst case scenario?\n   \u2022 Most likely outcome?\n\n2. HOW WILL I FEEL AFTERWARDS?\n   \u2022 In 10 minutes?\n   \u2022 In 10 days?\n   \u2022 In 10 months?\n\n3. WHAT WOULD SOMEONE I RESPECT THINK?\n   \u2022 Would they be proud of this choice?\n   \u2022 Would they be worried about me?\n\nPRACTISE WITH SMALL DECISIONS:\n\u2022 What to eat for dinner\n\u2022 Whether to do homework now or later\n\u2022 How to spend pocket money\n\nTHEN APPLY TO BIGGER DECISIONS:\n\u2022 Friendships and relationships\n\u2022 Education choices\n\u2022 Responding to peer pressure\n\nRemember: Making mistakes is how we learn. The important thing is to THINK before you act.',
        icon: Lightbulb,
        difficulty: 'Medium',
        ageGroup: '13-17',
        tags: ['decisions', 'thinking', 'maturity']
      }
    ]
  },
  {
    id: 'creative',
    title: 'Creative Expression',
    description: 'Express yourself through art, music, and writing',
    icon: Palette,
    color: 'pink',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-700',
    resources: [
      {
        title: 'Music and Mood Mapping',
        description: 'Use music to understand and shift your emotions',
        content: 'MUSIC AND MOOD MAPPING\n\nMusic changes how we feel. Here is how to use it:\n\nSTEP 1: MOOD MATCHING\nPick songs that match how you feel RIGHT NOW.\n\u2022 Feeling sad? Listen to sad music first \u2014 it validates your feelings\n\u2022 Feeling angry? Put on something with energy\n\u2022 Feeling anxious? Match the nervous energy\n\nSTEP 2: MOOD SHIFTING\nGradually change your playlist to shift your mood:\n\u2022 Song 1-2: Match your current mood\n\u2022 Song 3-4: Slightly lighter/calmer\n\u2022 Song 5-6: Moving towards how you WANT to feel\n\u2022 Song 7+: Songs that make you feel good\n\nBUILD YOUR PLAYLISTS:\n\ud83d\udfe2 Green playlist: Songs that make you happy\n\ud83d\udfe1 Yellow playlist: Songs that calm you down\n\ud83d\udd34 Red playlist: Songs that help you release anger safely\n\ud83d\udfe3 Purple playlist: Songs that help you sleep\n\nACTIVITY: Create your personal mood playlists and keep them ready for when you need them.',
        icon: Music,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['music', 'emotions', 'creative']
      },
      {
        title: 'Therapeutic Storytelling',
        description: 'Tell your story \u2014 or create a new one \u2014 to process your experiences',
        content: 'STORYTELLING FOR HEALING\n\nWriting can help you make sense of what has happened to you. You do not have to share it with anyone.\n\nPROMPTS TO GET STARTED:\n\n1. "If my life was a book, this chapter would be called..."\n2. "The thing I wish someone had told me when I first came into care is..."\n3. "In five years, I want to be..."\n4. "The strongest thing about me is..."\n5. "Dear younger me, I want you to know..."\n6. "The person who believed in me most was..."\n7. "If I could change one thing about the care system, it would be..."\n\nCREATIVE OPTIONS:\n\u2022 Write a poem (it does not have to rhyme!)\n\u2022 Create a comic strip of your day\n\u2022 Write a letter you will never send\n\u2022 Tell your story in the third person ("There was a person who...")\n\u2022 Draw or paint instead of writing\n\nRules:\n\u2022 There is no wrong way to do this\n\u2022 You do not have to share it\n\u2022 You can destroy it afterwards if you want\n\u2022 Stop if it becomes too much \u2014 take a break',
        icon: BookOpen,
        difficulty: 'Medium',
        ageGroup: 'All Ages',
        tags: ['writing', 'expression', 'therapy']
      }
    ]
  },
  {
    id: 'digital',
    title: 'Digital Safety and Skills',
    description: 'Stay safe online and make the most of technology',
    icon: Globe,
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-700',
    resources: [
      {
        title: 'Online Safety Quest',
        description: 'Level up your online safety knowledge',
        content: 'ONLINE SAFETY ESSENTIALS\n\nPASSWORDS \ud83d\udd10:\n\u2022 Use different passwords for different accounts\n\u2022 Make them 12+ characters with letters, numbers, and symbols\n\u2022 Never share passwords \u2014 not even with close friends\n\u2022 Change them if someone else might know them\n\nSOCIAL MEDIA \ud83d\udcf1:\n\u2022 Set profiles to private\n\u2022 Only accept requests from people you know in real life\n\u2022 Never share your location, school, or care home address\n\u2022 Think before you post \u2014 the internet is forever\n\u2022 Remember: People are not always who they say they are\n\nSEXTING AND IMAGE SHARING \u26a0\ufe0f:\n\u2022 It is NEVER okay for anyone to pressure you to send images\n\u2022 If someone sends you unwanted images, tell a trusted adult\n\u2022 Sharing intimate images of under-18s is illegal\n\u2022 If images of you are shared, it is NOT your fault\n\nWHAT TO DO IF SOMETHING GOES WRONG:\n\u2022 Do not delete evidence \u2014 screenshot it\n\u2022 Block the person\n\u2022 Tell a trusted adult\n\u2022 Report to CEOP: ceop.police.uk\n\u2022 Call Childline: 0800 1111\n\u2022 Contact the platform\'s safety team',
        icon: Lock,
        difficulty: 'Medium',
        ageGroup: 'All Ages',
        tags: ['online', 'safety', 'social-media']
      }
    ]
  },
  {
    id: 'websites',
    title: 'Helpful Websites & Tools',
    description: 'Trusted websites approved for young people, tap to visit',
    icon: Globe,
    color: 'teal',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
    textColor: 'text-teal-700',
    resources: [
      {
        title: 'Childline',
        description: 'Free, confidential support for under 19s, chat online, call, or explore tools',
        content: 'CHILDLINE, Your Safe Place Online\n\n🌐 Website: childline.org.uk\n📞 Phone: 0800 1111 (free, 24/7)\n\nWhat you will find:\n\n• 1-to-1 Counsellor Chat, talk to a trained counsellor privately online\n• Ask Sam, write a letter with your question and get advice\n• Calm Zone, breathing exercises, games, and activities to calm down\n• Art Box, express yourself through drawing and creative activities\n• Message Boards, talk to other young people going through similar things\n• Coping Kit, personalised tools based on how you are feeling\n• Games, puzzles and activities for when you need a distraction\n• Deaf Zone, support in British Sign Language (BSL)\n\nWhy it is good:\n✅ Completely free\n✅ Confidential (they will not tell anyone unless you are in danger)\n✅ Available 24 hours a day, 7 days a week\n✅ You do not need to give your real name\n✅ Run by the NSPCC, a trusted UK charity\n\nYou can create a free account to save your chats and use the message boards.',
        icon: Phone,
        difficulty: 'Easy',
        ageGroup: 'Under 19',
        tags: ['support', 'counselling', 'chat', 'free'],
        url: 'https://www.childline.org.uk'
      },
      {
        title: 'Kooth',
        description: 'Free online counselling and emotional wellbeing platform for 10-25 year olds',
        content: 'KOOTH, Free Online Mental Health Support\n\n🌐 Website: kooth.com\n\nWhat you will find:\n\n• Live Chat Counselling, talk to a qualified counsellor (no referral needed)\n• Discussion Boards, moderated, safe space to share experiences\n• Self-Help Articles, written by young people and professionals\n• Mood Journal, track how you are feeling over time\n• Goal Tracker, set and monitor personal goals\n• Activity Hub, interactive tools and resources\n• Magazine, articles, stories, and creative content by young people\n\nWhy it is good:\n✅ Completely free on the NHS\n✅ No referral or waiting list needed\n✅ Anonymous, use a made-up username\n✅ Moderated by trained professionals\n✅ Counsellors available until 10pm on weekdays, 6pm weekends\n✅ You can book sessions in advance\n\nKooth is commissioned by the NHS and used by over 4,000 young people every day.',
        icon: Heart,
        difficulty: 'Easy',
        ageGroup: '10-25',
        tags: ['counselling', 'mental-health', 'free', 'NHS'],
        url: 'https://www.kooth.com'
      },
      {
        title: 'Young Minds',
        description: 'The UK\'s leading charity for young people\'s mental health',
        content: 'YOUNG MINDS, Understanding Your Mental Health\n\n🌐 Website: youngminds.org.uk\n📱 Crisis: Text YM to 85258\n\nWhat you will find:\n\n• A-Z of Mental Health, clear, honest explanations of anxiety, depression, self-harm, OCD, eating disorders, and more\n• Your Stories, real experiences from young people who have been through it\n• Coping Tips, practical advice for managing difficult feelings\n• Find Help Tool, guided questions to find the right support for you\n• Take Action Guide, how to speak up about your mental health\n• Parents Guide, information for carers and parents (share with your key worker!)\n• Activism Hub, how to campaign for better mental health services\n\nWhy it is good:\n✅ Written in language young people actually understand\n✅ Real stories from people your age\n✅ Crisis text line available 24/7\n✅ Helps you understand what you are going through\n✅ Trusted by schools and care homes across the UK\n\nIf you are in crisis, text YM to 85258 for free, 24/7 support.',
        icon: Brain,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['mental-health', 'information', 'crisis'],
        url: 'https://www.youngminds.org.uk'
      },
      {
        title: 'The Mix',
        description: 'Support for under 25s on anything, relationships, money, mental health, housing',
        content: 'THE MIX, Support on Everything\n\n🌐 Website: themix.org.uk\n📞 Phone: 0808 808 4994 (free, 7pm-11pm daily)\n📱 Crisis: Text THEMIX to 85258\n\nWhat you will find:\n\n• Helpline, speak to someone who gets it (7pm-11pm)\n• Online Chat, 1-to-1 support (7pm-11pm)\n• Discussion Boards, thousands of topics from real young people\n• Counselling Service, free online or phone sessions\n• Articles & Videos, covering everything from exam stress to leaving care\n• Housing Support, help if you are homeless or at risk\n• Money Advice, budgeting, debt, benefits explained simply\n• Drugs & Alcohol, honest, non-judgemental information\n• Peer Support, connect with others who understand\n\nWhy it is good:\n✅ Covers EVERYTHING (not just mental health)\n✅ Free and confidential\n✅ Great for practical problems like money and housing\n✅ Active community of young people\n✅ Perfect for 16-25 year olds preparing for independence\n\nEspecially helpful if you are leaving care and need practical advice.',
        icon: MessageCircle,
        difficulty: 'Easy',
        ageGroup: 'Under 25',
        tags: ['support', 'practical', 'housing', 'money'],
        url: 'https://www.themix.org.uk'
      },
      {
        title: 'Become',
        description: 'The charity specifically for children in care and care leavers',
        content: 'BECOME, By Care Experienced People, For Care Experienced People\n\n🌐 Website: becomecharity.org.uk\n📞 Care Advice Line: 0800 023 2033\n\nWhat you will find:\n\n• Know Your Rights, everything you are entitled to in care\n• Care Advice Line, speak to someone who understands the care system\n• Leaving Care Guide, step-by-step help for moving on\n• Propel, find education, training, and support near you (propel.org.uk)\n• Your Story Matters, share your experience to improve the system\n• Campaigns, help change the care system for the better\n• Peer Support, connect with other care experienced young people\n\nKEY TOPICS COVERED:\n• What to expect at LAC reviews\n• Your rights to see your records\n• Independent Visitors explained\n• Staying Put and Staying Close schemes\n• Higher education bursaries and support\n• Housing options after care\n\nWhy it is good:\n✅ Made BY people who have been in care\n✅ Really understands the care system\n✅ Practical help with rights and entitlements\n✅ Propel tool is brilliant for finding local support\n✅ Free and confidential advice line',
        icon: Star,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['care-system', 'rights', 'leaving-care'],
        url: 'https://www.becomecharity.org.uk'
      },
      {
        title: 'Coram Voice',
        description: 'Independent advocacy, making sure YOUR voice is heard in decisions about your life',
        content: 'CORAM VOICE, Your Voice Matters\n\n🌐 Website: coramvoice.org.uk\n📞 Freephone: 0808 800 5792\n\nWhat you will find:\n\n• Always Heard, a helpline run by people who understand the care system\n• Independent Advocacy, someone to speak up for you at meetings\n• Complaints Support, help if you want to make a formal complaint\n• Bright Spots Programme, surveys to help improve care for young people\n• A National Voice, opportunities to influence policy and change\n• Rights Information, guides about your rights in clear language\n\nWHEN TO CONTACT THEM:\n• Before a LAC review or any important meeting\n• If you feel your views are not being heard\n• If you want to make a complaint but do not know how\n• If something is not right and you need an independent person\n• If you need help understanding a decision about your life\n\nWhy it is good:\n✅ INDEPENDENT, they do not work for your care home or council\n✅ Free advocacy service\n✅ They will attend meetings with you\n✅ They help you write complaints\n✅ Available to all children in care in England',
        icon: Users,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['advocacy', 'rights', 'complaints', 'independent'],
        url: 'https://www.coramvoice.org.uk'
      },
      {
        title: 'CEOP Safety Centre',
        description: 'Report online abuse or concerns, run by the National Crime Agency',
        content: 'CEOP SAFETY CENTRE, Online Safety Reporting\n\n🌐 Website: ceop.police.uk\n\nWhat you will find:\n\n• Report Button, report anyone who has made you feel uncomfortable online\n• Safety Advice, guides for staying safe on social media, gaming, and messaging\n• Thinkuknow, age-appropriate resources about online safety\n• Video Resources, real scenarios to help you recognise grooming\n• Parent/Carer Resources, share with your key worker or carer\n\nWHEN TO REPORT:\n🚨 Someone online is making you uncomfortable\n🚨 An adult is asking you to do sexual things online\n🚨 Someone is threatening you with images\n🚨 You have been sent inappropriate content\n🚨 Someone online is trying to meet you in person\n🚨 You are worried about a friend\n\nHOW IT WORKS:\n1. Go to ceop.police.uk\n2. Click "Make a Report"\n3. Fill in what happened (you can be anonymous)\n4. A trained officer will look at your report\n5. They will help keep you safe\n\nWhy it is good:\n✅ This is THE official place to report online abuse\n✅ Trained police officers handle reports\n✅ You can report anonymously\n✅ They take every report seriously\n✅ Also available through Childline',
        icon: Shield,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['online-safety', 'reporting', 'police'],
        url: 'https://www.ceop.police.uk'
      },
      {
        title: 'NHS Every Mind Matters',
        description: 'NHS tools and tips for looking after your mental health, get a free Mind Plan',
        content: 'NHS EVERY MIND MATTERS\n\n🌐 Website: nhs.uk/every-mind-matters\n\nWhat you will find:\n\n• Your Mind Plan, answer 5 quick questions and get a personalised action plan\n• Sleep Tips, science-backed advice for better sleep\n• Anxiety Management, techniques that actually work\n• Low Mood Guide, understanding and managing low feelings\n• Self-Care Toolbox, practical activities for daily wellbeing\n• Stress Management, identifying triggers and coping strategies\n• Body Image, honest information about self-esteem\n• Exam Stress, specific help during exam periods\n\nSPECIAL TOOLS:\n🧠 Mind Plan Quiz, takes 5 minutes, gives personalised tips\n😴 Sleep Quiz, find out what is affecting your sleep\n📱 Audio Guides, listen to relaxation exercises\n📧 Email Programme, weekly tips sent to your inbox\n\nWhy it is good:\n✅ Run by the NHS, trusted medical advice\n✅ Completely free\n✅ Science-based techniques\n✅ The Mind Plan is personalised to YOU\n✅ Simple, practical tips you can use straight away\n✅ No sign-up needed for most tools',
        icon: Activity,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['NHS', 'mental-health', 'tools', 'free'],
        url: 'https://www.nhs.uk/every-mind-matters'
      },
      {
        title: 'Anna Freud Centre',
        description: 'World-class mental health resources and self-care tools designed for young people',
        content: 'ANNA FREUD CENTRE, On My Mind\n\n🌐 Website: annafreud.org/on-my-mind\n\nWhat you will find:\n\n• On My Mind, a website designed WITH young people about mental health\n• Self-Care Hub, interactive tools and strategies\n• Urgency Checker, helps you work out what level of support you need\n• Youth Wellbeing Directory, find local services near you\n• "What to Expect" Guides, know what happens when you get mental health support\n• Podcasts, real conversations about mental health\n• Research, what actually works for young people\'s mental health\n\nKEY TOOLS:\n🔍 Urgency Checker, "Do I need help right now?"\n📍 Service Finder, mental health services near your postcode\n📋 Self-Referral Guide, how to get help without going through your GP\n🎧 Podcasts, honest conversations from young people\n\nWhy it is good:\n✅ World-leading children\'s mental health charity\n✅ Resources created WITH young people, not just FOR them\n✅ The Urgency Checker is really helpful if you are unsure\n✅ Helps you find local services\n✅ Evidence-based, they know what works',
        icon: Brain,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['mental-health', 'tools', 'self-care', 'services'],
        url: 'https://www.annafreud.org/on-my-mind'
      },
      {
        title: 'Thinkuknow',
        description: 'Online safety education from the National Crime Agency, age-specific advice',
        content: 'THINKUKNOW, Stay Safe Online\n\n🌐 Website: thinkuknow.co.uk\n\nWhat you will find:\n\nFOR 8-10 YEAR OLDS (Jessie & Friends):\n• Animated episodes about online safety\n• Interactive games and activities\n• Learning about trusted adults\n\nFOR 11-13 YEAR OLDS (Play Like Share):\n• Social media safety\n• Online gaming safety\n• Sharing images and videos\n• Peer pressure online\n• Recognising manipulation\n\nFOR 14+ (Own It):\n• Sexting, the law and the risks\n• Online relationships, spotting manipulation\n• Consent online and offline\n• Privacy and digital footprint\n• What to do if something goes wrong\n• Reporting abuse\n\nKEY TOPICS:\n🎮 Gaming safety, staying safe in online games\n📸 Image sharing, understanding the consequences\n💬 Online grooming, how to recognise it\n🔒 Privacy settings, protecting your information\n📱 App safety, which apps are safe\n\nWhy it is good:\n✅ From the National Crime Agency (CEOP)\n✅ Age-appropriate content\n✅ Fun and interactive\n✅ Covers the REAL issues young people face online\n✅ Updated regularly with new threats and trends',
        icon: Lock,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['online-safety', 'education', 'interactive'],
        url: 'https://www.thinkuknow.co.uk'
      },
      {
        title: 'MindEd for Families',
        description: 'Free NHS educational resource about children and young people\'s mental health',
        content: 'MINDED FOR FAMILIES\n\n🌐 Website: minded.org.uk/families\n\nWhat you will find:\n\n• Short Learning Sessions, 10-15 minute modules on specific topics\n• Understanding Behaviour, why you might act the way you do\n• Anxiety Explained, what anxiety actually is and how to manage it\n• Self-Harm Information, honest, sensitive guidance\n• Eating Difficulties, understanding and getting help\n• ADHD and Autism, what they mean and how to get support\n• Trauma, understanding how past experiences affect you\n• Sleep Problems, practical solutions\n• Bereavement, coping with loss\n\nFOR YOUR CARERS/KEY WORKERS:\n• Understanding attachment\n• Supporting young people in care\n• Managing challenging behaviour\n• Creating a therapeutic environment\n\nWhy it is good:\n✅ Free and developed by the NHS\n✅ Written by experts but easy to understand\n✅ Short sessions you can do in your own time\n✅ Covers topics other sites sometimes miss\n✅ Good to share with carers and key workers\n✅ Evidence-based and regularly updated',
        icon: BookOpen,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['education', 'NHS', 'mental-health', 'learning'],
        url: 'https://www.minded.org.uk/families'
      },
      {
        title: 'BBC Own It',
        description: 'BBC\'s platform helping young people navigate life online, with a smart keyboard app',
        content: 'BBC OWN IT\n\n🌐 Website: bbc.co.uk/ownit\n📱 App: BBC Own It Keyboard (free on iOS and Android)\n\nWhat you will find:\n\nWEBSITE:\n• Articles, real stories and advice about online life\n• Videos, covering social media, gaming, friendships online\n• Quizzes, test your digital knowledge\n• Expert Advice, from psychologists and online safety experts\n• "How Would You Feel?", scenarios to think about\n\nTHE OWN IT APP (Smart Keyboard):\n📱 Replaces your normal keyboard\n🧠 Uses AI to detect when you might type something you\'ll regret\n💬 Nudges you to think before sending risky messages\n📊 Shows your mood and communication patterns\n🔒 Private, data stays on your phone\n\nTOPICS COVERED:\n• Cyberbullying, what it is and what to do\n• Screen time, finding a healthy balance\n• Social media pressure, dealing with comparison\n• Fake news, how to spot it\n• Digital wellbeing, looking after yourself online\n\nWhy it is good:\n✅ Made by the BBC, trusted and independent\n✅ The keyboard app is genuinely clever\n✅ Content is fun and engaging\n✅ Age-appropriate and honest\n✅ Completely free',
        icon: Gamepad2,
        difficulty: 'Easy',
        ageGroup: '8-15',
        tags: ['online-safety', 'app', 'BBC', 'digital-wellbeing'],
        url: 'https://www.bbc.co.uk/ownit'
      }
    ]
  },
  {
    id: 'crisis',
    title: 'Crisis Support',
    description: 'Who to call and what to do when things feel overwhelming',
    icon: Phone,
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
    resources: [
      {
        title: 'Emergency Contacts and Helplines',
        description: 'Save these numbers \u2014 they could save a life',
        content: 'EMERGENCY AND SUPPORT CONTACTS\n\n\ud83d\udea8 IMMEDIATE DANGER: 999\n\n\ud83d\udcde CHILDLINE: 0800 1111\nFree, confidential, 24/7 for under 19s\n\n\ud83d\udcac SHOUT: Text SHOUT to 85258\nFree 24/7 crisis text support\n\n\ud83d\udcde SAMARITANS: 116 123\nFree to call, 24/7, any age\n\n\ud83d\udcde THE MIX: 0808 808 4994\nSupport for under 25s (7pm-11pm daily)\nOnline chat available 24/7\n\n\ud83d\udcde YOUNGMINDS: Text YM to 85258\nMental health crisis support for under 25s\n\n\ud83c\udfe5 KOOTH: kooth.com\nFree online counselling for 10-25s\n\n\ud83d\udcde CORAM VOICE: 0808 800 5792\nIndependent advocacy for children in care\n\n\ud83d\udcde NSPCC: 0808 800 5000\nFor anyone concerned about a child\n\nSave these in your phone. Share them with a friend. You never know when you might need them.',
        icon: Phone,
        difficulty: 'Easy',
        ageGroup: 'All Ages',
        tags: ['crisis', 'emergency', 'helplines']
      }
    ]
  }
];

export default function YPResources({ onBack, onNavigateToSection }: YPResourcesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const activeCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={selectedCategory ? () => setSelectedCategory(null) : onBack}
            className="p-2 -ml-2 text-purple-600 text-sm font-bold hover:text-purple-800 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {selectedCategory ? 'Back' : 'Menu'}
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-gray-900">
              {selectedCategory ? activeCategory?.title : 'Your Resources'}
            </span>
          </div>
          <Badge className="bg-purple-100 text-purple-700 text-xs">
            {categories.reduce((acc, c) => acc + c.resources.length, 0)} tools
          </Badge>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {!selectedCategory ? (
          /* Category Grid */
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <h1 className="text-2xl font-black text-purple-800">
                Resources Built Just for You
              </h1>
              <p className="text-gray-600 text-base max-w-xl mx-auto">
                Interactive activities and tools designed by care professionals to help you build skills,
                understand your feelings, and feel more confident about life.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`border-2 ${cat.borderColor} hover:shadow-lg transition-all cursor-pointer`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl ${cat.bgColor}`}>
                            <Icon className={`w-6 h-6 ${cat.textColor}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{cat.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`${cat.bgColor} ${cat.textColor} text-xs`}>
                                {cat.resources.length} {cat.resources.length === 1 ? 'resource' : 'resources'}
                              </Badge>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          /* Resource List */
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">{activeCategory?.description}</p>
            {activeCategory?.resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`border ${activeCategory.borderColor} hover:shadow-md transition-all cursor-pointer`}
                    onClick={() => setSelectedResource(resource)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${activeCategory.bgColor}`}>
                          <Icon className={`w-5 h-5 ${activeCategory.textColor}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{resource.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {resource.difficulty && (
                              <Badge className={`text-xs ${
                                resource.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                resource.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {resource.difficulty}
                              </Badge>
                            )}
                            {resource.ageGroup && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">{resource.ageGroup}</Badge>
                            )}
                            {resource.url && (
                              <Badge className="bg-teal-100 text-teal-700 text-xs flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> Website
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resource Detail Dialog */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              {selectedResource && (
                <div className={`p-1.5 rounded-lg ${activeCategory?.bgColor}`}>
                  <selectedResource.icon className={`w-5 h-5 ${activeCategory?.textColor}`} />
                </div>
              )}
              {selectedResource?.title}
            </DialogTitle>
            {selectedResource?.difficulty && (
              <div className="flex gap-2 mt-1">
                <Badge className={`text-xs ${
                  selectedResource.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  selectedResource.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedResource.difficulty}
                </Badge>
                {selectedResource.ageGroup && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs">{selectedResource.ageGroup}</Badge>
                )}
              </div>
            )}
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
            {selectedResource?.content}
          </div>
          <div className="mt-4 pt-4 border-t space-y-2">
            {selectedResource?.url && (
              <a
                href={selectedResource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit {selectedResource.title}
              </a>
            )}
            <Button onClick={() => setSelectedResource(null)} className={`w-full ${selectedResource?.url ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-purple-600 hover:bg-purple-700 text-white'}`}>
              {selectedResource?.url ? 'Close' : 'Got It'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
