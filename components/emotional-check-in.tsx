

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Smile, 
  Meh, 
  Frown, 
  Heart, 
  Zap, 
  Cloud, 
  Sun, 
  CloudRain,
  Sparkles,
  ThumbsUp,
  Send
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { okayitTheme, tikTokTransitions } from '@/lib/okayit-theme';
import { toast } from 'sonner';
import VoiceInputButton from '@/components/voice-input-button';
import CelebrationMoment from '@/components/celebration-moment';

const moodOptions = [
  { 
    id: 'great', 
    label: 'Feeling Great!', 
    icon: Smile, 
    color: 'from-green-400 to-emerald-500',
    emoji: '😊'
  },
  { 
    id: 'good', 
    label: 'Pretty Good', 
    icon: Sun, 
    color: 'from-yellow-400 to-orange-400',
    emoji: '🙂'
  },
  { 
    id: 'okay', 
    label: 'Just Okay', 
    icon: Meh, 
    color: 'from-blue-400 to-cyan-400',
    emoji: '😐'
  },
  { 
    id: 'struggling', 
    label: 'Bit Tough', 
    icon: Cloud, 
    color: 'from-slate-400 to-slate-500',
    emoji: '😔'
  },
  { 
    id: 'difficult', 
    label: 'Really Hard', 
    icon: CloudRain, 
    color: 'from-indigo-400 to-purple-500',
    emoji: '😢'
  }
];

const emotionOptions = [
  { id: 'happy', label: 'Happy', icon: Smile },
  { id: 'excited', label: 'Excited', icon: Zap },
  { id: 'calm', label: 'Calm', icon: Heart },
  { id: 'worried', label: 'Worried', icon: Cloud },
  { id: 'angry', label: 'Angry', icon: Frown },
  { id: 'lonely', label: 'Lonely', icon: CloudRain }
];

interface EmotionalCheckInProps {
  onComplete?: (data: any) => void;
}

export default function EmotionalCheckIn({ onComplete }: EmotionalCheckInProps) {
  const [step, setStep] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setTimeout(() => setStep(2), 300);
  };

  const toggleEmotion = (emotionId: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotionId)
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const checkInData = {
      mood: selectedMood,
      emotions: selectedEmotions,
      note: note,
      timestamp: new Date().toISOString()
    };

    // Simulate API call
    setTimeout(() => {
      setShowCelebration(true);
      toast.success('Thank you for checking in! Your feelings matter. 💙', {
        description: 'Your check-in has been saved securely.',
        duration: 4000
      });
      
      if (onComplete) onComplete(checkInData);
      
      // Reset form
      setStep(1);
      setSelectedMood(null);
      setSelectedEmotions([]);
      setNote('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className={`${okayitTheme.backgrounds.card} ${okayitTheme.effects.cardShadow}`}>
      <CelebrationMoment show={showCelebration} onDone={() => setShowCelebration(false)} />
      <CardHeader>
        <CardTitle className={`${okayitTheme.text.heading} flex items-center gap-3`}>
          <div className="p-2 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span>How Are You Feeling Today?</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Mood Selection */}
        {step === 1 && (
          <motion.div {...tikTokTransitions.fade} className="space-y-4">
            <p className={`${okayitTheme.text.secondary} text-lg font-semibold`}>
              Pick the mood that best describes how you feel right now:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moodOptions.map((mood) => {
                const Icon = mood.icon;
                return (
                  <motion.button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-6 rounded-2xl border transition-all duration-300 ${
                      selectedMood === mood.id
                        ? `bg-gradient-to-br ${mood.color} text-white border-transparent shadow-lg`
                        : `${okayitTheme.backgrounds.card} border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600`
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-4xl`}>{mood.emoji}</div>
                      <div className="text-left flex-1">
                        <p className={`font-bold text-lg ${
                          selectedMood === mood.id ? 'text-white' : okayitTheme.text.primary
                        }`}>
                          {mood.label}
                        </p>
                      </div>
                      <Icon className={`w-6 h-6 ${
                        selectedMood === mood.id ? 'text-white' : 'text-slate-400'
                      }`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Emotion Selection */}
        {step === 2 && (
          <motion.div {...tikTokTransitions.slideLeft} className="space-y-6">
            <div>
              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="mb-4"
              >
                ← Back
              </Button>

              <p className={`${okayitTheme.text.secondary} text-lg font-semibold mb-4`}>
                What emotions are you experiencing? (Select all that apply)
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {emotionOptions.map((emotion) => {
                  const Icon = emotion.icon;
                  const isSelected = selectedEmotions.includes(emotion.id);
                  return (
                    <motion.button
                      key={emotion.id}
                      onClick={() => toggleEmotion(emotion.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-transparent shadow-lg'
                          : `${okayitTheme.backgrounds.card} border-slate-200 dark:border-slate-700 hover:border-blue-300`
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${
                        isSelected ? 'text-white' : 'text-slate-500'
                      }`} />
                      <p className={`text-sm font-bold ${
                        isSelected ? 'text-white' : okayitTheme.text.primary
                      }`}>
                        {emotion.label}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className={`${okayitTheme.text.primary} font-bold text-lg flex items-center gap-2`}>
                Want to share more? (Optional)
                <VoiceInputButton onTranscript={(t) => setNote(prev => prev ? prev + ' ' + t : t)} />
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind? Your thoughts are private and safe here... (or tap 🎤 to speak)"
                className={`${okayitTheme.interactive.input} min-h-[120px] text-base`}
                rows={5}
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`${okayitTheme.interactive.button} flex-1 text-lg py-6`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    <span>Submit Check-In</span>
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
