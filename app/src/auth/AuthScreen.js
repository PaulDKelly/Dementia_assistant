import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { isSupabaseConfigured } from "../lib/supabase";
import { colors } from "../theme/colors";

const ROLES = ["elder", "caregiver", "admin"];

export default function AuthScreen({ onDemoLogin, onSupabaseLogin, loading }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    const result = await onSupabaseLogin(trimmed, password);
    if (!result.ok) setError(result.error || "Login failed.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue your care workspace</Text>

      {isSupabaseConfigured ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Supabase Login</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#6B7280"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#6B7280"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity onPress={login} style={styles.primaryButton} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonLabel}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Demo Mode</Text>
          <Text style={styles.muted}>
            Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` to enable real auth.
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Start (Demo)</Text>
        <Text style={styles.muted}>Choose a role for local testing.</Text>
        <View style={styles.roleRow}>
          {ROLES.map((role) => (
            <TouchableOpacity key={role} onPress={() => onDemoLogin(role)} style={styles.roleButton}>
              <Text style={styles.roleLabel}>{role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: colors.borderCard,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderColor: colors.borderSoft,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: "#FFFFFF",
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  primaryButtonLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
  },
  muted: {
    color: colors.textMuted,
    fontSize: 14,
  },
  roleRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  roleButton: {
    marginRight: 8,
    backgroundColor: "#ECF6F0",
    borderColor: colors.borderSoft,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  roleLabel: {
    color: colors.textPrimary,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  error: {
    color: "#991B1B",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
  },
});
