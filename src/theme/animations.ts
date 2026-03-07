// Animation configurations for better performance

export const animations = {
    // Timing
    fast: 150,
    normal: 300,
    slow: 500,

    // Scale animations
    scaleUp: {
        duration: 200,
        scale: 1.05,
    },
    scaleDown: {
        duration: 200,
        scale: 0.95,
    },

    // Fade animations
    fadeIn: {
        duration: 300,
        opacity: 1,
    },
    fadeOut: {
        duration: 300,
        opacity: 0,
    },

    // Slide animations
    slideUp: {
        duration: 300,
        translateY: 0,
    },
    slideDown: {
        duration: 300,
        translateY: 100,
    },

    // Spring configs
    spring: {
        damping: 15,
        stiffness: 150,
    },

    // Tab animation
    tabScale: {
        active: 1.15,
        inactive: 1,
        duration: 200,
    },
};
