import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Home01Icon, Wallet01Icon, PiggyBankIcon, Settings01Icon, PlusSignIcon } from '@hugeicons/core-free-icons';
import { Animated, Easing, StyleSheet, View, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState, useIsFocused } from '@react-navigation/native';

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

// Slide-in animation HOC — wraps each screen with a smooth slide+fade on focus
const withSlideAnimation = (Component: React.ComponentType<any>) => {
    return (props: any) => {
        const isFocused = useIsFocused();
        const translateX = React.useRef(new Animated.Value(0)).current;
        const opacity = React.useRef(new Animated.Value(1)).current;

        React.useEffect(() => {
            if (isFocused) {
                translateX.setValue(22);
                opacity.setValue(0);
                Animated.parallel([
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 230,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }, [isFocused]);

        return (
            <Animated.View style={{ flex: 1, transform: [{ translateX }], opacity }}>
                <Component {...props} />
            </Animated.View>
        );
    };
};

// Animated screen variants
const AnimatedDashboard = withSlideAnimation(DashboardScreen);
const AnimatedBudgets = withSlideAnimation(BudgetsScreen);
const AnimatedSavings = withSlideAnimation(SavingsScreen);
const AnimatedSettings = withSlideAnimation(SettingsStackScreen);

// Bouncy Tab Button — triggers bounce immediately on press via tabBarButton
const BouncyTabButton = ({ children, onPress, style, accessibilityRole, accessibilityState, accessibilityLabel, testID }: any) => {
    const scale = React.useRef(new Animated.Value(1)).current;

    const handlePress = () => {
        scale.stopAnimation();
        Animated.sequence([
            Animated.timing(scale, {
                toValue: 0.82,
                duration: 70,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.spring(scale, {
                toValue: 1,
                damping: 8,
                stiffness: 300,
                mass: 0.5,
                useNativeDriver: true,
            }),
        ]).start();
        onPress?.();
    };

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={handlePress}
            style={style}
            accessibilityRole={accessibilityRole}
            accessibilityState={accessibilityState}
            accessibilityLabel={accessibilityLabel}
            testID={testID}
        >
            <Animated.View style={{ transform: [{ scale }], flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

// Center Floating Button Component
const CenterFloatingButton = ({ onPress, theme, styles }: any) => {
    return (
        <View style={styles.centerButtonContainer}>
            <TouchableOpacity
                style={[styles.centerButton, { backgroundColor: theme.teal }]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <HugeiconsIcon icon={PlusSignIcon} color={theme.primary} size={32} strokeWidth={2.5} />
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
                    tabBarActiveTintColor: theme.surface,
                    tabBarInactiveTintColor: theme.tabBarInactive,
                    tabBarStyle: {
                        backgroundColor: theme.primary,
                        height: 64,
                        paddingBottom: 8,
                        paddingTop: 8,
                        borderRadius: 24,
                        borderWidth: 0,
                    },
                    // tabBarShowLabel: false,
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={AnimatedDashboard}
                    options={{
                        tabBarButton: (props) => <BouncyTabButton {...props} />,
                        tabBarIcon: ({ color }) => (
                            <HugeiconsIcon icon={Home01Icon} color={color} size={24} strokeWidth={1.8} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Budgets"
                    component={AnimatedBudgets}
                    options={{
                        tabBarButton: (props) => <BouncyTabButton {...props} />,
                        tabBarIcon: ({ color }) => (
                            <HugeiconsIcon icon={Wallet01Icon} color={color} size={24} strokeWidth={1.8} />
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
                            <CenterFloatingButton onPress={handleCenterButtonPress} theme={theme} styles={styles} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Savings"
                    component={AnimatedSavings}
                    options={{
                        tabBarButton: (props) => <BouncyTabButton {...props} />,
                        tabBarIcon: ({ color }) => (
                            <HugeiconsIcon icon={PiggyBankIcon} color={color} size={24} strokeWidth={1.8} />
                        ),
                    }}
                />

                <Tab.Screen
                    name="Settings"
                    component={AnimatedSettings}
                    options={{
                        tabBarButton: (props) => <BouncyTabButton {...props} />,
                        tabBarIcon: ({ color }) => (
                            <HugeiconsIcon icon={Settings01Icon} color={color} size={24} strokeWidth={1.8} />
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
    },
    centerButton: {
        width: 56,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: theme.tabBar,
        borderRadius: 16,
        // elevation: 8,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 4,
        // },
        // shadowOpacity: 0.3,
        // shadowRadius: 4.65,
        // marginBottom: 10,
    },
});
