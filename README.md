# Mood Tracker Mobile App
[![Language](https://img.shields.io/badge/Language-JavaScript-yellow)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](https://opensource.org/licenses/MIT)

## What it does
The Mood Tracker Mobile App is a simple and intuitive application designed to help users monitor and track their daily mood and emotions. By providing a user-friendly interface, users can easily log their emotions and receive valuable insights into their mental well-being. This app aims to promote self-awareness and emotional intelligence, allowing users to make positive changes in their lives.

## Features
* Mood tracking: Users can track their daily mood and emotions
* Emotion logging: Users can log specific emotions and events throughout the day
* Daily reminders: Users receive reminders to log their mood and emotions
* Mood statistics: Users can view statistics on their mood and emotions over time
* Customizable mood categories: Users can customize the mood categories to suit their needs

## Requirements
* Node.js: 16.14.2
* npm: 8.5.5
* Expo: 44.0.0
* React Native: 0.68.2

## Installation
To install the required dependencies, run the following command:
```bash
npm install
```

## Usage
To start the application, run the following command:
```bash
npx expo start
```
This will start the development server, and you can access the app on your mobile device or emulator. For example, if you want to start the app on an Android device, you can use the following command:
```bash
npx expo start --android
```
Expected output:
```
Starting project at /path/to/project
 Expo Development Server started
```

## Environment Variables
| Variable | Description |
| --- | --- |
| `MOOD_TRACKER_API_KEY` | API key for mood tracking services |
| `EXPO_ANDROID_PACKAGE` | Package name for Android app |
| `EXPO_IOS_BUNDLE_IDENTIFIER` | Bundle identifier for iOS app |

## Project Structure
```markdown
mood-tracker-mobile-app/
├── app.json
├── package.json
├── README.md
├── node_modules/
├── src/
│   ├── components/
│   │   ├── MoodTracker.js
│   │   ├── EmotionLogger.js
│   │   └── ...
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── MoodScreen.js
│   │   └── ...
│   ├── services/
│   │   ├── MoodTrackerService.js
│   │   ├── EmotionLoggerService.js
│   │   └── ...
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── ...
│   ├── App.js
│   └── index.js
└── tests/
    ├── components/
    │   ├── MoodTracker.test.js
    │   ├── EmotionLogger.test.js
    │   └── ...
    ├── screens/
    │   ├── HomeScreen.test.js
    │   ├── MoodScreen.test.js
    │   └── ...
    ├── services/
    │   ├── MoodTrackerService.test.js
    │   ├── EmotionLoggerService.test.js
    │   └── ...
    └── ...
```

## Contributing
Contributions are welcome and appreciated. To contribute, please fork the repository, make your changes, and submit a pull request. Please ensure that your changes are consistent with the existing code style and conventions.

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.