import { Text, View } from 'react-native';
import styles from '../styles/NeighborhoodScreenStyles';

export default function NeighborhoodScreen() {
    // Område-fanen samler enkle nøgletal for brugerens vej.
    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>MIT OMRÅDE</Text>
            <Text style={styles.title}>Solvænget</Text>
            <Text style={styles.text}>
                Her kan du se, hvordan din vej bruger SammenBud.
            </Text>
            <View style={styles.summary}>
                <Text style={styles.summaryNumber}>10</Text>
                <Text style={styles.summaryLabel}>naboer i dit område</Text>
            </View>
            <View style={styles.summary}>
                <Text style={styles.summaryNumber}>3</Text>
                <Text style={styles.summaryLabel}>aktive fælles opgaver</Text>
            </View>
        </View>
    );
}
