import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import Button from '../components/ButtonComponent';
import TaskCard from '../components/TaskCard';
import DemoStatus, { OfflineNotice } from '../components/DemoStatus';
import { nearbyTasks, customerTasks, formatDistance } from '../utils/demo';
import styles from '../styles/DemoStyles';
import filterStyles from '../styles/HomeScreenStyles';

export default function HomeScreen({ navigation }) {
    const { role, profile, tasks, canWrite } = useDemo();
    const [filter, setFilter] = useState('available');
    // Husstanden vælger mellem nye opgaver og egne tilmeldinger. Virksomheden ser nærområdet.
    let visibleTasks;
    if (!profile) {
        visibleTasks = [];
    } else if (role === 'customer') {
        visibleTasks = customerTasks(tasks, profile, filter);
    } else {
        visibleTasks = nearbyTasks(tasks, profile);
    }
    // Tilpas beskeden til det filter, der gav en tom liste.
    let emptyMessage = 'Der er endnu ingen opgaver i området.';
    if (role === 'customer') {
        emptyMessage = filter === 'joined'
            ? 'Din husstand er endnu ikke tilmeldt nogen opgaver.'
            : 'Der er ingen nye opgaver, du kan tilmelde dig lige nu.';
    }
    let subtitle = 'Find fælles opgaver i dit nærområde.';
    if (profile) subtitle = `${profile.location} · Inden for ${formatDistance(profile.radiusMeters)}`;
    if (role === 'customer' && filter === 'joined') subtitle = 'Din husstands tilmeldinger';
    // Hvert opgavekort åbner detaljesiden med opgavens ID.
    // FlatList viser opgaverne som i undervisningens liste- og Firebase-eksempler.
    return <FlatList
        style={styles.screen}
        contentContainerStyle={styles.content}
        data={visibleTasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => <TaskCard task={item}
            onPress={() => navigation.navigate('Opgavedetaljer', { opportunityId: item.id })} />}
        ListEmptyComponent={profile ? <Text style={styles.text}>{emptyMessage}</Text>
            : <DemoStatus compact message="Opgaverne kunne ikke hentes." />}
        ListHeaderComponent={<>
            <Text style={styles.eyebrow}>SAMMEN I NÆROMRÅDET</Text>
            <Text style={styles.title}>Fælles opgaver</Text>
            <Text style={styles.text}>{subtitle}</Text>
            {profile && <OfflineNotice />}
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
            {role === 'customer' && <Button title="Opret en fælles opgave" disabled={!canWrite}
                onPress={() => navigation.navigate('OpretRedigerOpgave')} />}
        </>}
    />;
}
