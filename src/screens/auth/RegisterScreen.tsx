import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, KeyboardAvoidingView,
    Platform, ScrollView, StatusBar,
} from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { ThemeToggler } from '../../components/ThemeToggler';
import { authService } from '../../services/auth';
import { fonts } from '../../theme/typography';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ViewIcon, ViewOffSlashIcon } from '@hugeicons/core-free-icons';

export default function RegisterScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const { theme } = useThemeStore();

    const handleRegister = async () => {
        if (!email || !username || !password || !rePassword) {
            setError('Please fill in all fields.');
            return;
        }
        if (password !== rePassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await authService.register({
                email,
                username,
                password,
                re_password: rePassword,
                currency: 'USD',
            });
        } catch {
            setError('Registration failed. Email or username may already be in use.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = [
        styles.input,
        {
            backgroundColor: theme.card,
            borderColor: theme.border,
            color: theme.text,
            fontFamily: fonts.regular,
        },
    ];

    return (
        <View style={[styles.root, { backgroundColor: theme.background }]}>
            <StatusBar
                barStyle={theme.background === '#1C1C1E' ? 'light-content' : 'dark-content'}
                backgroundColor={theme.background}
            />

            {/* Theme Toggle */}
            <View style={styles.topBar}>
                <ThemeToggler />
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Brand */}
                    <View style={styles.brandRow}>
                        <View style={[styles.brandDot, { backgroundColor: theme.teal }]} />
                        <Text style={[styles.brandName, { color: theme.teal, fontFamily: fonts.headingExtraBold }]}>
                            Expenso
                        </Text>
                    </View>

                    {/* Heading */}
                    <Text style={[styles.heading, { color: theme.text, fontFamily: fonts.headingBold }]}>
                        Create account
                    </Text>
                    <Text style={[styles.subheading, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                        Start managing your finances today
                    </Text>

                    {/* Fields */}
                    <View style={styles.fields}>
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: fonts.medium }]}>Username</Text>
                            <TextInput
                                style={inputStyle}
                                placeholder="your_username"
                                placeholderTextColor={theme.textSecondary}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: fonts.medium }]}>Email</Text>
                            <TextInput
                                style={inputStyle}
                                placeholder="you@example.com"
                                placeholderTextColor={theme.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: fonts.medium }]}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[...inputStyle, styles.inputWithIcon]}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(v => !v)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <HugeiconsIcon
                                        icon={showPassword ? ViewOffSlashIcon : ViewIcon}
                                        size={20}
                                        color={theme.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: fonts.medium }]}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[...inputStyle, styles.inputWithIcon]}
                                    placeholder="••••••••"
                                    placeholderTextColor={theme.textSecondary}
                                    value={rePassword}
                                    onChangeText={setRePassword}
                                    secureTextEntry={!showRePassword}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowRePassword(v => !v)}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <HugeiconsIcon
                                        icon={showRePassword ? ViewOffSlashIcon : ViewIcon}
                                        size={20}
                                        color={theme.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {error ? (
                            <Text style={[styles.errorText, { color: theme.error, fontFamily: fonts.regular }]}>
                                {error}
                            </Text>
                        ) : null}
                    </View>

                    {/* CTA */}
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.primary, opacity: loading ? 0.75 : 1 }]}
                        onPress={handleRegister}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={[styles.buttonText, { fontFamily: fonts.semiBold }]}>Create Account</Text>
                        }
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                            Already have an account?{'  '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={[styles.footerLink, { color: theme.teal, fontFamily: fonts.semiBold }]}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1 },
    flex: { flex: 1 },
    topBar: {
        paddingTop: 52,
        paddingHorizontal: 24,
        alignItems: 'flex-end',
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingBottom: 48,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    brandDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    brandName: {
        fontSize: 18,
        letterSpacing: 0.5,
    },
    heading: {
        fontSize: 34,
        marginBottom: 8,
    },
    subheading: {
        fontSize: 15,
        marginBottom: 36,
        lineHeight: 22,
    },
    fields: {
        gap: 18,
        marginBottom: 28,
    },
    fieldGroup: { gap: 6 },
    label: { fontSize: 13 },
    inputWrapper: {
        position: 'relative',
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
    },
    inputWithIcon: {
        paddingRight: 48,
    },
    eyeButton: {
        position: 'absolute',
        right: 14,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 13,
        marginTop: -8,
    },
    button: {
        height: 54,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: { fontSize: 14 },
    footerLink: { fontSize: 14 },
});
