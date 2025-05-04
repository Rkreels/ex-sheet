
import { toast } from 'sonner';
import { createVoiceCommandHandler, VoiceCommand } from './voiceCommands';

let recognition: any = null;
let commandHandlers: any = {};
let voiceCommands: any = null;

export const initVoiceAssistant = (handlers: Record<string, Function>) => {
  commandHandlers = handlers;
  voiceCommands = createVoiceCommandHandler(handlers);
  
  try {
    // @ts-ignore - SpeechRecognition is not in the TypeScript types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice command:', transcript);
        processVoiceCommand(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast.error('Voice command error: ' + event.error);
      };
      
      // Add data-voice-hover attributes to all interactive elements
      addVoiceHoverAttributes();
      
      // Enable voice hover for commands
      enableVoiceHover();
      
      return true;
    }
  } catch (e) {
    console.error('Speech recognition not supported', e);
  }
  
  return false;
};

export const startVoiceRecognition = () => {
  if (recognition) {
    try {
      recognition.start();
      toast.info('Listening for voice commands...');
      return true;
    } catch (e) {
      console.error('Could not start voice recognition', e);
      return false;
    }
  }
  return false;
};

export const stopVoiceRecognition = () => {
  if (recognition) {
    try {
      recognition.stop();
      return true;
    } catch (e) {
      console.error('Could not stop voice recognition', e);
      return false;
    }
  }
  return false;
};

export const processVoiceCommand = (command: string) => {
  if (voiceCommands) {
    voiceCommands.handleCommand(command);
  }
};

export const showVoiceCommandsHelp = () => {
  if (voiceCommands) {
    const commands = voiceCommands.getCommandsHelp();
    // Display help in a modal or toast
    toast.info('Voice commands available. Try saying: "bold", "copy", "paste", etc.');
  }
};

// Add data-voice-hover attributes to elements based on their function
const addVoiceHoverAttributes = () => {
  // This could be expanded to automatically add voice hover attributes to buttons based on icons or text
  document.querySelectorAll('button:not([data-voice-hover])').forEach(button => {
    const text = button.textContent?.trim().toLowerCase();
    if (text) {
      // Set data-voice-hover based on button text
      button.setAttribute('data-voice-hover', text);
    }
  });
};

// Enable hover detection for voice commands
const enableVoiceHover = () => {
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    const voiceHover = target.getAttribute('data-voice-hover');
    
    if (voiceHover) {
      // Could show a small tooltip with the voice command
      // or integrate with an existing tooltip system
    }
  });
};

// Export the commands for use in other components
export const getVoiceCommands = () => {
  return voiceCommands ? voiceCommands.commands : [];
};
