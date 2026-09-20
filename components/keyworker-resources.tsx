'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Users, Heart, BookOpen, Video, FileText, 
  CheckCircle, MessageCircle, Calendar, Shield, Star,
  Lightbulb, Target, Award, HelpCircle, ExternalLink,
  Play, Download, Eye, X, Clipboard, Phone, Mail, Clock,
  FileCheck, Handshake, UserCheck, ListChecks, Globe
} from 'lucide-react';
import { okayitTheme } from '@/lib/okayit-theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OKAYiTLogo from './okayit-logo';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const StayingSafeOnline = dynamic(() => import('./keywork/staying-safe-online'), { ssr: false });
const KeyworkAdmin = dynamic(() => import('./keywork/keywork-admin'), { ssr: false });

interface KeyWorkerResourcesProps {
  onBack: () => void;
}

export default function KeyWorkerResources({ onBack }: KeyWorkerResourcesProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [launchSession, setLaunchSession] = useState(false);

  // The online safety session takes over the whole view when running.
  if (launchSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <StayingSafeOnline onExit={() => setLaunchSession(false)} />
        </div>
      </div>
    );
  }

  // Real YouTube videos about key working and care
  const videoResources = [
    {
      id: 'key-working-explained',
      title: 'Understanding Key Working in Care',
      description: 'Learn what key working means and how it supports young people in residential care settings',
      duration: '6:23',
      category: 'Introduction',
      thumbnail: '🎥',
      embedId: 'r1N0PLH4djU',
      source: 'YouTube'
    },
    {
      id: 'building-relationships',
      title: 'Building Trusting Relationships',
      description: 'How care workers build meaningful connections with young people in their care',
      duration: '5:18',
      category: 'Relationships',
      thumbnail: '🤝',
      embedId: 'lNynQQ6ZRPs',
      source: 'YouTube'
    },
    {
      id: 'care-planning',
      title: 'Care Planning with Young People',
      description: 'Involving young people in decisions about their care and future plans',
      duration: '7:45',
      category: 'Care Planning',
      thumbnail: '📋',
      embedId: 'RydgTJlBmDA',
      source: 'YouTube'
    },
    {
      id: 'voice-advocacy',
      title: 'Advocacy and Voice for Young People',
      description: 'Understanding how key workers advocate for young people and amplify their voice',
      duration: '4:52',
      category: 'Advocacy',
      thumbnail: '💬',
      embedId: '8883yoqX_Yg',
      source: 'YouTube'
    },
    {
      id: 'rights-in-care',
      title: 'Your Rights in Care',
      description: 'Understanding your rights as a young person living in residential care',
      duration: '6:10',
      category: 'Rights',
      thumbnail: '⚖️',
      embedId: 'k3g0jtuNMDE',
      source: 'YouTube'
    },
    {
      id: 'transition-support',
      title: 'Planning for Independence',
      description: 'How key workers help young people prepare for independent living',
      duration: '8:34',
      category: 'Independence',
      thumbnail: '🎯',
      embedId: 'Jie__iO44fs',
      source: 'YouTube'
    },
    {
      id: 'mental-health-support',
      title: 'Supporting Mental Health',
      description: 'How key workers support young people\'s emotional wellbeing',
      duration: '5:28',
      category: 'Wellbeing',
      thumbnail: '💚',
      embedId: 'sreFCgN40zs',
      source: 'YouTube'
    },
    {
      id: 'education-support',
      title: 'Educational Support in Care',
      description: 'How key workers support educational achievement and career goals',
      duration: '7:15',
      category: 'Education',
      thumbnail: '📚',
      embedId: '7l14GJlW71Y',
      source: 'YouTube'
    }
  ];

  // Practical guides with detailed content
  const guides = [
    {
      id: 'key-worker-guide',
      title: 'Your Key Worker Guide',
      description: 'Complete guide to understanding your key worker relationship',
      icon: BookOpen,
      color: 'purple',
      sections: [
        'What is a key worker?',
        'Your key worker\'s responsibilities',
        'What you can expect',
        'How to communicate effectively',
        'Confidentiality and boundaries'
      ],
      content: `# Your Key Worker Guide

## What is a Key Worker?
Your key worker is a dedicated member of staff who is specially assigned to support you during your time in the home. They get to know you as an individual and act as your main point of contact.

## Their Responsibilities Include:
• Having regular one-to-one sessions with you
• Writing and updating your care plan
• Attending meetings about your care
• Advocating for your needs
• Supporting your education and interests
• Helping you achieve your goals

## What You Can Expect:
• Weekly key worker sessions
• Confidentiality (with safeguarding exceptions)
• Being listened to without judgment
• Help navigating challenges
• Support with your care reviews
• Someone who knows your story`
    },
    {
      id: 'meetings-toolkit',
      title: 'Key Worker Meetings Toolkit',
      description: 'Everything you need to prepare for and participate in meetings',
      icon: Calendar,
      color: 'blue',
      sections: [
        'Meeting frequency and format',
        'Preparing topics to discuss',
        'Setting goals together',
        'Reviewing progress',
        'What happens in meetings'
      ],
      content: `# Key Worker Meetings Toolkit

## Meeting Basics
Key worker meetings happen at least weekly and last 30-60 minutes. They're YOUR time to talk about whatever matters to you.

## Things to Discuss:
• How you're feeling
• School/college updates
• Friends and relationships
• Family contact
• Goals and dreams
• Any worries or concerns

## Preparing for Meetings:
1. Think about what's been on your mind
2. Write down any questions
3. Consider goals you want to set
4. Think about achievements to celebrate

## Your Rights in Meetings:
• You can ask for topics to be discussed
• You can say if you don't want to talk about something
• You can have your say recorded
• You can ask for a different time/place`
    },
    {
      id: 'building-trust',
      title: 'Building Trust',
      description: 'Understanding how relationships develop in care',
      icon: Heart,
      color: 'pink',
      sections: [
        'Why trust takes time',
        'How key workers build relationships',
        "When you don't get along",
        'Changing key workers',
        'Professional boundaries explained'
      ],
      content: `# Building Trust with Your Key Worker

## Why Trust Takes Time
Building trust is a gradual process. It's completely normal to feel cautious at first. Your key worker understands this.

## How Trust Develops:
• Through consistent, reliable behavior
• By keeping promises
• Through honest communication
• By respecting your boundaries
• Through shared experiences

## If You Don't Get Along:
Not everyone clicks. That's okay. Here are your options:
• Talk to your key worker about how you feel
• Speak to the manager
• Request a change of key worker
• Use your advocate if you need support

## Professional Boundaries:
Key workers care about you but must maintain boundaries:
• No personal social media contact
• No personal phone numbers
• No gifts over a certain value
• These protect both you and them`
    },
    {
      id: 'rights-voice',
      title: 'Your Rights and Voice',
      description: 'How your key worker advocates for you and supports your rights',
      icon: Shield,
      color: 'green',
      sections: [
        'Your rights in care',
        'How key workers advocate',
        'Making complaints',
        'Independent advocacy',
        'Having your say in decisions'
      ],
      content: `# Your Rights and Voice

## Your Core Rights:
• To be treated with respect
• To have your views heard
• To privacy (where safe)
• To education
• To healthcare
• To contact family (if appropriate)
• To complain if unhappy

## How Key Workers Advocate:
• Speaking up for you in meetings
• Explaining your needs to professionals
• Supporting you to express your views
• Challenging decisions you disagree with
• Helping you access services

## Making a Complaint:
If you're unhappy, you can:
1. Talk to your key worker
2. Speak to the manager
3. Contact Ofsted
4. Use the Children's Commissioner
5. Contact your Independent Reviewing Officer

## Independent Advocacy:
You have the right to an independent advocate who can support you separately from the care home.`
    }
  ];

  // Key worker responsibilities with examples
  const responsibilities = [
    {
      title: 'Your Voice',
      description: 'Ensuring your views are heard in all decisions about your care',
      icon: MessageCircle,
      color: 'from-purple-500 to-pink-500',
      examples: [
        'Speaking up for you in reviews',
        'Helping you write your views before meetings',
        'Making sure professionals listen to you'
      ]
    },
    {
      title: 'Care Planning',
      description: 'Working with you to create and review your personalized care plan',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      examples: [
        'Writing your care plan together',
        'Reviewing it every month',
        'Making changes when your needs change'
      ]
    },
    {
      title: 'Goal Setting',
      description: 'Supporting you to set and achieve your personal goals',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      examples: [
        'Setting SMART goals together',
        'Breaking big goals into small steps',
        'Celebrating your achievements'
      ]
    },
    {
      title: 'Advocacy',
      description: 'Speaking up for your needs with social workers, schools, and services',
      icon: Shield,
      color: 'from-orange-500 to-amber-500',
      examples: [
        'Contacting teachers about concerns',
        'Attending meetings on your behalf',
        'Challenging unfair decisions'
      ]
    },
    {
      title: 'Regular Check-ins',
      description: 'Having regular one-to-one time to talk about anything',
      icon: Calendar,
      color: 'from-indigo-500 to-purple-500',
      examples: [
        'Weekly key worker sessions',
        'Informal daily conversations',
        'Being available when you need to talk'
      ]
    },
    {
      title: 'Life Skills',
      description: 'Helping you develop skills for independence and adult life',
      icon: Award,
      color: 'from-rose-500 to-pink-500',
      examples: [
        'Teaching cooking and cleaning',
        'Help with money management',
        'Supporting job applications'
      ]
    }
  ];

  // Practical resources for working with YP
  const practicalResources = [
    {
      title: 'Conversation Starters',
      icon: MessageCircle,
      items: [
        '"How has your week been?"',
        '"What\'s something good that happened recently?"',
        '"Is there anything worrying you at the moment?"',
        '"What are you looking forward to?"',
        '"How can I help you this week?"'
      ]
    },
    {
      title: 'Goal-Setting Templates',
      icon: Target,
      items: [
        'Short-term goals (this week)',
        'Medium-term goals (this month)',
        'Long-term dreams and aspirations',
        'Steps to achieve each goal',
        'Who can help with each step'
      ]
    },
    {
      title: 'Meeting Agenda Ideas',
      icon: ListChecks,
      items: [
        'Check-in: How are you feeling today?',
        'Review last week\'s goals',
        'Discuss any concerns or worries',
        'Set new goals for the week',
        'Plan activities or trips'
      ]
    },
    {
      title: 'Record Keeping Tips',
      icon: Clipboard,
      items: [
        'Document key points from sessions',
        'Record progress towards goals',
        'Note any concerns raised',
        'Track achievements and celebrations',
        'Keep records up to date'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How often will I meet with my key worker?',
      answer: 'Most key workers aim to have at least one formal meeting per week, but you can talk to them informally anytime they\'re on shift. The frequency might increase if you\'re going through a difficult time or have important decisions to make.'
    },
    {
      question: 'What if I don\'t get along with my key worker?',
      answer: 'It\'s normal to not connect with everyone. Talk to your key worker honestly about how you feel, or speak to the manager. Sometimes relationships take time to develop, but if it\'s not working, you can request a change of key worker.'
    },
    {
      question: 'Is everything I tell my key worker confidential?',
      answer: 'Mostly yes, but there are some exceptions. If you tell them something that means you or someone else is at risk of harm, they have a duty to share that information to keep everyone safe. They\'ll always try to discuss this with you first.'
    },
    {
      question: 'Can my key worker help with school/college issues?',
      answer: 'Absolutely! Your key worker can attend meetings at school, help with homework, support you with exam stress, and liaise with teachers. They\'re there to support your education and future goals.'
    },
    {
      question: 'What\'s the difference between a key worker and my social worker?',
      answer: 'Your key worker sees you every day and provides hands-on support in the home. Your social worker has legal responsibility for your care and makes bigger decisions about your placement. Your key worker often works closely with your social worker to update them and advocate for you.'
    },
    {
      question: 'Can I contact my key worker when they\'re not at work?',
      answer: 'Usually not directly, as key workers need their personal time. However, there\'s always staff at the home who can help, and in emergencies, they can contact your key worker. Your key worker will explain their availability and how to reach them during meetings.'
    },
    {
      question: 'What happens if my key worker leaves?',
      answer: 'You will be allocated a new key worker. There should be a proper handover where your current key worker introduces you to the new one and shares important information about your care plan and goals.'
    },
    {
      question: 'Can I choose my key worker?',
      answer: 'In most homes, managers try to match key workers with young people based on interests and personality. If you have a preference or don\'t think your match is working, speak to the manager about your concerns.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Compact Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 flex items-center gap-1 text-purple-600 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-bold text-gray-800">Key Worker Resources</span>
          </div>
          <OKAYiTLogo width={28} height={28} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {/* Compact subtitle */}
          <p className="text-xs text-gray-500 text-center">Understanding your key worker relationship</p>

          {/* Pill Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-wrap gap-1.5 justify-center mb-2">
              {[
                { val: 'overview', icon: Lightbulb, label: 'Overview' },
                { val: 'responsibilities', icon: CheckCircle, label: 'Role' },
                { val: 'guides', icon: BookOpen, label: 'Guides' },
                { val: 'practical', icon: Clipboard, label: 'Tools' },
                { val: 'videos', icon: Video, label: 'Videos' },
                { val: 'online-safety', icon: Shield, label: 'Online safety' },
                { val: 'faqs', icon: HelpCircle, label: 'FAQs' },
              ].map(t => (
                <button
                  key={t.val}
                  onClick={() => setActiveTab(t.val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${activeTab === t.val ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-300'}`}
                >
                  <t.icon className="w-3 h-3" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-3 mt-3">
              <Card className="border border-indigo-200 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-indigo-700 flex items-center gap-3">
                    <Heart className="w-4 h-4" />
                    What is a Key Worker?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-slate-700 text-xs leading-relaxed">
                  <p className="font-semibold text-slate-800">
                    Your key worker is a dedicated staff member who gets to know you as an individual and acts as your main point of contact in the home.
                  </p>
                  <p className="text-slate-700">
                    Think of them as your advocate, supporter, and guide. They're here to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-slate-700">
                    <li>Listen to your views and feelings</li>
                    <li>Help you understand your care plan</li>
                    <li>Support you to achieve your goals</li>
                    <li>Speak up for you with social workers, schools, and other services</li>
                    <li>Be someone you can trust and talk to regularly</li>
                  </ul>
                  <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-300 mt-3">
                    <p className="font-bold text-indigo-800 text-xl mb-2">
                      💜 Remember: Your key worker is on YOUR side
                    </p>
                    <p className="text-indigo-700">
                      Their job is to make sure your voice is heard and your needs are met. You don't have to face challenges alone.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quote Card with proper visibility */}
              <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 border-0 shadow-sm">
                <CardContent className="p-3">
                  <blockquote className="text-center">
                    <p className="text-2xl md:text-sm font-bold text-white italic mb-2">
                      "A good key worker makes you feel like you matter, like your opinion counts, and like someone genuinely cares about your future."
                    </p>
                    <footer className="text-purple-200 font-semibold text-lg">
                     , Care-experienced young person
                    </footer>
                  </blockquote>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-3">
                <Card className="border border-blue-300 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-blue-700 flex items-center gap-2">
                      <Star className="w-6 h-6" />
                      Why Key Workers Matter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-slate-700">
                    <p className="font-semibold text-slate-800">Research shows that young people do better when they have:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>A consistent, trusted adult in their life</li>
                      <li>Someone who knows their history and goals</li>
                      <li>An advocate who speaks up for them</li>
                      <li>Regular one-to-one time with the same person</li>
                    </ul>
                    <p className="text-sm font-semibold text-blue-700 mt-4 bg-blue-50 p-3 rounded-lg">
                      That's exactly what your key worker provides!
                    </p>
                  </CardContent>
                </Card>

                <Card className="border border-green-300 shadow-lg bg-white">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-green-700 flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Building the Relationship
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-slate-700">
                    <p className="font-semibold text-slate-800">Strong relationships take time. Here's what helps:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Be patient - trust develops gradually</li>
                      <li>Be honest about your feelings</li>
                      <li>Attend your key worker meetings</li>
                      <li>Ask questions if you're unsure about anything</li>
                      <li>Remember they're human too!</li>
                    </ul>
                    <p className="text-sm font-semibold text-green-700 mt-4 bg-green-50 p-3 rounded-lg">
                      It's okay to take things at your own pace.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Responsibilities Tab */}
            <TabsContent value="responsibilities" className="space-y-3 mt-3">
              <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-slate-800 mb-2">What Your Key Worker Does</h2>
                <p className="text-lg text-slate-600">Understanding their role helps you know what to expect</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {responsibilities.map((resp, index) => {
                  const Icon = resp.icon;
                  return (
                    <motion.div
                      key={resp.title}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full border border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 bg-white">
                        <CardContent className="p-3 space-y-4">
                          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${resp.color} flex items-center justify-center mx-auto shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-sm font-bold text-slate-800 text-center">{resp.title}</h3>
                          <p className="text-slate-600 text-center leading-relaxed">{resp.description}</p>
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm font-semibold text-slate-700 mb-2">Examples:</p>
                            <ul className="space-y-1">
                              {resp.examples.map((example, idx) => (
                                <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Guides Tab */}
            <TabsContent value="guides" className="space-y-3 mt-3">
              <div className="grid md:grid-cols-2 gap-3">
                {guides.map((guide, index) => {
                  const Icon = guide.icon;
                  const colorMap: any = {
                    purple: { bg: 'bg-purple-600', border: 'border-purple-400', text: 'text-purple-700', light: 'bg-purple-50' },
                    blue: { bg: 'bg-blue-600', border: 'border-blue-400', text: 'text-blue-700', light: 'bg-blue-50' },
                    pink: { bg: 'bg-pink-600', border: 'border-pink-400', text: 'text-pink-700', light: 'bg-pink-50' },
                    green: { bg: 'bg-green-600', border: 'border-green-400', text: 'text-green-700', light: 'bg-green-50' }
                  };
                  const colors = colorMap[guide.color];

                  return (
                    <motion.div
                      key={guide.title}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`border-4 ${colors.border} shadow-sm hover:shadow-lg transition-all bg-white`}>
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className={`${colors.bg} p-3 rounded-lg shadow-md`}>
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className={`text-sm font-bold ${colors.text} mb-2`}>
                                {guide.title}
                              </CardTitle>
                              <p className="text-slate-600">{guide.description}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="font-semibold text-slate-700 mb-2">What's Inside:</p>
                            {guide.sections.map((section, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                                <span className="text-slate-700">{section}</span>
                              </div>
                            ))}
                          </div>
                          <Button 
                            className={`w-full mt-6 ${colors.bg} hover:opacity-90 text-white font-semibold`}
                            onClick={() => setSelectedGuide(guide.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Read Guide
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Practical Resources Tab */}
            <TabsContent value="practical" className="space-y-3 mt-3">
              <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-slate-800 mb-2">Practical Tools & Resources</h2>
                <p className="text-lg text-slate-600">Helpful resources for making the most of your key worker relationship</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {practicalResources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <motion.div
                      key={resource.title}
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border border-amber-300 shadow-lg hover:shadow-sm transition-all bg-white">
                        <CardHeader>
                          <CardTitle className="text-sm font-bold text-amber-700 flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                              <Icon className="w-6 h-6 text-amber-600" />
                            </div>
                            {resource.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {resource.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-700">
                                <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-1" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Reference Card */}
              <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-sm mt-8">
                <CardContent className="p-3">
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="p-4 bg-white/20 rounded-full">
                      <Handshake className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-sm font-bold text-white mb-2">Key Worker Quick Guide</h3>
                      <p className="text-amber-100 text-lg">
                        Remember: Your key worker is there to support YOU. Don't be afraid to ask questions, 
                        share your feelings, or request changes if something isn't working.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="space-y-3 mt-3">
              <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-slate-800 mb-2">Video Resources</h2>
                <p className="text-lg text-slate-600">Watch and learn about key working and care support</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {videoResources.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border border-orange-300 hover:border-orange-500 hover:shadow-sm transition-all cursor-pointer bg-white">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Play className="w-10 h-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <Badge className="bg-orange-100 text-orange-700 mb-2 border-orange-300">{video.category}</Badge>
                            <h3 className="text-sm font-bold text-slate-800 mb-2">{video.title}</h3>
                            <p className="text-slate-600 mb-2 text-sm">{video.description}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {video.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Globe className="w-4 h-4" />
                                {video.source}
                              </span>
                            </div>
                            <Button 
                              className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 w-full text-white font-semibold"
                              onClick={() => setSelectedVideo(video.embedId)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Watch Video
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent value="faqs" className="space-y-3 mt-3">
              <div className="text-center mb-8">
                <h2 className="text-sm font-bold text-slate-800 mb-2">Frequently Asked Questions</h2>
                <p className="text-lg text-slate-600">Common questions about key workers answered</p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border border-pink-300 hover:shadow-lg transition-all bg-white">
                      <CardHeader>
                        <CardTitle className="text-sm font-bold text-pink-700 flex items-start gap-3">
                          <HelpCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                          <span>{faq.question}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700 leading-relaxed text-lg">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Online safety session tab */}
            <TabsContent value="online-safety" className="space-y-3 mt-3">
              <Card className="border border-purple-200 shadow-sm bg-gradient-to-br from-purple-50 to-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-purple-700 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Staying Safe Online
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-700">
                    A one to one online safety session for you and a young person to do together on this device. It takes about an hour, but you can stop at any point. There is no score and no pass mark.
                  </p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 w-4 h-4 text-green-600 flex-shrink-0" /> Pick Track A for ages 11 to 13 or Track B for ages 14 to 17.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 w-4 h-4 text-green-600 flex-shrink-0" /> The young person drives on the shared device.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 w-4 h-4 text-green-600 flex-shrink-0" /> A Stop button and help routes are on every screen.</li>
                  </ul>
                  <Button onClick={() => setLaunchSession(true)}
                    className="w-full h-12 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold">
                    <Play className="mr-2 w-4 h-4" /> Start a session
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <Clipboard className="w-4 h-4" /> Session records and help routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <KeyworkAdmin />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-white">
          <DialogHeader className="p-3 pb-0">
            <DialogTitle className="text-sm font-bold text-slate-800">
              Video Player
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full bg-black">
            {selectedVideo && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="Key Worker Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
          <div className="p-3 pt-4">
            <Button 
              onClick={() => setSelectedVideo(null)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              Close Video
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Guide Viewer Dialog */}
      <Dialog open={!!selectedGuide} onOpenChange={() => setSelectedGuide(null)}>
        <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-800">
              {guides.find(g => g.id === selectedGuide)?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="prose prose-slate max-w-none">
            {selectedGuide && (
              <div className="space-y-4 text-slate-700">
                {guides.find(g => g.id === selectedGuide)?.content.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={idx} className="text-sm font-bold text-slate-800 mt-4">{line.slice(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={idx} className="text-sm font-bold text-slate-800 mt-4">{line.slice(3)}</h2>;
                  } else if (line.startsWith('• ')) {
                    return <li key={idx} className="ml-4 text-slate-700">{line.slice(2)}</li>;
                  } else if (line.trim()) {
                    return <p key={idx} className="text-slate-700">{line}</p>;
                  }
                  return null;
                })}
              </div>
            )}
          </div>
          <Button 
            onClick={() => setSelectedGuide(null)}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Close Guide
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
