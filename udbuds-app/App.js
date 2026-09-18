import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@react-native-vector-icons/ionicons';
import HomeScreen from './screens/HomeScreen';
import NeighborhoodScreen from './screens/NeighborhoodScreen';
import SettingsScreen from './screens/SettingsScreen';
import StackNavigation from './components/StackComponent';

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
          } else if (route.name === 'Min vej') {
            iconName = focused ? 'people' : 'people-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Opgaver" component={HomeScreen} />
      <Tab.Screen name="Min vej" component={NeighborhoodScreen} />
      <Tab.Screen name="Indstillinger" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      {/* RootStack åbner opgavedetaljer oven på bundmenuen. */}
      <RootStack.Navigator>
        <RootStack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="OpgaveStack"
          component={StackNavigation}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
