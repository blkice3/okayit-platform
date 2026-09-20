
// Unified Glass Theme System for all components
export const glassTheme = {
  // Background variants
  backgrounds: {
    page: "bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900",
    card: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl",
    cardHover: "hover:bg-white/90 dark:hover:bg-gray-800/90 hover:shadow-2xl hover:border-white/30 dark:hover:border-gray-600/40",
    glass: "bg-white/10 dark:bg-gray-900/20 backdrop-blur-md border border-white/20 dark:border-gray-700/30",
    glassStrong: "bg-white/20 dark:bg-gray-900/30 backdrop-blur-lg border border-white/30 dark:border-gray-600/40",
    modal: "bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-white/30 dark:border-gray-600/30 shadow-2xl"
  },
  
  // Text colors with high contrast
  text: {
    primary: "text-gray-900 dark:text-white",
    secondary: "text-gray-800 dark:text-gray-100", 
    muted: "text-gray-700 dark:text-gray-200",
    accent: "text-indigo-600 dark:text-indigo-400",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    error: "text-red-600 dark:text-red-400"
  },
  
  // Interactive elements
  interactive: {
    button: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300",
    buttonSecondary: "bg-white/80 hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800/90 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 font-semibold shadow-md hover:shadow-lg backdrop-blur-md transition-all duration-300",
    input: "bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 backdrop-blur-sm"
  },
  
  // Status colors
  status: {
    info: "bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/60 dark:border-blue-700/40 text-blue-900 dark:text-blue-100",
    success: "bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-700/40 text-emerald-900 dark:text-emerald-100",
    warning: "bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 text-amber-900 dark:text-amber-100",
    error: "bg-red-50/80 dark:bg-red-900/20 border border-red-200/60 dark:border-red-700/40 text-red-900 dark:text-red-100"
  },

  // Shadows and effects
  effects: {
    cardShadow: "shadow-lg hover:shadow-xl transition-shadow duration-300",
    glowShadow: "shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40",
    textShadow: "drop-shadow-sm"
  }
};

// Helper function to combine glass theme classes
export const combineGlassClasses = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(" ");
};
