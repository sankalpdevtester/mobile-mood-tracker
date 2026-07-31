/**
 * Mood Reminders Utility Module
 * 
 * This module provides functionality for scheduling and managing mood reminders.
 * It integrates with the existing mood tracking features to send notifications
 * to users to log their mood at regular intervals.
 */

import { Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import { MoodEntry } from '../models/MoodEntry';
import { storage } from './storage';
import { moodTrackerHelper } from './moodTrackerHelper';

const REMINDER_KEY = 'mood_reminder';
const DEFAULT_REMINDER_INTERVAL = 24 * 60 * 60 * 1000; // 1 day

/**
 * Schedule a mood reminder notification
 * 
 * @param {number} interval - The interval at which to send reminders (in milliseconds)
 */
async function scheduleReminder(interval = DEFAULT_REMINDER_INTERVAL) {
  const reminder = await getReminder();
  if (reminder) {
    await cancelReminder();
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Log Your Mood',
      body: 'Take a moment to log your current mood',
    },
    trigger: {
      seconds: interval / 1000,
      repeats: true,
    },
  });

  await setReminder(notificationId);
}

/**
 * Cancel the currently scheduled mood reminder
 */
async function cancelReminder() {
  const reminder = await getReminder();
  if (reminder) {
    await Notifications.cancelScheduledNotificationAsync(reminder);
    await removeReminder();
  }
}

/**
 * Get the currently scheduled mood reminder
 * 
 * @returns {string|null} The notification ID of the scheduled reminder, or null if none is scheduled
 */
async function getReminder() {
  const reminder = await storage.get(REMINDER_KEY);
  return reminder ? JSON.parse(reminder) : null;
}

/**
 * Set the currently scheduled mood reminder
 * 
 * @param {string} notificationId - The notification ID of the scheduled reminder
 */
async function setReminder(notificationId) {
  await storage.set(REMINDER_KEY, JSON.stringify(notificationId));
}

/**
 * Remove the currently scheduled mood reminder
 */
async function removeReminder() {
  await storage.remove(REMINDER_KEY);
}

/**
 * Handle a mood reminder notification
 * 
 * @param {object} notification - The notification object
 */
async function handleReminderNotification(notification) {
  const moodEntry = new MoodEntry();
  await moodTrackerHelper.logMood(moodEntry);
}

/**
 * Initialize the mood reminders feature
 */
async function initReminders() {
  const reminder = await getReminder();
  if (!reminder) {
    await scheduleReminder();
  }
}

export {
  scheduleReminder,
  cancelReminder,
  getReminder,
  setReminder,
  removeReminder,
  handleReminderNotification,
  initReminders,
};