'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Bookmark, BookmarkCheck, Heart, X, AlertTriangle,
  Sparkles, Clock, ChevronRight, ChevronLeft, Star, Shield, Users,
  Lightbulb, Search, Filter, Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface EnhancedStoryExperienceV2Props {
  onBack: () => void;
}

// ── Video Data ──
interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  isSensitive?: boolean;
  sensitiveTopics?: string[];
  isUK: boolean;
  duration?: string;
}

interface VimeoVideoItem {
  id: string;
  vimeoUrl: string;
  posterUrl: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  isUK: boolean;
  duration?: string;
}

type AnyVideo = VideoItem | VimeoVideoItem;

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🎬' },
  { id: 'real-stories', label: 'Real Stories', emoji: '🌟' },
  { id: 'independence', label: 'Life Skills', emoji: '💪' },
  { id: 'wellbeing', label: 'Wellbeing', emoji: '💜' },
  { id: 'rights', label: 'Your Rights', emoji: '⚡' },
  { id: 'identity', label: 'Identity', emoji: '🤝' },
  { id: 'alex-journey', label: "Alex's Journey", emoji: '🎥' },
  { id: 'safety', label: 'Staying Safe', emoji: '🛡️' },
] as const;

const YOUTUBE_VIDEOS: VideoItem[] = [
  // ── Real Stories ──
  {
    id: 'ivy-story',
    youtubeId: 'RydgTJlBmDA',
    title: "Ivy's Story",
    subtitle: 'A care-experienced young person shares her journey, the prejudice, the struggles, and the success.',
    category: 'real-stories',
    tags: ['care leaver', 'National Care Leavers Week', 'BCP'],
    isUK: true,
    duration: '4:30',
  },
  {
    id: 'hayley-barnardos',
    youtubeId: 'k3g0jtuNMDE',
    title: "Hayley's Story, Barnardo's",
    subtitle: 'How Barnardo\'s leaving care services helped Hayley build confidence and find her path.',
    category: 'real-stories',
    tags: ['Barnardo\'s', 'care leaver', 'success'],
    isUK: true,
    duration: '3:15',
  },
  {
    id: 'sam-fixers',
    youtubeId: 'F8_A_01U0ng',
    title: "Sam's Story, Children in Care",
    subtitle: 'A Fixers campaign highlighting what life is really like for children growing up in the care system.',
    category: 'real-stories',
    tags: ['Fixers', 'awareness', 'children in care'],
    isUK: true,
    duration: '5:00',
  },
  {
    id: 'charmaine-fixers',
    youtubeId: 'Tkd5KXemMbo',
    title: "Charmaine's 12 Years in Care",
    subtitle: 'After 12 years in the care system, Charmaine shares her journey to success and wants others to know they can do it too.',
    category: 'real-stories',
    tags: ['Fixers', 'resilience', 'success'],
    isUK: true,
    duration: '4:00',
  },
  {
    id: 'care-young-sharing',
    youtubeId: 'YAQQrrs7BL0',
    title: 'Young People Share Their Stories',
    subtitle: 'Care-experienced young people open up about what life in care is really like, in their own words.',
    category: 'real-stories',
    tags: ['group stories', 'authentic voices', 'peer support'],
    isUK: true,
    duration: '6:45',
  },
  {
    id: 'dylan-leaving',
    youtubeId: 'iJnkQfvYBU0',
    title: "Dylan's Leaving Care Story",
    subtitle: 'Dylan talks about what it was really like to leave care, the fears, the support, and what helped most.',
    category: 'real-stories',
    tags: ['leaving care', 'transition', 'Leicestershire'],
    isUK: true,
    duration: '4:20',
  },
  {
    id: 'coventry-documentary',
    youtubeId: 'G9tP0z7_C8M',
    title: "Britain's Kids In Care",
    subtitle: 'A powerful documentary following teenagers through Coventry\'s care system during crucial moments in their lives.',
    category: 'real-stories',
    tags: ['documentary', 'Coventry', 'real life'],
    isUK: true,
    duration: '47:00',
  },
  {
    id: 'care-leaver-portrait',
    youtubeId: 'tNVI_Bx28wU',
    title: 'A Portrait of Recovery',
    subtitle: 'A Glasgow artist creates a portrait of a young care leaver, capturing their journey from trauma to recovery.',
    category: 'real-stories',
    tags: ['art', 'recovery', 'Glasgow', 'Scotland'],
    isUK: true,
    duration: '5:30',
  },

  // ── Life Skills & Independence ──
  {
    id: 'care-leavers-work',
    youtubeId: '7l14GJlW71Y',
    title: 'Care Leavers & The World of Work',
    subtitle: 'Young care leavers discuss finding jobs, interviews, and building careers after leaving care.',
    category: 'independence',
    tags: ['employment', 'careers', 'interviews'],
    isUK: true,
    duration: '8:10',
  },
  {
    id: 'colin-independence',
    youtubeId: '8883yoqX_Yg',
    title: "Colin's Independence Journey",
    subtitle: 'Following Colin as he takes charge of his transition to independence, real advice from someone who\'s been through it.',
    category: 'independence',
    tags: ['transition', 'independence', 'life skills'],
    isUK: true,
    duration: '6:30',
  },
  {
    id: 'leaving-care-what-happens',
    youtubeId: 'eeuWXHnXcBU',
    title: 'What Happens When You Turn 18?',
    subtitle: 'The big questions about leaving care at 18, what support you get, what changes, and how to prepare.',
    category: 'independence',
    tags: ['turning 18', 'leaving care', 'preparation'],
    isUK: true,
    duration: '5:45',
  },
  {
    id: 'leaving-care-transition',
    youtubeId: 'lViyVEUachs',
    title: 'The Transition from Care',
    subtitle: 'Young people discuss the extra challenges, anxiety, and fear that come with transitioning from care to adulthood.',
    category: 'independence',
    tags: ['transition', 'adulthood', 'challenges'],
    isUK: true,
    duration: '7:15',
  },
  {
    id: 'robin-nurse',
    youtubeId: 'yDJgGkAFwTo',
    title: 'From Care to Registered Nurse',
    subtitle: 'Robin\'s inspiring journey from foster care to qualifying as a registered nurse, proof that your past doesn\'t define your future.',
    category: 'independence',
    tags: ['nursing', 'career', 'inspiration', 'success'],
    isUK: true,
    duration: '5:00',
  },

  // ── Wellbeing ──
  {
    id: 'ella-emotions',
    youtubeId: 'KSor1hPre8c',
    title: "Ella's Story, Managing Emotions",
    subtitle: 'Ella shares what helped her manage anger and big feelings, honest advice from someone who gets it.',
    category: 'wellbeing',
    tags: ['emotions', 'anger', 'coping'],
    isUK: true,
    duration: '4:15',
  },
  {
    id: 'mental-health-care',
    youtubeId: 'sreFCgN40zs',
    title: "A Young Person's Mental Health Story",
    subtitle: 'An honest account of navigating mental health challenges while in the care system.',
    category: 'wellbeing',
    tags: ['mental health', 'CAMHS', 'lived experience'],
    isSensitive: true,
    sensitiveTopics: ['mental health', 'emotional distress'],
    isUK: true,
    duration: '5:30',
  },
  {
    id: 'trauma-council',
    youtubeId: 'PbaOFH7wN6U',
    title: 'Mental Health Support for Young People in Care',
    subtitle: 'Care-experienced young people and decision-makers discuss what good mental health support actually looks like.',
    category: 'wellbeing',
    tags: ['UK Trauma Council', 'mental health', 'policy'],
    isUK: true,
    duration: '12:00',
  },
  {
    id: 'building-resilience',
    youtubeId: 'XzeJgRonZgw',
    title: 'Building Resilience',
    subtitle: 'Young people share what helped them develop strength and resilience through difficult times in care.',
    category: 'wellbeing',
    tags: ['resilience', 'strength', 'growth'],
    isUK: true,
    duration: '6:00',
  },

  // ── Your Rights ──
  {
    id: 'alice-voice',
    youtubeId: '-1YNQNQjux4',
    title: "Alice's Story, Being Heard",
    subtitle: 'Alice found her voice and learned how to make sure adults actually listened. Her advice for getting heard.',
    category: 'rights',
    tags: ['advocacy', 'voice', 'being heard'],
    isUK: true,
    duration: '4:45',
  },
  {
    id: 'max-staying-safe',
    youtubeId: 'q67CetBaVNI',
    title: "Max's Story, Learning to Stay Safe",
    subtitle: 'Max shares practical advice on how he learned to recognise danger and keep himself safe.',
    category: 'rights',
    tags: ['safety', 'self-advocacy', 'awareness'],
    isUK: true,
    duration: '4:00',
  },
  {
    id: 'children-rights-care',
    youtubeId: 'x1AEWzgbvPc',
    title: 'Young Rights Advocate at UNICEF',
    subtitle: 'A 17-year-old speaks up about children\'s rights, what you\'re entitled to and why it matters.',
    category: 'rights',
    tags: ['UNICEF', 'children\'s rights', 'advocacy'],
    isUK: true,
    duration: '6:30',
  },

  // ── Identity & Belonging ──
  {
    id: 'understanding-care',
    youtubeId: 'tyBW0lT8_8E',
    title: 'Understanding Care Experiences',
    subtitle: 'Young voices sharing what it means to grow up in care and finding your own identity through it all.',
    category: 'identity',
    tags: ['identity', 'belonging', 'understanding'],
    isUK: true,
    duration: '5:45',
  },
  {
    id: 'siblings-reunited',
    youtubeId: 'Y4VpWSHrvME',
    title: 'Siblings Reunited After Years Apart',
    subtitle: 'The powerful moment when siblings separated by the care system are finally brought back together.',
    category: 'identity',
    tags: ['siblings', 'family', 'reunion'],
    isSensitive: true,
    sensitiveTopics: ['sibling separation', 'family loss'],
    isUK: false,
    duration: '8:20',
  },
  {
    id: 'sibling-bonds',
    youtubeId: '1Q55PNzGuaw',
    title: 'Sibling Bonds in Care',
    subtitle: 'The importance of keeping siblings connected when you\'re in the care system.',
    category: 'identity',
    tags: ['siblings', 'connection', 'family bonds'],
    isUK: true,
    duration: '5:00',
  },
  {
    id: 'friendships-in-care',
    youtubeId: 'y0GUtPoQqrU',
    title: 'Friendships in Care',
    subtitle: 'Making and keeping friends when life keeps changing, honest conversations about friendship in care.',
    category: 'identity',
    tags: ['friendships', 'relationships', 'connection'],
    isUK: true,
    duration: '4:30',
  },

  // ── Staying Safe ──
  {
    id: 'josie-relationships',
    youtubeId: '7jOuzGTCfGA',
    title: "Josie's Story, Toxic Relationships",
    subtitle: 'Josie shares her experience of a toxic relationship and the warning signs she wishes she\'d known sooner.',
    category: 'safety',
    tags: ['relationships', 'awareness', 'warning signs'],
    isSensitive: true,
    sensitiveTopics: ['toxic relationships', 'emotional abuse'],
    isUK: true,
    duration: '6:00',
  },
  {
    id: 'cce-awareness',
    youtubeId: 'AnBxE-qsJGY',
    title: 'Understanding Criminal Exploitation',
    subtitle: 'Important information about recognising when someone is trying to take advantage of you, and what to do about it.',
    category: 'safety',
    tags: ['exploitation', 'awareness', 'safety'],
    isSensitive: true,
    sensitiveTopics: ['criminal exploitation'],
    isUK: true,
    duration: '5:30',
  },
  {
    id: 'separated-story',
    youtubeId: 'lNynQQ6ZRPs',
    title: 'Separated, A Foster Care Story',
    subtitle: 'A moving story about the emotional impact of being separated from family and placed in care.',
    category: 'safety',
    tags: ['separation', 'foster care', 'emotions'],
    isSensitive: true,
    sensitiveTopics: ['family separation', 'grief'],
    isUK: false,
    duration: '7:00',
  },
];

const VIMEO_VIDEOS: VimeoVideoItem[] = [
  {
    id: 'alex-pt1',
    vimeoUrl: 'https://player.vimeo.com/video/1070361359?h=5bbe32f513&badge=0&autopause=0&player_id=0&app_id=58479',
    posterUrl: 'https://i.vimeocdn.com/video/1999626690-8853b7f5b396fcc9e6f3c908ab31f1a3aed35b9053ae9f792c9e6a6c123c3fab-d_1280x720',
    title: "Alex's Journey, Part 1",
    subtitle: 'The beginning of Alex\'s personal journey through the care system.',
    category: 'alex-journey',
    tags: ['Alex', 'personal journey', 'series'],
    isUK: true,
    duration: 'Part 1',
  },
  {
    id: 'alex-pt2',
    vimeoUrl: 'https://player.vimeo.com/video/1070361634?h=8401b8b853&badge=0&autopause=0&player_id=0&app_id=58479',
    posterUrl: 'https://i.vimeocdn.com/video/1999622961-11cf20d6a43e0a4b4ca58b5fdac5015d793b2b1b4bcf9fad6ae56ce9fe5aed58-d_1280x720',
    title: "Alex's Journey, Part 2",
    subtitle: 'Alex shares the challenges and turning points in their care experience.',
    category: 'alex-journey',
    tags: ['Alex', 'challenges', 'growth'],
    isUK: true,
    duration: 'Part 2',
  },
  {
    id: 'alex-pt3',
    vimeoUrl: 'https://player.vimeo.com/video/1070361843?h=afc7abe275&badge=0&autopause=0&player_id=0&app_id=58479',
    posterUrl: 'https://i.vimeocdn.com/video/1999628950-fe92bd69e4f9c0b4aee1dda5da2523a6000dba2308bccadbdd1a93d25b1c8a60-d_1280x720',
    title: "Alex's Journey, Part 3",
    subtitle: 'The final chapter, looking ahead and building a future.',
    category: 'alex-journey',
    tags: ['Alex', 'future', 'hope'],
    isUK: true,
    duration: 'Part 3',
  },
];

const ALL_VIDEOS: AnyVideo[] = [...YOUTUBE_VIDEOS, ...VIMEO_VIDEOS];

const YT_THUMB_HOST = ['https:', '', 'i.ytimg.com', 'vi'].join('/');
function getYouTubeThumbnail(youtubeId: string) {
  return `${YT_THUMB_HOST}/${youtubeId}/maxresdefault.jpg`;
}
function getYouTubeThumbnailFallback(youtubeId: string) {
  return `${YT_THUMB_HOST}/${youtubeId}/hqdefault.jpg`;
}

function isVimeoVideo(v: AnyVideo): v is VimeoVideoItem {
  return 'vimeoUrl' in v;
}
function isYouTubeVideo(v: AnyVideo): v is VideoItem {
  return 'youtubeId' in v;
}

// ── Component ──
export default function EnhancedStoryExperienceV2({ onBack }: EnhancedStoryExperienceV2Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [playingVideo, setPlayingVideo] = useState<AnyVideo | null>(null);
  const [warningAccepted, setWarningAccepted] = useState<string[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const scrollContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('okayit-story-bookmarks');
      if (saved) setBookmarked(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarked(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      try { localStorage.setItem('okayit-story-bookmarks', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // Filter videos
  const filteredVideos = ALL_VIDEOS.filter(v => {
    if (activeCategory !== 'all' && v.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return v.title.toLowerCase().includes(q) || v.subtitle.toLowerCase().includes(q) || v.tags.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  // Group by category for the browse view
  const categorisedVideos = CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
    ...cat,
    videos: ALL_VIDEOS.filter(v => v.category === cat.id),
  })).filter(c => c.videos.length > 0);

  const handlePlay = (video: AnyVideo) => {
    const yt = isYouTubeVideo(video) ? video : null;
    if (yt?.isSensitive && !warningAccepted.includes(video.id)) {
      // Show warning first
      setPlayingVideo(video);
      return;
    }
    setPlayingVideo(video);
  };

  const scrollRow = (catId: string, direction: 'left' | 'right') => {
    const el = scrollContainerRefs.current[catId];
    if (el) {
      const amount = direction === 'left' ? -300 : 300;
      el.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // ── Player View ──
  if (playingVideo) {
    const ytVideo = isYouTubeVideo(playingVideo) ? playingVideo : null;
    const vmVideo = isVimeoVideo(playingVideo) ? playingVideo : null;
    const needsWarning = ytVideo?.isSensitive && !warningAccepted.includes(playingVideo.id);

    if (needsWarning && ytVideo) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-amber-900">Just so you know</h2>
                <p className="text-sm text-amber-700">This video has some heavy topics</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-gray-700 text-sm"><strong>&ldquo;{playingVideo.title}&rdquo;</strong> talks about:</p>
              <div className="flex flex-wrap gap-2">
                {ytVideo.sensitiveTopics?.map(topic => (
                  <span key={topic} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                    {topic}
                  </span>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>It&apos;s totally okay to skip this one.</strong> You can come back anytime, or pick something else. If anything upsets you, tap <strong>&ldquo;Get Help Anytime&rdquo;</strong> in the main menu.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setPlayingVideo(null)}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Pick something else
              </Button>
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={() => {
                setWarningAccepted(prev => [...prev, playingVideo.id]);
              }}>
                I&apos;m ready to watch
              </Button>
            </div>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Close bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/80">
          <button onClick={() => setPlayingVideo(null)} className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Stories
          </button>
          <button onClick={() => toggleBookmark(playingVideo.id)} className="p-2 rounded-full hover:bg-white/10">
            {bookmarked.includes(playingVideo.id)
              ? <BookmarkCheck className="w-5 h-5 text-yellow-400" />
              : <Bookmark className="w-5 h-5 text-white/60" />
            }
          </button>
        </div>
        {/* Video embed */}
        <div className="flex-1 flex flex-col">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            {ytVideo && (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${ytVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={playingVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {vmVideo && (
              <iframe
                className="absolute inset-0 w-full h-full"
                src={vmVideo.vimeoUrl}
                title={playingVideo.title}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          <div className="px-4 py-5 bg-gradient-to-b from-gray-900 to-black flex-1">
            <h2 className="text-xl font-bold text-white mb-2">{playingVideo.title}</h2>
            <p className="text-sm text-gray-400 mb-4">{playingVideo.subtitle}</p>
            <div className="flex flex-wrap gap-2">
              {playingVideo.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs text-gray-400 border-gray-700">{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Library View ──
  const isSearching = searchQuery.length > 0 || activeCategory !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-slate-900 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-purple-950/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-bold transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-base font-bold text-white">Story Journey</span>
          </div>
          <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-4 pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stories, topics, tags..."
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category tabs */}
        <div className="px-4 pb-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pb-24">
        {/* Hero */}
        {!isSearching && (
          <div className="px-4 pt-6 pb-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-6 sm:p-8">
                <div className="relative z-10">
                  <Badge className="bg-white/20 text-white border-0 mb-3 text-xs font-bold">✨ Your Story Journey</Badge>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Real stories from real young people</h1>
                  <p className="text-white/80 text-sm sm:text-base max-w-lg">
                    Watch videos from young people across the UK who&apos;ve been in care, their experiences, advice, and journeys. You&apos;re not alone.
                  </p>
                  <div className="flex gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{ALL_VIDEOS.length}</div>
                      <div className="text-xs text-white/60">Videos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{CATEGORIES.length - 1}</div>
                      <div className="text-xs text-white/60">Topics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">{bookmarked.length}</div>
                      <div className="text-xs text-white/60">Saved</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 left-1/2 w-24 h-24 bg-white/5 rounded-full translate-y-12" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Searching / filtered results */}
        {isSearching ? (
          <div className="px-4 pt-4">
            <p className="text-white/50 text-sm mb-4">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} found
              {activeCategory !== 'all' && ` in ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredVideos.map((video, idx) => (
                <VideoCard key={video.id} video={video} index={idx} bookmarked={bookmarked} onPlay={handlePlay} onToggleBookmark={toggleBookmark} />
              ))}
            </div>
            {filteredVideos.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50 font-medium">No videos found</p>
                <p className="text-white/30 text-sm mt-1">Try a different search or category</p>
              </div>
            )}
          </div>
        ) : (
          /* Category rows — Netflix-style */
          <div className="space-y-6 pt-2">
            {/* Saved videos row */}
            {bookmarked.length > 0 && (
              <CategoryRow
                label="⭐ Your Saved Videos"
                videos={ALL_VIDEOS.filter(v => bookmarked.includes(v.id))}
                bookmarked={bookmarked}
                onPlay={handlePlay}
                onToggleBookmark={toggleBookmark}
                scrollRef={(el) => { scrollContainerRefs.current['saved'] = el; }}
                onScrollLeft={() => scrollRow('saved', 'left')}
                onScrollRight={() => scrollRow('saved', 'right')}
              />
            )}

            {categorisedVideos.map(cat => (
              <CategoryRow
                key={cat.id}
                label={`${cat.emoji} ${cat.label}`}
                videos={cat.videos}
                bookmarked={bookmarked}
                onPlay={handlePlay}
                onToggleBookmark={toggleBookmark}
                scrollRef={(el) => { scrollContainerRefs.current[cat.id] = el; }}
                onScrollLeft={() => scrollRow(cat.id, 'left')}
                onScrollRight={() => scrollRow(cat.id, 'right')}
              />
            ))}
          </div>
        )}

        {/* Help reminder */}
        <div className="px-4 mt-8">
          <div className="bg-purple-900/40 border border-purple-700/30 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-purple-200 font-medium">Feeling upset by something you watched?</p>
              <p className="text-xs text-purple-400 mt-1">It&apos;s completely normal. Go back to the main menu and tap <strong>&ldquo;Get Help Anytime&rdquo;</strong>, someone is always there for you. 💜</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Category Row (horizontal scroll) ──
function CategoryRow({ label, videos, bookmarked, onPlay, onToggleBookmark, scrollRef, onScrollLeft, onScrollRight }: {
  label: string;
  videos: AnyVideo[];
  bookmarked: string[];
  onPlay: (v: AnyVideo) => void;
  onToggleBookmark: (id: string) => void;
  scrollRef: (el: HTMLDivElement | null) => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}) {
  return (
    <div>
      <div className="px-4 flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-white">{label}</h2>
        <div className="flex gap-1">
          <button onClick={onScrollLeft} className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={onScrollRight} className="p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide snap-x snap-mandatory">
        {videos.map((video, idx) => (
          <div key={video.id} className="flex-shrink-0 w-[200px] sm:w-[240px] snap-start">
            <VideoCard video={video} index={idx} bookmarked={bookmarked} onPlay={onPlay} onToggleBookmark={onToggleBookmark} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Video Card ──
function VideoCard({ video, index, bookmarked, onPlay, onToggleBookmark }: {
  video: AnyVideo;
  index: number;
  bookmarked: string[];
  onPlay: (v: AnyVideo) => void;
  onToggleBookmark: (id: string) => void;
}) {
  const ytVideo = isYouTubeVideo(video) ? video : null;
  const vimeoVideo = isVimeoVideo(video) ? video : null;
  const isBookmarked = bookmarked.includes(video.id);
  const thumbnailUrl = ytVideo
    ? getYouTubeThumbnail(ytVideo.youtubeId)
    : vimeoVideo?.posterUrl ?? '/api/placeholder/320/180';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
      className="group cursor-pointer"
      onClick={() => onPlay(video)}
    >
      {/* Thumbnail */}
      <div className="relative rounded-xl overflow-hidden aspect-video bg-gray-800 mb-2">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (ytVideo && !img.dataset.fallbackTried) {
              img.dataset.fallbackTried = '1';
              img.src = getYouTubeThumbnailFallback(ytVideo.youtubeId);
            } else {
              img.src = '/api/placeholder/320/180';
            }
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-purple-600/90 flex items-center justify-center shadow-lg shadow-purple-600/30 backdrop-blur-sm">
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
            {video.duration}
          </div>
        )}

        {/* Sensitive badge */}
        {ytVideo?.isSensitive && (
          <div className="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Sensitive
          </div>
        )}

        {/* UK badge */}
        {video.isUK && (
          <div className="absolute top-2 right-2 text-[10px]">
            🇬🇧
          </div>
        )}

        {/* Bookmark */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleBookmark(video.id); }}
          className={`absolute bottom-2 left-2 p-1 rounded-full transition-all ${
            isBookmarked ? 'bg-yellow-500/90 text-white' : 'bg-black/40 text-white/60 opacity-0 group-hover:opacity-100'
          }`}
        >
          {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Text */}
      <h3 className="text-sm font-bold text-white leading-tight group-hover:text-purple-300 transition-colors line-clamp-2">
        {video.title}
      </h3>
      <p className="text-xs text-white/50 mt-0.5 line-clamp-2 leading-relaxed">
        {video.subtitle}
      </p>
    </motion.div>
  );
}
