import { StyleSheet, Text, View } from 'react-native';

export default function UserProfileScreen() {
    return (
        <View style={styles.container}>
            <Text>Welcome to the User Profile Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 10,
        borderColor: 'yellow',
    },
});
