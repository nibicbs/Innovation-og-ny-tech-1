import { StatusBar } from 'expo-status-bar';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useOpportunities } from '../context/OpportunitiesContext';
import { formatDeadline } from '../utils/opportunities';
import ButtonComponent from '../components/ButtonComponent';
import DatabaseState, { ConnectionNotice } from '../components/DatabaseState';
import styles from '../styles/HomeScreenStyles';
import dbStyles from '../styles/DatabaseStyles';

export default function HomeScreen({ navigation }) {
    const data = useOpportunities();
    return (
        <View style={styles.container}>
            <Text style={styles.eyebrow}>SAMMEN I NÆROMRÅDET</Text>
            <Text style={styles.title}>Fælles opgaver</Text>
            <Text style={styles.intro}>Saml naboerne, og få virksomheder til at byde på opgaven.</Text>
            <View style={dbStyles.actions}>
                <ButtonComponent title="Opret opgave" onPress={() => navigation.navigate('OpretRedigerOpgave')}
                    disabled={data.loading || !!data.error || !data.connected} />
            </View>
            {data.loading || data.error ? <DatabaseState {...data} /> : (
                <FlatList
                    data={data.opportunities} keyExtractor={(item) => item.id}
                    ListHeaderComponent={<ConnectionNotice connected={data.connected} />}
                    ListEmptyComponent={<Text style={dbStyles.empty}>Der er ingen opgaver endnu. Opret den første fælles opgave.</Text>}
                    renderItem={({ item }) => (
                        <Pressable style={[styles.item, item.isUserParticipating && styles.joinedItem]}
                            accessibilityRole="button"
                            onPress={() => navigation.navigate('OpgaveStack', { screen: 'Opgavedetaljer', params: { opportunityId: item.id } })}>
                            <View style={styles.itemHeader}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                {item.isUserParticipating && <Text style={styles.joinedLabel}>DU ER TILMELDT</Text>}
                            </View>
                            <Text style={styles.itemMeta}>{item.location}</Text>
                            {item.isDemo && <Text style={dbStyles.demo}>Eksempelopgave</Text>}
                            <View style={styles.itemFooter}>
                                <Text style={styles.status}>{item.status}</Text>
                                <Text style={styles.deadline}>{formatDeadline(item.deadlineAt)}</Text>
                            </View>
                        </Pressable>
                    )}
                />
            )}
            <StatusBar style="auto" />
        </View>
    );
}
