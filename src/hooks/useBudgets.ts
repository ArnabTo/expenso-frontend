import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/apiService';

export const useBudgets = (month: number, year: number) => {
    return useQuery({
        queryKey: ['budgets', month, year],
        queryFn: async () => {
            return await apiService.budgets.getAll({ month, year });
        },
    });
};

export const useAddBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (budgetData: any) => {
            return await apiService.budgets.create(budgetData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};
