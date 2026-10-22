import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@react-native-vector-icons/ionicons';
import { DemoProvider, useDemo } from './context/DemoContext';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import MyOpportunitiesScreen from './screens/MyOpportunitiesScreen';
import SettingsScreen from './screens/SettingsScreen';
import DetailsScreen from './screens/DetailsScreen';
import AddEditOpportunityScreen from './screens/AddEditOpportunityScreen';
import UserProfileScreen from './screens/StackScreens/UserProfileScreen';
import AppDetailsScreen from './screens/StackScreens/AppDetailsScreen';
import OfferScreen from './screens/OfferScreen';
import CompanyProfileScreen from './screens/CompanyProfileScreen';
import NeighborhoodScreen from './screens/NeighborhoodScreen';
import styles from './styles/DemoStyles';

// Bundmenuen viser hovedsiderne. Stack åbner detaljer og formularer oven på dem.
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const icons = { Opgaver: 'home-outline', Kort: 'map-outline', 'Mine opgaver': 'clipboard-outline', Profil: 'person-outline' };

// De samme fire faner bruges af både husstanden og virksomheden.
function Tabs() {
    const { role } = useDemo();
    const insets = useSafeAreaInsets();
    return <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#F2BD53',
        tabBarInactiveTintColor: '#C4D3DD',
        // Plads til både labels og telefonens egen navigationsbjælke.
        tabBarStyle: [styles.tabBar, { height: 72 + insets.bottom, paddingBottom: insets.bottom + 10 }],
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size, focused }) => <Ionicons
            name={focused ? icons[route.name].replace('-outline', '') : icons[route.name]}
            size={size} color={color} />,
    })}>
        <Tab.Screen name="Opgaver" component={HomeScreen} />
        <Tab.Screen name="Kort" component={MapScreen} />
        <Tab.Screen name="Mine opgaver" component={MyOpportunitiesScreen}
            options={{ tabBarLabel: role === 'company' ? 'Mine bud' : 'Mine opgaver' }} />
        <Tab.Screen name="Profil" component={SettingsScreen} />
    </Tab.Navigator>;
}

function DemoApp() {
    const { role, setRole, profile } = useDemo();
    // Navigationen virker også, når Firebase ikke kan levere data.
    return <SafeAreaView style={styles.appShell} edges={['top', 'left', 'right']}>
        <StatusBar style="light" />
        <View style={styles.banner}>
            <View style={styles.bannerIdentity}>
                <Text style={styles.welcome}>Velkommen til SamBud{profile ? ',' : ''}</Text>
                {profile && <Text style={styles.bannerName}>{profile.name}</Text>}
            </View>
            <Pressable style={({ pressed }) => [styles.roleSwitch, pressed && styles.pressed]} accessibilityRole="button"
                accessibilityLabel={role === 'customer' ? 'Skift til virksomhed' : 'Skift til privat'}
                onPress={() => setRole(role === 'customer' ? 'company' : 'customer')}>
                <Ionicons name="swap-horizontal-outline" size={16} color="#E1EAF0" />
                <Text style={styles.roleText}>{role === 'customer' ? 'Virksomhed' : 'Privat'}</Text>
            </Pressable>
        </View>
        {/* Rolleskift starter på opgavelisten, så gamle formularer ikke følger med. */}
        <NavigationContainer key={role}>
            <Stack.Navigator screenOptions={{ headerTintColor: '#17324D', headerStyle: { backgroundColor: '#F6F2EA' }, headerShadowVisible: false }}>
                <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                <Stack.Screen name="Opgavedetaljer" component={DetailsScreen} />
                <Stack.Screen name="OpretRedigerOpgave" component={AddEditOpportunityScreen} options={{ title: 'Opret / redigér opgave' }} />
                <Stack.Screen name="Tilmeldte naboer" component={UserProfileScreen} />
                <Stack.Screen name="Virksomheders bud" component={AppDetailsScreen} />
                <Stack.Screen name="Afgiv bud" component={OfferScreen} />
                <Stack.Screen name="Virksomhedsprofil" component={CompanyProfileScreen} />
                <Stack.Screen name="Området" component={NeighborhoodScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaView>;
}

// Gør de fælles data og telefonens skærmkanter tilgængelige i hele appen.
export default function App() {
    return <SafeAreaProvider><DemoProvider><DemoApp /></DemoProvider></SafeAreaProvider>;
}
