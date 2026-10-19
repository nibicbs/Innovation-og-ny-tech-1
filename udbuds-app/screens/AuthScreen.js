import { useRef, useState } from 'react';
import {
    ActivityIndicator, KeyboardAvoidingView, Platform, Pressable,
    ScrollView, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database/firebase';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authErrors';
import styles from '../styles/AuthScreenStyles';

export default function AuthScreen() {
    const { isConfigured } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const submitting = useRef(false);

    const submit = async () => {
        if (submitting.current || !isConfigured) return;
        setError('');
        const normalizedEmail = email.trim();
        if (!normalizedEmail || !password) {
            setError('Udfyld både e-mail og adgangskode.');
            return;
        }
        if (!isLogin && password.length < 6) {
            setError('Adgangskoden skal indeholde mindst 6 tegn.');
            return;
        }
        if (!isLogin && password !== confirmation) {
            setError('De to adgangskoder er ikke ens.');
            return;
        }

        submitting.current = true;
        setBusy(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, normalizedEmail, password);
            } else {
                await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            }
            // AuthProvider skifter navigation, når Firebase melder brugeren logget ind.
        } catch (authError) {
            setError(getAuthErrorMessage(authError));
        } finally {
            submitting.current = false;
            setBusy(false);
        }
    };

    const switchMode = () => {
        setIsLogin((value) => !value);
        setPassword('');
        setConfirmation('');
        setError('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                    <Text style={styles.eyebrow}>SAMMEN OM OPGAVEN</Text>
                    <Text style={styles.brand}>SammenBud</Text>
                    <Text style={styles.intro}>Find fælles opgaver med dine naboer, og saml jeres behov ét sted.</Text>
                    <View style={styles.card}>
                        <Text style={styles.title}>{isLogin ? 'Velkommen tilbage' : 'Opret din konto'}</Text>
                        <Text style={styles.subtitle}>{isLogin ? 'Log ind for at komme videre.' : 'Få adgang til fællesskabet i dit nærområde.'}</Text>
                        {!isConfigured && (
                            <Text style={styles.notice} accessibilityRole="alert">
                                Login er endnu ikke klar. Appen mangler forbindelse til sin kontotjeneste.
                            </Text>
                        )}
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input} value={email} onChangeText={setEmail}
                            placeholder="din@email.dk" placeholderTextColor="#687782"
                            keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                            autoComplete="email" accessibilityLabel="E-mail" editable={!busy && isConfigured}
                        />
                        <Text style={styles.label}>Adgangskode</Text>
                        <TextInput
                            key={isLogin ? 'login-password' : 'new-password'}
                            style={styles.input} value={password} onChangeText={setPassword}
                            placeholder={isLogin ? 'Din adgangskode' : 'Mindst 6 tegn'} placeholderTextColor="#687782"
                            secureTextEntry autoCapitalize="none" autoCorrect={false}
                            autoComplete={isLogin ? 'current-password' : 'new-password'}
                            accessibilityLabel="Adgangskode" editable={!busy && isConfigured}
                            onSubmitEditing={isLogin ? submit : undefined}
                        />
                        {!isLogin && (
                            <>
                                <Text style={styles.label}>Gentag adgangskode</Text>
                                <TextInput
                                    style={styles.input} value={confirmation} onChangeText={setConfirmation}
                                    placeholder="Gentag din adgangskode" placeholderTextColor="#687782"
                                    secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete="new-password"
                                    accessibilityLabel="Gentag adgangskode" editable={!busy && isConfigured}
                                    onSubmitEditing={submit}
                                />
                            </>
                        )}
                        {!!error && <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text>}
                        <Pressable
                            style={[styles.primaryButton, (busy || !isConfigured) && styles.disabled]}
                            onPress={submit} disabled={busy || !isConfigured} accessibilityRole="button"
                            accessibilityState={{ disabled: busy || !isConfigured, busy }}
                        >
                            {busy ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>{isLogin ? 'Log ind' : 'Opret bruger'}</Text>}
                        </Pressable>
                        <Pressable style={styles.secondaryButton} onPress={switchMode} disabled={busy} accessibilityRole="button">
                            <Text style={styles.secondaryText}>{isLogin ? 'Ny her? Opret en konto' : 'Har du en konto? Log ind'}</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
