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
import { useCategories } from '../hooks/useExpenses';
import { useAddBudget } from '../hooks/useBudgets';

interface AddBudgetModalProps {
    visible: boolean;
    onClose: () => void;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({ visible, onClose }) => {
    const date = new Date();
    const [amount, setAmount] = useState('');
    const [month, setMonth] = useState((date.getMonth() + 1).toString());
    const [year, setYear] = useState(date.getFullYear().toString());
    const [category, setCategory] = useState('');

    const { data: categories } = useCategories();
    const addBudget = useAddBudget();
    const toast = useToast();

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
            await addBudget.mutateAsync({
                amount: parseFloat(amount),
                category: parseInt(category),
                month: parseInt(month),
                year: parseInt(year),
            });

            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast bg="$success700" id={id}>
                        <ToastTitle color="$white">Budget added successfully!</ToastTitle>
                    </Toast>
                ),
            });

            // Reset form
            setAmount('');
            setCategory('');
            onClose();
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast bg="$error700" id={id}>
                        <ToastTitle color="$white">Failed to add budget.</ToastTitle>
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
                    <Heading size="lg">Set Budget</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <VStack space="lg">
                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Category *</Text>
                            <Select selectedValue={category} onValueChange={setCategory}>
                                <SelectTrigger variant="outline" size="md">
                                    <SelectInput placeholder="Select Category" />
                                    <SelectIcon marginRight="$3">
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
                            <Text size="sm" fontWeight="$medium">Budget Amount *</Text>
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
                            <Text size="sm" fontWeight="$medium">Month *</Text>
                            <Select selectedValue={month} onValueChange={setMonth}>
                                <SelectTrigger variant="outline" size="md">
                                    <SelectInput placeholder="Select Month" />
                                    <SelectIcon marginRight="$3">
                                        <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
                                    </SelectIcon>
                                </SelectTrigger>
                                <SelectPortal>
                                    <SelectBackdrop />
                                    <SelectContent>
                                        <SelectDragIndicatorWrapper>
                                            <SelectDragIndicator />
                                        </SelectDragIndicatorWrapper>
                                        {months.map((m) => (
                                            <SelectItem
                                                key={m.value}
                                                label={m.label}
                                                value={m.value}
                                            />
                                        ))}
                                    </SelectContent>
                                </SelectPortal>
                            </Select>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Year *</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="2026"
                                    value={year}
                                    onChangeText={setYear}
                                    keyboardType="number-pad"
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
                        isDisabled={addBudget.isPending}
                    >
                        {addBudget.isPending ? <Spinner color="$white" /> : <ButtonText>Set Budget</ButtonText>}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
