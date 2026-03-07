import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Box, VStack, HStack, Text, Heading, Spinner, Card } from '@gluestack-ui/themed';
import { useFocusEffect } from '@react-navigation/native';
import { useMonthlyReport } from '../../hooks/useAnalytics';

export default function ReportsScreen() {
    const [activeTab, setActiveTab] = useState('Monthly');
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const { data: report, isLoading, refetch, isRefetching } = useMonthlyReport(month, year);

    // Refetch data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );

    if (isLoading) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundLight0">
                <Spinner size="large" color="$indigo600" />
            </Box>
        );
    }

    const summary = report?.summary || {};

    return (
        <Box flex={1} bg="$backgroundLight50">
            <HStack px="$4" py="$2" bg="$white" borderBottomWidth={1} borderColor="$backgroundLight200">
                {['Monthly', 'Yearly'].map((tab) => (
                    <Box
                        key={tab}
                        flex={1}
                        borderBottomWidth={activeTab === tab ? 2 : 0}
                        borderColor="$indigo600"
                        pb="$2"
                        alignItems="center"
                        onTouchEnd={() => setActiveTab(tab)}
                    >
                        <Text color={activeTab === tab ? '$indigo600' : '$textLight500'} fontWeight={activeTab === tab ? '$bold' : '$normal'}>
                            {tab}
                        </Text>
                    </Box>
                ))}
            </HStack>

            <ScrollView refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
                {activeTab === 'Monthly' ? (
                    <VStack space="xl" p="$4">
                        <Card p="$4" borderRadius="$xl" bg="$white">
                            <Heading size="md" color="$textLight900" mb="$4">Summary for {date.toLocaleString('default', { month: 'long' })} {year}</Heading>

                            <VStack space="md">
                                <HStack justifyContent="space-between">
                                    <Text color="$textLight500">Total Expenses</Text>
                                    <Text color="$error600" fontWeight="$bold">-${typeof summary.total_expenses === 'number' ? summary.total_expenses.toFixed(2) : '0.00'}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text color="$textLight500">Total Budget Limit</Text>
                                    <Text color="$textLight900" fontWeight="$bold">${typeof summary.total_budgeted === 'number' ? summary.total_budgeted.toFixed(2) : '0.00'}</Text>
                                </HStack>
                                <HStack justifyContent="space-between">
                                    <Text color="$textLight500">Total Saved</Text>
                                    <Text color="$emerald600" fontWeight="$bold">+${typeof summary.total_saved === 'number' ? summary.total_saved.toFixed(2) : '0.00'}</Text>
                                </HStack>
                            </VStack>
                        </Card>
                    </VStack>
                ) : (
                    <Box flex={1} justifyContent="center" alignItems="center" py="$10">
                        <Text color="$textLight500">Yearly breakdown coming soon.</Text>
                    </Box>
                )}
            </ScrollView>
        </Box>
    );
}
