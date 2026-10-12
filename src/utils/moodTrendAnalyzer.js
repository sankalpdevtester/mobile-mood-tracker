const SCORE = { great: 5, good: 4, okay: 3, low: 2, rough: 1 };

export function analyzeMoodTrend(entries = []) {
  const sorted = (Array.isArray(entries) ? entries : [])
    .filter((entry) => entry && SCORE[entry.mood])
    .slice()
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const scores = sorted.map((entry) => SCORE[entry.mood]);
  const average = scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
  const recent = scores.slice(-3);
  let direction = 'not-enough-data';
  if (recent.length === 3) {
    direction = recent[0] < recent[1] && recent[1] < recent[2]
      ? 'improving'
      : recent[0] > recent[1] && recent[1] > recent[2]
        ? 'declining'
        : 'steady';
  }
  return { entryCount: sorted.length, averageMoodScore: average, direction };
}
