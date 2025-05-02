import { useState, useEffect } from 'react';
import { Sheet, Cell } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
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
  // Apply formatting to cell(s)
  const applyFormat = (formatType: 'bold' | 'italic' | 'underline') => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    [formatType]: !sheet.cells[activeCell]?.format?.[formatType]
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyAlignment = (alignment: 'left' | 'center' | 'right') => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell],
                  format: {
                    ...sheet.cells[activeCell]?.format,
                    alignment,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyFontSize = (fontSize: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell],
                  format: {
                    ...sheet.cells[activeCell]?.format,
                    fontSize,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyFontFamily = (fontFamily: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell],
                  format: {
                    ...sheet.cells[activeCell]?.format,
                    fontFamily,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyColor = (color: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    color,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyBackgroundColor = (backgroundColor: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    backgroundColor,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const handleSortAsc = () => {
    const colLetter = activeCell.match(/[A-Z]+/)?.[0] || 'A';
    if (!colLetter) return;
    
    const cellsInColumn: {id: string, value: string, row: number}[] = [];
    
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      const cellColLetter = cellId.match(/[A-Z]+/)?.[0];
      if (cellColLetter === colLetter) {
        const rowNum = parseInt(cellId.substring(colLetter.length), 10);
        cellsInColumn.push({ 
          id: cellId, 
          value: cell.value.startsWith('=') 
            ? evaluateFormula(cell.value.substring(1), activeSheet.cells)
            : cell.value,
          row: rowNum
        });
      }
    });
    
    cellsInColumn.sort((a, b) => {
      const numA = parseFloat(a.value);
      const numB = parseFloat(b.value);
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      
      return a.value.localeCompare(b.value);
    });
    
    const updatedCells = { ...activeSheet.cells };
    
    cellsInColumn.forEach((cell, index) => {
      Object.entries(activeSheet.cells).forEach(([cellId, cellData]) => {
        const rowMatch = cellId.match(/[A-Z]+(\d+)/);
        if (rowMatch && parseInt(rowMatch[1], 10) === cell.row) {
          const colLetter = cellId.match(/[A-Z]+/)?.[0] || '';
          const newCellId = `${colLetter}${cellsInColumn[index].row}`;
          updatedCells[newCellId] = { ...cellData };
        }
      });
    });
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );
    
    toast.success("Sorted column ascending");
  };

  const handleSortDesc = () => {
    const colLetter = activeCell.match(/[A-Z]+/)?.[0] || 'A';
    if (!colLetter) return;
    
    const cellsInColumn: {id: string, value: string, row: number}[] = [];
    
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      const cellColLetter = cellId.match(/[A-Z]+/)?.[0];
      if (cellColLetter === colLetter) {
        const rowNum = parseInt(cellId.substring(colLetter.length), 10);
        cellsInColumn.push({ 
          id: cellId, 
          value: cell.value.startsWith('=') 
            ? evaluateFormula(cell.value.substring(1), activeSheet.cells)
            : cell.value,
          row: rowNum
        });
      }
    });
    
    cellsInColumn.sort((a, b) => {
      const numA = parseFloat(a.value);
      const numB = parseFloat(b.value);
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return numB - numA;
      }
      
      return b.value.localeCompare(a.value);
    });
    
    const updatedCells = { ...activeSheet.cells };
    
    cellsInColumn.forEach((cell, index) => {
      Object.entries(activeSheet.cells).forEach(([cellId, cellData]) => {
        const rowMatch = cellId.match(/[A-Z]+(\d+)/);
        if (rowMatch && parseInt(rowMatch[1], 10) === cell.row) {
          const colLetter = cellId.match(/[A-Z]+/)?.[0] || '';
          const newCellId = `${colLetter}${cellsInColumn[index].row}`;
          updatedCells[newCellId] = { ...cellData };
        }
      });
    });
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );
    
    toast.success("Sorted column descending");
  };

  const handlePercentFormat = () => {
    const cellData = activeSheet.cells[activeCell];
    if (!cellData) {
      // Create empty cell if it doesn't exist
      updateCellValue(activeCell, '0%');
      return;
    }
    
    let value = cellData.value;
    if (value.startsWith('=')) {
      try {
        const result = evaluateFormula(value.substring(1), activeSheet.cells);
        const numResult = parseFloat(result);
        if (!isNaN(numResult)) {
          const percent = (numResult * 100).toFixed(2) + '%';
          updateCellValue(activeCell, percent);
        }
      } catch (error) {
        console.error('Error evaluating formula for percent format:', error);
      }
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const percent = (numValue * 100).toFixed(2) + '%';
        updateCellValue(activeCell, percent);
      }
    }
  };

  const handleCurrencyFormat = () => {
    const cellData = activeSheet.cells[activeCell];
    if (!cellData) {
      // Create empty cell if it doesn't exist
      updateCellValue(activeCell, '$0.00');
      return;
    }
    
    let value = cellData.value;
    if (value && value.startsWith('=')) {
      try {
        const result = evaluateFormula(value.substring(1), activeSheet.cells);
        const numResult = parseFloat(result);
        if (!isNaN(numResult)) {
          const currency = '$' + numResult.toFixed(2);
          updateCellValue(activeCell, currency);
        }
      } catch (error) {
        console.error('Error evaluating formula for currency format:', error);
      }
    } else if (value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const currency = '$' + numValue.toFixed(2);
        updateCellValue(activeCell, currency);
      }
    }
  };

  const handleCopy = () => {
    if (!cellSelection && activeCell) {
      // Copy single cell
      const activeCellData = activeSheet.cells[activeCell];
      if (activeCellData) {
        const selectedCells: Record<string, Cell> = {
          [activeCell]: { ...activeCellData }
        };
        setClipboard({
          cells: selectedCells,
          startCell: activeCell
        });
        toast.success("Cell copied to clipboard");
      }
    } else if (cellSelection) {
      // Copy selection
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
      
      const selectedCells: Record<string, Cell> = {};
      
      for (let row = minRowIdx; row <= maxRowIdx; row++) {
        for (let col = minColIdx; col <= maxColIdx; col++) {
          const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
          if (activeSheet.cells[cellId]) {
            selectedCells[cellId] = { ...activeSheet.cells[cellId] };
          }
        }
      }
      
      setClipboard({
        cells: selectedCells,
        startCell: `${String.fromCharCode(65 + minColIdx)}${minRowIdx + 1}`
      });
      
      toast.success("Cells copied to clipboard");
    }
  };

  const handleCut = () => {
    handleCopy();
    handleDelete();
  };

  const handlePaste = () => {
    if (!clipboard) {
      toast.error("Nothing to paste");
      return;
    }
    
    const [targetCol, targetRowStr] = activeCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [startCol, startRowStr] = clipboard.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    
    if (!targetCol || !targetRowStr || !startCol || !startRowStr) return;
    
    const targetColIdx = targetCol.charCodeAt(0) - 65;
    const targetRowIdx = parseInt(targetRowStr, 10) - 1;
    const startColIdx = startCol.charCodeAt(0) - 65;
    const startRowIdx = parseInt(startRowStr, 10) - 1;
    
    const colOffset = targetColIdx - startColIdx;
    const rowOffset = targetRowIdx - startRowIdx;
    
    const updatedCells = { ...activeSheet.cells };
    
    Object.entries(clipboard.cells).forEach(([cellId, cell]) => {
      const [col, rowStr] = cellId.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      
      if (!col || !rowStr) return;
      
      const colIdx = col.charCodeAt(0) - 65;
      const rowIdx = parseInt(rowStr, 10) - 1;
      
      const newColIdx = colIdx + colOffset;
      const newRowIdx = rowIdx + rowOffset;
      
      const newCellId = `${String.fromCharCode(65 + newColIdx)}${newRowIdx + 1}`;
      updatedCells[newCellId] = { ...cell };
    });
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );
    
    toast.success("Pasted from clipboard");
  };

  const handleDelete = () => {
    if (!cellSelection && activeCell) {
      // Delete single cell
      updateCellValue(activeCell, '');
      toast.success("Cell cleared");
    } else if (cellSelection) {
      // Delete selection
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
              ...updatedCells[cellId],
              value: ''
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
      
      toast.success("Cells cleared");
    }
  };

  const handleMergeCenter = () => {
    if (!cellSelection) {
      toast.error("Please select multiple cells to merge");
      return;
    }

    const [startCol, startRowStr] = cellSelection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [endCol, endRowStr] = cellSelection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    
    if (!startCol || !startRowStr || !endCol || !endRowStr) return;
    
    // For now, just apply center alignment to the active cell
    applyAlignment('center');
    toast.success("Cells merged and centered (visual representation only)");
  };

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

  const updateColumnWidth = (columnId: string, width: number) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              columnWidths: {
                ...sheet.columnWidths,
                [columnId]: width
              }
            }
          : sheet
      )
    );
  };

  const updateRowHeight = (rowId: number, height: number) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              rowHeights: {
                ...sheet.rowHeights,
                [rowId]: height
              }
            }
          : sheet
      )
    );
  };

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
    applyFormat,
    applyAlignment,
    applyFontSize,
    applyFontFamily,
    applyColor,
    applyBackgroundColor,
    handleSortAsc,
    handleSortDesc,
    handlePercentFormat,
    handleCurrencyFormat,
    handleCopy,
    handleCut,
    handlePaste,
    handleDelete,
    handleMergeCenter,
    updateColumnWidth,
    updateRowHeight,
    updateCellValue
  };
};
