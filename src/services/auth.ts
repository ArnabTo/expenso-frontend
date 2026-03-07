import apiService from './apiService';
import { useAuthStore } from '../store/authStore';

export const authService = {
    login: async (email: string, password: string) => {
        // 1. Get tokens
        const tokenData = await apiService.auth.login(email, password);

        // Save tokens in store
        useAuthStore.getState().setTokens(tokenData.access, tokenData.refresh);

        // 2. Fetch user profile
        const userData = await apiService.auth.getCurrentUser();

        // Save user in store
        useAuthStore.getState().setUser(userData);

        return userData;
    },

    register: async (data: any) => {
        // 1. Register user
        await apiService.auth.register(data);

        // 2. Auto login
        return authService.login(data.email, data.password);
    },

    logout: () => {
        useAuthStore.getState().logout();
    }
};
