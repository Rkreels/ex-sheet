
import { Sheet, CellSelection } from '../../types/sheet';
import voiceAssistant from '../../utils/voiceAssistant';
import { recalcBatch } from '../../utils/formulaWorkerClient';
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

        // Keep formula bar in sync for active cell edits
        if (cellId === activeCell) {
          setFormulaValue(value);
        }

        // Clear any cached result for the edited cell
        if ('calculatedValue' in updatedCells[cellId]) {
          delete updatedCells[cellId].calculatedValue;
        }

        // Recalculate asynchronously in a Web Worker to keep UI responsive
        setTimeout(async () => {
          try {
            const formulaCells = Object.keys(updatedCells).filter(id => {
              const v = updatedCells[id]?.value;
              return typeof v === 'string' && v.startsWith('=');
            });
            if (formulaCells.length > 0) {
              const { cells: computed } = await recalcBatch(updatedCells, formulaCells);
              setSheets(prev => prev.map(s => {
                if (s.id !== activeSheetId) return s;
                const newMap: Record<string, any> = { ...s.cells };
                Object.entries(computed).forEach(([id, cell]) => {
                  const prevCell = (s.cells as any)[id] || {};
                  newMap[id] = { ...prevCell, ...cell };
                });
                return { ...s, cells: newMap };
              }));
            }
          } catch (err) {
            console.error('Recalculation error after cell edit (worker):', err);
          }
        }, 0);

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
    // Defer speech to avoid blocking selection responsiveness
    const ric = (cb: () => void) => typeof (window as any).requestIdleCallback === 'function' 
      ? (window as any).requestIdleCallback(cb as any) 
      : setTimeout(cb, 0);
    ric(() => voiceAssistant.speak(`Selected cell ${cellId}`));
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
