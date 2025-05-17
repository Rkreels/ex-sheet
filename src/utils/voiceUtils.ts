
/**
 * Voice utilities for text-to-speech functionality
 */

// Check if speech synthesis is supported
const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

/**
 * Speak text using the browser's speech synthesis API
 * @param text The text to speak
 */
export const speak = (text: string): void => {
  // Check if speech is supported
  if (!isSpeechSupported) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }
  
  // Check if speech is muted in local storage
  const isMuted = localStorage.getItem('voiceMuted') === 'true';
  if (isMuted) {
    console.log('Voice is muted, not speaking:', text);
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  // Create and configure a new utterance
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 0.8;
  
  // Try to use a more natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Daniel')
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Speak the text
  window.speechSynthesis.speak(utterance);
};

/**
 * Get all available voices
 * @returns Array of available speech voices
 */
export const getVoices = (): SpeechSynthesisVoice[] => {
  if (!isSpeechSupported) {
    console.warn('Speech synthesis not supported in this browser');
    return [];
  }
  
  return window.speechSynthesis.getVoices();
};
