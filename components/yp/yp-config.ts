// ---------------------------------------------------------------------------
// OKAYiT — Young Person Experience v2 : design tokens & content configuration
// A single source of truth. One accent per home. One word per idea.
// ---------------------------------------------------------------------------
import {
  CloudRain, Cloud, Cloudy, CloudSun, Sun,
  DoorOpen, Sofa, CookingPot, BedDouble, Briefcase, Flower2,
  Wind, Sparkles, BookOpen, Lightbulb, Scale, LineChart,
  BookLock, UserCircle2, Users, ShieldCheck,
  QrCode, Award, Clock, Trophy, Gamepad2, Heart, MessageCircle,
  ClipboardList, Medal, GraduationCap, Compass, Shield, HandHeart, Headphones,
  type LucideIcon,
} from 'lucide-react';

export type Skin = 'younger' | 'older';
export type TabId = 'start' | 'explore' | 'support' | 'mystuff';

// --- Neutral ground tokens (quiet background, colour is a signal) ----------
export const GROUND = '#F7F6F3';
export const INK = '#23252B';
export const INK_SOFT = '#5B5F6B';
export const LINE = '#E5E2DB';
// Support / protective resting tone — calm, never resting alarm-red
export const RESCUE = '#B45309';

// --- One accent per home ----------------------------------------------------
export interface Accent {
  accent: string;   // the single signal colour for the screen
  tint: string;     // very soft background wash of the accent
  ring: string;     // focus / active ring
  name: string;     // home display name
}

const ACCENTS: Record<string, Accent> = {
  claudius:   { accent: '#7C4DBC', tint: '#F1ECF8', ring: '#7C4DBC', name: 'Claudius Road' },
  winchester: { accent: '#2F6DB5', tint: '#EAF1F9', ring: '#2F6DB5', name: 'Winchester Close' },
  kingsnorth: { accent: '#2E8B6B', tint: '#E8F4EF', ring: '#2E8B6B', name: 'Kingsnorth' },
  _default:   { accent: '#4F5BD5', tint: '#ECEDFB', ring: '#4F5BD5', name: 'OKAYiT' },
};

export function getAccent(homeId?: string | null): Accent {
  if (!homeId) return ACCENTS._default;
  const key = homeId.toLowerCase().replace(/^home-/, '');
  return ACCENTS[key] || ACCENTS._default;
}

export function firstNameOf(user: any): string {
  const raw = String(user?.displayName || user?.name || '').trim();
  if (!raw || /guest/i.test(raw)) return '';
  return raw.split(/\s+/)[0];
}

export function greetingFor(hour: number): string {
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

// --- The one question: five gentle states ----------------------------------
export interface MoodState {
  level: number;      // 1..5
  id: string;         // matches wellbeing API mood ids
  label: string;
  Icon: LucideIcon;
  reflect: (name: string) => string;   // names the feeling back, no judgement
}

export const MOOD_STATES: MoodState[] = [
  { level: 1, id: 'really-low', label: 'Really low', Icon: CloudRain,
    reflect: (n) => `That sounds really hard${n ? `, ${n}` : ''}. Thank you for telling me.` },
  { level: 2, id: 'struggling', label: 'Low', Icon: Cloud,
    reflect: (n) => `A low day${n ? `, ${n}` : ''}. I'm glad you said.` },
  { level: 3, id: 'okay', label: 'OK', Icon: Cloudy,
    reflect: () => `An OK day. That's alright.` },
  { level: 4, id: 'good', label: 'Good', Icon: CloudSun,
    reflect: () => `Sounds like a good day.` },
  { level: 5, id: 'amazing', label: 'Great', Icon: Sun,
    reflect: (n) => `Love that today feels great${n ? `, ${n}` : ''}.` },
];

// --- The house: rooms are the navigation -----------------------------------
// Each room opens to a maximum of six items. content keys map to components
// in the experience shell's content registry.
export interface RoomItem {
  key: string;        // content registry key
  label: string;      // one word / short phrase per idea
  line: string;       // one plain line, readable aloud by a 9 year old
}
export interface Room {
  id: string;
  label: string;
  line: string;
  Icon: LucideIcon;
  photo: string;      // real house photo
  items: RoomItem[];
}

export const ROOMS: Room[] = [
  {
    id: 'front-door', label: 'Front door', line: 'Getting here and settling in',
    Icon: DoorOpen, photo: '/tour-images/lounge.jpg',
    items: [
      { key: 'welcome-tour', label: 'Take a look around', line: 'A gentle walk through the app' },
      { key: 'welcome-guide', label: 'Your welcome guide', line: 'Videos and notes about this home' },
      { key: 'house-tour', label: 'QR house tour', line: 'Scan a code to explore a room' },
      { key: 'meet-team', label: 'Meet the people', line: 'Who is here to support you' },
      { key: 'what-next', label: 'What happens next', line: 'Your first day, week and month' },
    ],
  },
  {
    id: 'living-room', label: 'Living room', line: 'Things to do and think about',
    Icon: Sofa, photo: '/tour-images/games_room.jpg',
    items: [
      { key: 'reflect', label: 'A moment to think', line: 'A short, private reflection' },
      { key: 'reflection', label: 'Reflection space', line: 'Think, write and express' },
      { key: 'story', label: 'Stories', line: 'Real stories from other young people' },
      { key: 'games', label: 'Games and fun', line: 'Play, relax and have fun' },
    ],
  },
  {
    id: 'kitchen', label: 'Kitchen', line: 'Everyday life skills',
    Icon: CookingPot, photo: '/tour-images/kitchen.jpg',
    items: [
      { key: 'lifeskills', label: 'Life skills', line: 'Handy guides for everyday things' },
      { key: 'resources', label: 'Your resources', line: 'Activities, tools and support' },
    ],
  },
  {
    id: 'bedroom', label: 'Bedroom', line: 'You and the people in your life',
    Icon: BedDouble, photo: '/tour-images/bedroom.jpg',
    items: [
      { key: 'aboutme', label: 'About me', line: 'Your space to say who you are' },
      { key: 'people', label: 'People in my life', line: 'The people who matter to you' },
    ],
  },
  {
    id: 'office', label: 'Office', line: 'Your rights and what you can expect',
    Icon: Briefcase, photo: '/tour-images/lounge.jpg',
    items: [
      { key: 'your-rights', label: 'Your rights', line: 'What protects you and how' },
      { key: 'care-standards', label: '9 standards of care', line: 'What your home must provide' },
      { key: 'keyworker', label: 'Your key worker', line: 'What they do and how they help' },
    ],
  },
  {
    id: 'garden', label: 'Garden', line: 'A calm, quiet place',
    Icon: Flower2, photo: '/tour-images/garden.jpg',
    items: [
      { key: 'calm', label: 'Calm corner', line: 'Breathe, ground and settle' },
    ],
  },
];

// --- Verified UK helplines (shared by Help + Support) -----------------------
export interface Helpline {
  name: string; number: string; line: string; href: string;
}
export const HELPLINES: Helpline[] = [
  { name: 'Childline', number: '0800 1111', line: 'Free and private, day or night, for under 19s', href: 'tel:08001111' },
  { name: 'Samaritans', number: '116 123', line: 'Free to call any time, any age', href: 'tel:116123' },
  { name: 'Shout', number: 'Text SHOUT to 85258', line: 'Free text support, any time', href: 'sms:85258?body=SHOUT' },
  { name: 'Emergency', number: '999', line: 'If you or someone else is in danger right now', href: 'tel:999' },
];

// --- The menu: every feature, grouped in calm sections ---------------------
// One tidy place to reach everything. content keys map to the shell registry.
export interface MenuItem { key: string; label: string; line: string; Icon: LucideIcon; tone: string; }
export interface MenuSection { title: string; emoji: string; tone: string; items: MenuItem[]; }

export const MENU: MenuSection[] = [
  {
    title: 'Your home',
    emoji: '🏡',
    tone: '#3B82F6',
    items: [
      { key: 'house-tour', label: 'QR house tour', line: 'Scan codes to explore', Icon: QrCode, tone: '#3B82F6' },
      { key: 'welcome-guide', label: 'Welcome guide', line: 'Videos and notes about home', Icon: BookOpen, tone: '#8B5CF6' },
      { key: 'meet-team', label: 'Meet the people', line: 'Who is here to support you', Icon: Users, tone: '#EC4899' },
      { key: 'what-next', label: 'What happens next', line: 'Your first day, week, month', Icon: Clock, tone: '#06B6D4' },
    ],
  },
  {
    title: 'Play & explore',
    emoji: '🎮',
    tone: '#F97316',
    items: [
      { key: 'quests', label: 'Quests', line: 'Fun challenges that help you learn', Icon: Trophy, tone: '#F59E0B' },
      { key: 'games', label: 'Games and fun', line: 'Play, relax and have fun', Icon: Gamepad2, tone: '#F97316' },
      { key: 'story', label: 'Real stories', line: 'Hear from other young people', Icon: Headphones, tone: '#F43F5E' },
      { key: 'reflection', label: 'Reflection space', line: 'Think, write and express', Icon: Lightbulb, tone: '#14B8A6' },
      { key: 'resources', label: 'Your resources', line: 'Activities, tools and support', Icon: Sparkles, tone: '#84CC16' },
    ],
  },
  {
    title: 'Learn & know',
    emoji: '📚',
    tone: '#22C55E',
    items: [
      { key: 'your-rights', label: 'Your rights', line: 'What protects you and how', Icon: Shield, tone: '#22C55E' },
      { key: 'care-standards', label: '9 standards of care', line: 'What your home must provide', Icon: Award, tone: '#6366F1' },
      { key: 'lifeskills', label: 'Useful guides', line: 'Life skills, education and more', Icon: GraduationCap, tone: '#0EA5E9' },
      { key: 'people', label: 'Positive relationships', line: 'Build connections, grow together', Icon: HandHeart, tone: '#EC4899' },
    ],
  },
  {
    title: 'Feelings & help',
    emoji: '💛',
    tone: '#EC4899',
    items: [
      { key: 'wellbeing', label: 'How are you feeling?', line: 'Check in with yourself', Icon: Heart, tone: '#EC4899' },
      { key: 'calm', label: 'Calm corner', line: 'Breathe, ground and settle', Icon: Wind, tone: '#06B6D4' },
      { key: 'reflect', label: 'A moment to think', line: 'A short, private reflection', Icon: Scale, tone: '#8B5CF6' },
      { key: 'keyworker', label: 'Your key worker', line: 'What they do and how they help', Icon: Users, tone: '#14B8A6' },
      { key: 'safety', label: 'My safety plan', line: 'Steps for a tough moment', Icon: ShieldCheck, tone: '#22C55E' },
      { key: 'feedback', label: 'Tell us what you think', line: 'Your opinion matters', Icon: MessageCircle, tone: '#F59E0B' },
    ],
  },
  {
    title: 'Your space',
    emoji: '🔒',
    tone: '#8B5CF6',
    items: [
      { key: 'journal', label: 'My journal', line: 'Private to this device', Icon: BookLock, tone: '#8B5CF6' },
      { key: 'aboutme', label: 'About me', line: 'Say who you are', Icon: UserCircle2, tone: '#EC4899' },
      { key: 'my-info', label: 'My important info', line: 'Contacts, dates and details', Icon: ClipboardList, tone: '#3B82F6' },
      { key: 'mood-story', label: 'My wellbeing story', line: 'How your days have felt', Icon: LineChart, tone: '#14B8A6' },
      { key: 'certificates', label: 'My certificates', line: 'View and download', Icon: Medal, tone: '#F59E0B' },
    ],
  },
];

// Four gentle first steps, shown on the Home hub as bigger, brighter cards.
export interface GetStartedItem { key: string; label: string; line: string; Icon: LucideIcon; from: string; to: string; }
export const GET_STARTED: GetStartedItem[] = [
  { key: 'wellbeing', label: 'Check in with your feelings', line: 'Tell us how your day is going', Icon: Heart, from: '#EC4899', to: '#F43F5E' },
  { key: 'quests', label: 'Try your first Quest', line: 'Fun challenges that help you learn', Icon: Trophy, from: '#F59E0B', to: '#F97316' },
  { key: 'meet-team', label: 'Meet your team', line: 'See who is here to support you', Icon: Users, from: '#8B5CF6', to: '#EC4899' },
  { key: 'welcome-tour', label: 'Take the guided tour', line: 'A quick look around, whenever you like', Icon: Compass, from: '#3B82F6', to: '#06B6D4' },
];
