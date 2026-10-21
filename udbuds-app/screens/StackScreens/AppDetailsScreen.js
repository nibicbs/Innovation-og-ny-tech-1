import { ScrollView, Text, View } from 'react-native';
import { useDemo } from '../../context/DemoContext';
import Button from '../../components/ButtonComponent';
import { isOpen } from '../../utils/demo';
import styles from '../../styles/DemoStyles';

export default function AppDetailsScreen({ navigation, route }) {
    const { tasks, profiles, role, profile } = useDemo();
    const task = tasks.find((item) => item.id === route.params?.opportunityId);
    const offers = task?.offerList || [];
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
            title={task.offers[profile.id] ? 'Redigér mit bud' : 'Afgiv et bud'}
            onPress={() => navigation.navigate('Afgiv bud', { opportunityId: task.id })} />}
    </ScrollView>;
}
