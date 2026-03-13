import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/apiService';

export const useExpenses = () => {
    return useQuery({
        queryKey: ['expenses'],
        queryFn: async () => await apiService.expenses.getAll(),
    });
};

export const useFilteredExpenses = (params: {
    start_date?: string;
    end_date?: string;
    month?: number;
    year?: number;
}) => {
    return useQuery({
        queryKey: ['expenses', 'filtered', params],
        queryFn: async () => await apiService.expenses.getAll(params),
    });
};

export const useAddExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (expenseData: any) => await apiService.expenses.create(expenseData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['bankBalance'] });
        },
    });
};

export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => await apiService.categories.getAll(),
    });
};

export const useBankBalance = () => {
    return useQuery({
        queryKey: ['bankBalance'],
        queryFn: async () => await apiService.bankBalance.get(),
    });
};

export const useUpdateBankBalance = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (balance: number) => await apiService.bankBalance.update(balance),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bankBalance'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};
