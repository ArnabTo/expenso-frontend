import React, { useState } from 'react';
import {
    VStack,
    Heading,
    Text,
    Input,
    InputField,
    Button,
    ButtonText,
    Box,
    Link,
    LinkText,
    Spinner,
    Toast,
    ToastTitle,
    useToast,
} from '@gluestack-ui/themed';
import { authService } from '../../services/auth';

export default function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleRegister = async () => {
        if (!email || !username || !password || password !== rePassword) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast bg="$error700" id={id}>
                        <ToastTitle color="$white">Please fill all fields correctly.</ToastTitle>
                    </Toast>
                ),
            });
            return;
        }

        setLoading(true);
        try {
            await authService.register({
                email,
                username,
                password,
                re_password: rePassword,
                currency: 'USD'
            });
            // Navigation switches automatically via Zustand
        } catch (error: any) {
            toast.show({
                placement: 'top',
                render: ({ id }) => (
                    <Toast bg="$error700" id={id}>
                        <ToastTitle color="$white">Registration failed.</ToastTitle>
                    </Toast>
                ),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box flex={1} bg="$backgroundLight0" justifyContent="center" px="$6">
            <VStack space="xl">
                <VStack space="xs">
                    <Heading size="3xl" color="$textLight900">Create Account</Heading>
                    <Text color="$textLight500">Start managing your finances today</Text>
                </VStack>

                <VStack space="lg">
                    <Input variant="outline" size="md">
                        <InputField
                            placeholder="Username"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </Input>

                    <Input variant="outline" size="md">
                        <InputField
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </Input>

                    <Input variant="outline" size="md">
                        <InputField
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </Input>

                    <Input variant="outline" size="md">
                        <InputField
                            placeholder="Confirm Password"
                            type="password"
                            value={rePassword}
                            onChangeText={setRePassword}
                        />
                    </Input>
                </VStack>

                <Button
                    size="lg"
                    variant="solid"
                    action="primary"
                    onPress={handleRegister}
                    isDisabled={loading}
                    bg="$indigo600"
                >
                    {loading ? <Spinner color="$white" /> : <ButtonText>Sign Up</ButtonText>}
                </Button>

                <Box flexDirection="row" justifyContent="center">
                    <Text size="sm" color="$textLight500">Already have an account? </Text>
                    <Link onPress={() => navigation.goBack()}>
                        <LinkText size="sm" color="$indigo600" fontWeight="$bold">Sign In</LinkText>
                    </Link>
                </Box>
            </VStack>
        </Box>
    );
}
