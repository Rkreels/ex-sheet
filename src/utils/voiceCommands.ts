
import { toast } from 'sonner';

// Types for voice commands
export interface VoiceCommand {
  name: string;
  description: string;
  patterns: string[];
  execute: (args?: any) => void;
}

// Voice command handler factory
export const createVoiceCommandHandler = (commandHandlers: Record<string, Function>) => {
  const commands: VoiceCommand[] = [
    {
      name: 'bold',
      description: 'Make selected text bold',
      patterns: ['bold', 'make bold', 'text bold'],
      execute: () => commandHandlers.applyFormat('bold')
    },
    {
      name: 'italic',
      description: 'Make selected text italic',
      patterns: ['italic', 'make italic', 'text italic'],
      execute: () => commandHandlers.applyFormat('italic')
    },
    {
      name: 'underline',
      description: 'Underline selected text',
      patterns: ['underline', 'text underline'],
      execute: () => commandHandlers.applyFormat('underline')
    },
    {
      name: 'align-left',
      description: 'Align text to the left',
      patterns: ['align left', 'left align', 'left alignment'],
      execute: () => commandHandlers.applyAlignment('left')
    },
    {
      name: 'align-center',
      description: 'Center align the text',
      patterns: ['align center', 'center align', 'center alignment'],
      execute: () => commandHandlers.applyAlignment('center')
    },
    {
      name: 'align-right',
      description: 'Align text to the right',
      patterns: ['align right', 'right align', 'right alignment'],
      execute: () => commandHandlers.applyAlignment('right')
    },
    {
      name: 'copy',
      description: 'Copy selected cell or range',
      patterns: ['copy', 'copy cell', 'copy selection'],
      execute: () => commandHandlers.handleCopy()
    },
    {
      name: 'cut',
      description: 'Cut selected cell or range',
      patterns: ['cut', 'cut cell', 'cut selection'],
      execute: () => commandHandlers.handleCut()
    },
    {
      name: 'paste',
      description: 'Paste to current selection',
      patterns: ['paste', 'paste here', 'paste cell'],
      execute: () => commandHandlers.handlePaste()
    },
    {
      name: 'format-painter',
      description: 'Copy formatting from one place and apply it to another',
      patterns: ['format painter', 'copy format', 'paste format'],
      execute: () => commandHandlers.handleFormatPainter()
    },
    {
      name: 'percent',
      description: 'Apply percentage format',
      patterns: ['percent', 'percentage', 'percent format'],
      execute: () => commandHandlers.handlePercentFormat()
    },
    {
      name: 'currency',
      description: 'Apply currency format',
      patterns: ['currency', 'money format', 'dollar format'],
      execute: () => commandHandlers.handleCurrencyFormat()
    },
    {
      name: 'merge-center',
      description: 'Merge and center cells',
      patterns: ['merge', 'merge cells', 'merge and center'],
      execute: () => commandHandlers.handleMergeCenter()
    },
    {
      name: 'delete',
      description: 'Delete cell content',
      patterns: ['delete', 'delete cell', 'clear cell'],
      execute: () => commandHandlers.handleDelete()
    },
    {
      name: 'sort-ascending',
      description: 'Sort data in ascending order',
      patterns: ['sort ascending', 'sort a to z', 'sort low to high'],
      execute: () => commandHandlers.handleSortAsc()
    },
    {
      name: 'sort-descending',
      description: 'Sort data in descending order',
      patterns: ['sort descending', 'sort z to a', 'sort high to low'],
      execute: () => commandHandlers.handleSortDesc()
    },
    {
      name: 'undo',
      description: 'Undo the last action',
      patterns: ['undo', 'undo that', 'undo last'],
      execute: () => commandHandlers.handleUndo()
    },
    {
      name: 'redo',
      description: 'Redo the last undone action',
      patterns: ['redo', 'redo that', 'redo last'],
      execute: () => commandHandlers.handleRedo()
    },
    {
      name: 'autosum',
      description: 'Insert SUM function',
      patterns: ['autosum', 'sum', 'insert sum'],
      execute: () => commandHandlers.handleAutoSum()
    },
    {
      name: 'fill-down',
      description: 'Fill down the selected range',
      patterns: ['fill down', 'copy down'],
      execute: () => commandHandlers.handleFill('down')
    },
    {
      name: 'fill-right',
      description: 'Fill right the selected range',
      patterns: ['fill right', 'copy right'],
      execute: () => commandHandlers.handleFill('right')
    },
    {
      name: 'clear-formatting',
      description: 'Clear all formatting from the selection',
      patterns: ['clear formatting', 'remove formatting', 'reset format'],
      execute: () => commandHandlers.handleClearFormatting()
    },
    {
      name: 'find',
      description: 'Find text in the sheet',
      patterns: ['find', 'search', 'find text'],
      execute: () => commandHandlers.handleFind()
    },
    {
      name: 'find-replace',
      description: 'Find and replace text',
      patterns: ['find and replace', 'replace text', 'search and replace'],
      execute: () => commandHandlers.handleFindReplace()
    },
    {
      name: 'insert-row',
      description: 'Insert a new row',
      patterns: ['insert row', 'new row', 'add row'],
      execute: () => commandHandlers.handleInsert('row')
    },
    {
      name: 'insert-column',
      description: 'Insert a new column',
      patterns: ['insert column', 'new column', 'add column'],
      execute: () => commandHandlers.handleInsert('column')
    },
    {
      name: 'insert-cell',
      description: 'Insert a new cell',
      patterns: ['insert cell', 'new cell', 'add cell'],
      execute: () => commandHandlers.handleInsert('cell')
    },
    {
      name: 'print',
      description: 'Print the current sheet',
      patterns: ['print', 'print sheet', 'print spreadsheet'],
      execute: () => commandHandlers.handlePrint()
    }
  ];

  return {
    commands,
    handleCommand: (commandText: string) => {
      const lowerText = commandText.toLowerCase().trim();
      const command = commands.find(cmd => 
        cmd.patterns.some(pattern => lowerText.includes(pattern))
      );
      
      if (command) {
        command.execute();
        toast.success(`Executed: ${command.name}`);
        return true;
      }
      
      toast.error('Command not recognized');
      return false;
    },
    getCommandsHelp: () => {
      return commands.map(cmd => ({
        name: cmd.name,
        description: cmd.description,
        example: cmd.patterns[0]
      }));
    }
  };
};
