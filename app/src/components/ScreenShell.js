import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

export default function ScreenShell({ title, children }) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },
});
