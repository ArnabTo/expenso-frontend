import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/apiService';

export const useSavingsPlans = () => {
    return useQuery({
        queryKey: ['savings-plans'],
        queryFn: async () => {
            return await apiService.savings.getPlans();
        },
    });
};

export const useAddSavingsPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (planData: any) => {
            return await apiService.savings.createPlan(planData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savings-plans'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};

export const useMonthlyAnalytics = (month: number, year: number) => {
    return useQuery({
        queryKey: ['analytics', 'monthly-expense', month, year],
        queryFn: async () => {
            return await apiService.analytics.getMonthlyExpense(month, year);
        },
    });
};

export const useCategoryAnalytics = (month: number, year: number) => {
    return useQuery({
        queryKey: ['analytics', 'category-breakdown', month, year],
        queryFn: async () => {
            return await apiService.analytics.getCategoryBreakdown(month, year);
        },
    });
};

export const useMonthlyReport = (month: number, year: number) => {
    return useQuery({
        queryKey: ['reports', 'monthly', month, year],
        queryFn: async () => {
            return await apiService.reports.getMonthly(month, year);
        },
    });
};
