
import { Sheet, CellSelection } from '../../types/sheet';
import voiceAssistant from '../../utils/voiceAssistant';
import { batchEvaluateFormulas } from '../../utils/formulaEvaluator';
interface UseCellManagementProps {
  activeSheet: Sheet;
  activeSheetId: string;
  activeCell: string;
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>;
  saveState: () => void;
  setFormulaValue: (value: string) => void;
  setCellSelection: React.Dispatch<React.SetStateAction<CellSelection | null>>;
}

export const useCellManagement = ({
  activeSheet,
  activeSheetId,
  activeCell,
  setSheets,
  saveState,
  setFormulaValue,
  setCellSelection
}: UseCellManagementProps) => {

  const handleCellChange = (cellId: string, value: string) => {
    saveState();
    setSheets(prevSheets => 
      prevSheets.map(sheet => {
        if (sheet.id !== activeSheetId) return sheet;

        // Clone cells and apply the edit
        const updatedCells: Record<string, any> = { ...sheet.cells };
        const existing = updatedCells[cellId] || {};
        updatedCells[cellId] = { ...existing, value };
        // Clear any cached result for the edited cell
        if ('calculatedValue' in updatedCells[cellId]) {
          delete updatedCells[cellId].calculatedValue;
        }

        // Recalculate all formulas (fast batch) so dependents update immediately
        try {
          const formulaCells = Object.keys(updatedCells).filter(id => {
            const v = updatedCells[id]?.value;
            return typeof v === 'string' && String(v).startsWith('=');
          });
          if (formulaCells.length > 0) {
            batchEvaluateFormulas(formulaCells, updatedCells);
          }
        } catch (err) {
          console.error('Recalculation error after cell edit:', err);
        }

        return { ...sheet, cells: updatedCells };
      })
    );
  };
  const handleCellSelect = (cellId: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, activeCell: cellId }
          : sheet
      )
    );
    
    const cellValue = activeSheet.cells[cellId]?.value || '';
    setFormulaValue(cellValue);
    voiceAssistant.speak(`Selected cell ${cellId}`);
  };

  const handleCellSelectionChange = (selection: CellSelection | null) => {
    setCellSelection(selection);
  };

  const handleFormulaChange = (value: string) => {
    setFormulaValue(value);
    handleCellChange(activeCell, value);
  };

  return {
    handleCellChange,
    handleCellSelect,
    handleCellSelectionChange,
    handleFormulaChange
  };
};
