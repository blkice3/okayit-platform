'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Users, Plus, Trash2, ChevronRight, Phone,
  Calendar, Lock, Edit2, Save, X, UserCircle, Star, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Contact {
  id: string;
  name: string;
  role: string;
  phone?: string;
  notes?: string;
}

interface ImportantDate {
  id: string;
  label: string;
  date: string; // YYYY-MM-DD
}

interface ImportantInfo {
  contacts: Contact[];
  dates: ImportantDate[];
  placement?: string;
}

const STORAGE_KEY = 'okayit_important_info';

const roleOptions = [
  'Social Worker', 'Key Worker', 'Independent Reviewing Officer',
  'Family Member', 'Friend', 'Advocate', 'Teacher', 'CAMHS Worker',
  'Foster Carer', 'Other'
];

interface MyImportantInfoProps {
  onBack: () => void;
}

export default function MyImportantInfo({ onBack }: MyImportantInfoProps) {
  const [info, setInfo] = useState<ImportantInfo>({ contacts: [], dates: [] });
  const [mounted, setMounted] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingDate, setEditingDate] = useState<ImportantDate | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isAddingDate, setIsAddingDate] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formDateLabel, setFormDateLabel] = useState('');
  const [formDateValue, setFormDateValue] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setInfo(JSON.parse(stored));
    } catch { /* empty */ }
    setMounted(true);
  }, []);

  const saveInfo = useCallback((updated: ImportantInfo) => {
    setInfo(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch { /* storage full */ }
  }, []);

  const resetContactForm = () => {
    setFormName(''); setFormRole(''); setFormPhone(''); setFormNotes('');
    setIsAddingContact(false); setEditingContact(null);
  };

  const resetDateForm = () => {
    setFormDateLabel(''); setFormDateValue('');
    setIsAddingDate(false); setEditingDate(null);
  };

  const handleSaveContact = () => {
    if (!formName.trim() || !formRole) return;
    const contact: Contact = {
      id: editingContact?.id || Date.now().toString(),
      name: formName.trim(),
      role: formRole,
      phone: formPhone.trim() || undefined,
      notes: formNotes.trim() || undefined,
    };
    const updated = editingContact
      ? { ...info, contacts: info.contacts.map(c => c.id === contact.id ? contact : c) }
      : { ...info, contacts: [...info.contacts, contact] };
    saveInfo(updated);
    resetContactForm();
  };

  const handleSaveDate = () => {
    if (!formDateLabel.trim() || !formDateValue) return;
    const dateItem: ImportantDate = {
      id: editingDate?.id || Date.now().toString(),
      label: formDateLabel.trim(),
      date: formDateValue,
    };
    const updated = editingDate
      ? { ...info, dates: info.dates.map(d => d.id === dateItem.id ? dateItem : d) }
      : { ...info, dates: [...info.dates, dateItem] };
    saveInfo(updated);
    resetDateForm();
  };

  const handleDeleteContact = (id: string) => {
    saveInfo({ ...info, contacts: info.contacts.filter(c => c.id !== id) });
    setDeleteConfirmId(null);
  };

  const handleDeleteDate = (id: string) => {
    saveInfo({ ...info, dates: info.dates.filter(d => d.id !== id) });
    setDeleteConfirmId(null);
  };

  const startEditContact = (c: Contact) => {
    setFormName(c.name); setFormRole(c.role); setFormPhone(c.phone || ''); setFormNotes(c.notes || '');
    setEditingContact(c); setIsAddingContact(true);
  };

  const startEditDate = (d: ImportantDate) => {
    setFormDateLabel(d.label); setFormDateValue(d.date);
    setEditingDate(d); setIsAddingDate(true);
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch { return dateStr; }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-4 py-2 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 text-purple-600 text-sm font-bold flex items-center gap-1 hover:text-purple-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Menu
          </button>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-gray-800">My Important Info</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Lock className="w-3 h-3" />
            <span>Private</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                This information is stored only on this device. Nobody else can see it. It is here so you have important details when you need them.
              </p>
            </div>
          </div>

          {/* ====== MY PEOPLE ====== */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">My People</h3>
              {!isAddingContact && (
                <button onClick={() => { resetContactForm(); setIsAddingContact(true); }} className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer">
                  <Plus className="w-3 h-3" /> Add
                </button>
              )}
            </div>

            {/* Add/Edit Contact Form */}
            <AnimatePresence>
              {isAddingContact && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-white border border-purple-200 rounded-xl p-3 mb-3 shadow-sm overflow-hidden"
                >
                  <div className="space-y-2">
                    <input
                      type="text" value={formName} onChange={e => setFormName(e.target.value)}
                      placeholder="Name" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <select
                      value={formRole} onChange={e => setFormRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                    >
                      <option value="">Select their role...</option>
                      {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <input
                      type="tel" value={formPhone} onChange={e => setFormPhone(e.target.value)}
                      placeholder="Phone number (optional)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <input
                      type="text" value={formNotes} onChange={e => setFormNotes(e.target.value)}
                      placeholder="Notes (optional)" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    />
                    <div className="flex gap-2 justify-end pt-1">
                      <Button variant="outline" size="sm" className="text-xs" onClick={resetContactForm}><X className="w-3 h-3 mr-1" /> Cancel</Button>
                      <Button size="sm" className="text-xs bg-purple-600 hover:bg-purple-700 text-white" disabled={!formName.trim() || !formRole} onClick={handleSaveContact}>
                        <Save className="w-3 h-3 mr-1" /> {editingContact ? 'Update' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contacts List */}
            {info.contacts.length === 0 && !isAddingContact ? (
              <div className="text-center py-6">
                <UserCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Add people who are important to you</p>
              </div>
            ) : (
              <div className="space-y-2">
                {info.contacts.map(c => (
                  <div key={c.id} className="relative">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-white">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-blue-50 flex-shrink-0">
                        <UserCircle className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.role}</p>
                        {c.phone && (
                          <a href={`tel:${c.phone}`} className="text-xs text-purple-600 font-medium flex items-center gap-0.5 mt-0.5">
                            <Phone className="w-3 h-3" /> {c.phone}
                          </a>
                        )}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => startEditContact(c)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"><Edit2 className="w-3.5 h-3.5 text-gray-400" /></button>
                        <button onClick={() => setDeleteConfirmId(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                      </div>
                    </div>
                    {deleteConfirmId === c.id && (
                      <div className="absolute inset-0 bg-red-50 border border-red-300 rounded-xl flex items-center justify-center gap-2 px-3 z-10">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold text-red-700">Remove?</span>
                        <Button size="sm" variant="destructive" className="text-xs h-7" onClick={() => handleDeleteContact(c.id)}>Yes</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setDeleteConfirmId(null)}>No</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ====== IMPORTANT DATES ====== */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Important Dates</h3>
              {!isAddingDate && (
                <button onClick={() => { resetDateForm(); setIsAddingDate(true); }} className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5 cursor-pointer">
                  <Plus className="w-3 h-3" /> Add
                </button>
              )}
            </div>

            {/* Add/Edit Date Form */}
            <AnimatePresence>
              {isAddingDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-white border border-blue-200 rounded-xl p-3 mb-3 shadow-sm overflow-hidden"
                >
                  <div className="space-y-2">
                    <input
                      type="text" value={formDateLabel} onChange={e => setFormDateLabel(e.target.value)}
                      placeholder="What is this date for? (e.g. My Review, Birthday)"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <input
                      type="date" value={formDateValue} onChange={e => setFormDateValue(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <div className="flex gap-2 justify-end pt-1">
                      <Button variant="outline" size="sm" className="text-xs" onClick={resetDateForm}><X className="w-3 h-3 mr-1" /> Cancel</Button>
                      <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white" disabled={!formDateLabel.trim() || !formDateValue} onClick={handleSaveDate}>
                        <Save className="w-3 h-3 mr-1" /> {editingDate ? 'Update' : 'Save'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {info.dates.length === 0 && !isAddingDate ? (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Add dates you want to remember</p>
              </div>
            ) : (
              <div className="space-y-2">
                {info.dates.map(d => (
                  <div key={d.id} className="relative">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-gray-200 bg-white">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-amber-50 flex-shrink-0">
                        <Star className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800">{d.label}</p>
                        <p className="text-xs text-gray-500">{formatDateDisplay(d.date)}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => startEditDate(d)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"><Edit2 className="w-3.5 h-3.5 text-gray-400" /></button>
                        <button onClick={() => setDeleteConfirmId('d_' + d.id)} className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"><Trash2 className="w-3.5 h-3.5 text-gray-400" /></button>
                      </div>
                    </div>
                    {deleteConfirmId === 'd_' + d.id && (
                      <div className="absolute inset-0 bg-red-50 border border-red-300 rounded-xl flex items-center justify-center gap-2 px-3 z-10">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-xs font-bold text-red-700">Remove?</span>
                        <Button size="sm" variant="destructive" className="text-xs h-7" onClick={() => handleDeleteDate(d.id)}>Yes</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setDeleteConfirmId(null)}>No</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Placement Info */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Tip</h3>
            <p className="text-xs text-green-700 font-medium leading-relaxed">
              You can store your social worker&apos;s number, your advocate&apos;s details, family contacts, review dates, and anything else important to you here. It is all kept private on this device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
