import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TABS = ["Home", "Today", "Medication", "Family", "Talk"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [familyNote, setFamilyNote] = useState("");
  const [familyUpdates, setFamilyUpdates] = useState([
    { id: "1", text: "Paul visited this morning and had tea together." },
    { id: "2", text: "Nurse check-in completed at 2:00 PM." },
  ]);
  const [medications, setMedications] = useState([
    { id: "m1", name: "Donepezil 5mg", time: "08:00", taken: false },
    { id: "m2", name: "Vitamin D", time: "13:00", taken: false },
    { id: "m3", name: "Melatonin", time: "20:00", taken: false },
  ]);

  const todaySummary = useMemo(() => {
    const takenCount = medications.filter((m) => m.taken).length;
    return `${takenCount}/${medications.length} medications logged today`;
  }, [medications]);

  const toggleMedication = (id) => {
    setMedications((current) =>
      current.map((med) =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const addFamilyNote = () => {
    const trimmed = familyNote.trim();
    if (!trimmed) return;
    setFamilyUpdates((current) => [
      { id: String(Date.now()), text: trimmed },
      ...current,
    ]);
    setFamilyNote("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dementia Assistant</Text>
        <Text style={styles.subtitle}>Simple, calm, and caregiver-friendly</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "Home" && (
          <View>
            <Text style={styles.sectionTitle}>Home</Text>
            <Card label="Today at a glance" value={todaySummary} />
            <Card label="Next event" value="Walk at 4:00 PM" />
            <Card label="Mood check" value="Calm" />
          </View>
        )}

        {activeTab === "Today" && (
          <View>
            <Text style={styles.sectionTitle}>Today</Text>
            <Card label="08:00" value="Breakfast" />
            <Card label="10:30" value="Memory game" />
            <Card label="14:00" value="Nurse check-in" />
            <Card label="16:00" value="Short walk" />
          </View>
        )}

        {activeTab === "Medication" && (
          <View>
            <Text style={styles.sectionTitle}>Medication</Text>
            {medications.map((med) => (
              <TouchableOpacity
                key={med.id}
                accessibilityRole="button"
                accessibilityLabel={`${med.name} at ${med.time}`}
                onPress={() => toggleMedication(med.id)}
                style={styles.medicationButton}
              >
                <View>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medTime}>Time: {med.time}</Text>
                </View>
                <Text style={med.taken ? styles.taken : styles.notTaken}>
                  {med.taken ? "Taken" : "Pending"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === "Family" && (
          <View>
            <Text style={styles.sectionTitle}>Family Feed</Text>
            <View style={styles.inputRow}>
              <TextInput
                accessibilityLabel="Add family note"
                placeholder="Write a short update"
                placeholderTextColor="#6B7280"
                value={familyNote}
                onChangeText={setFamilyNote}
                style={styles.input}
              />
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Post update"
                onPress={addFamilyNote}
                style={styles.postButton}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
            {familyUpdates.map((item) => (
              <Card key={item.id} label="Update" value={item.text} />
            ))}
          </View>
        )}

        {activeTab === "Talk" && (
          <View>
            <Text style={styles.sectionTitle}>Talk</Text>
            <Text style={styles.helperText}>
              Voice support placeholder for future speech interface.
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Start voice session"
              style={styles.talkButton}
            >
              <Text style={styles.talkButtonText}>Start Listening</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            accessibilityRole="button"
            accessibilityLabel={`Open ${tab}`}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.tabButtonTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

function Card({ label, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F8F4",
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#E2F0E8",
    borderBottomWidth: 1,
    borderBottomColor: "#CADFD0",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#123524",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: "#2B5941",
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#123524",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#D3E2DA",
  },
  cardLabel: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0F2D1F",
  },
  medicationButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D3E2DA",
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0F2D1F",
  },
  medTime: {
    marginTop: 4,
    fontSize: 16,
    color: "#4B5563",
  },
  taken: {
    fontSize: 16,
    fontWeight: "700",
    color: "#166534",
  },
  notTaken: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B45309",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C9D8CF",
    borderRadius: 10,
    fontSize: 18,
    color: "#0F2D1F",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  postButton: {
    backgroundColor: "#2F6E4F",
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  helperText: {
    fontSize: 18,
    color: "#334155",
    marginBottom: 14,
  },
  talkButton: {
    backgroundColor: "#1F7A4C",
    borderRadius: 14,
    paddingVertical: 24,
    alignItems: "center",
  },
  talkButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "700",
  },
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    padding: 8,
    backgroundColor: "#E2F0E8",
    borderTopWidth: 1,
    borderTopColor: "#CADFD0",
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#2F6E4F",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A2A",
  },
  tabButtonTextActive: {
    color: "#FFFFFF",
  },
});