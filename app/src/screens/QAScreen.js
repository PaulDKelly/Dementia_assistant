import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

export default function QAScreen({
  checklist,
  notes,
  onToggleItem,
  onChangeNotes,
  onResetChecklist,
}) {
  const completed = checklist.filter((item) => item.done).length;
  const progress = checklist.length ? `${completed}/${checklist.length}` : "0/0";

  return (
    <ScreenShell title="Android QA Checklist">
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Progress</Text>
        <Text style={styles.summaryValue}>{progress}</Text>
      </View>

      {checklist.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onToggleItem(item.id)}
          style={[styles.itemRow, item.done && styles.itemRowDone]}
          accessibilityRole="button"
          accessibilityLabel={item.title}
          accessibilityState={{ checked: item.done }}
        >
          <View style={[styles.checkbox, item.done && styles.checkboxChecked]}>
            <Text style={[styles.checkboxLabel, item.done && styles.checkboxLabelChecked]}>
              {item.done ? "X" : " "}
            </Text>
          </View>
          <View style={styles.itemBody}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDetail}>{item.detail}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.notesPanel}>
        <Text style={styles.notesTitle}>QA Notes</Text>
        <TextInput
          value={notes}
          onChangeText={onChangeNotes}
          multiline
          numberOfLines={5}
          placeholder="Capture device model, issues, and observations..."
          placeholderTextColor="#6B7280"
          style={styles.notesInput}
          accessibilityLabel="QA notes"
        />
      </View>

      <TouchableOpacity onPress={onResetChecklist} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset QA Checklist</Text>
      </TouchableOpacity>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.borderCard,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 18,
  },
  summaryValue: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 20,
  },
  itemRow: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.borderCard,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
  },
  itemRowDone: {
    borderColor: "#86EFAC",
    backgroundColor: "#F0FDF4",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginTop: 2,
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxLabel: {
    color: "transparent",
    fontWeight: "700",
  },
  checkboxLabelChecked: {
    color: "#FFFFFF",
  },
  itemBody: {
    flex: 1,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
  },
  itemDetail: {
    marginTop: 4,
    color: colors.textMuted,
    fontSize: 14,
  },
  notesPanel: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.borderCard,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  notesTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 17,
  },
  notesInput: {
    borderColor: colors.borderSoft,
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 110,
    padding: 10,
    textAlignVertical: "top",
    color: colors.textPrimary,
    fontSize: 15,
  },
  resetButton: {
    backgroundColor: "#B91C1C",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 10,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
