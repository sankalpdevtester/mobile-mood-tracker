import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { calculateMoodStatistics, getMoodTrend } from '../utils/moodStatisticsHelper';

const MoodStatisticsScreen = () => {
  const navigation = useNavigation();
  const [moodStatistics, setMoodStatistics] = useState({});
  const [moodTrend, setMoodTrend] = useState([]);

  useEffect(() => {
    const loadMoodStatistics = async () => {
      const statistics = await calculateMoodStatistics();
      setMoodStatistics(statistics);
    };
    loadMoodStatistics();

    const loadMoodTrend = async () => {
      const trend = await getMoodTrend();
      setMoodTrend(trend);
    };
    loadMoodTrend();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mood Statistics</Text>
      <View style={styles.statisticsContainer}>
        {Object.keys(moodStatistics.moodCounts).map((mood) => (
          <Text key={mood}>
            {mood}: {moodStatistics.moodCounts[mood]}
          </Text>
        ))}
      </View>
      <View style={styles.emotionStatisticsContainer}>
        {Object.keys(moodStatistics.emotionCounts).map((emotion) => (
          <Text key={emotion}>
            {emotion}: {moodStatistics.emotionCounts[emotion]}
          </Text>
        ))}
      </View>
      <View style={styles.trendContainer}>
        {moodTrend.map((trend, index) => (
          <Text key={index}>
            {trend.mood} on {trend.timestamp.toLocaleDateString()}
          </Text>
        ))}
      </View>
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
  statisticsContainer: {
    marginBottom: 20,
  },
  emotionStatisticsContainer: {
    marginBottom: 20,
  },
  trendContainer: {
    marginBottom: 20,
  },
});

export default MoodStatisticsScreen;