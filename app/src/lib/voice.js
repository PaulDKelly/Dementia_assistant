import * as Speech from "expo-speech";

export async function speakText(text, options = {}) {
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
      onStart: options.onStart,
      onDone: options.onDone,
      onStopped: options.onStopped,
      onError: options.onError,
    });
  } catch (error) {
    // no-op fallback when speech is not available in current runtime
    if (options.onError) options.onError(error);
  }
}

export function stopSpeaking() {
  try {
    Speech.stop();
  } catch (error) {
    // no-op
  }
}
