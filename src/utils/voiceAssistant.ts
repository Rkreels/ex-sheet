import { speak } from './voiceUtils';

const voiceAssistant = {
  speak: (text: string) => {
    speak(text);
  },
  toggleMute: (): boolean => {
    const isMuted = localStorage.getItem('voiceMuted') === 'true';
    localStorage.setItem('voiceMuted', (!isMuted).toString());
    return !isMuted;
  },
  bindHoverSpeak: () => {
    // Implementation for binding hover speak
    console.log('Voice hover speak bound');
  },
  // Add the missing registerCommand function
  registerCommand: (command: string, handler: () => void) => {
    if (!window.voiceCommands) {
      window.voiceCommands = {};
    }
    window.voiceCommands[command.toLowerCase()] = handler;
  }
};

// Add the voiceCommands interface to Window
declare global {
  interface Window {
    voiceCommands?: Record<string, () => void>;
  }
}

export default voiceAssistant;
