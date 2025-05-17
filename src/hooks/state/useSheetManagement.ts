
import { toast } from 'sonner';
import voiceAssistant from '../../utils/voiceAssistant';
import { Sheet } from '../../types/sheet';

interface UseSheetManagementProps {
  sheets: Sheet[];
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>;
  activeSheetId: string;
  setActiveSheetId: (id: string) => void;
  setFormulaValue: (value: string) => void;
}

export const useSheetManagement = ({
  sheets,
  setSheets,
  activeSheetId,
  setActiveSheetId,
  setFormulaValue
}: UseSheetManagementProps) => {
  
  const addNewSheet = () => {
    const newSheetId = `sheet${sheets.length + 1}`;
    const newSheetName = `Sheet${sheets.length + 1}`;
    
    setSheets([
      ...sheets, 
      { 
        id: newSheetId, 
        name: newSheetName, 
        cells: {}, 
        activeCell: 'A1', 
        columnWidths: {}, 
        rowHeights: {},
        history: { past: [], future: [] }
      }
    ]);
    setActiveSheetId(newSheetId);
  };

  const handleSheetSelect = (sheetId: string) => {
    setActiveSheetId(sheetId);
    const sheet = sheets.find(s => s.id === sheetId) || sheets[0];
    setFormulaValue(sheet.cells[sheet.activeCell]?.value || '');
  };

  const handleRenameSheet = (sheetId: string, newName: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === sheetId 
          ? { ...sheet, name: newName }
          : sheet
      )
    );
    toast.success(`Sheet renamed to ${newName}`);
    voiceAssistant.speak(`Sheet renamed to ${newName}`);
  };

  const handleDeleteSheet = (sheetId: string) => {
    // Don't allow deleting the last sheet
    if (sheets.length <= 1) {
      toast.error("Cannot delete the only sheet");
      return;
    }
    
    // If deleting the active sheet, switch to another sheet first
    if (sheetId === activeSheetId) {
      const otherSheetId = sheets.find(s => s.id !== sheetId)?.id || '';
      setActiveSheetId(otherSheetId);
    }
    
    setSheets(prevSheets => prevSheets.filter(sheet => sheet.id !== sheetId));
    toast.success("Sheet deleted");
    voiceAssistant.speak("Sheet deleted");
  };

  return {
    addNewSheet,
    handleSheetSelect,
    handleRenameSheet,
    handleDeleteSheet
  };
};
