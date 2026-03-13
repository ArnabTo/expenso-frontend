import React, { useState, useCallback } from 'react';
import {
    View, StyleSheet, TouchableOpacity, FlatList,
    ActivityIndicator, RefreshControl,
} from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowLeft01Icon, ArrowRight01Icon, ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useFilteredExpenses } from '../../hooks/useExpenses';
import { useThemeStore } from '../../store/themeStore';
import { fonts } from '../../theme/typography';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';

type FilterMode = 'day' | 'week' | 'month';

type Props = {
    navigation: NativeStackNavigationProp<HomeStackParamList, 'AllExpenses'>;
};

// ─── helpers ────────────────────────────────────────────────────────────────

function toISO(d: Date) {
    return d.toISOString().split('T')[0];
}

function startOfWeek(d: Date) {
    const day = d.getDay(); // 0 = Sun
    const diff = day === 0 ? -6 : 1 - day; // Monday
    const mon = new Date(d);
    mon.setDate(d.getDate() + diff);
    return mon;
}

function formatDay(d: Date) {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatWeek(start: Date) {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function formatMonth(d: Date) {
    return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

// ─── component ──────────────────────────────────────────────────────────────

export default function AllExpensesScreen({ navigation }: Props) {
    const { theme } = useThemeStore();
    const [mode, setMode] = useState<FilterMode>('day');
    const [offset, setOffset] = useState(0); // days / weeks / months from today

    // ── compute query params based on mode + offset ──
    const queryParams = useCallback(() => {
        const now = new Date();
        if (mode === 'day') {
            const d = new Date(now);
            d.setDate(d.getDate() + offset);
            const iso = toISO(d);
            return { start_date: iso, end_date: iso };
        }
        if (mode === 'week') {
            const mon = startOfWeek(now);
            mon.setDate(mon.getDate() + offset * 7);
            const sun = new Date(mon);
            sun.setDate(mon.getDate() + 6);
            return { start_date: toISO(mon), end_date: toISO(sun) };
        }
        // month
        const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        return { month: d.getMonth() + 1, year: d.getFullYear() };
    }, [mode, offset]);

    // ── period label ──
    const periodLabel = useCallback(() => {
        const now = new Date();
        if (mode === 'day') {
            const d = new Date(now);
            d.setDate(d.getDate() + offset);
            return formatDay(d);
        }
        if (mode === 'week') {
            const mon = startOfWeek(now);
            mon.setDate(mon.getDate() + offset * 7);
            return formatWeek(mon);
        }
        const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        return formatMonth(d);
    }, [mode, offset]);

    const params = queryParams();
    const { data: expenses, isLoading, refetch, isRefetching } = useFilteredExpenses(params);

    // reset offset when switching modes
    const switchMode = (m: FilterMode) => {
        setMode(m);
        setOffset(0);
    };

    useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

    const totalAmount = (expenses || []).reduce(
        (sum: number, e: any) => sum + Number(e.amount || 0), 0
    );

    const fmt = (v: any) => Number(v || 0).toFixed(2);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ── Header ── */}
            <View style={[styles.header, { backgroundColor: theme.background }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <HugeiconsIcon icon={ArrowLeft02Icon} size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: fonts.headingBold }]}>
                    All Expenses
                </Text>
                <View style={{ width: 40 }} />
            </View>

            {/* ── Filter tabs: Day / Week / Month ── */}
            <View style={[styles.tabRow, { backgroundColor: theme.card }]}>
                {(['day', 'week', 'month'] as FilterMode[]).map((m) => (
                    <TouchableOpacity
                        key={m}
                        style={[
                            styles.tab,
                            mode === m && { backgroundColor: theme.teal },
                        ]}
                        onPress={() => switchMode(m)}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: mode === m ? '#fff' : theme.textSecondary, fontFamily: fonts.semiBold },
                        ]}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* ── Period navigation ── */}
            <View style={styles.periodRow}>
                <TouchableOpacity onPress={() => setOffset(o => o - 1)} style={styles.navBtn}>
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.periodLabel, { color: theme.text, fontFamily: fonts.heading }]}>
                    {periodLabel()}
                </Text>
                <TouchableOpacity
                    onPress={() => setOffset(o => Math.min(o + 1, 0))}
                    style={[styles.navBtn, offset >= 0 && styles.navBtnDisabled]}
                    disabled={offset >= 0}
                >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={offset >= 0 ? theme.textSecondary : theme.text} />
                </TouchableOpacity>
            </View>

            {/* ── Total ── */}
            {!isLoading && (
                <View style={[styles.totalRow, { backgroundColor: theme.card }]}>
                    <Text style={[styles.totalLabel, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                        Total
                    </Text>
                    <Text style={[styles.totalValue, { color: theme.error, fontFamily: fonts.bold }]}>
                        ৳{fmt(totalAmount)}
                    </Text>
                </View>
            )}

            {/* ── Expense list ── */}
            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={theme.teal} size="large" />
                </View>
            ) : (
                <FlatList
                    data={expenses || []}
                    keyExtractor={(item: any) => String(item.id)}
                    contentContainerStyle={styles.listContent}
                    refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
                            <Text style={[styles.emptyText, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                                No expenses for this period.
                            </Text>
                        </View>
                    }
                    renderItem={({ item: expense }: { item: any }) => (
                        <View style={[styles.expenseItem, { backgroundColor: theme.card }]}>
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
                                    <View style={styles.expenseMeta}>
                                        <Text style={[styles.expenseCat, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                                            {expense.category_name || 'Uncategorized'}
                                        </Text>
                                        <Text style={[styles.expenseDate, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                                            {expense.date}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={[styles.expenseAmount, { color: theme.error, fontFamily: fonts.bold }]}>
                                -৳{fmt(expense.amount)}
                            </Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
    },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 22, fontWeight: '700' },

    tabRow: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 12,
        borderRadius: 14,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 9,
        alignItems: 'center',
        borderRadius: 10,
    },
    tabText: { fontSize: 14 },

    periodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    navBtn: { padding: 8 },
    navBtnDisabled: { opacity: 0.3 },
    periodLabel: { fontSize: 16, fontWeight: '600' },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 14,
    },
    totalLabel: { fontSize: 14 },
    totalValue: { fontSize: 18, fontWeight: 'bold' },

    listContent: { paddingHorizontal: 20, paddingBottom: 100 },
    emptyState: {
        padding: 40,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: { fontSize: 14, textAlign: 'center' },

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
    expenseMeta: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    expenseCat: { fontSize: 12 },
    expenseDate: { fontSize: 12 },
    expenseAmount: { fontSize: 16, fontWeight: 'bold' },
});
