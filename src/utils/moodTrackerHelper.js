import MoodEntry, { MOOD_VALUES } from '../models/MoodEntry';
import { getMoodData, addMoodEntry } from './storage';

const SCORE = { great: 5, good: 4, okay: 3, low: 2, rough: 1 };

export const MoodTrackerHelper = {
  getMoodCategories: async () => MOOD_VALUES.slice(),
  getMoodEntries: getMoodData,
  logMood: async (entry) => {
    const moodEntry = entry instanceof MoodEntry
      ? entry
      : new MoodEntry(entry.id || Date.now(), entry.date || new Date().toISOString().slice(0, 10), entry.mood, entry.emotions, entry.notes, entry.createdAt);
    MoodEntry.validate(moodEntry);
    return addMoodEntry(moodEntry.toJSON());
  },
  calculateAverageMood: async () => {
    const entries = await getMoodData();
    const values = entries.map((entry) => SCORE[entry.mood]).filter(Number.isFinite);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  },
  calculateMostCommonMood: async () => {
    const entries = await getMoodData();
    const counts = entries.reduce((result, entry) => {
      result[entry.mood] = (result[entry.mood] || 0) + 1;
      return result;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  },
};

export async function calculateAverageMood() { return MoodTrackerHelper.calculateAverageMood(); }
export async function calculateMostCommonMood() { return MoodTrackerHelper.calculateMostCommonMood(); }
export async function calculateMoodTrend() {
  const entries = (await getMoodData()).slice(0, 3).reverse();
  if (entries.length < 3) return 'not-enough-data';
  const [first, second, third] = entries.map((entry) => SCORE[entry.mood]);
  if (first < second && second < third) return 'improving';
  if (first > second && second > third) return 'declining';
  return 'steady';
}

export const MOOD_TYPES = Object.freeze({
  GREAT: 'great', GOOD: 'good', OKAY: 'okay', LOW: 'low', ROUGH: 'rough',
});
