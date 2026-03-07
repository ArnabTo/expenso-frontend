import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/apiService';

// Fetch all expenses
export const useExpenses = () => {
    return useQuery({
        queryKey: ['expenses'],
        queryFn: async () => {
            return await apiService.expenses.getAll();
        },
    });
};

// Add new expense
export const useAddExpense = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (expenseData: any) => {
            return await apiService.expenses.create(expenseData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
    });
};

// Fetch categories
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return await apiService.categories.getAll();
        },
    });
};
