
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
    if (!match) return { col: 'A', row: 1, colIndex: 0 };
    const col = match[1];
    const row = parseInt(match[2], 10);
    const colIndex = col.charCodeAt(0) - 65;
    return { col, row, colIndex };
  }, []);

  const getNextCell = useCallback((cellId: string, direction: 'up' | 'down' | 'left' | 'right', rows = 1) => {
    const { col, row, colIndex } = parseCell(cellId);
    
    switch (direction) {
      case 'up':
        return row > rows ? `${col}${row - rows}` : cellId;
      case 'down':
        return `${col}${row + rows}`;
      case 'left':
        return colIndex > 0 ? `${String.fromCharCode(64 + colIndex)}${row}` : cellId;
      case 'right':
        return colIndex < 25 ? `${String.fromCharCode(66 + colIndex)}${row}` : `AA${row}`;
      default:
        return cellId;
    }
  }, [parseCell]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't handle if user is typing in an input or editing a cell
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.contentEditable === 'true' ||
        target.dataset.editing === 'true') {
      return;
    }

    const isCtrl = e.ctrlKey || e.metaKey;
    
    // Navigation keys (without modifiers)
    if (!isCtrl && !e.shiftKey && !e.altKey) {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'up'));
          break;
        case 'ArrowDown':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'down'));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'left'));
          break;
        case 'ArrowRight':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'right'));
          break;
        case 'Enter':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'down'));
          break;
        case 'Tab':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'right'));
          break;
        case 'Home':
          e.preventDefault();
          const { row } = parseCell(activeCell);
          onCellSelect(`A${row}`);
          break;
        case 'End':
          e.preventDefault();
          const { row: endRow } = parseCell(activeCell);
          onCellSelect(`Z${endRow}`);
          break;
        case 'PageUp':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'up', 10));
          break;
        case 'PageDown':
          e.preventDefault();
          onCellSelect(getNextCell(activeCell, 'down', 10));
          break;
      }
    }

    // Shift + Tab for reverse navigation
    if (e.shiftKey && e.key === 'Tab') {
      e.preventDefault();
      onCellSelect(getNextCell(activeCell, 'left'));
    }

    // Shift + Enter for reverse navigation
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      onCellSelect(getNextCell(activeCell, 'up'));
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
          }
          break;
        case 'a':
          e.preventDefault();
          // Select all functionality
          toast.info('Select all - click on the cell at the intersection of row and column headers');
          break;
        case 'home':
          e.preventDefault();
          onCellSelect('A1');
          break;
        case 'end':
          e.preventDefault();
          // Go to last used cell (simplified to Z100 for now)
          onCellSelect('Z100');
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

  // Custom event listeners for Excel-specific shortcuts
  useEffect(() => {
    const handleExcelEvents = (e: CustomEvent) => {
      switch (e.type) {
        case 'excel-copy':
          onCopy();
          break;
        case 'excel-cut':
          onCut();
          break;
        case 'excel-paste':
          onPaste();
          break;
        case 'excel-undo':
          onUndo();
          break;
        case 'excel-redo':
          onRedo();
          break;
        case 'excel-save':
          if (onSave) onSave();
          break;
      }
    };

    document.addEventListener('excel-copy', handleExcelEvents as EventListener);
    document.addEventListener('excel-cut', handleExcelEvents as EventListener);
    document.addEventListener('excel-paste', handleExcelEvents as EventListener);
    document.addEventListener('excel-undo', handleExcelEvents as EventListener);
    document.addEventListener('excel-redo', handleExcelEvents as EventListener);
    document.addEventListener('excel-save', handleExcelEvents as EventListener);

    return () => {
      document.removeEventListener('excel-copy', handleExcelEvents as EventListener);
      document.removeEventListener('excel-cut', handleExcelEvents as EventListener);
      document.removeEventListener('excel-paste', handleExcelEvents as EventListener);
      document.removeEventListener('excel-undo', handleExcelEvents as EventListener);
      document.removeEventListener('excel-redo', handleExcelEvents as EventListener);
      document.removeEventListener('excel-save', handleExcelEvents as EventListener);
    };
  }, [onCopy, onCut, onPaste, onUndo, onRedo, onSave]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { getNextCell, parseCell };
};
