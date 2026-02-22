import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

const MOODS = ["Calm", "Happy", "Anxious", "Tired"];

export default function TodayScreen({ schedule, onToggleDone, mood, setMood }) {
  return (
    <ScreenShell title="Today">
      <Text style={styles.groupTitle}>Mood check</Text>
      <View style={styles.moodRow}>
        {MOODS.map((entry) => (
          <TouchableOpacity
            key={entry}
            onPress={() => setMood(entry)}
            style={[styles.moodButton, mood === entry && styles.moodButtonActive]}
            accessibilityRole="button"
            accessibilityLabel={`Set mood to ${entry}`}
            accessibilityState={{ selected: mood === entry }}
          >
            <Text style={[styles.moodLabel, mood === entry && styles.moodLabelActive]}>{entry}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.groupTitle}>Schedule</Text>
      {schedule.length === 0 ? <Text style={styles.emptyText}>No activities scheduled yet.</Text> : null}
      {schedule.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.row, item.done && styles.rowDone]}
          onPress={() => onToggleDone(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`${item.title} at ${item.time}`}
          accessibilityState={{ checked: item.done }}
        >
          <View style={styles.timePill}>
            <Text style={styles.timeLabel}>{item.time}</Text>
          </View>
          <View style={styles.rowBody}>
            <Text style={[styles.rowTitle, item.done && styles.rowTitleDone]}>{item.title}</Text>
            <Text style={styles.rowStatus}>{item.done ? "Completed" : "Pending"}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
    marginTop: 4,
  },
  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  moodButton: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  moodButtonActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  moodLabel: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  moodLabelActive: {
    color: "#FFFFFF",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderCard,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  rowDone: {
    opacity: 0.75,
  },
  timePill: {
    minWidth: 70,
    borderRadius: 8,
    backgroundColor: "#E9F5EE",
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: "center",
    marginRight: 10,
  },
  timeLabel: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  rowBody: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  rowTitleDone: {
    textDecorationLine: "line-through",
  },
  rowStatus: {
    marginTop: 3,
    color: colors.textMuted,
    fontSize: 14,
  },
  emptyText: {
    color: colors.textMuted,
    marginBottom: 10,
    fontSize: 15,
  },
});
