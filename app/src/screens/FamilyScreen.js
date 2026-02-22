import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

export default function FamilyScreen({ updates, onAddUpdate }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please enter a short update before posting.");
      return;
    }
    if (trimmed.length > 220) {
      setError("Keep updates under 220 characters.");
      return;
    }
    onAddUpdate(trimmed);
    setText("");
    setError("");
  };

  return (
    <ScreenShell title="Family Feed">
      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Write a short update"
          placeholderTextColor="#6B7280"
          accessibilityLabel="Add family update"
          accessibilityHint="Write one concise update for family members"
          maxLength={260}
        />
        <TouchableOpacity
          onPress={submit}
          style={styles.postButton}
          accessibilityRole="button"
          accessibilityLabel="Post update"
          accessibilityHint="Adds this message to the family feed"
        >
          <Text style={styles.postLabel}>Post</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {updates.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No updates yet. Share the first note for family.</Text>
        </View>
      ) : null}

      {updates.map((entry) => (
        <View style={styles.card} key={entry.id}>
          <View style={styles.cardHeader}>
            <Text style={styles.author}>{entry.author}</Text>
            <Text style={styles.time}>{entry.timestamp}</Text>
          </View>
          <Text style={styles.message}>{entry.message}</Text>
        </View>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 10,
    fontSize: 17,
    color: colors.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  postButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  postLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderCard,
    padding: 14,
    marginBottom: 10,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderCard,
    padding: 14,
    marginBottom: 10,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  errorText: {
    color: "#991B1B",
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  author: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  time: {
    color: colors.textMuted,
    fontSize: 13,
  },
  message: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});
