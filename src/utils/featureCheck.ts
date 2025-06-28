
/**
 * Check for missing features and provide development feedback
 */
export const getMissingFeatures = (): string[] => {
  const missingFeatures: string[] = [];
  
  // Check for Web APIs
  if (!('speechSynthesis' in window)) {
    missingFeatures.push('Speech Synthesis API');
  }
  
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    missingFeatures.push('Speech Recognition API');
  }
  
  if (!('localStorage' in window)) {
    missingFeatures.push('Local Storage');
  }
  
  if (!('indexedDB' in window)) {
    missingFeatures.push('IndexedDB');
  }
  
  // Check for modern JS features
  try {
    new IntersectionObserver(() => {});
  } catch (e) {
    missingFeatures.push('Intersection Observer API');
  }
  
  return missingFeatures;
};

export const checkBrowserCompatibility = (): boolean => {
  const requiredFeatures = [
    'Promise',
    'fetch',
    'Map',
    'Set',
    'Symbol'
  ];
  
  return requiredFeatures.every(feature => feature in window);
};
