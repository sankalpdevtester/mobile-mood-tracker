import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MoodTrackerScreen from '../components/MoodTrackerScreen';
import MoodStatisticsScreen from '../screens/MoodStatisticsScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MoodTracker" component={MoodTrackerScreen} />
        <Stack.Screen name="MoodStatistics" component={MoodStatisticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;