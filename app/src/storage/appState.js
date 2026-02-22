import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dementia_assistant_app_state_v1";

export async function loadAppState() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export async function saveAppState(value) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    // Best-effort persistence: app remains usable even if storage fails.
  }
}

export async function clearAppState() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // no-op
  }
}
