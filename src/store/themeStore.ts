import { create } from 'zustand';
import { lightTheme, darkTheme, Theme } from '../theme/colors';

interface ThemeState {
    isDark: boolean;
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    isDark: false,
    theme: lightTheme,
    toggleTheme: () =>
        set((state) => ({
            isDark: !state.isDark,
            theme: !state.isDark ? darkTheme : lightTheme,
        })),
    setTheme: (isDark: boolean) =>
        set({
            isDark,
            theme: isDark ? darkTheme : lightTheme,
        }),
}));
