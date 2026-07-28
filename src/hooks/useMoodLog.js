import { useState, useEffect } from 'react';
import { getMoodData, updateMoodData, deleteMoodData } from '../utils/storage';

const useMoodLog = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMoodData = async () => {
      setLoading(true);
      try {
        const data = await getMoodData();
        setMoodEntries(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMoodData();
  }, []);

  const handleLogMood = async (newMoodEntry) => {
    try {
      await updateMoodData(newMoodEntry);
      setMoodEntries([...moodEntries, newMoodEntry]);
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteMoodEntry = async (id) => {
    try {
      await deleteMoodData(id);
      setMoodEntries(moodEntries.filter((entry) => entry.id !== id));
    } catch (error) {
      setError(error);
    }
  };

  return { moodEntries, loading, error, handleLogMood, handleDeleteMoodEntry };
};

export default useMoodLog;