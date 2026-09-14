import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View } from 'react-native';

const carBrands = [
    'Audi',
    'BMW',
    'Tesla',
    'Alfa Romeo',
    'Ford',
    'Kia',
    'Rover',
    'Saab',
    'Seat',
    'Skoda',
    'Smart',
    'SsangYong',
    'Subaru',
    'Suzuki',
];

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mine bilmærker</Text>
            <View style={styles.listContainer}>
                <FlatList
                    data={carBrands}
                    renderItem={({ item }) => (
                        <Text style={styles.item}>{item}</Text>
                    )}
                />
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6f8',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 24,
    },
    listContainer: {
        height: 350,
        width: '80%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 10,
    },
    item: { fontSize: 16, padding: 10, textAlign: 'center' },
});
