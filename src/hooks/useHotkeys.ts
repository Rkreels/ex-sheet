
import { useEffect } from 'react';

export const useHotkeys = (
  activeCell: string,
  onCellSelect: (cellId: string) => void,
  onCopy?: () => void,
  onCut?: () => void,
  onPaste?: () => void,
  onUndo?: () => void,
  onRedo?: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const [col, row] = activeCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      let colIndex = col.charCodeAt(0) - 65; // Convert A to 0, B to 1, etc.
      let rowIndex = parseInt(row, 10) - 1;
      
      // Handle arrow key navigation
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        
        switch (e.key) {
          case 'ArrowUp':
            if (rowIndex > 0) rowIndex--;
            break;
          case 'ArrowDown':
            rowIndex++;
            break;
          case 'ArrowLeft':
            if (colIndex > 0) colIndex--;
            break;
          case 'ArrowRight':
            colIndex++;
            break;
        }
        
        const newColLetter = String.fromCharCode(colIndex + 65);
        const newCellId = `${newColLetter}${rowIndex + 1}`;
        onCellSelect(newCellId);
      }
      
      // Handle Tab navigation
      if (e.key === 'Tab') {
        e.preventDefault();
        
        if (e.shiftKey) {
          // Move left with Shift+Tab
          if (colIndex > 0) colIndex--;
          else {
            colIndex = 25; // Move to the last column
            if (rowIndex > 0) rowIndex--;
          }
        } else {
          // Move right with Tab
          colIndex++;
          if (colIndex > 25) {
            colIndex = 0; // Move to the first column
            rowIndex++;
          }
        }
        
        const newColLetter = String.fromCharCode(colIndex + 65);
        const newCellId = `${newColLetter}${rowIndex + 1}`;
        onCellSelect(newCellId);
      }
      
      // Handle Enter to move down
      if (e.key === 'Enter') {
        e.preventDefault();
        
        if (e.shiftKey) {
          // Move up with Shift+Enter
          if (rowIndex > 0) rowIndex--;
        } else {
          // Move down with Enter
          rowIndex++;
        }
        
        const newCellId = `${col}${rowIndex + 1}`;
        onCellSelect(newCellId);
      }
      
      // Handle keyboard shortcuts with Ctrl/Command
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'c': 
            if (onCopy) {
              e.preventDefault();
              onCopy();
            }
            break;
          case 'x':
            if (onCut) {
              e.preventDefault();
              onCut();
            }
            break;
          case 'v':
            if (onPaste) {
              e.preventDefault();
              onPaste();
            }
            break;
          case 'z':
            if (onUndo) {
              e.preventDefault();
              onUndo();
            }
            break;
          case 'y':
            if (onRedo) {
              e.preventDefault();
              onRedo();
            }
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeCell, onCellSelect, onCopy, onCut, onPaste, onUndo, onRedo]);
};

export default useHotkeys;
