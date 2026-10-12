import { useCallback, useEffect, useState } from 'react';
import { getMoodData, addMoodEntry, deleteMoodData } from '../utils/storage';

export default function useMoodLog() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setMoodEntries(await getMoodData());
      setError('');
    } catch (loadError) {
      setError(loadError.message || 'Could not load your saved check-ins.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const saveMoodEntry = useCallback(async (entry) => {
    const next = await addMoodEntry(entry);
    setMoodEntries(next);
    setError('');
  }, []);

  const deleteMoodEntry = useCallback(async (id) => {
    try {
      const next = await deleteMoodData(id);
      setMoodEntries(next);
      setError('');
      return true;
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete this check-in.');
      return false;
    }
  }, []);

  return { moodEntries, loading, error, saveMoodEntry, deleteMoodEntry, refresh };
}
