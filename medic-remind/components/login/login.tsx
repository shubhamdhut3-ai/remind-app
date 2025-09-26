

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '../store/store';
import { signInWithEmail, signInWithGoogle, clearError } from '../store/authSlice';
import LoadingSpinner from './LoadingSpinner';
import { colors, spacing, typography } from '../constants/theme';

interface LoginScreenProps {
    navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        if (error) {
            Alert.alert('Login Error', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        let isValid = true;

        setEmailError('');
        setPasswordError('');

        if (!email.trim()) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            isValid = false;
        }

        if (!password.trim()) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        dispatch(signInWithEmail({ email: email.trim(), password }));
    };

    const handleGoogleLogin = async () => {
        dispatch(signInWithGoogle());
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Ionicons name="medical" size={60} color={colors.primary} />
            </View>
            <Text style={styles.title}>Medicine Reminder</Text>
            <Text style={styles.subtitle}>Welcome back! Please sign in to continue.</Text>
        </View>
    );

    const renderForm = () => (
        <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[styles.inputWrapper, emailError && styles.inputError]}>
                    <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Enter your email"
                        placeholderTextColor={colors.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.inputWrapper, passwordError && styles.inputError]}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                        style={[styles.textInput, styles.passwordInput]}
                        placeholder="Enter your password"
                        placeholderTextColor={colors.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.passwordToggle}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>
    );

    const renderButtons = () => (
        <View style={styles.buttonContainer}>
            {/* Login Button */}
            <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <LoadingSpinner size="small" color="#fff" />
                ) : (
                    <Text style={styles.loginButtonText}>Sign In</Text>
                )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity
                style={[styles.googleButton, isLoading && styles.buttonDisabled]}
                onPress={handleGoogleLogin}
                disabled={isLoading}
            >
                <Ionicons name="logo-google" size={20} color="#fff" style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>
        </View>
    );

    const renderFooter = () => (
        <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading && !email && !password) {
        return <LoadingSpinner text="Signing you in..." />;
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                {renderHeader()}
                {renderForm()}
                {renderButtons()}
                {renderFooter()}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxxl,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h2,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body1,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    form: {
        marginBottom: spacing.xxxl,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        ...typography.body2,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    inputError: {
        borderColor: colors.error,
    },
    inputIcon: {
        marginRight: spacing.sm,
    },
    textInput: {
        flex: 1,
        ...typography.body1,
        color: colors.text,
        paddingVertical: spacing.sm,
    },
    passwordInput: {
        paddingRight: spacing.sm,
    },
    passwordToggle: {
        padding: spacing.xs,
    },
    errorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginTop: spacing.sm,
    },
    forgotPasswordText: {
        ...typography.body2,
        color: colors.primary,
    },
    buttonContainer: {
        marginBottom: spacing.xl,
    },
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    loginButtonText: {
        ...typography.body1,
        fontWeight: '600',
        color: '#fff',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        ...typography.body2,
        color: colors.textSecondary,
        marginHorizontal: spacing.md,
    },
    googleButton: {
        backgroundColor: '#4285F4',
        borderRadius: 12,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        marginRight: spacing.sm,
    },
    googleButtonText: {
        ...typography.body1,
        fontWeight: '600',
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        ...typography.body2,
        color: colors.textSecondary,
    },
    footerLink: {
        ...typography.body2,
        color: colors.primary,
        fontWeight: '600',
    },
});

export default LoginScreen;
