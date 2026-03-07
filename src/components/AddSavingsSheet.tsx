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
import { useAddSavingsPlan } from '../hooks/useAnalytics';

interface AddSavingsSheetProps {
    visible: boolean;
    onClose: () => void;
}

export const AddSavingsSheet: React.FC<AddSavingsSheetProps> = ({ visible, onClose }) => {
    const { theme } = useThemeStore();
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addSavingsPlan = useAddSavingsPlan();

    const handleSubmit = async () => {
        if (!goalName || !targetAmount) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            await addSavingsPlan.mutateAsync({
                goal_name: goalName,
                target_amount: parseFloat(targetAmount),
                current_amount: currentAmount ? parseFloat(currentAmount) : 0,
                deadline: deadline || undefined,
            });

            Alert.alert('Success', 'Savings plan created successfully!');

            // Reset form
            setGoalName('');
            setTargetAmount('');
            setCurrentAmount('');
            setDeadline('');
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to create savings plan');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BottomSheet visible={visible} onClose={onClose}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: theme.text }]}>New Savings Goal</Text>

                {/* Goal Name Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Goal Name *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                        placeholder="e.g., Emergency Fund"
                        placeholderTextColor={theme.textSecondary}
                        value={goalName}
                        onChangeText={setGoalName}
                    />
                </View>

                {/* Target Amount Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Target Amount *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                        placeholder="0.00"
                        placeholderTextColor={theme.textSecondary}
                        value={targetAmount}
                        onChangeText={setTargetAmount}
                        keyboardType="decimal-pad"
                    />
                </View>

                {/* Current Amount Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Current Amount</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                        placeholder="0.00"
                        placeholderTextColor={theme.textSecondary}
                        value={currentAmount}
                        onChangeText={setCurrentAmount}
                        keyboardType="decimal-pad"
                    />
                </View>

                {/* Deadline Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Deadline (Optional)</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={theme.textSecondary}
                        value={deadline}
                        onChangeText={setDeadline}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={[styles.submitButton, { backgroundColor: theme.primary, opacity: isSubmitting ? 0.6 : 1 }]}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Creating...' : 'Create Savings Goal'}
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
