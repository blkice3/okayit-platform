'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, BookOpen, Plus, Trash2, ChevronRight,
  Lightbulb, Calendar, Lock, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import VoiceInputButton from '@/components/voice-input-button';

interface JournalEntry {
  id: string;
  text: string;
  prompt?: string;
  createdAt: string;
}

const STORAGE_KEY = 'okayit_private_journal';

const journalPrompts = [
  'What is one thing that made me smile today?',
  'Something I am proud of this week...',
  'If I could talk to my future self, I would say...',
  'A person who helped me recently was...',
  'One thing I want to get better at...',
  'Today I felt brave when...',
  'Something that is worrying me right now...',
  'A place where I feel safe and calm is...',
  'What would make tomorrow a good day?',
  'Three things I am grateful for...',
  'A song or film that describes how I feel right now...',
  'Something new I learned about myself...',
  'If I could change one thing about today...',
  'A happy memory I want to remember...',
  'What I need more of in my life right now...',
];

interface MyPrivateJournalProps {
  onBack: () => void;
}

export default function MyPrivateJournal({ onBack }: MyPrivateJournalProps) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'list' | 'write' | 'read'>('list');
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [text, setText] = useState('');
  const [activePrompt, setActivePrompt] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch { /* empty */ }
    setMounted(true);
  }, []);

  const saveEntries = useCallback((updated: JournalEntry[]) => {
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch { /* storage full */ }
  }, []);

  const handleSave = () => {
    if (!text.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      text: text.trim(),
      prompt: activePrompt || undefined,
      createdAt: new Date().toISOString(),
    };
    saveEntries([entry, ...entries]);
    setText('');
    setActivePrompt('');
    setView('list');
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
    setDeleteConfirmId(null);
    if (currentEntry?.id === id) {
      setCurrentEntry(null);
      setView('list');
    }
  };

  const startNew = (prompt?: string) => {
    setText('');
    setActivePrompt(prompt || '');
    setView('write');
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    } catch { return ''; }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={view === 'list' ? onBack : () => setView('list')} className="text-purple-600 text-sm font-bold flex items-center gap-1 hover:text-purple-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {view === 'list' ? 'Menu' : 'Back'}
          </button>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-bold text-gray-800">My Private Journal</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Lock className="w-3 h-3" />
            <span>Private</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ====== LIST VIEW ====== */}
            {view === 'list' && (
              <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Info Banner */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-purple-700 font-medium leading-relaxed">
                      Everything you write here stays on this device only. Nobody else can read it. You can delete entries any time.
                    </p>
                  </div>
                </div>

                {/* New Entry Button */}
                <button
                  onClick={() => startNew()}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-purple-300 bg-purple-50 hover:bg-purple-100 transition-all mb-4 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white shadow-sm">
                    <Plus className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-purple-800">Write Something New</p>
                    <p className="text-xs text-gray-600">Whatever is on your mind</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Prompts */}
                <div className="mb-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Need Inspiration?</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {journalPrompts.slice(0, 6).map((p) => (
                      <button
                        key={p}
                        onClick={() => startNew(p)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                      >
                        <Lightbulb className="w-3 h-3" />
                        {p.length > 35 ? p.slice(0, 35) + '...' : p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Entries */}
                {entries.length === 0 ? (
                  <div className="text-center py-10">
                    <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-500">No entries yet</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tap "Write Something New" to get started</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Your Entries ({entries.length})</h3>
                    <div className="space-y-2">
                      {entries.map((entry) => (
                        <div key={entry.id} className="relative">
                          <button
                            onClick={() => { setCurrentEntry(entry); setView('read'); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/30 transition-all text-left cursor-pointer"
                          >
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-50 flex-shrink-0">
                              <Calendar className="w-4 h-4 text-purple-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-gray-800 truncate">
                                {entry.prompt || entry.text.slice(0, 50)}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatDate(entry.createdAt)} at {formatTime(entry.createdAt)}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </button>

                          {/* Delete confirm overlay */}
                          {deleteConfirmId === entry.id && (
                            <div className="absolute inset-0 bg-red-50 border border-red-300 rounded-xl flex items-center justify-center gap-2 px-3 z-10">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-xs font-bold text-red-700">Delete this entry?</span>
                              <Button size="sm" variant="destructive" className="text-xs h-7" onClick={() => handleDelete(entry.id)}>Yes, Delete</Button>
                              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ====== WRITE VIEW ====== */}
            {view === 'write' && (
              <motion.div key="write" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {activePrompt && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800 font-medium">{activePrompt}</p>
                    </div>
                  </div>
                )}
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={activePrompt ? 'Write your thoughts here... (or tap 🎤 to speak)' : 'What is on your mind? (or tap 🎤 to speak)'}
                    className="w-full min-h-[200px] p-3 pr-12 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300 resize-y"
                    autoFocus
                  />
                  <div className="absolute top-2 right-2">
                    <VoiceInputButton onTranscript={(t) => setText(prev => prev ? prev + ' ' + t : t)} />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{text.length} characters</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setView('list')} className="text-xs">
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={!text.trim()} className="text-xs bg-purple-600 hover:bg-purple-700 text-white">
                      Save Entry
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ====== READ VIEW ====== */}
            {view === 'read' && currentEntry && (
              <motion.div key="read" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  {currentEntry.prompt && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-3">
                      <p className="text-xs text-amber-700 font-medium flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" /> {currentEntry.prompt}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mb-2">
                    {formatDate(currentEntry.createdAt)} at {formatTime(currentEntry.createdAt)}
                  </p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {currentEntry.text}
                  </p>
                </div>
                <div className="flex justify-end mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setDeleteConfirmId(currentEntry.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete This Entry
                  </Button>
                </div>
                {deleteConfirmId === currentEntry.id && (
                  <div className="bg-red-50 border border-red-300 rounded-xl p-3 mt-2 flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-red-700">Permanently delete?</span>
                    <Button size="sm" variant="destructive" className="text-xs h-7" onClick={() => handleDelete(currentEntry.id)}>Yes</Button>
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setDeleteConfirmId(null)}>No</Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
