
import { useEffect } from 'react';
import { Sheet, Cell } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { useFormatting } from './useFormatting';
import { useNumberFormatting } from './useNumberFormatting';
import { useSorting } from './useSorting';
import { useClipboard } from './useClipboard';
import { useGridOperations } from './useGridOperations';

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

  return {
    // Formatting operations
    applyFormat: formatting.applyFormat,
    applyAlignment: formatting.applyAlignment,
    applyFontSize: formatting.applyFontSize,
    applyFontFamily: formatting.applyFontFamily,
    applyColor: formatting.applyColor,
    applyBackgroundColor: formatting.applyBackgroundColor,
    
    // Number formatting operations
    handlePercentFormat: numberFormatting.handlePercentFormat,
    handleCurrencyFormat: numberFormatting.handleCurrencyFormat,
    
    // Sorting operations
    handleSortAsc: sorting.handleSortAsc,
    handleSortDesc: sorting.handleSortDesc,
    
    // Clipboard operations
    handleCopy: clipboardOps.handleCopy,
    handleCut: clipboardOps.handleCut,
    handlePaste: clipboardOps.handlePaste,
    handleDelete: clipboardOps.handleDelete,
    
    // Merge and other operations
    handleMergeCenter: formatting.handleMergeCenter,
    
    // Grid operations
    updateColumnWidth: gridOps.updateColumnWidth,
    updateRowHeight: gridOps.updateRowHeight,
    handleColumnDragDrop: gridOps.handleColumnDragDrop,
    handleRowDragDrop: gridOps.handleRowDragDrop,
    
    // Cell value update
    updateCellValue: clipboardOps.updateCellValue
  };
};
