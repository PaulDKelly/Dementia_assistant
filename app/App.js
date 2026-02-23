import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthScreen from "./src/auth/AuthScreen";
import { clearDemoSession, loadDemoSession, saveDemoSession } from "./src/auth/sessionStorage";
import BottomTabs from "./src/components/BottomTabs";
import { createQaChecklist } from "./src/data/qaChecklist";
import { initialFamilyUpdates, initialMedications, initialSchedule } from "./src/data/seed";
import {
  ensureProfile,
  fetchInitialData,
  fetchProfile,
  logMedicationTaken,
  postFamilyUpdate,
} from "./src/lib/repository";
import { isSupabaseConfigured, supabase } from "./src/lib/supabase";
import AdminScreen from "./src/screens/AdminScreen";
import FamilyScreen from "./src/screens/FamilyScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MedicationScreen from "./src/screens/MedicationScreen";
import QAScreen from "./src/screens/QAScreen";
import TalkScreen from "./src/screens/TalkScreen";
import TodayScreen from "./src/screens/TodayScreen";
import { clearAppState, loadAppState, saveAppState } from "./src/storage/appState";
import { colors } from "./src/theme/colors";
import { nowLabel } from "./src/utils/time";

const ROLE_TABS = {
  elder: ["Home", "Today", "Talk"],
  caregiver: ["Home", "Today", "Medication", "Family", "Talk", "QA"],
  admin: ["Home", "Today", "Medication", "Family", "Talk", "QA", "Admin"],
};

function defaultState() {
  return {
    schedule: initialSchedule,
    medications: initialMedications,
    familyUpdates: initialFamilyUpdates,
    lastTalkMessage: "No message sent yet",
    mood: "Calm",
    qaChecklist: createQaChecklist(),
    qaNotes: "",
  };
}

function toTitleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function App() {
  const [activeTab, setActiveTab] = useState("Home");

  const [schedule, setSchedule] = useState(initialSchedule);
  const [medications, setMedications] = useState(initialMedications);
  const [familyUpdates, setFamilyUpdates] = useState(initialFamilyUpdates);
  const [lastTalkMessage, setLastTalkMessage] = useState("No message sent yet");
  const [mood, setMood] = useState("Calm");
  const [qaChecklist, setQaChecklist] = useState(createQaChecklist());
  const [qaNotes, setQaNotes] = useState("");

  const [authMode, setAuthMode] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [elderId, setElderId] = useState(null);

  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [dataError, setDataError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const role = profile?.role || "caregiver";
  const tabs = ROLE_TABS[role] || ROLE_TABS.caregiver;
  const isAuthenticated = Boolean(session && profile);
  const scopeKey = elderId ? `${authMode}:${elderId}` : `${authMode}:anonymous`;

  useEffect(() => {
    if (!tabs.includes(activeTab)) setActiveTab("Home");
  }, [tabs, activeTab]);

  useEffect(() => {
    let unsubscribe = null;
    let isMounted = true;

    const bootstrapAuth = async () => {
      if (isSupabaseConfigured) {
        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        if (data.session) {
          setSession(data.session);
          setAuthMode("supabase");
        }

        const authListener = supabase.auth.onAuthStateChange((_event, nextSession) => {
          setSession(nextSession);
          setAuthMode(nextSession ? "supabase" : null);
          if (!nextSession) {
            setProfile(null);
            setElderId(null);
          }
        });
        unsubscribe = () => authListener.data.subscription.unsubscribe();
      } else {
        const demoSession = await loadDemoSession();
        if (!isMounted) return;

        if (demoSession) {
          setAuthMode("demo");
          setSession({ user: { id: demoSession.userId } });
          setProfile({
            id: demoSession.userId,
            role: demoSession.role,
            full_name: demoSession.fullName,
          });
          setElderId(demoSession.elderId);
        }
      }

      setAuthReady(true);
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!authReady || authMode !== "supabase" || !session?.user?.id) return;
      setIsDataLoading(true);
      setAuthError("");

      const nextProfile = await fetchProfile(session.user.id, session.user.email);
      if (!isMounted) return;
      if (!nextProfile) {
        setAuthError("Unable to load profile. Please sign in again.");
        setIsDataLoading(false);
        return;
      }
      setProfile(nextProfile);
      setElderId(nextProfile.id);
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [authReady, authMode, session?.user?.id]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!authReady || !isAuthenticated || !elderId) return;

      setIsDataLoading(true);
      const persisted = await loadAppState();
      if (!isMounted) return;

      if (persisted && persisted.scopeKey === scopeKey) {
        if (Array.isArray(persisted.schedule)) setSchedule(persisted.schedule);
        if (Array.isArray(persisted.medications)) setMedications(persisted.medications);
        if (Array.isArray(persisted.familyUpdates)) setFamilyUpdates(persisted.familyUpdates);
        if (typeof persisted.lastTalkMessage === "string") setLastTalkMessage(persisted.lastTalkMessage);
        if (typeof persisted.mood === "string") setMood(persisted.mood);
        if (Array.isArray(persisted.qaChecklist)) setQaChecklist(persisted.qaChecklist);
        if (typeof persisted.qaNotes === "string") setQaNotes(persisted.qaNotes);
      } else {
        const defaults = defaultState();
        setSchedule(defaults.schedule);
        setMedications(defaults.medications);
        setFamilyUpdates(defaults.familyUpdates);
        setLastTalkMessage(defaults.lastTalkMessage);
        setMood(defaults.mood);
        setQaChecklist(defaults.qaChecklist);
        setQaNotes(defaults.qaNotes);
      }

      const remote = await fetchInitialData(elderId);
      if (!isMounted) return;

      if (!remote) {
        setDataError("Unable to load remote data. Showing local data.");
      } else {
        setDataError("");
      }
      if (remote?.schedule) setSchedule(remote.schedule);
      if (remote?.medications) setMedications(remote.medications);
      if (remote?.familyUpdates) setFamilyUpdates(remote.familyUpdates);
      setIsDataLoading(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [authReady, isAuthenticated, elderId, scopeKey, reloadToken]);

  useEffect(() => {
    if (!authReady || !isAuthenticated || isDataLoading) return;

    saveAppState({
      scopeKey,
      schedule,
      medications,
      familyUpdates,
      lastTalkMessage,
      mood,
      qaChecklist,
      qaNotes,
    });
  }, [
    authReady,
    isAuthenticated,
    isDataLoading,
    scopeKey,
    schedule,
    medications,
    familyUpdates,
    lastTalkMessage,
    mood,
    qaChecklist,
    qaNotes,
  ]);

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

  const toggleMedicationTaken = async (id) => {
    const target = medications.find((item) => item.id === id);
    const markTaken = target ? !target.taken : false;

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

    if (markTaken && elderId && session?.user?.id) {
      await logMedicationTaken({
        medicationId: id,
        elderId,
        userId: session.user.id,
      });
    }
  };

  const addFamilyUpdate = async (message) => {
    const saved = await postFamilyUpdate({
      elderId,
      userId: session?.user?.id,
      message,
    });

    setFamilyUpdates((current) => [saved, ...current]);
  };

  const sendTalkMessage = (message) => {
    setLastTalkMessage(`${message} (${nowLabel()})`);
  };

  const resetLocalData = async () => {
    await clearAppState();
    const defaults = defaultState();
    setSchedule(defaults.schedule);
    setMedications(defaults.medications);
    setFamilyUpdates(defaults.familyUpdates);
    setLastTalkMessage(defaults.lastTalkMessage);
    setMood(defaults.mood);
    setQaChecklist(defaults.qaChecklist);
    setQaNotes(defaults.qaNotes);
  };

  const toggleQaItem = (id) => {
    setQaChecklist((current) =>
      current.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const resetQaChecklist = () => {
    setQaChecklist(createQaChecklist());
    setQaNotes("");
  };

  const handleDemoLogin = async (selectedRole) => {
    const userId = `demo-${selectedRole}`;
    const demoSession = {
      userId,
      role: selectedRole,
      fullName: `Demo ${toTitleCase(selectedRole)}`,
      elderId: selectedRole === "elder" ? userId : "demo-elder-1",
    };

    await saveDemoSession(demoSession);
    setAuthMode("demo");
    setSession({ user: { id: demoSession.userId } });
    setProfile({
      id: demoSession.userId,
      role: demoSession.role,
      full_name: demoSession.fullName,
    });
    setElderId(demoSession.elderId);
    setActiveTab("Home");
  };

  const handleSupabaseLogin = async (email, password, options) => {
    if (!isSupabaseConfigured) return { ok: false, error: "Supabase is not configured." };
    setAuthLoading(true);
    setAuthError("");
    setDataError("");

    if (options?.mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setAuthLoading(false);
        return { ok: false, error: error.message };
      }

      if (data?.user) {
        const profileResult = await ensureProfile({
          userId: data.user.id,
          email: data.user.email,
          role: options.role || "caregiver",
          fullName: data.user.email ? data.user.email.split("@")[0] : "User",
        });

        if (!profileResult.ok) {
          setAuthLoading(false);
          return { ok: false, error: profileResult.error };
        }
      }

      setAuthLoading(false);
      if (!data.session) {
        return { ok: true, notice: "Account created. Check your email to verify before signing in." };
      }
      return { ok: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) return { ok: false, error: error.message };

    if (data?.user) {
      const profileResult = await ensureProfile({
        userId: data.user.id,
        email: data.user.email,
        role: "caregiver",
      });
      if (!profileResult.ok) {
        return { ok: false, error: profileResult.error };
      }
    }

    return { ok: true };
  };

  const logout = async () => {
    if (authMode === "supabase" && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    await clearDemoSession();
    setSession(null);
    setProfile(null);
    setElderId(null);
    setAuthMode(null);
    setAuthError("");
    setDataError("");
    setActiveTab("Home");
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
      return (
        <TodayScreen schedule={schedule} onToggleDone={toggleEventDone} setMood={setMood} mood={mood} />
      );
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

    if (activeTab === "Admin") {
      return <AdminScreen profile={profile} onResetLocalData={resetLocalData} />;
    }

    if (activeTab === "QA") {
      return (
        <QAScreen
          checklist={qaChecklist}
          notes={qaNotes}
          onToggleItem={toggleQaItem}
          onChangeNotes={setQaNotes}
          onResetChecklist={resetQaChecklist}
        />
      );
    }

    return <TalkScreen onSendMessage={sendTalkMessage} lastTalkMessage={lastTalkMessage} />;
  };

  if (!authReady) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Starting app...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <AuthScreen
          onDemoLogin={handleDemoLogin}
          onSupabaseLogin={handleSupabaseLogin}
          loading={authLoading}
        />
      </SafeAreaView>
    );
  }

  if (authError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingState}>
          <Text style={styles.errorTitle}>Authentication Error</Text>
          <Text style={styles.errorText}>{authError}</Text>
          <TouchableOpacity onPress={logout} style={styles.retryButton}>
            <Text style={styles.retryLabel}>Return to Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isDataLoading) {
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
        <View>
          <Text style={styles.title}>Dementia Assistant</Text>
          <Text style={styles.subtitle}>
            {profile?.full_name || "User"} ({role})
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutLabel}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>{renderScreen()}</View>
      {dataError ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{dataError}</Text>
          <TouchableOpacity onPress={() => setReloadToken((value) => value + 1)}>
            <Text style={styles.bannerAction}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <BottomTabs tabs={tabs} activeTab={activeTab} onSelect={setActiveTab} />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  logoutLabel: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 13,
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
  errorTitle: {
    fontSize: 24,
    color: "#991B1B",
    fontWeight: "700",
  },
  errorText: {
    marginTop: 8,
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 15,
    marginBottom: 12,
  },
  retryButton: {
    borderRadius: 10,
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryLabel: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  banner: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 72,
    borderRadius: 10,
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FBCFE8",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerText: {
    color: "#9D174D",
    flex: 1,
    marginRight: 8,
    fontSize: 13,
  },
  bannerAction: {
    color: colors.accent,
    fontWeight: "700",
  },
});
