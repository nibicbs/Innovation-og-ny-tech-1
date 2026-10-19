import { ScrollView, Text, View } from 'react-native';
import { useOpportunities } from '../context/OpportunitiesContext';
import { canJoinOpportunity } from '../utils/opportunities';
import DatabaseState, { ConnectionNotice } from '../components/DatabaseState';
import styles from '../styles/NeighborhoodScreenStyles';

export default function NeighborhoodScreen() {
    const data = useOpportunities();
    if (data.loading || data.error) return <DatabaseState {...data} />;
    const realTasks = data.opportunities.filter((task) => !task.isDemo);
    const activeTasks = realTasks.filter((task) => canJoinOpportunity(task));
    const participants = new Set(realTasks.flatMap((task) => task.participants.filter((p) => !p.isDemo).map((p) => p.id)));
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.eyebrow}>FÆLLESSKABET</Text>
            <Text style={styles.title}>Fælles overblik</Text>
            <Text style={styles.text}>Aktivitet på tværs af appens områder. Eksempelopgaver er ikke medregnet.</Text>
            <ConnectionNotice connected={data.connected} />
            <View style={styles.summary}><Text style={styles.summaryNumber}>{participants.size}</Text><Text style={styles.summaryLabel}>brugere tilmeldt fælles opgaver</Text></View>
            <View style={styles.summary}><Text style={styles.summaryNumber}>{activeTasks.length}</Text><Text style={styles.summaryLabel}>opgaver med åben tilmelding</Text></View>
        </ScrollView>
    );
}
