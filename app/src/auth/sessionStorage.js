import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "dementia_assistant_demo_session_v1";

export async function loadDemoSession() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export async function saveDemoSession(value) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(value));
  } catch (error) {
    // no-op
  }
}

export async function clearDemoSession() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (error) {
    // no-op
  }
}
