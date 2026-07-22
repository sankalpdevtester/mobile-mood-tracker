import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [mood, setMood] = useState('');
  const [emotions, setEmotions] = useState([]);

  useEffect(() => {
    const loadEmotions = async () => {
      try {
        const response = await fetch('https://example.com/emotions');
        const data = await response.json();
        setEmotions(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadEmotions();
  }, []);

  const handleMoodChange = (newMood) => {
    setMood(newMood);
  };

  const handleEmotionLog = (emotion) => {
    Alert.alert('Emotion logged:', emotion);
  };

  return (
    <View style={styles.container}>
      <Text>Mood Tracker</Text>
      <Text>Current mood: {mood}</Text>
      <Button title="Happy" onPress={() => handleMoodChange('Happy')} />
      <Button title="Sad" onPress={() => handleMoodChange('Sad')} />
      <Button title="Angry" onPress={() => handleMoodChange('Angry')} />
      <Text>Emotions:</Text>
      {emotions.map((emotion) => (
        <Button key={emotion} title={emotion} onPress={() => handleEmotionLog(emotion)} />
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});