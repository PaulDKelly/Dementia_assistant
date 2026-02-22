import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InfoCard from "../components/InfoCard";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

export default function MedicationScreen({ medications, onToggleTaken, takenCount }) {
  return (
    <ScreenShell title="Medication">
      <InfoCard label="Logged today" value={`${takenCount}/${medications.length}`} />
      {medications.length === 0 ? <Text style={styles.emptyText}>No medications added yet.</Text> : null}

      {medications.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onToggleTaken(item.id)}
          style={styles.row}
          accessibilityRole="button"
          accessibilityLabel={`${item.name} at ${item.time}`}
          accessibilityState={{ checked: item.taken }}
        >
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>Time: {item.time}</Text>
            <Text style={styles.meta}>
              Last logged: {item.lastTakenAt ? item.lastTakenAt : "Not logged"}
            </Text>
          </View>

          <Text style={[styles.state, item.taken ? styles.taken : styles.pending]}>
            {item.taken ? "Taken" : "Pending"}
          </Text>
        </TouchableOpacity>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderCard,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 19,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  meta: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
  },
  state: {
    fontWeight: "700",
    fontSize: 15,
  },
  taken: {
    color: colors.success,
  },
  pending: {
    color: colors.warn,
  },
  emptyText: {
    color: colors.textMuted,
    marginBottom: 10,
    fontSize: 15,
  },
});
