
import { useEffect } from 'react';
import { Sheet, Cell, NumberFormat } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { useFormatting } from './useFormatting';
import { useNumberFormatting } from './useNumberFormatting';
import { useSorting } from './useSorting';
import { useClipboard } from './useClipboard';
import { useGridOperations } from './useGridOperations';
import { useAutoSum } from './useAutoSum';
import { useFillOperations } from './useFillOperations';
import { useSearchOperations } from './useSearchOperations';
import { useFormatCleaner } from './useFormatCleaner';
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
  const autoSum = useAutoSum(activeSheet, activeSheetId, activeCell, clipboardOps.updateCellValue);
  const fillOps = useFillOperations(activeSheet, activeSheetId, activeCell, cellSelection, setSheets);
  const searchOps = useSearchOperations(activeSheet, activeSheetId, setSheets);
  const formatCleaner = useFormatCleaner(activeSheet, activeSheetId, activeCell, cellSelection, setSheets);

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
    handleAutoSum: autoSum.handleAutoSum,
    handleFill: fillOps.handleFill,
    handleClearFormatting: formatCleaner.handleClearFormatting,
    handleFind: searchOps.handleFind,
    handleFindReplace: searchOps.handleFindReplace,
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
