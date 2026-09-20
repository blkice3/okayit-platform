'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, BookOpen, Smile, Trophy, Activity,
  Users, Shield, Star, FileText, ChevronDown, ChevronUp,
  ExternalLink, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CareStandardsProps {
  onBack?: () => void;
}

const standards = [
  {
    number: 1,
    title: 'Quality and Purpose of Care',
    icon: Heart,
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    iconBg: 'bg-purple-100',
    summary: 'Your care home must give you warm, personal care that understands who you are.',
    whatItMeans: [
      'Staff should know your background, your likes and dislikes',
      'Care should be tailored to YOUR needs, not one-size-fits-all',
      'Your physical, emotional, and mental health needs must all be met',
      'The home should feel safe and help you grow and develop',
      'There should be a clear Statement of Purpose explaining what the home provides'
    ],
    yourRights: 'You have the right to care that is designed around YOU. If you feel the care is not personal enough, speak to your key worker or social worker.',
    askAbout: 'Ask to see the home\'s Statement of Purpose, it explains exactly what they should be providing for you.'
  },
  {
    number: 2,
    title: 'Children\'s Wishes and Feelings',
    icon: Smile,
    color: 'pink',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    textColor: 'text-pink-700',
    iconBg: 'bg-pink-100',
    summary: 'Your voice matters. The home MUST listen to you and involve you in decisions about your life.',
    whatItMeans: [
      'You must be asked your opinion on things that affect you',
      'Your views should influence daily routines, meals, activities, and rules',
      'You should be involved in your care plan reviews',
      'You can make suggestions at house meetings',
      'Staff must respect your cultural identity, faith, and background',
      'You have the right to complain if you are not happy'
    ],
    yourRights: 'NOBODY can make decisions about your life without considering what you think and feel. This is the law.',
    askAbout: 'Ask about the complaints procedure and how to get an independent advocate if you need one.'
  },
  {
    number: 3,
    title: 'Education',
    icon: BookOpen,
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
    iconBg: 'bg-blue-100',
    summary: 'Your education is important. The home must make sure you can learn and reach your potential.',
    whatItMeans: [
      'The home must make sure you attend school regularly',
      'You should have a quiet place to do homework',
      'Extra help like tutoring should be arranged if you need it',
      'Staff should go to parents\' evenings and school meetings',
      'Your school has a Designated Teacher for looked-after children who supports you',
      'Your achievements at school should be celebrated'
    ],
    yourRights: 'You have the same right to education as every other child. If school is difficult, ask for extra support, the home must provide it.',
    askAbout: 'Ask who your Designated Teacher is at school and whether you have a Personal Education Plan (PEP).'
  },
  {
    number: 4,
    title: 'Enjoyment and Achievement',
    icon: Trophy,
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
    iconBg: 'bg-orange-100',
    summary: 'You have the right to have fun, try new things, and celebrate your achievements.',
    whatItMeans: [
      'The home must provide regular activities, hobbies, and outings',
      'You should be encouraged to try new things',
      'Sports, music, art, drama, and other activities should be available',
      'Day trips and holidays should be arranged',
      'Your talents and interests should be supported',
      'Achievements, big and small, should be celebrated'
    ],
    yourRights: 'Having fun is not a privilege, it is your RIGHT. The home has a budget for activities. Suggest things you want to do!',
    askAbout: 'Ask what activities are planned this month and suggest something new you would like to try.'
  },
  {
    number: 5,
    title: 'Health and Wellbeing',
    icon: Activity,
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    textColor: 'text-green-700',
    iconBg: 'bg-green-100',
    summary: 'Your physical and mental health must be looked after properly.',
    whatItMeans: [
      'You must be registered with a GP, dentist, and optician',
      'Health appointments must be arranged and kept',
      'You have the right to see a counsellor or therapist',
      'Healthy, nutritious meals should be provided',
      'Your emotional wellbeing is just as important as physical health',
      'Staff should understand trauma and how it affects you',
      'You should have access to CAMHS if needed'
    ],
    yourRights: 'Your health matters. If you need to see a doctor, counsellor, or specialist, the home MUST arrange it for you.',
    askAbout: 'Ask your key worker about getting a health assessment and whether you can access any therapeutic support.'
  },
  {
    number: 6,
    title: 'Positive Relationships',
    icon: Users,
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-700',
    iconBg: 'bg-indigo-100',
    summary: 'You should be helped to build healthy relationships with staff, family, and friends.',
    whatItMeans: [
      'Staff should be warm, consistent, and trustworthy',
      'You should be helped to stay in touch with family (if safe)',
      'Your friendships should be supported',
      'Staff should help you learn to manage conflict peacefully',
      'You should have one-to-one time with your key worker',
      'The home should feel like a community, not an institution'
    ],
    yourRights: 'You have the right to maintain relationships with people who are important to you. Staff should support this, not restrict it without good reason.',
    askAbout: 'Ask about contact arrangements with family and friends, and when your next key worker session is.'
  },
  {
    number: 7,
    title: 'Protection of Children',
    icon: Shield,
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
    iconBg: 'bg-red-100',
    summary: 'You must be kept safe from all forms of harm, and helped to understand how to keep yourself safe too.',
    whatItMeans: [
      'All staff are vetted and trained in safeguarding',
      'There are clear procedures if something goes wrong',
      'You should feel safe in the home at all times',
      'Bullying is never acceptable and must be dealt with',
      'You should know who to tell if something bad happens',
      'Staff should help you understand risks without being controlling',
      'Missing from care procedures are in place to keep you safe'
    ],
    yourRights: 'Safety is your most basic right. If you EVER feel unsafe, tell someone immediately, a staff member, your social worker, or call Childline on 0800 1111.',
    askAbout: 'Ask who the safeguarding lead is and what happens if you need to report something.'
  },
  {
    number: 8,
    title: 'Leadership and Management',
    icon: Star,
    color: 'amber',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    iconBg: 'bg-amber-100',
    summary: 'The home must be run by people who are skilled, committed, and always looking to improve.',
    whatItMeans: [
      'The Registered Manager must be qualified and experienced',
      'Staff should receive ongoing training and supervision',
      'The home should be regularly audited and inspected',
      'Ofsted visits the home to check standards are being met',
      'Leaders should listen to feedback from young people',
      'The home should keep improving based on what young people say'
    ],
    yourRights: 'You can ask to see the latest Ofsted report. If you have concerns about how the home is run, you can contact Ofsted directly.',
    askAbout: 'Ask to see the home\'s latest Ofsted report and what improvements they are working on.'
  },
  {
    number: 9,
    title: 'Care Planning',
    icon: FileText,
    color: 'teal',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
    textColor: 'text-teal-700',
    iconBg: 'bg-teal-100',
    summary: 'You must have a clear plan for your care, and for your future when you leave.',
    whatItMeans: [
      'You should have a care plan that is reviewed regularly',
      'Your views must be included in your care plan',
      'If you are approaching 16+, you should have a Pathway Plan',
      'The plan should cover education, health, contact, and emotional needs',
      'Transition planning should start early, not at the last minute',
      'You should be helped to develop independent living skills',
      'Your Personal Adviser supports you up to age 25'
    ],
    yourRights: 'Your care plan is ABOUT you, you should always know what is in it. Ask to see it and be involved in reviews.',
    askAbout: 'Ask when your next review is and whether you can have input into your care plan before it.'
  }
];

export default function CareStandards({ onBack }: CareStandardsProps) {
  const [expandedStandard, setExpandedStandard] = useState<number | null>(null);
  const [completedStandards, setCompletedStandards] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('okayit-standards-read');
        return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch { return new Set(); }
    }
    return new Set();
  });

  const toggleStandard = (num: number) => {
    setExpandedStandard(expandedStandard === num ? null : num);
    // Mark as read
    if (!completedStandards.has(num)) {
      const updated = new Set(completedStandards);
      updated.add(num);
      setCompletedStandards(updated);
      try { localStorage.setItem('okayit-standards-read', JSON.stringify([...updated])); } catch {}
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold hover:text-purple-800 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Menu
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-bold text-gray-900">9 Standards of Care</span>
          </div>
          <Badge className="bg-green-100 text-green-700 text-xs">
            {completedStandards.size}/9 read
          </Badge>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <h1 className="text-2xl font-black text-purple-800">
            The 9 Standards Your Care Home Must Meet
          </h1>
          <p className="text-gray-600 text-base max-w-xl mx-auto">
            These are set by law under the Children&apos;s Homes (England) Regulations 2015.
            Ofsted inspects your home against these standards. Knowing them helps you understand
            what you are entitled to.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Badge className="bg-purple-100 text-purple-700">🏛️ Law-based</Badge>
            <Badge className="bg-blue-100 text-blue-700">🔍 Ofsted checks these</Badge>
            <Badge className="bg-green-100 text-green-700">💪 Know your rights</Badge>
          </div>
        </motion.div>

        {/* Standards List */}
        <div className="space-y-3">
          {standards.map((standard, index) => {
            const Icon = standard.icon;
            const isExpanded = expandedStandard === standard.number;
            const isRead = completedStandards.has(standard.number);

            return (
              <motion.div
                key={standard.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`border-2 ${isExpanded ? standard.borderColor : 'border-gray-200'} transition-all ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}`}>
                  <button
                    onClick={() => toggleStandard(standard.number)}
                    className="w-full text-left"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${standard.iconBg} relative`}>
                          <Icon className={`w-6 h-6 ${standard.textColor}`} />
                          {isRead && (
                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className={`${standard.bgColor} ${standard.textColor} text-xs`}>
                              Standard {standard.number}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mt-1 text-gray-900">
                            {standard.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{standard.summary}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0 space-y-4">
                          {/* What it means */}
                          <div className={`${standard.bgColor} rounded-xl p-4`}>
                            <h4 className={`font-bold ${standard.textColor} mb-2 flex items-center gap-2`}>
                              <BookOpen className="w-4 h-4" />
                              What This Means for You
                            </h4>
                            <ul className="space-y-2">
                              {standard.whatItMeans.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                  <CheckCircle2 className={`w-4 h-4 ${standard.textColor} flex-shrink-0 mt-0.5`} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Your rights */}
                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <h4 className="font-bold text-yellow-800 mb-1 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              Your Rights
                            </h4>
                            <p className="text-sm text-yellow-700">{standard.yourRights}</p>
                          </div>

                          {/* What to ask about */}
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                              <Star className="w-4 h-4" />
                              💡 What to Ask About
                            </h4>
                            <p className="text-sm text-blue-700">{standard.askAbout}</p>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardContent className="p-6 text-center space-y-3">
            <p className="text-gray-700 font-semibold">
              These standards come from the Children&apos;s Homes (England) Regulations 2015
            </p>
            <p className="text-sm text-gray-500">
              Ofsted inspects your home against these standards. If you think any standard is not being met,
              you can speak to your social worker, an advocate from Coram Voice (0808 800 5792),
              or contact Ofsted directly.
            </p>
            <Button
              onClick={onBack}
              className="bg-purple-600 hover:bg-purple-700 text-white mt-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
