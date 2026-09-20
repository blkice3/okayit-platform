
// OKAYiT.uk Vibrant Multi-Color Theme - Fun & Easy to Use!

export const okayitTheme = {
  // Vibrant Color Palette - Purple, Blue, Orange, Green Mix
  colors: {
    // Primary vibrant colors
    purple: '#9333EA',        // Bright purple
    deepPurple: '#7C3AED',   // Deep purple
    blue: '#3B82F6',         // Bright blue
    skyBlue: '#0EA5E9',      // Sky blue
    orange: '#F97316',       // Vibrant orange
    amber: '#F59E0B',        // Warm amber
    green: '#10B981',        // Fresh green
    emerald: '#059669',      // Rich emerald
    
    // Supporting colors
    pink: '#EC4899',         // Fun pink
    rose: '#F43F5E',         // Bright rose
    yellow: '#EAB308',       // Sunny yellow
    teal: '#14B8A6',         // Cool teal
    indigo: '#6366F1',       // Deep indigo
    lime: '#84CC16',         // Fresh lime
    
    // Neutrals with high contrast
    white: '#FFFFFF',
    lightGray: '#F3F4F6',
    mediumGray: '#9CA3AF',
    darkGray: '#374151',
    nearBlack: '#1F2937',
    
    // Text colors for maximum contrast
    textOnLight: '#111827',  // Almost black on light backgrounds
    textOnDark: '#FFFFFF',   // White on dark backgrounds
  },

  // Vibrant Background Combinations
  backgrounds: {
    // Page backgrounds
    page: 'bg-gradient-to-br from-purple-50 via-blue-50 to-green-50',
    pageDark: 'dark:bg-gradient-to-br dark:from-purple-950 dark:via-blue-950 dark:to-green-950',
    
    // Card backgrounds with colors
    purpleCard: 'bg-gradient-to-br from-purple-50 to-white border border-purple-200 shadow-sm',
    blueCard: 'bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-sm',
    orangeCard: 'bg-gradient-to-br from-orange-50 to-white border border-orange-200 shadow-sm',
    greenCard: 'bg-gradient-to-br from-green-50 to-white border border-green-200 shadow-sm',
    pinkCard: 'bg-gradient-to-br from-pink-50 to-white border border-pink-200 shadow-sm',
    yellowCard: 'bg-gradient-to-br from-yellow-50 to-white border border-yellow-200 shadow-sm',
    
    // White cards with colorful borders
    whiteCardPurple: 'bg-white border border-purple-200 shadow-md hover:shadow-lg hover:border-purple-300 transition-all',
    whiteCardBlue: 'bg-white border border-blue-200 shadow-md hover:shadow-lg hover:border-blue-300 transition-all',
    whiteCardOrange: 'bg-white border border-orange-200 shadow-md hover:shadow-lg hover:border-orange-300 transition-all',
    whiteCardGreen: 'bg-white border border-green-200 shadow-md hover:shadow-lg hover:border-green-300 transition-all',
    
    // Glass effects with color tints
    glassPurple: 'bg-purple-50/90 backdrop-blur-xl border border-purple-200 shadow-md',
    glassBlue: 'bg-blue-50/90 backdrop-blur-xl border border-blue-200 shadow-md',
    glassOrange: 'bg-orange-50/90 backdrop-blur-xl border border-orange-200 shadow-md',
    glassGreen: 'bg-green-50/90 backdrop-blur-xl border border-green-200 shadow-md',
    
    // Legacy support for older components
    card: 'bg-white border border-purple-200 shadow-md hover:shadow-lg hover:border-purple-300 transition-all',
    cardHover: 'hover:bg-purple-50 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
    glass: 'bg-white/90 backdrop-blur-xl border border-purple-200 shadow-md',
    modal: 'bg-white border border-blue-200 shadow-lg',
  },

  // High Contrast Text Styles - Maximum Visibility
  text: {
    // On light backgrounds - Ultra high contrast
    primaryOnLight: 'text-gray-950 font-black drop-shadow-sm',
    secondaryOnLight: 'text-gray-900 font-bold',
    mutedOnLight: 'text-gray-800 font-bold',
    
    // On colored backgrounds - Maximum contrast
    onPurple: 'text-white font-black drop-shadow-lg',
    onBlue: 'text-white font-black drop-shadow-lg',
    onOrange: 'text-white font-black drop-shadow-lg',
    onGreen: 'text-white font-black drop-shadow-lg',
    onPink: 'text-white font-black drop-shadow-lg',
    onYellow: 'text-gray-900 font-black drop-shadow-sm',
    
    // Colored text on white backgrounds - Enhanced visibility
    purple: 'text-purple-800 font-black',
    blue: 'text-blue-800 font-black',
    orange: 'text-orange-800 font-black',
    green: 'text-green-800 font-black',
    pink: 'text-pink-800 font-black',
    
    // Headings with maximum visibility
    headingPurple: 'text-4xl font-black text-purple-800 tracking-tight drop-shadow-sm',
    headingBlue: 'text-4xl font-black text-blue-800 tracking-tight drop-shadow-sm',
    headingOrange: 'text-4xl font-black text-orange-800 tracking-tight drop-shadow-sm',
    headingGreen: 'text-4xl font-black text-green-800 tracking-tight drop-shadow-sm',
    
    // Legacy support - Maximum contrast
    primary: 'text-gray-950 font-black',
    secondary: 'text-gray-900 font-bold',
    muted: 'text-gray-800 font-bold',
    accent: 'text-purple-800 font-black',
    heading: 'text-4xl font-black text-gray-950 tracking-tight drop-shadow-sm',
  },

  // Colorful Interactive Elements
  interactive: {
    // Vibrant buttons
    buttonPurple: 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300',
    buttonBlue: 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300',
    buttonOrange: 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300',
    buttonGreen: 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300',
    
    // Outline buttons
    buttonOutlinePurple: 'bg-white border-4 border-purple-500 text-purple-700 hover:bg-purple-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
    buttonOutlineBlue: 'bg-white border-4 border-blue-500 text-blue-700 hover:bg-blue-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
    buttonOutlineOrange: 'bg-white border-4 border-orange-500 text-orange-700 hover:bg-orange-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
    buttonOutlineGreen: 'bg-white border-4 border-green-500 text-green-700 hover:bg-green-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
    
    // Small navigation buttons
    navPurple: 'bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
    navBlue: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
    navOrange: 'bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
    navGreen: 'bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
    
    // Card hover effects
    cardHoverPurple: 'hover:bg-purple-50 hover:border-purple-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300',
    cardHoverBlue: 'hover:bg-blue-50 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300',
    cardHoverOrange: 'hover:bg-orange-50 hover:border-orange-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300',
    cardHoverGreen: 'hover:bg-green-50 hover:border-green-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300',
    
    // Legacy support
    button: 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300',
    buttonSecondary: 'bg-white border-4 border-purple-500 text-purple-700 hover:bg-purple-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300',
    link: 'text-blue-700 hover:text-blue-900 underline-offset-4 hover:underline font-semibold transition-colors duration-200',
    input: 'bg-white border-4 border-purple-300 text-gray-900 text-lg placeholder-gray-500 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-600 transition-all px-4 py-3 rounded-xl font-semibold',
  },

  // Colorful Status Badges
  badges: {
    purple: 'bg-purple-100 text-purple-800 border-2 border-purple-300 font-bold px-3 py-1 rounded-full',
    blue: 'bg-blue-100 text-blue-800 border-2 border-blue-300 font-bold px-3 py-1 rounded-full',
    orange: 'bg-orange-100 text-orange-800 border-2 border-orange-300 font-bold px-3 py-1 rounded-full',
    green: 'bg-green-100 text-green-800 border-2 border-green-300 font-bold px-3 py-1 rounded-full',
    pink: 'bg-pink-100 text-pink-800 border-2 border-pink-300 font-bold px-3 py-1 rounded-full',
    yellow: 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300 font-bold px-3 py-1 rounded-full',
  },

  // Icon backgrounds
  icons: {
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-2xl shadow-lg',
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg',
    orange: 'bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl shadow-lg',
    green: 'bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-2xl shadow-lg',
    pink: 'bg-gradient-to-br from-pink-500 to-pink-600 p-3 rounded-2xl shadow-lg',
    yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-2xl shadow-lg',
  },

  // Fun animations
  animations: {
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    wiggle: 'hover:animate-wiggle',
    float: 'animate-float',
    fadeIn: 'animate-in fade-in duration-500',
    slideUp: 'animate-in slide-in-from-bottom duration-500',
    slideIn: 'animate-in slide-in-from-left duration-500',
    scaleIn: 'animate-in zoom-in duration-500',
  },

  // Shadow effects with colors
  shadows: {
    purple: 'shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40',
    blue: 'shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40',
    orange: 'shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40',
    green: 'shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40',
  },

  // Status messages and alerts
  status: {
    info: 'bg-blue-100 border-2 border-blue-300 text-blue-900 font-semibold p-4 rounded-xl',
    success: 'bg-green-100 border-2 border-green-300 text-green-900 font-semibold p-4 rounded-xl',
    warning: 'bg-orange-100 border-2 border-orange-300 text-orange-900 font-semibold p-4 rounded-xl',
    error: 'bg-red-100 border-2 border-red-300 text-red-900 font-semibold p-4 rounded-xl',
  },

  // Special effects
  effects: {
    cardShadow: 'shadow-xl hover:shadow-2xl transition-shadow duration-300',
    glowShadow: 'shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-shadow duration-300',
    textShadow: 'drop-shadow-md',
    focusRing: 'focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-4',
  },
};

// TikTok-style smooth transitions
export const tikTokTransitions = {
  slideUp: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 },
    transition: { 
      type: 'spring', 
      stiffness: 280, 
      damping: 28,
      mass: 0.7
    }
  },
  slideLeft: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
    transition: { 
      type: 'spring', 
      stiffness: 280, 
      damping: 28,
      mass: 0.7
    }
  },
  scaleIn: {
    initial: { scale: 0.85, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.85, opacity: 0 },
    transition: { 
      type: 'spring', 
      stiffness: 280, 
      damping: 24
    }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.35, ease: 'easeInOut' }
  },
};

// Helper function
export const combineThemeClasses = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default okayitTheme;
