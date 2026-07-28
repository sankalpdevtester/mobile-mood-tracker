import { SecureStore } from 'expo-secure-store';

const STORAGE_KEY = 'moodTrackerData';

const storeMoodData = async (data) => {
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error storing mood data:', error);
  }
};

const getMoodData = async () => {
  try {
    const storedData = await SecureStore.getItemAsync(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error retrieving mood data:', error);
    return [];
  }
};

const updateMoodData = async (newData) => {
  try {
    const existingData = await getMoodData();
    const updatedData = [...existingData, newData];
    await storeMoodData(updatedData);
  } catch (error) {
    console.error('Error updating mood data:', error);
  }
};

const deleteMoodData = async (id) => {
  try {
    const existingData = await getMoodData();
    const filteredData = existingData.filter((item) => item.id !== id);
    await storeMoodData(filteredData);
  } catch (error) {
    console.error('Error deleting mood data:', error);
  }
};

export { storeMoodData, getMoodData, updateMoodData, deleteMoodData };