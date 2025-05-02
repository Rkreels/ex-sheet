
import { Sheet } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { toast } from 'sonner';

export const useSorting = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>
) => {
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
  
  return {
    handleSortAsc,
    handleSortDesc
  };
};
