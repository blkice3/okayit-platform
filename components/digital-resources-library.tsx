
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Heart, Shield, Star, CheckCircle, BookOpen, Users, Smile, Award, Calendar, Target } from 'lucide-react';
import { okayitTheme } from '@/lib/okayit-theme';
import OkayitLogo from './okayit-logo';
import { Button } from './ui/button';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'guide' | 'form' | 'activity' | 'wellbeing';
  icon: any;
  color: string;
  downloadUrl: string;
}

const resources: Resource[] = [
  {
    id: 'welcome-pack',
    title: 'Welcome to Your New Home',
    description: 'A friendly guide to help you settle in and feel comfortable',
    category: 'guide',
    icon: Heart,
    color: okayitTheme.colors.pink,
    downloadUrl: '/resources/welcome-pack.pdf'
  },
  {
    id: 'daily-routine',
    title: 'My Daily Routine Planner',
    description: 'Plan your day with this colorful and interactive schedule',
    category: 'form',
    icon: Calendar,
    color: okayitTheme.colors.purple,
    downloadUrl: '/resources/daily-routine.pdf'
  },
  {
    id: 'feelings-chart',
    title: 'How Am I Feeling Today',
    description: 'Express your emotions with our feelings chart',
    category: 'wellbeing',
    icon: Smile,
    color: okayitTheme.colors.amber,
    downloadUrl: '/resources/feelings-chart.pdf'
  },
  {
    id: 'achievement-tracker',
    title: 'My Achievement Tracker',
    description: 'Track your progress and celebrate your wins',
    category: 'activity',
    icon: Award,
    color: okayitTheme.colors.green,
    downloadUrl: '/resources/achievement-tracker.pdf'
  },
  {
    id: 'rights-guide',
    title: 'Know Your Rights',
    description: 'Learn about your rights in a fun and easy way',
    category: 'guide',
    icon: Shield,
    color: okayitTheme.colors.blue,
    downloadUrl: '/resources/rights-guide.pdf'
  },
  {
    id: 'goal-setting',
    title: 'My Goals and Dreams',
    description: 'Set goals and plan how to achieve them',
    category: 'form',
    icon: Target,
    color: okayitTheme.colors.orange,
    downloadUrl: '/resources/goal-setting.pdf'
  },
  {
    id: 'friend-making',
    title: 'Making Friends Guide',
    description: 'Tips and activities to help you make new friends',
    category: 'guide',
    icon: Users,
    color: okayitTheme.colors.teal,
    downloadUrl: '/resources/friend-making.pdf'
  },
  {
    id: 'reading-log',
    title: 'My Reading Adventure',
    description: 'Track the books you read and write your reviews',
    category: 'activity',
    icon: BookOpen,
    color: okayitTheme.colors.indigo,
    downloadUrl: '/resources/reading-log.pdf'
  },
  {
    id: 'wellbeing-checklist',
    title: 'Wellbeing Checklist',
    description: 'Daily activities to keep you happy and healthy',
    category: 'wellbeing',
    icon: CheckCircle,
    color: okayitTheme.colors.emerald,
    downloadUrl: '/resources/wellbeing-checklist.pdf'
  },
  {
    id: 'celebration-diary',
    title: 'My Celebration Diary',
    description: 'Record special moments and happy memories',
    category: 'activity',
    icon: Star,
    color: okayitTheme.colors.yellow,
    downloadUrl: '/resources/celebration-diary.pdf'
  }
];

const categories = [
  { id: 'all', label: 'All Resources', icon: FileText },
  { id: 'guide', label: 'Guides', icon: BookOpen },
  { id: 'form', label: 'Forms', icon: FileText },
  { id: 'activity', label: 'Activities', icon: Star },
  { id: 'wellbeing', label: 'Wellbeing', icon: Heart }
];

export default function DigitalResourcesLibrary({ onBack }: { onBack: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  const handleDownload = async (resource: Resource) => {
    setDownloadingId(resource.id);
    
    try {
      // Call API to generate PDF
      const response = await fetch('/api/generate-resource-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: resource.id,
          resourceTitle: resource.title
        })
      });
      
      if (response.ok) {
        // Download the PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resource.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading resource:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div 
      className="min-h-screen p-6 md:p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <OkayitLogo width={60} height={60} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Resource Library
              </h1>
              <p className="text-lg text-gray-900">
                Download helpful guides, forms and activities
              </p>
            </div>
          </div>
          <Button
            onClick={onBack}
            variant="outline"
            className="font-semibold"
            style={{
              borderColor: okayitTheme.colors.purple,
              color: okayitTheme.colors.purple
            }}
          >
            Back to Menu
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300"
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${okayitTheme.colors.purple}, ${okayitTheme.colors.blue})`
                    : 'var(--card-bg, #FFFFFF)',
                  color: isSelected ? '#ffffff' : 'var(--foreground-hex, #111827)',
                  boxShadow: isSelected 
                    ? `0 4px 20px ${okayitTheme.colors.purple}40`
                    : 'none'
                }}
              >
                <Icon size={20} />
                {category.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Resources Grid */}
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResources.map((resource, index) => {
              const Icon = resource.icon;
              const isDownloading = downloadingId === resource.id;

              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="rounded-2xl p-6 cursor-pointer transition-all duration-300"
                  style={{
                    background: 'var(--card-bg, #FFFFFF)',
                    boxShadow: `0 4px 20px ${resource.color}20`,
                    border: `2px solid ${resource.color}40`
                  }}
                  onClick={() => handleDownload(resource)}
                >
                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${resource.color}, ${resource.color}dd)`,
                      boxShadow: `0 8px 20px ${resource.color}40`
                    }}
                  >
                    <Icon size={32} color="#ffffff" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {resource.title}
                  </h3>
                  <p className="text-sm mb-4 line-clamp-2 text-gray-900">
                    {resource.description}
                  </p>

                  {/* Download Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isDownloading}
                    className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${resource.color}, ${resource.color}dd)`,
                      color: '#ffffff',
                      opacity: isDownloading ? 0.6 : 1
                    }}
                  >
                    {isDownloading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          <Download size={20} />
                        </motion.div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download size={20} />
                        Download PDF
                      </>
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText size={64} className="text-gray-900 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              No resources found
            </h3>
            <p className="text-gray-900">
              Try selecting a different category
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-6xl mx-auto mt-12 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <OkayitLogo width={40} height={40} />
          <p className="text-sm text-gray-900">
            All resources are designed by OKAYiT to support your wellbeing and development
          </p>
        </div>
        <p className="text-xs text-gray-900">
          Need help or have questions? Contact us at admin@okayit.uk
        </p>
      </motion.div>
    </div>
  );
}
