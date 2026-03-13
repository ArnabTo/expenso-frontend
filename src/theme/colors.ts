// Theme color configuration

export const colors = {
    // Core palette
    teal: '#00BFA5',
    mattBlack: '#1C1C1E',
    darkSurface: '#2A2A2D',
    darkBorder: '#3A3A3C',
    white: '#FFFFFF',
    offWhite: '#F5F5F7',
    lightBorder: '#E0E0E0',
    lightGray: '#8E8E93',
    darkGray: '#636366',

    // Semantic colors
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#0A84FF',

    // Opacity variants
    tealLight: 'rgba(0, 191, 165, 0.12)',
    tealMedium: 'rgba(0, 191, 165, 0.4)',
};

export const lightTheme = {
    background: colors.offWhite,
    surface: colors.white,
    card: colors.white,
    text: colors.mattBlack,
    textSecondary: colors.darkGray,
    border: colors.lightBorder,
    primary: colors.mattBlack,
    secondary: colors.mattBlack,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    tabBar: colors.white,
    tabBarInactive: colors.lightGray,
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    primaryLight: colors.tealLight,
    teal: colors.teal,
};

export const darkTheme = {
    background: colors.mattBlack,
    surface: colors.darkSurface,
    card: colors.darkSurface,
    text: colors.white,
    textSecondary: colors.lightGray,
    border: colors.darkBorder,
    primary: colors.white,
    secondary: colors.teal,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    tabBar: colors.darkSurface,
    tabBarInactive: colors.darkGray,
    shadow: 'rgba(0, 0, 0, 0.4)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    primaryLight: colors.tealLight,
    teal: colors.teal,
};

export type Theme = typeof lightTheme;
