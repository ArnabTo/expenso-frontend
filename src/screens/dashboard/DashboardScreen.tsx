import React, { useCallback, useState } from 'react';
import {
    RefreshControl, ScrollView, View, StyleSheet,
    TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Edit02Icon, ListStartIcon, PiggyBankIcon, Wallet01Icon, ChartDecreaseIcon, ChartIncreaseIcon } from '@hugeicons/core-free-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useMonthlyReport } from '../../hooks/useAnalytics';
import { useExpenses, useUpdateBankBalance } from '../../hooks/useExpenses';
import { useThemeStore } from '../../store/themeStore';
import { ThemeToggler } from '../../components/ThemeToggler';
import { CircularProgress } from '../../components/CircularProgress';
import { fonts } from '../../theme/typography';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';

type Props = {
    navigation: NativeStackNavigationProp<HomeStackParamList, 'Dashboard'>;
};

export default function DashboardScreen({ navigation }: Props) {
    const user = useAuthStore(state => state.user);
    const { theme } = useThemeStore();

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const { data: report, isLoading, refetch, isRefetching } = useMonthlyReport(month, year);
    const { data: expenses, refetch: refetchExpenses } = useExpenses();
    const updateBalance = useUpdateBankBalance();

    const [balanceModalVisible, setBalanceModalVisible] = useState(false);
    const [balanceInput, setBalanceInput] = useState('');

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
        bank_balance: 0,
        budget_utilized_percentage: 0,
    };

    const today = new Date().toISOString().split('T')[0];
    const todaysExpenses = expenses?.filter((exp: any) => exp.date === today) || [];

    const handleUpdateBalance = () => {
        const val = parseFloat(balanceInput);
        if (!isNaN(val)) {
            updateBalance.mutate(val, {
                onSuccess: () => {
                    setBalanceModalVisible(false);
                    setBalanceInput('');
                    refetch();
                },
            });
        }
    };

    const fmt = (v: any) =>
        typeof v === 'number' ? v.toFixed(2) : Number(v || 0).toFixed(2);

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text, fontFamily: fonts.regular }}>Loading...</Text>
            </View>
        );
    }

    const percentage = Math.min(summary.budget_utilized_percentage, 100);
    const progressColor =
        percentage > 90 ? theme.error : percentage > 70 ? theme.warning : theme.teal;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={[styles.greeting, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                            Welcome back,
                        </Text>
                        <Text style={[styles.username, { color: theme.text, fontFamily: fonts.headingBold }]}>
                            {user?.username || 'User'}
                        </Text>
                    </View>
                    <ThemeToggler />
                </View>

                {/* Budget Overview Card */}
                <View style={[styles.budgetCard, { backgroundColor: theme.card }]}>
                    <Text style={[styles.cardTitle, { color: theme.text, fontFamily: fonts.headingBold }]}>
                        Budget Overview
                    </Text>

                    <View style={styles.circularContainer}>
                        <CircularProgress
                            size={150}
                            strokeWidth={11}
                            percentage={percentage}
                            color={progressColor}
                            backgroundColor={`${theme.border}80`}
                            text={`${summary.budget_utilized_percentage}%`}
                        />
                        <Text style={[styles.utilLabel, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                            Budget Utilised
                        </Text>
                    </View>

                    {/* 2x2 Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={[styles.statCell, { borderColor: theme.border }]}>
                            <View style={styles.statIconRow}>
                                <HugeiconsIcon icon={Wallet01Icon} size={16} color={theme.teal} />
                                <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                                    Budget
                                </Text>
                            </View>
                            <Text style={[styles.statValue, { color: theme.text, fontFamily: fonts.bold }]}>
                                {'\u09F3'}{fmt(summary.total_budgeted)}
                            </Text>
                        </View>

                        <View style={[styles.statCell, { borderColor: theme.border }]}>
                            <View style={styles.statIconRow}>
                                <HugeiconsIcon icon={ChartIncreaseIcon} size={16} color={theme.error} />
                                <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                                    Expenses
                                </Text>
                            </View>
                            <Text style={[styles.statValue, { color: theme.error, fontFamily: fonts.bold }]}>
                                {'\u09F3'}{fmt(summary.total_expenses)}
                            </Text>
                        </View>

                        <View style={[styles.statCell, { borderColor: theme.border }]}>
                            <View style={styles.statIconRow}>
                                <HugeiconsIcon icon={ChartDecreaseIcon} size={16} color={theme.info} />
                                <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                                    Balance
                                </Text>
                                <TouchableOpacity
                                    style={styles.editBtn}
                                    onPress={() => {
                                        setBalanceInput(String(summary.bank_balance));
                                        setBalanceModalVisible(true);
                                    }}
                                >
                                    <HugeiconsIcon icon={Edit02Icon} size={13} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.statValue, { color: theme.info, fontFamily: fonts.bold }]}>
                                {'\u09F3'}{fmt(summary.bank_balance)}
                            </Text>
                        </View>

                        <View style={[styles.statCell, { borderColor: theme.border }]}>
                            <View style={styles.statIconRow}>
                                <HugeiconsIcon icon={PiggyBankIcon} size={16} color={theme.success} />
                                <Text style={[styles.statLabel, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                                    Savings
                                </Text>
                            </View>
                            <Text style={[styles.statValue, { color: theme.success, fontFamily: fonts.bold }]}>
                                {'\u09F3'}{fmt(summary.total_saved)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Today's Expenses */}
                <View style={styles.expensesSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text, fontFamily: fonts.headingBold }]}>
                            Today's Expenses
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AllExpenses')}>
                            <View style={[styles.viewAllButton, { backgroundColor: theme.primary }]}>
                                <HugeiconsIcon icon={ListStartIcon} size={14} color={theme.textInverse} />
                                <Text style={{ color: theme.textInverse, fontSize: 12, fontFamily: fonts.semiBold }}>
                                    View All
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {todaysExpenses.length === 0 ? (
                        <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                            <Text style={[styles.emptyStateText, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
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
                                    <View style={[styles.expenseIcon, { backgroundColor: `${theme.teal}20` }]}>
                                        <Text style={{ color: theme.teal, fontSize: 18, fontFamily: fonts.bold }}>
                                            {expense.title?.charAt(0)?.toUpperCase() || '?'}
                                        </Text>
                                    </View>
                                    <View style={styles.expenseInfo}>
                                        <Text style={[styles.expenseTitle, { color: theme.text, fontFamily: fonts.bold }]}>
                                            {expense.title}
                                        </Text>
                                        <Text style={[styles.expenseCategory, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                                            {expense.category_name || 'Uncategorized'}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.expenseAmount, { color: theme.error, fontFamily: fonts.bold }]}>
                                    -{'\u09F3'}{fmt(expense?.amount)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Update Balance Modal */}
            <Modal
                visible={balanceModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setBalanceModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.text, fontFamily: fonts.headingBold }]}>
                            Update Bank Balance
                        </Text>
                        <TextInput
                            style={[styles.modalInput, {
                                borderColor: theme.border,
                                color: theme.text,
                                fontFamily: fonts.regular,
                                backgroundColor: theme.background,
                            }]}
                            keyboardType="numeric"
                            placeholder="Enter balance"
                            placeholderTextColor={theme.textSecondary}
                            value={balanceInput}
                            onChangeText={setBalanceInput}
                            autoFocus
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: theme.border }]}
                                onPress={() => setBalanceModalVisible(false)}
                            >
                                <Text style={{ color: theme.text, fontFamily: fonts.semiBold }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: theme.teal }]}
                                onPress={handleUpdateBalance}
                            >
                                <Text style={{ color: '#fff', fontFamily: fonts.semiBold }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerLeft: { flex: 1 },
    greeting: { fontSize: 14, marginBottom: 2 },
    username: { fontSize: 26, fontWeight: 'bold' },
    budgetCard: {
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 24,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    circularContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    utilLabel: { fontSize: 12, marginTop: 8 },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    statCell: {
        flex: 1,
        minWidth: '45%',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
    },
    statIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 8,
    },
    statLabel: { fontSize: 12, flex: 1 },
    statValue: { fontSize: 18, fontWeight: 'bold' },
    editBtn: { padding: 2 },
    expensesSection: { paddingHorizontal: 20 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 20, fontWeight: 'bold' },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    emptyState: {
        padding: 40,
        borderRadius: 16,
        alignItems: 'center',
    },
    emptyStateText: { fontSize: 14, textAlign: 'center' },
    expenseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    expenseLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    expenseIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    expenseInfo: { flex: 1 },
    expenseTitle: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
    expenseCategory: { fontSize: 13 },
    expenseAmount: { fontSize: 16, fontWeight: 'bold' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalBox: {
        width: '100%',
        borderRadius: 20,
        padding: 24,
    },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
    modalInput: {
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
});
