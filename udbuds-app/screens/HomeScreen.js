import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import Button from '../components/ButtonComponent';
import TaskCard from '../components/TaskCard';
import { OfflineNotice } from '../components/DemoStatus';
import { nearbyTasks, customerTasks, formatDistance } from '../utils/demo';
import styles from '../styles/DemoStyles';
import filterStyles from '../styles/HomeScreenStyles';

export default function HomeScreen({ navigation }) {
    const { role, profile, tasks } = useDemo();
    const [filter, setFilter] = useState('available');
    const visibleTasks = role === 'customer'
        ? customerTasks(tasks, profile, filter)
        : nearbyTasks(tasks, profile);
    let emptyMessage = 'Der er endnu ingen opgaver i området.';
    if (role === 'customer') {
        emptyMessage = filter === 'joined'
            ? 'Din husstand er endnu ikke tilmeldt nogen opgaver.'
            : 'Der er ingen nye opgaver, du kan tilmelde dig lige nu.';
    }
    return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>SAMMEN I NÆROMRÅDET</Text>
        <Text style={styles.title}>Fælles opgaver</Text>
        <Text style={styles.text}>{role === 'customer' && filter === 'joined'
            ? 'Din husstands tilmeldinger'
            : `${profile.location} · Inden for ${formatDistance(profile.radiusMeters)}`}</Text>
        <OfflineNotice />
        {role === 'customer' && <View style={filterStyles.bar} accessibilityRole="tablist">
            <Pressable style={[filterStyles.tab, filter === 'available' && filterStyles.selected]}
                accessibilityRole="tab" accessibilityState={{ selected: filter === 'available' }}
                onPress={() => setFilter('available')}>
                <Text style={[filterStyles.text, filter === 'available' && filterStyles.selectedText]}>Kan tilmeldes</Text>
            </Pressable>
            <Pressable style={[filterStyles.tab, filter === 'joined' && filterStyles.selected]}
                accessibilityRole="tab" accessibilityState={{ selected: filter === 'joined' }}
                onPress={() => setFilter('joined')}>
                <Text style={[filterStyles.text, filter === 'joined' && filterStyles.selectedText]}>Tilmeldte</Text>
            </Pressable>
        </View>}
        {role === 'customer' && <Button title="Opret en fælles opgave" onPress={() => navigation.navigate('OpretRedigerOpgave')} />}
        {visibleTasks.map((task) => <TaskCard key={task.id} task={task}
            onPress={() => navigation.navigate('Opgavedetaljer', { opportunityId: task.id })} />)}
        {!visibleTasks.length && <Text style={styles.text}>{emptyMessage}</Text>}
    </ScrollView>;
}
