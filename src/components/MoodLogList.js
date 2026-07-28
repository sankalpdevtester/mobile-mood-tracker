import React from 'react';
import { View, Text, FlatList } from 'react-native';
import MoodEntry from '../models/MoodEntry';

const MoodLogList = ({ moodEntries, onDeleteMoodEntry }) => {
  const renderItem = ({ item }) => (
    <View>
      <Text>Date: {item.date}</Text>
      <Text>Mood: {item.mood}</Text>
      <Text>Emotions: {item.emotions.join(', ')}</Text>
      <Text>Notes: {item.notes}</Text>
      <Text>ID: {item.id}</Text>
      <Button title="Delete" onPress={() => onDeleteMoodEntry(item.id)} />
    </View>
  );

  return (
    <FlatList
      data={moodEntries}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default MoodLogList;