import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import PublicRidesScreen from './src/screens/PublicRidesScreen';
import PrivateRidesScreen from './src/screens/PrivateRidesScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  RidesTabs: { id: string; username: string };
  CreateEvent: { id: string; username: string };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const RidesTabs: React.FC<{ route: any }> = ({ route }) => {
  const { id, username } = route.params || {}; // Safely access params
    console.log('RidesTabs route params:', route.params);
  return (
    <Tab.Navigator>
      <Tab.Screen name="Public Rides" component={PublicRidesScreen} />
      <Tab.Screen name="Private Rides">
        {() => <PrivateRidesScreen route={{ params: { id, username } }} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen
          name="RidesTabs"
          component={RidesTabs}
          options={({ route, navigation }) => ({
            title: 'Rides',
            headerRight: () => {
              const { id, username } = route.params || {}; // Safely access params
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('CreateEvent', { id, username })}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ color: 'blue' }}>Create Ride</Text>
                </TouchableOpacity>
              );
            },
          })}
        />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
