import { FlatList, Text, View } from 'react-native';
import styles from '../../styles/UserProfileScreenStyles';

export default function UserProfileScreen({ route }) {
    // Den valgte opgaves adresser sendes med gennem navigationen.
    const opportunity = route.params?.opportunity;
    const participatingHouses = opportunity?.participatingHouses || [];

    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>NABOERNES BIDRAG</Text>
            <Text style={styles.title}>Tilmeldte huse</Text>
            <Text style={styles.text}>
                Disse adresser er med på opgaven:
            </Text>
            <FlatList
                data={participatingHouses}
                keyExtractor={(address) => address}
                renderItem={({ item: address }) => (
                    <View style={styles.addressItem}>
                        <Text style={styles.address}>{address}</Text>
                    </View>
                )}
            />
        </View>
    );
}
