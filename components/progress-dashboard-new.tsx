'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, Award, Clock, Video, Gamepad2, BookOpen,
  Download, Share2, Calendar, Target, Activity, ArrowLeft,
  PieChart, AlertCircle, Info, ChevronRight, Filter, Heart,
  CheckCircle, FileText, Zap, X
} from 'lucide-react';
import {
  PieChart as RePieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';
import { toast } from 'sonner';
import OkayitLogo from './okayit-logo';

interface ProgressDashboardProps {
  onBack?: () => void;
  user?: any;
}

interface ProgressData {
  videosWatched: Array<{id: string; title: string; date: string; duration: number}>;
  gamesPlayed: Array<{id: string; title: string; date: string; duration: number; score?: number}>;
  resourcesExplored: Array<{id: string; title: string; category: string; date: string}>;
  certificatesEarned: Array<{id: string; title: string; date: string}>;
  reflectionActivities: Array<{id: string; type: string; date: string; duration: number}>;
  wellbeingCheckIns: Array<{id: string; feeling: string; mood: number; date: string; notes?: string}>;
  totalTimeSpent: number;
  loginStreak: number;
  lastActive: string;
}

// Initialize or load progress data from localStorage
const getProgressData = (): ProgressData => {
  if (typeof window === 'undefined') return getDefaultProgressData();
  
  const stored = localStorage.getItem('okayit_progress_data');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        ...getDefaultProgressData(),
        ...parsed,
        reflectionActivities: parsed.reflectionActivities || [],
        wellbeingCheckIns: parsed.wellbeingCheckIns || []
      };
    } catch {
      return getDefaultProgressData();
    }
  }
  return getDefaultProgressData();
};

const getDefaultProgressData = (): ProgressData => ({
  videosWatched: [],
  gamesPlayed: [],
  resourcesExplored: [],
  certificatesEarned: [],
  reflectionActivities: [],
  wellbeingCheckIns: [],
  totalTimeSpent: 0,
  loginStreak: 0,
  lastActive: new Date().toISOString()
});

// Save progress data to localStorage
const saveProgressData = (data: ProgressData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('okayit_progress_data', JSON.stringify(data));
  }
};

// Export function to track activities from other components
export const trackActivity = (type: 'video' | 'game' | 'resource' | 'certificate' | 'reflection' | 'wellbeing', data: any) => {
  const progressData = getProgressData();
  const timestamp = new Date().toISOString();
  
  switch(type) {
    case 'video':
      progressData.videosWatched.push({
        id: data.id,
        title: data.title,
        date: timestamp,
        duration: data.duration || 0
      });
      break;
    case 'game':
      progressData.gamesPlayed.push({
        id: data.id,
        title: data.title,
        date: timestamp,
        duration: data.duration || 0,
        score: data.score
      });
      break;
    case 'resource':
      progressData.resourcesExplored.push({
        id: data.id,
        title: data.title,
        category: data.category || 'general',
        date: timestamp
      });
      break;
    case 'certificate':
      progressData.certificatesEarned.push({
        id: data.id,
        title: data.title,
        date: timestamp
      });
      break;
    case 'reflection':
      progressData.reflectionActivities.push({
        id: data.id || `reflection-${Date.now()}`,
        type: data.type || 'general',
        date: timestamp,
        duration: data.duration || 0
      });
      break;
    case 'wellbeing':
      progressData.wellbeingCheckIns.push({
        id: data.id || `wellbeing-${Date.now()}`,
        feeling: data.feeling || 'neutral',
        mood: data.mood || 3,
        date: timestamp,
        notes: data.notes
      });
      break;
  }
  
  progressData.totalTimeSpent += data.duration || 0;
  progressData.lastActive = timestamp;
  
  saveProgressData(progressData);
};

export default function ProgressDashboard({ onBack, user }: ProgressDashboardProps) {
  const [progressData, setProgressData] = useState<ProgressData>(getDefaultProgressData());
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const data = getProgressData();
    setProgressData(data);
  }, []);

  // Filter data by time range
  const filterByTimeRange = (items: any[]) => {
    if (timeRange === 'all') return items;
    
    const now = new Date();
    const cutoff = new Date();
    if (timeRange === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else if (timeRange === 'month') {
      cutoff.setDate(now.getDate() - 30);
    }
    
    return items.filter(item => new Date(item.date) >= cutoff);
  };

  // Calculate statistics
  const stats = {
    totalVideos: filterByTimeRange(progressData.videosWatched).length,
    totalGames: filterByTimeRange(progressData.gamesPlayed).length,
    totalResources: filterByTimeRange(progressData.resourcesExplored).length,
    totalCertificates: filterByTimeRange(progressData.certificatesEarned).length,
    totalReflections: filterByTimeRange(progressData.reflectionActivities).length,
    totalCheckIns: filterByTimeRange(progressData.wellbeingCheckIns).length,
    avgMood: progressData.wellbeingCheckIns.length > 0
      ? (progressData.wellbeingCheckIns.reduce((sum, item) => sum + item.mood, 0) / progressData.wellbeingCheckIns.length).toFixed(1)
      : '0',
    streak: progressData.loginStreak
  };

  // Prepare chart data
  const activityData = [
    { name: 'Videos', value: stats.totalVideos, color: '#8B5CF6' },
    { name: 'Games', value: stats.totalGames, color: '#3B82F6' },
    { name: 'Resources', value: stats.totalResources, color: '#10B981' },
    { name: 'Reflections', value: stats.totalReflections, color: '#F59E0B' }
  ];

  // Weekly trend data
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const weeklyTrendData = getLast7Days().map(day => {
    const dayItems = [
      ...progressData.videosWatched,
      ...progressData.gamesPlayed,
      ...progressData.resourcesExplored,
      ...progressData.reflectionActivities
    ].filter(item => item.date.split('T')[0] === day);

    return {
      date: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
      activities: dayItems.length
    };
  });

  // Mood trend data
  const moodTrendData = filterByTimeRange(progressData.wellbeingCheckIns)
    .slice(-7)
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: item.mood
    }));

  // Resource categories
  const resourceCategories = progressData.resourcesExplored.reduce((acc: any, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const resourceCategoryData = Object.entries(resourceCategories).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const handleExport = () => {
    const report = `
==============================================
OKAYiT PROGRESS REPORT
==============================================

Generated: ${new Date().toLocaleDateString()}
Time Range: ${timeRange === 'week' ? 'Last 7 Days' : timeRange === 'month' ? 'Last 30 Days' : 'All Time'}

--- ACTIVITY SUMMARY ---
Videos Watched: ${stats.totalVideos}
Games Played: ${stats.totalGames}
Resources Explored: ${stats.totalResources}
Certificates Earned: ${stats.totalCertificates}
Reflections Completed: ${stats.totalReflections}
Wellbeing Check-ins: ${stats.totalCheckIns}

--- WELLBEING ---
Average Mood: ${stats.avgMood}/5
Current Streak: ${stats.streak} days

--- RECENT ACTIVITIES ---
${progressData.videosWatched.slice(-5).map(v => `• ${v.title} (${new Date(v.date).toLocaleDateString()})`).join('\n')}

==============================================
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `okayit-progress-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Progress report downloaded!');
  };

  const handleShare = () => {
    const message = `I've been active on OKAYiT! ${stats.totalVideos} videos watched, ${stats.totalGames} games played, and ${stats.totalResources} resources explored!`;
    if (navigator.share) {
      navigator.share({ text: message });
    } else {
      navigator.clipboard.writeText(message);
      toast.success('Copied to clipboard!');
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all progress data? This cannot be undone.')) {
      localStorage.removeItem('okayit_progress_data');
      setProgressData(getDefaultProgressData());
      toast.success('All progress data cleared');
    }
  };

  return (
    <div className={combineThemeClasses(
      "min-h-screen",
      "bg-gray-50 dark:bg-purple-950/30"
    )}>
      {/* Compact Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 flex items-center gap-1 text-purple-600 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-bold text-gray-800">My Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
              <SelectTrigger className="h-7 w-[100px] text-xs">
                <Filter className="mr-1 h-3 w-3" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">7 Days</SelectItem>
                <SelectItem value="month">30 Days</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleExport} className="h-7 text-xs px-2">
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
            <Card className="border-l-2 border-l-purple-600">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {timeRange === 'week' ? '7d' : timeRange === 'month' ? '30d' : 'All'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-900">Total Activities</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {stats.totalVideos + stats.totalGames + stats.totalResources + stats.totalReflections}
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Across all categories</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-l-2 border-l-blue-600">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Avg</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-900">Wellbeing Score</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.avgMood}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">/5.0</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    {stats.totalCheckIns} check-ins completed
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-l-2 border-l-green-600">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Earned</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-900">Certificates</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalCertificates}</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Achievements unlocked</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-l-2 border-l-orange-600">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Streak</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-900">Engagement Streak</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.streak}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">days</p>
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Keep it going!</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-200/30 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Activity className="mr-2 h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="wellbeing" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Heart className="mr-2 h-4 w-4" />
              Wellbeing
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Award className="mr-2 h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Activity Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    Activity Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RePieChart>
                      <Pie
                        data={activityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {activityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weekly Activity Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Weekly Activity Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="activities" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Activity Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Video className="h-8 w-8 text-purple-600" />
                    <ChevronRight className="h-4 w-4 text-gray-900" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{stats.totalVideos}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-900">Videos Watched</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Gamepad2 className="h-8 w-8 text-blue-600" />
                    <ChevronRight className="h-4 w-4 text-gray-900" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{stats.totalGames}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-900">Games Played</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <BookOpen className="h-8 w-8 text-green-600" />
                    <ChevronRight className="h-4 w-4 text-gray-900" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{stats.totalResources}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-900">Resources Explored</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <FileText className="h-8 w-8 text-orange-600" />
                    <ChevronRight className="h-4 w-4 text-gray-900" />
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{stats.totalReflections}</p>
                  <p className="text-sm text-gray-800 dark:text-gray-900">Reflections Completed</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Recent Videos */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Video className="h-5 w-5 text-purple-600" />
                    Recent Videos ({filterByTimeRange(progressData.videosWatched).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filterByTimeRange(progressData.videosWatched).slice(-5).reverse().map((video, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-purple-950/15">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <Video className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{video.title}</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            {new Date(video.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filterByTimeRange(progressData.videosWatched).length === 0 && (
                      <div className="text-center py-4 text-gray-700 dark:text-gray-300">
                        <Video className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No videos watched yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Games */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-blue-600" />
                    Recent Games ({filterByTimeRange(progressData.gamesPlayed).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filterByTimeRange(progressData.gamesPlayed).slice(-5).reverse().map((game, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-purple-950/15">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <Gamepad2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{game.title}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                            <span>{new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            {game.score && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-blue-600 dark:text-blue-400">Score: {game.score}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {filterByTimeRange(progressData.gamesPlayed).length === 0 && (
                      <div className="text-center py-4 text-gray-700 dark:text-gray-300">
                        <Gamepad2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No games played yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Resources by Category */}
              {resourceCategoryData.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      Resources by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={resourceCategoryData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" stroke="#6B7280" style={{ fontSize: '12px' }} />
                        <YAxis dataKey="name" type="category" stroke="#6B7280" style={{ fontSize: '12px' }} width={100} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="value" fill="#10B981" radius={[0, 8, 8, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Recent Reflections */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-orange-600" />
                    Recent Reflections ({filterByTimeRange(progressData.reflectionActivities).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filterByTimeRange(progressData.reflectionActivities).slice(-5).reverse().map((reflection, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-purple-950/15">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{reflection.type}</p>
                          <p className="text-xs text-gray-700 dark:text-gray-300">
                            {new Date(reflection.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filterByTimeRange(progressData.reflectionActivities).length === 0 && (
                      <div className="text-center py-4 text-gray-700 dark:text-gray-300">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No reflections completed yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Wellbeing Tab */}
          <TabsContent value="wellbeing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Mood Trend */}
              {moodTrendData.length > 0 && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-600" />
                      Mood Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={moodTrendData}>
                        <defs>
                          <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                        <YAxis domain={[0, 5]} stroke="#6B7280" style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#FFF',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px'
                          }}
                        />
                        <Area type="monotone" dataKey="mood" stroke="#EC4899" fillOpacity={1} fill="url(#colorMood)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Recent Check-ins */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Recent Check-ins ({filterByTimeRange(progressData.wellbeingCheckIns).length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filterByTimeRange(progressData.wellbeingCheckIns).slice(-8).reverse().map((checkin, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-purple-200/30">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                          <Heart className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              Feeling: {checkin.feeling}
                            </p>
                            <Badge variant={checkin.mood >= 4 ? "default" : checkin.mood >= 3 ? "secondary" : "destructive"}>
                              {checkin.mood}/5
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                            {new Date(checkin.date).toLocaleDateString('en-US', { 
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          {checkin.notes && (
                            <p className="text-sm text-gray-800 dark:text-gray-900 italic">
                              "{checkin.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    {filterByTimeRange(progressData.wellbeingCheckIns).length === 0 && (
                      <div className="text-center py-12 text-gray-700 dark:text-gray-300">
                        <Heart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p className="text-sm mb-2">No wellbeing check-ins yet</p>
                        <p className="text-xs">Start checking in daily to track your mood</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Certificates Earned ({stats.totalCertificates})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {progressData.certificatesEarned.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white mb-1">{cert.title}</p>
                          <p className="text-xs text-gray-800 dark:text-gray-900">
                            {new Date(cert.date).toLocaleDateString('en-US', { 
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {stats.totalCertificates === 0 && (
                  <div className="text-center py-12 text-gray-700 dark:text-gray-300">
                    <Award className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-sm mb-2">No certificates earned yet</p>
                    <p className="text-xs">Complete activities to earn certificates</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Milestone Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Milestone Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">First Video</span>
                    <Badge variant={stats.totalVideos >= 1 ? "default" : "secondary"}>
                      {stats.totalVideos >= 1 ? 'Complete' : 'Pending'}
                    </Badge>
                  </div>
                  <Progress value={stats.totalVideos >= 1 ? 100 : 0} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Play 5 Games</span>
                    <Badge variant={stats.totalGames >= 5 ? "default" : "secondary"}>
                      {stats.totalGames}/5
                    </Badge>
                  </div>
                  <Progress value={(stats.totalGames / 5) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Explore 10 Resources</span>
                    <Badge variant={stats.totalResources >= 10 ? "default" : "secondary"}>
                      {stats.totalResources}/10
                    </Badge>
                  </div>
                  <Progress value={(stats.totalResources / 10) * 100} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-300">7-Day Streak</span>
                    <Badge variant={stats.streak >= 7 ? "default" : "secondary"}>
                      {stats.streak}/7
                    </Badge>
                  </div>
                  <Progress value={(stats.streak / 7) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Footer */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-100/10 dark:to-blue-900/20 border-purple-200 dark:border-purple-300">
          <CardContent className="p-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Your data is stored locally on this device
                  </p>
                  <p className="text-xs text-gray-800 dark:text-gray-900">
                    Export or share your progress anytime
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleClearData}>
                  <X className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
