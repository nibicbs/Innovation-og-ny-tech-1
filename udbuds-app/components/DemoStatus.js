import { ActivityIndicator, Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import ButtonComponent from './ButtonComponent';
import styles from '../styles/DemoStyles';

// Samme korte besked genbruges på sider, der mangler data fra Firebase.
export default function DemoStatus({ message = 'Oplysningerne kunne ikke hentes.', compact = false }) {
    const { error, retry, loading } = useDemo();
    return <View style={compact ? styles.card : [styles.screen, styles.center]}>
        {loading && <ActivityIndicator color="#2E7D73" />}
        <Text style={styles.text}>{loading ? 'Henter oplysninger…' : message}</Text>
        {!!error && <Text style={styles.small}>{error}</Text>}
        {!loading && <ButtonComponent title="Prøv igen" onPress={retry} />}
    </View>;
}

// Skærmene kan vise denne besked, når forbindelsen til databasen mangler.
export function OfflineNotice() {
    const { connected } = useDemo();
    return connected ? null : <Text style={styles.notice}>Ingen forbindelse til databasen. Ændringer kan ikke gemmes.</Text>;
}
