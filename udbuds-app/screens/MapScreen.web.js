import { Text, View } from 'react-native';
import styles from '../styles/DemoStyles';

export default function MapScreen() {
    return <View style={styles.center}>
        <Text style={styles.heading}>Kortet findes i mobilappen</Text>
        <Text style={styles.text}>Du kan også finde alle opgaver i nærområdet under Opgaver.</Text>
    </View>;
}
