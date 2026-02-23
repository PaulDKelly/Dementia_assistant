import * as Speech from "expo-speech";

export async function speakText(text) {
  if (!text) return;
  try {
    const available = await Speech.isSpeakingAsync();
    if (available) {
      Speech.stop();
    }
    Speech.speak(text, {
      language: "en-US",
      pitch: 1.0,
      rate: 0.95,
    });
  } catch (error) {
    // no-op fallback when speech is not available in current runtime
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch (error) {
    // no-op
  }
}
