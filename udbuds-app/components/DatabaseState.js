import { ActivityIndicator, Text, View } from 'react-native';
import ButtonComponent from './ButtonComponent';
import styles from '../styles/DatabaseStyles';

export default function DatabaseState({ loading, error, retry, missing, connected }) {
    if (error) return <View style={styles.state}><Text style={styles.error}>{error}</Text><ButtonComponent title="Prøv igen" onPress={retry} /></View>;
    if (loading) return <View style={styles.state}><ActivityIndicator color="#2E7D73" /><Text style={styles.text}>{connected ? 'Henter opgaver…' : 'Venter på forbindelse til databasen…'}</Text></View>;
    if (missing) return <View style={styles.state}><Text style={styles.text}>Opgaven findes ikke længere.</Text></View>;
    return null;
}

export function ConnectionNotice({ connected }) {
    return connected ? null : <Text style={styles.notice}>Ingen forbindelse. Viste data kan være ældre. Eventuelle igangværende ændringer afventer forbindelsen.</Text>;
}
