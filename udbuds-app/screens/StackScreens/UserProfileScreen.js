import { ScrollView, Text, View } from 'react-native';
import { useDemo } from '../../context/DemoContext';
import DemoStatus from '../../components/DemoStatus';
import styles from '../../styles/DemoStyles';

// Denne skærm viser tilmeldte husstande, ikke en enkelt brugerprofil.
export default function UserProfileScreen({ route }) {
    const { tasks, profile, role } = useDemo();
    const task = tasks.find((item) => item.id === route.params?.opportunityId);
    // ID bruges til at markere den aktive husstand og den, der oprettede opgaven.
    if (!profile) return <DemoStatus message="De tilmeldte husstande kunne ikke hentes." />;
    return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tilmeldte husstande</Text>
        <Text style={styles.text}>{task?.title}</Text>
        {(task?.participantList || []).map(({ id, ...person }) => <View key={id} style={styles.card}>
            <Text style={styles.heading}>{person.name}{role === 'customer' && id === profile.id ? ' (dig)' : ''}</Text>
            <Text style={styles.small}>{task.ownerId === id ? 'Har oprettet opgaven' : 'Tilmeldt opgaven'} · 1 husstand</Text>
        </View>)}
        {!task?.participantCount && <Text style={styles.text}>Der er ingen tilmeldte husstande.</Text>}
    </ScrollView>;
}
