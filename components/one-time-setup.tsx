
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar,
  Shield,
  CheckCircle,
  ArrowRight,
  Heart,
  Users,
  Briefcase,
  Eye,
  Home,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { certificateService, UserRegistration } from '@/lib/certificate-signing';
import { hapticFeedback, device } from '@/lib/mobile-utils';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { analytics } from '@/components/google-analytics';

interface OneTimeSetupProps {
  onComplete: (registration: UserRegistration) => void;
}

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: any;
}

const setupSteps: SetupStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Claudius',
    description: 'Complete interactive care home experience platform',
    icon: Sparkles
  },
  {
    id: 'profile',
    title: 'Your Profile',
    description: 'Tell us a bit about yourself',
    icon: User
  },
  {
    id: 'preferences',
    title: 'Your Preferences',
    description: 'Customize your experience',
    icon: Shield
  },
  {
    id: 'complete',
    title: 'All Set!',
    description: 'Your experience is ready',
    icon: Award
  }
];

const userTypes = [
  { value: 'resident', label: 'New Resident', icon: Home, description: 'I\'m moving into the care home' },
  { value: 'family', label: 'Family Member', icon: Heart, description: 'I\'m visiting or supporting someone' },
  { value: 'visitor', label: 'Visitor', icon: Users, description: 'I\'m here to learn about the home' },
  { value: 'staff', label: 'Staff Member', icon: Briefcase, description: 'I work at the care home' },
  { value: 'inspector', label: 'Inspector', icon: Eye, description: 'I\'m conducting an official inspection' }
];

export default function OneTimeSetup({ onComplete }: OneTimeSetupProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    userType: '',
    preferences: {
      notifications: true,
      dataSharing: false,
      progressTracking: true
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Auto-advance from welcome screen
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
        hapticFeedback.impact('light');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  useEffect(() => {
    // Mark device as registered using device fingerprinting
    const markDevice = async () => {
      try {
        const { DeviceFingerprint } = await import('@/lib/device-fingerprint');
        const isRegistered = await DeviceFingerprint.isDeviceRegistered();
        
        if (isRegistered) {
          // Device already registered, should not show setup
          console.log('Device already registered');
        }
      } catch (error) {
        console.error('Error checking device registration:', error);
      }
    };
    
    markDevice();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePreferenceChange = (preference: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [preference]: value }
    }));
    hapticFeedback.selection();
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.userType) {
        newErrors.userType = 'Please select your role';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      hapticFeedback.impact('medium');
      setCurrentStep(prev => prev + 1);
    } else {
      hapticFeedback.notification('error');
    }
  };

  const handleComplete = async () => {
    if (!validateStep(currentStep)) {
      hapticFeedback.notification('error');
      return;
    }

    setIsProcessing(true);
    hapticFeedback.impact('heavy');

    try {
      const registration = await certificateService.registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        userType: formData.userType as any,
        preferences: formData.preferences,
        homeContext: 'claudius'
      });

      // Send notification to admin@okayit.uk
      try {
        await fetch('/api/registration-notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            age: formData.age ? parseInt(formData.age) : undefined,
            userType: formData.userType,
            homeContext: 'claudius',
            registeredAt: new Date().toISOString(),
          }),
        });
      } catch (emailError) {
        console.error('Failed to send registration notification:', emailError);
        // Don't fail registration if email fails
      }

      // Mark device as registered using device fingerprinting
      try {
        const { DeviceFingerprint } = await import('@/lib/device-fingerprint');
        await DeviceFingerprint.markDeviceRegistered();
      } catch (error) {
        console.error('Failed to mark device as registered:', error);
        // Continue anyway - don't fail registration
      }

      setCurrentStep(3);
      
      // Track registration in Google Analytics
      // Analytics not currently enabled
      // analytics.trackUserRegistration(formData.userType || 'Unknown');
      
      // Complete setup after showing success
      setTimeout(() => {
        onComplete(registration);
      }, 2000);

    } catch (error) {
      console.error('Registration failed:', error);
      hapticFeedback.notification('error');
      setIsProcessing(false);
    }
  };

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="w-24 h-24 mx-auto"
      >
        <Sparkles className="w-full h-full text-indigo-600" />
      </motion.div>

      <div className="space-y-4">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={combineThemeClasses("text-4xl font-bold", okayitTheme.text.primary)}
        >
          Welcome to Claudius
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={combineThemeClasses("text-xl", okayitTheme.text.secondary)}
        >
          Interactive Care Home Experience Platform
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium">Interactive Tours</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium">Welcome Guide</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium">Stories & Reflection</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm font-medium">Family Activities</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="flex items-center justify-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
      >
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <span>Setting up your experience...</span>
      </motion.div>
    </motion.div>
  );

  const renderProfileStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className={combineThemeClasses("text-2xl font-bold mb-2", okayitTheme.text.primary)}>
          Tell us about yourself
        </h2>
        <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
          This helps us personalize your experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={combineThemeClasses("text-sm font-medium", okayitTheme.text.primary)}>
              First Name *
            </label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`${okayitTheme.interactive.input} ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="Your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className={combineThemeClasses("text-sm font-medium", okayitTheme.text.primary)}>
              Last Name *
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`${okayitTheme.interactive.input} ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className={combineThemeClasses("text-sm font-medium", okayitTheme.text.primary)}>
            Email (optional)
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={okayitTheme.interactive.input}
            placeholder="your.email@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className={combineThemeClasses("text-sm font-medium", okayitTheme.text.primary)}>
            Age (optional)
          </label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className={okayitTheme.interactive.input}
            placeholder="Your age"
            min="1"
            max="120"
          />
        </div>

        <div className="space-y-2">
          <label className={combineThemeClasses("text-sm font-medium", okayitTheme.text.primary)}>
            I am a... *
          </label>
          <div className="grid grid-cols-1 gap-2">
            {userTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.value}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('userType', type.value)}
                  className={combineThemeClasses(
                    "p-4 rounded-xl cursor-pointer border-2 transition-all duration-200",
                    formData.userType === type.value
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500",
                    okayitTheme.backgrounds.card
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${formData.userType === type.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900'}`} />
                    <div>
                      <h4 className={combineThemeClasses("font-medium", okayitTheme.text.primary)}>
                        {type.label}
                      </h4>
                      <p className={combineThemeClasses("text-xs", okayitTheme.text.muted)}>
                        {type.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          {errors.userType && (
            <p className="text-red-500 text-xs">{errors.userType}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderPreferencesStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className={combineThemeClasses("text-2xl font-bold mb-2", okayitTheme.text.primary)}>
          Customize Your Experience
        </h2>
        <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
          Set your preferences for the best experience
        </p>
      </div>

      <div className="space-y-6">
        <Card className={combineThemeClasses("", okayitTheme.backgrounds.card)}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className={combineThemeClasses("font-medium", okayitTheme.text.primary)}>
                  Progress Tracking
                </h4>
                <p className={combineThemeClasses("text-sm", okayitTheme.text.muted)}>
                  Track your journey and earn certificates
                </p>
              </div>
              <Switch
                checked={formData.preferences.progressTracking}
                onCheckedChange={(checked) => handlePreferenceChange('progressTracking', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={combineThemeClasses("", okayitTheme.backgrounds.card)}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className={combineThemeClasses("font-medium", okayitTheme.text.primary)}>
                  Helpful Notifications
                </h4>
                <p className={combineThemeClasses("text-sm", okayitTheme.text.muted)}>
                  Get reminders and encouragement
                </p>
              </div>
              <Switch
                checked={formData.preferences.notifications}
                onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className={combineThemeClasses("", okayitTheme.backgrounds.card)}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className={combineThemeClasses("font-medium", okayitTheme.text.primary)}>
                  Anonymous Data Sharing
                </h4>
                <p className={combineThemeClasses("text-sm", okayitTheme.text.muted)}>
                  Help improve the platform for everyone
                </p>
              </div>
              <Switch
                checked={formData.preferences.dataSharing}
                onCheckedChange={(checked) => handlePreferenceChange('dataSharing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <div className={combineThemeClasses("p-4 rounded-xl", okayitTheme.status.info)}>
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium">Your Privacy Matters</h4>
              <p className="text-sm">
                We only store what you choose to share. Your information is kept safe and is never sold or shared without your permission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderCompleteStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-24 h-24 mx-auto"
      >
        <div className="w-full h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
      </motion.div>

      <div className="space-y-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={combineThemeClasses("text-3xl font-bold", okayitTheme.text.primary)}
        >
          Welcome, {formData.firstName}!
        </motion.h2>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={combineThemeClasses("text-lg", okayitTheme.text.secondary)}
        >
          Your Claudius experience is ready
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-2"
        >
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Registration Complete
          </Badge>
          <p className={combineThemeClasses("text-sm", okayitTheme.text.muted)}>
            Next time you visit, you'll be logged in automatically
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex items-center justify-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
      >
        <Sparkles className="w-4 h-4" />
        <span>Launching your experience...</span>
      </motion.div>
    </motion.div>
  );

  const currentStepData = setupSteps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page)}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {setupSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={combineThemeClasses(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive 
                        ? "bg-indigo-600 text-white"
                        : isCompleted
                        ? "bg-green-600 text-white"
                        : "bg-purple-100 dark:bg-purple-100/20 text-gray-700"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  
                  {index < setupSteps.length - 1 && (
                    <div 
                      className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                        isCompleted ? 'bg-green-600' : 'bg-purple-100 dark:bg-purple-100/20'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <h3 className={combineThemeClasses("text-sm font-medium", okayitTheme.text.primary)}>
              {currentStepData.title}
            </h3>
            <p className={combineThemeClasses("text-xs", okayitTheme.text.muted)}>
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <Card className={combineThemeClasses("min-h-96", okayitTheme.backgrounds.card, okayitTheme.effects.cardShadow)}>
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 0 && renderWelcomeStep()}
              {currentStep === 1 && renderProfileStep()}
              {currentStep === 2 && renderPreferencesStep()}
              {currentStep === 3 && renderCompleteStep()}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep > 0 && currentStep < 3 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-center mt-8"
          >
            {currentStep === 2 ? (
              <Button
                onClick={handleComplete}
                disabled={isProcessing}
                className={combineThemeClasses("px-8", okayitTheme.interactive.button)}
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className={combineThemeClasses("px-8", okayitTheme.interactive.button)}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
