import { addMoodEntry, clearMoodData, deleteMoodData, getMoodData } from './storage';

export const MoodCache = {
  getMoodLogs: getMoodData,
  logMood: async (entry) => {
    const normalized = {
      id: String(entry.id || Date.now()),
      date: entry.date || new Date().toISOString().slice(0, 10),
      mood: entry.mood,
      emotions: Array.isArray(entry.emotions) ? entry.emotions : [],
      notes: entry.notes || '',
      createdAt: entry.createdAt || new Date().toISOString(),
    };
    return addMoodEntry(normalized);
  },
  deleteMoodLog: deleteMoodData,
  clear: clearMoodData,
};
