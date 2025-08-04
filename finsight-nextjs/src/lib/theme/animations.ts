// Spring animation configuration as per Phase 1 specifications
export const SpringConfig = {
  // Default spring physics
  default: {
    damping: 15,
    mass: 1,
    stiffness: 200,
    velocity: 0
  },
  
  // Gentle spring for UI elements
  gentle: {
    damping: 20,
    mass: 1,
    stiffness: 120,
    velocity: 0
  },
  
  // Bouncy spring for playful interactions
  bouncy: {
    damping: 12,
    mass: 1,
    stiffness: 300,
    velocity: 0
  },
  
  // Snappy spring for quick transitions
  snappy: {
    damping: 18,
    mass: 0.8,
    stiffness: 250,
    velocity: 0
  },
  
  // Slow spring for dramatic effects
  slow: {
    damping: 25,
    mass: 1.2,
    stiffness: 100,
    velocity: 0
  }
} as const;

// Animation durations (in milliseconds)
export const AnimationDuration = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 800,
  slowest: 1200,
  
  // Component-specific durations
  components: {
    button: 150,
    card: 300,
    modal: 400,
    page: 300,
    toast: 250,
    tooltip: 200,
    drawer: 350,
    sheet: 400
  }
} as const;

// Easing curves
export const Easing = {
  // Cubic bezier curves
  linear: 'cubic-bezier(0, 0, 1, 1)',
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  
  // iOS-inspired curves
  iosEaseIn: 'cubic-bezier(0.42, 0, 1, 1)',
  iosEaseOut: 'cubic-bezier(0, 0, 0.58, 1)',
  iosEaseInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  
  // Material Design curves
  materialStandard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  materialDecelerated: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  materialAccelerated: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  // Custom FinSight curves
  finsightSmooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  finsightBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  finsightElastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
} as const;

// Micro-interaction patterns
export const MicroInteractions = {
  // Button interactions
  button: {
    press: {
      scale: 0.95,
      duration: AnimationDuration.fast,
      easing: Easing.iosEaseOut
    },
    release: {
      scale: 1.0,
      duration: AnimationDuration.fast,
      easing: Easing.iosEaseOut
    },
    loading: {
      opacity: [1, 0.6, 1],
      duration: 1000,
      repeat: Infinity,
      easing: Easing.ease
    }
  },
  
  // Card interactions
  card: {
    hover: {
      scale: 1.02,
      duration: AnimationDuration.normal,
      easing: Easing.iosEaseOut
    },
    press: {
      scale: 0.98,
      duration: AnimationDuration.fast,
      easing: Easing.iosEaseOut
    },
    shadowIncrease: {
      shadowOpacity: [0.1, 0.15],
      duration: AnimationDuration.normal,
      easing: Easing.iosEaseOut
    }
  },
  
  // Navigation transitions
  navigation: {
    slideIn: {
      x: ['100%', '0%'],
      duration: AnimationDuration.components.page,
      easing: Easing.iosEaseOut
    },
    slideOut: {
      x: ['0%', '-100%'],
      duration: AnimationDuration.components.page,
      easing: Easing.iosEaseIn
    },
    tabBounce: {
      scale: [1, 1.15, 1],
      duration: AnimationDuration.fast,
      easing: Easing.finsightBounce
    }
  },
  
  // Loading states
  loading: {
    skeleton: {
      opacity: [0.3, 0.7, 0.3],
      duration: 1500,
      repeat: Infinity,
      easing: Easing.ease
    },
    spinner: {
      rotate: '360deg',
      duration: 1000,
      repeat: Infinity,
      easing: Easing.linear
    },
    shimmer: {
      x: ['-100%', '100%'],
      duration: 2000,
      repeat: Infinity,
      easing: Easing.linear
    }
  },
  
  // Financial-specific animations
  financial: {
    numberCount: {
      duration: 1500,
      easing: Easing.materialDecelerated
    },
    progressFill: {
      duration: 1000,
      easing: Easing.iosEaseOut
    },
    chartDraw: {
      duration: 2000,
      easing: Easing.finsightSmooth
    }
  }
} as const;

// Haptic feedback patterns (for mobile)
export const HapticPatterns = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  selection: 'selection',
  impact: {
    light: 'impactLight',
    medium: 'impactMedium',
    heavy: 'impactHeavy'
  },
  notification: {
    success: 'notificationSuccess',
    warning: 'notificationWarning',
    error: 'notificationError'
  }
} as const;

// Stagger animation utilities
export const StaggerAnimation = {
  // Stagger children with delay
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  },
  
  item: {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: Easing.iosEaseOut
      }
    }
  }
} as const;
