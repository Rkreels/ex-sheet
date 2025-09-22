
import { useState, useCallback } from 'react';
import { Sheet, Cell, CellSelection } from '../types/sheet';
import { batchEvaluateFormulas } from '../utils/formulaEvaluator';
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
      columns: {},
      rows: {},
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

    // Deep copy and clear any previous calculated values
    const newCells: Record<string, Cell> = {};
    Object.entries(demoData).forEach(([key, cell]) => {
      newCells[key] = { ...cell } as Cell;
      if ('calculatedValue' in newCells[key]!) {
        delete (newCells[key] as any).calculatedValue;
      }
    });

    // Set cells immediately for snappy UI, then batch-calculate formulas
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: newCells }
          : sheet
      )
    );

    // Batch evaluate formulas without blocking UI
    setTimeout(() => {
      const formulaCells = Object.keys(newCells).filter(
        (id) => typeof newCells[id]?.value === 'string' && String(newCells[id].value).startsWith('=')
      );

      if (formulaCells.length > 0) {
        batchEvaluateFormulas(formulaCells, newCells);
        setSheets(prevSheets => 
          prevSheets.map(sheet => 
            sheet.id === activeSheetId 
              ? { ...sheet, cells: { ...newCells } }
              : sheet
          )
        );
      }

      toast.success("Template loaded successfully!");
    }, 0);
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
