export const MOOD_VALUES = ['great', 'good', 'okay', 'low', 'rough'];

export default class MoodEntry {
  constructor(id, date, mood, emotions = [], notes = '', createdAt = new Date().toISOString()) {
    this.id = String(id || Date.now());
    this.date = date;
    this.mood = mood;
    this.emotions = Array.isArray(emotions) ? emotions : [];
    this.notes = typeof notes === 'string' ? notes : '';
    this.createdAt = createdAt;
  }

  static validate(data) {
    if (!data || typeof data !== 'object') throw new TypeError('A mood entry is required.');
    if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error('Choose a valid check-in date.');
    if (!MOOD_VALUES.includes(data.mood)) throw new Error('Choose a mood from the available options.');
    if (data.emotions !== undefined && !Array.isArray(data.emotions)) throw new Error('Feelings must be a list.');
    if (data.notes !== undefined && typeof data.notes !== 'string') throw new Error('Notes must be text.');
    return true;
  }

  static fromJSON(data) {
    MoodEntry.validate(data);
    return new MoodEntry(data.id, data.date, data.mood, data.emotions, data.notes, data.createdAt);
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      mood: this.mood,
      emotions: this.emotions,
      notes: this.notes,
      createdAt: this.createdAt,
    };
  }
}
