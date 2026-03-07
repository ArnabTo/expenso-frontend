import React, { useCallback } from 'react';
import { FlatList, RefreshControl, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { useBudgets } from '../../hooks/useBudgets';
import { useThemeStore } from '../../store/themeStore';
import { ThemeToggler } from '../../components/ThemeToggler';

export default function BudgetsScreen() {
    const { theme } = useThemeStore();
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const { data: budgets, isLoading, refetch, isRefetching } = useBudgets(month, year);

    // Refetch data when tab comes into focus
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Loading...</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: any }) => {
        const percent = item.percentage || 0;
        const isOver = percent > 100;
        const barColor = isOver ? theme.error : (percent > 85 ? theme.warning : theme.primary);

        return (
            <View style={[styles.budgetCard, { backgroundColor: theme.card }]}>
                <View style={styles.cardHeader}>
                    <View style={styles.categoryInfo}>
                        <View style={[styles.categoryIcon, { backgroundColor: `${theme.primary}20` }]}>
                            <Text style={{ color: theme.primary, fontSize: 18, fontWeight: 'bold' }}>
                                {item.category_detail?.name?.charAt(0) || 'C'}
                            </Text>
                        </View>
                        <Text style={[styles.categoryName, { color: theme.text }]}>
                            {item.category_detail?.name || 'Category'}
                        </Text>
                    </View>
                    <Text style={[styles.amountText, { color: theme.text }]}>
                        ৳{typeof item.spent === 'number' ? item.spent.toFixed(2) : '0.00'} / ৳{item.amount || '0.00'}
                    </Text>
                </View>

                <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View style={[styles.progressFill, { width: `${Math.min(percent, 100)}%`, backgroundColor: barColor }]} />
                </View>

                <View style={styles.cardFooter}>
                    <Text style={[styles.percentText, { color: theme.textSecondary }]}>{Math.round(percent)}% Used</Text>
                    <Text style={[styles.remainingText, { color: isOver ? theme.error : theme.success }]}>
                        {isOver
                            ? `Over by ৳${typeof item.remaining === 'number' ? Math.abs(item.remaining).toFixed(2) : '0.00'}`
                            : `৳${typeof item.remaining === 'number' ? item.remaining.toFixed(2) : '0.00'} Left`}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Budgets</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                        {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </Text>
                </View>
                <ThemeToggler />
            </View>

            <FlatList
                data={budgets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor={theme.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No budgets set for this month.
                        </Text>
                    </View>
                }
            />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    budgetCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
    },
    amountText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    progressBar: {
        width: '100%',
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    percentText: {
        fontSize: 12,
    },
    remainingText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 14,
    },
});
