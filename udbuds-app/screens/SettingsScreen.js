import { Switch, Text, View } from 'react-native';
import { useState } from 'react';
import styles from '../styles/SettingsScreenStyles';

export default function SettingsScreen() {
    // Notifikationer er den eneste indstilling, der kan ændres i demoen.
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>INDSTILLINGER</Text>
            <Text style={styles.title}>Din SammenBud</Text>
            <Text style={styles.text}>
                Vælg de oplysninger, der skal bruges til at finde relevante opgaver.
            </Text>
            <View style={styles.settingsList}>
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
        </View>
    );
}
