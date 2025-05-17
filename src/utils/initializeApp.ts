
import { initializeVoiceTrainer, announceVoiceCommands } from './voiceTrainer';
import voiceAssistant from './voiceAssistant';

/**
 * Initialize all application features
 */
export const initializeApp = () => {
  // Initialize voice commands
  try {
    initializeVoiceTrainer();
    
    // Welcome message
    setTimeout(() => {
      voiceAssistant.speak("Welcome to Excel Online. Voice commands are enabled.");
      announceVoiceCommands();
    }, 1500);
  } catch (error) {
    console.error("Error initializing voice trainer:", error);
  }
  
  // Initialize global keyboard shortcuts
  initializeKeyboardShortcuts();
  
  // Set up event listeners for application-wide events
  setupGlobalEvents();
  
  console.log("Application initialized successfully");
};

/**
 * Initialize keyboard shortcuts for the application
 */
const initializeKeyboardShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    // Ctrl+S for Save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      voiceAssistant.speak("Document saved");
      console.log("Save shortcut triggered");
    }
    
    // Ctrl+F for Find
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      const findButton = document.querySelector('[data-voice-command="find"]');
      if (findButton) {
        (findButton as HTMLElement).click();
      }
    }
  });
};

/**
 * Setup global event listeners
 */
const setupGlobalEvents = () => {
  // Listen for custom events
  document.addEventListener('sheet-changed', (e: Event) => {
    console.log("Sheet changed event detected");
  });
  
  // Monitor visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log("App visibility: active");
    } else {
      console.log("App visibility: hidden");
    }
  });
};

export default initializeApp;
