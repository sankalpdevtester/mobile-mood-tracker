import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { storage } from './storage';
import { MoodEntry } from '../models/MoodEntry';

const reminderHelper = {
  async scheduleReminder(time) {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status === 'granted') {
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
    }
  },

  async cancelReminder() {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status === 'granted') {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await storage.remove('reminderTime');
    }
  },

  async getReminderTime() {
    const storedReminderTime = await storage.get('reminderTime');
    return storedReminderTime;
  },
};

export default reminderHelper;