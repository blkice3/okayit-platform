
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  Star, 
  Medal, 
  Crown, 
  Sparkles, 
  Download, 
  Share2, 
  Calendar,
  Clock,
  Target,
  Users,
  BookOpen,
  Heart,
  Shield,
  Gamepad2,
  AudioLines,
  CheckCircle2,
  ArrowLeft,
  Plus,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { certificateService, CertificateData } from '@/lib/certificate-signing';
import { hapticFeedback } from '@/lib/mobile-utils';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { toast } from 'sonner';
import { analytics } from '@/components/google-analytics';
import EnhancedCertificate from './enhanced-certificate';

interface AchievementCertificatesProps {
  onBack: () => void;
  user: any;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'welcome' | 'tour' | 'family' | 'stories' | 'wellbeing' | 'milestone';
  points: number;
  unlocked: boolean;
  dateUnlocked?: Date;
  progress: number;
  maxProgress: number;
  requirements: string[];
  certificate?: CertificateData;
}

export default function AchievementCertificates({ onBack, user }: AchievementCertificatesProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userCertificates, setUserCertificates] = useState<CertificateData[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeTab, setActiveTab] = useState<'achievements' | 'certificates'>('achievements');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadAchievements();
    loadCertificates();
  }, []);

  const loadAchievements = () => {
    // Achievements — progress tracked from real user activity only
    const achievementList: Achievement[] = [
      {
        id: 'first-steps',
        title: 'First Steps',
        description: 'Complete your first welcome guide section',
        icon: BookOpen,
        category: 'welcome',
        points: 100,
        unlocked: false,
        progress: 0,
        maxProgress: 5,
        requirements: ['Complete welcome guide introduction', 'Set up profile', 'Take first quiz'],
        certificate: undefined
      },
      {
        id: 'tour-explorer',
        title: 'Tour Explorer',
        description: 'Scan 10 QR codes during house tours',
        icon: Trophy,
        category: 'tour',
        points: 200,
        unlocked: false,
        progress: 0,
        maxProgress: 10,
        requirements: ['Scan QR codes in 5 different rooms', 'Complete location reflections', 'Share one discovery'],
      },
      {
        id: 'family-connector',
        title: 'Family Connector',
        description: 'Play 5 family games with loved ones',
        icon: Heart,
        category: 'family',
        points: 150,
        unlocked: false,
        progress: 0,
        maxProgress: 5,
        requirements: ['Complete 5 family games', 'Invite family members', 'Share memories'],
      },
      {
        id: 'story-listener',
        title: 'Story Listener',
        description: 'Listen to and reflect on 3 stories',
        icon: AudioLines,
        category: 'stories',
        points: 180,
        unlocked: false,
        progress: 0,
        maxProgress: 3,
        requirements: ['Listen to complete stories', 'Write reflections', 'Share insights'],
      },
      {
        id: 'wellbeing-champion',
        title: 'Wellbeing Champion',
        description: 'Complete 7 days of wellbeing check-ins',
        icon: Shield,
        category: 'wellbeing',
        points: 250,
        unlocked: false,
        progress: 0,
        maxProgress: 7,
        requirements: ['Daily mood tracking', 'Complete wellbeing activities', 'Set personal goals'],
      },
      {
        id: 'platform-master',
        title: 'Platform Master',
        description: 'Unlock all major features of Care Experience Window',
        icon: Crown,
        category: 'milestone',
        points: 500,
        unlocked: false,
        progress: 0,
        maxProgress: 6,
        requirements: ['Complete welcome guide', 'Finish house tour', 'Play family games', 'Listen to stories', 'Use wellbeing tools', 'Connect with support'],
      }
    ];

    setAchievements(achievementList);
    const unlockedPoints = achievementList
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);
    setTotalPoints(unlockedPoints);
  };

  const loadCertificates = async () => {
    try {
      // Load certificates from local storage or initialize empty array
      const storedCertificates = localStorage.getItem('user-certificates');
      if (storedCertificates) {
        const certificates = JSON.parse(storedCertificates).map((cert: any) => ({
          ...cert,
          completionDate: new Date(cert.completionDate)
        }));
        setUserCertificates(certificates);
      }
    } catch (error) {
      console.error('Failed to load certificates:', error);
    }
  };

  const generateAchievementCertificate = async (achievement: Achievement) => {
    if (!achievement.unlocked) {
      toast.error('Achievement not yet unlocked!');
      return;
    }

    setIsGenerating(true);
    hapticFeedback.impact('medium');

    try {
      const certificateId = `cert-${achievement.id}-${Date.now()}`;
      const certificateLevel = achievement.points >= 400 ? 'platinum' :
                               achievement.points >= 250 ? 'gold' :
                               achievement.points >= 150 ? 'silver' : 'bronze';

      // Get user registration data
      const { certificateService } = await import('@/lib/certificate-signing');
      const userRegistration = await certificateService.getUserRegistration();
      
      const userName = user?.displayName || user?.name || (userRegistration 
        ? `${userRegistration.firstName} ${userRegistration.lastName}`
        : 'Care Home Resident');
      const userEmail = userRegistration?.email || user?.email;

      // Generate PDF certificate
      const { downloadCertificate } = await import('@/lib/pdf-certificate-generator');
      
      const certConfig = {
        recipientName: userName,
        category: achievement.category,
        achievementTitle: achievement.title,
        description: achievement.description,
        completionDate: achievement.dateUnlocked || new Date(),
        certificateLevel: certificateLevel as 'bronze' | 'silver' | 'gold' | 'platinum',
        points: achievement.points,
        certificateId: certificateId,
        achievements: achievement.requirements
      };

      // Download the PDF
      await downloadCertificate(certConfig);

      // Send email notification if user has email
      if (userEmail) {
        try {
          await fetch('/api/generate-certificate-pdf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              recipientName: userName,
              recipientEmail: userEmail,
              category: achievement.category,
              achievementTitle: achievement.title,
              description: achievement.description,
              completionDate: (achievement.dateUnlocked || new Date()).toISOString(),
              certificateLevel: certificateLevel,
              points: achievement.points,
              certificateId: certificateId,
              achievements: achievement.requirements,
              sendEmail: true
            }),
          });
          
          toast.success(`PDF Certificate downloaded! Email sent to ${userEmail}`, {
            duration: 5000
          });
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          toast.success('PDF Certificate downloaded!', {
            description: 'Check your Downloads folder'
          });
        }
      } else {
        toast.success('PDF Certificate downloaded!', {
          description: 'Check your Downloads folder'
        });
      }

      // Track certificate generation in Google Analytics
      // Analytics not currently enabled
      // analytics.trackCertificateGeneration(achievement.category, userName);

      // Store certificate data
      const certificateData: CertificateData = {
        id: certificateId,
        userId: user?.id || userRegistration?.id || 'anonymous',
        userName: userName,
        userEmail: userEmail,
        experienceType: achievement.category === 'tour' ? 'house-tour' : 
                      achievement.category === 'welcome' ? 'welcome-guide' :
                      achievement.category === 'family' ? 'family-activities' :
                      achievement.category === 'stories' ? 'story-experience' : 'full-platform',
        completionDate: achievement.dateUnlocked || new Date(),
        achievements: [achievement.id, `${achievement.category}-expert`],
        progressData: {
          sectionsCompleted: achievement.progress,
          totalSections: achievement.maxProgress,
          timeSpent: 30 + (achievement.points / 10),
          interactionsCompleted: achievement.requirements
        },
        homeContext: {
          name: 'OKAYiT Care Experience Window',
          location: 'Digital Platform'
        },
        certificateLevel: certificateLevel as 'bronze' | 'silver' | 'gold' | 'platinum',
        verificationHash: `hash-${Date.now()}`,
        digitalSignature: `sig-${achievement.id}-${Date.now()}`,
        issueAuthority: 'OKAYiT Care Experience Window Platform'
      };

      // Update achievement with certificate
      setAchievements(prev => prev.map(a => 
        a.id === achievement.id 
          ? { ...a, certificate: certificateData }
          : a
      ));

      const updatedCertificates = [...userCertificates, certificateData];
      setUserCertificates(updatedCertificates);
      
      // Save to localStorage
      localStorage.setItem('user-certificates', JSON.stringify(updatedCertificates));
      
      setSelectedCertificate(certificateData);

      hapticFeedback.notification('success');

    } catch (error) {
      console.error('Failed to generate certificate:', error);
      toast.error('Failed to generate certificate');
      hapticFeedback.notification('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      welcome: BookOpen,
      tour: Trophy,
      family: Heart,
      stories: AudioLines,
      wellbeing: Shield,
      milestone: Crown
    };
    return icons[category as keyof typeof icons] || Star;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      welcome: 'from-blue-400 to-indigo-500',
      tour: 'from-purple-400 to-pink-500',
      family: 'from-green-400 to-emerald-500',
      stories: 'from-orange-400 to-red-500',
      wellbeing: 'from-teal-400 to-cyan-500',
      milestone: 'from-yellow-400 to-amber-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  const renderAchievementCard = (achievement: Achievement) => {
    const Icon = achievement.icon;
    const CategoryIcon = getCategoryIcon(achievement.category);
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

    return (
      <motion.div
        key={achievement.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className="cursor-pointer"
      >
        <Card className={combineThemeClasses(
          `h-full transition-all duration-300 border-2`,
          achievement.unlocked 
            ? "border-green-200 dark:border-green-600 shadow-lg shadow-green-500/20"
            : "border-gray-200 dark:border-gray-600",
          okayitTheme.backgrounds.card
        )}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${getCategoryColor(achievement.category)} shadow-lg relative overflow-hidden`}>
                <Icon className="w-6 h-6 text-white relative z-10" />
                {achievement.unlocked && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                )}
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                {achievement.unlocked && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Unlocked
                  </Badge>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                    {achievement.points}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <CardTitle className={combineThemeClasses("text-lg font-bold flex items-center", okayitTheme.text.primary)}>
                {achievement.title}
                <CategoryIcon className="w-4 h-4 ml-2 text-gray-900" />
              </CardTitle>
              <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
                {achievement.description}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className={combineThemeClasses("font-medium", okayitTheme.text.secondary)}>
                  Progress
                </span>
                <span className={combineThemeClasses("font-bold", okayitTheme.text.primary)}>
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <h5 className={combineThemeClasses("text-xs font-bold", okayitTheme.text.primary)}>
                Requirements:
              </h5>
              <div className="space-y-1">
                {achievement.requirements.map((req, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                      index < achievement.progress ? 'bg-green-500' : 'bg-purple-100'
                    }`}></div>
                    <span className={combineThemeClasses(
                      index < achievement.progress ? 'line-through text-green-600' : '',
                      okayitTheme.text.secondary
                    )}>
                      {req}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              {achievement.unlocked ? (
                <>
                  {!achievement.certificate ? (
                    <Button
                      onClick={() => generateAchievementCertificate(achievement)}
                      disabled={isGenerating}
                      className={combineThemeClasses("flex-1 text-xs", okayitTheme.interactive.button)}
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3 mr-1" />
                          Generate PDF Certificate
                        </>
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={async () => {
                          if (!achievement.certificate) return;
                          
                          const { downloadCertificate } = await import('@/lib/pdf-certificate-generator');
                          const { certificateService } = await import('@/lib/certificate-signing');
                          const userRegistration = await certificateService.getUserRegistration();
                          const userName = user?.displayName || user?.name || (userRegistration 
                            ? `${userRegistration.firstName} ${userRegistration.lastName}`
                            : 'Care Home Resident');

                          await downloadCertificate({
                            recipientName: userName,
                            category: achievement.category,
                            achievementTitle: achievement.title,
                            description: achievement.description,
                            completionDate: achievement.dateUnlocked || new Date(),
                            certificateLevel: achievement.certificate.certificateLevel,
                            points: achievement.points,
                            certificateId: achievement.certificate.id,
                            achievements: achievement.requirements
                          });
                          
                          toast.success('PDF Certificate downloaded!');
                        }}
                        className={combineThemeClasses("flex-1 text-xs", okayitTheme.interactive.buttonBlue)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download PDF
                      </Button>
                      <Button
                        onClick={() => setSelectedCertificate(achievement.certificate!)}
                        className={combineThemeClasses("flex-1 text-xs", okayitTheme.interactive.buttonPurple)}
                      >
                        <Award className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className={combineThemeClasses("flex-1 text-xs text-center py-2 rounded", okayitTheme.status.warning)}>
                  <span className="font-medium text-amber-700 dark:text-amber-300">
                    {Math.round(progressPercentage)}% Complete
                  </span>
                </div>
              )}
            </div>

            {achievement.dateUnlocked && (
              <div className="text-xs text-gray-900 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Unlocked {achievement.dateUnlocked.toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderCertificateCard = (certificate: CertificateData) => {
    return (
      <motion.div
        key={certificate.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        onClick={() => setSelectedCertificate(certificate)}
        className="cursor-pointer"
      >
        <Card className={combineThemeClasses(
          "h-full hover:shadow-lg transition-all duration-300 border border-indigo-200 dark:border-indigo-600",
          okayitTheme.backgrounds.card
        )}>
          <CardHeader className="text-center pb-3">
            <div className={`mx-auto p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 w-16 h-16 flex items-center justify-center mb-3`}>
              <Award className="w-8 h-8 text-white" />
            </div>
            <CardTitle className={combineThemeClasses("text-lg font-bold", okayitTheme.text.primary)}>
              {certificate.experienceType.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')} Certificate
            </CardTitle>
            <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
              {certificate.userName}
            </p>
          </CardHeader>
          
          <CardContent className="text-center space-y-3">
            <Badge className={`capitalize bg-gradient-to-r ${
              certificate.certificateLevel === 'platinum' ? 'from-purple-500 to-indigo-500' :
              certificate.certificateLevel === 'gold' ? 'from-yellow-500 to-amber-500' :
              certificate.certificateLevel === 'silver' ? 'from-gray-400 to-gray-500' :
              'from-orange-500 to-red-500'
            } text-white`}>
              {certificate.certificateLevel} Level
            </Badge>
            
            <div className="text-xs text-gray-900 dark:text-gray-300">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {certificate.completionDate.toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Trophy className="w-3 h-3 mr-1" />
                  {certificate.achievements.length} achievements
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setSelectedCertificate(certificate)}
              size="sm" 
              className={combineThemeClasses("w-full", okayitTheme.interactive.button)}
            >
              View Certificate
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page)}>
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={combineThemeClasses("sticky top-0 z-40 border-b shadow-sm", okayitTheme.backgrounds.glass)}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={combineThemeClasses("text-xl font-bold", okayitTheme.text.primary)}>
                    Achievement Certificates
                  </h1>
                  <p className={combineThemeClasses("text-sm", okayitTheme.text.secondary)}>
                    Your learning journey and accomplishments
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={combineThemeClasses("flex items-center space-x-2 px-3 py-2 rounded-lg", okayitTheme.status.success)}>
                <Star className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-emerald-800 dark:text-emerald-100">
                  {totalPoints} Points
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-1 mb-6">
          <Button
            onClick={() => setActiveTab('achievements')}
            variant={activeTab === 'achievements' ? 'default' : 'ghost'}
            className="flex-1"
          >
            <Target className="w-4 h-4 mr-2" />
            Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </Button>
          <Button
            onClick={() => setActiveTab('certificates')}
            variant={activeTab === 'certificates' ? 'default' : 'ghost'}
            className="flex-1"
          >
            <Award className="w-4 h-4 mr-2" />
            Certificates ({userCertificates.length})
          </Button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {achievements.map(renderAchievementCard)}
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div
              key="certificates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {userCertificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCertificates.map(renderCertificateCard)}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Award className={combineThemeClasses("w-16 h-16 mx-auto mb-4 text-gray-900")} />
                  <h3 className={combineThemeClasses("text-xl font-bold mb-2", okayitTheme.text.primary)}>
                    No Certificates Yet
                  </h3>
                  <p className={combineThemeClasses("text-sm max-w-md mx-auto", okayitTheme.text.secondary)}>
                    Complete achievements and experiences to earn your first certificate. 
                    Each certificate recognizes your learning journey and accomplishments.
                  </p>
                  <Button
                    onClick={() => setActiveTab('achievements')}
                    className={combineThemeClasses("mt-4", okayitTheme.interactive.button)}
                  >
                    View Achievements
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <EnhancedCertificate
            userName={selectedCertificate.userName}
            achievementTitle={selectedCertificate.experienceType}
            completionDate={new Date(selectedCertificate.completionDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            certificateId={selectedCertificate.id}
            homeContext={selectedCertificate.homeContext.name}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
