import { ScrollView, Text } from 'react-native';
import { useDemo } from '../context/DemoContext';
import TaskCard from '../components/TaskCard';
import styles from '../styles/DemoStyles';

export default function MyOpportunitiesScreen({ navigation }) {
    const { tasks, role, profile } = useDemo();
    const mine = tasks.filter((task) => role === 'company'
        ? task.offers[profile.id] : task.ownerId === profile.id || task.participants[profile.id]);
    return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{role === 'company' ? 'Mine bud' : 'Mine opgaver'}</Text>
        <Text style={styles.text}>{role === 'company' ? 'Opgaver, hvor din virksomhed har afgivet et bud.' : 'Opgaver, du har oprettet eller tilmeldt din husstand.'}</Text>
        {mine.map((task) => <TaskCard key={task.id} task={task}
            onPress={() => navigation.navigate('Opgavedetaljer', { opportunityId: task.id })} />)}
        {!mine.length && <Text style={styles.notice}>Her er endnu ingen opgaver. Find en under Opgaver eller Kort.</Text>}
    </ScrollView>;
}
