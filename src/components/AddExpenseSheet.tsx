import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Modal,
} from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { PlusSignIcon, Cancel01Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { BottomSheet } from './BottomSheet';
import { useThemeStore } from '../store/themeStore';
import { useCategories, useAddExpense } from '../hooks/useExpenses';
import apiService from '../services/apiService';

interface AddExpenseSheetProps {
    visible: boolean;
    onClose: () => void;
}

export const AddExpenseSheet: React.FC<AddExpenseSheetProps> = ({ visible, onClose }) => {
    const { theme } = useThemeStore();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: categories, refetch: refetchCategories } = useCategories();
    const addExpense = useAddExpense();

    const selectedCategoryName = categories?.find((cat: any) => cat.id.toString() === category)?.name || 'Select Category';

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            Alert.alert('Error', 'Please enter a category name');
            return;
        }

        try {
            const newCat = await apiService.categories.create({ name: newCategoryName.trim() });
            setNewCategoryName('');
            setShowAddCategory(false);
            await refetchCategories();
            setCategory(newCat.id.toString());
            Alert.alert('Success', 'Category added successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to add category');
        }
    };

    const handleSubmit = async () => {
        // Detailed validation with specific error messages
        if (!title.trim()) {
            Alert.alert('Missing Field', 'Please enter an expense title');
            return;
        }
        if (!amount || amount.trim() === '') {
            Alert.alert('Missing Field', 'Please enter an amount');
            return;
        }
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
            return;
        }
        if (!date || date.trim() === '') {
            Alert.alert('Missing Field', 'Please enter a date');
            return;
        }
        if (!category || category.trim() === '') {
            Alert.alert('Missing Field', 'Please select a category');
            return;
        }

        setIsSubmitting(true);
        try {
            await addExpense.mutateAsync({
                title: title.trim(),
                amount: parseFloat(amount),
                date,
                category: parseInt(category),
                note: note.trim(),
            });

            Alert.alert('Success', 'Expense added successfully!');

            // Reset form
            setTitle('');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setCategory('');
            setNote('');
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error?.response?.data?.message || 'Failed to add expense');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BottomSheet visible={visible} onClose={onClose}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: theme.text }]}>Add Expense</Text>

                {/* Title Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Title *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                        placeholder="e.g., Grocery shopping"
                        placeholderTextColor={theme.textSecondary}
                        value={title}
                        onChangeText={setTitle}
                    />
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

                {/* Date Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Date *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={theme.textSecondary}
                        value={date}
                        onChangeText={setDate}
                    />
                </View>

                {/* Category Dropdown */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Category *</Text>
                    <TouchableOpacity
                        onPress={() => setShowCategoryDropdown(true)}
                        style={[
                            styles.dropdownTrigger,
                            { backgroundColor: theme.background, borderColor: theme.border },
                        ]}
                    >
                        <Text style={[styles.dropdownText, { color: category ? theme.text : theme.textSecondary }]}>
                            {selectedCategoryName}
                        </Text>
                        <HugeiconsIcon icon={ArrowDown01Icon} size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Note Input */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Note (Optional)</Text>
                    <TextInput
                        style={[
                            styles.input,
                            styles.textArea,
                            { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
                        ]}
                        placeholder="Add a note..."
                        placeholderTextColor={theme.textSecondary}
                        value={note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                    style={[styles.submitButton, { backgroundColor: theme.secondary, opacity: isSubmitting ? 0.6 : 1 }]}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Adding...' : 'Add Expense'}
                    </Text>
                </TouchableOpacity>

                {/* Bottom spacing */}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Category Dropdown Modal */}
            <Modal
                visible={showCategoryDropdown}
                transparent
                animationType="fade"
                onRequestClose={() => setShowCategoryDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.dropdownOverlay}
                    activeOpacity={1}
                    onPress={() => setShowCategoryDropdown(false)}
                >
                    <TouchableOpacity activeOpacity={1}>
                        <View style={[styles.dropdownContent, { backgroundColor: theme.surface }]}>
                            <View style={styles.dropdownHeader}>
                                <Text style={[styles.dropdownTitle, { color: theme.text }]}>Select Category</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowCategoryDropdown(false);
                                        setShowAddCategory(true);
                                    }}
                                    style={styles.addCategoryHeaderButton}
                                >
                                    <HugeiconsIcon icon={PlusSignIcon} size={18} color={theme.secondary} />
                                    <Text style={[styles.addCategoryText, { color: theme.secondary }]}>Add New</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.dropdownList}>
                                {categories?.map((cat: any) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => {
                                            setCategory(cat.id.toString());
                                            setShowCategoryDropdown(false);
                                        }}
                                        style={[
                                            styles.dropdownItem,
                                            { borderBottomColor: theme.border },
                                            category === cat.id.toString() && { backgroundColor: `${theme.secondary}10` },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dropdownItemText,
                                                { color: category === cat.id.toString() ? theme.secondary : theme.text },
                                            ]}
                                        >
                                            {cat.name}
                                        </Text>
                                        {category === cat.id.toString() && (
                                            <View style={[styles.checkMark, { backgroundColor: theme.secondary }]} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* Add Category Modal */}
            <Modal
                visible={showAddCategory}
                transparent
                animationType="fade"
                onRequestClose={() => setShowAddCategory(false)}
            >
                <TouchableOpacity
                    style={styles.dropdownOverlay}
                    activeOpacity={1}
                    onPress={() => setShowAddCategory(false)}
                >
                    <TouchableOpacity activeOpacity={1}>
                        <View style={[styles.addCategoryModal, { backgroundColor: theme.surface }]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: theme.text }]}>Add New Category</Text>
                                <TouchableOpacity onPress={() => setShowAddCategory(false)}>
                                    <HugeiconsIcon icon={Cancel01Icon} size={24} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: theme.background, color: theme.text, borderColor: theme.border },
                                ]}
                                placeholder="Category name"
                                placeholderTextColor={theme.textSecondary}
                                value={newCategoryName}
                                onChangeText={setNewCategoryName}
                                autoFocus
                            />

                            <TouchableOpacity
                                onPress={handleAddCategory}
                                style={[styles.modalButton, { backgroundColor: theme.secondary }]}
                            >
                                <Text style={styles.modalButtonText}>Add Category</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
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
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    dropdownTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
    },
    dropdownText: {
        fontSize: 16,
    },
    dropdownOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    dropdownContent: {
        width: '100%',
        maxHeight: 500,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
    },
    dropdownTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addCategoryHeaderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addCategoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    dropdownList: {
        maxHeight: 300,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
    },
    dropdownItemText: {
        fontSize: 16,
    },
    checkMark: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    addCategoryModal: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
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
