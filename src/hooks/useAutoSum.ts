
import { Sheet } from '../types/sheet';
import { toast } from 'sonner';

export const useAutoSum = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  updateCellValue: (cellId: string, value: string) => void
) => {
  // AutoSum functionality
  const handleAutoSum = () => {
    if (!activeCell) return;
    
    // Determine the range to sum based on surrounding cells with data
    const [col, rowStr] = activeCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    if (!col || !rowStr) return;
    
    const rowIdx = parseInt(rowStr, 10);
    
    // Look for data above the current cell
    let startRow = rowIdx - 1;
    while (startRow > 0) {
      const cellId = `${col}${startRow}`;
      if (!activeSheet.cells[cellId] || !activeSheet.cells[cellId].value) {
        break;
      }
      startRow--;
    }
    startRow++; // Adjust to first cell with data
    
    // If no data found above, look for data to the left
    if (startRow === rowIdx) {
      const colIdx = col.charCodeAt(0) - 65;
      let startCol = colIdx - 1;
      let hasData = false;
      
      while (startCol >= 0) {
        const cellId = `${String.fromCharCode(65 + startCol)}${rowIdx}`;
        if (!activeSheet.cells[cellId] || !activeSheet.cells[cellId].value) {
          break;
        }
        hasData = true;
        startCol--;
      }
      startCol++; // Adjust to first cell with data
      
      if (hasData) {
        const formula = `=SUM(${String.fromCharCode(65 + startCol)}${rowIdx}:${String.fromCharCode(65 + colIdx - 1)}${rowIdx})`;
        updateCellValue(activeCell, formula);
        toast.success("AutoSum applied");
        return;
      }
    }
    
    // Default: Sum the column above
    if (startRow < rowIdx) {
      const formula = `=SUM(${col}${startRow}:${col}${rowIdx - 1})`;
      updateCellValue(activeCell, formula);
      toast.success("AutoSum applied");
    } else {
      toast.error("No data found to sum");
    }
  };

  return { handleAutoSum };
};
