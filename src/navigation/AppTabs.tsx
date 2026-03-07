import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Target, DollarSign, Settings, Plus } from 'lucide-react-native';
import { Animated, StyleSheet, View, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState } from '@react-navigation/native';

// Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import BudgetsScreen from '../screens/budgets/BudgetsScreen';
import SavingsScreen from '../screens/savings/SavingsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';
import { useThemeStore } from '../store/themeStore';
import { AddExpenseSheet } from '../components/AddExpenseSheet';
import { AddBudgetSheet } from '../components/AddBudgetSheet';
import { AddSavingsSheet } from '../components/AddSavingsSheet';
import { getStyle } from 'react-native-svg/lib/typescript/xml';

export type AppTabParamList = {
    Home: undefined;
    Budgets: undefined;
    Savings: undefined;
    Settings: undefined;
    Analytics: undefined;
    AddButton: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();
const SettingsStack = createNativeStackNavigator();

// Dummy component for center button tab
const DummyComponent = () => null;

// Settings Stack Navigator (includes Analytics)
const SettingsStackScreen = () => {
    return (
        <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
            <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
            <SettingsStack.Screen name="Analytics" component={AnalyticsScreen} />
        </SettingsStack.Navigator>
    );
};

// Animated Tab Icon Component
const AnimatedTabIcon = ({ focused, Icon, color }: any) => {
    const scale = React.useRef(new Animated.Value(1)).current;

    React.useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1.15 : 1,
            damping: 15,
            stiffness: 150,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Icon color={color} size={24} />
        </Animated.View>
    );
};

// Center Floating Button Component
const CenterFloatingButton = ({ onPress, theme, styles }: any) => {
    return (
        <View style={styles.centerButtonContainer}>
            <TouchableOpacity
                style={[styles.centerButton, { backgroundColor: theme.card }]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Plus color={theme.primary} size={32} strokeWidth={2.5} />
            </TouchableOpacity>
        </View>
    );
};

export const AppTabs = () => {
    const { theme } = useThemeStore();
    const [isExpenseSheetVisible, setExpenseSheetVisible] = useState(false);
    const [isBudgetSheetVisible, setBudgetSheetVisible] = useState(false);
    const [isSavingsSheetVisible, setSavingsSheetVisible] = useState(false);

    // Get current route name using navigation state
    const currentRouteName = useNavigationState(state => {
        const route = state?.routes[state.index];
        return route?.name;
    });

    // Handle center button press based on current tab
    const handleCenterButtonPress = () => {
        switch (currentRouteName) {
            case 'Budgets':
                setBudgetSheetVisible(true);
                break;
            case 'Savings':
                setSavingsSheetVisible(true);
                break;
            case 'Home':
            default:
                setExpenseSheetVisible(true);
                break;
        }
    };

    const styles = getStyles(theme);
    return (
        <>
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: theme.primary,
                    tabBarInactiveTintColor: theme.tabBarInactive,
                    tabBarStyle: {
                        backgroundColor: theme.tabBar,
                        borderTopColor: theme.border,
                        borderTopWidth: 1,
                        height: 60,
                        paddingBottom: 8,
                        paddingTop: 8,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                    },
                }}
            >
                <Tab.Screen
                    name="Budgets"
                    component={BudgetsScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <AnimatedTabIcon focused={focused} Icon={Target} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Savings"
                    component={SavingsScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <AnimatedTabIcon focused={focused} Icon={DollarSign} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="AddButton"
                    component={DummyComponent}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            handleCenterButtonPress();
                        },
                    }}
                    options={{
                        tabBarIcon: () => null,
                        tabBarLabel: () => null,
                        tabBarButton: (props) => (
                            <CenterFloatingButton onPress={handleCenterButtonPress} theme={theme} styles={styles.centerButton} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Home"
                    component={DashboardScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <AnimatedTabIcon focused={focused} Icon={Home} color={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsStackScreen}
                    options={{
                        tabBarIcon: ({ color, focused }) => (
                            <AnimatedTabIcon focused={focused} Icon={Settings} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>

            {/* Bottom Sheets */}
            <AddExpenseSheet
                visible={isExpenseSheetVisible}
                onClose={() => setExpenseSheetVisible(false)}
            />
            <AddBudgetSheet
                visible={isBudgetSheetVisible}
                onClose={() => setBudgetSheetVisible(false)}
            />
            <AddSavingsSheet
                visible={isSavingsSheetVisible}
                onClose={() => setSavingsSheetVisible(false)}
            />
        </>
    );
};

const getStyles = (theme: any) => StyleSheet.create({
    centerButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
    centerButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: theme.tabBar,
        // elevation: 8,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 4,
        // },
        // shadowOpacity: 0.3,
        // shadowRadius: 4.65,
        marginBottom: 10,
    },
});
