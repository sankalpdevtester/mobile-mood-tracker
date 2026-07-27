import { MoodCache } from './moodCache';

const calculateMoodStatistics = async () => {
  const moodLogs = await MoodCache.getMoodLogs();
  const moodCounts = {};
  const emotionCounts = {};

  moodLogs.forEach((log) => {
    const mood = log.mood;
    const emotions = log.emotions;

    if (!moodCounts[mood]) {
      moodCounts[mood] = 0;
    }
    moodCounts[mood]++;

    emotions.forEach((emotion) => {
      if (!emotionCounts[emotion]) {
        emotionCounts[emotion] = 0;
      }
      emotionCounts[emotion]++;
    });
  });

  const moodStatistics = {
    moodCounts,
    emotionCounts,
  };

  return moodStatistics;
};

const getMoodTrend = async () => {
  const moodLogs = await MoodCache.getMoodLogs();
  const moodTrend = [];

  moodLogs.forEach((log) => {
    const mood = log.mood;
    const timestamp = log.timestamp;

    moodTrend.push({
      mood,
      timestamp,
    });
  });

  return moodTrend;
};

export { calculateMoodStatistics, getMoodTrend };