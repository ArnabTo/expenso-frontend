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
    Spinner,
    Toast,
    ToastTitle,
    useToast,
} from '@gluestack-ui/themed';
import { useAddSavingsPlan } from '../hooks/useAnalytics';

interface AddSavingsPlanModalProps {
    visible: boolean;
    onClose: () => void;
}

export const AddSavingsPlanModal: React.FC<AddSavingsPlanModalProps> = ({ visible, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [monthlyDeposit, setMonthlyDeposit] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    const addSavingsPlan = useAddSavingsPlan();
    const toast = useToast();

    const handleSubmit = async () => {
        if (!name || !targetAmount || !monthlyDeposit || !startDate) {
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
            await addSavingsPlan.mutateAsync({
                name,
                description,
                target_amount: parseFloat(targetAmount),
                monthly_deposit: parseFloat(monthlyDeposit),
                start_date: startDate,
                is_active: true,
            });

            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast bg="$success700" id={id}>
                        <ToastTitle color="$white">Savings plan created successfully!</ToastTitle>
                    </Toast>
                ),
            });

            // Reset form
            setName('');
            setDescription('');
            setTargetAmount('');
            setMonthlyDeposit('');
            setStartDate(new Date().toISOString().split('T')[0]);
            onClose();
        } catch (error) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast bg="$error700" id={id}>
                        <ToastTitle color="$white">Failed to create savings plan.</ToastTitle>
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
                    <Heading size="lg">Create Savings Plan</Heading>
                    <ModalCloseButton>
                        <Icon as={CloseIcon} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <VStack space="lg">
                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Plan Name *</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="e.g., Emergency Fund"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Description (Optional)</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="Purpose of this savings plan"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Target Amount *</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="10000.00"
                                    value={targetAmount}
                                    onChangeText={setTargetAmount}
                                    keyboardType="decimal-pad"
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Monthly Deposit *</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="500.00"
                                    value={monthlyDeposit}
                                    onChangeText={setMonthlyDeposit}
                                    keyboardType="decimal-pad"
                                />
                            </Input>
                        </VStack>

                        <VStack space="xs">
                            <Text size="sm" fontWeight="$medium">Start Date *</Text>
                            <Input variant="outline">
                                <InputField
                                    placeholder="YYYY-MM-DD"
                                    value={startDate}
                                    onChangeText={setStartDate}
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
                        isDisabled={addSavingsPlan.isPending}
                    >
                        {addSavingsPlan.isPending ? <Spinner color="$white" /> : <ButtonText>Create Plan</ButtonText>}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
