import React, { useState } from "react";
import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

function canCreate(role) {
  return role === "caregiver" || role === "admin";
}

export default function FamilyMomentsScreen({ role, moments, onAddMoment }) {
  const [type, setType] = useState("photo");
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const payload = {
      type,
      mediaUrl: mediaUrl.trim(),
      caption: caption.trim(),
    };
    if (!payload.mediaUrl || !payload.caption) {
      setError("Media URL and caption are required.");
      return;
    }
    if (!payload.mediaUrl.startsWith("http")) {
      setError("Media URL must start with http:// or https://");
      return;
    }
    onAddMoment(payload);
    setMediaUrl("");
    setCaption("");
    setError("");
  };

  return (
    <ScreenShell title="Family Moments">
      {canCreate(role) ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>New Moment</Text>
          <View style={styles.toggleRow}>
            {["photo", "video"].map((entry) => (
              <TouchableOpacity
                key={entry}
                onPress={() => setType(entry)}
                style={[styles.typeButton, type === entry && styles.typeButtonActive]}
              >
                <Text style={[styles.typeButtonLabel, type === entry && styles.typeButtonLabelActive]}>
                  {entry}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            value={mediaUrl}
            onChangeText={setMediaUrl}
            style={styles.input}
            placeholder="Media URL (https://...)"
            placeholderTextColor="#6B7280"
          />
          <TextInput
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
            placeholder="Caption"
            placeholderTextColor="#6B7280"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity onPress={submit} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Post Moment</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {moments.map((moment) => (
        <View key={moment.id} style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.tag}>{moment.type.toUpperCase()}</Text>
            <Text style={styles.meta}>
              {moment.author} - {moment.createdAt}
            </Text>
          </View>
          <Text style={styles.caption}>{moment.caption}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(moment.mediaUrl)}>
            <Text style={styles.link}>Open media</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFDFB",
    borderColor: "#F1D7CE",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 17,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#FFFEFD",
  },
  typeButtonActive: {
    backgroundColor: "#F9BDD0",
    borderColor: "#F09BB7",
  },
  typeButtonLabel: {
    color: colors.textPrimary,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  typeButtonLabelActive: {
    color: "#FFFFFF",
  },
  input: {
    borderColor: colors.borderSoft,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    color: colors.textPrimary,
  },
  error: {
    color: "#991B1B",
    fontWeight: "600",
    marginBottom: 6,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 11,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 12,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  caption: {
    color: colors.textPrimary,
    marginTop: 6,
    marginBottom: 6,
    fontSize: 15,
  },
  link: {
    color: colors.accent,
    fontWeight: "700",
  },
});
