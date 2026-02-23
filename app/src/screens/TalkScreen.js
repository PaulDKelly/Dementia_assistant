import React from "react";
import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InfoCard from "../components/InfoCard";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

const QUICK_MESSAGES = [
  "I need help, please.",
  "Can we call family now?",
  "I feel confused.",
  "I would like water.",
];

export default function TalkScreen({ onSendMessage, lastTalkMessage }) {
  const triggerEmergencyCall = async () => {
    try {
      await Linking.openURL("tel:911");
    } catch (error) {
      Alert.alert("Call unavailable", "Phone calling is not available on this device.");
    }
  };

  return (
    <ScreenShell title="Talk">
      <InfoCard label="Last outgoing message" value={lastTalkMessage} />
      <Text style={styles.groupTitle}>Quick phrases</Text>

      {QUICK_MESSAGES.map((message) => (
        <TouchableOpacity
          key={message}
          onPress={() => onSendMessage(message)}
          style={styles.quickButton}
          accessibilityRole="button"
          accessibilityLabel={`Send message: ${message}`}
        >
          <Text style={styles.quickLabel}>{message}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => onSendMessage(lastTalkMessage, { speakOnly: true })}
        style={styles.listenBackButton}
        accessibilityRole="button"
        accessibilityLabel="Speak last message aloud"
      >
        <Text style={styles.listenBackLabel}>Speak last message</Text>
      </TouchableOpacity>

      <View style={styles.emergencyPanel}>
        <Text style={styles.emergencyTitle}>Emergency</Text>
        <TouchableOpacity
          onPress={triggerEmergencyCall}
          style={styles.emergencyButton}
          accessibilityRole="button"
          accessibilityLabel="Call emergency services"
        >
          <Text style={styles.emergencyLabel}>Call 911</Text>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    marginTop: 6,
    marginBottom: 8,
    fontWeight: "700",
    fontSize: 18,
    color: colors.textPrimary,
  },
  quickButton: {
    backgroundColor: "#FFFDFB",
    borderWidth: 1,
    borderColor: "#F1D7CE",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  quickLabel: {
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  emergencyPanel: {
    marginTop: 6,
    padding: 14,
    backgroundColor: "#FFF2F6",
    borderWidth: 1,
    borderColor: "#F6C4D4",
    borderRadius: 16,
  },
  listenBackButton: {
    backgroundColor: "#F4FFFC",
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  listenBackLabel: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  emergencyTitle: {
    color: "#991B1B",
    fontWeight: "700",
    marginBottom: 8,
  },
  emergencyButton: {
    backgroundColor: "#B91C1C",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  emergencyLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },
});
