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

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleLogin = async () => {
        if (!email || !password) return;

        setLoading(true);
        try {
            await authService.login(email, password);
            // navigation isn't needed here because App.tsx RootNavigator 
            // will automatically switch to AppTabs when accessToken is set in Zustand
        } catch (error: any) {
            toast.show({
                placement: 'top',
                render: ({ id }) => {
                    return (
                        <Toast bg="$error700" id={id}>
                            <ToastTitle color="$white">Login Failed! Check credentials.</ToastTitle>
                        </Toast>
                    );
                },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box flex={1} bg="$backgroundLight0" justifyContent="center" px="$6">
            <VStack space="xl">
                <VStack space="xs">
                    <Heading size="3xl" color="$textLight900">Welcome Back</Heading>
                    <Text color="$textLight500">Sign in to manage your finances</Text>
                </VStack>

                <VStack space="lg">
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
                </VStack>

                <Button
                    size="lg"
                    variant="solid"
                    action="primary"
                    onPress={handleLogin}
                    isDisabled={loading}
                    bg="$indigo600"
                >
                    {loading ? <Spinner color="$white" /> : <ButtonText>Sign In</ButtonText>}
                </Button>

                <Box flexDirection="row" justifyContent="center">
                    <Text size="sm" color="$textLight500">Don't have an account? </Text>
                    <Link onPress={() => navigation.navigate('Register')}>
                        <LinkText size="sm" color="$indigo600" fontWeight="$bold">Sign Up</LinkText>
                    </Link>
                </Box>
            </VStack>
        </Box>
    );
}
