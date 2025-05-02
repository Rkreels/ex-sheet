
import { Sheet } from '../types/sheet';

export const useGridOperations = (
  activeSheet: Sheet,
  activeSheetId: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>
) => {
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

  const handleColumnDragDrop = (sourceColIndex: number, targetColIndex: number) => {
    if (sourceColIndex === targetColIndex) return;

    // Get column letters
    const sourceColLetter = String.fromCharCode(65 + sourceColIndex);
    const targetColLetter = String.fromCharCode(65 + targetColIndex);

    // Create a map of all cells in the source column
    const sourceColumnCells: Record<string, any> = {};
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      const cellColLetter = cellId.match(/^([A-Z]+)/)?.[1];
      if (cellColLetter === sourceColLetter) {
        const rowNumber = cellId.substring(sourceColLetter.length);
        sourceColumnCells[rowNumber] = { ...cell };
      }
    });

    // Create a map of all cells in the target column
    const targetColumnCells: Record<string, any> = {};
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      const cellColLetter = cellId.match(/^([A-Z]+)/)?.[1];
      if (cellColLetter === targetColLetter) {
        const rowNumber = cellId.substring(targetColLetter.length);
        targetColumnCells[rowNumber] = { ...cell };
      }
    });

    // Update the cells with swapped columns
    const updatedCells = { ...activeSheet.cells };
    
    // Update source column with target data
    Object.entries(targetColumnCells).forEach(([rowNumber, cell]) => {
      const sourceKey = `${sourceColLetter}${rowNumber}`;
      updatedCells[sourceKey] = cell;
    });
    
    // Update target column with source data
    Object.entries(sourceColumnCells).forEach(([rowNumber, cell]) => {
      const targetKey = `${targetColLetter}${rowNumber}`;
      updatedCells[targetKey] = cell;
    });

    // Update sheet with new cells
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { 
              ...sheet, 
              cells: updatedCells,
              columnWidths: {
                ...sheet.columnWidths,
                [sourceColLetter]: sheet.columnWidths[targetColLetter] || 100,
                [targetColLetter]: sheet.columnWidths[sourceColLetter] || 100
              }
            }
          : sheet
      )
    );
  };

  const handleRowDragDrop = (sourceRowIndex: number, targetRowIndex: number) => {
    if (sourceRowIndex === targetRowIndex) return;

    const sourceRowNumber = sourceRowIndex + 1;
    const targetRowNumber = targetRowIndex + 1;

    // Create a map of all cells in the source row
    const sourceRowCells: Record<string, any> = {};
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      const match = cellId.match(/^([A-Z]+)(\d+)$/);
      if (match && parseInt(match[2], 10) === sourceRowNumber) {
        const colLetter = match[1];
        sourceRowCells[colLetter] = { ...cell };
      }
    });

    // Create a map of all cells in the target row
    const targetRowCells: Record<string, any> = {};
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      const match = cellId.match(/^([A-Z]+)(\d+)$/);
      if (match && parseInt(match[2], 10) === targetRowNumber) {
        const colLetter = match[1];
        targetRowCells[colLetter] = { ...cell };
      }
    });

    // Update the cells with swapped rows
    const updatedCells = { ...activeSheet.cells };
    
    // Update source row with target data
    Object.entries(targetRowCells).forEach(([colLetter, cell]) => {
      const sourceKey = `${colLetter}${sourceRowNumber}`;
      updatedCells[sourceKey] = cell;
    });
    
    // Update target row with source data
    Object.entries(sourceRowCells).forEach(([colLetter, cell]) => {
      const targetKey = `${colLetter}${targetRowNumber}`;
      updatedCells[targetKey] = cell;
    });

    // Update sheet with new cells
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { 
              ...sheet, 
              cells: updatedCells,
              rowHeights: {
                ...sheet.rowHeights,
                [sourceRowNumber]: sheet.rowHeights[targetRowNumber] || 22,
                [targetRowNumber]: sheet.rowHeights[sourceRowNumber] || 22
              }
            }
          : sheet
      )
    );
  };

  return {
    updateColumnWidth,
    updateRowHeight,
    handleColumnDragDrop,
    handleRowDragDrop
  };
};
