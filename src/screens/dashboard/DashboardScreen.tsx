import React, { useCallback } from 'react';
import { RefreshControl, ScrollView, View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useMonthlyReport } from '../../hooks/useAnalytics';
import { useExpenses } from '../../hooks/useExpenses';
import { useThemeStore } from '../../store/themeStore';
import { ThemeToggler } from '../../components/ThemeToggler';
import { CircularProgress } from '../../components/CircularProgress';

export default function DashboardScreen() {
    const user = useAuthStore(state => state.user);
    const { theme } = useThemeStore();

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const { data: report, isLoading, refetch, isRefetching } = useMonthlyReport(month, year);
    const { data: expenses, refetch: refetchExpenses } = useExpenses();

    // Refetch data when tab comes into focus
    useFocusEffect(
        useCallback(() => {
            refetch();
            refetchExpenses();
        }, [refetch, refetchExpenses])
    );

    const summary = report?.summary || {
        total_expenses: 0,
        total_budgeted: 0,
        total_saved: 0,
        budget_utilized_percentage: 0
    };

    // Get today's expenses
    const today = new Date().toISOString().split('T')[0];
    const todaysExpenses = expenses?.filter((exp: any) => exp.date === today) || [];

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with Theme Toggle */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={[styles.greeting, { color: theme.textSecondary }]}>
                            Welcome back,
                        </Text>
                        <Text style={[styles.username, { color: theme.text }]}>
                            {user?.username || 'User'}
                        </Text>
                    </View>
                    <ThemeToggler />
                </View>

                {/* Circular Budget Card */}
                <View style={[styles.budgetCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>Budget Overview</Text>

                    <View style={styles.circularContainer}>
                        <CircularProgress
                            size={160}
                            strokeWidth={12}
                            percentage={Math.min(summary.budget_utilized_percentage, 100)}
                            color={
                                summary.budget_utilized_percentage > 90
                                    ? theme.error
                                    : summary.budget_utilized_percentage > 70
                                        ? theme.warning
                                        : theme.primary
                            }
                            backgroundColor={`${theme.border}80`}
                            text={`${summary.budget_utilized_percentage}%`}
                        />
                    </View>

                    <View style={styles.budgetDetails}>
                        <View style={styles.budgetRow}>
                            <Text style={[styles.budgetLabel, { color: theme.textSecondary }]}>
                                Spent
                            </Text>
                            <Text style={[styles.budgetValue, { color: theme.text }]}>
                                ৳{typeof summary.total_expenses === 'number' ? summary.total_expenses.toFixed(2) : '0.00'}
                            </Text>
                        </View>
                        <View style={styles.budgetRow}>
                            <Text style={[styles.budgetLabel, { color: theme.textSecondary }]}>
                                Budget
                            </Text>
                            <Text style={[styles.budgetValue, { color: theme.text }]}>
                                ৳{typeof summary.total_budgeted === 'number' ? summary.total_budgeted.toFixed(2) : '0.00'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Summary Cards */}
                <View style={styles.summaryGrid}>
                    <View style={[styles.summaryCard, { backgroundColor: theme.primary }]}>
                        <View style={styles.summaryIconContainer}>
                            <Wallet color="#FFFFFF" size={24} />
                        </View>
                        <Text style={styles.summaryLabel}>This Month</Text>
                        <Text style={styles.summaryValue}>
                            ৳{typeof summary.total_expenses === 'number' ? summary.total_expenses.toFixed(2) : '0.00'}
                        </Text>
                        <View style={styles.trendContainer}>
                            <TrendingUp color="#FFFFFF" size={16} />
                            <Text style={styles.trendText}>+12%</Text>
                        </View>
                    </View>

                    <View style={[styles.summaryCard, { backgroundColor: theme.success }]}>
                        <View style={styles.summaryIconContainer}>
                            <TrendingDown color="#FFFFFF" size={24} />
                        </View>
                        <Text style={styles.summaryLabel}>Saved</Text>
                        <Text style={styles.summaryValue}>
                            ৳{typeof summary.total_saved === 'number' ? summary.total_saved.toFixed(2) : '0.00'}
                        </Text>
                        <View style={styles.trendContainer}>
                            <TrendingUp color="#FFFFFF" size={16} />
                            <Text style={styles.trendText}>+8%</Text>
                        </View>
                    </View>
                </View>

                {/* Daily Expenses List */}
                <View style={styles.expensesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Today's Expenses
                        </Text>
                        <Text style={[styles.sectionCount, { color: theme.textSecondary }]}>
                            {todaysExpenses.length} items
                        </Text>
                    </View>

                    {todaysExpenses.length === 0 ? (
                        <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                            <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                                No expenses today. Tap + to add one!
                            </Text>
                        </View>
                    ) : (
                        todaysExpenses.map((expense: any, index: number) => (
                            <View
                                key={expense.id || index}
                                style={[styles.expenseItem, { backgroundColor: theme.card }]}
                            >
                                <View style={styles.expenseLeft}>
                                    <View style={[styles.expenseIcon, { backgroundColor: `${theme.primary}20` }]}>
                                        <Text style={{ color: theme.primary, fontSize: 18 }}>
                                            {expense.title?.charAt(0) || '?'}
                                        </Text>
                                    </View>
                                    <View style={styles.expenseInfo}>
                                        <Text style={[styles.expenseTitle, { color: theme.text }]}>
                                            {expense.title}
                                        </Text>
                                        <Text style={[styles.expenseCategory, { color: theme.textSecondary }]}>
                                            {expense.category_name || 'Uncategorized'}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.expenseAmount, { color: theme.error }]}>
                                    -৳{typeof expense?.amount === 'number' ? expense.amount.toFixed(2) : Number(expense?.amount).toFixed(2)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                {/* Bottom spacing */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: 14,
        marginBottom: 4,
    },
    username: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    budgetCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    circularContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    budgetDetails: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    budgetRow: {
        alignItems: 'center',
    },
    budgetLabel: {
        fontSize: 13,
        marginBottom: 4,
    },
    budgetValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    summaryGrid: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 24,
    },
    summaryCard: {
        flex: 1,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    summaryIconContainer: {
        marginBottom: 12,
    },
    summaryLabel: {
        color: '#FFFFFF',
        fontSize: 12,
        opacity: 0.9,
        marginBottom: 8,
    },
    summaryValue: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    expensesSection: {
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sectionCount: {
        fontSize: 14,
    },
    emptyState: {
        padding: 40,
        borderRadius: 16,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        textAlign: 'center',
    },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    expenseLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    expenseIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    expenseInfo: {
        flex: 1,
    },
    expenseTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    expenseCategory: {
        fontSize: 13,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
