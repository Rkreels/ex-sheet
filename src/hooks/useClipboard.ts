import { useState } from 'react';
import { Sheet, Cell } from '../types/sheet';
import { toast } from 'sonner';

export const useClipboard = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  cellSelection: { startCell: string, endCell: string } | null,
  clipboard: { cells: Record<string, Cell>, startCell: string } | null,
  setClipboard: React.Dispatch<React.SetStateAction<{ cells: Record<string, Cell>, startCell: string } | null>>,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>
) => {
  // Keep track of the format painter source
  const [formatPainterSource, setFormatPainterSource] = useState<string | null>(null);

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

  const handleFormatPainter = () => {
    if (!activeCell) {
      toast.error("Select a cell first");
      return;
    }

    const activeCellData = activeSheet.cells[activeCell];
    if (!activeCellData || !activeCellData.format) {
      toast.error("No formatting to copy");
      return;
    }

    // Store the active cell for format painter
    setFormatPainterSource(activeCell);
    toast.success("Format copied. Click on another cell to apply.");
    
    // Change cursor to indicate format painter is active
    document.body.style.cursor = 'cell';

    // Add one-time event listener for next cell click
    const handleNextCellClick = (e: MouseEvent) => {
      // Find if click was on a cell
      const cellElements = document.querySelectorAll('.border-excel-gridBorder');
      let targetCellId = null;
      
      cellElements.forEach((cell) => {
        if ((cell as HTMLElement).contains(e.target as Node)) {
          // Extract cell ID from data attribute or some other means
          const cellId = (cell as HTMLElement).dataset.cellId;
          if (cellId) targetCellId = cellId;
        }
      });
      
      if (targetCellId) {
        applyFormatToCells([targetCellId], activeCellData.format);
        toast.success("Format applied");
      }
      
      document.body.style.cursor = 'default';
      document.removeEventListener('click', handleNextCellClick);
    };
    
    document.addEventListener('click', handleNextCellClick, { once: true });
  };

  const applyFormatToCells = (cellIds: string[], format: any) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                ...cellIds.reduce((acc, cellId) => {
                  acc[cellId] = {
                    ...sheet.cells[cellId] || { value: '' },
                    format: {
                      ...sheet.cells[cellId]?.format,
                      ...format
                    }
                  };
                  return acc;
                }, {} as Record<string, Cell>)
              }
            }
          : sheet
      )
    );
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
    
    // Save state for undo
    const previousState = { ...activeSheet.cells };
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { 
              ...sheet, 
              cells: updatedCells,
              history: {
                past: [...(sheet.history?.past || []), { cells: previousState }],
                future: []
              }
            }
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
      
      // Save state for undo
      const previousState = { ...activeSheet.cells };
      
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
            ? { 
                ...sheet, 
                cells: updatedCells,
                history: {
                  past: [...(sheet.history?.past || []), { cells: previousState }],
                  future: []
                }
              }
            : sheet
        )
      );
      
      toast.success("Cells cleared");
    }
  };

  const updateCellValue = (cellId: string, value: string) => {
    // Save state for undo
    const previousState = { ...activeSheet.cells };
    
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
              },
              history: {
                past: [...(sheet.history?.past || []), { cells: previousState }],
                future: []
              }
            }
          : sheet
      )
    );
  };

  return {
    handleCopy,
    handleCut,
    handlePaste,
    handleFormatPainter,
    handleDelete,
    updateCellValue
  };
};
