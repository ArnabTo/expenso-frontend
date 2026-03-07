import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
    id: number;
    email: string;
    username: string;
    currency: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    setTokens: (access: string, refresh: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,

    setTokens: (access, refresh) => {
        SecureStore.setItemAsync('accessToken', access);
        SecureStore.setItemAsync('refreshToken', refresh);
        set({ accessToken: access, refreshToken: refresh });
    },

    setUser: (user) => {
        set({ user });
    },

    logout: () => {
        SecureStore.deleteItemAsync('accessToken');
        SecureStore.deleteItemAsync('refreshToken');
        set({ user: null, accessToken: null, refreshToken: null });
    },

    initialize: async () => {
        try {
            const access = await SecureStore.getItemAsync('accessToken');
            const refresh = await SecureStore.getItemAsync('refreshToken');

            if (access && refresh) {
                set({ accessToken: access, refreshToken: refresh });
            }
        } catch (e) {
            console.error('Failed to load tokens', e);
        } finally {
            set({ isLoading: false });
        }
    },
}));
