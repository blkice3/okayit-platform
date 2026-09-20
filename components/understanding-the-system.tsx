'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Scale, Shield, Network, BookOpen, FileCheck, Heart,
  Briefcase, Phone, Building2, ClipboardCheck, Award, AlertCircle,
  CheckCircle, Info, ExternalLink, ChevronRight, Search, Filter,
  Download, Printer, Share2, ArrowLeft, Sparkles, Home, Calendar,
  MessageSquare, ChevronLeft, Clock, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import OKAYiTLogo from './okayit-logo';
import { toast } from 'sonner';

interface UnderstandingTheSystemProps {
  onBack: () => void;
}

// Stakeholder data
const STAKEHOLDERS = [
  {
    id: 'internal-team',
    category: 'Your Care Home Team',
    icon: Users,
    color: 'from-purple-500 to-indigo-600',
    members: [
      {
        role: 'Registered Manager',
        description: 'Overall responsible person for the home. Makes sure everything runs smoothly and meets all standards.',
        responsibilities: ['Strategic planning', 'Regulatory compliance', 'Quality assurance', 'Staff management'],
        whenToContact: 'For serious concerns, complaints, or important decisions about your care'
      },
      {
        role: 'Deputy Manager',
        description: 'Supports the manager and steps in when they\'re not available. Oversees daily operations.',
        responsibilities: ['Day-to-day operations', 'Staff supervision', 'Care plan reviews', 'Incident management'],
        whenToContact: 'For operational issues or when the manager is unavailable'
      },
      {
        role: 'Team Leader',
        description: 'Leads the care team on their shift. Coordinates activities and supports staff.',
        responsibilities: ['Shift coordination', 'Staff support', 'Activity planning', 'Direct care oversight'],
        whenToContact: 'During their shift for immediate support or guidance'
      },
      {
        role: 'Support Workers',
        description: 'Your everyday support team. Help with daily living, activities, and emotional wellbeing.',
        responsibilities: ['Daily care support', 'Activity facilitation', 'Emotional support', 'Practical assistance'],
        whenToContact: 'Anytime you need help, want to talk, or have questions'
      }
    ]
  },
  {
    id: 'external-professionals',
    category: 'External Professionals',
    icon: Briefcase,
    color: 'from-blue-500 to-cyan-600',
    members: [
      {
        role: 'Social Worker',
        description: 'Your allocated social worker from the Local Authority. Responsible for your care plan and placement.',
        responsibilities: ['Care planning', 'Statutory visits', 'Review meetings', 'Advocacy for your needs'],
        whenToContact: 'For care plan reviews, placement concerns, or major life decisions'
      },
      {
        role: 'Independent Reviewing Officer (IRO)',
        description: 'Independent person who chairs your review meetings and ensures your care is appropriate.',
        responsibilities: ['Chair review meetings', 'Monitor care plan', 'Challenge decisions if needed', 'Ensure voice is heard'],
        whenToContact: 'If you\'re unhappy with decisions or your care plan'
      },
      {
        role: 'CAMHS Worker',
        description: 'Mental health professional who can provide therapy and emotional support.',
        responsibilities: ['Mental health assessment', 'Therapy sessions', 'Crisis support', 'Treatment planning'],
        whenToContact: 'For mental health concerns, therapy needs, or emotional difficulties'
      },
      {
        role: 'Education Professional',
        description: 'Could be a teacher, education coordinator, or special educational needs coordinator.',
        responsibilities: ['Education planning', 'School liaison', 'Academic support', 'Career guidance'],
        whenToContact: 'For school issues, education plans, or academic support'
      },
      {
        role: 'Youth Advisor/Personal Advisor',
        description: 'Supports young people aged 16+ with transition to independence.',
        responsibilities: ['Independence skills', 'Housing support', 'Employment guidance', 'Pathway planning'],
        whenToContact: 'When thinking about your future, leaving care, or independence'
      }
    ]
  },
  {
    id: 'regulatory-bodies',
    category: 'Regulatory Bodies & Inspectors',
    icon: Building2,
    color: 'from-orange-500 to-red-600',
    members: [
      {
        role: 'Ofsted Inspector',
        description: 'Inspects children\'s homes to ensure they meet legal standards and provide good care.',
        responsibilities: ['Regular inspections', 'Standards monitoring', 'Report publishing', 'Rating homes'],
        whenToContact: 'You can speak to them during inspections or contact Ofsted directly with concerns'
      },
      {
        role: 'Regulation 44 Visitor',
        description: 'Independent person who visits monthly to check the home and speak with young people.',
        responsibilities: ['Monthly visits', 'Speaking with residents', 'Checking records', 'Independent reporting'],
        whenToContact: 'During their monthly visit - they should ask to speak with you'
      },
      {
        role: 'Local Authority Quality Assurance',
        description: 'Local council team that monitors placements and ensures quality.',
        responsibilities: ['Placement monitoring', 'Quality checks', 'Contract compliance', 'Issue resolution'],
        whenToContact: 'Through your social worker if you have concerns about the home'
      }
    ]
  },
  {
    id: 'advocacy-support',
    category: 'Advocacy & Rights Support',
    icon: Scale,
    color: 'from-green-500 to-emerald-600',
    members: [
      {
        role: 'Independent Advocate',
        description: 'Independent person who speaks up for you and helps ensure your voice is heard.',
        responsibilities: ['Support in meetings', 'Help express views', 'Explain rights', 'Support complaints'],
        whenToContact: 'When you need someone independent to support you or speak up for you'
      },
      {
        role: 'Children\'s Rights Officer',
        description: 'Local Authority officer who ensures children\'s rights are upheld.',
        responsibilities: ['Rights education', 'Complaints support', 'Advocacy coordination', 'Policy monitoring'],
        whenToContact: 'If your rights aren\'t being respected or you need help with a complaint'
      },
      {
        role: 'Ofsted Complaints Team',
        description: 'Team that handles concerns about children\'s homes that haven\'t been resolved.',
        responsibilities: ['Investigate complaints', 'Regulatory action', 'Safeguarding concerns', 'Standards enforcement'],
        whenToContact: 'If serious concerns haven\'t been addressed by the home or Local Authority'
      }
    ]
  }
];

// Legislation data
const LEGISLATION = [
  {
    id: 'childrens-act',
    title: 'Children Act 1989 & 2004',
    category: 'Primary Legislation',
    icon: Scale,
    color: 'from-blue-600 to-indigo-600',
    summary: 'The main law that sets out duties and powers for local authorities and courts to keep children safe and promote their welfare.',
    keyPoints: [
      'Your welfare is the paramount consideration',
      'You should be kept with your family if safe and appropriate',
      'Local authority has a duty to look after you if needed',
      'Your views should be taken into account',
      'Services should meet your individual needs'
    ],
    relevance: 'This is the foundation of all children\'s social care law in England and Wales.',
    moreInfo: 'https://www.legislation.gov.uk/ukpga/1989/41/contents'
  },
  {
    id: 'care-standards-act',
    title: 'Care Standards Act 2000',
    category: 'Care Regulation',
    icon: Shield,
    color: 'from-purple-600 to-pink-600',
    summary: 'Establishes standards for care homes and creates Ofsted as the regulatory body.',
    keyPoints: [
      'Sets minimum standards for children\'s homes',
      'Creates registration and inspection system',
      'Establishes Ofsted as regulator',
      'Defines care home requirements',
      'Protection and safeguarding standards'
    ],
    relevance: 'This law ensures your home meets specific standards and is regularly inspected.',
    moreInfo: 'https://www.legislation.gov.uk/ukpga/2000/14/contents'
  },
  {
    id: 'children-homes-regs',
    title: 'Children\'s Homes Regulations 2015',
    category: 'Detailed Standards',
    icon: FileCheck,
    color: 'from-orange-600 to-red-600',
    summary: 'Specific regulations that children\'s homes must follow, including quality standards.',
    keyPoints: [
      'Daily operation requirements',
      'Staffing qualifications and ratios',
      'Health and safety standards',
      'Education and leisure provisions',
      'Safeguarding procedures'
    ],
    relevance: 'These are the specific rules your home must follow every day.',
    moreInfo: 'https://www.gov.uk/government/publications/childrens-homes-regulations-including-quality-standards'
  },
  {
    id: 'uncrc',
    title: 'UN Convention on the Rights of the Child (UNCRC)',
    category: 'International Rights',
    icon: Heart,
    color: 'from-pink-600 to-rose-600',
    summary: 'International treaty that sets out the fundamental rights of all children and young people.',
    keyPoints: [
      'Right to life, survival and development',
      'Right to protection from harm',
      'Right to participate in decisions',
      'Right to have your views heard',
      'Right to education, health, and leisure'
    ],
    relevance: 'These are your universal rights recognized by most countries in the world.',
    moreInfo: 'https://www.unicef.org.uk/what-we-do/un-convention-child-rights/'
  },
  {
    id: 'care-planning-regs',
    title: 'Care Planning Regulations 2010',
    category: 'Care Planning',
    icon: ClipboardCheck,
    color: 'from-teal-600 to-cyan-600',
    summary: 'Regulations about how your care should be planned, reviewed, and recorded.',
    keyPoints: [
      'You must have a care plan',
      'Regular reviews are required',
      'Your views must be sought',
      'Records must be kept properly',
      'Transition planning requirements'
    ],
    relevance: 'Ensures you have a proper care plan that\'s reviewed regularly with your involvement.',
    moreInfo: 'https://www.legislation.gov.uk/uksi/2010/959/contents/made'
  },
  {
    id: 'human-rights-act',
    title: 'Human Rights Act 1998',
    category: 'Fundamental Rights',
    icon: Scale,
    color: 'from-indigo-600 to-purple-600',
    summary: 'Makes the European Convention on Human Rights part of UK law.',
    keyPoints: [
      'Right to life',
      'Freedom from torture and inhuman treatment',
      'Right to privacy and family life',
      'Freedom of expression',
      'Freedom from discrimination'
    ],
    relevance: 'These fundamental rights apply to everyone, including you in care.',
    moreInfo: 'https://www.equalityhumanrights.com/en/human-rights/human-rights-act'
  }
];

// Standards and inspection data
const STANDARDS = [
  {
    id: 'ofsted',
    name: 'Ofsted Inspection Framework',
    icon: Award,
    color: 'from-blue-600 to-indigo-600',
    description: 'Ofsted inspects and rates children\'s homes based on how well they care for children.',
    ratings: [
      { level: 'Outstanding', description: 'Excellent care that helps children thrive' },
      { level: 'Good', description: 'Good quality care that meets children\'s needs' },
      { level: 'Requires Improvement', description: 'Care needs to improve in some areas' },
      { level: 'Inadequate', description: 'Serious concerns about quality of care' }
    ],
    whatTheyLookAt: [
      'Overall experiences and progress of children',
      'How well children are helped and protected',
      'The effectiveness of leaders and managers',
      'Quality of care provided',
      'Staff knowledge and training',
      'Health, education, and wellbeing support'
    ],
    yourRole: 'Inspectors should speak with you during inspections. You can share your honest views about living in the home.',
    frequency: 'At least once a year, sometimes more often',
    moreInfo: 'https://www.gov.uk/government/organisations/ofsted'
  },
  {
    id: 'quality-standards',
    name: 'Quality Standards',
    icon: CheckCircle,
    color: 'from-green-600 to-emerald-600',
    description: 'Nine quality standards that all children\'s homes must meet.',
    standards: [
      {
        number: 1,
        title: 'The quality and purpose of care',
        summary: 'Care that meets your individual needs and helps you develop'
      },
      {
        number: 2,
        title: 'Your views, wishes and feelings',
        summary: 'Your views shape your care and day-to-day life'
      },
      {
        number: 3,
        title: 'Education',
        summary: 'Support and encouragement to achieve educational goals'
      },
      {
        number: 4,
        title: 'Health and wellbeing',
        summary: 'Physical and emotional health needs are met'
      },
      {
        number: 5,
        title: 'Positive relationships',
        summary: 'Support to build and maintain positive relationships'
      },
      {
        number: 6,
        title: 'Protection from harm',
        summary: 'Kept safe from harm and risk'
      },
      {
        number: 7,
        title: 'Leadership and management',
        summary: 'Home is well run by skilled and experienced leaders'
      },
      {
        number: 8,
        title: 'Care planning',
        summary: 'Clear plan for your care that is regularly reviewed'
      },
      {
        number: 9,
        title: 'Staff',
        summary: 'Enough skilled and trained staff to meet your needs'
      }
    ],
    yourRole: 'These standards are designed to ensure you receive good care. If you feel any aren\'t being met, speak up.',
    moreInfo: 'https://www.gov.uk/government/publications/childrens-homes-regulations-including-quality-standards'
  }
];

// Rights data
const RIGHTS = [
  {
    id: 'core-rights',
    category: 'Your Core Rights in Care',
    icon: Heart,
    color: 'from-pink-600 to-rose-600',
    rights: [
      {
        right: 'To be safe',
        description: 'You have the right to feel safe and be protected from harm, abuse, and neglect.',
        howToExercise: 'Tell staff, your social worker, or call Childline if you don\'t feel safe',
        whoEnforces: 'Care home staff, Local Authority, Ofsted, Police'
      },
      {
        right: 'To be heard',
        description: 'Your views, wishes, and feelings must be listened to and taken seriously.',
        howToExercise: 'Speak up in meetings, complete feedback forms, talk to your advocate',
        whoEnforces: 'IRO, Social Worker, Advocate, Care home managers'
      },
      {
        right: 'To privacy',
        description: 'You have the right to privacy, including your own space and confidential conversations.',
        howToExercise: 'Request private time/space, ask for confidential conversations',
        whoEnforces: 'Care home staff must respect this (with appropriate safeguarding balance)'
      },
      {
        right: 'To education',
        description: 'You have the right to education that meets your needs and helps you achieve.',
        howToExercise: 'Attend school, request additional support, discuss education in reviews',
        whoEnforces: 'Local Authority, School, Education professionals'
      },
      {
        right: 'To healthcare',
        description: 'You have the right to register with a GP, dentist, and receive all necessary healthcare.',
        howToExercise: 'Request health appointments, discuss health needs with staff',
        whoEnforces: 'Care home staff, NHS, Social Worker'
      },
      {
        right: 'To contact with family',
        description: 'You have the right to contact with family (unless court says otherwise) and to maintain important relationships.',
        howToExercise: 'Request contact arrangements, discuss in care plan reviews',
        whoEnforces: 'Social Worker, Care home, IRO (following court orders)'
      },
      {
        right: 'To complain',
        description: 'You have the right to complain if you\'re unhappy and have your complaint taken seriously.',
        howToExercise: 'Use home\'s complaints process, contact Ofsted, speak to advocate',
        whoEnforces: 'Care home complaints system, Local Authority, Ofsted'
      },
      {
        right: 'To advocate',
        description: 'You have the right to an independent advocate to support you and speak up for you.',
        howToExercise: 'Ask staff, social worker, or IRO to arrange an advocate for you',
        whoEnforces: 'Local Authority must provide this'
      },
      {
        right: 'To participate',
        description: 'You have the right to participate in decisions about your care and daily life.',
        howToExercise: 'Attend reviews, share views, participate in house meetings',
        whoEnforces: 'IRO, Social Worker, Care home staff'
      },
      {
        right: 'To preparation for independence',
        description: 'You have the right to support preparing for adult life and independence.',
        howToExercise: 'Discuss pathway plan, request life skills support, talk to Personal Advisor',
        whoEnforces: 'Leaving Care Team, Personal Advisor, Care home'
      }
    ]
  },
  {
    id: 'legal-protections',
    category: 'Legal Protections',
    icon: Shield,
    color: 'from-blue-600 to-indigo-600',
    rights: [
      {
        right: 'Protection from discrimination',
        description: 'You\'re protected by the Equality Act 2010 from discrimination based on protected characteristics.',
        howToExercise: 'Report any discrimination to staff, advocate, or Local Authority',
        whoEnforces: 'Care home, Local Authority, Equality and Human Rights Commission'
      },
      {
        right: 'Data protection',
        description: 'Your personal information must be kept confidential and secure (GDPR and Data Protection Act).',
        howToExercise: 'Request to see your records, question who has access to your information',
        whoEnforces: 'Care home (Data Controller), ICO (Information Commissioner\'s Office)'
      },
      {
        right: 'To challenge decisions',
        description: 'You can challenge decisions about your care through formal processes.',
        howToExercise: 'Use complaints process, request IRO escalation, seek judicial review',
        whoEnforces: 'IRO, Local Authority, Courts'
      }
    ]
  }
];

// Important Meetings Data
const IMPORTANT_MEETINGS = [
  {
    id: 'lac-review',
    name: 'LAC Review (Looked After Child Review)',
    icon: Users,
    color: 'from-purple-600 to-indigo-600',
    frequency: 'First at 20 days, then at 3 months, then every 6 months',
    purpose: 'A formal meeting to review your care plan and make sure everything is working well for you.',
    whoAttends: ['You (most important!)', 'Your Social Worker', 'IRO (chairs the meeting)', 'Care Home Staff', 'Parents/Family (if appropriate)', 'Other professionals involved in your care'],
    yourRole: 'This meeting is about YOU. You should share your views about how things are going, what\'s working, and what you\'d like to change.',
    tips: ['You can request a private meeting with the IRO before or after', 'You can bring someone to support you', 'You can write down your views if speaking is difficult', 'You can ask questions about anything']
  },
  {
    id: 'pep-meeting',
    name: 'PEP Meeting (Personal Education Plan)',
    icon: BookOpen,
    color: 'from-blue-600 to-cyan-600',
    frequency: 'At least 3 times per year (each school term)',
    purpose: 'To plan your education and make sure you\'re getting the support you need at school.',
    whoAttends: ['You', 'Designated Teacher', 'Social Worker', 'Care Home Staff', 'Virtual School Representative'],
    yourRole: 'Share how school is going, what subjects you enjoy, what you find difficult, and what support would help you.',
    tips: ['Talk about your aspirations and what you want to achieve', 'Discuss any extra help you need', 'Ask about Pupil Premium Plus funding for activities or tutoring']
  },
  {
    id: 'pathway-planning',
    name: 'Pathway Planning Meeting (16+)',
    icon: Award,
    color: 'from-green-600 to-emerald-600',
    frequency: 'Starts at 16, reviewed regularly until 21 (or 25)',
    purpose: 'To plan for your future - leaving care, accommodation, education, employment, and independence.',
    whoAttends: ['You', 'Personal Advisor', 'Social Worker', 'Care Home Staff', 'Education/Employment representatives'],
    yourRole: 'This is YOUR plan for YOUR future. Share your goals, hopes, and what support you need to achieve them.',
    tips: ['Start thinking about where you want to live', 'Consider education and career options', 'Discuss life skills you want to learn', 'Ask about your leaving care entitlements']
  },
  {
    id: 'house-meeting',
    name: 'House Meeting / Young People\'s Meeting',
    icon: Home,
    color: 'from-orange-600 to-red-600',
    frequency: 'Usually weekly or fortnightly',
    purpose: 'A chance to discuss what\'s happening in the home, plan activities, and share your views.',
    whoAttends: ['All young people in the home', 'Staff members'],
    yourRole: 'Share ideas, raise concerns, and help make decisions about life in the home.',
    tips: ['Suggest activities you\'d like to do', 'Raise any concerns about the home', 'Help plan menus and outings', 'Support each other']
  },
  {
    id: 'key-worker-session',
    name: 'Key Worker Sessions',
    icon: Heart,
    color: 'from-pink-600 to-rose-600',
    frequency: 'At least weekly',
    purpose: 'One-to-one time with your key worker to talk about how you\'re doing and any support you need.',
    whoAttends: ['You', 'Your Key Worker'],
    yourRole: 'Use this time to talk about anything - your feelings, concerns, achievements, or just to chat.',
    tips: ['Be honest about how you\'re feeling', 'Discuss any worries or problems', 'Celebrate your achievements', 'Ask for help when you need it']
  },
  {
    id: 'placement-planning',
    name: 'Placement Planning Meeting',
    icon: ClipboardCheck,
    color: 'from-teal-600 to-cyan-600',
    frequency: 'Within 72 hours of moving in, then as needed',
    purpose: 'To make sure everyone understands your needs and how the placement will work.',
    whoAttends: ['You', 'Social Worker', 'Care Home Manager', 'Parents/Family (if appropriate)'],
    yourRole: 'Share what\'s important to you, what routines you have, and what support you need.',
    tips: ['Talk about your likes and dislikes', 'Discuss any health or dietary needs', 'Share your worries about the move', 'Ask questions about the home']
  }
];

// Important Terminology
const CARE_TERMINOLOGY = [
  {
    term: 'Looked After Child (LAC)',
    definition: 'A child who is in the care of the Local Authority, either through a care order or with parents\' agreement.',
    alsoKnownAs: ['Child in Care', 'CIC', 'Child Looked After (CLA)']
  },
  {
    term: 'Care Order',
    definition: 'A court order that gives the Local Authority shared parental responsibility for you.',
    alsoKnownAs: ['Section 31 Order']
  },
  {
    term: 'Section 20',
    definition: 'When you\'re in care with your parents\' agreement, without a court order.',
    alsoKnownAs: ['Voluntary Accommodation', 'Accommodated']
  },
  {
    term: 'IRO (Independent Reviewing Officer)',
    definition: 'An independent person who chairs your LAC reviews and makes sure your care is appropriate.',
    alsoKnownAs: ['Reviewing Officer']
  },
  {
    term: 'Care Plan',
    definition: 'The document that sets out how you will be cared for and what support you\'ll receive.',
    alsoKnownAs: ['Placement Plan']
  },
  {
    term: 'Pathway Plan',
    definition: 'Your plan for the future when you\'re 16+, covering housing, education, employment, and independence.',
    alsoKnownAs: ['Leaving Care Plan']
  },
  {
    term: 'Personal Advisor (PA)',
    definition: 'Your allocated worker when you\'re 16+ who helps you prepare for independence and leaving care.',
    alsoKnownAs: ['Leaving Care Worker']
  },
  {
    term: 'Care Leaver',
    definition: 'Someone who was in care at or after age 16 and is now over 18.',
    alsoKnownAs: ['Former Looked After Child']
  },
  {
    term: 'Virtual School',
    definition: 'A team in the Local Authority that supports the education of all looked after children.',
    alsoKnownAs: ['Virtual School Head (VSH)']
  },
  {
    term: 'Pupil Premium Plus',
    definition: 'Extra funding schools receive to support looked after children\'s education.',
    alsoKnownAs: ['PP+', 'LAC Pupil Premium']
  },
  {
    term: 'Regulation 44 Visit',
    definition: 'An independent person visits the home monthly to check everything is okay.',
    alsoKnownAs: ['Reg 44', 'Independent Visitor']
  },
  {
    term: 'Ofsted',
    definition: 'The government body that inspects and rates children\'s homes.',
    alsoKnownAs: ['Office for Standards in Education']
  },
  {
    term: 'CAMHS',
    definition: 'Child and Adolescent Mental Health Services - provides mental health support.',
    alsoKnownAs: ['Mental Health Services']
  },
  {
    term: 'Advocate',
    definition: 'An independent person who helps you express your views and ensures you\'re heard.',
    alsoKnownAs: ['Independent Advocate']
  },
  {
    term: 'Placement',
    definition: 'Where you live while in care - could be foster care, residential home, or kinship care.',
    alsoKnownAs: ['Care Placement']
  },
  {
    term: 'Contact',
    definition: 'Arranged time to see or communicate with family members.',
    alsoKnownAs: ['Family Time', 'Visits']
  },
  {
    term: 'Key Worker',
    definition: 'A staff member specially allocated to support you and be your main point of contact.',
    alsoKnownAs: ['Named Worker']
  },
  {
    term: 'Staying Put',
    definition: 'An arrangement allowing you to stay with foster carers after you turn 18.',
    alsoKnownAs: []
  },
  {
    term: 'Corporate Parent',
    definition: 'The Local Authority acting as a "parent" with responsibilities to look after you.',
    alsoKnownAs: []
  },
  {
    term: 'Local Offer',
    definition: 'The support and services your Local Authority provides to care leavers.',
    alsoKnownAs: ['Care Leaver Offer']
  }
];

// System map data
const SYSTEM_MAP = {
  layers: [
    {
      level: 'You',
      description: 'At the center - you are the most important person',
      color: 'from-pink-500 to-rose-500'
    },
    {
      level: 'Daily Support',
      description: 'Care home staff who support you every day',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      level: 'Planning & Oversight',
      description: 'Social Worker, IRO, and professionals planning your care',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      level: 'Quality & Safeguarding',
      description: 'Ofsted, Local Authority QA, and regulators ensuring standards',
      color: 'from-orange-500 to-red-500'
    },
    {
      level: 'Legislation & Policy',
      description: 'Laws and regulations that set the framework',
      color: 'from-green-500 to-emerald-500'
    }
  ],
  howItWorks: [
    'Laws and regulations create the rules everyone must follow',
    'Ofsted and regulators check homes are following the rules',
    'Your social worker and IRO plan and review your care',
    'Care home staff provide your daily support and care',
    'You are involved in all decisions about your life',
    'Everyone works together to help you thrive'
  ]
};

// Interactive System Map Component
const INTERACTIVE_NODES = [
  {
    id: 'you',
    label: 'YOU',
    sublabel: 'At the Center',
    description: 'You are the most important person in this whole system. Everything and everyone else exists to support you.',
    color: 'from-pink-500 to-rose-600',
    icon: Heart,
    layer: 0,
    details: [
      'Your voice matters most',
      'You should be involved in all decisions',
      'Your wellbeing is the priority',
      'You have rights that must be respected'
    ]
  },
  {
    id: 'registered-manager',
    label: 'Registered Manager',
    sublabel: 'Home Leadership',
    description: 'The person in charge of your care home. They make sure everything runs smoothly and meets all standards.',
    color: 'from-purple-600 to-indigo-600',
    icon: Award,
    layer: 1,
    details: [
      'Overall responsibility for the home',
      'Makes important decisions',
      'Handles complaints and concerns',
      'Ensures staff are properly trained'
    ]
  },
  {
    id: 'deputy-manager',
    label: 'Deputy Manager',
    sublabel: 'Operations',
    description: 'Supports the manager and steps in when needed. Oversees day-to-day running of the home.',
    color: 'from-purple-500 to-violet-600',
    icon: Users,
    layer: 1,
    details: [
      'Day-to-day operations',
      'Staff supervision',
      'Care plan reviews',
      'Incident management'
    ]
  },
  {
    id: 'team-leader',
    label: 'Team Leader',
    sublabel: 'Shift Coordination',
    description: 'Leads the care team on their shift. Coordinates activities and supports other staff.',
    color: 'from-indigo-500 to-blue-600',
    icon: Shield,
    layer: 1,
    details: [
      'Shift coordination',
      'Staff support',
      'Activity planning',
      'Direct care oversight'
    ]
  },
  {
    id: 'support-workers',
    label: 'Support Workers',
    sublabel: 'Daily Care',
    description: 'Your everyday support team. They help with daily living, activities, and emotional wellbeing.',
    color: 'from-blue-500 to-cyan-600',
    icon: Heart,
    layer: 1,
    details: [
      'Daily care support',
      'Activity facilitation',
      'Emotional support',
      'Practical assistance'
    ]
  },
  {
    id: 'social-worker',
    label: 'Social Worker',
    sublabel: 'Care Planning',
    description: 'Your allocated social worker from the Local Authority. Responsible for your care plan and placement.',
    color: 'from-blue-600 to-teal-600',
    icon: ClipboardCheck,
    layer: 2,
    details: [
      'Care planning',
      'Statutory visits',
      'Review meetings',
      'Advocacy for your needs'
    ]
  },
  {
    id: 'iro',
    label: 'IRO',
    sublabel: 'Independent Review',
    description: 'Independent Reviewing Officer who chairs your review meetings and ensures your care is appropriate.',
    color: 'from-teal-500 to-emerald-600',
    icon: BookOpen,
    layer: 2,
    details: [
      'Chair review meetings',
      'Monitor care plan',
      'Challenge decisions if needed',
      'Ensure your voice is heard'
    ]
  },
  {
    id: 'ofsted',
    label: 'Ofsted',
    sublabel: 'Inspections',
    description: 'Inspects children\'s homes to ensure they meet legal standards and provide good care.',
    color: 'from-orange-500 to-red-600',
    icon: Award,
    layer: 3,
    details: [
      'Regular inspections',
      'Standards monitoring',
      'Report publishing',
      'Rating homes'
    ]
  },
  {
    id: 'advocate',
    label: 'Advocate',
    sublabel: 'Your Voice',
    description: 'Independent person who speaks up for you and helps ensure your voice is heard.',
    color: 'from-green-500 to-emerald-600',
    icon: Scale,
    layer: 2,
    details: [
      'Support in meetings',
      'Help express views',
      'Explain rights',
      'Support complaints'
    ]
  },
  {
    id: 'legislation',
    label: 'Laws & Rights',
    sublabel: 'Protection',
    description: 'The laws that protect you and set out how your care should work.',
    color: 'from-emerald-600 to-green-700',
    icon: Scale,
    layer: 3,
    details: [
      'Children Act 1989 & 2004',
      'UN Rights of the Child',
      'Care Standards Act',
      'Human Rights Act'
    ]
  }
];

function SystemMapInteractive() {
  const [selectedNode, setSelectedNode] = useState<typeof INTERACTIVE_NODES[0] | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Animate through phases
  React.useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getNodePosition = (node: typeof INTERACTIVE_NODES[0], index: number, totalInLayer: number) => {
    if (node.layer === 0) return { x: 50, y: 50 };
    
    const layerRadius = node.layer * 28;
    const nodesInLayer = INTERACTIVE_NODES.filter(n => n.layer === node.layer);
    const nodeIndex = nodesInLayer.findIndex(n => n.id === node.id);
    const angleOffset = node.layer === 1 ? -90 : (node.layer === 2 ? -60 : -30);
    const angle = angleOffset + (nodeIndex * (360 / nodesInLayer.length));
    const radians = (angle * Math.PI) / 180;
    
    return {
      x: 50 + layerRadius * Math.cos(radians),
      y: 50 + layerRadius * Math.sin(radians)
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 space-y-6"
    >
      {/* Intro Card */}
      <Card className="border-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            >
              <Network className="w-6 h-6 text-white" />
            </motion.div>
          ))}
        </div>
        <CardContent className="p-8 relative z-10">
          <div className="flex items-start gap-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex-shrink-0"
            >
              <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                <Network className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">
                The System Map: How It All Fits Together
              </h2>
              <p className="text-white/95 text-lg leading-relaxed">
                <span className="font-bold">👆 Tap any role</span> to learn more about who they are and how they help you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive System Map */}
      <Card className="border border-purple-200 dark:border-purple-300 shadow-lg bg-gradient-to-br from-white via-purple-50 to-indigo-50 dark:from-purple-950/20 dark:via-purple-100/10 dark:to-indigo-100/10 overflow-hidden">
        <CardContent className="p-4 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Interactive Care System Map
            </h3>
            <p className="text-gray-900 dark:text-white mt-2">
              Click on any circle to learn about that role
            </p>
          </div>
          
          {/* Map Container */}
          <div className="relative mx-auto" style={{ width: '100%', maxWidth: '700px', height: '500px' }}>
            {/* Animated Ring Connections */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="ringGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
                <linearGradient id="ringGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="ringGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              {[1, 2, 3].map((layer) => (
                <motion.circle
                  key={layer}
                  cx="50"
                  cy="50"
                  r={layer * 28}
                  fill="none"
                  stroke={`url(#ringGradient${layer})`}
                  strokeWidth="0.5"
                  strokeDasharray={animationPhase === layer ? "2,2" : "4,4"}
                  opacity={0.4}
                  animate={{
                    strokeDashoffset: [0, layer === animationPhase ? 20 : 10],
                    opacity: layer === animationPhase ? 0.8 : 0.3,
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              ))}
              
              {/* Animated Connection Lines to Center */}
              {INTERACTIVE_NODES.filter(n => n.layer === 1).map((node, idx) => {
                const pos = getNodePosition(node, idx, 4);
                return (
                  <motion.line
                    key={`line-${node.id}`}
                    x1="50"
                    y1="50"
                    x2={pos.x}
                    y2={pos.y}
                    stroke="url(#ringGradient1)"
                    strokeWidth="0.3"
                    strokeDasharray="2,2"
                    opacity={hoveredNode === node.id ? 1 : 0.2}
                    animate={{
                      strokeDashoffset: [0, 10],
                    }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {INTERACTIVE_NODES.map((node, idx) => {
              const pos = getNodePosition(node, idx, INTERACTIVE_NODES.length);
              const isCenter = node.layer === 0;
              const isHovered = hoveredNode === node.id;
              const isSelected = selectedNode?.id === node.id;
              const size = isCenter ? 20 : (node.layer === 1 ? 14 : (node.layer === 2 ? 12 : 10));
              const Icon = node.icon;
              
              return (
                <motion.div
                  key={node.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isHovered || isSelected ? 50 : 10 - node.layer,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isHovered || isSelected ? 1.2 : 1, 
                    opacity: 1,
                  }}
                  transition={{ delay: 0.1 * idx, type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(node)}
                >
                  <motion.div
                    className={`rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center text-white shadow-md border border-white dark:border-purple-200/30 transition-all duration-300`}
                    style={{
                      width: `${size}vmin`,
                      height: `${size}vmin`,
                      maxWidth: isCenter ? '120px' : (node.layer === 1 ? '90px' : '70px'),
                      maxHeight: isCenter ? '120px' : (node.layer === 1 ? '90px' : '70px'),
                      minWidth: isCenter ? '80px' : (node.layer === 1 ? '60px' : '50px'),
                      minHeight: isCenter ? '80px' : (node.layer === 1 ? '60px' : '50px'),
                    }}
                    animate={{
                      boxShadow: isCenter ? [
                        '0 0 20px rgba(236, 72, 153, 0.5)',
                        '0 0 40px rgba(168, 85, 247, 0.7)',
                        '0 0 20px rgba(236, 72, 153, 0.5)',
                      ] : (isHovered || isSelected) ? '0 0 30px rgba(168, 85, 247, 0.6)' : '0 4px 20px rgba(0,0,0,0.2)',
                    }}
                    transition={{ duration: isCenter ? 2 : 0.3, repeat: isCenter ? Infinity : 0 }}
                  >
                    <div className="text-center p-1">
                      <Icon className={`mx-auto mb-0.5 ${isCenter ? 'w-8 h-8' : (node.layer === 1 ? 'w-6 h-6' : 'w-5 h-5')}`} />
                      <div className={`font-bold leading-tight ${isCenter ? 'text-sm' : 'text-[10px]'}`}>
                        {node.label}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {isHovered && !isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 p-3 bg-white dark:bg-purple-950/20 rounded-xl shadow-lg border border-purple-200 dark:border-purple-300 z-50"
                        style={{ top: '100%' }}
                      >
                        <p className="text-xs text-gray-900 dark:text-white font-medium text-center">
                          {node.sublabel}
                        </p>
                        <p className="text-[10px] text-purple-600 dark:text-purple-400 text-center mt-1 font-semibold">
                          Click for details →
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { layer: 0, label: 'You (Center)', color: 'from-pink-500 to-rose-500' },
              { layer: 1, label: 'Care Home Team', color: 'from-purple-500 to-indigo-500' },
              { layer: 2, label: 'External Professionals', color: 'from-blue-500 to-cyan-500' },
              { layer: 3, label: 'Regulators & Laws', color: 'from-orange-500 to-green-500' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/80 dark:bg-purple-950/15 border border-gray-200 dark:border-purple-200/30"
              >
                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.color}`} />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Node Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Card className="border border-purple-300 dark:border-purple-300 shadow-lg overflow-hidden">
              <div className={`p-6 bg-gradient-to-r ${selectedNode.color} relative`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                  onClick={() => setSelectedNode(null)}
                >
                  ✕ Close
                </Button>
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                    <selectedNode.icon className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <Badge className="mb-2 bg-white/20 text-white border-white/30 font-bold">
                      {selectedNode.layer === 0 ? 'The Center' : 
                       selectedNode.layer === 1 ? 'Care Home Team' : 
                       selectedNode.layer === 2 ? 'External Professional' : 'Regulator / Law'}
                    </Badge>
                    <h3 className="text-3xl font-black text-white drop-shadow-lg">
                      {selectedNode.label}
                    </h3>
                    <p className="text-white/90 font-medium">{selectedNode.sublabel}</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-5">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-100/10 dark:to-indigo-100/10 p-4 rounded-xl border-l-2 border-purple-500">
                  <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
                    {selectedNode.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Key Points
                  </h4>
                  <div className="grid gap-2">
                    {selectedNode.details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-100/10 rounded-lg border border-green-200 dark:border-green-300"
                      >
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${selectedNode.color}`} />
                        <span className="text-gray-900 dark:text-white font-medium">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {selectedNode.layer > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-100/10 dark:to-cyan-100/10 p-4 rounded-xl border border-blue-200 dark:border-blue-300">
                    <h4 className="font-bold text-blue-700 dark:text-blue-200 mb-2 flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      When to reach out
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {selectedNode.layer === 1 ? 'These are your daily support - you can talk to them anytime!' :
                       selectedNode.layer === 2 ? 'Contact through your social worker or during scheduled visits.' :
                       'They inspect and regulate - you can speak to them during inspections or contact directly with serious concerns.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How It Works */}
      <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-100/10 dark:to-emerald-100/10">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Network className="h-6 w-6 text-green-600" />
            How It All Works Together
          </h3>
          <div className="space-y-3">
            {SYSTEM_MAP.howItWorks.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-start gap-3 bg-white/80 dark:bg-purple-950/15 p-4 rounded-xl hover:shadow-md transition-shadow cursor-default"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
                  {idx + 1}
                </div>
                <p className="text-gray-900 dark:text-white font-medium pt-1">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Takeaway */}
      <Card className="border border-purple-300 dark:border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-100/10 dark:to-indigo-100/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl text-purple-900 dark:text-purple-200">
                Remember: You're at the Center
              </h3>
              <p className="text-purple-700 dark:text-purple-200 leading-relaxed">
                All of these people, laws, and systems exist to support <strong>YOU</strong>. Your wellbeing, safety, and future are what matter most. The whole system is designed to help you thrive. Don't be afraid to ask questions, speak up, or use the support available to you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function UnderstandingTheSystem({ onBack }: UnderstandingTheSystemProps) {
  const [activeTab, setActiveTab] = useState('stakeholders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStakeholder, setSelectedStakeholder] = useState<any>(null);
  const [selectedLegislation, setSelectedLegislation] = useState<any>(null);

  const handlePrint = () => {
    window.print();
    toast.success('Opening print dialog...');
  };

  const handleShare = () => {
    toast.info('You can share this by showing it to someone on your screen.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Compact Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold hover:text-purple-800 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Menu
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-900">Your Rights</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handlePrint} className="text-xs text-gray-500 hover:text-gray-700 p-1">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          {/* Tab Navigation - compact */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              { value: 'stakeholders', label: "Who's Who", icon: Users },
              { value: 'meetings', label: 'Meetings', icon: Calendar },
              { value: 'terminology', label: 'Terms', icon: BookOpen },
              { value: 'rights', label: 'Rights', icon: Heart },
              { value: 'legislation', label: 'Laws', icon: Scale },
              { value: 'system-map', label: 'System Map', icon: Network },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === tab.value
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Stakeholders Tab */}
          <TabsContent value="stakeholders" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <Card className="border-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 0.5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeInOut",
                      }}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </motion.div>
                  ))}
                </div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                        <Users className="h-12 w-12 text-white" />
                      </div>
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">
                        Who's Who: Understanding the People Around You
                      </h2>
                      <p className="text-white/95 text-lg leading-relaxed">
                        Lots of people are involved in your care. Here's who they are, what they do, and when to contact them.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-700 dark:text-gray-200" />
                <Input
                  placeholder="Search roles, responsibilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Stakeholder Categories */}
              <div className="space-y-6">
                {STAKEHOLDERS.map((category, idx) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: idx * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="overflow-hidden border-2 hover:border-purple-300 dark:hover:border-purple-700 shadow-lg hover:shadow-lg transition-all duration-300">
                      <div className={`p-5 bg-gradient-to-r ${category.color} relative overflow-hidden`}>
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            backgroundPosition: ['0% 0%', '100% 100%'],
                          }}
                          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
                          style={{
                            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
                            backgroundSize: '200% 200%',
                          }}
                        />
                        <div className="flex items-center gap-3 text-white relative z-10">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <category.icon className="h-8 w-8" />
                          </motion.div>
                          <h3 className="text-2xl font-bold drop-shadow-lg">{category.category}</h3>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                          {category.members.map((member, memberIdx) => (
                            <Dialog key={memberIdx}>
                              <DialogTrigger asChild>
                                <Card className="cursor-pointer hover:shadow-md transition-all duration-300 border-2 hover:border-purple-400 dark:hover:border-purple-600 hover:scale-[1.02] group">
                                  <CardContent className="p-5">
                                    <div className="space-y-3">
                                      {/* Enhanced Role Title */}
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}>
                                          <category.icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 dark:from-purple-400 dark:via-indigo-400 dark:to-purple-400 tracking-tight leading-tight">
                                            {member.role}
                                          </h4>
                                          <Badge variant="outline" className="mt-1 text-xs font-semibold border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300">
                                            {category.id === 'internal-team' ? 'Care Home Team' : 
                                             category.id === 'external-professionals' ? 'External Professional' :
                                             category.id === 'regulatory-bodies' ? 'Regulator' : 'Advocacy'}
                                          </Badge>
                                        </div>
                                        <motion.div
                                          whileHover={{ x: 5 }}
                                          className="opacity-50 group-hover:opacity-100 transition-opacity"
                                        >
                                          <ChevronRight className="h-5 w-5 text-purple-600" />
                                        </motion.div>
                                      </div>
                                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2 leading-relaxed">
                                        {member.description}
                                      </p>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-100/20/30 font-semibold group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20"
                                      >
                                        <Info className="h-4 w-4 mr-2" />
                                        Learn more about this role
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  {/* Enhanced Dialog Header with Role */}
                                  <div className={`-mx-6 -mt-6 mb-4 p-6 bg-gradient-to-r ${category.color} rounded-t-lg`}>
                                    <div className="flex items-center gap-4">
                                      <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                                        <category.icon className="h-8 w-8 text-white" />
                                      </div>
                                      <div>
                                        <Badge className="mb-2 bg-white/20 text-white border-white/30 font-semibold">
                                          {category.category}
                                        </Badge>
                                        <DialogTitle className="text-3xl font-black text-white drop-shadow-lg tracking-tight">
                                          {member.role}
                                        </DialogTitle>
                                      </div>
                                    </div>
                                  </div>
                                </DialogHeader>
                                <div className="space-y-5 py-2">
                                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-100/10 dark:to-indigo-100/10 p-4 rounded-xl border-l-2 border-blue-500">
                                    <h4 className="font-bold text-lg text-blue-700 dark:text-blue-200 mb-2 flex items-center gap-2">
                                      <Info className="h-5 w-5" />
                                      What they do
                                    </h4>
                                    <p className="text-gray-900 dark:text-white leading-relaxed">
                                      {member.description}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="font-bold text-lg text-green-600 dark:text-green-300 mb-3 flex items-center gap-2">
                                      <ClipboardCheck className="h-5 w-5" />
                                      Their responsibilities
                                    </h4>
                                    <div className="grid gap-2">
                                      {member.responsibilities.map((resp, idx) => (
                                        <motion.div 
                                          key={idx} 
                                          className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-100/10 rounded-lg border border-green-200 dark:border-green-300"
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{ delay: idx * 0.1 }}
                                        >
                                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                          <span className="text-gray-900 dark:text-white font-medium">{resp}</span>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-100/10 dark:to-pink-100/10 p-5 rounded-xl border border-purple-300 dark:border-purple-300">
                                    <h4 className="font-bold text-lg text-purple-700 dark:text-purple-200 mb-3 flex items-center gap-2">
                                      <Phone className="h-5 w-5" />
                                      When to contact them
                                    </h4>
                                    <p className="text-gray-900 dark:text-white leading-relaxed text-lg">
                                      {member.whenToContact}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Meetings Tab - NEW */}
          <TabsContent value="meetings" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <Card className="border-0 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white shadow-lg overflow-hidden relative">
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-white/20 rounded-2xl">
                      <Calendar className="h-10 w-10" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black">Important Meetings</h2>
                      <p className="text-lg text-cyan-100 font-semibold">Meetings that shape your care journey</p>
                    </div>
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed font-medium">
                    There are several important meetings that happen while you're in care. Understanding these helps you prepare and participate fully!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Meetings Grid */}
            <div className="grid gap-6">
              {IMPORTANT_MEETINGS.map((meeting, index) => {
                const IconComponent = meeting.icon;
                return (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border border-teal-200 hover:border-teal-400 bg-white hover:shadow-md transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-4 rounded-2xl bg-gradient-to-br ${meeting.color} shadow-lg`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div>
                              <h3 className="text-2xl font-black text-gray-900">{meeting.name}</h3>
                              <Badge className="mt-2 bg-teal-100 text-teal-800 border-teal-300 font-bold">
                                <Clock className="w-4 h-4 mr-1" />
                                {meeting.frequency}
                              </Badge>
                            </div>
                            
                            <p className="text-lg font-semibold text-gray-700">{meeting.purpose}</p>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                              <h4 className="text-lg font-black text-blue-800 mb-2">👥 Who Attends:</h4>
                              <div className="flex flex-wrap gap-2">
                                {meeting.whoAttends.map((person, idx) => (
                                  <Badge key={idx} className="bg-blue-600 text-white font-semibold">
                                    {person}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                              <h4 className="text-lg font-black text-purple-800 mb-2">🎯 Your Role:</h4>
                              <p className="text-base font-semibold text-purple-900">{meeting.yourRole}</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                              <h4 className="text-lg font-black text-green-800 mb-2">💡 Tips:</h4>
                              <ul className="space-y-2">
                                {meeting.tips.map((tip, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-base font-semibold text-green-900">
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Terminology Tab - NEW */}
          <TabsContent value="terminology" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <Card className="border-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-lg overflow-hidden relative">
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-white/20 rounded-2xl">
                      <BookOpen className="h-10 w-10" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black">Care System Terminology</h2>
                      <p className="text-lg text-orange-100 font-semibold">Words and phrases you might hear</p>
                    </div>
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed font-medium">
                    The care system has lots of special words and abbreviations. Here's a guide to help you understand what they all mean!
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Terminology Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {CARE_TERMINOLOGY.map((item, index) => (
                <motion.div
                  key={item.term}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="h-full border border-orange-200 hover:border-orange-400 bg-white hover:shadow-lg transition-all">
                    <CardContent className="p-5">
                      <h3 className="text-xl font-black text-orange-800 mb-2">{item.term}</h3>
                      <p className="text-base font-semibold text-gray-700 mb-3">{item.definition}</p>
                      {item.alsoKnownAs.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-bold text-gray-500">Also known as:</span>
                          {item.alsoKnownAs.map((alt, idx) => (
                            <Badge key={idx} variant="outline" className="text-sm font-semibold border-orange-300 text-orange-700">
                              {alt}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Legislation Tab */}
          <TabsContent value="legislation" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <Card className="border-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 0.5, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      <Scale className="w-6 h-6 text-white" />
                    </motion.div>
                  ))}
                </div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ 
                        rotate: [0, -15, 15, 0],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                        <Scale className="h-12 w-12 text-white" />
                      </div>
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">
                        Laws & Legislation: The Rules Everyone Follows
                      </h2>
                      <p className="text-white/95 text-lg leading-relaxed">
                        These are the laws that protect you and set out how your care should work.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {LEGISLATION.map((law, idx) => (
                  <motion.div
                    key={law.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-blue-300 dark:hover:border-blue-700 h-full">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${law.color}`}>
                                  <law.icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                  <Badge variant="outline" className="mb-2">
                                    {law.category}
                                  </Badge>
                                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                    {law.title}
                                  </h3>
                                </div>
                              </div>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {law.summary}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                              >
                                Read more
                                <ChevronRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${law.color}`}>
                              <law.icon className="h-6 w-6 text-white" />
                            </div>
                            <Badge variant="outline">{law.category}</Badge>
                          </div>
                          <DialogTitle className="text-2xl">{law.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Overview</h4>
                            <p className="text-gray-900 dark:text-white">
                              {law.summary}
                            </p>
                          </div>

                          <Separator />

                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              Key Points
                            </h4>
                            <ul className="space-y-3">
                              {law.keyPoints.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className="mt-1">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                  </div>
                                  <span className="text-gray-900 dark:text-white">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Separator />

                          <div className="bg-blue-50 dark:bg-blue-100/10 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-500" />
                              Why this matters to you
                            </h4>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {law.relevance}
                            </p>
                          </div>

                          {law.moreInfo && (
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => window.open(law.moreInfo, '_blank')}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Read full legislation
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Standards Tab */}
          <TabsContent value="standards" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <Card className="border-0 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1.2, 0],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        duration: 3.5,
                        repeat: Infinity,
                        delay: i * 0.35,
                        ease: "easeInOut",
                      }}
                    >
                      <Award className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  ))}
                </div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                        <Award className="h-12 w-12 text-yellow-300" />
                      </div>
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">
                        Standards & Inspections: Making Sure Homes are Good
                      </h2>
                      <p className="text-white/95 text-lg leading-relaxed">
                        How your home is checked and what standards they must meet.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {STANDARDS.map((standard, idx) => (
                  <motion.div
                    key={standard.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="overflow-hidden border-2">
                      <div className={`p-4 bg-gradient-to-r ${standard.color}`}>
                        <div className="flex items-center gap-3 text-white">
                          <standard.icon className="h-6 w-6" />
                          <h3 className="text-xl font-bold">{standard.name}</h3>
                        </div>
                      </div>
                      <CardContent className="p-6 space-y-6">
                        <p className="text-gray-900 dark:text-white">
                          {standard.description}
                        </p>

                        {standard.id === 'ofsted' && standard.ratings && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                              Ofsted Rating Levels
                            </h4>
                            <div className="grid gap-3 md:grid-cols-2">
                              {standard.ratings.map((rating, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="p-3 rounded-lg border-2 bg-gray-50 dark:bg-purple-950/15"
                                >
                                  <div className="font-bold text-gray-900 dark:text-white mb-1">
                                    {rating.level}
                                  </div>
                                  <div className="text-sm text-gray-900 dark:text-white">
                                    {rating.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {standard.id === 'ofsted' && standard.whatTheyLookAt && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                              <ClipboardCheck className="h-5 w-5 text-orange-500" />
                              What Inspectors Look At
                            </h4>
                            <ul className="space-y-2">
                              {standard.whatTheyLookAt.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-900 dark:text-white">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {standard.id === 'quality-standards' && standard.standards && (
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                              The Nine Quality Standards
                            </h4>
                            <div className="grid gap-3 md:grid-cols-3">
                              {standard.standards.map((std) => (
                                <Card key={std.number} className="border-2">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                                        {std.number}
                                      </div>
                                      <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                                        {std.title}
                                      </h5>
                                    </div>
                                    <p className="text-xs text-gray-900 dark:text-white">
                                      {std.summary}
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}

                        <Separator />

                        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                            <Heart className="h-4 w-4 text-orange-500" />
                            Your Role
                          </h4>
                          <p className="text-sm text-gray-900 dark:text-white mb-3">
                            {standard.yourRole}
                          </p>
                          {standard.frequency && (
                            <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              <span><strong>Frequency:</strong> {standard.frequency}</span>
                            </div>
                          )}
                        </div>

                        {standard.moreInfo && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(standard.moreInfo, '_blank')}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Learn more
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Rights Tab */}
          <TabsContent value="rights" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10"
            >
              <Card className="border-0 bg-gradient-to-br from-pink-600 via-rose-600 to-purple-600 text-white shadow-lg overflow-hidden relative">
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 0.7, 0],
                        y: [0, -30, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.25,
                        ease: "easeInOut",
                      }}
                    >
                      <Heart className="w-6 h-6 text-yellow-200" />
                    </motion.div>
                  ))}
                </div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.15, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <div className="p-4 rounded-xl bg-white/20 backdrop-blur-sm">
                        <Heart className="h-12 w-12 text-yellow-200" />
                      </div>
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold mb-3 drop-shadow-lg">
                        Your Rights: What You're Entitled To
                      </h2>
                      <p className="text-white/95 text-lg leading-relaxed">
                        These are your rights. Know them. Use them. They're here to protect you.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {RIGHTS.map((section, idx) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="overflow-hidden border-2">
                      <div className={`p-4 bg-gradient-to-r ${section.color}`}>
                        <div className="flex items-center gap-3 text-white">
                          <section.icon className="h-6 w-6" />
                          <h3 className="text-xl font-bold">{section.category}</h3>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {section.rights.map((right, rIdx) => (
                            <Card key={rIdx} className="border-2">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      {right.right}
                                    </h4>
                                    <p className="text-sm text-gray-900 dark:text-white">
                                      {right.description}
                                    </p>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                                    <div className="bg-blue-50 dark:bg-blue-100/10 p-3 rounded-lg">
                                      <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                                        HOW TO EXERCISE THIS RIGHT
                                      </div>
                                      <p className="text-sm text-gray-900 dark:text-white">
                                        {right.howToExercise}
                                      </p>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-100/10 p-3 rounded-lg">
                                      <div className="text-xs font-semibold text-green-600 dark:text-green-300 mb-1">
                                        WHO ENFORCES THIS
                                      </div>
                                      <p className="text-sm text-gray-900 dark:text-white">
                                        {right.whoEnforces}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Emergency Rights Card */}
              <Card className="border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    <div className="space-y-2">
                      <h3 className="font-bold text-red-900 dark:text-red-200">
                        If Your Rights Are Being Violated
                      </h3>
                      <p className="text-sm text-red-800 dark:text-red-300">
                        If you feel your rights aren't being respected, you can:
                      </p>
                      <ul className="space-y-1 text-sm text-red-800 dark:text-red-300">
                        <li>• Talk to your social worker or IRO</li>
                        <li>• Request an independent advocate</li>
                        <li>• Use the home's complaints process</li>
                        <li>• Contact Ofsted directly: 0300 123 1231</li>
                        <li>• Call Childline: 0800 1111 (24/7, confidential)</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* System Map Tab */}
          <TabsContent value="system-map" className="space-y-6">
            <SystemMapInteractive />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-900 dark:text-white"
        >
          <p>
            This information is designed to help you understand the care system.
            If you have questions, talk to your support team.
          </p>
          <p className="mt-2">
            <strong>Need help now?</strong> Call Childline: 0800 1111 (24/7, free, confidential)
          </p>
        </motion.div>
      </div>
    </div>
  );
}
