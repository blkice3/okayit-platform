'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Shield, Plus, Trash2, Edit2, Save, X,
  AlertTriangle, Heart, Phone, MapPin, Lock, Info, CheckCircle, WifiOff, Cloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VoiceInputButton from '@/components/voice-input-button';

interface SafetyPlan {
  warningsigns: string[];
  copingStrategies: string[];
  safePeople: { name: string; phone?: string }[];
  safePlaces: string[];
  reasonsToStaySafe: string[];
  professionalContacts: { name: string; role: string; phone?: string }[];
  lastUpdated?: string;
}

const STORAGE_KEY = 'okayit_safety_plan';

const DEFAULT_PLAN: SafetyPlan = {
  warningsigns: [],
  copingStrategies: [],
  safePeople: [],
  safePlaces: [],
  reasonsToStaySafe: [],
  professionalContacts: [],
};

const SECTION_CONFIG = [
  {
    key: 'warningsigns' as const,
    title: 'Warning Signs',
    description: 'Things that tell me I might be starting to feel unsafe or upset',
    icon: AlertTriangle,
    color: 'amber',
    placeholder: 'e.g. I stop wanting to eat, I feel angry all the time...',
    examples: ['Feeling really angry', 'Not sleeping well', 'Wanting to be alone all the time', 'Feeling numb or empty', 'Snapping at people'],
  },
  {
    key: 'copingStrategies' as const,
    title: 'Things That Help Me Cope',
    description: 'Activities or things I can do to feel better when I am struggling',
    icon: Heart,
    color: 'green',
    placeholder: 'e.g. Listen to music, go for a walk, draw...',
    examples: ['Listen to my favourite music', 'Go for a walk', 'Draw or colour', 'Take deep breaths', 'Watch a funny video', 'Have a warm drink'],
  },
  {
    key: 'safePlaces' as const,
    title: 'My Safe Places',
    description: 'Places where I feel calm and safe',
    icon: MapPin,
    color: 'blue',
    placeholder: 'e.g. My bedroom, the garden, the library...',
    examples: ['My bedroom', 'The garden', 'The quiet room', 'The park'],
  },
  {
    key: 'reasonsToStaySafe' as const,
    title: 'Reasons to Stay Safe',
    description: 'Things that matter to me and keep me going',
    icon: Heart,
    color: 'pink',
    placeholder: 'e.g. My pet, seeing my family, my favourite hobby...',
    examples: ['My family', 'My friends', 'My pet', 'Music', 'Getting to do things I enjoy'],
  },
];

interface MySafetyPlanProps {
  onBack: () => void;
}

export default function MySafetyPlan({ onBack }: MySafetyPlanProps) {
  const [plan, setPlan] = useState<SafetyPlan>(DEFAULT_PLAN);
  const [mounted, setMounted] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  // Safe people form
  const [personName, setPersonName] = useState('');
  const [personPhone, setPersonPhone] = useState('');
  // Professional contacts form
  const [proName, setProName] = useState('');
  const [proRole, setProRole] = useState('');
  const [proPhone, setProPhone] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPlan(JSON.parse(stored));
    } catch { /* empty */ }
    setMounted(true);

    // Offline awareness — reassure the young person their plan is always reachable
    const update = () => setIsOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  const savePlan = useCallback((updated: SafetyPlan) => {
    updated.lastUpdated = new Date().toISOString();
    setPlan(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch { /* storage full */ }
  }, []);

  const addStringItem = (key: 'warningsigns' | 'copingStrategies' | 'safePlaces' | 'reasonsToStaySafe') => {
    if (!inputValue.trim()) return;
    const updated = { ...plan, [key]: [...plan[key], inputValue.trim()] };
    savePlan(updated);
    setInputValue('');
  };

  const removeStringItem = (key: 'warningsigns' | 'copingStrategies' | 'safePlaces' | 'reasonsToStaySafe', index: number) => {
    const updated = { ...plan, [key]: plan[key].filter((_, i) => i !== index) };
    savePlan(updated);
  };

  const addSafePerson = () => {
    if (!personName.trim()) return;
    const updated = { ...plan, safePeople: [...plan.safePeople, { name: personName.trim(), phone: personPhone.trim() || undefined }] };
    savePlan(updated);
    setPersonName(''); setPersonPhone('');
  };

  const removeSafePerson = (index: number) => {
    const updated = { ...plan, safePeople: plan.safePeople.filter((_, i) => i !== index) };
    savePlan(updated);
  };

  const addProfessional = () => {
    if (!proName.trim() || !proRole.trim()) return;
    const updated = { ...plan, professionalContacts: [...plan.professionalContacts, { name: proName.trim(), role: proRole.trim(), phone: proPhone.trim() || undefined }] };
    savePlan(updated);
    setProName(''); setProRole(''); setProPhone('');
  };

  const removeProfessional = (index: number) => {
    const updated = { ...plan, professionalContacts: plan.professionalContacts.filter((_, i) => i !== index) };
    savePlan(updated);
  };

  const colorMap: Record<string, { bg: string; border: string; text: string; icon: string; badge: string }> = {
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: 'text-amber-500', badge: 'bg-amber-100 text-amber-700' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-500', badge: 'bg-green-100 text-green-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-500', badge: 'bg-blue-100 text-blue-700' },
    pink: { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800', icon: 'text-pink-500', badge: 'bg-pink-100 text-pink-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', icon: 'text-purple-500', badge: 'bg-purple-100 text-purple-700' },
  };

  if (!mounted) return null;

  const totalItems = plan.warningsigns.length + plan.copingStrategies.length + plan.safePeople.length + plan.safePlaces.length + plan.reasonsToStaySafe.length + plan.professionalContacts.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold flex items-center gap-1 hover:text-purple-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Menu
          </button>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-gray-800">My Safety Plan</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>Private</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Intro */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-green-800 font-bold mb-0.5">Your personal safety plan</p>
                <p className="text-xs text-green-700 font-medium leading-relaxed">
                  This is a plan you can fill in with things that help you when you are struggling. It stays private on this device. You might want to do this with your key worker or a trusted adult.
                </p>
                <div className={`mt-2 inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${isOffline ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                  {isOffline ? <WifiOff className="w-3 h-3" /> : <Cloud className="w-3 h-3" />}
                  {isOffline ? "You're offline, your plan is still here" : 'Saved on this device, works offline too'}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency reminder */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5">
            <p className="text-xs text-red-700 font-bold flex items-center gap-1">
              <Phone className="w-3 h-3" />
              If you are in immediate danger, call 999 or talk to a staff member right now.
            </p>
          </div>

          {/* String-based sections */}
          {SECTION_CONFIG.map((section) => {
            const c = colorMap[section.color];
            const Icon = section.icon;
            const items = plan[section.key] as string[];
            const isEditing = editingSection === section.key;

            return (
              <div key={section.key} className="mb-5">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${c.icon}`} />
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{section.title}</h3>
                    {items.length > 0 && <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${c.badge}`}>{items.length}</span>}
                  </div>
                  {!isEditing && (
                    <button onClick={() => { setEditingSection(section.key); setInputValue(''); }} className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2 px-1">{section.description}</p>

                {/* Add form */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className={`${c.bg} border ${c.border} rounded-xl p-3 mb-2`}>
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text" value={inputValue} onChange={e => setInputValue(e.target.value)}
                            placeholder={section.placeholder}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                            onKeyDown={e => { if (e.key === 'Enter') addStringItem(section.key); }}
                            autoFocus
                          />
                          <VoiceInputButton onTranscript={(t) => setInputValue(prev => prev ? prev + ' ' + t : t)} />
                        </div>
                        {/* Example suggestions */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {section.examples.filter(ex => !items.includes(ex)).slice(0, 4).map(ex => (
                            <button
                              key={ex}
                              onClick={() => { setInputValue(ex); }}
                              className="text-xs px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-purple-300 cursor-pointer"
                            >
                              {ex}
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" className="text-xs" onClick={() => setEditingSection(null)}><X className="w-3 h-3 mr-1" /> Done</Button>
                          <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700 text-white" disabled={!inputValue.trim()} onClick={() => addStringItem(section.key)}>
                            <Plus className="w-3 h-3 mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Items */}
                {items.length === 0 && !isEditing ? (
                  <div className={`${c.bg} border ${c.border} rounded-xl p-3 text-center`}>
                    <p className="text-xs text-gray-500">None added yet. Tap "Add" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {items.map((item, idx) => (
                      <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white`}>
                        <CheckCircle className={`w-4 h-4 ${c.icon} flex-shrink-0`} />
                        <span className="text-sm text-gray-800 flex-1">{item}</span>
                        <button onClick={() => removeStringItem(section.key, idx)} className="p-1 rounded hover:bg-red-50 cursor-pointer">
                          <Trash2 className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Safe People */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-purple-500" />
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">People I Can Call or Talk To</h3>
                {plan.safePeople.length > 0 && <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">{plan.safePeople.length}</span>}
              </div>
              {editingSection !== 'safePeople' && (
                <button onClick={() => { setEditingSection('safePeople'); setPersonName(''); setPersonPhone(''); }} className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer">
                  <Plus className="w-3 h-3" /> Add
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2 px-1">People I trust who I can reach out to when things are hard</p>

            <AnimatePresence>
              {editingSection === 'safePeople' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-2">
                    <input type="text" value={personName} onChange={e => setPersonName(e.target.value)} placeholder="Their name" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 mb-2" autoFocus />
                    <input type="tel" value={personPhone} onChange={e => setPersonPhone(e.target.value)} placeholder="Phone number (optional)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 mb-2" />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => setEditingSection(null)}><X className="w-3 h-3 mr-1" /> Done</Button>
                      <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700 text-white" disabled={!personName.trim()} onClick={addSafePerson}>
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {plan.safePeople.length === 0 && editingSection !== 'safePeople' ? (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Add people you trust, friends, family, staff.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {plan.safePeople.map((person, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white">
                    <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">{person.name}</p>
                      {person.phone && <a href={`tel:${person.phone}`} className="text-xs text-purple-600">{person.phone}</a>}
                    </div>
                    <button onClick={() => removeSafePerson(idx)} className="p-1 rounded hover:bg-red-50 cursor-pointer">
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Professional Contacts */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-500" />
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Professional Support</h3>
                {plan.professionalContacts.length > 0 && <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">{plan.professionalContacts.length}</span>}
              </div>
              {editingSection !== 'professionals' && (
                <button onClick={() => { setEditingSection('professionals'); setProName(''); setProRole(''); setProPhone(''); }} className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer">
                  <Plus className="w-3 h-3" /> Add
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2 px-1">Professionals who can help (social worker, CAMHS, key worker, etc.)</p>

            <AnimatePresence>
              {editingSection === 'professionals' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-2">
                    <input type="text" value={proName} onChange={e => setProName(e.target.value)} placeholder="Their name" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2" autoFocus />
                    <input type="text" value={proRole} onChange={e => setProRole(e.target.value)} placeholder="Their role (e.g. Social Worker, Key Worker)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2" />
                    <input type="tel" value={proPhone} onChange={e => setProPhone(e.target.value)} placeholder="Phone number (optional)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2" />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => setEditingSection(null)}><X className="w-3 h-3 mr-1" /> Done</Button>
                      <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white" disabled={!proName.trim() || !proRole.trim()} onClick={addProfessional}>
                        <Plus className="w-3 h-3 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {plan.professionalContacts.length === 0 && editingSection !== 'professionals' ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Add professionals you work with, social worker, key worker, CAMHS, etc.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {plan.professionalContacts.map((pro, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white">
                    <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800">{pro.name}</p>
                      <p className="text-xs text-gray-500">{pro.role}</p>
                      {pro.phone && <a href={`tel:${pro.phone}`} className="text-xs text-blue-600">{pro.phone}</a>}
                    </div>
                    <button onClick={() => removeProfessional(idx)} className="p-1 rounded hover:bg-red-50 cursor-pointer">
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified helplines reminder */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4">
            <h4 className="text-xs font-bold text-purple-800 mb-1.5">24/7 Helplines (Always Available)</h4>
            <div className="space-y-1">
              {[
                { name: 'Childline', number: '0800 1111', note: 'Free, confidential' },
                { name: 'Emergency', number: '999', note: 'If in immediate danger' },
                { name: 'Samaritans', number: '116 123', note: 'Any time, free' },
                { name: 'Crisis Text', number: 'Text SHOUT to 85258', note: 'Free text support' },
              ].map(h => (
                <div key={h.name} className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-medium">{h.name}</span>
                  <a href={h.number.startsWith('Text') ? `sms:85258` : `tel:${h.number.replace(/\s/g, '')}`} className="text-xs font-bold text-purple-600">{h.number}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Last updated */}
          {plan.lastUpdated && totalItems > 0 && (
            <p className="text-xs text-gray-400 text-center mb-4">
              Last updated: {new Date(plan.lastUpdated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
