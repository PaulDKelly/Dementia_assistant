import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

function canManage(role) {
  return role === "caregiver" || role === "admin";
}

export default function PasswordHubScreen({
  role,
  entries,
  vaultPin,
  onUnlock,
  unlocked,
  onLock,
  onUpdatePin,
  onAddEntry,
  onDeleteEntry,
}) {
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [newPin, setNewPin] = useState("");

  const [label, setLabel] = useState("");
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");

  const [revealed, setRevealed] = useState({});
  const [expiryTimers, setExpiryTimers] = useState({});

  const manageEnabled = useMemo(() => canManage(role), [role]);

  const attemptUnlock = () => {
    if (pinInput !== vaultPin) {
      setPinError("PIN is incorrect.");
      return;
    }
    onUnlock();
    setPinInput("");
    setPinError("");
  };

  const revealForSeconds = (id) => {
    if (expiryTimers[id]) clearTimeout(expiryTimers[id]);
    setRevealed((current) => ({ ...current, [id]: true }));
    const timer = setTimeout(() => {
      setRevealed((current) => ({ ...current, [id]: false }));
    }, 25000);
    setExpiryTimers((current) => ({ ...current, [id]: timer }));
  };

  const updatePin = () => {
    const trimmed = newPin.trim();
    if (!/^\d{4,6}$/.test(trimmed)) {
      setPinError("PIN must be 4-6 digits.");
      return;
    }
    onUpdatePin(trimmed);
    setNewPin("");
    setPinError("");
  };

  const addEntry = () => {
    const payload = {
      label: label.trim(),
      username: username.trim(),
      secret: secret.trim(),
      note: note.trim(),
    };
    if (!payload.label || !payload.username || !payload.secret) {
      setFormError("Label, username, and password are required.");
      return;
    }
    onAddEntry(payload);
    setLabel("");
    setUsername("");
    setSecret("");
    setNote("");
    setFormError("");
  };

  if (!unlocked) {
    return (
      <ScreenShell title="Password Hub">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter PIN to unlock</Text>
          <TextInput
            value={pinInput}
            onChangeText={setPinInput}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            style={styles.input}
            placeholder="PIN"
            placeholderTextColor="#6B7280"
            accessibilityLabel="Vault PIN"
          />
          {pinError ? <Text style={styles.error}>{pinError}</Text> : null}
          <TouchableOpacity onPress={attemptUnlock} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Unlock</Text>
          </TouchableOpacity>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Password Hub">
      <View style={styles.rowBetween}>
        <Text style={styles.sectionTitle}>Saved Accounts</Text>
        <TouchableOpacity onPress={onLock} style={styles.ghostButton}>
          <Text style={styles.ghostButtonLabel}>Lock</Text>
        </TouchableOpacity>
      </View>

      {entries.map((entry) => (
        <View key={entry.id} style={styles.card}>
          <Text style={styles.accountTitle}>{entry.label}</Text>
          <Text style={styles.meta}>Username: {entry.username}</Text>
          <Text style={styles.meta}>
            Password: {revealed[entry.id] ? entry.secret : "**********"}
          </Text>
          {entry.note ? <Text style={styles.note}>{entry.note}</Text> : null}
          <Text style={styles.meta}>Updated: {entry.updatedAt}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => revealForSeconds(entry.id)} style={styles.primaryButtonSmall}>
              <Text style={styles.primaryButtonText}>Reveal 25s</Text>
            </TouchableOpacity>
            {manageEnabled ? (
              <TouchableOpacity onPress={() => onDeleteEntry(entry.id)} style={styles.dangerButtonSmall}>
                <Text style={styles.primaryButtonText}>Delete</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ))}

      {manageEnabled ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add Entry</Text>
          <TextInput
            value={label}
            onChangeText={setLabel}
            style={styles.input}
            placeholder="Account label (e.g. Utilities)"
            placeholderTextColor="#6B7280"
          />
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#6B7280"
          />
          <TextInput
            value={secret}
            onChangeText={setSecret}
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6B7280"
          />
          <TextInput
            value={note}
            onChangeText={setNote}
            style={styles.input}
            placeholder="Optional note"
            placeholderTextColor="#6B7280"
          />
          {formError ? <Text style={styles.error}>{formError}</Text> : null}
          <TouchableOpacity onPress={addEntry} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {manageEnabled ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Update Vault PIN</Text>
          <TextInput
            value={newPin}
            onChangeText={setNewPin}
            style={styles.input}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            placeholder="New PIN (4-6 digits)"
            placeholderTextColor="#6B7280"
          />
          <TouchableOpacity onPress={updatePin} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Update PIN</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 18,
  },
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
  accountTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 6,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  note: {
    color: colors.textPrimary,
    marginTop: 2,
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    borderColor: colors.borderSoft,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    color: colors.textPrimary,
    backgroundColor: "#FFFEFD",
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 11,
  },
  primaryButtonSmall: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  dangerButtonSmall: {
    backgroundColor: "#D56A8F",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
  },
  ghostButtonLabel: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  error: {
    color: "#991B1B",
    fontWeight: "600",
    marginBottom: 6,
  },
});
