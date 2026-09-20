/**
 * OKAYiT Quests — gamified, age-appropriate learning adventures mapped 1:1 to
 * the 9 Quality Standards from the Children's Homes (England) Regulations 2015.
 *
 * These are the exact standards Ofsted inspects, framed here in warm,
 * young-person-friendly language so children learn their rights and what good
 * care looks like — while having fun. Each quest captures the child's own voice
 * (a reflection), which is direct evidence for the "children's views, wishes and
 * feelings" standard.
 */

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  why: string;
}

export interface Quest {
  id: string;
  standardNo: number;
  /** Kid-friendly title */
  title: string;
  /** Official Quality Standard name (for staff / Ofsted mapping) */
  standardName: string;
  emoji: string;
  /** tailwind colour key used by the UI */
  colour: 'purple' | 'blue' | 'green' | 'pink' | 'orange' | 'teal' | 'amber' | 'rose' | 'indigo';
  tagline: string;
  /** "What this means for YOU" — the child's rights in plain words */
  youShould: string[];
  quiz: QuizQuestion[];
  reflectPrompt: string;
}

export const QUESTS: Quest[] = [
  {
    id: 'quality-of-care',
    standardNo: 1,
    title: 'Your Home, Your Care',
    standardName: 'The Quality and Purpose of Care Standard',
    emoji: '🏡',
    colour: 'purple',
    tagline: 'What great care looks and feels like',
    youShould: [
      'You should feel welcome, safe and cared for in your home.',
      'Staff should get to know you — what you like, need and hope for.',
      'Your home should be warm, clean and a nice place to live.',
    ],
    quiz: [
      {
        q: 'A really good care home should feel like…',
        options: ['A place with lots of rules and nothing else', 'A safe, warm place where people care about you', 'Somewhere you visit but never settle'],
        correct: 1,
        why: 'Your home should feel safe and warm, and the people there should genuinely care about you.',
      },
      {
        q: 'If something about your home does not feel right, you can…',
        options: ['Say nothing and hope it changes', 'Tell a trusted adult or your key worker', 'Only mention it once a year'],
        correct: 1,
        why: 'You can always speak up. Telling a trusted adult helps make your home better for you.',
      },
    ],
    reflectPrompt: 'What is one thing that makes your home feel good — or one thing that would make it even better?',
  },
  {
    id: 'your-voice',
    standardNo: 2,
    title: 'Your Voice Matters',
    standardName: "The Children's Views, Wishes and Feelings Standard",
    emoji: '🗣️',
    colour: 'pink',
    tagline: 'Being heard and making choices',
    youShould: [
      'The grown-ups should ask what you think — and really listen.',
      'You have a say in decisions about your life and daily routine.',
      'Your feelings count, even when they are hard to say out loud.',
    ],
    quiz: [
      {
        q: 'When a decision is being made about your life, you should…',
        options: ['Not be told anything', 'Be asked what you think and feel', 'Only find out afterwards'],
        correct: 1,
        why: 'You have the right to be asked and listened to about decisions that affect you.',
      },
      {
        q: 'If you disagree with a decision, you can…',
        options: ['Say how you feel and ask why', 'Do nothing', 'Get in trouble for asking'],
        correct: 0,
        why: 'Asking questions and sharing how you feel is always okay — your voice matters.',
      },
    ],
    reflectPrompt: 'Is there a decision or a change you would like a bigger say in right now?',
  },
  {
    id: 'education',
    standardNo: 3,
    title: 'Learn & Grow',
    standardName: 'The Education Standard',
    emoji: '🎓',
    colour: 'blue',
    tagline: 'School, learning and your future',
    youShould: [
      'You should get help to do your best at school or college.',
      'The adults should support your learning and celebrate your progress.',
      'You can dream big — and get help to reach your goals.',
    ],
    quiz: [
      {
        q: 'The people who care for you should help with your education by…',
        options: ['Ignoring school stuff', 'Supporting you and cheering on your progress', 'Only caring about grades'],
        correct: 1,
        why: 'Good care means helping you learn, and being proud of every step forward you make.',
      },
      {
        q: 'If you are finding school tough, a good thing to do is…',
        options: ['Keep it to yourself', 'Talk to your key worker or teacher for support', 'Give up'],
        correct: 1,
        why: 'Everyone needs help sometimes. Asking for support is a strong and smart move.',
      },
    ],
    reflectPrompt: 'What is one thing you would love to get better at, or learn about, this year?',
  },
  {
    id: 'enjoyment',
    standardNo: 4,
    title: 'Fun & Achievement',
    standardName: 'The Enjoyment and Achievement Standard',
    emoji: '🌟',
    colour: 'orange',
    tagline: 'Hobbies, talents and having fun',
    youShould: [
      'You should get to try hobbies, sports and things you enjoy.',
      'Your talents and interests should be encouraged.',
      'Fun and play are important — they are part of good care!',
    ],
    quiz: [
      {
        q: 'Trying new hobbies and activities is…',
        options: ['A waste of time', 'A great part of growing up and having fun', 'Only for other people'],
        correct: 1,
        why: 'Discovering what you love is brilliant for you — and you deserve those chances.',
      },
      {
        q: 'If there is an activity or club you really want to try, you can…',
        options: ['Ask a trusted adult to help make it happen', 'Assume the answer is no', 'Never mention it'],
        correct: 0,
        why: 'Speak up about what you enjoy — the adults are there to help you take part.',
      },
    ],
    reflectPrompt: 'What is something fun you did recently, or something you would love to try next?',
  },
  {
    id: 'health',
    standardNo: 5,
    title: 'Healthy & Well',
    standardName: 'The Health and Wellbeing Standard',
    emoji: '💚',
    colour: 'green',
    tagline: 'Looking after your body and mind',
    youShould: [
      'You should get help to stay healthy in body and mind.',
      'It is okay to talk about your feelings — support is always there.',
      'You can ask for help with sleep, food, worries or anything on your mind.',
    ],
    quiz: [
      {
        q: 'Looking after your wellbeing includes…',
        options: ['Only your body', 'Both your body AND your feelings', 'Neither'],
        correct: 1,
        why: 'Being well means caring for your mind and your body — both matter equally.',
      },
      {
        q: 'If you feel worried or low, a helpful step is…',
        options: ['Bottling it up', 'Telling someone you trust or using a check-in', 'Pretending everything is fine'],
        correct: 1,
        why: 'Sharing how you feel is a brave, healthy thing to do — and help is always here.',
      },
    ],
    reflectPrompt: 'What is one small thing that helps you feel calmer or happier when things get tough?',
  },
  {
    id: 'relationships',
    standardNo: 6,
    title: 'People Who Care',
    standardName: 'The Positive Relationships Standard',
    emoji: '🤝',
    colour: 'rose',
    tagline: 'Friendships, family and trust',
    youShould: [
      'You should be helped to build kind, trusting relationships.',
      'Staying in touch with people who matter to you is important.',
      'The adults should treat you with warmth and respect.',
    ],
    quiz: [
      {
        q: 'A healthy relationship is one where…',
        options: ['You feel scared or ignored', 'You feel respected, safe and listened to', 'You are told what to think'],
        correct: 1,
        why: 'Good relationships feel safe and respectful, and the other person listens to you.',
      },
      {
        q: 'Keeping in contact with people who are important to you is…',
        options: ['Something you can be supported with', 'Not allowed', 'Only up to other people'],
        correct: 0,
        why: 'Staying connected to people who matter to you is your right, and staff can help.',
      },
    ],
    reflectPrompt: 'Who is someone that makes you feel safe and cared for — and why?',
  },
  {
    id: 'safety',
    standardNo: 7,
    title: 'Safe & Protected',
    standardName: 'The Protection of Children Standard',
    emoji: '🛡️',
    colour: 'indigo',
    tagline: 'Staying safe and knowing your rights',
    youShould: [
      'You have the right to feel safe — always.',
      'You should know who to talk to if something worries or scares you.',
      'No question or worry is ever “too small” to share.',
    ],
    quiz: [
      {
        q: 'If something makes you feel unsafe, you should…',
        options: ['Keep it secret', 'Tell a trusted adult straight away', 'Wait a long time'],
        correct: 1,
        why: 'Telling a trusted adult quickly helps keep you safe. Your safety comes first.',
      },
      {
        q: 'Feeling safe in your home is…',
        options: ['A nice extra', 'Your right, every single day', 'Only sometimes'],
        correct: 1,
        why: 'Being safe is your right, not a bonus — the adults must protect you.',
      },
    ],
    reflectPrompt: 'Who are the people or places that help you feel safe? (You could add them to your Safety Plan.)',
  },
  {
    id: 'leadership',
    standardNo: 8,
    title: 'Team Behind You',
    standardName: 'The Leadership and Management Standard',
    emoji: '🧭',
    colour: 'teal',
    tagline: 'The people running your home well',
    youShould: [
      'The people in charge should make sure your home is run well and fairly.',
      'Staff should be well trained and know how to support you.',
      'You should be told who is in charge and how things work.',
    ],
    quiz: [
      {
        q: 'The managers of your home are responsible for…',
        options: ['Making sure you get safe, good care', 'Nothing to do with you', 'Only paperwork'],
        correct: 0,
        why: 'Leaders make sure the whole home looks after you safely and kindly.',
      },
      {
        q: 'If you want to know how a decision was made, you can…',
        options: ['Ask — you deserve a clear answer', 'Never ask', 'Only guess'],
        correct: 0,
        why: 'You can ask how and why things happen. A well-run home explains things to you.',
      },
    ],
    reflectPrompt: 'Is there anything about how your home is run that you would like explained more clearly?',
  },
  {
    id: 'care-planning',
    standardNo: 9,
    title: 'Your Plan, Your Future',
    standardName: 'The Care Planning Standard',
    emoji: '🗺️',
    colour: 'amber',
    tagline: 'Planning ahead, together',
    youShould: [
      'You should have a care plan — and understand what is in it.',
      'Your wishes should shape the plans made about your life.',
      'You should be prepared and supported for what comes next.',
    ],
    quiz: [
      {
        q: 'Your care plan should…',
        options: ['Be a secret from you', 'Include your wishes and be explained to you', 'Never change'],
        correct: 1,
        why: 'Your plan is about YOU — you should understand it and help shape it.',
      },
      {
        q: 'When big changes are coming, you should be…',
        options: ['Kept in the dark', 'Prepared and supported', 'Left to cope alone'],
        correct: 1,
        why: 'Good care means helping you feel ready and supported for whatever comes next.',
      },
    ],
    reflectPrompt: 'What is one hope or goal you have for your future that you would like your plan to include?',
  },
];

// ---------------------------------------------------------------------------
// Gamification helpers
// ---------------------------------------------------------------------------

export const XP_PER_CORRECT = 20;
export const XP_COMPLETE_BONUS = 40;
export const XP_REFLECTION = 15;

export interface LevelInfo {
  level: number;
  name: string;
  emoji: string;
  /** xp at which this level starts */
  floor: number;
  /** xp at which the next level starts (Infinity for max) */
  next: number;
}

const LEVELS = [
  { name: 'Explorer', emoji: '🌱', floor: 0 },
  { name: 'Pathfinder', emoji: '🧭', floor: 120 },
  { name: 'Champion', emoji: '⭐', floor: 300 },
  { name: 'Trailblazer', emoji: '🚀', floor: 520 },
  { name: 'Legend', emoji: '🏆', floor: 780 },
];

export function levelForXp(xp: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].floor) idx = i;
  }
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  return {
    level: idx + 1,
    name: cur.name,
    emoji: cur.emoji,
    floor: cur.floor,
    next: next ? next.floor : Infinity,
  };
}

export interface BadgeDef {
  id: string;
  label: string;
  emoji: string;
  desc: string;
}

export const MILESTONE_BADGES: BadgeDef[] = [
  { id: 'first-quest', label: 'First Steps', emoji: '👣', desc: 'Completed your first quest' },
  { id: 'halfway', label: 'Halfway Hero', emoji: '⚡', desc: 'Completed 5 quests' },
  { id: 'all-nine', label: 'Standards Star', emoji: '🌟', desc: 'Completed all 9 quests' },
  { id: 'voice', label: 'Your Voice', emoji: '🗣️', desc: 'Shared 3 reflections' },
  { id: 'streak-3', label: 'On a Roll', emoji: '🔥', desc: '3-day learning streak' },
];
