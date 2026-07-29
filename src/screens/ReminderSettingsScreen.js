import React, { useState } from 'react';
import { View, Text, Picker } from 'react-native';
import { useMoodReminder } from '../hooks/useMoodReminder';
import { storage } from '../utils/storage';

const ReminderSettingsScreen = () => {
  const { reminderTime, scheduleReminder, cancelReminder } = useMoodReminder();
  const [selectedTime, setSelectedTime] = useState(reminderTime ? reminderTime.getHours() : 8);

  const handleTimeChange = (itemValue) => {
    setSelectedTime(itemValue);
    const time = new Date();
    time.setHours(itemValue);
    time.setMinutes(0);
    scheduleReminder(time);
  };

  const handleCancelReminder = () => {
    cancelReminder();
    setSelectedTime(8);
  };

  return (
    <View>
      <Text>Reminder Settings</Text>
      <Picker
        selectedValue={selectedTime}
        onValueChange={handleTimeChange}
      >
        <Picker.Item label="8:00 AM" value={8} />
        <Picker.Item label="12:00 PM" value={12} />
        <Picker.Item label="6:00 PM" value={18} />
      </Picker>
      <Text>Current Reminder Time: {reminderTime ? reminderTime.toLocaleTimeString() : 'None'}</Text>
      <Text onPress={handleCancelReminder}>Cancel Reminder</Text>
    </View>
  );
};

export default ReminderSettingsScreen;