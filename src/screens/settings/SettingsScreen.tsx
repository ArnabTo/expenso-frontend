import React from 'react';
import { ScrollView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { User, PieChart, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
    const { user, logout } = useAuthStore();
    const { theme } = useThemeStore();
    const navigation = useNavigation();

    const menuItems = [
        {
            icon: User,
            title: 'Profile',
            subtitle: user?.email || 'View your profile',
            onPress: () => { },
        },
        {
            icon: PieChart,
            title: 'Analytics',
            subtitle: 'View detailed analytics',
            onPress: () => navigation.navigate('Analytics' as never),
        },
        {
            icon: LogOut,
            title: 'Logout',
            subtitle: 'Sign out of your account',
            onPress: logout,
            danger: true,
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
                    <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                        Manage your account and preferences
                    </Text>
                </View>

                {/* User Info Card */}
                <View style={[styles.userCard, { backgroundColor: theme.card }]}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                        <Text style={styles.avatarText}>
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={[styles.userName, { color: theme.text }]}>
                            {user?.username || 'User'}
                        </Text>
                        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                            {user?.email || 'email@example.com'}
                        </Text>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={item.onPress}
                                style={[
                                    styles.menuItem,
                                    { backgroundColor: theme.card, borderBottomColor: theme.border },
                                    index === menuItems.length - 1 && styles.lastMenuItem,
                                ]}
                            >
                                <View style={styles.menuItemLeft}>
                                    <View
                                        style={[
                                            styles.iconContainer,
                                            {
                                                backgroundColor: item.danger
                                                    ? `${theme.error}20`
                                                    : `${theme.primary}20`,
                                            },
                                        ]}
                                    >
                                        <Icon
                                            size={20}
                                            color={item.danger ? theme.error : theme.primary}
                                        />
                                    </View>
                                    <View style={styles.menuItemText}>
                                        <Text
                                            style={[
                                                styles.menuItemTitle,
                                                { color: item.danger ? theme.error : theme.text },
                                            ]}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text style={[styles.menuItemSubtitle, { color: theme.textSecondary }]}>
                                            {item.subtitle}
                                        </Text>
                                    </View>
                                </View>
                                <ChevronRight size={20} color={theme.textSecondary} />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
    },
    userCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
    },
    menuContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    lastMenuItem: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemText: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    menuItemSubtitle: {
        fontSize: 13,
    },
});
