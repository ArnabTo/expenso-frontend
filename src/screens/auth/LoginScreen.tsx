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

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { theme } = useThemeStore();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await authService.login(email, password);
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                        Welcome back
                    </Text>
                    <Text style={[styles.subheading, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                        Sign in to manage your finances
                    </Text>

                    {/* Fields */}
                    <View style={styles.fields}>
                        <View style={styles.fieldGroup}>
                            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: fonts.medium }]}>
                                Email
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                        color: theme.text,
                                        fontFamily: fonts.regular,
                                    },
                                ]}
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
                            <Text style={[styles.label, { color: theme.textSecondary, fontFamily: fonts.medium }]}>
                                Password
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {
                                        backgroundColor: theme.card,
                                        borderColor: theme.border,
                                        color: theme.text,
                                        fontFamily: fonts.regular,
                                    },
                                ]}
                                placeholder="••••••••"
                                placeholderTextColor={theme.textSecondary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
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
                        onPress={handleLogin}
                        activeOpacity={0.85}
                        disabled={loading}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" />
                            : <Text style={[styles.buttonText, { fontFamily: fonts.semiBold }]}>Sign In</Text>
                        }
                    </TouchableOpacity>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
                            Don't have an account?{'  '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={[styles.footerLink, { color: theme.teal, fontFamily: fonts.semiBold }]}>
                                Sign Up
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
    input: {
        height: 52,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
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
        // shadowColor: '#00BFA5',
        // shadowOffset: { width: 0, height: 4 },
        // shadowOpacity: 0.35,
        // shadowRadius: 8,
        // elevation: 6,
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
