import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { useAuthStore } from '../store/authStore';

export const RootNavigator = () => {
    const { user, accessToken, isLoading, initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {/* If we have a token (or user), show Main App Tab, else show Login/Register */}
            {accessToken ? <AppTabs /> : <AuthStack />}
        </NavigationContainer>
    );
};
