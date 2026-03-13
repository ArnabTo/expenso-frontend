import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { BottomSheet } from './BottomSheet';
import { useThemeStore } from '../store/themeStore';
import { useCategories } from '../hooks/useExpenses';
import { useAddBudget } from '../hooks/useBudgets';

interface AddBudgetSheetProps {
    visible: boolean;
    onClose: () => void;
}

export const AddBudgetSheet: React.FC<AddBudgetSheetProps> = ({ visible, onClose }) => {
    const { theme } = useThemeStore();
    const date = new Date();
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState((date.getMonth() + 1).toString());
    const [year, setYear] = useState(date.getFullYear().toString());
    const [category, setCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: categories } = useCategories();
    const addBudget = useAddBudget();

    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const handleSubmit = async () => {
        if (!amount || !category || !month || !year) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await addBudget.mutateAsync({
                amount: parseFloat(amount),
                category: parseInt(category),
                month: parseInt(month),
                year: parseInt(year),
            });

            Alert.alert('Success', 'Budget added successfully!');

            // Reset form
            setAmount('');
            setCategory('');
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to add budget');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BottomSheet visible={visible} onClose={onClose}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: theme.text }]}>Set Budget</Text>

                {/* Category Selection */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Category *</Text>
                    <View style={styles.categoryList}>
                        {categories?.map((cat: any) => (
                            <TouchableOpacity
                                key={cat.id}
                                onPress={() => setCategory(cat.id.toString())}
                                style={[
                                    styles.categoryChip,
                                    {
                                        backgroundColor: category === cat.id.toString() ? theme.secondary : theme.background,
                                        borderColor: category === cat.id.toString() ? theme.secondary : theme.border,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.categoryChipText,
                                        { color: category === cat.id.toString() ? '#FFFFFF' : theme.text },
                                    ]}
                                >
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Amount Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Amount *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                        placeholder="0.00"
                        placeholderTextColor={theme.textSecondary}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                    />
                </View>

                {/* Month Selection */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Month *</Text>
                    <View style={styles.monthGrid}>
                        {months.map((m) => (
                            <TouchableOpacity
                                key={m.value}
                                onPress={() => setMonth(m.value)}
                                style={[
                                    styles.monthChip,
                                    {
                                        backgroundColor: month === m.value ? theme.secondary : theme.background,
                                        borderColor: month === m.value ? theme.secondary : theme.border,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.monthChipText,
                                        { color: month === m.value ? '#FFFFFF' : theme.text },
                                    ]}
                                >
                                    {m.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Year Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Year *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                        placeholder="YYYY"
                        placeholderTextColor={theme.textSecondary}
                        value={year}
                        onChangeText={setYear}
                        keyboardType="number-pad"
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={[styles.submitButton, { backgroundColor: theme.secondary, opacity: isSubmitting ? 0.6 : 1 }]}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Setting...' : 'Set Budget'}
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
    },
    categoryList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '600',
    },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    monthChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        minWidth: 100,
        alignItems: 'center',
    },
    monthChipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    submitButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
