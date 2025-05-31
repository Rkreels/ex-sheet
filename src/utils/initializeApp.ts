
import { initializeVoiceTrainer, announceVoiceCommands } from './voiceTrainer';
import voiceAssistant from './voiceAssistant';
import { getBestMaleVoice, testSpeech } from './voiceUtils';

/**
 * Initialize all application features
 */
export const initializeApp = () => {
  // Initialize voice commands
  try {
    initializeVoiceTrainer();
    
    // Test and set up voice after a short delay
    setTimeout(() => {
      // Log available voices for debugging
      const bestVoice = getBestMaleVoice();
      if (bestVoice) {
        console.log('Using voice:', bestVoice.name);
      }
      
      // Welcome message with more natural speech
      voiceAssistant.speak("Welcome to Excel Online! Voice commands are now active. You can say 'help' anytime to hear available commands.");
      
      // Announce commands after welcome
      setTimeout(() => {
        announceVoiceCommands();
      }, 3000);
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
      voiceAssistant.speak("Document saved successfully");
      console.log("Save shortcut triggered");
    }
    
    // Ctrl+F for Find
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      const findButton = document.querySelector('[data-voice-command="find"]');
      if (findButton) {
        (findButton as HTMLElement).click();
        voiceAssistant.speak("Find dialog opened");
      }
    }
    
    // Ctrl+H for voice help
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      voiceAssistant.speak("Here are the available voice commands");
      setTimeout(() => {
        const helpButton = document.querySelector('[data-voice-hover="voice help"]');
        if (helpButton) {
          (helpButton as HTMLElement).click();
        }
      }, 1000);
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
    voiceAssistant.speak("Sheet has been updated");
  });
  
  // Monitor visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log("App visibility: active");
    } else {
      console.log("App visibility: hidden");
    }
  });
  
  // Add voice test button for debugging (development only)
  if (process.env.NODE_ENV === 'development') {
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Voice';
    testButton.style.cssText = 'position:fixed;top:10px;left:10px;z-index:9999;padding:5px;background:#007bff;color:white;border:none;border-radius:3px;font-size:12px;';
    testButton.onclick = () => voiceAssistant.testVoice();
    document.body.appendChild(testButton);
  }
};

export default initializeApp;
