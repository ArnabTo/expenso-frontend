// Theme color configuration

export const colors = {
    // Primary colors from requirements
    primary: '#FF7F11',
    dark: '#2C2C2C',
    light: '#F3F4F4',

    // Extended palette
    darkGray: '#1A1A1A',
    mediumGray: '#4A4A4A',
    lightGray: '#E0E0E0',
    white: '#FFFFFF',
    black: '#000000',

    // Semantic colors
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',

    // Opacity variants
    primaryLight: 'rgba(255, 127, 17, 0.1)',
    primaryMedium: 'rgba(255, 127, 17, 0.5)',
};

export const lightTheme = {
    background: colors.light,
    surface: colors.white,
    card: colors.white,
    text: colors.dark,
    textSecondary: colors.mediumGray,
    border: colors.lightGray,
    primary: colors.primary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    tabBar: colors.white,
    tabBarInactive: '#9CA3AF',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkTheme = {
    background: colors.dark,
    surface: colors.darkGray,
    card: colors.darkGray,
    text: colors.light,
    textSecondary: colors.lightGray,
    border: colors.mediumGray,
    primary: colors.primary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    tabBar: colors.darkGray,
    tabBarInactive: '#6B7280',
    shadow: 'rgba(255, 255, 255, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.7)',
};

export type Theme = typeof lightTheme;
