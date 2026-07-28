class MoodEntry {
  constructor(id, date, mood, emotions, notes) {
    this.id = id;
    this.date = date;
    this.mood = mood;
    this.emotions = emotions;
    this.notes = notes;
  }

  static validate(data) {
    if (!data.date || !data.mood) {
      throw new Error('Date and mood are required');
    }
    if (data.emotions && !Array.isArray(data.emotions)) {
      throw new Error('Emotions must be an array');
    }
    if (data.notes && typeof data.notes !== 'string') {
      throw new Error('Notes must be a string');
    }
  }

  static fromJSON(data) {
    MoodEntry.validate(data);
    return new MoodEntry(data.id, data.date, data.mood, data.emotions, data.notes);
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      mood: this.mood,
      emotions: this.emotions,
      notes: this.notes,
    };
  }
}

export default MoodEntry;