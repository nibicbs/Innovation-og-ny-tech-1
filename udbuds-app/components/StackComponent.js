import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from '../screens/DetailsScreen';
import UserProfileScreen from '../screens/StackScreens/UserProfileScreen';
import AppDetailsScreen from '../screens/StackScreens/AppDetailsScreen';

const Stack = createStackNavigator();

export default function StackComponent() {
    // Stack-navigation samler detaljevisningen og opgavens undersider.
    return (
        <Stack.Navigator initialRouteName="Opgavedetaljer">
            <Stack.Screen name="Opgavedetaljer" component={DetailsScreen} />
            <Stack.Screen name="Tilmeldte naboer" component={UserProfileScreen} />
            <Stack.Screen name="Virksomheders bud" component={AppDetailsScreen} />
        </Stack.Navigator>
    );
}
