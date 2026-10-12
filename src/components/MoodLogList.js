import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const MOOD_COLORS = {
  great: '#52d6b5',
  good: '#87c98a',
  okay: '#e8c56b',
  low: '#e79b75',
  rough: '#df7e8d',
};
const MOOD_LABELS = { great: 'Great', good: 'Good', okay: 'Okay', low: 'Low', rough: 'Rough' };

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function MoodLogList({ moodEntries = [], onDeleteMoodEntry }) {
  return (
    <View>
      {moodEntries.map((entry) => (
        <View key={String(entry.id)} style={styles.entry}>
          <View style={styles.entryHeader}>
            <View style={styles.moodLine}>
              <View style={[styles.dot, { backgroundColor: MOOD_COLORS[entry.mood] || '#67dfc2' }]} />
              <Text style={styles.mood}>{MOOD_LABELS[entry.mood] || entry.mood}</Text>
            </View>
            <Text style={styles.date}>{formatDate(entry.date)}</Text>
          </View>
          {Array.isArray(entry.emotions) && entry.emotions.length > 0 ? <Text style={styles.detail}>{entry.emotions.join(' · ')}</Text> : null}
          {entry.notes ? <Text style={styles.notes}>{entry.notes}</Text> : null}
          <Pressable accessibilityRole="button" onPress={() => onDeleteMoodEntry(entry.id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete entry</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  entry: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#2a3950' },
  entryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  moodLine: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5, marginRight: 9 },
  mood: { color: '#edf2f8', fontSize: 15, fontWeight: '700' },
  date: { color: '#a0afc2', fontSize: 12 },
  detail: { color: '#67dfc2', fontSize: 12, marginTop: 8 },
  notes: { color: '#d5deea', fontSize: 13, lineHeight: 19, marginTop: 8 },
  deleteButton: { alignSelf: 'flex-start', paddingVertical: 8, marginTop: 4 },
  deleteText: { color: '#df9298', fontSize: 12, fontWeight: '700' },
});
