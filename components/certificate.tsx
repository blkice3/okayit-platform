
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Award, Calendar, CheckCircle2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CertificateProps {
  user: {
    name: string;
    age?: number;
  };
  session: {
    totalScore: number;
    completedAt: Date;
    locationProgress: Array<{
      locationName: string;
      score: number;
      completed: boolean;
    }>;
  };
  onDownload?: () => void;
  onClose?: () => void;
}

export default function Certificate({ user, session, onDownload, onClose }: CertificateProps) {
  const completedLocations = session.locationProgress?.filter(p => p?.completed) || [];
  const totalPossibleScore = 145; // Sum of all activity points across locations
  const percentage = Math.round((session.totalScore / totalPossibleScore) * 100);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Outstanding', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (percentage >= 75) return { level: 'Excellent', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (percentage >= 60) return { level: 'Good', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { level: 'Completed', color: 'text-purple-600', bgColor: 'bg-purple-50' };
  };

  const performance = getPerformanceLevel(percentage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            {/* Certificate Design */}
            <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8 md:p-12 relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 bg-purple-600 rounded-full"></div>
                <div className="absolute top-20 right-20 w-16 h-16 bg-pink-600 rounded-full"></div>
                <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-600 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-orange-600 rounded-full"></div>
              </div>
              
              {/* Header */}
              <div className="text-center mb-8 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4"
                >
                  <Award className="w-10 h-10 text-white" />
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Certificate of Completion
                </h1>
                <p className="text-lg text-gray-900 max-w-2xl mx-auto">
                  Interactive House Tour - QR Code Experience
                </p>
                <p className="text-sm text-gray-900 mt-2">
                  Children's Care Home Safeguarding & Learning Initiative
                </p>
              </div>

              {/* Recipient */}
              <div className="text-center mb-8 relative z-10">
                <p className="text-lg text-gray-900 mb-2">This is to certify that</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-900">
                  has successfully completed the Interactive House Tour experience
                </p>
              </div>

              {/* Achievement Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-8 relative z-10">
                <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{session.totalScore}</p>
                  <p className="text-sm text-gray-900">Points Earned</p>
                </div>
                
                <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{completedLocations.length}</p>
                  <p className="text-sm text-gray-900">Locations Completed</p>
                </div>
                
                <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200">
                  <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{percentage}%</p>
                  <p className="text-sm text-gray-900">Overall Score</p>
                </div>
                
                <div className={`text-center p-4 ${performance.bgColor} rounded-lg border border-gray-200`}>
                  <Award className={`w-8 h-8 ${performance.color} mx-auto mb-2`} />
                  <p className={`text-2xl font-bold ${performance.color}`}>{performance.level}</p>
                  <p className="text-sm text-gray-900">Performance</p>
                </div>
              </div>

              {/* Location Breakdown */}
              <div className="mb-8 relative z-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  Learning Journey Completed
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {completedLocations.map((location, index) => {
                    const locationTitles: Record<string, string> = {
                      'bedroom': 'Bedroom - Safe Sleep & Dignity',
                      'fire-exit': 'Fire Exit - Emergency Preparedness',
                      'kitchen': 'Kitchen - Hygiene & Cultural Inclusion',
                      'chill-room': 'Chill Room - Mindfulness & Wellbeing',
                      'entrance-hall': 'Entrance Hall - Values & Safeguarding',
                      'office': 'Office - Meet the Team'
                    };
                    
                    return (
                      <motion.div
                        key={location.locationName}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">
                            {locationTitles[location.locationName] || location.locationName}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {location.score} pts
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Completion Date & Signature */}
              <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-200 relative z-10">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm text-gray-900 mb-1">Date of Completion</p>
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(session.completedAt)}
                  </p>
                </div>
                
                <div className="text-center md:text-right">
                  <div className="mb-2">
                    <div className="w-40 h-px bg-gray-400 mx-auto md:mx-0"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Care Home Leadership Team</p>
                  <p className="text-xs text-gray-900">Interactive Learning Initiative</p>
                </div>
              </div>

              {/* Learning Outcomes Footer */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 relative z-10">
                <p className="text-xs text-center text-gray-900 leading-relaxed">
                  This certificate validates completion of safeguarding awareness activities covering safe sleep practices, 
                  emergency preparedness, food safety & cultural inclusion, emotional wellbeing, care values, and team understanding. 
                  Demonstrates engagement with person-centered care principles and commitment to learning.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 justify-between">
              <div className="text-sm text-gray-900">
                <p>Certificate ID: IHQR-{user.name.replace(/\s+/g, '').toUpperCase()}-{Date.now().toString().slice(-6)}</p>
                <p>Issued by: Interactive House Tour System</p>
              </div>
              
              <div className="flex gap-3">
                {onClose && (
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                )}
                {onDownload && (
                  <Button onClick={onDownload} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
