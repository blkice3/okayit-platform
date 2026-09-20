// ============================================================
// STAYING SAFE ONLINE - keywork session configuration
// ------------------------------------------------------------
// This is the single place to edit content for the session.
// Platform names, helplines, section copy and scenarios all
// live here so they can be updated without touching the code.
//
// STYLE RULES for any copy edited here:
//   British English. Short sentences. Around ten words each.
//   No em dashes and no en dashes. Speak to the young person.
// ============================================================

export type Track = 'A' | 'B';

// ------------------------------------------------------------
// PLATFORM NAMES
// Kept generic on purpose so they do not go out of date.
// Edit these labels if you want to name the apps your young
// people actually use. Keep them here, not in the screens.
// ------------------------------------------------------------
export const PLATFORMS = {
  socialApp: 'a social app',
  chatApp: 'a chat app',
  videoApp: 'a video app',
  gameWithChat: 'a game with chat',
  photoApp: 'a photo sharing app',
};

// ------------------------------------------------------------
// HELPLINES AND REPORTING ROUTES
// Every route must be verified before release. Fill in who
// checked it and the date. Until verifiedOn is set, the admin
// view shows the route as "not verified". Routes past their
// review date show as "needs re-checking".
// ------------------------------------------------------------
export interface Helpline {
  id: string;
  name: string;
  what: string;            // one plain line about what they do
  phone?: string;
  text?: string;
  web?: string;
  hours: string;
  ageEligibility: string;
  contactMethods: string;  // plain summary: calls, texts, web
  // Verification metadata. Set these before release.
  verifiedBy: string;      // name of the person who checked it
  verifiedOn: string | null; // ISO date, e.g. '2026-08-28'. null = not verified
  reviewEveryDays: number; // how often to re-check
}

export const HELPLINES: Helpline[] = [
  {
    id: 'childline',
    name: 'Childline',
    what: 'Free, private support for anyone under 19.',
    phone: '0800 1111',
    web: 'https://www.childline.org.uk',
    hours: '24 hours, every day',
    ageEligibility: 'Under 19',
    contactMethods: 'Calls and online chat',
    verifiedBy: '[PLACEHOLDER: name of checker]',
    verifiedOn: null,
    reviewEveryDays: 90,
  },
  {
    id: 'report-remove',
    name: 'Report Remove',
    what: 'Helps you get a nude image of you taken down.',
    web: 'https://www.childline.org.uk/info-advice/bullying-abuse-safety/online-mobile-safety/remove-nude-image-shared-online/',
    hours: 'Online, any time',
    ageEligibility: 'Under 18',
    contactMethods: 'Web report, run with Childline',
    verifiedBy: '[PLACEHOLDER: name of checker]',
    verifiedOn: null,
    reviewEveryDays: 90,
  },
  {
    id: 'ceop',
    name: 'CEOP Safety Centre',
    what: 'Report an adult who is worrying you online.',
    web: 'https://www.ceop.police.uk/safety-centre/',
    hours: 'Online, any time',
    ageEligibility: 'Any age',
    contactMethods: 'Web report to police',
    verifiedBy: '[PLACEHOLDER: name of checker]',
    verifiedOn: null,
    reviewEveryDays: 90,
  },
  {
    id: 'report-harmful',
    name: 'Report Harmful Content',
    what: 'Helps you report content a platform left up.',
    web: 'https://reportharmfulcontent.com',
    hours: 'Online, any time',
    ageEligibility: '13 and over',
    contactMethods: 'Web report',
    verifiedBy: '[PLACEHOLDER: name of checker]',
    verifiedOn: null,
    reviewEveryDays: 90,
  },
  {
    id: 'samaritans',
    name: 'Samaritans',
    what: 'Talk any time about anything on your mind.',
    phone: '116 123',
    web: 'https://www.samaritans.org',
    hours: '24 hours, every day',
    ageEligibility: 'Any age',
    contactMethods: 'Calls, free from any phone',
    verifiedBy: '[PLACEHOLDER: name of checker]',
    verifiedOn: null,
    reviewEveryDays: 90,
  },
  {
    id: 'coram-voice',
    name: 'Coram Voice',
    what: 'Free advocacy for children in care.',
    phone: '0808 800 5792',
    web: 'https://coramvoice.org.uk',
    hours: 'Weekdays, check site for times',
    ageEligibility: 'Children in care and care leavers',
    contactMethods: 'Calls and web',
    verifiedBy: '[PLACEHOLDER: name of checker]',
    verifiedOn: null,
    reviewEveryDays: 90,
  },
];

// Helper: work out the state of a helpline for the admin view.
export type HelplineState = 'verified' | 'not-verified' | 'stale';
export function helplineState(h: Helpline, now: Date = new Date()): HelplineState {
  if (!h.verifiedOn) return 'not-verified';
  const verified = new Date(h.verifiedOn);
  if (isNaN(verified.getTime())) return 'not-verified';
  const ageDays = (now.getTime() - verified.getTime()) / 86_400_000;
  if (ageDays > h.reviewEveryDays) return 'stale';
  return 'verified';
}

// ------------------------------------------------------------
// SECTION AND SCREEN CONTENT
// Two tracks. Track A is for ages 11 to 13 and can use light
// character framing. Track B is for ages 14 to 17, adult tone,
// no character, no cartoon.
// ------------------------------------------------------------

export const TRACK_LABELS: Record<Track, { name: string; ages: string; note: string }> = {
  A: {
    name: 'Track A',
    ages: 'Ages 11 to 13',
    note: 'Lighter tone. A character you can build.',
  },
  B: {
    name: 'Track B',
    ages: 'Ages 14 to 17',
    note: 'Adult tone. No character. Straight talking.',
  },
};

// Screen 0: the three agreements the key worker reads aloud.
export const AGREEMENTS: string[] = [
  'You can stop at any point. Just tap Stop.',
  'You do not have to answer anything.',
  'Nothing you tap or type here is stored.',
];

// The safeguarding line shown on Screen 0. Honest, plain.
export const SAFEGUARDING_NOTICE =
  'One thing is different. If you tap "this has happened to me" on a card, we tell a member of staff here. We do this to keep you safe. We will never leave you on your own with something hard.';

// Warm up (Screen 1)
export const WARMUP = {
  A: {
    kind: 'character' as const,
    title: 'Build your character',
    intro: 'Make a hero for this session. Nothing here is saved.',
    powers: ['Super speed', 'Force field', 'Can talk to animals', 'Invisible', 'Reads minds', 'Never gives up'],
    mottos: ['Stay calm and think', 'Always ask for help', 'I look after myself', 'I am stronger than I know'],
  },
  B: {
    kind: 'question' as const,
    title: 'One quick question',
    intro: 'No right answer. It just gets us started.',
    question: 'How much of your life happens online?',
    options: ['Barely any', 'Some of it', 'Quite a lot', 'Most of it'],
  },
};

// Section 1: Passwords (both tracks share the teaching points)
export const PASSWORDS = {
  title: 'Passwords',
  teachingPoints: [
    'Length beats complexity. Longer is stronger.',
    'A passphrase of three or four words is easy and strong.',
    'Use a different password for different accounts.',
    'Never put your name, birthday or pet in it.',
  ],
  boundary:
    'Nobody is entitled to your password. Not a friend. Not a partner. Not an adult. If someone pushes you for it, that is worth telling someone about.',
  // Reassurance shown right by the input.
  privacyNote: 'This box never leaves this device. Nothing you type is sent or saved.',
};

// Section 2: What you give away
// Three staged images. Each has "tells" the young person taps.
// Images are simple described scenes. Swap the src later if you
// add real staged photos. Keep hotspots as plain labels.
export interface PhotoTell {
  id: string;
  label: string;   // what the tell is
  why: string;     // why it gives away location
}
export interface StagedPhoto {
  id: string;
  scene: string;   // plain description shown to the young person
  tells: PhotoTell[];
}
export const PHOTO_SCREEN = {
  title: 'What a photo gives away',
  intro: 'Tap anything that shows where someone lives, studies or spends time.',
  photos: [
    {
      id: 'photo-1',
      scene: 'A selfie in a bedroom. A school jumper is on the chair.',
      tells: [
        { id: 'p1-badge', label: 'School badge on the jumper', why: 'It names the school. That points to the area.' },
        { id: 'p1-window', label: 'Street sign seen through the window', why: 'A street name gives away the location.' },
        { id: 'p1-post', label: 'A letter with an address on the desk', why: 'An address is the clearest tell of all.' },
      ],
    },
    {
      id: 'photo-2',
      scene: 'A photo at a bus stop after school.',
      tells: [
        { id: 'p2-route', label: 'Bus route number and destination', why: 'A route shows the part of town you travel.' },
        { id: 'p2-shop', label: 'A named local shop behind you', why: 'A local name can be searched in seconds.' },
        { id: 'p2-door', label: 'A house number in the background', why: 'A number plus a street equals an address.' },
      ],
    },
    {
      id: 'photo-3',
      scene: 'A photo in the front garden of the home.',
      tells: [
        { id: 'p3-number', label: 'The number on the front door', why: 'This shows exactly where you live.' },
        { id: 'p3-reflection', label: 'A street sign in a window reflection', why: 'Reflections give away more than people think.' },
        { id: 'p3-car', label: 'A number plate on a car', why: 'A plate can be traced back to an address.' },
      ],
    },
  ] as StagedPhoto[],
  // Simulated privacy settings the young person can toggle.
  privacyControls: [
    { id: 'account-private', label: 'Make my account private', plain: 'Only people you accept can see your posts.' },
    { id: 'location-off', label: 'Turn off location on posts', plain: 'Your posts will not show where you are.' },
    { id: 'tag-review', label: 'Review tags before they appear', plain: 'You choose what others tag you in.' },
    { id: 'dm-friends', label: 'Only friends can message me', plain: 'Strangers cannot slide into your messages.' },
  ],
  publicByDefaultNote:
    'Many apps are public until you change them. That means anyone can see your posts. It is worth checking your settings today.',
};

// Section 3: When people are cruel
// Track B must not use the word cyberbullying.
export const CRUELTY = {
  titleA: 'When people are cruel',
  titleB: 'When people are cruel online',
  intro: 'Read the messages. Tap what you would do. There is no wrong answer.',
  // A short thread. Each step offers choices, each gets a reply.
  thread: [
    {
      id: 'step-1',
      message: 'Someone posts a mean comment about you in a group.',
      choices: [
        { id: 's1-block', label: 'Block them', reply: 'A strong move. Blocking stops them reaching you.' },
        { id: 's1-leave', label: 'Leave the group', reply: 'That is fine. You do not owe anyone your time.' },
        { id: 's1-tell', label: 'Tell someone', reply: 'Good idea. You do not have to handle this alone.' },
      ],
    },
    {
      id: 'step-2',
      message: 'They send more messages. It is getting worse.',
      choices: [
        { id: 's2-shot', label: 'Screenshot it first', reply: 'Smart. Keep proof before you delete anything.' },
        { id: 's2-report', label: 'Report them to the app', reply: 'Reporting is not grassing. It keeps people safe.' },
        { id: 's2-mute', label: 'Mute and step away', reply: 'Stepping back is okay. Your calm comes first.' },
      ],
    },
    {
      id: 'step-3',
      message: 'You feel upset and a bit alone.',
      choices: [
        { id: 's3-adult', label: 'Talk to staff here', reply: 'Yes. The person next to you can help right now.' },
        { id: 's3-friend', label: 'Talk to a friend', reply: 'Good. A friend can help you feel less alone.' },
        { id: 's3-line', label: 'Call a helpline', reply: 'That is always allowed. Help is there any time.' },
      ],
    },
  ],
  takeaways: [
    'Block or leave. You can do both.',
    'Screenshot before you delete anything.',
    'Tell someone you trust.',
    'Reporting is not grassing.',
  ],
};

// Section 4: Spotting manipulation (no stranger danger framing)
export const MANIPULATION = {
  title: 'Spotting manipulation',
  intro: 'Move the slider. Watch how things change over eight weeks.',
  point:
    'It never looks like danger at the start. It looks like someone finally paying attention.',
  // Eight week stages for the slider.
  stages: [
    { week: 1, label: 'Attention', text: 'They message a lot. They seem really interested in you.' },
    { week: 2, label: 'Attention', text: 'They remember small things. It feels nice to be noticed.' },
    { week: 3, label: 'Gifts', text: 'They send credit or small gifts. They ask for nothing back yet.' },
    { week: 4, label: 'Gifts', text: 'The gifts get bigger. You start to feel you owe them.' },
    { week: 5, label: 'Secrecy', text: 'They ask you to keep the chat between you two.' },
    { week: 6, label: 'Isolation', text: 'They say people around you do not understand you.' },
    { week: 7, label: 'Isolation', text: 'You talk to them more and to others less.' },
    { week: 8, label: 'A request', text: 'They ask for something. A photo, a meeting, a secret.' },
  ],
  signals: [
    'Asking you to keep secrets.',
    'Moving the chat to another app.',
    'Lots of gifts, fast.',
    'Things moving very quickly.',
    'Asking for photos.',
    'Turning you against people around you.',
  ],
};

// Scenarios (Screens 6 to 9)
export interface ScenarioChoice {
  id: string;
  label: string;
  reply: string;
}
export interface Scenario {
  id: string;
  title: string;
  prompt: string;
  choices: ScenarioChoice[];
  // Extra support routes to surface on sensitive scenarios.
  supportHelplineIds?: string[];
  sensitive?: boolean;
}

export const SCENARIOS_COMMON: Scenario[] = [
  {
    id: 'sc-prize',
    title: 'A prize you never entered',
    prompt: 'A message says you won a prize. It wants your details to send it.',
    choices: [
      { id: 'p-give', label: 'Send my details', reply: 'Real prizes do not ask like this. Sending details is risky.' },
      { id: 'p-ignore', label: 'Ignore and delete', reply: 'Good call. If you did not enter, you did not win.' },
      { id: 'p-check', label: 'Ask an adult first', reply: 'Sensible. A quick check saves a lot of trouble.' },
    ],
  },
  {
    id: 'sc-halfknow',
    title: 'Questions about home and school',
    prompt: 'Someone you half know keeps asking where you live and study.',
    choices: [
      { id: 'h-tell', label: 'Tell them the details', reply: 'Try to hold back. They do not need that yet.' },
      { id: 'h-vague', label: 'Keep it vague', reply: 'Good. You can be friendly and still stay private.' },
      { id: 'h-flag', label: 'Tell staff you feel unsure', reply: 'Yes. Trust that feeling and share it with staff.' },
    ],
  },
  {
    id: 'sc-frightening',
    title: 'Something that frightens you',
    prompt: 'You see something online that scares you or upsets you.',
    choices: [
      { id: 'f-alone', label: 'Keep it to myself', reply: 'You do not have to carry that alone. Telling helps.' },
      { id: 'f-close', label: 'Close it and tell staff', reply: 'Good. Step away and let someone support you.' },
      { id: 'f-report', label: 'Report what I saw', reply: 'Reporting is a strong choice. We can do it together.' },
    ],
  },
  {
    id: 'sc-generous-player',
    title: 'A generous player',
    prompt: 'A player in a game is very generous. They want to chat somewhere private.',
    choices: [
      { id: 'g-move', label: 'Move to a private chat', reply: 'Take care. Moving off the game is a common warning sign.' },
      { id: 'g-stay', label: 'Stay in the game chat', reply: 'Good. Keeping it public keeps you safer.' },
      { id: 'g-tell', label: 'Tell staff about it', reply: 'Yes. It is worth a quiet word with someone here.' },
    ],
  },
];

// Track B replaces the prize scenario with this one.
// Handled with extreme care. Non blaming. No method detail.
export const SCENARIO_B_IMAGE: Scenario = {
  id: 'sc-image-pressure',
  title: 'An image of you is being used against you',
  prompt:
    'An image of you exists that you did not want shared. Someone is using it to pressure you. Read the responses below.',
  sensitive: true,
  supportHelplineIds: ['report-remove', 'childline', 'ceop'],
  choices: [
    {
      id: 'i-fault',
      label: 'This is my fault',
      reply:
        'This is not your fault. This is done to young people. It is a crime against you, not by you.',
    },
    {
      id: 'i-pay',
      label: 'Give them what they ask',
      reply:
        'You do not have to. Giving in does not make it stop. Telling someone can stop it.',
    },
    {
      id: 'i-tell',
      label: 'Tell someone and report it',
      reply:
        'Yes. This can be stopped. There is a route to get the image taken down, and people who will help.',
    },
  ],
};

export function scenariosForTrack(track: Track): Scenario[] {
  if (track === 'B') {
    return [SCENARIO_B_IMAGE, ...SCENARIOS_COMMON.slice(1)];
  }
  return SCENARIOS_COMMON;
}

// Screen 10: people on your side
export const PEOPLE = {
  title: 'People on your side',
  intro: 'Add anyone you would go to. Any number is fine. Even one.',
  suggestions: [
    'A key worker',
    'A teacher',
    'A social worker',
    'An independent visitor',
    'An advocate',
    'A friend\u2019s parent',
    'A brother or sister',
  ],
  noOneRoute: {
    title: 'Not sure you have anyone?',
    body: 'That is okay. This is not a dead end. Help is still here.',
    line: 'The person sitting next to you right now can be the first name on your list, if you want.',
  },
};

// Screen 12: closing line, shown in both tracks.
export const CLOSING_LINE =
  'If something has come up during this session, you can tell your key worker now, or later, or through the platform.';

// Section order used by the progress bar and resume.
export const SECTION_IDS = [
  'start',       // 0
  'warmup',      // 1
  'passwords',   // 2
  'giveaway',    // 3
  'cruelty',     // 4
  'manipulation',// 5
  'scenario-1',  // 6
  'scenario-2',  // 7
  'scenario-3',  // 8
  'scenario-4',  // 9
  'people',      // 10
  'plan',        // 11
  'close',       // 12
] as const;
export type SectionId = typeof SECTION_IDS[number];
