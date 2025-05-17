
import { Sheet, CellSelection } from '../../types/sheet';
import voiceAssistant from '../../utils/voiceAssistant';

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
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [cellId]: {
                  ...sheet.cells[cellId],
                  value,
                }
              }
            }
          : sheet
      )
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
