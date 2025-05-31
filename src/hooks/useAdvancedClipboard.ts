
import { useState, useCallback } from 'react';
import { Cell } from '../types/sheet';
import { toast } from 'sonner';

interface UseAdvancedClipboardProps {
  cells: Record<string, Cell>;
  onCellChange: (cellId: string, value: string) => void;
  onFormatChange: (cellId: string, format: any) => void;
}

export const useAdvancedClipboard = ({
  cells,
  onCellChange,
  onFormatChange
}: UseAdvancedClipboardProps) => {
  const [clipboardData, setClipboardData] = useState<{
    cells: Record<string, Cell>;
    operation: 'copy' | 'cut';
    range: { startCell: string; endCell: string };
  } | null>(null);

  const copyToSystemClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }, []);

  const getCellRange = useCallback((startCell: string, endCell: string) => {
    const start = startCell.match(/([A-Z]+)(\d+)/);
    const end = endCell.match(/([A-Z]+)(\d+)/);
    
    if (!start || !end) return [startCell];
    
    const startCol = start[1].charCodeAt(0) - 65;
    const startRow = parseInt(start[2], 10);
    const endCol = end[1].charCodeAt(0) - 65;
    const endRow = parseInt(end[2], 10);
    
    const range: string[] = [];
    for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
      for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
        range.push(`${String.fromCharCode(65 + col)}${row}`);
      }
    }
    
    return range;
  }, []);

  const handleAdvancedCopy = useCallback((range: { startCell: string; endCell: string }) => {
    const cellRange = getCellRange(range.startCell, range.endCell);
    const copiedCells: Record<string, Cell> = {};
    
    // Build tab-separated values for system clipboard
    const rows: string[][] = [];
    const startCol = range.startCell.match(/([A-Z]+)(\d+)/)![1].charCodeAt(0) - 65;
    const startRow = parseInt(range.startCell.match(/([A-Z]+)(\d+)/)![2], 10);
    const endCol = range.endCell.match(/([A-Z]+)(\d+)/)![1].charCodeAt(0) - 65;
    const endRow = parseInt(range.endCell.match(/([A-Z]+)(\d+)/)![2], 10);
    
    for (let row = startRow; row <= endRow; row++) {
      const rowData: string[] = [];
      for (let col = startCol; col <= endCol; col++) {
        const cellId = `${String.fromCharCode(65 + col)}${row}`;
        const cell = cells[cellId];
        copiedCells[cellId] = cell || { value: '' };
        rowData.push(cell?.value || '');
      }
      rows.push(rowData);
    }
    
    const tsvData = rows.map(row => row.join('\t')).join('\n');
    copyToSystemClipboard(tsvData);
    
    setClipboardData({
      cells: copiedCells,
      operation: 'copy',
      range
    });
    
    toast.success(`Copied ${cellRange.length} cells`);
  }, [cells, getCellRange, copyToSystemClipboard]);

  const handleAdvancedCut = useCallback((range: { startCell: string; endCell: string }) => {
    handleAdvancedCopy(range);
    
    // Clear the cells after copying
    const cellRange = getCellRange(range.startCell, range.endCell);
    cellRange.forEach(cellId => {
      onCellChange(cellId, '');
    });
    
    setClipboardData(prev => prev ? { ...prev, operation: 'cut' } : null);
    toast.success(`Cut ${cellRange.length} cells`);
  }, [handleAdvancedCopy, getCellRange, onCellChange]);

  const handleAdvancedPaste = useCallback((targetCell: string, options?: {
    pasteValues?: boolean;
    pasteFormats?: boolean;
    pasteSpecial?: 'transpose' | 'add' | 'subtract' | 'multiply' | 'divide';
  }) => {
    if (!clipboardData) {
      toast.error('Nothing to paste');
      return;
    }

    const { pasteValues = true, pasteFormats = true, pasteSpecial } = options || {};
    const targetMatch = targetCell.match(/([A-Z]+)(\d+)/);
    if (!targetMatch) return;
    
    const targetCol = targetMatch[1].charCodeAt(0) - 65;
    const targetRow = parseInt(targetMatch[2], 10);
    
    const sourceRange = clipboardData.range;
    const sourceStart = sourceRange.startCell.match(/([A-Z]+)(\d+)/)!;
    const sourceEnd = sourceRange.endCell.match(/([A-Z]+)(\d+)/)!;
    
    const sourceStartCol = sourceStart[1].charCodeAt(0) - 65;
    const sourceStartRow = parseInt(sourceStart[2], 10);
    const sourceEndCol = sourceEnd[1].charCodeAt(0) - 65;
    const sourceEndRow = parseInt(sourceEnd[2], 10);
    
    const width = sourceEndCol - sourceStartCol + 1;
    const height = sourceEndRow - sourceStartRow + 1;
    
    let pasteCount = 0;
    
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const sourceCol = pasteSpecial === 'transpose' ? 
          sourceStartCol + row : sourceStartCol + col;
        const sourceRowNum = pasteSpecial === 'transpose' ? 
          sourceStartRow + col : sourceStartRow + row;
        const sourceCellId = `${String.fromCharCode(65 + sourceCol)}${sourceRowNum}`;
        
        const targetColNum = targetCol + (pasteSpecial === 'transpose' ? row : col);
        const targetRowNum = targetRow + (pasteSpecial === 'transpose' ? col : row);
        const targetCellId = `${String.fromCharCode(65 + targetColNum)}${targetRowNum}`;
        
        const sourceCell = clipboardData.cells[sourceCellId];
        if (sourceCell) {
          if (pasteValues) {
            let newValue = sourceCell.value;
            
            // Handle paste special operations
            if (pasteSpecial && pasteSpecial !== 'transpose') {
              const currentValue = parseFloat(cells[targetCellId]?.value || '0');
              const sourceValue = parseFloat(sourceCell.value || '0');
              
              if (!isNaN(currentValue) && !isNaN(sourceValue)) {
                switch (pasteSpecial) {
                  case 'add':
                    newValue = (currentValue + sourceValue).toString();
                    break;
                  case 'subtract':
                    newValue = (currentValue - sourceValue).toString();
                    break;
                  case 'multiply':
                    newValue = (currentValue * sourceValue).toString();
                    break;
                  case 'divide':
                    newValue = sourceValue !== 0 ? (currentValue / sourceValue).toString() : '#DIV/0!';
                    break;
                }
              }
            }
            
            onCellChange(targetCellId, newValue);
          }
          
          if (pasteFormats && sourceCell.format && onFormatChange) {
            onFormatChange(targetCellId, sourceCell.format);
          }
          
          pasteCount++;
        }
      }
    }
    
    toast.success(`Pasted ${pasteCount} cells${pasteSpecial ? ` (${pasteSpecial})` : ''}`);
  }, [clipboardData, cells, onCellChange, onFormatChange]);

  return {
    handleAdvancedCopy,
    handleAdvancedCut,
    handleAdvancedPaste,
    clipboardData,
    clearClipboard: () => setClipboardData(null)
  };
};
