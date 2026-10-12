import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import MoodEntry from './src/models/MoodEntry';
import MoodLogList from './src/components/MoodLogList';
import useMoodLog from './src/hooks/useMoodLog';
import useMoodReminder from './src/hooks/useMoodReminder';
import { calculateMoodStatistics, getMoodTrend } from './src/utils/moodStatisticsHelper';

const MOODS = [
  { value: 'great', label: 'Great', score: 5, color: '#52d6b5' },
  { value: 'good', label: 'Good', score: 4, color: '#87c98a' },
  { value: 'okay', label: 'Okay', score: 3, color: '#e8c56b' },
  { value: 'low', label: 'Low', score: 2, color: '#e79b75' },
  { value: 'rough', label: 'Rough', score: 1, color: '#df7e8d' },
];
const EMOTIONS = ['Calm', 'Focused', 'Grateful', 'Hopeful', 'Tired', 'Anxious', 'Stressed', 'Lonely'];
const TABS = [
  { id: 'check-in', label: 'Check in' },
  { id: 'history', label: 'History' },
  { id: 'insights', label: 'Insights' },
  { id: 'reminders', label: 'Reminders' },
];

function todayKey() {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function PageTitle({ eyebrow, title, subtitle }) {
  return (
    <View style={styles.titleBlock}>
      <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>
      <Text style={styles.pageTitle}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

function EmptyState({ title, body }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.mutedText}>{body}</Text>
    </View>
  );
}

export default function App() {
  const { moodEntries, loading, error, saveMoodEntry, deleteMoodEntry } = useMoodLog();
  const { reminderTime, scheduled, loading: reminderLoading, schedule, cancel } = useMoodReminder();
  const [activeTab, setActiveTab] = useState('check-in');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [timeInput, setTimeInput] = useState('20:00');

  useEffect(() => {
    if (scheduled) setTimeInput(reminderTime);
  }, [reminderTime, scheduled]);

  const stats = useMemo(() => calculateMoodStatistics(moodEntries), [moodEntries]);
  const trend = useMemo(() => getMoodTrend(moodEntries), [moodEntries]);

  const toggleEmotion = (emotion) => {
    setSelectedEmotions((current) => current.includes(emotion)
      ? current.filter((item) => item !== emotion)
      : [...current, emotion]);
  };

  const handleSave = async () => {
    if (!selectedMood) {
      setMessage('Choose a mood before saving your check-in.');
      return;
    }
    try {
      const entry = new MoodEntry(
        `${Date.now()}`,
        todayKey(),
        selectedMood,
        selectedEmotions,
        notes.trim(),
        new Date().toISOString(),
      ).toJSON();
      await saveMoodEntry(entry);
      setSelectedMood('');
      setSelectedEmotions([]);
      setNotes('');
      setMessage('Check-in saved on this device.');
    } catch (saveError) {
      setMessage(saveError.message || 'Could not save your check-in.');
    }
  };

  const handleSchedule = async () => {
    try {
      await schedule(timeInput);
      setMessage(`Daily reminder set for ${timeInput}.`);
    } catch (scheduleError) {
      setMessage(scheduleError.message || 'Could not set the reminder.');
    }
  };

  const handleCancelReminder = async () => {
    try {
      await cancel();
      setMessage('Daily reminder turned off.');
    } catch (cancelError) {
      setMessage(cancelError.message || 'Could not turn off the reminder.');
    }
  };

  const renderCheckIn = () => (
    <>
      <PageTitle eyebrow="Daily journal" title="How are you, really?" subtitle="A local check-in, saved on this device." />
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose a mood</Text>
        <View style={styles.moodGrid}>
          {MOODS.map((mood) => {
            const selected = selectedMood === mood.value;
            return (
              <Pressable
                key={mood.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setSelectedMood(mood.value)}
                style={[styles.moodOption, selected && styles.moodOptionSelected, selected && { borderColor: mood.color }]}
              >
                <View style={[styles.moodDot, { backgroundColor: mood.color }]} />
                <Text style={[styles.moodLabel, selected && styles.textBright]}>{mood.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>What else is present?</Text>
        <View style={styles.tagWrap}>
          {EMOTIONS.map((emotion) => {
            const selected = selectedEmotions.includes(emotion);
            return (
              <Pressable
                key={emotion}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => toggleEmotion(emotion)}
                style={[styles.tag, selected && styles.tagSelected]}
              >
                <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{emotion}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Add a note</Text>
        <TextInput
          accessibilityLabel="Optional mood note"
          multiline
          maxLength={500}
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything you want to remember about today?"
          placeholderTextColor={COLORS.subtle}
          style={styles.notesInput}
          textAlignVertical="top"
        />
        <Text style={styles.characterCount}>{notes.length}/500</Text>
        <PrimaryButton title="Save check-in" onPress={handleSave} />
      </View>
    </>
  );

  const renderHistory = () => (
    <>
      <PageTitle eyebrow="Your journal" title="Check-in history" subtitle={`${stats.total} ${stats.total === 1 ? 'entry' : 'entries'} saved locally.`} />
      <View style={styles.card}>
        {loading ? <ActivityIndicator color={COLORS.accent} /> : moodEntries.length === 0 ? (
          <EmptyState title="Your log starts here" body="Save a check-in and it will appear in this list." />
        ) : (
          <MoodLogList moodEntries={moodEntries} onDeleteMoodEntry={deleteMoodEntry} />
        )}
      </View>
    </>
  );

  const renderInsights = () => (
    <>
      <PageTitle eyebrow="Patterns, not grades" title="Your recent picture" subtitle="A gentle summary of the check-ins you choose to record." />
      {stats.total === 0 ? <EmptyState title="A little data goes a long way" body="Log a few days to see your mood patterns here." /> : (
        <>
          <View style={styles.statGrid}>
            <StatCard value={`${stats.total}`} label="Check-ins" />
            <StatCard value={stats.mostCommonMood ? moodLabel(stats.mostCommonMood) : '—'} label="Most logged" />
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mood balance</Text>
            <Text style={styles.mutedText}>Each bar shows the share of your saved check-ins.</Text>
            {MOODS.slice().reverse().map((mood) => {
              const count = stats.moodCounts[mood.value] || 0;
              const percent = stats.total ? (count / stats.total) * 100 : 0;
              return (
                <View key={mood.value} style={styles.barRow}>
                  <Text style={styles.barLabel}>{mood.label}</Text>
                  <View style={styles.barTrack}><View style={[styles.barFill, { width: `${percent}%`, backgroundColor: mood.color }]} /></View>
                  <Text style={styles.barCount}>{count}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Recent check-ins</Text>
            {trend.length === 0 ? <Text style={styles.mutedText}>No recent check-ins.</Text> : trend.map((item) => (
              <View style={styles.trendRow} key={item.id}>
                <View style={[styles.moodDot, { backgroundColor: moodColor(item.mood) }]} />
                <Text style={styles.trendMood}>{moodLabel(item.mood)}</Text>
                <Text style={styles.trendDate}>{formatDate(item.date)}</Text>
              </View>
            ))}
          </View>
          {stats.topEmotion ? <View style={styles.callout}><Text style={styles.calloutLabel}>Most selected feeling</Text><Text style={styles.calloutValue}>{stats.topEmotion}</Text></View> : null}
        </>
      )}
    </>
  );

  const renderReminders = () => (
    <>
      <PageTitle eyebrow="A gentle nudge" title="Daily reminder" subtitle="Choose a time that works for you. Notifications are scheduled on this device." />
      <View style={styles.card}>
        <View style={styles.reminderStatus}>
          <View style={[styles.statusDot, { backgroundColor: scheduled ? COLORS.accent : COLORS.subtle }]} />
          <Text style={styles.statusText}>{scheduled ? `On · ${reminderTime}` : 'No reminder scheduled'}</Text>
        </View>
        <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Reminder time</Text>
        <TextInput
          accessibilityLabel="Daily reminder time in 24-hour format"
          value={timeInput}
          onChangeText={setTimeInput}
          keyboardType="numbers-and-punctuation"
          placeholder="20:00"
          placeholderTextColor={COLORS.subtle}
          style={styles.timeInput}
          maxLength={5}
        />
        <Text style={styles.mutedText}>Use 24-hour time, for example 08:30 or 20:00. Reminders require Android or iOS.</Text>
        <View style={styles.buttonSpacing}><PrimaryButton title={reminderLoading ? 'Updating…' : 'Set daily reminder'} onPress={handleSchedule} disabled={reminderLoading} /></View>
        {scheduled ? <SecondaryButton title="Turn reminder off" onPress={handleCancelReminder} /> : null}
      </View>
      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Stored on this device</Text>
        <Text style={styles.mutedText}>Mood entries and reminder settings stay in local app storage. This app does not send your journal to a server.</Text>
      </View>
    </>
  );

  const activeContent = {
    'check-in': renderCheckIn,
    history: renderHistory,
    insights: renderInsights,
    reminders: renderReminders,
  }[activeTab]();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>MINDNOTE</Text>
          <Text style={styles.headerMeta}>{formatDate(todayKey())}</Text>
        </View>
        <View style={styles.headerMark}><Text style={styles.headerMarkText}>M</Text></View>
      </View>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        {error ? <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View> : null}
        {message ? <Text accessibilityLiveRegion="polite" style={styles.message}>{message}</Text> : null}
        {activeContent}
      </ScrollView>
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable key={tab.id} accessibilityRole="tab" accessibilityState={{ selected: activeTab === tab.id }} onPress={() => { setActiveTab(tab.id); setMessage(''); }} style={styles.tab}>
            <View style={[styles.tabIndicator, activeTab === tab.id && styles.tabIndicatorActive]} />
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#0c1220',
  panel: '#151f31',
  panelRaised: '#1b2940',
  border: '#2a3950',
  text: '#edf2f8',
  muted: '#a0afc2',
  subtle: '#718198',
  accent: '#67dfc2',
  accentDark: '#173f3e',
  danger: '#f19a9a',
};

function PrimaryButton({ title, onPress, disabled }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.primaryButton, disabled && styles.buttonDisabled]}><Text style={styles.primaryButtonText}>{title}</Text></Pressable>;
}

function SecondaryButton({ title, onPress }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>{title}</Text></Pressable>;
}

function StatCard({ value, label }) {
  return <View style={styles.statCard}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

function moodLabel(value) { return MOODS.find((mood) => mood.value === value)?.label || value; }
function moodColor(value) { return MOODS.find((mood) => mood.value === value)?.color || COLORS.accent; }
function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: { minHeight: 70, paddingHorizontal: 22, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { color: COLORS.accent, fontSize: 13, fontWeight: '800', letterSpacing: 2.4 },
  headerMeta: { color: COLORS.muted, fontSize: 12, marginTop: 5 },
  headerMark: { height: 38, width: 38, borderRadius: 13, backgroundColor: COLORS.accentDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.accent },
  headerMarkText: { color: COLORS.accent, fontWeight: '800', fontSize: 18 },
  page: { padding: 20, paddingBottom: 34 },
  titleBlock: { marginTop: 5, marginBottom: 20 },
  eyebrow: { color: COLORS.accent, fontSize: 11, fontWeight: '800', letterSpacing: 1.6, marginBottom: 8 },
  pageTitle: { color: COLORS.text, fontSize: 27, lineHeight: 34, fontWeight: '700' },
  subtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 21, marginTop: 7 },
  card: { backgroundColor: COLORS.panel, borderColor: COLORS.border, borderWidth: 1, borderRadius: 18, padding: 17, marginBottom: 14 },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  sectionSpacing: { marginTop: 21 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  moodOption: { width: '48%', minHeight: 52, paddingHorizontal: 12, marginBottom: 9, borderRadius: 12, borderColor: COLORS.border, borderWidth: 1, backgroundColor: COLORS.panelRaised, flexDirection: 'row', alignItems: 'center' },
  moodOptionSelected: { borderWidth: 2, backgroundColor: '#213149' },
  moodDot: { width: 10, height: 10, borderRadius: 5, marginRight: 9 },
  moodLabel: { color: COLORS.muted, fontSize: 14, fontWeight: '600' },
  textBright: { color: COLORS.text },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, marginRight: 7, marginBottom: 8, backgroundColor: COLORS.panelRaised },
  tagSelected: { borderColor: COLORS.accent, backgroundColor: COLORS.accentDark },
  tagText: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
  tagTextSelected: { color: COLORS.accent },
  notesInput: { minHeight: 105, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.panelRaised, color: COLORS.text, padding: 12, fontSize: 14, lineHeight: 20 },
  characterCount: { color: COLORS.subtle, fontSize: 11, textAlign: 'right', marginTop: 5, marginBottom: 13 },
  primaryButton: { minHeight: 48, borderRadius: 12, backgroundColor: COLORS.accent, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15 },
  primaryButtonText: { color: '#0b1a1c', fontWeight: '800', fontSize: 14 },
  secondaryButton: { minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  secondaryButtonText: { color: COLORS.muted, fontSize: 14, fontWeight: '700' },
  buttonDisabled: { opacity: 0.6 },
  buttonSpacing: { marginTop: 17 },
  mutedText: { color: COLORS.muted, fontSize: 13, lineHeight: 20 },
  emptyState: { backgroundColor: COLORS.panel, borderColor: COLORS.border, borderWidth: 1, borderRadius: 18, padding: 22, marginBottom: 14 },
  emptyTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  statGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  statCard: { width: '48%', backgroundColor: COLORS.panel, borderColor: COLORS.border, borderWidth: 1, borderRadius: 16, padding: 17 },
  statValue: { color: COLORS.accent, fontSize: 23, fontWeight: '800', marginBottom: 4 },
  statLabel: { color: COLORS.muted, fontSize: 12 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  barLabel: { color: COLORS.muted, width: 54, fontSize: 12 },
  barTrack: { flex: 1, height: 8, borderRadius: 5, backgroundColor: COLORS.panelRaised, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 5 },
  barCount: { color: COLORS.text, width: 24, textAlign: 'right', fontSize: 12 },
  trendRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomColor: COLORS.border, borderBottomWidth: 1 },
  trendMood: { color: COLORS.text, flex: 1, fontSize: 13, fontWeight: '600' },
  trendDate: { color: COLORS.muted, fontSize: 12 },
  callout: { backgroundColor: COLORS.accentDark, borderColor: COLORS.accent, borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 14 },
  calloutLabel: { color: COLORS.muted, fontSize: 12, marginBottom: 5 },
  calloutValue: { color: COLORS.accent, fontSize: 19, fontWeight: '700' },
  reminderStatus: { flexDirection: 'row', alignItems: 'center', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  statusDot: { width: 9, height: 9, borderRadius: 5, marginRight: 9 },
  statusText: { color: COLORS.text, fontWeight: '600', fontSize: 14 },
  timeInput: { width: 130, color: COLORS.text, fontSize: 24, fontWeight: '700', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, backgroundColor: COLORS.panelRaised, paddingVertical: 10, paddingHorizontal: 14, textAlign: 'center', marginBottom: 10 },
  noteCard: { padding: 16, borderRadius: 15, backgroundColor: '#111a2a', marginBottom: 14 },
  noteTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginBottom: 5 },
  tabBar: { minHeight: 64, flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.background, paddingHorizontal: 6 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIndicator: { width: 25, height: 3, borderRadius: 2, backgroundColor: 'transparent', marginBottom: 8 },
  tabIndicatorActive: { backgroundColor: COLORS.accent },
  tabLabel: { color: COLORS.subtle, fontSize: 11, fontWeight: '600' },
  tabLabelActive: { color: COLORS.accent },
  message: { color: COLORS.accent, marginBottom: 12, fontSize: 13, lineHeight: 18 },
  errorBanner: { padding: 12, borderRadius: 10, backgroundColor: '#422832', borderWidth: 1, borderColor: COLORS.danger, marginBottom: 12 },
  errorText: { color: '#ffd7d7', fontSize: 13 },
});
