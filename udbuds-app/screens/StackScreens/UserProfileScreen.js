import { FlatList, Text, View } from 'react-native';
import styles from '../../styles/UserProfileScreenStyles';

export default function UserProfileScreen({ route }) {
    // Deltagerne vises anonymt, så listen ikke indeholder personlige adresser.
    const opportunity = route.params?.opportunity;
    const participatingNeighbors = opportunity?.participatingNeighbors || [];

    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>TILMELDTE NABOER</Text>
            <Text style={styles.title}>Tilmeldte naboer</Text>
            <Text style={styles.text}>
                Deltagerne vises anonymt af hensyn til privatliv.
            </Text>
            <FlatList
                data={participatingNeighbors}
                keyExtractor={(neighbor) => neighbor}
                renderItem={({ item: neighbor }) => (
                    <View style={styles.addressItem}>
                        <Text style={styles.address}>{neighbor}</Text>
                        <Text style={styles.status}>Tilmeldt opgaven</Text>
                    </View>
                )}
            />
        </View>
    );
}
