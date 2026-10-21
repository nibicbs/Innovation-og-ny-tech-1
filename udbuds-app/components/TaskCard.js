import { Pressable, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useDemo } from '../context/DemoContext';
import { formatDistance, isOpen } from '../utils/demo';
import styles from '../styles/DemoStyles';

export default function TaskCard({ task, onPress }) {
    const { profiles, role } = useDemo();
    const joined = role === 'customer' && task.participants[profiles.customer.id];
    const open = isOpen(task);
    return <Pressable style={({ pressed }) => [styles.card, joined && styles.joined, pressed && styles.pressed]}
        onPress={onPress} accessibilityRole="button">
        <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Ionicons name="chevron-forward-outline" size={16} color="#86969F" />
        </View>
        <Text style={styles.cardMeta}>{task.location} · {formatDistance(task.distance)}</Text>
        <Text style={styles.cardMeta}>{task.participantCount} husstande · {task.offerCount} bud</Text>
        <View style={styles.cardFooter}>
            <Text style={[styles.taskStatus, !open && styles.closedStatus]}>{open ? 'Åben for bud' : 'Lukket'}</Text>
            <Text style={styles.cardMeta}>Frist {task.deadlineLabel}</Text>
        </View>
        {joined && <Text style={styles.membership}>✓ Din husstand er tilmeldt</Text>}
        {role === 'company' && task.offers[profiles.company.id] && <Text style={styles.membership}>✓ Bud afgivet</Text>}
    </Pressable>;
}
