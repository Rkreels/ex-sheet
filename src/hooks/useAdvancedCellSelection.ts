import { useState, useCallback, useEffect } from 'react';
import { CellSelection } from '../types/sheet';

export const useAdvancedCellSelection = (
  setSheets: React.Dispatch<React.SetStateAction<any[]>>,
  activeSheetId: string
) => {
  const [multiSelection, setMultiSelection] = useState<CellSelection[]>([]);
  const [isMultiSelecting, setIsMultiSelecting] = useState(false);

  // Apply formatting to multiple selections
  const applyToMultiSelection = useCallback((formatter: (cellId: string) => void) => {
    multiSelection.forEach(selection => {
      const { startCell, endCell } = selection;
      
      // Parse cell references
      const startMatch = startCell.match(/([A-Z]+)(\d+)/);
      const endMatch = endCell.match(/([A-Z]+)(\d+)/);
      
      if (!startMatch || !endMatch) return;
      
      const startCol = startMatch[1];
      const startRow = parseInt(startMatch[2]);
      const endCol = endMatch[1];
      const endRow = parseInt(endMatch[2]);
      
      // Get column indices
      const startColIndex = startCol.charCodeAt(0) - 65;
      const endColIndex = endCol.charCodeAt(0) - 65;
      
      // Apply to each cell in the range
      for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
        for (let col = Math.min(startColIndex, endColIndex); col <= Math.max(startColIndex, endColIndex); col++) {
          const cellId = String.fromCharCode(65 + col) + row;
          formatter(cellId);
        }
      }
    });
  }, [multiSelection]);

  // Apply color to selected cells
  const applyColorToSelection = useCallback((color: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                ...Object.fromEntries(
                  multiSelection.flatMap(selection => {
                    const cells = [];
                    const { startCell, endCell } = selection;
                    
                    const startMatch = startCell.match(/([A-Z]+)(\d+)/);
                    const endMatch = endCell.match(/([A-Z]+)(\d+)/);
                    
                    if (startMatch && endMatch) {
                      const startCol = startMatch[1].charCodeAt(0) - 65;
                      const startRow = parseInt(startMatch[2]);
                      const endCol = endMatch[1].charCodeAt(0) - 65;
                      const endRow = parseInt(endMatch[2]);
                      
                      for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
                        for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
                          const cellId = String.fromCharCode(65 + col) + row;
                          cells.push([
                            cellId,
                            {
                              ...sheet.cells[cellId] || { value: '' },
                              format: {
                                ...sheet.cells[cellId]?.format || {},
                                color
                              }
                            }
                          ]);
                        }
                      }
                    }
                    return cells;
                  })
                )
              }
            }
          : sheet
      )
    );
  }, [multiSelection, setSheets, activeSheetId]);

  // Apply background color to selected cells
  const applyBackgroundToSelection = useCallback((backgroundColor: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                ...Object.fromEntries(
                  multiSelection.flatMap(selection => {
                    const cells = [];
                    const { startCell, endCell } = selection;
                    
                    const startMatch = startCell.match(/([A-Z]+)(\d+)/);
                    const endMatch = endCell.match(/([A-Z]+)(\d+)/);
                    
                    if (startMatch && endMatch) {
                      const startCol = startMatch[1].charCodeAt(0) - 65;
                      const startRow = parseInt(startMatch[2]);
                      const endCol = endMatch[1].charCodeAt(0) - 65;
                      const endRow = parseInt(endMatch[2]);
                      
                      for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
                        for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
                          const cellId = String.fromCharCode(65 + col) + row;
                          cells.push([
                            cellId,
                            {
                              ...sheet.cells[cellId] || { value: '' },
                              format: {
                                ...sheet.cells[cellId]?.format || {},
                                backgroundColor
                              }
                            }
                          ]);
                        }
                      }
                    }
                    return cells;
                  })
                )
              }
            }
          : sheet
      )
    );
  }, [multiSelection, setSheets, activeSheetId]);

  // Merge selected cells
  const mergeCells = useCallback(() => {
    if (multiSelection.length === 0) return;
    
    const selection = multiSelection[0]; // Use first selection for merge
    const { startCell, endCell } = selection;
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              mergedCells: [
                ...(sheet.mergedCells || []),
                `${startCell}:${endCell}`
              ]
            }
          : sheet
      )
    );
  }, [multiSelection, setSheets, activeSheetId]);

  return {
    multiSelection,
    setMultiSelection,
    isMultiSelecting,
    setIsMultiSelecting,
    applyToMultiSelection,
    applyColorToSelection,
    applyBackgroundToSelection,
    mergeCells
  };
};