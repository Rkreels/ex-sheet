
import { useState, useCallback } from 'react';
import { Sheet, Cell, UndoRedoState } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { toast } from 'sonner';
import voiceAssistant from '../utils/voiceAssistant';

export const useSheetState = () => {
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
  const [cellSelection, setCellSelection] = useState<{startCell: string, endCell: string} | null>(null);
  const [clipboard, setClipboard] = useState<{cells: Record<string, Cell>, startCell: string} | null>(null);

  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId) || sheets[0];
  const activeCell = activeSheet?.activeCell || 'A1';
  const activeCellValue = activeSheet?.cells[activeCell]?.value || '';

  // Function to save current state before making changes
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

  const handleCellSelectionChange = (selection: {startCell: string, endCell: string} | null) => {
    setCellSelection(selection);
  };

  const handleFormulaChange = (value: string) => {
    setFormulaValue(value);
    handleCellChange(activeCell, value);
  };

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
  
  // Undo functionality
  const handleUndo = () => {
    const sheet = sheets.find(s => s.id === activeSheetId);
    if (!sheet || !sheet.history || sheet.history.past.length === 0) {
      toast.error("Nothing to undo");
      return;
    }

    const lastPast = sheet.history.past.pop();
    if (!lastPast) return;

    setSheets(prevSheets => 
      prevSheets.map(s => 
        s.id === activeSheetId 
          ? {
              ...s,
              cells: lastPast.cells,
              history: {
                past: [...(s.history?.past || [])],
                future: [
                  { cells: { ...s.cells } },
                  ...(s.history?.future || [])
                ]
              }
            }
          : s
      )
    );
    toast.success("Undo successful");
  };
  
  // Redo functionality
  const handleRedo = () => {
    const sheet = sheets.find(s => s.id === activeSheetId);
    if (!sheet || !sheet.history || sheet.history.future.length === 0) {
      toast.error("Nothing to redo");
      return;
    }

    const firstFuture = sheet.history.future.shift();
    if (!firstFuture) return;

    setSheets(prevSheets => 
      prevSheets.map(s => 
        s.id === activeSheetId 
          ? {
              ...s,
              cells: firstFuture.cells,
              history: {
                past: [
                  ...(s.history?.past || []),
                  { cells: { ...s.cells } }
                ],
                future: [...(s.history?.future || [])]
              }
            }
          : s
      )
    );
    toast.success("Redo successful");
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
    handleDemoData,
    handleUndo,
    handleRedo,
    setSheets
  };
};
