import { Text, View } from 'react-native';
import styles from '../../styles/AppDetailsScreenStyles';

export default function AppDetailsScreen() {
    // Budsiden er foreløbig en statisk pladsholder for virksomheders tilbud.
    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>VIRKSOMHEDERS BUD</Text>
            <Text style={styles.title}>Der er endnu ingen bud</Text>
            <Text style={styles.text}>
                Virksomheder i nærheden kan se opgaven og sende deres pris samlet.
            </Text>
        </View>
    );
}
