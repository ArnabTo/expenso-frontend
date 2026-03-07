import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Box, VStack, HStack, Text, Heading, Spinner, Fab, FabIcon } from '@gluestack-ui/themed';
import { Plus } from 'lucide-react-native';
import { useExpenses } from '../../hooks/useExpenses';
import { AddExpenseModal } from '../../components/AddExpenseModal';

export default function ExpensesScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const { data: expenses, isLoading, refetch, isRefetching } = useExpenses();

    if (isLoading) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundLight0">
                <Spinner size="large" color="$indigo600" />
            </Box>
        );
    }

    const renderItem = ({ item }: { item: any }) => (
        <Box p="$4" mb="$3" bg="$white" borderRadius="$xl" shadowColor="$backgroundLight900"
            shadowOffset={{ width: 0, height: 1 }} shadowOpacity={0.1} shadowRadius={2}>
            <HStack justifyContent="space-between" alignItems="center">
                <HStack space="md" alignItems="center">
                    <Box w={40} h={40} borderRadius="$full" bg={item.category_detail?.color || '$indigo100'}
                        justifyContent="center" alignItems="center">
                        <Text color="$white" fontWeight="$bold">{item.category_detail?.name?.[0] || '?'}</Text>
                    </Box>
                    <VStack>
                        <Text color="$textLight900" fontWeight="$bold" size="lg">{item.title}</Text>
                        <Text color="$textLight500" size="sm">{item.date} • {item.category_detail?.name || 'Uncategorized'}</Text>
                    </VStack>
                </HStack>
                <Text color="$error600" fontWeight="$bold" size="lg">-${item.amount}</Text>
            </HStack>
        </Box>
    );

    return (
        <Box flex={1} bg="$backgroundLight50">
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
                ListEmptyComponent={
                    <Box flex={1} justifyContent="center" alignItems="center" mt="$10">
                        <Text color="$textLight400">No expenses found.</Text>
                    </Box>
                }
            />
            <Fab
                size="lg"
                placement="bottom right"
                isHovered={false}
                isDisabled={false}
                isPressed={false}
                bg="$indigo600"
                onPress={() => setModalVisible(true)}
            >
                <FabIcon as={Plus} color="$white" />
            </Fab>

            <AddExpenseModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        </Box>
    );
}
