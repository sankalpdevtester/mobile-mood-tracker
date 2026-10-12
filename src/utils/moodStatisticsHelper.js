const MOOD_SCORE = { great: 5, good: 4, okay: 3, low: 2, rough: 1 };

export function calculateMoodStatistics(entries = []) {
  const safeEntries = Array.isArray(entries) ? entries : [];
  const moodCounts = {};
  const emotionCounts = {};

  safeEntries.forEach((entry) => {
    if (entry?.mood) moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    (Array.isArray(entry?.emotions) ? entry.emotions : []).forEach((emotion) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
  });

  const top = (counts) => Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const scores = safeEntries.map((entry) => MOOD_SCORE[entry?.mood]).filter(Number.isFinite);
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 6);
  const lastSevenDays = safeEntries.filter((entry) => {
    const date = new Date(`${entry.date}T12:00:00`);
    return !Number.isNaN(date.getTime()) && date >= since;
  }).length;

  return {
    total: safeEntries.length,
    moodCounts,
    emotionCounts,
    mostCommonMood: top(moodCounts),
    topEmotion: top(emotionCounts),
    averageScore: scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null,
    lastSevenDays,
  };
}

export function getMoodTrend(entries = [], limit = 7) {
  return (Array.isArray(entries) ? entries : [])
    .filter((entry) => entry && entry.date && entry.mood)
    .slice()
    .sort((a, b) => {
      const byDate = String(b.date).localeCompare(String(a.date));
      return byDate || String(b.createdAt || b.id).localeCompare(String(a.createdAt || a.id));
    })
    .slice(0, limit);
}
