import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InfoCard from "../components/InfoCard";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

export default function AdminScreen({ profile, onResetLocalData }) {
  return (
    <ScreenShell title="Admin">
      <InfoCard label="Signed in as" value={profile?.full_name || "Administrator"} />
      <InfoCard label="Role" value={profile?.role || "admin"} />
      <InfoCard label="Environment" value="MVP mode" />

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Maintenance</Text>
        <TouchableOpacity onPress={onResetLocalData} style={styles.actionButton}>
          <Text style={styles.actionLabel}>Reset Local App State</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>
          This clears local cached schedule, medications, and feed state in this app instance.
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.borderCard,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  actionButton: {
    borderRadius: 10,
    backgroundColor: "#B91C1C",
    alignItems: "center",
    paddingVertical: 12,
  },
  actionLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  hint: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
  },
});
