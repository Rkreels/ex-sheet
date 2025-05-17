
import { useState, useCallback } from 'react';
import { Sheet, Cell, UndoRedoState, CellSelection } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { toast } from 'sonner';
import voiceAssistant from '../utils/voiceAssistant';
import { useUndoRedo } from './state/useUndoRedo';
import { useSheetManagement } from './state/useSheetManagement';
import { useCellManagement } from './state/useCellManagement';

export const useSheetState = () => {
  // Initial state
  const [sheets, setSheets] = useState<Sheet[]>([
    { 
      id: 'sheet1', 
      name: 'Sheet1', 
      cells: {}, 
      activeCell: 'A1',
      columnWidths: {},
      rowHeights: {},
      history: { past: [], future: [] }
    },
  ]);
  const [activeSheetId, setActiveSheetId] = useState('sheet1');
  const [formulaValue, setFormulaValue] = useState('');
  const [cellSelection, setCellSelection] = useState<CellSelection | null>(null);
  const [clipboard, setClipboard] = useState<{cells: Record<string, Cell>, startCell: string} | null>(null);

  // Derived state
  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId) || sheets[0];
  const activeCell = activeSheet?.activeCell || 'A1';
  const activeCellValue = activeSheet?.cells[activeCell]?.value || '';

  // Function to save state for undo/redo
  const saveState = useCallback(() => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              history: {
                past: [
                  ...(sheet.history?.past || []),
                  { cells: { ...sheet.cells } }
                ],
                future: []
              }
            }
          : sheet
      )
    );
  }, [activeSheetId]);

  // Import and use the smaller, more focused hooks
  const { handleUndo, handleRedo } = useUndoRedo({
    sheets,
    setSheets,
    activeSheetId
  });

  const { 
    addNewSheet,
    handleSheetSelect,
    handleRenameSheet,
    handleDeleteSheet
  } = useSheetManagement({
    sheets,
    setSheets,
    activeSheetId,
    setActiveSheetId,
    setFormulaValue
  });

  const { 
    handleCellChange,
    handleCellSelect,
    handleCellSelectionChange,
    handleFormulaChange
  } = useCellManagement({
    activeSheet,
    activeSheetId,
    activeCell,
    setSheets,
    saveState,
    setFormulaValue,
    setCellSelection
  });

  const handleDemoData = (demoData: Record<string, any>) => {
    saveState();
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: demoData }
          : sheet
      )
    );
    toast.success("Demo data loaded successfully!");
  };

  return {
    sheets,
    activeSheetId,
    activeSheet,
    activeCell,
    activeCellValue,
    formulaValue,
    cellSelection,
    clipboard,
    setClipboard,
    handleCellChange,
    handleCellSelect,
    handleCellSelectionChange,
    handleFormulaChange,
    addNewSheet,
    handleSheetSelect,
    handleRenameSheet,
    handleDeleteSheet,
    handleDemoData,
    handleUndo,
    handleRedo,
    setSheets
  };
};
