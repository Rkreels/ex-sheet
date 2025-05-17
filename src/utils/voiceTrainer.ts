
import voiceAssistant from './voiceAssistant';

/**
 * Voice command trainer for Excel-like application
 * This module helps initialize all available voice commands for the application
 */

export const initializeVoiceTrainer = () => {
  // Initialize spreadsheet navigation commands
  const cellCommands = [
    { name: "go to cell", handler: (args: string) => {
      const cell = args.toUpperCase();
      const cellElement = document.querySelector(`[data-cell-id="${cell}"]`);
      if (cellElement) {
        (cellElement as HTMLElement).click();
        return `Navigated to cell ${cell}`;
      }
      return `Could not find cell ${cell}`;
    }},
    { name: "select cell", handler: (args: string) => {
      const cell = args.toUpperCase();
      const cellElement = document.querySelector(`[data-cell-id="${cell}"]`);
      if (cellElement) {
        (cellElement as HTMLElement).click();
        return `Selected cell ${cell}`;
      }
      return `Could not find cell ${cell}`;
    }},
    { name: "edit cell", handler: () => {
      const activeCell = document.querySelector(`[data-active="true"]`);
      if (activeCell) {
        (activeCell as HTMLElement).click();
        (activeCell as HTMLElement).click();
        return "Editing active cell";
      }
      return "No active cell to edit";
    }}
  ];

  // Initialize formatting commands
  const formattingCommands = [
    { name: "bold", handler: () => {
      const boldButton = document.querySelector('[data-voice-command="bold"]');
      if (boldButton) {
        (boldButton as HTMLElement).click();
        return "Applied bold formatting";
      }
      return "Could not apply bold formatting";
    }},
    { name: "italic", handler: () => {
      const italicButton = document.querySelector('[data-voice-command="italic"]');
      if (italicButton) {
        (italicButton as HTMLElement).click();
        return "Applied italic formatting";
      }
      return "Could not apply italic formatting";
    }},
    { name: "underline", handler: () => {
      const underlineButton = document.querySelector('[data-voice-command="underline"]');
      if (underlineButton) {
        (underlineButton as HTMLElement).click();
        return "Applied underline formatting";
      }
      return "Could not apply underline formatting";
    }}
  ];

  // Initialize navigation commands for tabs
  const tabCommands = [
    { name: "go to home tab", handler: () => {
      const homeTab = document.querySelector('[data-voice-command="goto home tab"]');
      if (homeTab) {
        (homeTab as HTMLElement).click();
        return "Navigated to home tab";
      }
      return "Could not navigate to home tab";
    }},
    { name: "go to insert tab", handler: () => {
      const insertTab = document.querySelector('[data-voice-command="goto insert tab"]');
      if (insertTab) {
        (insertTab as HTMLElement).click();
        return "Navigated to insert tab";
      }
      return "Could not navigate to insert tab";
    }},
    { name: "go to page layout tab", handler: () => {
      const pageLayoutTab = document.querySelector('[data-voice-command="goto page layout tab"]');
      if (pageLayoutTab) {
        (pageLayoutTab as HTMLElement).click();
        return "Navigated to page layout tab";
      }
      return "Could not navigate to page layout tab";
    }},
    { name: "go to formulas tab", handler: () => {
      const formulasTab = document.querySelector('[data-voice-command="goto formulas tab"]');
      if (formulasTab) {
        (formulasTab as HTMLElement).click();
        return "Navigated to formulas tab";
      }
      return "Could not navigate to formulas tab";
    }},
    { name: "go to data tab", handler: () => {
      const dataTab = document.querySelector('[data-voice-command="goto data tab"]');
      if (dataTab) {
        (dataTab as HTMLElement).click();
        return "Navigated to data tab";
      }
      return "Could not navigate to data tab";
    }},
    { name: "go to review tab", handler: () => {
      const reviewTab = document.querySelector('[data-voice-command="goto review tab"]');
      if (reviewTab) {
        (reviewTab as HTMLElement).click();
        return "Navigated to review tab";
      }
      return "Could not navigate to review tab";
    }}
  ];

  // Initialize sheet commands
  const sheetCommands = [
    { name: "add sheet", handler: () => {
      const addSheetButton = document.querySelector('[data-voice-command="add new sheet"]');
      if (addSheetButton) {
        (addSheetButton as HTMLElement).click();
        return "Added new sheet";
      }
      return "Could not add new sheet";
    }},
    { name: "next sheet", handler: () => {
      const nextSheetButton = document.querySelector('[data-voice-command="next sheet"]');
      if (nextSheetButton) {
        (nextSheetButton as HTMLElement).click();
        return "Navigated to next sheet";
      }
      return "Could not navigate to next sheet";
    }},
    { name: "previous sheet", handler: () => {
      const prevSheetButton = document.querySelector('[data-voice-command="previous sheet"]');
      if (prevSheetButton) {
        (prevSheetButton as HTMLElement).click();
        return "Navigated to previous sheet";
      }
      return "Could not navigate to previous sheet";
    }}
  ];

  // Initialize editing commands
  const editingCommands = [
    { name: "cut", handler: () => {
      const cutButton = document.querySelector('[data-voice-command="cut"]');
      if (cutButton) {
        (cutButton as HTMLElement).click();
        return "Cut selection";
      }
      return "Could not cut selection";
    }},
    { name: "copy", handler: () => {
      const copyButton = document.querySelector('[data-voice-command="copy"]');
      if (copyButton) {
        (copyButton as HTMLElement).click();
        return "Copied selection";
      }
      return "Could not copy selection";
    }},
    { name: "paste", handler: () => {
      const pasteButton = document.querySelector('[data-voice-command="paste"]');
      if (pasteButton) {
        (pasteButton as HTMLElement).click();
        return "Pasted from clipboard";
      }
      return "Could not paste from clipboard";
    }}
  ];

  // Register all command groups with the voice assistant
  [
    ...cellCommands,
    ...formattingCommands, 
    ...tabCommands,
    ...sheetCommands,
    ...editingCommands
  ].forEach(command => {
    voiceAssistant.registerCommand(command.name, command.handler);
  });

  console.log("Voice trainer initialized with all commands");
  return "Voice trainer initialized";
};

// Export other voice-related utilities
export const announceVoiceCommands = () => {
  voiceAssistant.speak("Voice commands are available. Say 'help' for a list of commands.");
};

export const trainVoiceModel = () => {
  // This would typically train voice models for better recognition
  return "Training voice model for better recognition";
};

export default {
  initializeVoiceTrainer,
  announceVoiceCommands,
  trainVoiceModel
};
