import { initialFamilyUpdates, initialMedications, initialSchedule } from "../data/seed";
import { nowLabel } from "../utils/time";
import { isSupabaseConfigured, supabase } from "./supabase";

function toScheduleRows(calendarEvents) {
  return calendarEvents.map((item) => ({
    id: item.id,
    time: new Date(item.starts_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    title: item.title,
    done: false,
  }));
}

function toMedicationRows(medications) {
  return medications.map((item) => ({
    id: item.id,
    name: item.name,
    time: item.schedule || "Not set",
    taken: false,
    lastTakenAt: null,
  }));
}

function toFamilyRows(feed) {
  return feed.map((item) => ({
    id: item.id,
    message: item.message,
    author: "Family",
    timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));
}

export async function fetchProfile(userId, email) {
  if (!isSupabaseConfigured) {
    return { id: userId, role: "caregiver", full_name: "Demo User" };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", userId)
    .single();

  if (error) {
    const created = await ensureProfile({
      userId,
      email,
      role: "caregiver",
    });

    if (!created.ok) return null;
    return created.profile;
  }
  return data;
}

export async function ensureProfile({ userId, email, role = "caregiver", fullName }) {
  if (!isSupabaseConfigured) {
    return {
      ok: true,
      profile: {
        id: userId,
        role,
        full_name: fullName || "Demo User",
      },
    };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("profiles")
    .select("id, role, full_name")
    .eq("id", userId)
    .single();

  if (!fetchError && existing) {
    return { ok: true, profile: existing };
  }

  const seedName =
    fullName ||
    (email && email.includes("@") ? email.split("@")[0] : "User");

  const { data: inserted, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      role,
      full_name: seedName,
    })
    .select("id, role, full_name")
    .single();

  if (insertError) {
    return {
      ok: false,
      error: insertError.message || "Could not create profile.",
      profile: null,
    };
  }

  return { ok: true, profile: inserted };
}

export async function fetchInitialData(elderId) {
  if (!isSupabaseConfigured) {
    return {
      schedule: initialSchedule,
      medications: initialMedications,
      familyUpdates: initialFamilyUpdates,
    };
  }

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const [{ data: calendarEvents }, { data: medicationRows }, { data: logsRows }, { data: familyRows }] =
    await Promise.all([
      supabase
        .from("calendar_events")
        .select("id, title, starts_at")
        .eq("elder_id", elderId)
        .order("starts_at", { ascending: true }),
      supabase
        .from("medications")
        .select("id, name, schedule")
        .eq("elder_id", elderId)
        .eq("active", true),
      supabase
        .from("medication_logs")
        .select("medication_id, taken_at")
        .eq("elder_id", elderId)
        .gte("taken_at", dayStart.toISOString()),
      supabase
        .from("family_feed")
        .select("id, message, created_at")
        .eq("elder_id", elderId)
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  const medicationState = toMedicationRows(medicationRows || []);
  const lastLogByMedication = {};
  (logsRows || []).forEach((entry) => {
    if (!lastLogByMedication[entry.medication_id] || lastLogByMedication[entry.medication_id] < entry.taken_at) {
      lastLogByMedication[entry.medication_id] = entry.taken_at;
    }
  });

  const medicationWithLogs = medicationState.map((item) => {
    const takenAt = lastLogByMedication[item.id];
    if (!takenAt) return item;
    return {
      ...item,
      taken: true,
      lastTakenAt: new Date(takenAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  });

  return {
    schedule: calendarEvents?.length ? toScheduleRows(calendarEvents) : initialSchedule,
    medications: medicationWithLogs.length ? medicationWithLogs : initialMedications,
    familyUpdates: familyRows?.length ? toFamilyRows(familyRows) : initialFamilyUpdates,
  };
}

export async function logMedicationTaken({ medicationId, elderId, userId, note }) {
  if (!isSupabaseConfigured) return true;

  const { error } = await supabase.from("medication_logs").insert({
    medication_id: medicationId,
    elder_id: elderId,
    logged_by: userId,
    note: note || "Marked as taken from mobile app",
  });

  return !error;
}

export async function postFamilyUpdate({ elderId, userId, message }) {
  if (!isSupabaseConfigured) {
    return {
      id: String(Date.now()),
      message,
      author: "Caregiver",
      timestamp: nowLabel(),
    };
  }

  const { data, error } = await supabase
    .from("family_feed")
    .insert({
      elder_id: elderId,
      author_id: userId,
      message,
    })
    .select("id, message, created_at")
    .single();

  if (error || !data) {
    return {
      id: String(Date.now()),
      message,
      author: "Caregiver",
      timestamp: nowLabel(),
    };
  }

  return {
    id: data.id,
    message: data.message,
    author: "Caregiver",
    timestamp: new Date(data.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}
