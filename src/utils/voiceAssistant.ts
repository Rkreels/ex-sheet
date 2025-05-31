
import { speak, getVoices, getBestMaleVoice } from './voiceUtils';
import { toast } from 'sonner';
import { createVoiceCommandHandler } from './voiceCommands';

// Check if speech recognition is supported
const isSpeechRecognitionSupported = typeof window !== 'undefined' && 
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

// Create speech recognition instance if supported
const SpeechRecognition = isSpeechRecognitionSupported ? 
  (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

let recognition: any = null;
let commandHandler: ReturnType<typeof createVoiceCommandHandler> | null = null;

/**
 * Initialize voice assistant with command handlers
 * @param commandHandlers Object containing command handler functions
 * @returns boolean indicating if voice assistant is supported
 */
export const initVoiceAssistant = (commandHandlers: Record<string, Function>): boolean => {
  if (!isSpeechRecognitionSupported) {
    console.warn('Speech recognition not supported in this browser');
    return false;
  }
  
  try {
    // Initialize speech recognition
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    // Create command handler with the provided handlers
    commandHandler = createVoiceCommandHandler(commandHandlers);
    
    // Set up speech recognition event handlers
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      console.log('Voice command recognized:', transcript);
      
      // Handle the command
      const handled = commandHandler?.handleCommand(transcript);
      if (!handled) {
        speak("I didn't understand that command. Please try again or say 'help' for available commands.");
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      const errorMessages = {
        'no-speech': "No speech was detected. Please try speaking again.",
        'audio-capture': "Microphone is not available. Please check your microphone settings.",
        'not-allowed': "Microphone access was denied. Please allow microphone access and try again.",
        'network': "Network error occurred. Please check your internet connection.",
        'aborted': "Voice recognition was cancelled.",
      };
      
      const message = errorMessages[event.error as keyof typeof errorMessages] || 
                     `Voice recognition error: ${event.error}`;
      
      toast.error(message);
      speak(message);
    };
    
    // Register global commands on window
    registerGlobalCommands();
    
    console.log('Voice assistant initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize voice assistant:', error);
    return false;
  }
};

/**
 * Start voice recognition
 * @returns boolean indicating if recognition was started
 */
export const startVoiceRecognition = (): boolean => {
  if (!recognition) {
    console.warn('Voice recognition not initialized');
    return false;
  }
  
  try {
    recognition.start();
    console.log('Voice recognition started');
    return true;
  } catch (error) {
    console.error('Error starting voice recognition:', error);
    return false;
  }
};

/**
 * Stop voice recognition
 * @returns boolean indicating if recognition was stopped
 */
export const stopVoiceRecognition = (): boolean => {
  if (!recognition) {
    console.warn('Voice recognition not initialized');
    return false;
  }
  
  try {
    recognition.stop();
    console.log('Voice recognition stopped');
    return true;
  } catch (error) {
    console.error('Error stopping voice recognition:', error);
    return false;
  }
};

/**
 * Show available voice commands
 */
export const showVoiceCommandsHelp = () => {
  if (!commandHandler) {
    toast.error('Voice commands not initialized');
    return;
  }
  
  const commands = commandHandler.getCommandsHelp();
  
  // Create dialog with command list
  const dialog = document.createElement('dialog');
  dialog.className = 'fixed inset-0 z-50 bg-white/95 p-6 shadow-lg rounded-md w-[500px] max-h-[80vh] overflow-auto';
  
  dialog.innerHTML = `
    <h2 class="text-xl font-bold mb-4">Available Voice Commands</h2>
    <p class="mb-4">Say "voice command" and then one of the following commands:</p>
    <div class="grid grid-cols-1 gap-2">
      ${commands.map(cmd => `
        <div class="border p-3 rounded-lg bg-gray-50">
          <div class="font-medium text-blue-600">${cmd.name}</div>
          <div class="text-sm text-gray-700 mt-1">${cmd.description}</div>
          <div class="text-xs italic text-gray-500 mt-1">Say: "${cmd.example}"</div>
        </div>
      `).join('')}
    </div>
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
  `;
  
  document.body.appendChild(dialog);
  dialog.showModal();
  
  dialog.querySelector('button')?.addEventListener('click', () => {
    dialog.close();
    dialog.remove();
  });
  
  // Speak a more natural introduction
  speak("Here are the voice commands you can use. For example, try saying 'make this bold', 'center align', or 'sort ascending'. You can also say 'help' anytime for assistance.");
};

/**
 * Register global voice commands
 */
const registerGlobalCommands = () => {
  // Implement global command registration
  if (window.voiceCommands) {
    window.voiceCommands['help'] = () => showVoiceCommandsHelp();
    window.voiceCommands['show commands'] = () => showVoiceCommandsHelp();
    window.voiceCommands['voice commands'] = () => showVoiceCommandsHelp();
    window.voiceCommands['what can i say'] = () => showVoiceCommandsHelp();
    window.voiceCommands['available commands'] = () => showVoiceCommandsHelp();
  }
};

/**
 * Voice assistant with speech and command functionality
 */
const voiceAssistant = {
  speak: (text: string) => {
    // Make speech more conversational
    const naturalText = text
      .replace(/(\w)([A-Z])/g, '$1 $2') // Add space before capital letters
      .replace(/([a-z])(\d)/g, '$1 $2') // Add space before numbers
      .replace(/(\d)([a-z])/g, '$1 $2') // Add space after numbers
      .toLowerCase()
      .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
    
    speak(naturalText);
  },
  
  toggleMute: (): boolean => {
    const isMuted = localStorage.getItem('voiceMuted') === 'true';
    localStorage.setItem('voiceMuted', (!isMuted).toString());
    
    if (!isMuted) {
      speak("Voice output is now muted.");
    } else {
      speak("Voice output is now enabled. Welcome back!");
    }
    
    return !isMuted;
  },
  
  bindHoverSpeak: () => {
    // Implementation for binding hover speak to elements with data-voice-hover attribute
    setTimeout(() => {
      const elements = document.querySelectorAll('[data-voice-hover]');
      
      elements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          const text = (el as HTMLElement).dataset.voiceHover;
          if (text) {
            // Make hover text more natural
            const naturalText = text
              .replace(/([a-z])([A-Z])/g, '$1 $2')
              .toLowerCase();
            speak(naturalText);
          }
        });
      });
      
      console.log(`Voice hover speak bound to ${elements.length} elements`);
    }, 2000);
  },
  
  registerCommand: (command: string, handler: () => void) => {
    if (!window.voiceCommands) {
      window.voiceCommands = {};
    }
    window.voiceCommands[command.toLowerCase()] = handler;
  },
  
  // Test the improved voice
  testVoice: () => {
    const testMessage = "Hello! This is the improved voice output. It should sound much more natural and easier to understand. The voice is now configured to use a clearer male voice with better pronunciation and natural pauses.";
    speak(testMessage);
  }
};

export default voiceAssistant;
