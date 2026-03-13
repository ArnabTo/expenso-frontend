import React, { useCallback } from 'react';
import { FlatList, RefreshControl, View, StyleSheet } from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { useSavingsPlans } from '../../hooks/useAnalytics';
import { useThemeStore } from '../../store/themeStore';
import { ThemeToggler } from '../../components/ThemeToggler';

export default function SavingsScreen() {
    const { theme } = useThemeStore();
    const { data: plans, isLoading, refetch, isRefetching } = useSavingsPlans();

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
        const percent = item.progress_percentage || 0;

        return (
            <View style={[styles.savingsCard, { backgroundColor: theme.card }]}>
                <View style={styles.cardHeader}>
                    <View style={styles.leftSection}>
                        <Text style={[styles.goalName, { color: theme.text }]}>
                            {item.goal_name || item.name}
                        </Text>
                        <Text style={[styles.description, { color: theme.textSecondary }]}>
                            {item.description || 'Savings Plan'}
                        </Text>
                    </View>
                    <View style={styles.rightSection}>
                        <Text style={[styles.savedAmount, { color: theme.secondary }]}>
                            ${item.current_amount || item.total_saved || 0}
                        </Text>
                        <Text style={[styles.targetAmount, { color: theme.textSecondary }]}>
                            of ${item.target_amount}
                        </Text>
                    </View>
                </View>

                <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${Math.min(percent, 100)}%`, backgroundColor: theme.success },
                        ]}
                    />
                </View>

                <View style={styles.cardFooter}>
                    <Text style={[styles.percentText, { color: theme.success }]}>
                        {Math.round(percent)}% Reached
                    </Text>
                    {item.deadline && (
                        <Text style={[styles.deadlineText, { color: theme.textSecondary }]}>
                            Due: {new Date(item.deadline).toLocaleDateString()}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Savings Goals</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                        Track your financial goals
                    </Text>
                </View>
                <ThemeToggler />
            </View>

            <FlatList
                data={plans?.results || plans}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        tintColor={theme.secondary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No active savings plans.
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
    savingsCard: {
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
        marginBottom: 12,
    },
    leftSection: {
        flex: 1,
    },
    goalName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    savedAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    targetAmount: {
        fontSize: 13,
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
        fontWeight: '600',
    },
    deadlineText: {
        fontSize: 12,
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
