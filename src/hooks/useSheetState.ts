
import { useState } from 'react';
import { Sheet, Cell, FormulaFunctionName, FormulaFunction } from '../types/sheet';
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
    },
  ]);
  const [activeSheetId, setActiveSheetId] = useState('sheet1');
  const [formulaValue, setFormulaValue] = useState('');
  const [cellSelection, setCellSelection] = useState<{startCell: string, endCell: string} | null>(null);
  const [clipboard, setClipboard] = useState<{cells: Record<string, Cell>, startCell: string} | null>(null);

  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId) || sheets[0];
  const activeCell = activeSheet?.activeCell || 'A1';
  const activeCellValue = activeSheet?.cells[activeCell]?.value || '';

  const handleCellChange = (cellId: string, value: string) => {
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
      { id: newSheetId, name: newSheetName, cells: {}, activeCell: 'A1', columnWidths: {}, rowHeights: {} }
    ]);
    setActiveSheetId(newSheetId);
  };

  const handleSheetSelect = (sheetId: string) => {
    setActiveSheetId(sheetId);
    const sheet = sheets.find(s => s.id === sheetId) || sheets[0];
    setFormulaValue(sheet.cells[sheet.activeCell]?.value || '');
  };

  const handleDemoData = (demoData: Record<string, any>) => {
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
    handleDemoData,
    setSheets
  };
};
