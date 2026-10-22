import { ScrollView, Text, View } from 'react-native';
import { useDemo } from '../../context/DemoContext';
import DemoStatus from '../../components/DemoStatus';
import Button from '../../components/ButtonComponent';
import { isOpen } from '../../utils/demo';
import styles from '../../styles/DemoStyles';

// Denne skærm viser virksomheders bud på én opgave, selv om filnavnet er fra første version.
export default function AppDetailsScreen({ navigation, route }) {
    const { tasks, profiles, role, profile, canWrite } = useDemo();
    const task = tasks.find((item) => item.id === route.params?.opportunityId);
    // Listen er allerede klargjort med danske priser i utils/demo.js.
    const offers = task?.offerList || [];
    if (!profile) return <DemoStatus message="Buddene kunne ikke hentes." />;
    return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Virksomheders bud</Text>
        <Text style={styles.text}>{task?.title}</Text>
        {!offers.length && <Text style={styles.notice}>Opgaven venter på sit første bud fra en virksomhed.</Text>}
        {offers.map((offer) => <View key={offer.id} style={styles.card}>
            <Text style={styles.heading}>{offer.id === profiles.company.id ? profiles.company.name : 'Virksomhed'}</Text>
            <Text style={styles.price}>{offer.priceLabel}</Text>
            <Text style={styles.accent}>Pr. husstand · inkl. moms</Text>
            <Text style={styles.text}>{offer.description}</Text>
            <Button variant="secondary" title="Se virksomheden" onPress={() => navigation.navigate('Virksomhedsprofil')} />
        </View>)}
        {role === 'company' && isOpen(task) && task.distance <= profile.radiusMeters && <Button
            disabled={!canWrite}
            title={task.offers[profile.id] ? 'Redigér mit bud' : 'Afgiv et bud'}
            onPress={() => navigation.navigate('Afgiv bud', { opportunityId: task.id })} />}
    </ScrollView>;
}
