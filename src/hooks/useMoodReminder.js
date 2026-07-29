import { useState, useEffect } from 'react';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { storage } from '../utils/storage';
import { MoodEntry } from '../models/MoodEntry';

const useMoodReminder = () => {
  const [reminderTime, setReminderTime] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const getReminderTime = async () => {
      const storedReminderTime = await storage.get('reminderTime');
      setReminderTime(storedReminderTime);
    };
    getReminderTime();
  }, []);

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      setHasPermission(status === 'granted');
    };
    getPermission();
  }, []);

  const scheduleReminder = async (time) => {
    if (hasPermission) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Mood Tracker Reminder',
          body: 'Log your mood for today!',
        },
        trigger: {
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: true,
        },
      });
      await storage.set('reminderTime', time);
      setReminderTime(time);
    }
  };

  const cancelReminder = async () => {
    if (hasPermission) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await storage.remove('reminderTime');
      setReminderTime(null);
    }
  };

  return { reminderTime, scheduleReminder, cancelReminder };
};

export default useMoodReminder;