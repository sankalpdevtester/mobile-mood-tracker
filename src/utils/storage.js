import AsyncStorage from '@react-native-async-storage/async-storage';

const ENTRIES_KEY = 'mindnote:mood-entries:v1';
const SETTINGS_KEY = 'mindnote:settings:v1';

async function readObject(key, fallback) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Saved app data is unreadable (${key}).`);
  }
}

export async function getMoodData() {
  const entries = await readObject(ENTRIES_KEY, []);
  return Array.isArray(entries) ? entries.filter((entry) => entry && entry.id && entry.date && entry.mood) : [];
}

export async function storeMoodData(entries) {
  if (!Array.isArray(entries)) throw new TypeError('Mood entries must be an array.');
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export async function addMoodEntry(entry) {
  if (!entry || !entry.id || !entry.date || !entry.mood) throw new TypeError('A mood, date, and id are required.');
  const entries = await getMoodData();
  const next = [entry, ...entries.filter((item) => item.id !== entry.id)]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
  await storeMoodData(next);
  return next;
}

export async function updateMoodData(entry) {
  return addMoodEntry(entry);
}

export async function deleteMoodData(id) {
  const next = (await getMoodData()).filter((entry) => entry.id !== id);
  await storeMoodData(next);
  return next;
}

export async function getSettings() {
  const settings = await readObject(SETTINGS_KEY, {});
  return settings && typeof settings === 'object' && !Array.isArray(settings) ? settings : {};
}

export async function setSetting(key, value) {
  const settings = await getSettings();
  settings[key] = value;
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function removeSetting(key) {
  const settings = await getSettings();
  delete settings[key];
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function clearMoodData() {
  await AsyncStorage.removeItem(ENTRIES_KEY);
}
