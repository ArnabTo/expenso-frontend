import React, { useCallback } from 'react';
import {
    ScrollView, View, TouchableOpacity, StyleSheet,
    useWindowDimensions, RefreshControl, ActivityIndicator,
} from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    UserCircleIcon,
    ChartBarIncreasingIcon,
    Logout01Icon,
    ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useNavigation } from '@react-navigation/native';
import { ThemeToggler } from '../../components/ThemeToggler';
import { useMonthlyAnalytics, useCategoryAnalytics } from '../../hooks/useAnalytics';
import { fonts } from '../../theme/typography';

// Fallback color palette for categories without a color
const PALETTE = [
    '#00BFA5', '#6366f1', '#f59e0b', '#ef4444',
    '#10b981', '#8b5cf6', '#ec4899', '#3b82f6',
];

export default function SettingsScreen() {
    const { user, logout } = useAuthStore();
    const { theme, isDark } = useThemeStore();
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const isTablet = width >= 600;
    const chartWidth = width - (isTablet ? 96 : 48);

    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const {
        data: monthlyData, isLoading: loadingMonthly, refetch: refetchMonthly, isRefetching: refetchingMonthly,
    } = useMonthlyAnalytics(month, year);

    const {
        data: categories, isLoading: loadingCategories, refetch: refetchCategories, isRefetching: refetchingCategories,
    } = useCategoryAnalytics(month, year);

    useFocusEffect(
        useCallback(() => {
            refetchMonthly();
            refetchCategories();
        }, [refetchMonthly, refetchCategories])
    );

    const isRefreshing = refetchingMonthly || refetchingCategories;

    // ── Daily Spending Line Chart ─────────────────────────────────────────────
    const daysInMonth = new Date(year, month, 0).getDate();
    const dayTotals: number[] = Array(daysInMonth).fill(0);

    (monthlyData?.daily_breakdown || []).forEach((d: any) => {
        const dayNum = parseInt(d.date.split('-')[2], 10) - 1;
        if (dayNum >= 0 && dayNum < daysInMonth) {
            dayTotals[dayNum] = parseFloat(d.total) || 0;
        }
    });

    // Show every 5th day as label to avoid crowding
    const lineLabels = dayTotals.map((_, i) =>
        (i + 1) % 5 === 0 || i === 0 ? String(i + 1) : ''
    );

    const lineData = {
        labels: lineLabels,
        datasets: [{ data: dayTotals.length > 0 ? dayTotals : [0] }],
    };

    // ── Category Pie Chart ────────────────────────────────────────────────────
    const pieData = (categories || []).map((cat: any, i: number) => ({
        name: cat.category__name || 'Other',
        population: Math.round(Number(cat.total) * 100) / 100,
        color: cat.category__color || PALETTE[i % PALETTE.length],
        legendFontColor: theme.textSecondary,
        legendFontSize: isTablet ? 13 : 11,
    }));

    const chartConfig = {
        backgroundGradientFrom: theme.card,
        backgroundGradientTo: theme.card,
        decimalPlaces: 0,
        color: (opacity = 1) =>
            isDark
                ? `rgba(0, 191, 165, ${opacity})`
                : `rgba(0, 143, 120, ${opacity})`,
        labelColor: () => theme.textSecondary,
        propsForDots: { r: '3', strokeWidth: '1.5', stroke: theme.teal },
        propsForBackgroundLines: { stroke: theme.border, strokeDasharray: '4' },
    };

    const menuItems = [
        {
            icon: UserCircleIcon,
            title: 'Profile',
            subtitle: user?.email || 'View your profile',
            onPress: () => { },
        },
        {
            icon: ChartBarIncreasingIcon,
            title: 'Analytics',
            subtitle: 'View detailed analytics',
            onPress: () => navigation.navigate('Analytics' as never),
        },
        {
            icon: Logout01Icon,
            title: 'Logout',
            subtitle: 'Sign out of your account',
            onPress: logout,
            danger: true,
        },
    ];

    const SectionTitle = ({ label }: { label: string }) => (
        <Text style={[styles.sectionTitle, {
            color: theme.textSecondary,
            fontFamily: fonts.semiBold,
            fontSize: isTablet ? 13 : 11,
        }]}>
            {label.toUpperCase()}
        </Text>
    );

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => { refetchMonthly(); refetchCategories(); }}
                    tintColor={theme.teal}
                />
            }
        >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <View style={[styles.header, { paddingHorizontal: isTablet ? 32 : 20 }]}>
                <View>
                    <Text style={[styles.headerTitle, {
                        color: theme.text,
                        fontSize: isTablet ? 34 : 28,
                        fontFamily: fonts.headingBold,
                    }]}>Settings</Text>
                    <Text style={[styles.headerSubtitle, {
                        color: theme.textSecondary,
                        fontSize: isTablet ? 15 : 13,
                        fontFamily: fonts.regular,
                    }]}>
                        {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </Text>
                </View>
                <ThemeToggler />
            </View>

            <View style={{ paddingHorizontal: isTablet ? 32 : 20 }}>
                {/* ── User Card ────────────────────────────────────────────── */}
                <View style={[styles.userCard, {
                    backgroundColor: theme.card,
                    padding: isTablet ? 24 : 18,
                    borderRadius: isTablet ? 20 : 16,
                }]}>
                    <View style={[styles.avatar, {
                        backgroundColor: theme.teal,
                        width: isTablet ? 68 : 56,
                        height: isTablet ? 68 : 56,
                        borderRadius: isTablet ? 34 : 28,
                    }]}>
                        <Text style={[styles.avatarText, {
                            fontSize: isTablet ? 26 : 22,
                            fontFamily: fonts.headingBold,
                        }]}>
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, {
                            color: theme.text,
                            fontSize: isTablet ? 20 : 17,
                            fontFamily: fonts.headingBold,
                        }]}>
                            {user?.username || 'User'}
                        </Text>
                        <Text style={[styles.userEmail, {
                            color: theme.textSecondary,
                            fontSize: isTablet ? 14 : 13,
                            fontFamily: fonts.regular,
                        }]}>
                            {user?.email || 'email@example.com'}
                        </Text>
                    </View>
                </View>

                {/* ── Charts ───────────────────────────────────────────────── */}
                <SectionTitle label="This Month's Spending" />

                {/* Daily Line Chart */}
                <View style={[styles.chartCard, {
                    backgroundColor: theme.card,
                    borderRadius: isTablet ? 20 : 16,
                    padding: isTablet ? 20 : 16,
                    marginBottom: 12,
                }]}>
                    <Text style={[styles.chartTitle, {
                        color: theme.text,
                        fontFamily: fonts.heading,
                        fontSize: isTablet ? 16 : 14,
                    }]}>Daily Spending</Text>
                    <Text style={[styles.chartSubtitle, {
                        color: theme.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: isTablet ? 13 : 11,
                    }]}>
                        Total: ৳{(monthlyData?.total_spent ?? 0).toFixed(2)}
                    </Text>

                    {loadingMonthly ? (
                        <View style={styles.chartLoader}>
                            <ActivityIndicator color={theme.teal} />
                        </View>
                    ) : (
                        <LineChart
                            data={lineData}
                            width={chartWidth}
                            height={isTablet ? 220 : 180}
                            chartConfig={chartConfig}
                            bezier
                            withInnerLines
                            withOuterLines={false}
                            withShadow={false}
                            style={{ marginTop: 12, borderRadius: 12, marginLeft: -16 }}
                        />
                    )}
                </View>

                {/* Category Pie Chart */}
                <View style={[styles.chartCard, {
                    backgroundColor: theme.card,
                    borderRadius: isTablet ? 20 : 16,
                    padding: isTablet ? 20 : 16,
                    marginBottom: 24,
                }]}>
                    <Text style={[styles.chartTitle, {
                        color: theme.text,
                        fontFamily: fonts.heading,
                        fontSize: isTablet ? 16 : 14,
                    }]}>Category Breakdown</Text>
                    <Text style={[styles.chartSubtitle, {
                        color: theme.textSecondary,
                        fontFamily: fonts.regular,
                        fontSize: isTablet ? 13 : 11,
                    }]}>
                        {pieData.length} {pieData.length === 1 ? 'category' : 'categories'}
                    </Text>

                    {loadingCategories ? (
                        <View style={styles.chartLoader}>
                            <ActivityIndicator color={theme.teal} />
                        </View>
                    ) : pieData.length > 0 ? (
                        <PieChart
                            data={pieData}
                            width={chartWidth}
                            height={isTablet ? 220 : 190}
                            chartConfig={chartConfig}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="10"
                            style={{ marginTop: 8 }}
                        />
                    ) : (
                        <View style={styles.chartEmpty}>
                            <Text style={{ color: theme.textSecondary, fontFamily: fonts.regular, fontSize: 13 }}>
                                No expense data for this month.
                            </Text>
                        </View>
                    )}
                </View>

                {/* ── Menu ─────────────────────────────────────────────────── */}
                <SectionTitle label="Account" />
                <View style={[styles.menuContainer, {
                    backgroundColor: theme.card,
                    borderRadius: isTablet ? 20 : 16,
                    marginBottom: 40,
                }]}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                            style={[
                                styles.menuItem,
                                { borderBottomColor: theme.border },
                                index === menuItems.length - 1 && styles.lastMenuItem,
                            ]}
                        >
                            <View style={styles.menuItemLeft}>
                                <View style={[styles.iconContainer, {
                                    backgroundColor: item.danger
                                        ? `${theme.error}20`
                                        : `${theme.teal}18`,
                                    width: isTablet ? 46 : 40,
                                    height: isTablet ? 46 : 40,
                                    borderRadius: isTablet ? 14 : 12,
                                }]}>
                                    <HugeiconsIcon
                                        icon={item.icon}
                                        size={isTablet ? 22 : 20}
                                        color={item.danger ? theme.error : theme.teal}
                                        strokeWidth={1.8}
                                    />
                                </View>
                                <View style={styles.menuItemText}>
                                    <Text style={[styles.menuItemTitle, {
                                        color: item.danger ? theme.error : theme.text,
                                        fontFamily: fonts.semiBold,
                                        fontSize: isTablet ? 16 : 15,
                                    }]}>
                                        {item.title}
                                    </Text>
                                    <Text style={[styles.menuItemSubtitle, {
                                        color: theme.textSecondary,
                                        fontFamily: fonts.regular,
                                        fontSize: isTablet ? 13 : 12,
                                    }]}>
                                        {item.subtitle}
                                    </Text>
                                </View>
                            </View>
                            <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                size={18}
                                color={theme.textSecondary}
                                strokeWidth={1.8}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: { marginBottom: 2 },
    headerSubtitle: {},
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    avatar: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarText: { color: '#FFFFFF' },
    userInfo: { flex: 1 },
    userName: { marginBottom: 3 },
    userEmail: {},
    sectionTitle: {
        marginBottom: 10,
        letterSpacing: 0.6,
    },
    chartCard: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        overflow: 'hidden',
    },
    chartTitle: { marginBottom: 2 },
    chartSubtitle: {},
    chartLoader: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartEmpty: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    lastMenuItem: { borderBottomWidth: 0 },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    menuItemText: { flex: 1 },
    menuItemTitle: { marginBottom: 2 },
    menuItemSubtitle: {},
});

