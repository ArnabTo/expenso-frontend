import React, { useCallback } from 'react';
import { ScrollView, RefreshControl, Dimensions } from 'react-native';
import { Box, VStack, Text, Heading, Spinner, Card } from '@gluestack-ui/themed';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useFocusEffect } from '@react-navigation/native';
import { useCategoryAnalytics } from '../../hooks/useAnalytics';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const { data: categories, isLoading, refetch, isRefetching } = useCategoryAnalytics(month, year);

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

    // Transform data for PieChart
    const pieData = (categories || []).map((cat: any) => ({
        name: cat.category__name || 'Unknown',
        population: Number(cat.total),
        color: cat.category__color || '#6366f1',
        legendFontColor: '#475569',
        legendFontSize: 12,
    }));

    // Dummy BarChart data (Backend gives total per category, we could use that for BarChart too)
    const barData = {
        labels: (categories || []).slice(0, 5).map((c: any) => (c.category__name || 'U').substring(0, 3)),
        datasets: [{
            data: (categories || []).slice(0, 5).map((c: any) => Number(c.total))
        }]
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#f8fafc' }}
            refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        >
            <VStack space="xl" p="$4">

                <Card p="$4" borderRadius="$xl" bg="$white">
                    <Heading size="md" color="$textLight900" mb="$4">Category Breakdown</Heading>
                    {pieData.length > 0 ? (
                        <PieChart
                            data={pieData}
                            width={screenWidth - 64}
                            height={200}
                            chartConfig={{
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            }}
                            accessor={"population"}
                            backgroundColor={"transparent"}
                            paddingLeft={"15"}
                            center={[10, 0]}
                            absolute
                        />
                    ) : (
                        <Text color="$textLight500" textAlign="center" py="$10">No expense data for this month.</Text>
                    )}
                </Card>

                <Card p="$4" borderRadius="$xl" bg="$white">
                    <Heading size="md" color="$textLight900" mb="$4">Top 5 Expenses</Heading>
                    {barData.labels.length > 0 ? (
                        <BarChart
                            data={barData}
                            width={screenWidth - 64}
                            height={220}
                            yAxisLabel="$"
                            yAxisSuffix=""
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                                barPercentage: 0.6,
                            }}
                            style={{ marginVertical: 8, borderRadius: 16 }}
                        />
                    ) : (
                        <Text color="$textLight500" textAlign="center" py="$10">Not enough data.</Text>
                    )}
                </Card>

            </VStack>
        </ScrollView>
    );
}
