import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Picker, Button } from 'react-native';
import { storeMoodData, getMoodData, updateMoodData, deleteMoodData } from '../utils/storage';
import MoodEntry from '../models/MoodEntry';

const MoodLogScreen = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('');
  const [emotions, setEmotions] = useState([]);
  const [notes, setNotes] = useState('');
  const [moodEntries, setMoodEntries] = useState([]);

  useEffect(() => {
    const fetchMoodData = async () => {
      const data = await getMoodData();
      setMoodEntries(data);
    };
    fetchMoodData();
  }, []);

  const handleLogMood = async () => {
    const newMoodEntry = new MoodEntry(
      Date.now(),
      date,
      mood,
      emotions,
      notes
    );
    await updateMoodData(newMoodEntry.toJSON());
    setMoodEntries([...moodEntries, newMoodEntry.toJSON()]);
    setMood('');
    setEmotions([]);
    setNotes('');
  };

  const handleDeleteMoodEntry = async (id) => {
    await deleteMoodData(id);
    setMoodEntries(moodEntries.filter((entry) => entry.id !== id));
  };

  return (
    <View>
      <Text>Log your mood:</Text>
      <TextInput
        value={date}
        onChangeText={(text) => setDate(text)}
        placeholder="Date"
      />
      <Picker
        selectedValue={mood}
        onValueChange={(itemValue) => setMood(itemValue)}
      >
        <Picker.Item label="Select a mood" value="" />
        <Picker.Item label="Happy" value="happy" />
        <Picker.Item label="Sad" value="sad" />
        <Picker.Item label="Angry" value="angry" />
        <Picker.Item label="Neutral" value="neutral" />
      </Picker>
      <TextInput
        value={notes}
        onChangeText={(text) => setNotes(text)}
        placeholder="Notes"
      />
      <Button title="Log mood" onPress={handleLogMood} />
      <Text>Mood log:</Text>
      {moodEntries.map((entry) => (
        <View key={entry.id}>
          <Text>Date: {entry.date}</Text>
          <Text>Mood: {entry.mood}</Text>
          <Text>Emotions: {entry.emotions.join(', ')}</Text>
          <Text>Notes: {entry.notes}</Text>
          <Button title="Delete" onPress={() => handleDeleteMoodEntry(entry.id)} />
        </View>
      ))}
    </View>
  );
};

export default MoodLogScreen;