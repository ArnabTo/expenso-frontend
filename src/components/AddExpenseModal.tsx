import React, { useState } from 'react';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Heading,
    Icon,
    CloseIcon,
    Button,
    ButtonText,
    VStack,
    Input,
    InputField,
    Text,
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicatorWrapper,
    SelectDragIndicator,
    SelectItem,
    Spinner,
    Toast,
    ToastTitle,
    useToast,
} from '@gluestack-ui/themed';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';
import { useCategories, useAddExpense } from '../hooks/useExpenses';

interface AddExpenseModalProps {
    visible: boolean;
    onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ visible, onClose }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');

    const { data: categories } = useCategories();
    const addExpense = useAddExpense();
    const toast = useToast();

    const handleSubmit = async () => {
        if (!title || !amount || !date || !category) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast bg="$error700" id={id}>
                        <ToastTitle color="$white">Please fill all required fields.</ToastTitle>
                    </Toast>
                ),
            });
            return;
        }

        try {
            await addExpense.mutateAsync({
                title,
                amount: parseFloat(amount),
                date,
                category: parseInt(category),
                note,
            });

            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast bg="$success700" id={id}>
                        <ToastTitle color="$white">Expense added successfully!</ToastTitle>
                    </Toast>
                ),
            });

            // Reset form
            setTitle('');
            setAmount('');
            setDate(new Date().toISOString().split('T')[0]);
            setCategory('');
            setNote('');
            onClose();
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast bg="$error700" id={id}>
                        <ToastTitle color="$white">Failed to add expense.</ToastTitle>
                    </Toast>
                ),
            });
        }
    };

    return (
        <Modal isOpen={visible} onClose={onClose}>
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader>
                    <Heading size="lg">Add New Expense</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <VStack space="lg">
                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Title *</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="e.g., Grocery shopping"
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Amount *</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="0.00"
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="decimal-pad"
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Date *</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="YYYY-MM-DD"
                                    value={date}
                                    onChangeText={setDate}
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Category *</Text>
                            <Select selectedValue={category} onValueChange={setCategory}>
                                <SelectTrigger variant="outline" size="md">
                                    <SelectInput placeholder="Select Category" />
                                    <SelectIcon mr="$3">
                                        <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
                                    </SelectIcon>
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {categories?.map((cat: any) => (
                                            <SelectItem
                                                key={cat.id}
                                                label={cat.name}
                                                value={cat.id.toString()}
                                            />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Note (Optional)</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="Add a note..."
                                    value={note}
                                    onChangeText={setNote}
                                    multiline
                                />
                            </Input>
                        </VStack>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        size="sm"
                        action="secondary"
                        mr="$3"
                        onPress={onClose}
                    >
                        <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                        size="sm"
                        action="positive"
                        bg="$indigo600"
                        onPress={handleSubmit}
                        isDisabled={addExpense.isPending}
                    >
                        {addExpense.isPending ? <Spinner color="$white" /> : <ButtonText>Add Expense</ButtonText>}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
