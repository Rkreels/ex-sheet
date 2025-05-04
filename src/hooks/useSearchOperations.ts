
import { Sheet } from '../types/sheet';
import { toast } from 'sonner';

export const useSearchOperations = (
  activeSheet: Sheet,
  activeSheetId: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>
) => {
  // Find & Replace functionality
  const handleFind = () => {
    const searchTerm = prompt("Enter text to find:");
    if (!searchTerm) return;
    
    // Simple implementation - find the first occurrence
    let foundCell: string | null = null;
    
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      if (foundCell) return; // Already found
      
      if (cell.value && cell.value.includes(searchTerm)) {
        foundCell = cellId;
      }
    });
    
    if (foundCell) {
      // Select the found cell
      setSheets(prevSheets => 
        prevSheets.map(sheet => 
          sheet.id === activeSheetId 
            ? { ...sheet, activeCell: foundCell! }
            : sheet
        )
      );
      toast.success(`Found "${searchTerm}" in cell ${foundCell}`);
    } else {
      toast.error(`Text "${searchTerm}" not found`);
    }
  };

  // Enhanced Find & Replace with dialog
  const handleFindReplace = () => {
    const searchTerm = prompt("Enter text to find:");
    if (!searchTerm) return;
    
    const replaceTerm = prompt("Enter replacement text:");
    if (replaceTerm === null) return; // User cancelled
    
    let replacements = 0;
    const updatedCells = { ...activeSheet.cells };
    
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      if (cell.value && cell.value.includes(searchTerm)) {
        const newValue = cell.value.replace(new RegExp(searchTerm, 'g'), replaceTerm);
        updatedCells[cellId] = {
          ...cell,
          value: newValue
        };
        replacements++;
      }
    });
    
    if (replacements > 0) {
      setSheets(prevSheets => 
        prevSheets.map(sheet => 
          sheet.id === activeSheetId 
            ? { ...sheet, cells: updatedCells }
            : sheet
        )
      );
      toast.success(`Replaced ${replacements} occurrences.`);
    } else {
      toast.error(`Text "${searchTerm}" not found`);
    }
  };

  return { handleFind, handleFindReplace };
};
