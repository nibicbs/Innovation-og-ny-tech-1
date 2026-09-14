import { StyleSheet, Text, View } from 'react-native';

export default function AppDetailsScreen() {
    return (
        <View style={styles.container}>
            <Text>Welcome to the App Details Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 10,
        borderColor: 'red',
    },
});
