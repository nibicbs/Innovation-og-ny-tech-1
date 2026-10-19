import { FlatList, Pressable, Text, View } from 'react-native';
import { useOpportunities } from '../context/OpportunitiesContext';
import { useAuth } from '../context/AuthContext';
import { formatDeadline } from '../utils/opportunities';
import DatabaseState, { ConnectionNotice } from '../components/DatabaseState';
import styles from '../styles/HomeScreenStyles';
import dbStyles from '../styles/DatabaseStyles';

export default function MyOpportunitiesScreen({ navigation }) {
    const data = useOpportunities();
    const { user } = useAuth();
    if (data.loading || data.error) return <DatabaseState {...data} />;
    const tasks = data.opportunities.filter((task) => task.ownerId === user.uid || task.isUserParticipating);
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mine opgaver</Text>
            <Text style={styles.intro}>Opgaver, du har oprettet eller tilmeldt dig.</Text>
            <FlatList data={tasks} keyExtractor={(task) => task.id}
                ListHeaderComponent={<ConnectionNotice connected={data.connected} />}
                ListEmptyComponent={<Text style={dbStyles.empty}>Du har ingen opgaver endnu. Find en fælles opgave, eller opret din egen under Opgaver.</Text>}
                renderItem={({ item }) => (
                    <Pressable style={styles.item} accessibilityRole="button"
                        onPress={() => navigation.navigate('OpgaveStack', { screen: 'Opgavedetaljer', params: { opportunityId: item.id } })}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemMeta}>{item.location} · {item.status}</Text>
                        <Text style={styles.status}>{item.ownerId === user.uid ? 'Du har oprettet opgaven' : 'Du er tilmeldt'}</Text>
                        {item.ownerId === user.uid && <Text style={styles.itemMeta}>{item.isUserParticipating ? 'Du deltager også' : 'Du er ikke tilmeldt'}</Text>}
                        <Text style={styles.itemMeta}>{formatDeadline(item.deadlineAt)}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}
