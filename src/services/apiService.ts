// Centralized API Service - All API calls in one place
import { api } from './api';

export const apiService = {
    // ============= Auth APIs =============
    auth: {
        login: async (email: string, password: string) => {
            const { data } = await api.post('/auth/jwt/create/', { email, password });
            return data;
        },

        register: async (userData: {
            email: string;
            password: string;
            username: string;
            first_name?: string;
            last_name?: string;
        }) => {
            const { data } = await api.post('/auth/users/', userData);
            return data;
        },

        getCurrentUser: async () => {
            const { data } = await api.get('/auth/users/me/');
            return data;
        },

        refreshToken: async (refresh: string) => {
            const { data } = await api.post('/auth/jwt/refresh/', { refresh });
            return data;
        },
    },

    // ============= Expenses APIs =============
    expenses: {
        getAll: async (params?: {
            page?: number;
            page_size?: number;
            start_date?: string;
            end_date?: string;
            month?: number;
            year?: number;
        }) => {
            const { data } = await api.get('/expenses/', { params });
            return data.results || data;
        },

        getById: async (id: number) => {
            const { data } = await api.get(`/expenses/${id}/`);
            return data;
        },

        create: async (expenseData: {
            title: string;
            amount: number;
            date: string;
            category: number;
            note?: string;
        }) => {
            const { data } = await api.post('/expenses/', expenseData);
            return data;
        },

        update: async (id: number, expenseData: Partial<{
            title: string;
            amount: number;
            date: string;
            category: number;
            note?: string;
        }>) => {
            const { data } = await api.patch(`/expenses/${id}/`, expenseData);
            return data;
        },

        delete: async (id: number) => {
            const { data } = await api.delete(`/expenses/${id}/`);
            return data;
        },
    },

    // ============= Categories APIs =============
    categories: {
        getAll: async () => {
            const { data } = await api.get('/expenses/categories/');
            return data.results || data;
        },

        create: async (categoryData: {
            name: string;
            description?: string;
        }) => {
            const { data } = await api.post('/expenses/categories/', categoryData);
            return data;
        },

        update: async (id: number, categoryData: {
            name?: string;
            description?: string;
        }) => {
            const { data } = await api.patch(`/expenses/categories/${id}/`, categoryData);
            return data;
        },

        delete: async (id: number) => {
            const { data } = await api.delete(`/expenses/categories/${id}/`);
            return data;
        },
    },

    // ============= Budgets APIs =============
    budgets: {
        getAll: async (params: { month: number; year: number }) => {
            const { data } = await api.get('/budgets/', { params });
            return data;
        },

        getById: async (id: number) => {
            const { data } = await api.get(`/budgets/${id}/`);
            return data;
        },

        create: async (budgetData: {
            amount: number;
            category: number;
            month: number;
            year: number;
        }) => {
            const { data } = await api.post('/budgets/', budgetData);
            return data;
        },

        update: async (id: number, budgetData: Partial<{
            amount: number;
            category: number;
            month: number;
            year: number;
        }>) => {
            const { data } = await api.patch(`/budgets/${id}/`, budgetData);
            return data;
        },

        delete: async (id: number) => {
            const { data } = await api.delete(`/budgets/${id}/`);
            return data;
        },
    },

    // ============= Savings APIs =============
    savings: {
        getPlans: async () => {
            const { data } = await api.get('/savings/plans/');
            return data;
        },

        createPlan: async (planData: {
            goal_name: string;
            target_amount: number;
            current_amount?: number;
            deadline?: string;
        }) => {
            const { data } = await api.post('/savings/plans/', planData);
            return data;
        },

        updatePlan: async (id: number, planData: Partial<{
            goal_name: string;
            target_amount: number;
            current_amount: number;
            deadline: string;
        }>) => {
            const { data } = await api.patch(`/savings/plans/${id}/`, planData);
            return data;
        },

        deletePlan: async (id: number) => {
            const { data } = await api.delete(`/savings/plans/${id}/`);
            return data;
        },
    },

    // ============= Analytics APIs =============
    analytics: {
        getMonthlyExpense: async (month: number, year: number) => {
            const { data } = await api.get(`/analytics/monthly-expense/?month=${month}&year=${year}`);
            return data;
        },

        getCategoryBreakdown: async (month: number, year: number) => {
            const { data } = await api.get(`/analytics/category-breakdown/?month=${month}&year=${year}`);
            return data;
        },

        getTrends: async (startDate?: string, endDate?: string) => {
            const params = { start_date: startDate, end_date: endDate };
            const { data } = await api.get('/analytics/trends/', { params });
            return data;
        },
    },

    // ============= Reports APIs =============
    reports: {
        getMonthly: async (month: number, year: number) => {
            const { data } = await api.get(`/reports/monthly/?month=${month}&year=${year}`);
            return data;
        },

        getYearly: async (year: number) => {
            const { data } = await api.get(`/reports/yearly/?year=${year}`);
            return data;
        },

        getCustom: async (startDate: string, endDate: string) => {
            const { data } = await api.get(`/reports/custom/?start_date=${startDate}&end_date=${endDate}`);
            return data;
        },
    },

    bankBalance: {
        get: async () => {
            const { data } = await api.get('/users/bank-balance/');
            return data;
        },
        update: async (balance: number) => {
            const { data } = await api.patch('/users/bank-balance/', { bank_balance: balance });
            return data;
        },
    },
};

export default apiService;
