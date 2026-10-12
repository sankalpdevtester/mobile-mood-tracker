# Mindnote Mood Tracker

A small Expo app for recording daily moods, noting related feelings, reviewing past check-ins, and spotting simple patterns over time. Entries and reminder settings are stored on the device; the app has no account, analytics, or mood-data API.

## What it includes

- Five mood levels with optional emotion tags and a 500-character note.
- A local journal with date, mood, selected feelings, and deletion controls.
- Insights for the most frequently logged mood and feeling, plus a mood breakdown and recent check-ins.
- Optional repeating local notifications on Android and iOS.
- A responsive dark interface with accessible labels and selection states.

## Run it

This repository uses Expo SDK 46 with React Native 0.69.5 and React 18. Install Node.js and npm, then run:

```sh
npm install
npm start
```

Use the Expo CLI menu to open an Android emulator, iOS simulator, or Expo Go on a device. Local notification scheduling requires a native Android or iOS runtime; it is not available on web.

Useful scripts:

```sh
npm run android
npm run ios
npm run web
```

## Project layout

```text
App.js                         Main app shell and four-section interface
app.json                      Expo app metadata
src/components/MoodLogList.js Journal history list
src/hooks/useMoodLog.js       Mood entry loading and updates
src/hooks/useMoodReminder.js  Reminder state and actions
src/models/MoodEntry.js       Entry shape and validation
src/utils/storage.js          Local entry and preference storage
src/utils/moodStatisticsHelper.js  Mood and emotion summaries
src/utils/moodReminders.js    Local notification scheduling
```

The app stores journal data in AsyncStorage. That storage is local but not encrypted, so avoid recording information that needs encrypted storage. No environment variables or external service credentials are required.

## License

MIT
