import { cancelDailyReminder, getDailyReminder, scheduleDailyReminder } from './moodReminders';

const reminderHelper = {
  scheduleReminder: scheduleDailyReminder,
  cancelReminder: cancelDailyReminder,
  getReminderTime: async () => (await getDailyReminder())?.time || null,
};

export default reminderHelper;
