
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
  
  // Configure for more natural speech
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0; // Normal pitch
  utterance.volume = 0.7; // Comfortable volume
  
  // Wait a bit for voices to load, then select the best male voice
  const selectBestVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for natural male voices
    const preferredVoices = [
      // English male voices (common names)
      'Google UK English Male',
      'Microsoft David Desktop',
      'Microsoft Mark',
      'Alex', // macOS
      'Daniel', // Some systems
      'Microsoft David',
      'Google US English Male',
      'Chrome OS US English 5', // Male voice on Chrome OS
      'Chrome OS US English 8', // Another male option
      // Fallback to any male voice
      voices.find(voice => 
        voice.name.toLowerCase().includes('male') && 
        voice.lang.startsWith('en')
      ),
      // Fallback to clear English voices
      voices.find(voice => 
        voice.name.toLowerCase().includes('david') ||
        voice.name.toLowerCase().includes('mark') ||
        voice.name.toLowerCase().includes('alex') ||
        voice.name.toLowerCase().includes('daniel')
      ),
      // Final fallback to any English voice that's not explicitly female
      voices.find(voice => 
        voice.lang.startsWith('en') && 
        !voice.name.toLowerCase().includes('female') &&
        !voice.name.toLowerCase().includes('zira') &&
        !voice.name.toLowerCase().includes('cortana')
      )
    ];
    
    // Find the first available preferred voice
    for (const voiceName of preferredVoices) {
      if (typeof voiceName === 'string') {
        const voice = voices.find(v => v.name === voiceName);
        if (voice) {
          utterance.voice = voice;
          console.log('Selected voice:', voice.name);
          break;
        }
      } else if (voiceName) {
        utterance.voice = voiceName;
        console.log('Selected voice:', voiceName.name);
        break;
      }
    }
    
    // If no preferred voice found, use default but log available voices
    if (!utterance.voice) {
      console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
    }
  };
  
  // Try to select voice immediately
  selectBestVoice();
  
  // If no voices loaded yet, wait and try again
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      selectBestVoice();
      window.speechSynthesis.onvoiceschanged = null; // Remove listener
    };
  }
  
  // Add natural pauses for better speech flow
  const processedText = text
    .replace(/\./g, '. ') // Add pause after periods
    .replace(/,/g, ', ') // Add pause after commas
    .replace(/:/g, ': ') // Add pause after colons
    .replace(/;/g, '; ') // Add pause after semicolons
    .replace(/\s+/g, ' ') // Clean up extra spaces
    .trim();
  
  utterance.text = processedText;
  
  // Add event handlers for better control
  utterance.onstart = () => {
    console.log('Speech started:', processedText);
  };
  
  utterance.onend = () => {
    console.log('Speech ended');
  };
  
  utterance.onerror = (event) => {
    console.error('Speech error:', event.error);
  };
  
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

/**
 * Get the best available male voice for English
 * @returns The best male English voice or null
 */
export const getBestMaleVoice = (): SpeechSynthesisVoice | null => {
  const voices = getVoices();
  
  // Look for specific high-quality male voices
  const preferredMaleVoices = [
    'Google UK English Male',
    'Microsoft David Desktop',
    'Microsoft Mark',
    'Alex',
    'Daniel',
    'Microsoft David',
    'Google US English Male'
  ];
  
  for (const voiceName of preferredMaleVoices) {
    const voice = voices.find(v => v.name === voiceName);
    if (voice) return voice;
  }
  
  // Fallback to any male voice
  return voices.find(voice => 
    voice.name.toLowerCase().includes('male') && 
    voice.lang.startsWith('en')
  ) || null;
};

/**
 * Test speech with current settings
 */
export const testSpeech = (): void => {
  speak("This is a test of the improved voice output. The speech should sound more natural and clearer.");
};
