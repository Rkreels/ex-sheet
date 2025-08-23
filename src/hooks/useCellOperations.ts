import { useEffect, useCallback } from 'react';
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
import { useExcelFeatures } from './useExcelFeatures';
import { useAdvancedCalculations } from './useAdvancedCalculations';
import { useAdvancedCellSelection } from './useAdvancedCellSelection';
import { toast } from 'sonner';
import { createAdvancedFormulaEngine } from '../utils/advancedFormulaEngine';

export const useCellOperations = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>,
  cellSelection: {startCell: string, endCell: string} | null,
  clipboard: {cells: Record<string, Cell>, startCell: string} | null,
  setClipboard: React.Dispatch<React.SetStateAction<{cells: Record<string, Cell>, startCell: string} | null>>
) => {
  // Cell value update helper function with advanced formula evaluation
  const updateCellValue = (cellId: string, value: string) => {
    setSheets(prevSheets => {
      const updatedSheets = prevSheets.map(sheet => {
        if (sheet.id === activeSheetId) {
          const updatedCells = {
            ...sheet.cells,
            [cellId]: {
              ...sheet.cells[cellId] || {},
              value
            }
          };

          // Use advanced formula engine for recalculation
          try {
            const engine = createAdvancedFormulaEngine(updatedCells);
            const recalculatedCells = engine.evaluateAll();
            
            return {
              ...sheet,
              cells: recalculatedCells
            };
          } catch (error) {
            console.error('Formula evaluation error:', error);
            return {
              ...sheet,
              cells: updatedCells
            };
          }
        }
        return sheet;
      });
      
      return updatedSheets;
    });
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
  const excelFeatures = useExcelFeatures(activeSheet, activeSheetId, activeCell, setSheets, cellSelection);
  const advancedCalc = useAdvancedCalculations(activeSheet, activeSheetId, setSheets);
  const advancedSelection = useAdvancedCellSelection(setSheets, activeSheetId);

  // Enhanced formula evaluation effect
  useEffect(() => {
    if (!activeSheet?.cells) return;
    
    try {
      const engine = createAdvancedFormulaEngine(activeSheet.cells);
      const updatedCells = engine.evaluateAll();
      
      // Only update if there are actual changes
      const hasChanges = Object.keys(updatedCells).some(cellId => {
        const current = activeSheet.cells[cellId];
        const updated = updatedCells[cellId];
        return current?.calculatedValue !== updated?.calculatedValue;
      });

      if (hasChanges) {
        setSheets(prevSheets => 
          prevSheets.map(sheet => 
            sheet.id === activeSheetId 
              ? { ...sheet, cells: updatedCells }
              : sheet
          )
        );
      }
    } catch (error) {
      console.error('Advanced formula evaluation error:', error);
    }
  }, [activeSheet?.cells, activeSheetId, setSheets]);

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
    updateCellValue: clipboardOps.updateCellValue,
    
    // Advanced Excel features
    handleAutoFill: excelFeatures.handleAutoFill,
    handleFreezePanes: excelFeatures.handleFreezePanes,
    handleUnfreezePanes: excelFeatures.handleUnfreezePanes,
    handleHideRows: excelFeatures.handleHideRows,
    handleShowRows: excelFeatures.handleShowRows,
    handleHideColumns: excelFeatures.handleHideColumns,
    handleShowColumns: excelFeatures.handleShowColumns,
    handleAutoFitColumns: excelFeatures.handleAutoFitColumns,
    handleAutoFitRows: excelFeatures.handleAutoFitRows,
    handleMergeCells: excelFeatures.handleMergeCells,
    handleUnmergeCells: excelFeatures.handleUnmergeCells,
    
    // Advanced calculations
    recalculateSheet: advancedCalc.recalculateSheet,
    calculateRangeStatistics: advancedCalc.calculateRangeStatistics,
    goalSeek: advancedCalc.goalSeek,
    solver: advancedCalc.solver,
    
    // Multi-cell operations  
    handleMultiCellOperation: (operation: string, value?: string) => {
      console.log('Multi-cell operation:', operation, value);
    },
    
    // Advanced selection operations
    applyColorToSelection: advancedSelection.applyColorToSelection,
    applyBackgroundToSelection: advancedSelection.applyBackgroundToSelection,
    mergeCells: advancedSelection.mergeCells,
    setMultiSelection: advancedSelection.setMultiSelection,
    multiSelection: advancedSelection.multiSelection
  };
};
