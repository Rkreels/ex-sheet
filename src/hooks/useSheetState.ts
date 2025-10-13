
import { useState, useCallback, startTransition } from 'react';
import { Sheet, Cell, CellSelection } from '../types/sheet';
import { toast } from 'sonner';
import voiceAssistant from '../utils/voiceAssistant';
import { useUndoRedo } from './state/useUndoRedo';
import { useSheetManagement } from './state/useSheetManagement';
import { useCellManagement } from './state/useCellManagement';
import { recalcAll } from '../utils/formulaWorkerClient';

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

    // Recalculate immediately and apply results in chunks to keep UI responsive
    const currentSheetId = activeSheetId;
    (async () => {
      try {
        const { cells: computed } = await recalcAll(newCells);

        const entries = Object.entries(computed);
        const chunkSize = 500;
        let index = 0;

        const applyNext = () => {
          if (index >= entries.length) {
            toast.success("Template loaded successfully!");
            return;
          }
          const slice = entries.slice(index, index + chunkSize);
          index += chunkSize;

          startTransition(() => {
            setSheets(prevSheets =>
              prevSheets.map(sheet => {
                if (sheet.id !== currentSheetId) return sheet;
                const mergedCells: Record<string, any> = { ...sheet.cells };
                for (const [id, cell] of slice) {
                  const prevCell = mergedCells[id] || {};
                  // Create a NEW object to ensure React re-renders memoized cells
                  mergedCells[id] = { ...prevCell, ...cell };
                }
                return { ...sheet, cells: mergedCells };
              })
            );
          });

          // Schedule next chunk without blocking
          setTimeout(applyNext, 0);
        };

        applyNext();
      } catch (err) {
        console.error('Template recalculation error:', err);
        toast.error('Template loaded with calculation issues.');
      }
    })();

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
