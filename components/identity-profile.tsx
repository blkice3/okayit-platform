'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Heart, Star, Palette, Music, BookOpen,
  Gamepad2, Camera, Sparkles, PenLine, Save,
  ChevronLeft, Calendar, MapPin, Phone, Shield,
  Download, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import VoiceInputButton from '@/components/voice-input-button';

const STORAGE_KEY = 'okayit-identity-profile';

const AVATAR_EMOJIS = [
  '😊', '😎', '🤩', '😇', '🥰', '🤓', '🧑\u200d🎨', '🧑\u200d🚀',
  '🦁', '🦄', '🐻', '🐶', '🐱', '🐬', '🦋', '🌟',
  '🌈', '🌻', '⚽', '🎸', '🎮', '🎨', '📚', '🍕',
];

const INTEREST_OPTIONS = [
  { id: 'music', label: 'Music', icon: Music, color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'art', label: 'Art & Drawing', icon: Palette, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'reading', label: 'Reading', icon: BookOpen, color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'sports', label: 'Sports', icon: Star, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'photography', label: 'Photography', icon: Camera, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { id: 'cooking', label: 'Cooking', icon: Heart, color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'nature', label: 'Nature', icon: Sparkles, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'writing', label: 'Writing', icon: PenLine, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'animals', label: 'Animals', icon: Heart, color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { id: 'film', label: 'Films & TV', icon: Star, color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { id: 'dance', label: 'Dance', icon: Music, color: 'bg-rose-100 text-rose-700 border-rose-200' },
];

interface IdentityData {
  nickname: string;
  avatar: string;
  pronouns: string;
  birthday: string;
  favouriteColour: string;
  interests: string[];
  dream: string;
  superpower: string;
  safePlace: string;
  trustedAdult: string;
  trustedAdultContact: string;
  aboutMe: string;
}

const DEFAULT_DATA: IdentityData = {
  nickname: '',
  avatar: '😊',
  pronouns: '',
  birthday: '',
  favouriteColour: '',
  interests: [],
  dream: '',
  superpower: '',
  safePlace: '',
  trustedAdult: '',
  trustedAdultContact: '',
  aboutMe: '',
};

interface IdentityProfileProps {
  onBack: () => void;
}

export default function IdentityProfile({ onBack }: IdentityProfileProps) {
  const { data: session, update } = useSession();
  const [data, setData] = useState<IdentityData>(DEFAULT_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData({ ...DEFAULT_DATA, ...parsed });
      }
    } catch {}
    setHasLoaded(true);
  }, []);

  const save = async () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Sync nickname to DB as displayName so it reflects across the platform
      const nameToSync = data.nickname?.trim();
      if (nameToSync && session?.user) {
        try {
          const res = await fetch('/api/profile', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayName: nameToSync }),
          });
          if (res.ok) {
            // Trigger session update so greeting/header uses new name
            await update({ displayName: nameToSync });
          }
        } catch {}
      }
      toast.success('Profile saved!');
      setIsEditing(false);
    } catch {
      toast.error('Could not save your profile');
    }
  };

  const toggleInterest = (id: string) => {
    setData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : [...prev.interests, id],
    }));
  };

  const downloadMyData = async () => {
    setIsDownloading(true);
    try {
      // Determine anonymousId: session user id > device_id from localStorage
      const anonymousId = (session as any)?.user?.id || localStorage.getItem('device_id') || '';
      if (!anonymousId) {
        toast.error('Unable to identify your account. Try checking in first.');
        return;
      }

      const res = await fetch('/api/leaver-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ anonymousId, identityProfile: data }),
      });

      if (!res.ok) {
        toast.error('Failed to generate your data export');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OKAYiT_My_Profile_${data.nickname || 'export'}_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Your data has been downloaded!');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const isEmpty = !data.nickname && !data.aboutMe && data.interests.length === 0;

  if (!hasLoaded) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-pink-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-violet-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-violet-100 transition">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">About Me</h1>
          <Button
            size="sm"
            onClick={() => isEditing ? save() : setIsEditing(true)}
            className={isEditing
              ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold rounded-full px-5'
              : 'bg-violet-100 text-violet-700 font-bold rounded-full px-5 hover:bg-violet-200'
            }
          >
            {isEditing ? <><Save className="w-4 h-4 mr-1" /> Save</> : <><PenLine className="w-4 h-4 mr-1" /> Edit</>}
          </Button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Avatar & Name Card */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-pink-500 p-6 text-center relative">
            {/* Avatar */}
            <button
              onClick={() => isEditing && setShowAvatarPicker(!showAvatarPicker)}
              className="relative mx-auto w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-5xl hover:scale-105 transition"
              disabled={!isEditing}
            >
              {data.avatar}
              {isEditing && (
                <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center">
                  <PenLine className="w-3.5 h-3.5 text-white" />
                </span>
              )}
            </button>

            {/* Avatar picker */}
            <AnimatePresence>
              {showAvatarPicker && isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 grid grid-cols-8 gap-2 bg-white/20 rounded-xl p-3"
                >
                  {AVATAR_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => { setData({ ...data, avatar: emoji }); setShowAvatarPicker(false); }}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl transition hover:bg-white/40 ${
                        data.avatar === emoji ? 'bg-white/60 ring-2 ring-white' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name */}
            <div className="mt-4">
              {isEditing ? (
                <Input
                  value={data.nickname}
                  onChange={(e) => setData({ ...data, nickname: e.target.value })}
                  placeholder="Your name or nickname"
                  className="text-center text-xl font-bold bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-full h-12"
                  maxLength={30}
                />
              ) : (
                <h2 className="text-2xl font-black text-white">
                  {data.nickname || 'Your Name'}
                </h2>
              )}
            </div>

            {/* Pronouns */}
            {isEditing ? (
              <Input
                value={data.pronouns}
                onChange={(e) => setData({ ...data, pronouns: e.target.value })}
                placeholder="Pronouns (e.g. she/her, he/him, they/them)"
                className="mt-2 text-center text-sm bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-full"
                maxLength={30}
              />
            ) : data.pronouns ? (
              <p className="text-white/80 text-sm mt-1">{data.pronouns}</p>
            ) : null}
          </div>

          {/* Quick Info */}
          <CardContent className="p-5 space-y-4">
            {/* Birthday */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-violet-500 shrink-0" />
              {isEditing ? (
                <Input
                  type="date"
                  value={data.birthday}
                  onChange={(e) => setData({ ...data, birthday: e.target.value })}
                  className="flex-1 border-gray-200"
                />
              ) : (
                <span className="text-gray-700">{data.birthday ? new Date(data.birthday + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : 'Birthday not set'}</span>
              )}
            </div>

            {/* Favourite colour */}
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-pink-500 shrink-0" />
              {isEditing ? (
                <Input
                  value={data.favouriteColour}
                  onChange={(e) => setData({ ...data, favouriteColour: e.target.value })}
                  placeholder="Favourite colour"
                  className="flex-1 border-gray-200"
                  maxLength={30}
                />
              ) : (
                <span className="text-gray-700">{data.favouriteColour || 'Favourite colour not set'}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" /> Things I Like
            </h3>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = data.interests.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => isEditing && toggleInterest(opt.id)}
                    disabled={!isEditing}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-semibold transition ${
                      isSelected
                        ? opt.color + ' ring-2 ring-offset-1 ring-violet-300'
                        : isEditing
                          ? 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                          : 'bg-gray-50 text-gray-400 border-gray-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {opt.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* About Me */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-violet-500" /> About Me
              {isEditing && <VoiceInputButton onTranscript={(t) => setData(prev => ({ ...prev, aboutMe: prev.aboutMe ? prev.aboutMe + ' ' + t : t }))} />}
            </h3>
            {isEditing ? (
              <textarea
                value={data.aboutMe}
                onChange={(e) => setData({ ...data, aboutMe: e.target.value })}
                placeholder="Anything you want people to know about you... (or tap 🎤 to speak)"
                className="w-full p-3 rounded-xl border border-gray-200 text-base min-h-[100px] resize-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
                maxLength={500}
              />
            ) : (
              <p className="text-gray-600 leading-relaxed">{data.aboutMe || 'Tell us something about yourself...'}</p>
            )}
          </CardContent>
        </Card>

        {/* Dreams & Superpowers */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> My Dream
              </h3>
              {isEditing ? (
                <Input
                  value={data.dream}
                  onChange={(e) => setData({ ...data, dream: e.target.value })}
                  placeholder="What's your dream for the future?"
                  className="border-gray-200"
                  maxLength={200}
                />
              ) : (
                <p className="text-gray-600">{data.dream || 'Not set yet'}</p>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" /> My Superpower
              </h3>
              {isEditing ? (
                <Input
                  value={data.superpower}
                  onChange={(e) => setData({ ...data, superpower: e.target.value })}
                  placeholder="What are you really good at?"
                  className="border-gray-200"
                  maxLength={200}
                />
              ) : (
                <p className="text-gray-600">{data.superpower || 'Not set yet'}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Safe Place & Trusted Adult */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" /> My Safe Place
              </h3>
              {isEditing ? (
                <Input
                  value={data.safePlace}
                  onChange={(e) => setData({ ...data, safePlace: e.target.value })}
                  placeholder="Where do you feel safest?"
                  className="border-gray-200"
                  maxLength={200}
                />
              ) : (
                <p className="text-gray-600">{data.safePlace || 'Not set yet'}</p>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" /> My Trusted Adult
              </h3>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={data.trustedAdult}
                    onChange={(e) => setData({ ...data, trustedAdult: e.target.value })}
                    placeholder="Name of someone you trust"
                    className="border-gray-200"
                    maxLength={100}
                  />
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Input
                      value={data.trustedAdultContact}
                      onChange={(e) => setData({ ...data, trustedAdultContact: e.target.value })}
                      placeholder="Their phone number (optional)"
                      className="border-gray-200"
                      maxLength={20}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600">{data.trustedAdult || 'Not set yet'}</p>
                  {data.trustedAdultContact && (
                    <a href={`tel:${data.trustedAdultContact}`} className="text-sm text-violet-600 underline mt-1 inline-flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {data.trustedAdultContact}
                    </a>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* First-time prompt */}
        {isEmpty && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6"
          >
            <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Make this yours!</h3>
            <p className="text-gray-500 text-sm mb-4">Tap Edit to add your name, avatar, interests, and more.</p>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold rounded-full px-8"
            >
              <PenLine className="w-4 h-4 mr-2" /> Get Started
            </Button>
          </motion.div>
        )}

        {/* Download My Data — Sovereign Identity */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-blue-900 text-sm">Download My Data</h3>
                <p className="text-xs text-blue-700 mt-0.5">
                  Your data belongs to you. Download a PDF with your profile, wellbeing history, achievements, and journal, take it with you wherever you go.
                </p>
                <Button
                  onClick={downloadMyData}
                  disabled={isDownloading}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-5 text-sm h-9"
                >
                  {isDownloading ? (
                    <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Generating...</>
                  ) : (
                    <><Download className="w-4 h-4 mr-1.5" /> Download My Profile PDF</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy note */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 pb-8">
          This profile is stored only on your device. Staff cannot see it unless you choose to share.
        </p>
      </div>
    </div>
  );
}
