
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Trash2, 
  Calendar, 
  Search,
  Filter,
  Eye,
  Edit3,
  BookOpen,
  Heart,
  MessageCircle,
  Sparkles,
  Archive,
  ArrowLeft,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { okayitTheme, combineThemeClasses } from '@/lib/okayit-theme';

interface SavedWork {
  id: string;
  title: string;
  content: string;
  type: 'reflection' | 'form' | 'story' | 'resource' | 'wellbeing' | 'other';
  category: string;
  savedAt: string;
  lastModified: string;
}

interface SavedWorkManagerProps {
  onBack: () => void;
  user?: any;
}

const typeIcons: Record<string, any> = {
  reflection: Heart,
  form: FileText,
  story: BookOpen,
  resource: Sparkles,
  wellbeing: MessageCircle,
  other: Edit3
};

const typeColors: Record<string, string> = {
  reflection: 'from-pink-500 to-rose-500',
  form: 'from-blue-500 to-indigo-500',
  story: 'from-purple-500 to-violet-500',
  resource: 'from-green-500 to-emerald-500',
  wellbeing: 'from-orange-500 to-amber-500',
  other: 'from-gray-500 to-slate-500'
};

export default function SavedWorkManager({ onBack, user }: SavedWorkManagerProps) {
  const [savedWorks, setSavedWorks] = useState<SavedWork[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWork, setSelectedWork] = useState<SavedWork | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    loadSavedWorks();
  }, []);

  const loadSavedWorks = () => {
    try {
      const stored = localStorage.getItem('saved_works');
      if (stored) {
        setSavedWorks(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading saved works:', error);
      toast.error('Failed to load saved works');
    }
  };

  const saveToStorage = (works: SavedWork[]) => {
    try {
      localStorage.setItem('saved_works', JSON.stringify(works));
      setSavedWorks(works);
    } catch (error) {
      console.error('Error saving works:', error);
      toast.error('Failed to save changes');
    }
  };

  const handleDelete = (id: string) => {
    const updated = savedWorks.filter(w => w.id !== id);
    saveToStorage(updated);
    toast.success('Work deleted successfully');
  };

  const handleDownload = (work: SavedWork) => {
    const blob = new Blob([
      `Title: ${work.title}\n`,
      `Type: ${work.type}\n`,
      `Category: ${work.category}\n`,
      `Saved: ${new Date(work.savedAt).toLocaleString()}\n`,
      `Last Modified: ${new Date(work.lastModified).toLocaleString()}\n\n`,
      `Content:\n${work.content}`
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${work.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Downloaded successfully');
  };

  const handleView = (work: SavedWork) => {
    setSelectedWork(work);
    setIsViewModalOpen(true);
  };

  const filteredWorks = savedWorks.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || work.type === selectedType;
    return matchesSearch && matchesType;
  });

  const worksByType = savedWorks.reduce((acc, work) => {
    acc[work.type] = (acc[work.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={combineThemeClasses("min-h-screen", okayitTheme.backgrounds.page)}>
      {/* Compact Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-2">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 flex items-center gap-1 text-purple-600 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-1.5">
            <Save className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-bold text-gray-800">My Saved Work</span>
          </div>
          <div className="w-12" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4"
        >
          <p className="text-xs text-gray-500 text-center mb-3">All your reflections, forms, and writings in one place</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
            <Card className={combineThemeClasses("", okayitTheme.backgrounds.card)}>
              <CardContent className="p-4 text-center">
                <div className="text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {savedWorks.length}
                </div>
                <div className={combineThemeClasses("text-sm", okayitTheme.text.muted)}>
                  Total Items
                </div>
              </CardContent>
            </Card>
            <Card className={combineThemeClasses("", okayitTheme.backgrounds.card)}>
              <CardContent className="p-4 text-center">
                <div className="text-sm font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  {worksByType.reflection || 0}
                </div>
                <div className={combineThemeClasses("text-sm", okayitTheme.text.muted)}>
                  Reflections
                </div>
              </CardContent>
            </Card>
            <Card className={combineThemeClasses("", okayitTheme.backgrounds.card)}>
              <CardContent className="p-4 text-center">
                <div className="text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {worksByType.form || 0}
                </div>
                <div className={combineThemeClasses("text-sm", okayitTheme.text.muted)}>
                  Forms
                </div>
              </CardContent>
            </Card>
            <Card className={combineThemeClasses("", okayitTheme.backgrounds.card)}>
              <CardContent className="p-4 text-center">
                <div className="text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {worksByType.story || 0}
                </div>
                <div className={combineThemeClasses("text-sm", okayitTheme.text.muted)}>
                  Stories
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900" />
              <Input
                placeholder="Search your saved work..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={combineThemeClasses(
                "px-4 py-2 rounded-lg border",
                okayitTheme.interactive.input
              )}
            >
              <option value="all">All Types</option>
              <option value="reflection">Reflections</option>
              <option value="form">Forms</option>
              <option value="story">Stories</option>
              <option value="resource">Resources</option>
              <option value="wellbeing">Wellbeing</option>
              <option value="other">Other</option>
            </select>
          </div>
        </motion.div>

        {/* Saved Works Grid */}
        {filteredWorks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Archive className="w-24 h-24 mx-auto mb-4 text-gray-300" />
            <h3 className={combineThemeClasses("text-xl font-semibold mb-2", okayitTheme.text.primary)}>
              {searchQuery || selectedType !== 'all' ? 'No matching work found' : 'No saved work yet'}
            </h3>
            <p className={combineThemeClasses("", okayitTheme.text.muted)}>
              {searchQuery || selectedType !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start creating reflections, filling forms, or writing to see your work here'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredWorks.map((work, index) => {
              const Icon = typeIcons[work.type];
              return (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={combineThemeClasses(
                    "h-full hover:shadow-lg transition-shadow cursor-pointer",
                    okayitTheme.backgrounds.card
                  )}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${typeColors[work.type]}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {work.type}
                        </Badge>
                      </div>
                      <CardTitle className={combineThemeClasses("text-lg", okayitTheme.text.primary)}>
                        {work.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(work.savedAt).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className={combineThemeClasses("text-sm mb-4 line-clamp-3", okayitTheme.text.muted)}>
                        {work.content}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleView(work)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(work)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(work.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedWork && (
                <>
                  {React.createElement(typeIcons[selectedWork.type], { className: "w-6 h-6" })}
                  {selectedWork.title}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedWork && (
            <div className="space-y-4">
              <div className="flex gap-4 text-sm text-gray-900">
                <Badge variant="secondary" className="capitalize">
                  {selectedWork.type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedWork.savedAt).toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-purple-950/20 rounded-lg p-6">
                <p className="whitespace-pre-wrap">{selectedWork.content}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownload(selectedWork)}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to save work from other components
export function saveWork(
  title: string,
  content: string,
  type: SavedWork['type'],
  category: string = 'General'
): void {
  try {
    const stored = localStorage.getItem('saved_works');
    const works: SavedWork[] = stored ? JSON.parse(stored) : [];
    
    const newWork: SavedWork = {
      id: `work_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      type,
      category,
      savedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    works.unshift(newWork);
    localStorage.setItem('saved_works', JSON.stringify(works));
    
    toast.success('Work saved successfully!');
  } catch (error) {
    console.error('Error saving work:', error);
    toast.error('Failed to save work');
  }
}
