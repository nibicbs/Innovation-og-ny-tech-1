import { ActivityIndicator, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../database/firebase';
import { useAuth } from '../context/AuthContext';
import { getAuthErrorMessage } from '../utils/authErrors';
import styles from '../styles/SettingsScreenStyles';

export default function SettingsScreen() {
    const { user } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState('');

    const logout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        setLogoutError('');
        try {
            await signOut(auth);
        } catch (error) {
            setLogoutError(getAuthErrorMessage(error));
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.eyebrow}>INDSTILLINGER</Text>
            <Text style={styles.title}>Din SammenBud</Text>
            <Text style={styles.text}>
                Vælg de oplysninger, der skal bruges til at finde relevante opgaver.
            </Text>
            <View style={styles.settingsList}>
                <View style={styles.settingRow}>
                    <View style={styles.account}>
                        <Text style={styles.settingLabel}>Logget ind som</Text>
                        <Text style={styles.settingValue}>{user?.email}</Text>
                    </View>
                </View>
                <View style={styles.settingRow}>
                    <View>
                        <Text style={styles.settingLabel}>Din vej</Text>
                        <Text style={styles.settingValue}>Solvænget</Text>
                    </View>
                </View>
                <View style={styles.settingRow}>
                    <View>
                        <Text style={styles.settingLabel}>Søgeradius</Text>
                        <Text style={styles.settingValue}>1 km</Text>
                    </View>
                </View>
                <View style={styles.settingRow}>
                    <View>
                        <Text style={styles.settingLabel}>Nye bud og opgaver</Text>
                        <Text style={styles.settingValue}>Notifikationer</Text>
                    </View>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#D4D9DC', true: '#8BBDB5' }}
                        thumbColor={notificationsEnabled ? '#2E7D73' : '#FFFFFF'}
                    />
                </View>
            </View>
            {!!logoutError && <Text style={styles.error} accessibilityRole="alert">{logoutError}</Text>}
            <Pressable
                style={[styles.logoutButton, loggingOut && styles.disabled]}
                onPress={logout} disabled={loggingOut} accessibilityRole="button"
                accessibilityState={{ disabled: loggingOut, busy: loggingOut }}
            >
                {loggingOut ? <ActivityIndicator color="#17324D" /> : <Text style={styles.logoutText}>Log ud</Text>}
            </Pressable>
        </ScrollView>
    );
}
