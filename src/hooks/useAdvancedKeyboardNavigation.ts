
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAdvancedKeyboardNavigationProps {
  activeCell: string;
  onCellSelect: (cellId: string) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onFind: () => void;
  onSave?: () => void;
}

export const useAdvancedKeyboardNavigation = ({
  activeCell,
  onCellSelect,
  onCopy,
  onCut,
  onPaste,
  onUndo,
  onRedo,
  onDelete,
  onFind,
  onSave
}: UseAdvancedKeyboardNavigationProps) => {
  
  const parseCell = useCallback((cellId: string) => {
    const match = cellId.match(/([A-Z]+)(\d+)/);
    if (!match) return { col: 'A', row: 1 };
    return { col: match[1], row: parseInt(match[2], 10) };
  }, []);

  const getNextCell = useCallback((cellId: string, direction: 'up' | 'down' | 'left' | 'right') => {
    const { col, row } = parseCell(cellId);
    const colIndex = col.charCodeAt(0) - 65;
    
    switch (direction) {
      case 'up':
        return row > 1 ? `${col}${row - 1}` : cellId;
      case 'down':
        return `${col}${row + 1}`;
      case 'left':
        return colIndex > 0 ? `${String.fromCharCode(64 + colIndex)}${row}` : cellId;
      case 'right':
        return `${String.fromCharCode(66 + colIndex)}${row}`;
      default:
        return cellId;
    }
  }, [parseCell]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const isCtrl = e.ctrlKey || e.metaKey;
    
    // Navigation keys
    if (!isCtrl && !e.shiftKey && !e.altKey) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'up'));
          break;
        case 'ArrowDown':
        case 'Enter':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'down'));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'left'));
          break;
        case 'ArrowRight':
        case 'Tab':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'right'));
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          onDelete();
          break;
        case 'F2':
          e.preventDefault();
          // Trigger edit mode
          const cellElement = document.querySelector(`[data-cell-id="${activeCell}"]`);
          if (cellElement) {
            (cellElement as HTMLElement).dispatchEvent(new Event('dblclick'));
          }
          break;
      }
    }

    // Ctrl + Key combinations
    if (isCtrl && !e.shiftKey && !e.altKey) {
      switch (e.key.toLowerCase()) {
        case 'c':
          e.preventDefault();
          onCopy();
          toast.success('Copied');
          break;
        case 'x':
          e.preventDefault();
          onCut();
          toast.success('Cut');
          break;
        case 'v':
          e.preventDefault();
          onPaste();
          toast.success('Pasted');
          break;
        case 'z':
          e.preventDefault();
          onUndo();
          toast.success('Undone');
          break;
        case 'y':
          e.preventDefault();
          onRedo();
          toast.success('Redone');
          break;
        case 'f':
          e.preventDefault();
          onFind();
          break;
        case 's':
          e.preventDefault();
          if (onSave) {
            onSave();
            toast.success('Saved');
          }
          break;
        case 'a':
          e.preventDefault();
          // Select all (could implement range selection)
          toast.info('Select all functionality coming soon');
          break;
      }
    }

    // Ctrl + Shift combinations
    if (isCtrl && e.shiftKey && !e.altKey) {
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          onRedo();
          toast.success('Redone');
          break;
      }
    }
  }, [activeCell, onCellSelect, getNextCell, onCopy, onCut, onPaste, onUndo, onRedo, onDelete, onFind, onSave]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { getNextCell, parseCell };
};
