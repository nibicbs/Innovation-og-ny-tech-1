import { useState } from 'react';
import { Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import Button from '../components/ButtonComponent';
import TaskMap from '../components/TaskMap';
import DemoStatus, { OfflineNotice } from '../components/DemoStatus';
import { nearbyTasks, isOpen, formatDistance } from '../utils/demo';
import styles from '../styles/DemoStyles';

export default function MapScreen({ navigation }) {
    const { profile, profiles, tasks, role } = useDemo();
    // Et tryk på en markør gemmer ID og viser et kort resumé under kortet.
    const [selectedId, setSelectedId] = useState(null);
    // Kortet viser kun åbne opgaver i den aktive profils nærområde.
    const nearby = profile ? nearbyTasks(tasks, profile).filter((task) => isOpen(task)) : [];
    const selected = nearby.find((task) => task.id === selectedId);
    return <View style={styles.screen}>
        <View style={styles.mapInfo}>
            <Text style={styles.heading}>{profile ? profile.location : 'Kort over Frederiksberg'}</Text>
            {profile ? <>
                <Text style={styles.small}>{nearby.length} åbne opgaver · {formatDistance(profile.radiusMeters)} fra dig</Text>
                <OfflineNotice />
            </> : <DemoStatus compact message="Opgaver på kortet kunne ikke hentes." />}
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
