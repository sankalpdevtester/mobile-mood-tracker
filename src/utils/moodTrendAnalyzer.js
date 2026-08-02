/**
 * Mood Trend Analyzer utility
 * 
 * This module provides functions to analyze user mood data and identify trends.
 * It integrates with the existing moodTrackerHelper and moodStatisticsHelper modules.
 */

import { getMoodEntries } from '../models/MoodEntry';
import { calculateMoodStatistics } from './moodStatisticsHelper';
import { getMoodReminders } from './moodReminders';

/**
 * Analyze user mood data to identify trends
 * 
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Object} - Trend analysis result
 */
export function analyzeMoodTrend(moodEntries) {
  const trendResult = {
    overallMood: 0,
    moodPatterns: [],
    reminders: []
  };

  // Calculate overall mood
  trendResult.overallMood = calculateOverallMood(moodEntries);

  // Identify mood patterns
  trendResult.moodPatterns = identifyMoodPatterns(moodEntries);

  // Get relevant reminders
  trendResult.reminders = getRelevantReminders(moodEntries);

  return trendResult;
}

/**
 * Calculate overall mood
 * 
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Number} - Overall mood score
 */
function calculateOverallMood(moodEntries) {
  const moodScores = moodEntries.map(entry => entry.moodScore);
  const averageMoodScore = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;
  return averageMoodScore;
}

/**
 * Identify mood patterns
 * 
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Array} - Array of mood patterns
 */
function identifyMoodPatterns(moodEntries) {
  const moodPatterns = [];
  const patternLength = 3; // Minimum pattern length

  for (let i = 0; i < moodEntries.length - patternLength; i++) {
    const pattern = moodEntries.slice(i, i + patternLength);
    const patternScore = calculatePatternScore(pattern);
    if (patternScore > 0.5) { // Threshold for pattern detection
      moodPatterns.push(pattern);
    }
  }

  return moodPatterns;
}

/**
 * Calculate pattern score
 * 
 * @param {Array} pattern - Array of mood entries
 * @returns {Number} - Pattern score
 */
function calculatePatternScore(pattern) {
  const patternScores = pattern.map(entry => entry.moodScore);
  const averagePatternScore = patternScores.reduce((a, b) => a + b, 0) / patternScores.length;
  return averagePatternScore;
}

/**
 * Get relevant reminders
 * 
 * @param {Array} moodEntries - Array of mood entries
 * @returns {Array} - Array of relevant reminders
 */
function getRelevantReminders(moodEntries) {
  const reminders = getMoodReminders();
  const relevantReminders = reminders.filter(reminder => {
    const reminderDate = new Date(reminder.date);
    const moodEntryDate = new Date(moodEntries[0].date);
    return reminderDate >= moodEntryDate;
  });
  return relevantReminders;
}

// Example usage
const moodEntries = getMoodEntries();
const trendResult = analyzeMoodTrend(moodEntries);
console.log(trendResult);