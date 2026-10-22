import { ScrollView, Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import DemoStatus from '../components/DemoStatus';
import { nearbyTasks, areaSummary, formatDistance } from '../utils/demo';
import styles from '../styles/DemoStyles';

export default function NeighborhoodScreen() {
    const { profile, tasks } = useDemo();
    // Oversigten beregnes kun for opgaver inden for den aktive profils søgeradius.
    if (!profile) return <DemoStatus message="Oplysninger om nærområdet kunne ikke hentes." />;
    const nearby = nearbyTasks(tasks, profile);
    const summary = areaSummary(nearby);
    return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{profile.location}</Text>
        <Text style={styles.text}>Dit nærområde · {formatDistance(profile.radiusMeters)}</Text>
        <View style={styles.card}>
            <Text style={styles.heading}>{summary.openCount} åbne opgaver</Text>
            <Text style={styles.text}>{summary.participantCount} tilmeldinger på tværs af opgaver</Text>
            <Text style={styles.text}>{summary.offerCount} bud fra virksomheder</Text>
        </View>
    </ScrollView>;
}
