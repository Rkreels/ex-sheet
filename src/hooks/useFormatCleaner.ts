import { Sheet } from '../types/sheet';
import { toast } from 'sonner';

export const useFormatCleaner = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  cellSelection: {startCell: string, endCell: string} | null,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>
) => {
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

  return { handleClearFormatting };
};
