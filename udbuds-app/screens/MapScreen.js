import { useState } from 'react';
import { Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import Button from '../components/ButtonComponent';
import TaskMap from '../components/TaskMap';
import { nearbyTasks, isOpen, formatDistance } from '../utils/demo';
import styles from '../styles/DemoStyles';

export default function MapScreen({ navigation }) {
    const { profile, profiles, tasks, role } = useDemo();
    const [selectedId, setSelectedId] = useState(null);
    const nearby = nearbyTasks(tasks, profile).filter((task) => isOpen(task));
    const selected = nearby.find((task) => task.id === selectedId);
    return <View style={styles.screen}>
        <View style={styles.mapInfo}>
            <Text style={styles.heading}>{profile.location}</Text>
            <Text style={styles.small}>{nearby.length} åbne opgaver · {formatDistance(profile.radiusMeters)} fra dig</Text>
        </View>
        <TaskMap profile={profile} profiles={profiles} tasks={nearby} selectedId={selected?.id} onSelect={setSelectedId} />
        {selected && <View style={styles.mapSelected}>
            <Text style={styles.heading}>{selected.title}</Text>
            <Text style={styles.small}>{selected.participantCount} husstande · {formatDistance(selected.distance)} fra dig</Text>
            <Button title={role === 'company' ? 'Se opgave og afgiv bud' : 'Se opgave'}
                onPress={() => navigation.navigate('Opgavedetaljer', { opportunityId: selected.id })} />
        </View>}
    </View>;
}
