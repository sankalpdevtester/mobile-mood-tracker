import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getSettings, removeSetting, setSetting } from './storage';

const REMINDER_KEY = 'dailyReminder';

function parseTime(value) {
  const match = /^(\d{2}):(\d{2})$/.exec(value || '');
  if (!match) throw new Error('Enter a time in 24-hour format, such as 20:00.');
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) throw new Error('Enter a valid time between 00:00 and 23:59.');
  return { hour, minute };
}

export async function getDailyReminder() {
  const settings = await getSettings();
  return settings[REMINDER_KEY] || null;
}

export async function scheduleDailyReminder(time) {
  if (Platform.OS === 'web') throw new Error('Daily notifications are supported on Android and iOS devices.');
  const { hour, minute } = parseTime(time);
  const permission = await Notifications.getPermissionsAsync();
  const requested = permission.status === 'granted' ? permission : await Notifications.requestPermissionsAsync();
  if (requested.status !== 'granted') throw new Error('Allow notifications in your device settings to schedule a reminder.');

  const current = await getDailyReminder();
  if (current?.id) await Notifications.cancelScheduledNotificationAsync(current.id);
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Take a moment for yourself',
      body: 'A quick check-in can help you notice how your day is going.',
      sound: false,
    },
    trigger: { hour, minute, repeats: true },
  });
  const reminder = { id, time };
  await setSetting(REMINDER_KEY, reminder);
  return reminder;
}

export async function cancelDailyReminder() {
  const current = await getDailyReminder();
  if (current?.id) await Notifications.cancelScheduledNotificationAsync(current.id);
  await removeSetting(REMINDER_KEY);
}

export { parseTime };
