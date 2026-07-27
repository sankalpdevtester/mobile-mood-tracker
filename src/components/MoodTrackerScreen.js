import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Picker, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MoodTrackerHelper } from '../utils/moodTrackerHelper';
import { MoodCache } from '../utils/moodCache';

const MoodTrackerScreen = () => {
  const navigation = useNavigation();
  const [mood, setMood] = useState('');
  const [emotions, setEmotions] = useState([]);
  const [moodCategories, setMoodCategories] = useState([]);

  useEffect(() => {
    const loadMoodCategories = async () => {
      const categories = await MoodTrackerHelper.getMoodCategories();
      setMoodCategories(categories);
    };
    loadMoodCategories();
  }, []);

  const handleMoodChange = (itemValue) => {
    setMood(itemValue);
  };

  const handleEmotionChange = (emotion) => {
    const newEmotions = [...emotions];
    if (newEmotions.includes(emotion)) {
      newEmotions.splice(newEmotions.indexOf(emotion), 1);
    } else {
      newEmotions.push(emotion);
    }
    setEmotions(newEmotions);
  };

  const handleLogMood = async () => {
    const moodLog = {
      mood,
      emotions,
      timestamp: new Date(),
    };
    await MoodCache.logMood(moodLog);
    navigation.navigate('MoodStatistics');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mood Tracker</Text>
      <Picker
        selectedValue={mood}
        style={styles.picker}
        onValueChange={handleMoodChange}
      >
        {moodCategories.map((category) => (
          <Picker.Item label={category} value={category} key={category} />
        ))}
      </Picker>
      <View style={styles.emotionsContainer}>
        {moodCategories.map((category) => (
          <Button
            key={category}
            title={category}
            onPress={() => handleEmotionChange(category)}
            style={styles.emotionButton}
          />
        ))}
      </View>
      <Button title="Log Mood" onPress={handleLogMood} style={styles.logButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  picker: {
    width: 200,
    height: 50,
    marginBottom: 20,
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emotionButton: {
    margin: 10,
  },
  logButton: {
    marginTop: 20,
  },
});

export default MoodTrackerScreen;