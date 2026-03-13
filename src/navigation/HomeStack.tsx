import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import AllExpensesScreen from '../screens/expenses/AllExpensesScreen';
import type { HomeStackParamList } from './types';

export type { HomeStackParamList };

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AllExpenses" component={AllExpensesScreen} />
    </Stack.Navigator>
);
