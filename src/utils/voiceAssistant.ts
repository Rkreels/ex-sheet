
class VoiceAssistant {
  private static instance: VoiceAssistant;
  private isMuted: boolean = false;
  private synth: SpeechSynthesis;
  private voiceGuides: Record<string, string> = {};
  private isInitialized: boolean = false;
  private voiceURI: string = '';
  private rate: number = 1;
  private pitch: number = 1;
  private volume: number = 0.8;

  private constructor() {
    this.synth = window.speechSynthesis;
    if (!this.synth) {
      console.error("SpeechSynthesis not supported in this browser.");
    }
    
    // Initialize voice guides for Excel features
    this.initializeVoiceGuides();
    
    // Try to find a better voice
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        this.initializeVoices();
      }, 1000);
    });
  }

  private initializeVoices() {
    try {
      if (this.synth && this.synth.getVoices) {
        const voices = this.synth.getVoices();
        // Try to find a natural sounding voice
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || 
          voice.name.includes('Google') || 
          voice.name.includes('Natural')
        );
        
        if (preferredVoice) {
          this.voiceURI = preferredVoice.voiceURI;
        }
        
        this.isInitialized = true;
      }
    } catch (error) {
      console.error("Error initializing voice assistant voices:", error);
    }
  }

  private initializeVoiceGuides() {
    // Excel feature guides
    this.voiceGuides = {
      // Clipboard section
      "paste": "Paste content from clipboard into the selected cell or range.",
      "cut": "Cut selected cells to clipboard.",
      "copy": "Copy selected cells to clipboard.",
      "format_painter": "Copy formatting from one cell and apply it to others.",
      
      // Font section
      "font_family": "Change the font type of the selected text.",
      "font_size": "Change the size of the selected text.",
      "bold": "Make the selected text bold.",
      "italic": "Make the selected text italic.",
      "underline": "Underline the selected text.",
      "currency_format": "Format the selected cells as currency.",
      "percent_format": "Format the selected cells as percentage.",
      
      // Alignment section
      "align_left": "Align text to the left of the cell.",
      "align_center": "Align text to the center of the cell.",
      "align_right": "Align text to the right of the cell.",
      "wrap_text": "Wrap text within a cell to display all content.",
      "merge_center": "Merge selected cells and center content.",
      
      // Number format section
      "number_format": "Change how numbers are displayed, like dates, currency or percentages.",
      
      // Cells section
      "insert_cell": "Insert a new cell and shift others to make room.",
      "delete_cell": "Delete selected cells and shift others to fill the gap.",
      "format_cell": "Change the appearance of selected cells with colors or borders.",
      
      // Editing section
      "autosum": "Automatically sum numbers in selected range.",
      "fill": "Copy formulas or patterns to adjacent cells.",
      "clear_formatting": "Remove all formatting from selected cells.",
      "sort_ascending": "Sort data from lowest to highest or A to Z.",
      "sort_descending": "Sort data from highest to lowest or Z to A.",
      "find": "Find specific data in your spreadsheet.",
      
      // History section
      "undo": "Undo the last action.",
      "redo": "Redo the previously undone action.",
      "print": "Print the current spreadsheet.",
      
      // Formula guides
      "formula_sum": "The SUM function adds all numbers in a range of cells.",
      "formula_average": "The AVERAGE function calculates the average of numbers in a range.",
      "formula_count": "The COUNT function counts cells that contain numbers.",
      "formula_max": "The MAX function returns the largest number in a range.",
      "formula_min": "The MIN function returns the smallest number in a range.",
      "formula_if": "The IF function performs a logical test and returns one value if true, another if false.",
      "formula_vlookup": "VLOOKUP searches for a value in the first column of a range and returns a value in the same row from a specified column.",
      
      // Context-sensitive help
      "cell_selected": "Cell selected. Use arrow keys to navigate or type to edit.",
      "range_selected": "Range selected. Use Ctrl+C to copy or Ctrl+X to cut.",
      "formula_bar": "Type an equals sign to begin a formula.",
      
      // Feature explanations
      "conditional_formatting": "Conditional formatting highlights cells that meet specific criteria.",
      "pivot_tables": "Pivot tables summarize data to provide insights from large datasets.",
      "data_validation": "Data validation restricts what values can be entered in a cell."
    };
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
    
    // Use best available voice
    if (this.isInitialized && this.voiceURI) {
      utterance.voice = this.synth.getVoices().find(voice => voice.voiceURI === this.voiceURI) || null;
    }
    
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;
    
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
  
  public explainFeature(featureKey: string): void {
    const explanation = this.voiceGuides[featureKey];
    if (explanation) {
      this.speak(explanation);
    }
  }
  
  public setRate(rate: number): void {
    this.rate = Math.max(0.5, Math.min(2, rate)); // Limit between 0.5 and 2
  }
  
  public setPitch(pitch: number): void {
    this.pitch = Math.max(0.5, Math.min(2, pitch)); // Limit between 0.5 and 2
  }
  
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume)); // Limit between 0 and 1
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

  // New method for formula-specific guidance
  public provideFormulaHelp(formulaName: string): void {
    const normalizedName = formulaName.toLowerCase();
    const key = `formula_${normalizedName}`;
    
    if (this.voiceGuides[key]) {
      this.speak(this.voiceGuides[key]);
    } else {
      this.speak(`${formulaName} is a formula function. Enter parameters within parentheses.`);
    }
  }

  // Help with specific tasks
  public provideContextualHelp(context: string): void {
    switch(context) {
      case 'chart_creation':
        this.speak('To create a chart, first select the data range, then choose a chart type from the ribbon.');
        break;
      case 'sort':
        this.speak('To sort data, select a column and click the sort button.');
        break;
      case 'filter':
        this.speak('To filter data, click on the column header and select filter criteria.');
        break;
      case 'cell_format':
        this.speak('To format cells, select them and use the formatting options in the ribbon.');
        break;
      default:
        this.speak('What would you like help with? Try selecting a feature from the ribbon.');
    }
  }
}

export default VoiceAssistant.getInstance();
