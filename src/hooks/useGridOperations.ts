
import { Sheet } from '../types/sheet';

export const useGridOperations = (
  activeSheet: Sheet,
  activeSheetId: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>
) => {
  // Update column width
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

  // Update row height
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

  // Column drag and drop
  const handleColumnDragDrop = (sourceColIndex: number, targetColIndex: number) => {
    if (sourceColIndex === targetColIndex) return;

    // Get letter representations
    const getColLetter = (index: number) => String.fromCharCode(65 + index);
    const sourceCol = getColLetter(sourceColIndex);
    const targetCol = getColLetter(targetColIndex);

    // Update all cells with the relevant column
    const updatedCells = { ...activeSheet.cells };
    const updatedColumnWidths = { ...activeSheet.columnWidths };

    // Swap column widths
    const sourceWidth = updatedColumnWidths[sourceCol] || 100;
    const targetWidth = updatedColumnWidths[targetCol] || 100;
    updatedColumnWidths[sourceCol] = targetWidth;
    updatedColumnWidths[targetCol] = sourceWidth;

    // Swap cell data
    Object.keys(activeSheet.cells).forEach(cellId => {
      const [colLetter, row] = cellId.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      if (colLetter === sourceCol) {
        const newCellId = `${targetCol}${row}`;
        updatedCells[newCellId] = { ...activeSheet.cells[cellId] };
        delete updatedCells[cellId];
      } else if (colLetter === targetCol) {
        const newCellId = `${sourceCol}${row}`;
        updatedCells[newCellId] = { ...activeSheet.cells[cellId] };
        delete updatedCells[cellId];
      }
    });

    setSheets(prevSheets =>
      prevSheets.map(sheet =>
        sheet.id === activeSheetId
          ? {
              ...sheet,
              cells: updatedCells,
              columnWidths: updatedColumnWidths
            }
          : sheet
      )
    );
  };

  // Row drag and drop
  const handleRowDragDrop = (sourceRowIndex: number, targetRowIndex: number) => {
    if (sourceRowIndex === targetRowIndex) return;

    const sourceRow = sourceRowIndex + 1; // Convert to 1-based
    const targetRow = targetRowIndex + 1; // Convert to 1-based

    // Update all cells with the relevant row
    const updatedCells = { ...activeSheet.cells };
    const updatedRowHeights = { ...activeSheet.rowHeights };

    // Swap row heights
    const sourceHeight = updatedRowHeights[sourceRow] || 22;
    const targetHeight = updatedRowHeights[targetRow] || 22;
    updatedRowHeights[sourceRow] = targetHeight;
    updatedRowHeights[targetRow] = sourceHeight;

    // Swap cell data
    Object.keys(activeSheet.cells).forEach(cellId => {
      const [col, rowStr] = cellId.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const row = parseInt(rowStr, 10);
      if (row === sourceRow) {
        const newCellId = `${col}${targetRow}`;
        updatedCells[newCellId] = { ...activeSheet.cells[cellId] };
        delete updatedCells[cellId];
      } else if (row === targetRow) {
        const newCellId = `${col}${sourceRow}`;
        updatedCells[newCellId] = { ...activeSheet.cells[cellId] };
        delete updatedCells[cellId];
      }
    });

    setSheets(prevSheets =>
      prevSheets.map(sheet =>
        sheet.id === activeSheetId
          ? {
              ...sheet,
              cells: updatedCells,
              rowHeights: updatedRowHeights
            }
          : sheet
      )
    );
  };

  // Insert cell functionality
  const insertCell = (cellId: string) => {
    // If in a selection, insert all cells and shift right
    const [col, rowStr] = cellId.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    if (!col || !rowStr) return;
    
    const row = parseInt(rowStr, 10);
    const colIndex = col.charCodeAt(0) - 65;
    
    // Update cells by shifting them right
    const updatedCells = { ...activeSheet.cells };
    
    // Sort cell IDs to process them in reverse order to avoid overwriting
    const cellIds = Object.keys(updatedCells)
      .filter(id => {
        const [c, r] = id.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
        const ri = parseInt(r, 10);
        const ci = c.charCodeAt(0) - 65;
        return ri === row && ci >= colIndex;
      })
      .sort((a, b) => {
        const aCol = a.match(/[A-Z]+/)?.[0].charCodeAt(0) - 65 || 0;
        const bCol = b.match(/[A-Z]+/)?.[0].charCodeAt(0) - 65 || 0;
        return bCol - aCol; // Reverse sort
      });
    
    // Shift cells right
    cellIds.forEach(id => {
      const [c, r] = id.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const ci = c.charCodeAt(0) - 65;
      const newCol = String.fromCharCode(ci + 1 + 65);
      const newId = `${newCol}${r}`;
      updatedCells[newId] = { ...updatedCells[id] };
    });
    
    // Clear the current cell
    updatedCells[cellId] = { value: '' };
    
    setSheets(prevSheets =>
      prevSheets.map(sheet =>
        sheet.id === activeSheetId
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );
  };

  // Insert row functionality
  const insertRow = (rowIndex: number) => {
    // Update cells by shifting them down
    const updatedCells = { ...activeSheet.cells };
    const updatedRowHeights = { ...activeSheet.rowHeights };
    
    // Sort cell IDs to process them in reverse order to avoid overwriting
    const cellIds = Object.keys(updatedCells)
      .filter(id => {
        const row = parseInt(id.match(/\d+/)?.[0] || "0", 10);
        return row >= rowIndex;
      })
      .sort((a, b) => {
        const aRow = parseInt(a.match(/\d+/)?.[0] || "0", 10);
        const bRow = parseInt(b.match(/\d+/)?.[0] || "0", 10);
        return bRow - aRow; // Reverse sort
      });
    
    // Shift cells down
    cellIds.forEach(id => {
      const [col, rowStr] = id.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const row = parseInt(rowStr, 10);
      const newId = `${col}${row + 1}`;
      updatedCells[newId] = { ...updatedCells[id] };
      if (row === rowIndex) {
        delete updatedCells[id]; // Remove the original cell
      }
    });
    
    // Update row heights
    for (let i = rowIndex + 10; i >= rowIndex; i--) {
      if (updatedRowHeights[i]) {
        updatedRowHeights[i + 1] = updatedRowHeights[i];
      }
    }
    updatedRowHeights[rowIndex] = 22; // Default row height
    
    setSheets(prevSheets =>
      prevSheets.map(sheet =>
        sheet.id === activeSheetId
          ? { 
              ...sheet, 
              cells: updatedCells,
              rowHeights: updatedRowHeights
            }
          : sheet
      )
    );
  };

  // Insert column functionality
  const insertColumn = (colIndex: number) => {
    const colLetter = String.fromCharCode(65 + colIndex);
    
    // Update cells by shifting them right
    const updatedCells = { ...activeSheet.cells };
    const updatedColumnWidths = { ...activeSheet.columnWidths };
    
    // Sort cell IDs to process them in reverse order to avoid overwriting
    const cellIds = Object.keys(updatedCells)
      .filter(id => {
        const col = id.match(/[A-Z]+/)?.[0] || "";
        const ci = col.charCodeAt(0) - 65;
        return ci >= colIndex;
      })
      .sort((a, b) => {
        const aCol = a.match(/[A-Z]+/)?.[0].charCodeAt(0) - 65 || 0;
        const bCol = b.match(/[A-Z]+/)?.[0].charCodeAt(0) - 65 || 0;
        if (aCol === bCol) {
          return 0;
        }
        return bCol - aCol; // Reverse sort columns
      });
    
    // Shift cells right
    cellIds.forEach(id => {
      const [col, row] = id.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const ci = col.charCodeAt(0) - 65;
      const newCol = String.fromCharCode(ci + 1 + 65);
      const newId = `${newCol}${row}`;
      updatedCells[newId] = { ...updatedCells[id] };
      if (col === colLetter) {
        delete updatedCells[id]; // Remove the original cell
      }
    });
    
    // Update column widths
    for (let i = 25; i >= colIndex; i--) {
      const col = String.fromCharCode(65 + i);
      if (updatedColumnWidths[col]) {
        const newCol = String.fromCharCode(65 + i + 1);
        updatedColumnWidths[newCol] = updatedColumnWidths[col];
      }
    }
    updatedColumnWidths[colLetter] = 100; // Default column width
    
    setSheets(prevSheets =>
      prevSheets.map(sheet =>
        sheet.id === activeSheetId
          ? { 
              ...sheet, 
              cells: updatedCells,
              columnWidths: updatedColumnWidths
            }
          : sheet
      )
    );
  };

  return {
    updateColumnWidth,
    updateRowHeight,
    handleColumnDragDrop,
    handleRowDragDrop,
    insertCell,
    insertRow,
    insertColumn
  };
};

export default useGridOperations;
