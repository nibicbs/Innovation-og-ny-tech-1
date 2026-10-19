import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import HomeScreen from './screens/HomeScreen';
import NeighborhoodScreen from './screens/NeighborhoodScreen';
import SettingsScreen from './screens/SettingsScreen';
import StackNavigation from './components/StackComponent';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './screens/AuthScreen';
import authStyles from './styles/AuthScreenStyles';
import { OpportunitiesProvider } from './context/OpportunitiesContext';
import AddEditOpportunityScreen from './screens/AddEditOpportunityScreen';
import MyOpportunitiesScreen from './screens/MyOpportunitiesScreen';

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

// Bundmenuen samler appens tre hovedområder.
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#17324D',
        },
        headerTitleStyle: {
          color: '#FFFFFF',
          fontSize: 20,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: '#17324D',
          borderTopWidth: 0,
          paddingBottom: 10,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#F0B44D',
        tabBarInactiveTintColor: '#B9C7D3',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === 'Opgaver') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Overblik') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Mine opgaver') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Opgaver" component={HomeScreen} />
      <Tab.Screen name="Mine opgaver" component={MyOpportunitiesScreen} />
      <Tab.Screen name="Overblik" component={NeighborhoodScreen} />
      <Tab.Screen name="Indstillinger" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function SignedInNavigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
        <RootStack.Screen name="OpgaveStack" component={StackNavigation} options={{ headerShown: false }} />
        <RootStack.Screen name="OpretRedigerOpgave" component={AddEditOpportunityScreen}
          options={({ route }) => ({ title: route.params?.opportunityId ? 'Redigér opgave' : 'Opret opgave' })} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function AppNavigation() {
  const { user, loading, sessionError, retrySession } = useAuth();

  if (loading) {
    return (
      <View style={authStyles.loading}>
        <ActivityIndicator size="large" color="#2E7D73" />
        <Text style={authStyles.subtitle}>Henter din konto…</Text>
      </View>
    );
  }

  if (sessionError) {
    return (
      <View style={authStyles.loading}>
        <Text style={authStyles.error}>Din konto kunne ikke hentes. Prøv igen.</Text>
        <Pressable style={authStyles.primaryButton} onPress={retrySession} accessibilityRole="button">
          <Text style={authStyles.primaryText}>Prøv igen</Text>
        </Pressable>
      </View>
    );
  }

  // Et kontoskift fjerner alle lyttere, data og tidligere navigation fra den gamle konto.
  return user ? (
    <OpportunitiesProvider key={user.uid}>
      <SignedInNavigation />
    </OpportunitiesProvider>
  ) : <AuthScreen />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
