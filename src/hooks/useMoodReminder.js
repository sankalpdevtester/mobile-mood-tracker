import { useEffect, useState } from 'react';
import { getDailyReminder, scheduleDailyReminder, cancelDailyReminder } from '../utils/moodReminders';

export default function useMoodReminder() {
  const [reminderTime, setReminderTime] = useState('20:00');
  const [scheduled, setScheduled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDailyReminder()
      .then((reminder) => {
        if (!mounted || !reminder) return;
        setReminderTime(reminder.time || '20:00');
        setScheduled(true);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const schedule = async (time) => {
    setLoading(true);
    try {
      const reminder = await scheduleDailyReminder(time);
      setReminderTime(reminder.time);
      setScheduled(true);
      return reminder;
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    setLoading(true);
    try {
      await cancelDailyReminder();
      setScheduled(false);
    } finally {
      setLoading(false);
    }
  };

  return { reminderTime, scheduled, loading, schedule, cancel };
}
