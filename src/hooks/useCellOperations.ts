import { useEffect } from 'react';
import { Sheet, Cell, NumberFormat } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { useFormatting } from './useFormatting';
import { useNumberFormatting } from './useNumberFormatting';
import { useSorting } from './useSorting';
import { useClipboard } from './useClipboard';
import { useGridOperations } from './useGridOperations';
import { toast } from 'sonner';

export const useCellOperations = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>,
  cellSelection: {startCell: string, endCell: string} | null,
  clipboard: {cells: Record<string, Cell>, startCell: string} | null,
  setClipboard: React.Dispatch<React.SetStateAction<{cells: Record<string, Cell>, startCell: string} | null>>
) => {
  // Cell value update helper function
  const updateCellValue = (cellId: string, value: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [cellId]: {
                  ...sheet.cells[cellId] || {},
                  value
                }
              }
            }
          : sheet
      )
    );
  };
  
  // Import all hooks
  const formatting = useFormatting(activeSheet, activeSheetId, activeCell, setSheets);
  const numberFormatting = useNumberFormatting(activeSheet, activeSheetId, activeCell, setSheets, updateCellValue);
  const sorting = useSorting(activeSheet, activeSheetId, activeCell, setSheets);
  const clipboardOps = useClipboard(activeSheet, activeSheetId, activeCell, cellSelection, clipboard, setClipboard, setSheets);
  const gridOps = useGridOperations(activeSheet, activeSheetId, setSheets);

  // Formula evaluation effect - with error handling
  useEffect(() => {
    if (!activeSheet?.cells) return;
    
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      if (cell && cell.value && cell.value.startsWith('=')) {
        try {
          evaluateFormula(cell.value.substring(1), activeSheet.cells);
        } catch (error) {
          console.error(`Error evaluating formula in ${cellId}:`, error);
        }
      }
    });
  }, [activeSheet?.cells, activeSheetId]);

  // AutoSum functionality
  const handleAutoSum = () => {
    if (!activeCell) return;
    
    // Determine the range to sum based on surrounding cells with data
    const [col, rowStr] = activeCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    if (!col || !rowStr) return;
    
    const rowIdx = parseInt(rowStr, 10);
    
    // Look for data above the current cell
    let startRow = rowIdx - 1;
    while (startRow > 0) {
      const cellId = `${col}${startRow}`;
      if (!activeSheet.cells[cellId] || !activeSheet.cells[cellId].value) {
        break;
      }
      startRow--;
    }
    startRow++; // Adjust to first cell with data
    
    // If no data found above, look for data to the left
    if (startRow === rowIdx) {
      const colIdx = col.charCodeAt(0) - 65;
      let startCol = colIdx - 1;
      let hasData = false;
      
      while (startCol >= 0) {
        const cellId = `${String.fromCharCode(65 + startCol)}${rowIdx}`;
        if (!activeSheet.cells[cellId] || !activeSheet.cells[cellId].value) {
          break;
        }
        hasData = true;
        startCol--;
      }
      startCol++; // Adjust to first cell with data
      
      if (hasData) {
        const formula = `=SUM(${String.fromCharCode(65 + startCol)}${rowIdx}:${String.fromCharCode(65 + colIdx - 1)}${rowIdx})`;
        clipboardOps.updateCellValue(activeCell, formula);
        toast.success("AutoSum applied");
        return;
      }
    }
    
    // Default: Sum the column above
    if (startRow < rowIdx) {
      const formula = `=SUM(${col}${startRow}:${col}${rowIdx - 1})`;
      clipboardOps.updateCellValue(activeCell, formula);
      toast.success("AutoSum applied");
    } else {
      toast.error("No data found to sum");
    }
  };

  // Fill functionality - copy down/right
  const handleFill = (direction: 'down' | 'right') => {
    if (!activeCell || !cellSelection) return;
    
    const sourceCellData = activeSheet.cells[activeCell];
    if (!sourceCellData) return;
    
    const [startCol, startRowStr] = cellSelection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [endCol, endRowStr] = cellSelection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    
    if (!startCol || !startRowStr || !endCol || !endRowStr) return;
    
    const startColIdx = startCol.charCodeAt(0) - 65;
    const startRowIdx = parseInt(startRowStr, 10);
    const endColIdx = endCol.charCodeAt(0) - 65;
    const endRowIdx = parseInt(endRowStr, 10);
    
    // Get the formula or value to fill
    const fillValue = sourceCellData.value;
    const fillFormat = sourceCellData.format;
    
    // Create new cells for the fill
    const updatedCells = { ...activeSheet.cells };
    
    if (direction === 'down') {
      for (let row = startRowIdx + 1; row <= endRowIdx; row++) {
        const targetCellId = `${startCol}${row}`;
        updatedCells[targetCellId] = {
          ...updatedCells[targetCellId] || {},
          value: fillValue,
          format: { ...fillFormat }
        };
      }
    } else { // right
      for (let col = startColIdx + 1; col <= endColIdx; col++) {
        const targetCellId = `${String.fromCharCode(65 + col)}${startRowIdx}`;
        updatedCells[targetCellId] = {
          ...updatedCells[targetCellId] || {},
          value: fillValue,
          format: { ...fillFormat }
        };
      }
    }
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );
    
    toast.success(`Filled ${direction}`);
  };

  // Clear formatting but keep content
  const handleClearFormatting = () => {
    if (!cellSelection && activeCell) {
      // Clear formatting for single cell
      setSheets(prevSheets => 
        prevSheets.map(sheet => 
          sheet.id === activeSheetId 
            ? {
                ...sheet,
                cells: {
                  ...sheet.cells,
                  [activeCell]: {
                    value: sheet.cells[activeCell]?.value || '',
                    // Remove format object
                  }
                }
              }
            : sheet
        )
      );
      toast.success("Formatting cleared");
    } else if (cellSelection) {
      // Clear formatting for selection
      const [startCol, startRowStr] = cellSelection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const [endCol, endRowStr] = cellSelection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      
      if (!startCol || !startRowStr || !endCol || !endRowStr) return;
      
      const startColIdx = startCol.charCodeAt(0) - 65;
      const startRowIdx = parseInt(startRowStr, 10) - 1;
      const endColIdx = endCol.charCodeAt(0) - 65;
      const endRowIdx = parseInt(endRowStr, 10) - 1;
      
      const minColIdx = Math.min(startColIdx, endColIdx);
      const maxColIdx = Math.max(startColIdx, endColIdx);
      const minRowIdx = Math.min(startRowIdx, endRowIdx);
      const maxRowIdx = Math.max(startRowIdx, endRowIdx);
      
      const updatedCells = { ...activeSheet.cells };
      
      for (let row = minRowIdx; row <= maxRowIdx; row++) {
        for (let col = minColIdx; col <= maxColIdx; col++) {
          const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
          if (updatedCells[cellId]) {
            updatedCells[cellId] = {
              value: updatedCells[cellId].value
              // Remove format object
            };
          }
        }
      }
      
      setSheets(prevSheets => 
        prevSheets.map(sheet => 
          sheet.id === activeSheetId 
            ? { ...sheet, cells: updatedCells }
            : sheet
        )
      );
      
      toast.success("Formatting cleared for selected cells");
    }
  };

  // Find & Replace functionality
  const handleFind = () => {
    const searchTerm = prompt("Enter text to find:");
    if (!searchTerm) return;
    
    // Simple implementation - find the first occurrence
    let foundCell: string | null = null;
    
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      if (foundCell) return; // Already found
      
      if (cell.value && cell.value.includes(searchTerm)) {
        foundCell = cellId;
      }
    });
    
    if (foundCell) {
      // Select the found cell
      setSheets(prevSheets => 
        prevSheets.map(sheet => 
          sheet.id === activeSheetId 
            ? { ...sheet, activeCell: foundCell! }
            : sheet
        )
      );
      toast.success(`Found "${searchTerm}" in cell ${foundCell}`);
    } else {
      toast.error(`Text "${searchTerm}" not found`);
    }
  };

  // Insert cell/row/column
  const handleInsert = (type: 'cell' | 'row' | 'column') => {
    if (type === 'cell') {
      gridOps.insertCell(activeCell);
    } else if (type === 'row') {
      const rowIdx = parseInt(activeCell.match(/\d+/)?.[0] || "1", 10);
      gridOps.insertRow(rowIdx);
    } else { // column
      const colIdx = activeCell.match(/[A-Z]+/)?.[0].charCodeAt(0) - 65 || 0;
      gridOps.insertColumn(colIdx);
    }
  };

  return {
    // Formatting operations
    applyFormat: formatting.applyFormat,
    applyAlignment: formatting.applyAlignment,
    applyFontSize: formatting.applyFontSize,
    applyFontFamily: formatting.applyFontFamily,
    applyColor: formatting.applyColor,
    applyBackgroundColor: formatting.applyBackgroundColor,
    
    // Number formatting operations
    applyNumberFormat: numberFormatting.applyNumberFormat,
    handlePercentFormat: numberFormatting.handlePercentFormat,
    handleCurrencyFormat: numberFormatting.handleCurrencyFormat,
    
    // Sorting operations
    handleSortAsc: sorting.handleSortAsc,
    handleSortDesc: sorting.handleSortDesc,
    
    // Clipboard operations
    handleCopy: clipboardOps.handleCopy,
    handleCut: clipboardOps.handleCut,
    handlePaste: clipboardOps.handlePaste,
    handleFormatPainter: clipboardOps.handleFormatPainter,
    handleDelete: clipboardOps.handleDelete,
    
    // Special operations
    handleMergeCenter: formatting.handleMergeCenter,
    handleAutoSum,
    handleFill,
    handleClearFormatting,
    handleFind,
    handleInsert,
    
    // Grid operations
    updateColumnWidth: gridOps.updateColumnWidth,
    updateRowHeight: gridOps.updateRowHeight,
    handleColumnDragDrop: gridOps.handleColumnDragDrop,
    handleRowDragDrop: gridOps.handleRowDragDrop,
    
    // Cell value update
    updateCellValue: clipboardOps.updateCellValue
  };
};
