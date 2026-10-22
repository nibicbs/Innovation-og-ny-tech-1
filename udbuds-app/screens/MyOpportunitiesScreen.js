import { FlatList, Text } from 'react-native';
import { useDemo } from '../context/DemoContext';
import TaskCard from '../components/TaskCard';
import DemoStatus, { OfflineNotice } from '../components/DemoStatus';
import styles from '../styles/DemoStyles';

export default function MyOpportunitiesScreen({ navigation }) {
    const { tasks, role, profile } = useDemo();
    // Husstanden ser oprettede og tilmeldte opgaver; virksomheden ser sine afgivne bud.
    let mine;
    if (!profile) {
        mine = [];
    } else if (role === 'company') {
        mine = tasks.filter((task) => task.offers[profile.id]);
    } else {
        mine = tasks.filter((task) => task.ownerId === profile.id || task.participants[profile.id]);
    }

    return <FlatList
        style={styles.screen}
        contentContainerStyle={styles.content}
        data={mine}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => <TaskCard task={item}
            onPress={() => navigation.navigate('Opgavedetaljer', { opportunityId: item.id })} />}
        ListHeaderComponent={<>
            <Text style={styles.title}>{role === 'company' ? 'Mine bud' : 'Mine opgaver'}</Text>
            <Text style={styles.text}>{role === 'company' ? 'Opgaver, hvor din virksomhed har afgivet et bud.' : 'Opgaver, du har oprettet eller tilmeldt din husstand.'}</Text>
            {profile && <OfflineNotice />}
        </>}
        ListEmptyComponent={profile ? <Text style={styles.notice}>Her er endnu ingen opgaver. Find en under Opgaver eller Kort.</Text>
            : <DemoStatus compact message={role === 'company' ? 'Dine bud kunne ikke hentes.' : 'Dine opgaver kunne ikke hentes.'} />}
    />;
}
