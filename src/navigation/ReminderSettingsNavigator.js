import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ReminderSettingsScreen from '../screens/ReminderSettingsScreen';

const Stack = createStackNavigator();

const ReminderSettingsNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Reminder Settings" component={ReminderSettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ReminderSettingsNavigator;