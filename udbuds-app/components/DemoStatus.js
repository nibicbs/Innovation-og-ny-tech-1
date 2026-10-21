import { ActivityIndicator, Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import ButtonComponent from './ButtonComponent';
import styles from '../styles/DemoStyles';

export default function DemoStatus() {
    const { error, retry, connected } = useDemo();
    return <View style={[styles.screen, styles.center]}>
        {!error && <ActivityIndicator color="#2E7D73" />}
        <Text style={styles.text}>{error || (connected ? 'Henter opgaver…' : 'Opretter forbindelse…')}</Text>
        {!!error && <ButtonComponent title="Prøv igen" onPress={retry} />}
    </View>;
}

export function OfflineNotice() {
    const { connected } = useDemo();
    return connected ? null : <Text style={styles.notice}>Du er offline. Tilslut internettet for at gemme ændringer.</Text>;
}
