/**
 * Mood Tracker Helper Utility
 * 
 * This utility provides functions for calculating mood statistics and trends.
 * It integrates with the existing App.js file and can be used to enhance the user experience.
 */

// Import required modules
import { AsyncStorage } from 'react-native';

// Define constants for mood types
const MOOD_TYPES = {
  HAPPY: 'happy',
  SAD: 'sad',
  NEUTRAL: 'neutral',
  ANGRY: 'angry',
  FEARFUL: 'fearful'
};

// Define a function to calculate the average mood
async function calculateAverageMood() {
  try {
    // Get all mood entries from storage
    const moodEntries = await AsyncStorage.getItem('moodEntries');
    const parsedMoodEntries = JSON.parse(moodEntries);

    // Calculate the sum of all mood ratings
    let sum = 0;
    parsedMoodEntries.forEach(entry => {
      sum += entry.rating;
    });

    // Calculate the average mood rating
    const averageMood = sum / parsedMoodEntries.length;

    return averageMood;
  } catch (error) {
    console.error('Error calculating average mood:', error);
    return null;
  }
}

// Define a function to calculate the most common mood
async function calculateMostCommonMood() {
  try {
    // Get all mood entries from storage
    const moodEntries = await AsyncStorage.getItem('moodEntries');
    const parsedMoodEntries = JSON.parse(moodEntries);

    // Create a dictionary to store the count of each mood type
    const moodCounts = {};
    parsedMoodEntries.forEach(entry => {
      if (moodCounts[entry.type]) {
        moodCounts[entry.type]++;
      } else {
        moodCounts[entry.type] = 1;
      }
    });

    // Find the mood type with the highest count
    let maxCount = 0;
    let mostCommonMood = null;
    Object.keys(moodCounts).forEach(moodType => {
      if (moodCounts[moodType] > maxCount) {
        maxCount = moodCounts[moodType];
        mostCommonMood = moodType;
      }
    });

    return mostCommonMood;
  } catch (error) {
    console.error('Error calculating most common mood:', error);
    return null;
  }
}

// Define a function to calculate the mood trend
async function calculateMoodTrend() {
  try {
    // Get all mood entries from storage
    const moodEntries = await AsyncStorage.getItem('moodEntries');
    const parsedMoodEntries = JSON.parse(moodEntries);

    // Sort the mood entries by date
    parsedMoodEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate the trend by comparing the last 3 mood entries
    const lastThreeEntries = parsedMoodEntries.slice(-3);
    const trend = lastThreeEntries[0].rating < lastThreeEntries[1].rating && lastThreeEntries[1].rating < lastThreeEntries[2].rating ? 'improving' : lastThreeEntries[0].rating > lastThreeEntries[1].rating && lastThreeEntries[1].rating > lastThreeEntries[2].rating ? 'declining' : 'stable';

    return trend;
  } catch (error) {
    console.error('Error calculating mood trend:', error);
    return null;
  }
}

// Export the helper functions
export {
  calculateAverageMood,
  calculateMostCommonMood,
  calculateMoodTrend,
  MOOD_TYPES
};