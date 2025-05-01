
class VoiceAssistant {
  private static instance: VoiceAssistant;
  private isMuted: boolean = false;
  private synth: SpeechSynthesis;

  private constructor() {
    this.synth = window.speechSynthesis;
    if (!this.synth) {
      console.error("SpeechSynthesis not supported in this browser.");
    }
  }

  public static getInstance(): VoiceAssistant {
    if (!VoiceAssistant.instance) {
      VoiceAssistant.instance = new VoiceAssistant();
    }
    return VoiceAssistant.instance;
  }

  public speak(message: string): void {
    if (this.isMuted || !this.synth) return;

    this.synth.cancel(); // Cancel ongoing speech
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1;  // Normal speaking rate
    utterance.pitch = 1; // Normal pitch
    this.synth.speak(utterance);
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.synth.cancel();
    } else {
      this.speak("Voice assistant activated");
    }
  }

  public announceDemoData(): void {
    this.speak("Demo data loaded. Try creating a chart or sorting data.");
  }
  
  public bindHoverSpeak(): void {
    // When the DOM is ready, bind voice to elements with data-voice-hover
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const elements = document.querySelectorAll('[data-voice-hover]');
        elements.forEach(element => {
          element.addEventListener('mouseenter', () => {
            const message = element.getAttribute('data-voice-hover');
            if (message) {
              this.speak(message);
            }
          });
        });
      }, 1000);
    });
  }
}

export default VoiceAssistant.getInstance();
