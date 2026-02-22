import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BottomTabs, { TABS } from "./src/components/BottomTabs";
import { initialFamilyUpdates, initialMedications, initialSchedule } from "./src/data/seed";
import FamilyScreen from "./src/screens/FamilyScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MedicationScreen from "./src/screens/MedicationScreen";
import TalkScreen from "./src/screens/TalkScreen";
import TodayScreen from "./src/screens/TodayScreen";
import { loadAppState, saveAppState } from "./src/storage/appState";
import { colors } from "./src/theme/colors";
import { nowLabel } from "./src/utils/time";

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [schedule, setSchedule] = useState(initialSchedule);
  const [medications, setMedications] = useState(initialMedications);
  const [familyUpdates, setFamilyUpdates] = useState(initialFamilyUpdates);
  const [lastTalkMessage, setLastTalkMessage] = useState("No message sent yet");
  const [mood, setMood] = useState("Calm");
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      const persisted = await loadAppState();
      if (!isMounted || !persisted) {
        setIsHydrating(false);
        return;
      }

      if (Array.isArray(persisted.schedule)) setSchedule(persisted.schedule);
      if (Array.isArray(persisted.medications)) setMedications(persisted.medications);
      if (Array.isArray(persisted.familyUpdates)) setFamilyUpdates(persisted.familyUpdates);
      if (typeof persisted.lastTalkMessage === "string") setLastTalkMessage(persisted.lastTalkMessage);
      if (typeof persisted.mood === "string") setMood(persisted.mood);
      setIsHydrating(false);
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isHydrating) return;

    saveAppState({
      schedule,
      medications,
      familyUpdates,
      lastTalkMessage,
      mood,
    });
  }, [schedule, medications, familyUpdates, lastTalkMessage, mood, isHydrating]);

  const completedEvents = schedule.filter((item) => item.done).length;
  const medicationTakenCount = medications.filter((item) => item.taken).length;
  const urgentMedications = medications.filter((item) => !item.taken).length;

  const nextEvent = useMemo(
    () => schedule.find((item) => !item.done) || schedule[schedule.length - 1] || null,
    [schedule]
  );

  const toggleEventDone = (id) => {
    setSchedule((current) =>
      current.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const toggleMedicationTaken = (id) => {
    setMedications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              taken: !item.taken,
              lastTakenAt: !item.taken ? nowLabel() : null,
            }
          : item
      )
    );
  };

  const addFamilyUpdate = (message) => {
    setFamilyUpdates((current) => [
      {
        id: String(Date.now()),
        message,
        author: "Caregiver",
        timestamp: nowLabel(),
      },
      ...current,
    ]);
  };

  const sendTalkMessage = (message) => {
    setLastTalkMessage(`${message} (${nowLabel()})`);
  };

  const renderScreen = () => {
    if (activeTab === "Home") {
      return (
        <HomeScreen
          mood={mood}
          nextEvent={nextEvent}
          medicationTakenCount={medicationTakenCount}
          medicationTotal={medications.length}
          urgentMedications={urgentMedications}
          completedEvents={completedEvents}
          totalEvents={schedule.length}
          latestFamilyUpdate={familyUpdates[0]}
        />
      );
    }

    if (activeTab === "Today") {
      return <TodayScreen schedule={schedule} onToggleDone={toggleEventDone} setMood={setMood} mood={mood} />;
    }

    if (activeTab === "Medication") {
      return (
        <MedicationScreen
          medications={medications}
          onToggleTaken={toggleMedicationTaken}
          takenCount={medicationTakenCount}
        />
      );
    }

    if (activeTab === "Family") {
      return <FamilyScreen updates={familyUpdates} onAddUpdate={addFamilyUpdate} />;
    }

    return <TalkScreen onSendMessage={sendTalkMessage} lastTalkMessage={lastTalkMessage} />;
  };

  if (isHydrating) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dementia Assistant</Text>
          <Text style={styles.subtitle}>Loading care plan...</Text>
        </View>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Preparing today's information</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dementia Assistant</Text>
        <Text style={styles.subtitle}>Care plan for today, simplified</Text>
      </View>

      <View style={styles.content}>{renderScreen()}</View>

      <BottomTabs tabs={TABS} activeTab={activeTab} onSelect={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: colors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 84,
  },
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 16,
  },
});
