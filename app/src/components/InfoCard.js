import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function InfoCard({ label, value, tone = "default" }) {
  const valueStyle = [styles.value];

  if (tone === "success") valueStyle.push(styles.success);
  if (tone === "warning") valueStyle.push(styles.warning);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={valueStyle}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 6,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  success: {
    color: colors.success,
  },
  warning: {
    color: colors.warn,
  },
});
