import { FlatList, Text, View } from 'react-native';
import { useOpportunity } from '../../context/OpportunitiesContext';
import DatabaseState, { ConnectionNotice } from '../../components/DatabaseState';
import styles from '../../styles/UserProfileScreenStyles';
import dbStyles from '../../styles/DatabaseStyles';

export default function UserProfileScreen({ route }) {
    const data = useOpportunity(route.params?.opportunityId);
    if (data.loading || data.error || !data.opportunity) return <DatabaseState {...data} missing={!data.opportunity} />;
    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>TILMELDTE NABOER</Text>
            <Text style={styles.title}>Tilmeldte naboer</Text>
            <Text style={styles.text}>Deltagerne vises uden navn, e-mail eller adresse.</Text>
            <ConnectionNotice connected={data.connected} />
            <FlatList data={data.opportunity.participants} keyExtractor={(participant) => participant.id}
                ListEmptyComponent={<Text style={dbStyles.empty}>Ingen har tilmeldt sig endnu.</Text>}
                renderItem={({ item }) => (
                    <View style={styles.addressItem}>
                        <Text style={styles.address}>{item.label}</Text>
                        <Text style={styles.status}>{item.isDemo ? 'Eksempel fra prototypen' : 'Tilmeldt opgaven'}</Text>
                    </View>
                )}
            />
        </View>
    );
}
