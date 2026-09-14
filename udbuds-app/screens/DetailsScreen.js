import { StyleSheet, Text, View } from 'react-native';
import ButtonComponent from '../components/ButtonComponent';

const navController = (navigation, route) => {
    navigation.navigate(route);
};

export default function DetailsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Welcome to the Details Screen</Text>
            <ButtonComponent
                onPress={() => navController(navigation, 'User Profile')}
                title="User Profile"
            />
            <ButtonComponent
                onPress={() => navController(navigation, 'App Details')}
                title="App Details"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
});
