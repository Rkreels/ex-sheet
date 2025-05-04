
import { Sheet } from '../types/sheet';
import { toast } from 'sonner';

export const useFillOperations = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  cellSelection: {startCell: string, endCell: string} | null,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>
) => {
  // Fill functionality - copy down/right
  const handleFill = (direction: 'down' | 'right') => {
    if (!activeCell || !cellSelection) return;
    
    const sourceCellData = activeSheet.cells[activeCell];
    if (!sourceCellData) return;
    
    const [startCol, startRowStr] = cellSelection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [endCol, endRowStr] = cellSelection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    
    if (!startCol || !startRowStr || !endCol || !endRowStr) return;
    
    const startColIdx = startCol.charCodeAt(0) - 65;
    const startRowIdx = parseInt(startRowStr, 10);
    const endColIdx = endCol.charCodeAt(0) - 65;
    const endRowIdx = parseInt(endRowStr, 10);
    
    // Get the formula or value to fill
    const fillValue = sourceCellData.value;
    const fillFormat = sourceCellData.format;
    
    // Create new cells for the fill
    const updatedCells = { ...activeSheet.cells };
    
    if (direction === 'down') {
      for (let row = startRowIdx + 1; row <= endRowIdx; row++) {
        const targetCellId = `${startCol}${row}`;
        updatedCells[targetCellId] = {
          ...updatedCells[targetCellId] || {},
          value: fillValue,
          format: { ...fillFormat }
        };
      }
    } else { // right
      for (let col = startColIdx + 1; col <= endColIdx; col++) {
        const targetCellId = `${String.fromCharCode(65 + col)}${startRowIdx}`;
        updatedCells[targetCellId] = {
          ...updatedCells[targetCellId] || {},
          value: fillValue,
          format: { ...fillFormat }
        };
      }
    }
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );
    
    toast.success(`Filled ${direction}`);
  };

  return { handleFill };
};
