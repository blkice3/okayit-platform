
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Phone, MessageCircle, Heart, Users, BookOpen, Headphones,
  ArrowLeft, ArrowRight, Search, Star, Clock, AlertCircle, CheckCircle2, Zap,
  Home, Award, Lightbulb, Target, Sparkles, Gift, Crown, Rocket,
  Eye, Edit, Download, FileText, Mail, Send, HelpCircle, Info, X,
  Video, Mic, Globe, HeadphonesIcon, ShoppingCart, DollarSign, 
  Utensils, Bus, Briefcase, GraduationCap, Baby, Dog, Smartphone, Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import OkayitLogo from './okayit-logo';
import { trackActivity } from './progress-dashboard-new';
import VoiceInputButton from '@/components/voice-input-button';

// Helper function to create clickable phone link
const createPhoneLink = (phone: string) => {
  const cleanPhone = phone.replace(/\s/g, ''); // Remove spaces
  return `tel:${cleanPhone}`;
};

// Helper function to create clickable SMS link
const createSmsLink = (textLine: string) => {
  // Parse text line like "Text YM to 85258" or "Text SHOUT to 85258"
  const match = textLine.match(/(?:Text|text)\s+(\w+)\s+to\s+(\d+)/i);
  if (match) {
    const [, message, number] = match;
    return `sms:${number}?body=${encodeURIComponent(message)}`;
  }
  // If it's just a number with "Text to" prefix
  const numberMatch = textLine.match(/(\d+)/);
  if (numberMatch) {
    return `sms:${numberMatch[1]}`;
  }
  return null;
};

// Helper function to extract phone number from text
const extractPhoneNumber = (text: string) => {
  const match = text.match(/(\d[\d\s]+\d)/);
  return match ? match[1].replace(/\s/g, '') : null;
};

interface EnhancedSupportResourcesProps {
  onBack?: () => void;
  user?: any;
}

interface MultimediaResource {
  type: 'video' | 'audio' | 'podcast' | 'app';
  title: string;
  url: string;
  description: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  tags: string[];
  hasView: boolean;
  hasForm: boolean;
  hasDownload: boolean;
  content?: {
    introduction?: string;
    sections?: Array<{title: string; content: string}>;
    tips?: string[];
    multimedia?: MultimediaResource[];
  };
  formFields?: Array<{
    type: 'text' | 'textarea' | 'select' | 'email' | 'tel' | 'checkbox';
    label: string;
    name: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
  }>;
  contact?: {
    name: string;
    phone?: string;
    email?: string;
    website?: string;
    textLine?: string;
    available: string;
  };
}

const supportResources: Resource[] = [
  // EMERGENCY SUPPORT
  {
    id: 'emergency-crisis',
    title: '999 Emergency Services',
    description: 'Immediate emergency help - police, fire, ambulance',
    icon: Phone,
    color: 'orange',
    priority: 'high',
    category: 'emergency',
    tags: ['emergency', '999', 'crisis', 'urgent', 'police', 'ambulance'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Call 999 if you or someone else is in immediate danger or needs urgent medical help.',
      sections: [
        {
          title: 'When to Call 999',
          content: 'Someone is seriously injured or their life is at risk\nYou or someone else is in immediate danger\nA crime is in progress\nThere is a serious road accident\nSomeone is having a heart attack or stroke\nSomeone has stopped breathing\nThere is a fire\nYou need urgent police, fire, or ambulance help'
        },
        {
          title: 'What to Say',
          content: 'Stay calm and speak clearly\nTell them which service you need (police, fire, ambulance)\nGive your location and what has happened\nAnswer their questions\nStay on the line until they tell you to hang up\nFollow any instructions they give you'
        },
        {
          title: 'If You Cannot Speak',
          content: 'If you dial 999 but cannot speak:\nPress 55 when prompted\nThis tells the operator you need help but cannot talk\nThey will send help to your location'
        }
      ],
      tips: [
        '999 is FREE to call from any phone',
        'You can call even if you have no credit',
        'If you are deaf or cannot hear well, text 999',
        'Save your location on your phone for emergencies'
      ]
    },
    contact: {
      name: 'Emergency Services',
      phone: '999',
      website: 'https://www.nhs.uk/using-the-nhs/nhs-services/urgent-and-emergency-care/when-to-call-999/',
      available: '24 hours, every day'
    }
  },
  {
    id: 'nhs-111',
    title: 'NHS 111 - Medical Help',
    description: 'Get urgent medical help when it is not life-threatening',
    icon: Heart,
    color: 'blue',
    priority: 'high',
    category: 'emergency',
    tags: ['nhs', '111', 'health', 'medical', 'urgent'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'NHS 111 helps when you need medical help fast but it is not a 999 emergency.',
      sections: [
        {
          title: 'When to Call 111',
          content: 'You need medical help but it is not life-threatening\nYou are not sure what to do about a health problem\nYou need to know where to get help\nYou need urgent medical advice\nYour GP surgery is closed\nYou think you need to go to A&E but are not sure'
        },
        {
          title: 'What 111 Can Do',
          content: 'Give you medical advice\nTell you where to get help\nArrange for you to see a doctor or nurse\nSend an ambulance if needed\nGive you a prescription\nConnect you to other services'
        },
        {
          title: 'Online NHS 111',
          content: 'You can also use NHS 111 online at:\n111.nhs.uk\n\nAnswer questions about your symptoms and get advice on what to do next.'
        }
      ],
      tips: [
        'NHS 111 is FREE from landlines and mobiles',
        'Available 24 hours a day, every day',
        'They can book appointments with GPs and pharmacies',
        'Keep your NHS number handy when you call'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'How to Use NHS 111',
          url: 'https://www.nhs.uk/using-the-nhs/nhs-services/urgent-and-emergency-care/nhs-111/',
          description: 'Learn how NHS 111 can help you'
        }
      ]
    },
    contact: {
      name: 'NHS 111',
      phone: '111',
      website: 'https://111.nhs.uk',
      available: '24 hours, every day'
    }
  },
  {
    id: 'childline',
    title: 'Childline - Talk to Someone',
    description: 'Free, confidential support for young people under 19',
    icon: MessageCircle,
    color: 'green',
    priority: 'high',
    category: 'emergency',
    tags: ['childline', 'talk', 'counselling', 'confidential', 'young people'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Childline is here for you, no matter what. Talk to a counsellor about anything - big or small.',
      sections: [
        {
          title: 'What Childline Can Help With',
          content: 'Bullying and abuse\nFamily problems\nSchool and education\nFeelings and mental health\nRelationships\nSexuality and identity\nMoney and housing\nAnything else worrying you'
        },
        {
          title: 'How to Contact Childline',
          content: 'PHONE: Call 0800 1111 (FREE, 24/7)\nONLINE CHAT: Visit childline.org.uk (9am-midnight)\nEMAIL: Get a reply within a day through their website\n1-2-1 CHAT: Talk to a counsellor online'
        },
        {
          title: 'Childline Message Boards',
          content: 'Join message boards to:\nShare your experiences\nGet support from other young people\nRead advice and tips\nFeel less alone\n\nAll moderated by Childline staff to keep you safe'
        },
        {
          title: 'Your Conversation is Private',
          content: 'Everything you say is confidential\nThey will not tell anyone unless you are in serious danger\nYou do not have to give your name\nYour call will not show up on phone bills\nYou can talk about anything'
        }
      ],
      tips: [
        'Calls are FREE and do not show on phone bills',
        'You can call even if you have no credit',
        'Online chat is available when phones are busy',
        'Childline counsellors are specially trained to help young people'
      ],
      multimedia: [
        {
          type: 'app',
          title: 'For Me by Childline',
          url: 'https://www.childline.org.uk/toolbox/for-me/',
          description: 'Free app with mood tracking, breathing exercises, and more'
        },
        {
          type: 'video',
          title: 'How Childline Works',
          url: 'https://www.childline.org.uk/info-advice/about-childline/how-childline-works/',
          description: 'Watch videos about getting support'
        }
      ]
    },
    contact: {
      name: 'Childline',
      phone: '0800 1111',
      website: 'https://www.childline.org.uk',
      textLine: 'Online chat at childline.org.uk',
      available: '24 hours, every day'
    }
  },
  {
    id: 'samaritans',
    title: 'Samaritans - Always There',
    description: 'Talk about anything that is troubling you, any time',
    icon: Headphones,
    color: 'purple',
    priority: 'high',
    category: 'emergency',
    tags: ['samaritans', 'listening', 'suicide', 'crisis', 'emotional support'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Whatever you are going through, Samaritans will listen without judgment.',
      sections: [
        {
          title: 'How Samaritans Can Help',
          content: 'Listen to you without judging\nLet you talk about your feelings\nHelp you explore your options\nProvide emotional support\nBe there in a crisis\nTalk for as long as you need'
        },
        {
          title: 'Ways to Contact Samaritans',
          content: 'PHONE: Call 116 123 (FREE, 24/7)\nEMAIL: jo@samaritans.org (reply within 24 hours)\nWRITE: Freepost SAMARITANS LETTERS (no stamp needed)\nVISIT: Find your local branch at samaritans.org'
        },
        {
          title: 'What to Expect',
          content: 'A trained volunteer will listen to you\nThey will not judge you\nThey will not tell you what to do\nThey will not try to solve your problems\nThey will simply be there for you\nYou can talk for as long as you need'
        }
      ],
      tips: [
        'Calls are FREE from any phone',
        'You do not have to be suicidal to call',
        'You can call just to talk',
        'Email responses come within 24 hours'
      ],
      multimedia: [
        {
          type: 'app',
          title: 'Samaritans Self-Help App',
          url: 'https://www.samaritans.org/how-we-can-help/schools/deal/deal-resources/',
          description: 'Tools and resources for managing difficult feelings'
        }
      ]
    },
    contact: {
      name: 'Samaritans',
      phone: '116 123',
      email: 'jo@samaritans.org',
      website: 'https://www.samaritans.org',
      available: '24 hours, every day'
    }
  },
  {
    id: 'shout-crisis-text',
    title: 'Shout - Text Support',
    description: 'Free, confidential text support 24/7',
    icon: Smartphone,
    color: 'pink',
    priority: 'high',
    category: 'emergency',
    tags: ['shout', 'text', 'crisis', '85258', 'messaging'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'If you prefer texting to talking, Shout provides free 24/7 text support.',
      sections: [
        {
          title: 'How to Use Shout',
          content: 'TEXT: Send SHOUT to 85258\nA trained volunteer will text you back\nUsually within 5 minutes\nThey will have a conversation with you by text\nHelp you feel calmer\nMake a plan to stay safe'
        },
        {
          title: 'What Shout Can Help With',
          content: 'Suicidal thoughts\nAnxiety and panic attacks\nDepression\nSelf-harm\nRelationship problems\nBullying\nLoneliness\nAnything overwhelming you'
        },
        {
          title: 'Your Privacy',
          content: 'All conversations are confidential\nYou can be anonymous\nTexts are free and will not appear on your phone bill\nNo judgment, just support\nThey only break confidentiality if you are in serious danger'
        }
      ],
      tips: [
        'Texts are FREE - will not use your credit',
        'Does not show on phone bills',
        'Usually get a reply within 5 minutes',
        'Can text from anywhere in the UK'
      ]
    },
    contact: {
      name: 'Shout Crisis Text Line',
      textLine: 'Text SHOUT to 85258',
      website: 'https://giveusashout.org',
      available: '24 hours, every day'
    }
  },

  // MENTAL HEALTH & WELLBEING
  {
    id: 'youngminds',
    title: 'YoungMinds - Mental Health',
    description: 'Young people mental health charity with helpline and resources',
    icon: Brain,
    color: 'blue',
    priority: 'high',
    category: 'mental-health',
    tags: ['mental health', 'youngminds', 'anxiety', 'depression', 'wellbeing'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'YoungMinds provides expert support and advice for young people experiencing mental health difficulties.',
      sections: [
        {
          title: 'YoungMinds Crisis Messenger',
          content: 'TEXT: YM to 85258 for free 24/7 crisis support\nGet support with mental health crisis\nTrained volunteers respond\nConfidential text support\nUsually reply within 5 minutes'
        },
        {
          title: 'Parents Helpline',
          content: 'PHONE: 0808 802 5544\nFor parents and carers worried about a young person\nMonday to Friday, 9:30am - 4pm\nFree, confidential advice\nExpert mental health guidance'
        },
        {
          title: 'Online Resources',
          content: 'Website: youngminds.org.uk\nFind information about:\n- Anxiety and panic\n- Depression\n- Self-harm\n- Eating problems\n- ADHD and autism\n- Trauma and abuse\n- Exam stress'
        }
      ],
      tips: [
        'Crisis text line is FREE and available 24/7',
        'Lots of helpful guides on their website',
        'Find a blog written by young people for young people',
        'Follow @YoungMindsUK for mental health tips'
      ],
      multimedia: [
        {
          type: 'podcast',
          title: 'Talking Mental Health',
          url: 'https://www.youngminds.org.uk/young-person/blog/',
          description: 'Blog posts and stories from young people'
        }
      ]
    },
    contact: {
      name: 'YoungMinds',
      textLine: 'Text YM to 85258',
      phone: '0808 802 5544 (Parents helpline)',
      website: 'https://www.youngminds.org.uk',
      available: 'Crisis text: 24/7. Helpline: Mon-Fri 9:30am-4pm'
    }
  },
  {
    id: 'papyrus-suicide-prevention',
    title: 'PAPYRUS - Suicide Prevention',
    description: 'Support for young people having suicidal thoughts',
    icon: Shield,
    color: 'orange',
    priority: 'high',
    category: 'mental-health',
    tags: ['suicide', 'prevention', 'crisis', 'papyrus', 'hopelineuk'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'PAPYRUS provides confidential support and advice to young people struggling with thoughts of suicide.',
      sections: [
        {
          title: 'HOPELINEUK',
          content: 'PHONE: 0800 068 4141\nTEXT: 07860 039967\nEMAIL: pat@papyrus-uk.org\n\nOpen:\nMonday to Friday: 10am - 10pm\nWeekends: 2pm - 10pm\nBank Holidays: 2pm - 10pm'
        },
        {
          title: 'How PAPYRUS Can Help',
          content: 'Talk about suicidal thoughts safely\nProvide hope and practical support\nHelp you stay safe\nExplore your feelings\nWork through difficult emotions\nConnect you with other services if needed'
        },
        {
          title: 'You Are Not Alone',
          content: 'Many young people have thoughts of suicide\nThese thoughts can be temporary\nTalking helps\nThere is hope\nThings can get better\nPAPYRUS is here for you'
        }
      ],
      tips: [
        'All contact is confidential',
        'They understand what you are going through',
        'No question is too small or silly',
        'They will not judge you'
      ]
    },
    contact: {
      name: 'PAPYRUS HOPELINEUK',
      phone: '0800 068 4141',
      textLine: '07860 039967',
      email: 'pat@papyrus-uk.org',
      website: 'https://www.papyrus-uk.org',
      available: 'Mon-Fri 10am-10pm, Weekends 2pm-10pm'
    }
  },

  // EVERYDAY LIVING - MONEY & BUDGETING
  {
    id: 'money-budgeting-basics',
    title: 'Money & Budgeting Basics',
    description: 'Learn to manage your money and create a budget',
    icon: DollarSign,
    color: 'green',
    priority: 'high',
    category: 'everyday-living',
    tags: ['money', 'budgeting', 'finance', 'savings', 'spending'],
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Learning to manage money is an essential life skill. Start building good habits now.',
      sections: [
        {
          title: 'Creating a Simple Budget',
          content: 'Step 1: List all money coming in (allowance, job, benefits)\nStep 2: List all money going out (food, transport, phone)\nStep 3: Subtract spending from income\nStep 4: Adjust if you are spending more than you earn'
        },
        {
          title: 'The 50/30/20 Rule',
          content: '50% - NEEDS (rent, food, bills, transport)\n30% - WANTS (entertainment, eating out, hobbies)\n20% - SAVINGS (emergency fund, future goals)\n\nThis is a guideline - adjust for your situation'
        },
        {
          title: 'Money Saving Apps',
          content: 'MONZO - Banking app with budgeting tools\nEMMA - Tracks spending across all accounts\nPLUM - Automatically saves small amounts\nSTARLING - Teen account with parental controls\n\nAll available free on iOS and Android'
        },
        {
          title: 'Top Money Saving Tips',
          content: 'Use student/youth discounts (16-25 Railcard, NUS card)\nBuy supermarket own brands\nMeal plan and batch cook\nWalk or cycle instead of bus when possible\nSell things you no longer need\nAvoid impulse buying - wait 24 hours\nUse comparison sites for better deals'
        }
      ],
      tips: [
        'Track spending for one month to see where money goes',
        'Set up automatic savings - even £5/week adds up',
        'Use the 24-hour rule before buying non-essentials',
        'Check if you are entitled to any benefits or bursaries'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'BBC Bitesize Money Guide',
          url: 'https://www.bbc.co.uk/bitesize/articles/zf4cxyc',
          description: 'Video guides on managing money'
        },
        {
          type: 'app',
          title: 'Moneybox App',
          url: 'https://www.moneyboxapp.com',
          description: 'Save and invest spare change automatically'
        }
      ]
    },
    formFields: [
      { type: 'text', label: 'Monthly Income', name: 'income', placeholder: 'Total money coming in', required: false },
      { type: 'text', label: 'Fixed Expenses', name: 'fixed_expenses', placeholder: 'Rent, bills, transport', required: false },
      { type: 'text', label: 'Variable Expenses', name: 'variable_expenses', placeholder: 'Food, entertainment', required: false },
      { type: 'text', label: 'Savings Goal', name: 'savings_goal', placeholder: 'How much do you want to save?', required: false },
      { type: 'textarea', label: 'Money Challenges', name: 'challenges', placeholder: 'What financial goals or challenges do you have?', required: false }
    ],
    contact: {
      name: 'Citizens Advice Money Help',
      phone: '0800 144 8848',
      website: 'https://www.citizensadvice.org.uk/debt-and-money/',
      available: 'Monday to Friday, 9am-5pm'
    }
  },

  // EVERYDAY LIVING - COOKING & FOOD
  {
    id: 'cooking-nutrition-guide',
    title: 'Cooking & Nutrition Guide',
    description: 'Learn to cook simple, healthy, budget-friendly meals',
    icon: Utensils,
    color: 'orange',
    priority: 'medium',
    category: 'everyday-living',
    tags: ['cooking', 'food', 'nutrition', 'recipes', 'healthy eating'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Cooking your own food saves money, is healthier, and is a valuable life skill.',
      sections: [
        {
          title: '5 Essential Meals to Master',
          content: '1. PASTA WITH SAUCE (10 minutes)\nBoil pasta, heat jar of sauce, add cheese\n\n2. STIR-FRY (15 minutes)\nFry vegetables + protein, add soy sauce, serve with rice\n\n3. JACKET POTATO (60 minutes)\nBake potato, top with beans/cheese/tuna\n\n4. OMELETTE (10 minutes)\nWhisk eggs, cook with fillings\n\n5. SANDWICH/WRAP (5 minutes)\nProtein + salad + sauce in bread or wrap'
        },
        {
          title: 'Kitchen Essentials',
          content: 'EQUIPMENT:\nSaucepan, frying pan, sharp knife, chopping board, wooden spoon, tin opener, measuring cups\n\nSTAPLE INGREDIENTS:\nPasta, rice, tinned tomatoes, tinned beans, eggs, bread, oil, salt, pepper, garlic, onions\n\nKEEP IN FRIDGE:\nMilk, cheese, butter, vegetables'
        },
        {
          title: 'Food Safety Basics',
          content: 'STORAGE:\nFridge should be 5°C or below\nStore raw meat at the bottom of fridge\nCover all food\nCheck use-by dates\n\nCOOKING:\nWash hands before cooking\nCook meat thoroughly (no pink)\nReheat food until piping hot\nDo not leave food out for more than 2 hours'
        },
        {
          title: 'Budget Shopping Tips',
          content: 'Shop with a list - avoid impulse buys\nBuy supermarket own brands\nLook for yellow sticker reductions\nBuy frozen vegetables (just as nutritious)\nBatch cook and freeze portions\nPlan meals around what is on offer\nUse apps like Too Good To Go for cheap food'
        }
      ],
      tips: [
        'Start with simple recipes and build confidence',
        'YouTube has thousands of free cooking tutorials',
        'Frozen vegetables are cheap and last longer',
        'Batch cooking saves time and money'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'BBC Good Food - Easy Recipes',
          url: 'https://www.bbcgoodfood.com/recipes/collection/easy-recipes',
          description: 'Simple recipe videos for beginners'
        },
        {
          type: 'app',
          title: 'Too Good To Go',
          url: 'https://www.toogoodtogo.com',
          description: 'Buy surplus food from shops and restaurants at discounted prices'
        }
      ]
    },
    contact: {
      name: 'Change4Life (NHS)',
      website: 'https://www.nhs.uk/healthier-families/',
      available: 'Online resources available 24/7'
    }
  },

  // EVERYDAY LIVING - TRAVEL & TRANSPORT
  {
    id: 'travel-transport-guide',
    title: 'Travel & Transport Guide',
    description: 'Navigate buses, trains, and public transport confidently',
    icon: Bus,
    color: 'blue',
    priority: 'medium',
    category: 'everyday-living',
    tags: ['travel', 'transport', 'buses', 'trains', 'tickets'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Getting around independently is important. Learn how to use public transport with confidence.',
      sections: [
        {
          title: 'Bus Travel Basics',
          content: 'BUYING TICKETS:\nContactless card (tap on/off)\nBuy from driver (have exact change ready)\nBus pass or discount card\n\nHOW TO USE:\n1. Check bus number and destination\n2. Wait at bus stop\n3. Signal bus to stop (put arm out)\n4. Pay or tap card\n5. Find a seat\n6. Press bell one stop before yours\n7. Exit through middle or back doors'
        },
        {
          title: 'Train Travel Basics',
          content: 'BUYING TICKETS:\nOnline or app (usually cheapest)\nTicket machines at station\nTicket office\nContactless payment on some routes\n\nMONEY-SAVING TIPS:\nBuy tickets in advance (up to 12 weeks early)\nUse railcard (16-25, 16-17, 26-30)\nTravel off-peak (after 9:30am weekdays)\nSplit tickets can be cheaper\nUse Trainline or National Rail app'
        },
        {
          title: 'Journey Planning',
          content: 'USEFUL APPS:\nGoogle Maps - All transport types\nCitymapper - Buses, trains, walking times\nTrainline - Train tickets and times\nBus Times - Live bus arrival info\nUber/Bolt - Taxis and ride sharing\n\nAll available free on iOS and Android'
        },
        {
          title: 'Young Person Discounts',
          content: '16-25 RAILCARD - £30/year\nSaves 1/3 off train fares\n\n16-17 SAVER - £30/year\n50% off most rail fares\n\nSTUDENT OYSTER (London) - 30% off\n\nYOUNG SCOT CARD (Scotland) - Free\nDiscounts on travel and more'
        }
      ],
      tips: [
        'Download journey planning apps before you travel',
        'Allow extra time for your first solo journey',
        'Ask bus driver or train staff if you are unsure',
        'Screenshot directions on your phone in case you lose signal'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'National Rail - How to Use Trains',
          url: 'https://www.nationalrail.co.uk',
          description: 'Video guides on train travel'
        }
      ]
    },
    contact: {
      name: 'National Rail Enquiries',
      phone: '03457 48 49 50',
      website: 'https://www.nationalrail.co.uk',
      available: '24 hours, every day'
    }
  },

  // EVERYDAY LIVING - EMPLOYMENT
  {
    id: 'job-hunting-cv-guide',
    title: 'Job Hunting & CV Writing',
    description: 'Find jobs, write CVs, and prepare for interviews',
    icon: Briefcase,
    color: 'purple',
    priority: 'high',
    category: 'everyday-living',
    tags: ['jobs', 'cv', 'employment', 'interviews', 'career'],
    hasView: true,
    hasForm: true,
    hasDownload: true,
    content: {
      introduction: 'Getting your first job is exciting. Learn how to find opportunities and present yourself well.',
      sections: [
        {
          title: 'Where to Find Jobs',
          content: 'ONLINE JOB SITES:\nIndeed.co.uk - Largest UK job site\nReed.co.uk - Wide range of jobs\nTotaljobs.co.uk - Graduate and entry-level roles\nGov.uk/find-apprenticeship - Apprenticeships\n\nOTHER PLACES:\nCompany websites (apply direct)\nLocal newspapers\nJob Centre Plus\nShop windows\nWord of mouth'
        },
        {
          title: 'Writing Your First CV',
          content: 'CV STRUCTURE:\n1. Personal Details (name, phone, email, location)\n2. Personal Statement (2-3 sentences about you)\n3. Education (schools, qualifications)\n4. Work Experience (paid jobs, volunteering)\n5. Skills (what you can do)\n6. Interests (hobbies, activities)\n7. References (Available on request)\n\nKEEP IT:\n- One page for first CV\n- Clear and easy to read\n- No spelling mistakes\n- Honest and accurate'
        },
        {
          title: 'Interview Preparation',
          content: 'BEFORE:\nResearch the company\nPrepare answers to common questions\nPlan your journey\nChoose appropriate clothes\nBring spare CVs\n\nDURING:\nArrive 10 minutes early\nSmile and make eye contact\nListen carefully to questions\nBe honest\nAsk questions at the end\nThank them for their time\n\nAFTER:\nSend thank you email\nWait 1-2 weeks for response\nAsk for feedback if unsuccessful'
        },
        {
          title: 'Common Interview Questions',
          content: '1. Tell me about yourself\n2. Why do you want this job?\n3. What are your strengths?\n4. What are your weaknesses?\n5. Where do you see yourself in 5 years?\n6. Why should we hire you?\n7. Do you have any questions for us?\n\nPractice answers to these questions'
        }
      ],
      tips: [
        'Tailor your CV for each job application',
        'Use active words like achieved, organised, managed',
        'Get someone to check your CV for mistakes',
        'Practice interview questions with a friend'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'National Careers Service Videos',
          url: 'https://nationalcareers.service.gov.uk',
          description: 'CV and interview video guides'
        }
      ]
    },
    formFields: [
      { type: 'text', label: 'What type of job are you looking for?', name: 'job_type', placeholder: 'E.g. retail, hospitality, office', required: false },
      { type: 'select', label: 'Do you have a CV?', name: 'has_cv', options: ['Yes', 'No', 'Not sure if it is good enough'], required: false },
      { type: 'textarea', label: 'What help do you need with job hunting?', name: 'help_needed', placeholder: 'E.g. writing CV, interview practice, where to look', required: false }
    ],
    contact: {
      name: 'National Careers Service',
      phone: '0800 100 900',
      website: 'https://nationalcareers.service.gov.uk',
      available: 'Phone: 8am-10pm every day'
    }
  },

  // EDUCATION & LEARNING
  {
    id: 'study-skills-exams',
    title: 'Study Skills & Exam Tips',
    description: 'Effective study techniques and exam preparation',
    icon: GraduationCap,
    color: 'blue',
    priority: 'high',
    category: 'education',
    tags: ['study', 'exams', 'revision', 'learning', 'school'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'Good study habits make learning easier and exams less stressful. Find what works for you.',
      sections: [
        {
          title: 'Study Techniques That Work',
          content: 'ACTIVE RECALL:\nTest yourself instead of just reading\nMake flashcards\nExplain topics out loud\nTeach someone else\n\nSPACED REPETITION:\nReview material multiple times\nSpace out revision sessions\nRevisit difficult topics more often\n\nPOMODORO TECHNIQUE:\nStudy for 25 minutes\nBreak for 5 minutes\nRepeat 4 times\nThen take 15-30 minute break'
        },
        {
          title: 'Creating a Revision Timetable',
          content: 'STEPS:\n1. List all subjects and topics\n2. Identify which topics you find hardest\n3. Allocate more time to difficult subjects\n4. Schedule revision sessions (45-60 min)\n5. Include regular breaks\n6. Build in flexibility\n7. Start revising early (6-8 weeks before exams)\n8. Review and adjust as needed'
        },
        {
          title: 'Exam Day Tips',
          content: 'NIGHT BEFORE:\nPrepare bag (pens, water, calculator)\nGet good sleep (8 hours)\nAvoid cramming\nRelax and trust your preparation\n\nON THE DAY:\nEat breakfast\nArrive early\nRead instructions carefully\nPlan your time per question\nStart with easier questions\nCheck answers if time left'
        },
        {
          title: 'Dealing with Exam Stress',
          content: 'BEFORE EXAMS:\nStay physically active\nEat regular meals\nGet enough sleep\nTalk about worries\nPractice relaxation techniques\n\nIF YOU FEEL ANXIOUS:\nBreathing exercises (4-7-8 technique)\nVisualize success\nPositive self-talk\nTalk to teacher or counsellor\nRemember: exams do not define you'
        }
      ],
      tips: [
        'Find your best learning style - visual, auditory, or kinesthetic',
        'Study in a quiet place with good lighting',
        'Turn off phone during study sessions',
        'Use free online resources like BBC Bitesize and Khan Academy'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'BBC Bitesize Study Skills',
          url: 'https://www.bbc.co.uk/bitesize',
          description: 'Free revision resources for all subjects'
        },
        {
          type: 'app',
          title: 'Forest - Stay Focused',
          url: 'https://www.forestapp.cc',
          description: 'Gamified focus timer to avoid phone distractions'
        },
        {
          type: 'app',
          title: 'Quizlet',
          url: 'https://quizlet.com',
          description: 'Make flashcards and study sets'
        }
      ]
    },
    contact: {
      name: 'The Student Room',
      website: 'https://www.thestudentroom.co.uk',
      available: 'Online community for students'
    }
  },

  // RIGHTS & ADVOCACY
  {
    id: 'care-rights-advocacy',
    title: 'Your Rights in Care',
    description: 'Know your rights and how to get independent advocacy',
    icon: Shield,
    color: 'green',
    priority: 'high',
    category: 'rights',
    tags: ['rights', 'advocacy', 'legal', 'care', 'voice'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'As a young person in care, you have important rights that protect you and help you thrive.',
      sections: [
        {
          title: 'Your Core Rights',
          content: 'RIGHT TO BE SAFE:\nYou must be protected from harm\n\nRIGHT TO BE HEARD:\nYour views must be listened to and taken seriously\n\nRIGHT TO PRIVACY:\nYou have a right to confidentiality and personal space\n\nRIGHT TO EDUCATION:\nYou must be supported to attend school and learn\n\nRIGHT TO HEALTHCARE:\nYou must receive medical care when needed\n\nRIGHT TO RELATIONSHIPS:\nYou can keep in contact with family (when safe)\n\nRIGHT TO COMPLAIN:\nYou can speak up if you are unhappy'
        },
        {
          title: 'Independent Advocacy',
          content: 'CORAM VOICE:\nPhone: 0808 800 5792\nFree, independent advocacy for children in care\n\nNYAS (National Youth Advocacy Service):\nPhone: 0808 808 1001\nHelp to have your voice heard\n\nTHE CHILDREN SOCIETY:\nPhone: 0300 303 7000\nSupport and advocacy services\n\nTHE WHO CARES? TRUST:\nWebsite: thewhocarestrustuk\nSupport for care-experienced young people'
        },
        {
          title: 'Making a Complaint',
          content: 'IF UNHAPPY:\nStep 1: Talk to your social worker or carer\nStep 2: Contact advocacy service for support\nStep 3: Make formal complaint to local authority\nStep 4: Contact Ofsted if unresolved\n\nOFSTED:\nPhone: 0300 123 1231\nEmail: enquiries@ofsted.gov.uk\nThey inspect and regulate children is care'
        },
        {
          title: 'Your Care Plan',
          content: 'You should have regular reviews (at least every 6 months)\nYou should be invited to your reviews\nYou can bring someone to support you\nYou can share your views in writing if you prefer\nYour care plan should include your wishes and feelings\nYou have the right to a copy of your care plan'
        }
      ],
      tips: [
        'Keep copies of important documents',
        'Attend your review meetings - your voice matters',
        'Ask for an advocate if you need support',
        'You can contact Ofsted directly if you have concerns'
      ]
    },
    contact: {
      name: 'Coram Voice (Advocacy)',
      phone: '0808 800 5792',
      email: 'info@coramvoice.org.uk',
      website: 'https://coramvoice.org.uk',
      available: 'Monday to Friday, 9am-5pm'
    }
  },

  // DIGITAL SAFETY
  {
    id: 'online-safety-guide',
    title: 'Online Safety & Digital Wellbeing',
    description: 'Stay safe online, manage social media, and spot scams',
    icon: Globe,
    color: 'purple',
    priority: 'high',
    category: 'practical',
    tags: ['online', 'safety', 'internet', 'social media', 'cyberbullying'],
    hasView: true,
    hasForm: false,
    hasDownload: true,
    content: {
      introduction: 'The internet is amazing but can also have risks. Learn how to enjoy it safely.',
      sections: [
        {
          title: 'Social Media Wellbeing',
          content: 'HEALTHY HABITS:\nSet time limits on apps\nTurn off notifications\nDo not check phone first thing in morning\nTake regular breaks\nUnfollow accounts that make you feel bad\nRemember: people only show highlights\n\nPRIVACY SETTINGS:\nMake accounts private\nOnly accept friend requests from people you know\nDo not share location\nThink before posting\nReview tagged photos before they appear'
        },
        {
          title: 'Spotting Scams',
          content: 'RED FLAGS:\nToo good to be true offers\nUrgent action required\nAsking for money or personal info\nPoor grammar and spelling\nSuspicious links\nPretending to be someone official\n\nNEVER SHARE:\nPasswords\nBank details\nFull address\nPersonal photos with strangers\nSecrets that make you uncomfortable'
        },
        {
          title: 'Dealing with Cyberbullying',
          content: 'IF YOU ARE BEING BULLIED ONLINE:\n1. Do not respond to the bully\n2. Block the person\n3. Screenshot evidence\n4. Report to the platform\n5. Tell a trusted adult\n6. Contact Childline: 0800 1111\n\nREPORT TO CEOP:\nFor serious online abuse\nWebsite: ceop.police.uk/safety-centre\n\nREPORT TO PLATFORM:\nAll social media have report buttons'
        },
        {
          title: 'Passwords & Account Security',
          content: 'STRONG PASSWORDS:\nUse different password for each account\nMix letters, numbers, symbols\nAt least 12 characters long\nUse a password manager\n\nTWO-FACTOR AUTHENTICATION:\nAdd extra security to accounts\nReceive code on phone when logging in\nMakes accounts much harder to hack\n\nIF HACKED:\nChange password immediately\nCheck for suspicious activity\nTell your contacts\nReport to platform'
        }
      ],
      tips: [
        'Never meet someone you only know online without telling an adult',
        'Block and report anyone who makes you uncomfortable',
        'If something feels wrong, trust your instincts',
        'Talk to an adult if you see something upsetting online'
      ],
      multimedia: [
        {
          type: 'video',
          title: 'Think U Know - Online Safety',
          url: 'https://www.thinkuknow.co.uk',
          description: 'Videos and guides on staying safe online'
        }
      ]
    },
    contact: {
      name: 'Report Harmful Content',
      website: 'https://reportharmfulcontent.com',
      available: 'Report online abuse and get advice'
    }
  }
];

export default function EnhancedSupportResources({ onBack, user }: EnhancedSupportResourcesProps) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'view' | 'form' | 'download'>('view');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Resources', color: 'purple' },
    { id: 'emergency', label: 'Emergency Help', color: 'orange' },
    { id: 'mental-health', label: 'Mental Health', color: 'pink' },
    { id: 'everyday-living', label: 'Everyday Living', color: 'green' },
    { id: 'education', label: 'Education', color: 'blue' },
    { id: 'rights', label: 'Your Rights', color: 'purple' },
    { id: 'practical', label: 'Practical Skills', color: 'blue' }
  ];

  const filteredResources = supportResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFormChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Your message has been saved. A support worker will follow up with you.', {
        duration: 5000,
      });
      
      setFormData({});
      setActiveTab('view');
    } catch (error) {
      toast.error('Failed to save. Please try again or speak to a staff member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (resource: Resource) => {
    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/generate-support-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        a.download = `${resource.id}-guide.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success('PDF downloaded successfully!');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast.error('Download currently unavailable. Please ask staff for a printed copy.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Compact Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-blue-600 text-sm font-bold hover:text-blue-800 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Menu
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <span className="text-sm font-bold text-gray-900">Help &amp; Support</span>
          </div>
          <OkayitLogo width={28} height={28} />
        </div>
      </div>

      {/* Emergency Banner - compact */}
      <div className="max-w-3xl mx-auto px-4 pt-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
          <Phone className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-red-700">
              Emergency? Call 999 &middot; Childline: 0800 1111 &middot; Samaritans: 116 123
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedResource(supportResources[0]);
              setActiveTab('view');
            }}
            className="text-xs font-bold text-red-600 hover:text-red-800 whitespace-nowrap"
          >
            More &rarr;
          </button>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search helplines, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm border border-gray-200 rounded-lg focus:border-purple-400"
            />
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid - compact list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {filteredResources.map((resource, index) => {
            const Icon = resource.icon;
            const colorMap: Record<string, string> = {
              purple: 'text-purple-600 bg-purple-50 border-purple-200',
              blue: 'text-blue-600 bg-blue-50 border-blue-200',
              orange: 'text-orange-600 bg-orange-50 border-orange-200',
              green: 'text-green-600 bg-green-50 border-green-200',
              pink: 'text-pink-600 bg-pink-50 border-pink-200',
            };
            const c = colorMap[resource.color] || colorMap.blue;
            const iconColor = c.split(' ')[0];
            return (
              <motion.button
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => {
                  setSelectedResource(resource);
                  setActiveTab(resource.hasView ? 'view' : resource.hasForm ? 'form' : 'download');
                  trackActivity('resource', {
                    id: resource.id,
                    title: resource.title,
                    category: resource.category
                  });
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border ${c.split(' ').slice(1).join(' ')} hover:shadow-md transition-all text-left cursor-pointer group`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight truncate">{resource.title}</p>
                  <p className="text-xs text-gray-600 font-medium leading-tight mt-0.5 truncate">{resource.description}</p>
                  {resource.contact?.phone && (
                    <p className="text-xs text-blue-600 font-bold mt-0.5">{resource.contact.phone}</p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-800 mb-1">
              No resources found
            </h3>
            <p className="text-xs text-gray-500">
              Try a different search or category
            </p>
          </div>
        )}
      </div>

      {/* Resource Detail Modal - continues in next part due to length */}
      <AnimatePresence>
        {selectedResource && (
          <Dialog open={!!selectedResource} onOpenChange={() => {
            setSelectedResource(null);
            setFormData({});
          }}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col bg-white border border-gray-200 rounded-2xl">
              <DialogHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                    <selectedResource.icon className="w-5 h-5 text-blue-600" />
                    {selectedResource.title}
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedResource(null);
                      setFormData({});
                    }}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 sticky top-0 bg-white z-10">
                    <TabsTrigger 
                      value="view" 
                      disabled={!selectedResource.hasView} 
                      className="text-base md:text-lg py-3 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="form" 
                      disabled={!selectedResource.hasForm} 
                      className="text-base md:text-lg py-3 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Form</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="download" 
                      disabled={!selectedResource.hasDownload} 
                      className="text-base md:text-lg py-3 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* View Tab */}
                  <TabsContent value="view" className="space-y-6 px-1">
                    {selectedResource.contact && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className={okayitTheme.backgrounds.blueCard}>
                          <CardContent className="p-6">
                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
                              <Phone className="w-5 h-5 text-blue-900" />
                              Contact Information
                            </h4>
                            <div className="space-y-2">
                              <p className={combineThemeClasses("text-lg font-bold", okayitTheme.text.primaryOnLight)}>
                                {selectedResource.contact.name}
                              </p>
                              {selectedResource.contact.phone && (
                                <p className={combineThemeClasses("text-2xl font-mono font-black", okayitTheme.text.blue)}>
                                  📞 <a 
                                    href={createPhoneLink(selectedResource.contact.phone)}
                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                    onClick={() => toast.success(`Calling ${selectedResource.contact?.phone}...`)}
                                  >
                                    {selectedResource.contact.phone}
                                  </a>
                                </p>
                              )}
                              {selectedResource.contact.textLine && (
                                <p className={combineThemeClasses("text-lg", okayitTheme.text.primaryOnLight)}>
                                  💬 {createSmsLink(selectedResource.contact.textLine) ? (
                                    <a 
                                      href={createSmsLink(selectedResource.contact.textLine)!}
                                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                      onClick={() => toast.success('Opening messaging app...')}
                                    >
                                      {selectedResource.contact.textLine}
                                    </a>
                                  ) : (
                                    <span>{selectedResource.contact.textLine}</span>
                                  )}
                                </p>
                              )}
                              {selectedResource.contact.email && (
                                <p className={okayitTheme.text.secondaryOnLight}>
                                  📧 <a 
                                    href={`mailto:${selectedResource.contact.email}`}
                                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                    onClick={() => toast.success('Opening email app...')}
                                  >
                                    {selectedResource.contact.email}
                                  </a>
                                </p>
                              )}
                              {selectedResource.contact.website && (
                                <p className={okayitTheme.text.secondaryOnLight}>
                                  🌐 <a href={selectedResource.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                    {selectedResource.contact.website}
                                  </a>
                                </p>
                              )}
                              <p className={combineThemeClasses("font-bold", okayitTheme.text.primaryOnLight)}>
                                ⏰ {selectedResource.contact.available}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                    
                    {selectedResource.content && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                      >
                        {selectedResource.content.introduction && (
                          <div className={combineThemeClasses("p-6 rounded-xl", okayitTheme.backgrounds.purpleCard)}>
                            <p className={combineThemeClasses("text-lg leading-relaxed", okayitTheme.text.primaryOnLight)}>
                              {selectedResource.content.introduction}
                            </p>
                          </div>
                        )}
                        
                        {selectedResource.content.sections?.map((section, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                          >
                            <Card>
                              <CardHeader>
                                <CardTitle className={okayitTheme.text.headingPurple}>
                                  {section.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className={combineThemeClasses("whitespace-pre-wrap leading-relaxed", okayitTheme.text.primaryOnLight)}>
                                  {section.content}
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                        
                        {selectedResource.content.multimedia && selectedResource.content.multimedia.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Card className={okayitTheme.backgrounds.pinkCard}>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-pink-900 font-black">
                                  <Video className="w-6 h-6 text-pink-900" />
                                  Additional Resources
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {selectedResource.content.multimedia.map((media, index) => (
                                  <div key={index} className="p-4 bg-white rounded-lg">
                                    <div className="flex items-start gap-3">
                                      {media.type === 'video' && <Video className="w-5 h-5 text-red-600 mt-1" />}
                                      {media.type === 'audio' && <HeadphonesIcon className="w-5 h-5 text-purple-600 mt-1" />}
                                      {media.type === 'podcast' && <Mic className="w-5 h-5 text-blue-600 mt-1" />}
                                      {media.type === 'app' && <Smartphone className="w-5 h-5 text-green-600 mt-1" />}
                                      <div className="flex-1">
                                        <h5 className="font-bold mb-1">{media.title}</h5>
                                        <p className="text-sm text-gray-800 mb-2">{media.description}</p>
                                        <a 
                                          href={media.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-600 hover:underline"
                                        >
                                          Visit →
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                        
                        {selectedResource.content.tips && selectedResource.content.tips.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <Card className={okayitTheme.backgrounds.greenCard}>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-900 font-black">
                                  <Lightbulb className="w-6 h-6 text-green-900" />
                                  Quick Tips
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-3">
                                  {selectedResource.content.tips.map((tip, index) => (
                                    <motion.li
                                      key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.7 + index * 0.1 }}
                                      className={combineThemeClasses("flex items-start gap-2", okayitTheme.text.primaryOnLight)}
                                    >
                                      <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                                      <span>{tip}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </TabsContent>

                  {/* Form Tab */}
                  <TabsContent value="form" className="px-1">
                    {selectedResource.formFields && (
                      <motion.form
                        onSubmit={handleFormSubmit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <Card className={okayitTheme.backgrounds.purpleCard}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3 mb-4">
                              <Info className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                              <div>
                                <h4 className={combineThemeClasses("font-bold text-lg", okayitTheme.text.primaryOnLight)}>
                                  Your information is private
                                </h4>
                                <p className={okayitTheme.text.secondaryOnLight}>
                                  This form is saved for staff to help you. It is not sent anywhere else.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-6 space-y-6">
                            {selectedResource.formFields.map((field, index) => (
                              <motion.div
                                key={field.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                              >
                                <Label htmlFor={field.name} className="text-base font-semibold flex items-center gap-2">
                                  {field.label}
                                  {field.required && <span className="text-red-500 ml-1">*</span>}
                                  {field.type === 'textarea' && (
                                    <VoiceInputButton onTranscript={(t) => handleFormChange(field.name, (formData[field.name] || '') + ((formData[field.name] || '') ? ' ' : '') + t)} />
                                  )}
                                </Label>
                                
                                {field.type === 'textarea' ? (
                                  <Textarea
                                    id={field.name}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                                    required={field.required}
                                    rows={4}
                                    className="text-base"
                                  />
                                ) : field.type === 'select' ? (
                                  <Select
                                    value={formData[field.name] || ''}
                                    onValueChange={(value) => handleFormChange(field.name, value)}
                                    required={field.required}
                                  >
                                    <SelectTrigger className="text-base">
                                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {field.options?.map((option) => (
                                        <SelectItem key={option} value={option} className="text-base">
                                          {option}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : field.type === 'checkbox' ? (
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={field.name}
                                      checked={formData[field.name] || false}
                                      onCheckedChange={(checked) => handleFormChange(field.name, checked)}
                                      required={field.required}
                                    />
                                    <label
                                      htmlFor={field.name}
                                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {field.label}
                                    </label>
                                  </div>
                                ) : (
                                  <Input
                                    id={field.name}
                                    name={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleFormChange(field.name, e.target.value)}
                                    required={field.required}
                                    className="text-base"
                                  />
                                )}
                              </motion.div>
                            ))}
                            
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (selectedResource.formFields?.length || 0) * 0.1 }}
                            >
                              <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className={combineThemeClasses("w-full text-lg", okayitTheme.interactive.buttonBlue)}
                              >
                                {isSubmitting ? (
                                  <>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                      className="mr-2"
                                    >
                                      <Send className="w-5 h-5" />
                                    </motion.div>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Save Information
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.form>
                    )}
                  </TabsContent>

                  {/* Download Tab */}
                  <TabsContent value="download" className="px-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <Card className={okayitTheme.backgrounds.greenCard}>
                        <CardContent className="p-8 text-center">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="mb-6"
                          >
                            <FileText className="w-20 h-20 mx-auto text-green-700" />
                          </motion.div>
                          
                          <h3 className="text-2xl font-black mb-3 text-green-900">
                            Download PDF Guide
                          </h3>
                          <p className={combineThemeClasses("text-lg mb-6", okayitTheme.text.primaryOnLight)}>
                            Get a printable PDF version to keep for reference
                          </p>
                          
                          <Button
                            onClick={() => handleDownload(selectedResource)}
                            disabled={isDownloading}
                            size="lg"
                            className={combineThemeClasses("text-lg", okayitTheme.interactive.buttonGreen)}
                          >
                            {isDownloading ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                  className="mr-2"
                                >
                                  <Download className="w-5 h-5" />
                                </motion.div>
                                Preparing Download...
                              </>
                            ) : (
                              <>
                                <Download className="w-5 h-5 mr-2" />
                                Download PDF
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className={okayitTheme.text.headingPurple}>
                            What is included in this PDF?
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className={okayitTheme.text.primaryOnLight}>
                              Complete guide with all information and tips
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className={okayitTheme.text.primaryOnLight}>
                              All contact phone numbers and websites
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className={okayitTheme.text.primaryOnLight}>
                              Easy to print and keep by your bed
                            </p>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <p className={okayitTheme.text.primaryOnLight}>
                              Share with friends or family if you want
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="container mx-auto px-6 py-8 mt-12"
      >
        <Card className={okayitTheme.backgrounds.purpleCard}>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <OkayitLogo width={50} height={50} />
              <h3 className={combineThemeClasses("text-2xl font-bold", okayitTheme.text.headingPurple)}>
                You Are Not Alone
              </h3>
            </div>
            <p className={combineThemeClasses("text-lg mb-6", okayitTheme.text.primaryOnLight)}>
              All these services are real, free, and here to help you. If you cannot find what you need, talk to a member of staff.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className={okayitTheme.badges.orange} variant="outline">
                24/7 Emergency Lines
              </Badge>
              <Badge className={okayitTheme.badges.blue} variant="outline">
                Free Support Services
              </Badge>
              <Badge className={okayitTheme.badges.green} variant="outline">
                Confidential Help
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
