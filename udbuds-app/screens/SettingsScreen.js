import { ScrollView, Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import Button from '../components/ButtonComponent';
import { formatDistance } from '../utils/demo';
import styles from '../styles/DemoStyles';

export default function SettingsScreen({ navigation }) {
    const { profile, role } = useDemo();
    return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Min profil</Text>
        <View style={styles.card}>
            <Text style={styles.heading}>{profile.name}</Text>
            <Text style={styles.text}>{role === 'customer' ? profile.housingType : profile.industry}</Text>
            <Text style={styles.text}>{profile.address}</Text>
            <Text style={styles.text}>{profile.location}</Text>
            <Text style={styles.text}>Område: {formatDistance(profile.radiusMeters)}</Text>
        </View>
        <Button variant="secondary" title="Mit nærområde" onPress={() => navigation.navigate('Området')} />
        {role === 'company' && <Button variant="secondary" title="Virksomhedsprofil" onPress={() => navigation.navigate('Virksomhedsprofil')} />}
    </ScrollView>;
}
