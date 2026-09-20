'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, CheckCircle, ChevronDown, ChevronUp,
  Home, Users, FileText, Heart, Star, Calendar, MessageCircle, Shield
} from 'lucide-react';

interface TimelineItem {
  id: string;
  when: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  details?: string[];
}

const timelineData: { phase: string; description: string; items: TimelineItem[] }[] = [
  {
    phase: 'Your First Day',
    description: 'The day you arrive at your new home',
    items: [
      {
        id: 'arrive',
        when: 'When you arrive',
        title: 'Welcome & Tour',
        description: 'A staff member will show you around and help you settle in.',
        icon: Home,
        color: 'purple',
        details: [
          'You will be shown your bedroom and where things are',
          'You can bring your own things to make it feel like home',
          'Someone will explain how the house works',
          'You do not have to remember everything, it takes time',
        ]
      },
      {
        id: 'meet',
        when: 'First few hours',
        title: 'Meet the Team',
        description: 'You will meet some of the staff who work here.',
        icon: Users,
        color: 'blue',
        details: [
          'Staff work in shifts, so you will meet others over the next few days',
          'You will be told who your key worker is (your main support person)',
          'You do not have to talk a lot if you do not want to',
          'Everyone understands this is a big change',
        ]
      },
      {
        id: 'basics',
        when: 'Settling in',
        title: 'Getting Comfortable',
        description: 'Finding out about meals, bedtime, and the daily routine.',
        icon: Heart,
        color: 'green',
        details: [
          'You can ask for food or a drink whenever you are hungry',
          'Staff will explain the general routine but it is flexible',
          'WiFi details will be shared with you',
          'There is no rush to do anything you are not ready for',
        ]
      },
    ]
  },
  {
    phase: 'Your First Week',
    description: 'Getting to know the place and people',
    items: [
      {
        id: 'keyworker',
        when: 'Within first few days',
        title: 'Meet Your Key Worker',
        description: 'Your key worker is the staff member who supports you most closely.',
        icon: Users,
        color: 'purple',
        details: [
          'They will check how you are settling in',
          'You can talk to them about anything, worries, questions, ideas',
          'They will help you with things like school, family contact, and goals',
          'If you do not get along, you can ask for a different key worker',
        ]
      },
      {
        id: 'social-worker',
        when: 'First week',
        title: 'Social Worker Visit',
        description: 'Your social worker will visit to check how you are doing.',
        icon: Shield,
        color: 'blue',
        details: [
          'They will ask how you are feeling about the placement',
          'You can ask them questions about your care plan',
          'They want to make sure you feel safe and supported',
          'You have the right to speak to them privately',
        ]
      },
      {
        id: 'routine',
        when: 'As the week goes on',
        title: 'Finding Your Routine',
        description: 'Getting used to how things work day-to-day.',
        icon: Calendar,
        color: 'green',
        details: [
          'School or education arrangements will be discussed',
          'You will learn when meals happen and what activities are available',
          'You can suggest activities or things you enjoy doing',
          'It is normal to feel up and down, that is completely okay',
        ]
      },
    ]
  },
  {
    phase: 'Your First Month',
    description: 'Settling in and making it feel more like home',
    items: [
      {
        id: 'review',
        when: 'Around 4 weeks',
        title: 'Your First Review',
        description: 'A meeting to talk about how the placement is going.',
        icon: FileText,
        color: 'purple',
        details: [
          'Your social worker, key worker, and possibly an independent person will be there',
          'They will ask your views, what is good and what could be better',
          'You can bring notes, write things down, or ask someone to speak for you',
          'This is about making sure the placement works for you',
          'You can have an advocate if you want one',
        ]
      },
      {
        id: 'family',
        when: 'Ongoing',
        title: 'Family & Friends Contact',
        description: 'Staying in touch with people who are important to you.',
        icon: Heart,
        color: 'pink',
        details: [
          'Contact arrangements will be discussed and agreed in your care plan',
          'Staff can help arrange phone calls, visits, or video calls',
          'If there are any issues with contact, talk to your social worker',
          'You have the right to maintain relationships that are safe for you',
        ]
      },
      {
        id: 'rights',
        when: 'Always',
        title: 'Knowing Your Rights',
        description: 'Understanding what you are entitled to as a young person in care.',
        icon: Star,
        color: 'amber',
        details: [
          'You have the right to be heard in all decisions about you',
          'You can access an independent advocate if you want one',
          'You can make a complaint if something is not right',
          'You have the right to privacy and to be treated with respect',
          'Childline (0800 1111) is always available if you need to talk',
        ]
      },
    ]
  },
];

interface WhatHappensNextProps {
  onBack: () => void;
}

export default function WhatHappensNext({ onBack }: WhatHappensNextProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const colorMap: Record<string, { bg: string; border: string; icon: string; dot: string }> = {
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', dot: 'bg-purple-500' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', dot: 'bg-blue-500' },
    green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', dot: 'bg-green-500' },
    pink: { bg: 'bg-pink-50', border: 'border-pink-200', icon: 'text-pink-600', dot: 'bg-pink-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', dot: 'bg-amber-500' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold flex items-center gap-1 hover:text-purple-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Menu
          </button>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-bold text-gray-800">What Happens Next</span>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Intro */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
            <h2 className="text-xl font-black text-gray-900 mb-1">What Happens When You Move In</h2>
            <p className="text-xs text-gray-600 font-medium">A guide to what you can expect in your first day, week, and month. Every home is a little different, but this is the general idea.</p>
          </motion.div>

          {/* Timeline */}
          {timelineData.map((phase, phaseIdx) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIdx * 0.1 }}
              className="mb-6"
            >
              {/* Phase header */}
              <div className="flex items-center gap-2 mb-1 px-1">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white">{phaseIdx + 1}</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{phase.phase}</h3>
                  <p className="text-xs text-gray-500">{phase.description}</p>
                </div>
              </div>

              {/* Items */}
              <div className="ml-3 border-l-2 border-purple-200 pl-4 mt-2 space-y-2">
                {phase.items.map((item) => {
                  const c = colorMap[item.color];
                  const Icon = item.icon;
                  const isExpanded = expandedItems.has(item.id);

                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggle(item.id)}
                        className={`w-full text-left ${c.bg} border ${c.border} rounded-xl p-3 transition-all cursor-pointer hover:shadow-sm`}
                      >
                        <div className="flex items-start gap-2">
                          {/* Timeline dot */}
                          <div className="relative -ml-[1.65rem] mr-1 mt-1">
                            <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                          </div>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white shadow-sm flex-shrink-0">
                            <Icon className={`w-4 h-4 ${c.icon}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">{item.when}</p>
                            <p className="text-sm font-bold text-gray-800">{item.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{item.description}</p>
                          </div>
                          {item.details && (
                            isExpanded
                              ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                              : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                          )}
                        </div>

                        {/* Expanded details */}
                        {isExpanded && item.details && (
                          <div className="mt-2 ml-9 space-y-1">
                            {item.details.map((detail, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-gray-700 leading-relaxed">{detail}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Reassurance */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-green-800 font-bold mb-0.5">Remember</p>
                <p className="text-xs text-green-700 font-medium leading-relaxed">
                  Everyone settles in at their own pace. There is no rush. If you are ever worried or confused about what is happening, just ask a member of staff, that is what they are here for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
