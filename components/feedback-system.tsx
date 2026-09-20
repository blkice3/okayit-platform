
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle2, Star, ThumbsUp, Lightbulb, AlertCircle, Heart, ArrowLeft, Mail, User, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { toast } from 'sonner';
import VoiceInputButton from '@/components/voice-input-button';

interface FeedbackSystemProps {
  onBack: () => void;
}

export default function FeedbackSystem({ onBack }: FeedbackSystemProps) {
  const [feedbackType, setFeedbackType] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { 
      id: 'review', 
      label: 'Leave a Review', 
      icon: Star, 
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-600',
      description: 'Share your overall experience with us'
    },
    { 
      id: 'suggestion', 
      label: 'Make a Suggestion', 
      icon: Lightbulb, 
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      description: 'Help us improve with your ideas'
    },
    { 
      id: 'positive', 
      label: 'Share Something Great', 
      icon: ThumbsUp, 
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      iconColor: 'text-green-600',
      description: 'Tell us what you love'
    },
    { 
      id: 'issue', 
      label: 'Report an Issue', 
      icon: AlertCircle, 
      color: 'orange',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600',
      description: 'Let us know if something is not working'
    }
  ];

  const ratingLabels = [
    'Poor',
    'Fair', 
    'Good',
    'Very Good',
    'Excellent'
  ];

  const handleSubmit = async () => {
    if (!feedbackType || !feedback.trim()) {
      toast.error('Please select a feedback type and write your message');
      return;
    }

    if (rating === 0 && feedbackType === 'review') {
      toast.error('Please rate your experience');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          rating,
          feedback,
          userName: userName.trim() || 'Anonymous',
          userEmail: userEmail.trim() || 'Not provided',
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        toast.success('Thank you for your feedback!');
        
        // Reset after 4 seconds
        setTimeout(() => {
          setSubmitted(false);
          setFeedbackType(null);
          setRating(0);
          setFeedback('');
          setUserName('');
          setUserEmail('');
        }, 4000);
      } else {
        toast.error('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = feedbackTypes.find(t => t.id === feedbackType);

  if (submitted) {
    return (
      <div className={combineThemeClasses("min-h-screen flex items-center justify-center p-6", okayitTheme.backgrounds.page)}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-lg"
        >
          <Card className={okayitTheme.backgrounds.whiteCardGreen}>
            <CardContent className="p-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
              </motion.div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={combineThemeClasses("text-sm font-bold mb-4", okayitTheme.text.headingGreen)}
              >
                Thank You!
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={combineThemeClasses("text-xs mb-2", okayitTheme.text.secondaryOnLight)}
              >
                Your feedback has been sent to our team at admin@okayit.uk
              </motion.p>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={combineThemeClasses("text-base", okayitTheme.text.mutedOnLight)}
              >
                Your voice helps us make this platform better for everyone in care.
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page, okayitTheme.backgrounds.pageDark)}>
      {/* Compact Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 flex items-center gap-1 text-purple-600 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-bold text-gray-800">Share Your Feedback</span>
          </div>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {/* Feedback Type Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={okayitTheme.backgrounds.whiteCardPurple}>
            <CardHeader>
              <CardTitle className={combineThemeClasses("text-sm", okayitTheme.text.headingPurple)}>
                What would you like to share?
              </CardTitle>
              <CardDescription className={okayitTheme.text.mutedOnLight}>
                Choose the type of feedback you want to provide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = feedbackType === type.id;
                  return (
                    <motion.button
                      key={type.id}
                      onClick={() => setFeedbackType(type.id)}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={combineThemeClasses(
                        "p-3 rounded-2xl border transition-all text-center relative overflow-hidden",
                        isSelected 
                          ? `${type.borderColor} ${type.bgColor}` 
                          : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="selected-feedback-type"
                          className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <div className="relative z-10">
                        <Icon className={combineThemeClasses(
                          "w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3",
                          isSelected ? type.iconColor : 'text-gray-900'
                        )} />
                        <p className={combineThemeClasses(
                          "font-bold text-sm sm:text-base mb-1",
                          isSelected ? type.textColor : 'text-gray-800'
                        )}>
                          {type.label}
                        </p>
                        <p className={combineThemeClasses(
                          "text-xs",
                          isSelected ? type.textColor + ' opacity-80' : 'text-gray-900'
                        )}>
                          {type.description}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rating */}
        <AnimatePresence mode="wait">
          {feedbackType && (
            <motion.div
              key="rating-section"
              initial={{ y: 20, opacity: 0, height: 0 }}
              animate={{ y: 0, opacity: 1, height: 'auto' }}
              exit={{ y: -20, opacity: 0, height: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6"
            >
              <Card className={okayitTheme.backgrounds.whiteCardBlue}>
                <CardHeader>
                  <CardTitle className={combineThemeClasses("text-sm", okayitTheme.text.headingBlue)}>
                    Rate Your Experience
                    {feedbackType === 'review' && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </CardTitle>
                  <CardDescription className={okayitTheme.text.mutedOnLight}>
                    {feedbackType === 'review' ? 'Required for reviews' : 'Optional but helpful'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-center gap-1 sm:gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          onClick={() => setRating(star)}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                        >
                          <Star
                            className={combineThemeClasses(
                              "w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200",
                              star <= rating 
                                ? 'fill-yellow-500 text-yellow-500 drop-shadow-lg' 
                                : 'text-gray-300 hover:text-gray-900'
                            )}
                          />
                        </motion.button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={combineThemeClasses(
                          "px-4 py-2 rounded-full font-semibold text-lg",
                          "bg-yellow-100 text-yellow-700"
                        )}
                      >
                        <Sparkles className="inline w-5 h-5 mr-2" />
                        {ratingLabels[rating - 1]}
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Text */}
        <AnimatePresence mode="wait">
          {feedbackType && (
            <motion.div
              key="feedback-text-section"
              initial={{ y: 20, opacity: 0, height: 0 }}
              animate={{ y: 0, opacity: 1, height: 'auto' }}
              exit={{ y: -20, opacity: 0, height: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6"
            >
              <Card className={okayitTheme.backgrounds.whiteCardOrange}>
                <CardHeader>
                  <CardTitle className={combineThemeClasses("text-sm", okayitTheme.text.headingOrange)}>
                    Tell Us More
                    <span className="text-red-500 ml-1">*</span>
                  </CardTitle>
                  <CardDescription className={okayitTheme.text.mutedOnLight}>
                    Share your thoughts, ideas, or experiences in detail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Tap 🎤 to speak instead of typing</span>
                    <VoiceInputButton onTranscript={(t) => setFeedback(prev => prev ? prev + ' ' + t : t)} />
                  </div>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={
                      feedbackType === 'review' ? 'Tell us about your experience with the platform...' :
                      feedbackType === 'suggestion' ? 'What improvements or new features would you like to see?' :
                      feedbackType === 'positive' ? 'What did you enjoy most about the platform?' :
                      'Please describe the issue you encountered...'
                    }
                    className={combineThemeClasses(
                      okayitTheme.interactive.input, 
                      "min-h-[180px] text-base sm:text-lg resize-none"
                    )}
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className={combineThemeClasses("text-xs sm:text-sm", okayitTheme.text.mutedOnLight)}>
                      Required field - your feedback is valuable to us
                    </p>
                    <p className={combineThemeClasses("text-xs sm:text-sm", okayitTheme.text.mutedOnLight)}>
                      {feedback.length}/1000
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Information (Optional) */}
        <AnimatePresence mode="wait">
          {feedbackType && feedback.trim() && (
            <motion.div
              key="user-info-section"
              initial={{ y: 20, opacity: 0, height: 0 }}
              animate={{ y: 0, opacity: 1, height: 'auto' }}
              exit={{ y: -20, opacity: 0, height: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <Card className={okayitTheme.backgrounds.whiteCardGreen}>
                <CardHeader>
                  <CardTitle className={combineThemeClasses("text-sm", okayitTheme.text.headingGreen)}>
                    Your Information (Optional)
                  </CardTitle>
                  <CardDescription className={okayitTheme.text.mutedOnLight}>
                    Provide your details if you would like us to follow up with you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName" className={combineThemeClasses("text-base font-semibold", okayitTheme.text.secondaryOnLight)}>
                      <User className="inline w-4 h-4 mr-2" />
                      Your Name
                    </Label>
                    <Input
                      id="userName"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name (optional)"
                      className={combineThemeClasses(okayitTheme.interactive.input, "text-base")}
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail" className={combineThemeClasses("text-base font-semibold", okayitTheme.text.secondaryOnLight)}>
                      <Mail className="inline w-4 h-4 mr-2" />
                      Your Email
                    </Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="your.email@example.com (optional)"
                      className={combineThemeClasses(okayitTheme.interactive.input, "text-base")}
                      maxLength={150}
                    />
                  </div>
                  <p className={combineThemeClasses("text-xs sm:text-sm", okayitTheme.text.mutedOnLight)}>
                    Leave blank to remain anonymous. We respect your privacy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <AnimatePresence mode="wait">
          {feedbackType && feedback.trim() && (
            <motion.div
              key="submit-button"
              initial={{ y: 20, opacity: 0, height: 0 }}
              animate={{ y: 0, opacity: 1, height: 'auto' }}
              exit={{ y: -20, opacity: 0, height: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 mb-8"
            >
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={combineThemeClasses(
                  okayitTheme.interactive.buttonGreen, 
                  "w-full text-lg h-14 sm:h-16 font-bold",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-3"
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Send Feedback to admin@okayit.uk
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
