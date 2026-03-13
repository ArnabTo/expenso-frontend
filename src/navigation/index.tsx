import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const RootNavigator = () => {
    const { user, accessToken, isLoading, initialize } = useAuthStore();
    const { theme } = useThemeStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.primary }}>
                <ActivityIndicator size="large" color={theme.teal} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <NavigationContainer>
                {/* If there is a token (or user), show Main App Tab, else show Login/Register */}
                {accessToken ? <AppTabs /> : <AuthStack />}
            </NavigationContainer>
        </View>
    );
};
