
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, UserCheck, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserOnboardingProps {
  onComplete: (user: { name: string; age?: number; email?: string; userType: string }) => void;
}

export default function UserOnboarding({ onComplete }: UserOnboardingProps) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    userType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    onComplete({
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : undefined,
      email: formData.email || undefined,
      userType: formData.userType
    });

    setIsSubmitting(false);
  };

  const isFormValid = formData.name && formData.userType;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4"
            >
              <Home className="w-8 h-8 text-white" />
            </motion.div>
            
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome to Our House Tour!
            </CardTitle>
            <p className="text-gray-900 mt-2">
              Let's get to know you before we start exploring
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                  Your Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-900" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* User Type */}
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-sm font-medium text-gray-900">
                  I am a... *
                </Label>
                <Select value={formData.userType} onValueChange={(value) => setFormData(prev => ({ ...prev, userType: value }))}>
                  <SelectTrigger className="border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="young-person">Young Person (living here)</SelectItem>
                    <SelectItem value="visitor">Visitor/Family Member</SelectItem>
                    <SelectItem value="new-staff">New Staff Member</SelectItem>
                    <SelectItem value="inspector">Inspector</SelectItem>
                    <SelectItem value="student">Student/Trainee</SelectItem>
                    <SelectItem value="other">Other Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Age Field */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium text-gray-900">
                  Age (Optional)
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="8"
                  max="99"
                  placeholder="How old are you?"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-900">
                  We'll use this to send you your completion certificate
                </p>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-6 text-lg"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <UserCheck className="w-5 h-5 mr-2" />
                  </motion.div>
                ) : (
                  <>
                    Start My Tour
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <h3 className="font-medium text-blue-800 mb-2">What to Expect</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Explore 6 different locations in our care home</li>
                <li>• Complete fun quizzes and interactive activities</li>
                <li>• Learn about safeguarding and care practices</li>
                <li>• Earn a completion certificate at the end</li>
              </ul>
            </div>

            {/* Privacy Notice */}
            <p className="text-xs text-gray-900 text-center">
              Your information is used solely for this educational tour and completion certificates. 
              We respect your privacy and won't share your details with anyone else.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
