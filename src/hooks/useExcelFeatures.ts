import { useState, useCallback } from 'react';
import { Sheet, Cell, CellSelection } from '../types/sheet';
import { toast } from 'sonner';

export const useExcelFeatures = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>,
  cellSelection?: CellSelection | null
) => {

  // AutoFill functionality
  const handleAutoFill = useCallback((direction: 'down' | 'right' | 'up' | 'left', count: number = 1) => {
    const sourceCell = activeSheet.cells[activeCell];
    if (!sourceCell) return;

    const cellMatch = activeCell.match(/([A-Z]+)([0-9]+)/);
    if (!cellMatch) return;

    const colLetter = cellMatch[1];
    const rowNum = parseInt(cellMatch[2]);
    const colNum = colLetter.charCodeAt(0) - 65;

    const updates: Record<string, Cell> = {};

    for (let i = 1; i <= count; i++) {
      let targetCellId = '';
      
      switch (direction) {
        case 'down':
          targetCellId = `${colLetter}${rowNum + i}`;
          break;
        case 'right':
          targetCellId = `${String.fromCharCode(65 + colNum + i)}${rowNum}`;
          break;
        case 'up':
          if (rowNum - i > 0) targetCellId = `${colLetter}${rowNum - i}`;
          break;
        case 'left':
          if (colNum - i >= 0) targetCellId = `${String.fromCharCode(65 + colNum - i)}${rowNum}`;
          break;
      }

      if (targetCellId) {
        // Smart autofill logic
        let newValue = sourceCell.value;
        
        // Handle number sequences
        if (!isNaN(parseFloat(sourceCell.value))) {
          const num = parseFloat(sourceCell.value);
          newValue = (num + i).toString();
        }
        // Handle date sequences
        else if (Date.parse(sourceCell.value)) {
          const date = new Date(sourceCell.value);
          date.setDate(date.getDate() + i);
          newValue = date.toLocaleDateString();
        }
        // Handle text with numbers (e.g., "Item 1" -> "Item 2")
        else if (/\d+$/.test(sourceCell.value)) {
          const match = sourceCell.value.match(/^(.*?)(\d+)$/);
          if (match) {
            const prefix = match[1];
            const num = parseInt(match[2]);
            newValue = `${prefix}${num + i}`;
          }
        }

        updates[targetCellId] = {
          ...sourceCell,
          value: newValue
        };
      }
    }

    if (Object.keys(updates).length > 0) {
      setSheets(prevSheets => 
        prevSheets.map(sheet => 
          sheet.id === activeSheetId 
            ? {
                ...sheet,
                cells: {
                  ...sheet.cells,
                  ...updates
                }
              }
            : sheet
        )
      );
      toast.success(`AutoFilled ${Object.keys(updates).length} cells`);
    }
  }, [activeSheet, activeSheetId, activeCell, setSheets]);

  // Freeze panes
  const handleFreezePanes = useCallback(() => {
    const cellMatch = activeCell.match(/([A-Z]+)([0-9]+)/);
    if (!cellMatch) return;

    const col = cellMatch[1].charCodeAt(0) - 65;
    const row = parseInt(cellMatch[2]);

    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              freezePanes: { row: row - 1, col }
            }
          : sheet
      )
    );
    toast.success(`Frozen panes at ${activeCell}`);
  }, [activeCell, activeSheetId, setSheets]);

  // Unfreeze panes
  const handleUnfreezePanes = useCallback(() => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              freezePanes: undefined
            }
          : sheet
      )
    );
    toast.success('Unfrozen panes');
  }, [activeSheetId, setSheets]);

  // Hide/Show rows and columns
  const handleHideRows = useCallback((rowNumbers: number[]) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              rows: {
                ...sheet.rows,
                ...Object.fromEntries(rowNumbers.map(row => [
                  row.toString(),
                  { ...sheet.rows[row.toString()], hidden: true }
                ]))
              }
            }
          : sheet
      )
    );
    toast.success(`Hidden ${rowNumbers.length} row(s)`);
  }, [activeSheetId, setSheets]);

  const handleShowRows = useCallback((rowNumbers: number[]) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              rows: {
                ...sheet.rows,
                ...Object.fromEntries(rowNumbers.map(row => [
                  row.toString(),
                  { ...sheet.rows[row.toString()], hidden: false }
                ]))
              }
            }
          : sheet
      )
    );
    toast.success(`Shown ${rowNumbers.length} row(s)`);
  }, [activeSheetId, setSheets]);

  const handleHideColumns = useCallback((columnLetters: string[]) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              columns: {
                ...sheet.columns,
                ...Object.fromEntries(columnLetters.map(col => [
                  col,
                  { ...sheet.columns[col], hidden: true }
                ]))
              }
            }
          : sheet
      )
    );
    toast.success(`Hidden ${columnLetters.length} column(s)`);
  }, [activeSheetId, setSheets]);

  const handleShowColumns = useCallback((columnLetters: string[]) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              columns: {
                ...sheet.columns,
                ...Object.fromEntries(columnLetters.map(col => [
                  col,
                  { ...sheet.columns[col], hidden: false }
                ]))
              }
            }
          : sheet
      )
    );
    toast.success(`Shown ${columnLetters.length} column(s)`);
  }, [activeSheetId, setSheets]);

  // AutoFit columns and rows
  const handleAutoFitColumns = useCallback((columnLetters?: string[]) => {
    const columnsToFit = columnLetters || [activeCell.match(/([A-Z]+)/)?.[1] || 'A'];
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              columns: {
                ...sheet.columns,
                ...Object.fromEntries(columnsToFit.map(col => [
                  col,
                  { ...sheet.columns[col], autoFit: true }
                ]))
              }
            }
          : sheet
      )
    );
    toast.success(`AutoFit ${columnsToFit.length} column(s)`);
  }, [activeCell, activeSheetId, setSheets]);

  const handleAutoFitRows = useCallback((rowNumbers?: number[]) => {
    const rowsToFit = rowNumbers || [parseInt(activeCell.match(/([0-9]+)/)?.[1] || '1')];
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              rows: {
                ...sheet.rows,
                ...Object.fromEntries(rowsToFit.map(row => [
                  row.toString(),
                  { ...sheet.rows[row.toString()], autoFit: true }
                ]))
              }
            }
          : sheet
      )
    );
    toast.success(`AutoFit ${rowsToFit.length} row(s)`);
  }, [activeCell, activeSheetId, setSheets]);

  // Cell merging
  const handleMergeCells = useCallback(() => {
    if (!cellSelection) {
      toast.error('Please select a range of cells to merge');
      return;
    }

    const { startCell, endCell } = cellSelection;
    const mergeRange = `${startCell}:${endCell}`;

    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              mergedCells: [...(sheet.mergedCells || []), mergeRange],
              cells: {
                ...sheet.cells,
                [startCell]: {
                  ...sheet.cells[startCell],
                  mergeArea: mergeRange
                }
              }
            }
          : sheet
      )
    );
    toast.success('Cells merged successfully');
  }, [cellSelection, activeSheetId, setSheets]);

  const handleUnmergeCells = useCallback(() => {
    const cellMergeArea = activeSheet.cells[activeCell]?.mergeArea;
    if (!cellMergeArea) {
      toast.error('Selected cell is not part of a merged range');
      return;
    }

    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              mergedCells: (sheet.mergedCells || []).filter(range => range !== cellMergeArea),
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell],
                  mergeArea: undefined
                }
              }
            }
          : sheet
      )
    );
    toast.success('Cells unmerged successfully');
  }, [activeCell, activeSheet, activeSheetId, setSheets]);

  return {
    handleAutoFill,
    handleFreezePanes,
    handleUnfreezePanes,
    handleHideRows,
    handleShowRows,
    handleHideColumns,
    handleShowColumns,
    handleAutoFitColumns,
    handleAutoFitRows,
    handleMergeCells,
    handleUnmergeCells
  };
};