import { ScrollView, Text, View } from 'react-native';
import { useDemo } from '../context/DemoContext';
import { formatDistance } from '../utils/demo';
import styles from '../styles/DemoStyles';

export default function CompanyProfileScreen() {
    const { profiles } = useDemo();
    const company = profiles.company;
    return <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.accent}>LOKAL VIRKSOMHED</Text>
        <Text style={styles.title}>{company.name}</Text>
        <Text style={styles.text}>{company.description}</Text>
        <View style={styles.card}>
            <Text style={styles.heading}>Vi arbejder i dit område</Text>
            <Text style={styles.text}>{company.location} · Dækker en radius på {formatDistance(company.radiusMeters)}</Text>
            <Text style={styles.heading}>Ydelser</Text>
            <Text style={styles.text}>{company.services}</Text>
        </View>
    </ScrollView>;
}
