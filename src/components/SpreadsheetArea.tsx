
import React from 'react';
import FormulaBar from './FormulaBar';
import SpreadsheetContainer from './SpreadsheetContainer';
import { Sheet, CellSelection } from '../types/sheet';
import { formulaFunctions } from '../utils/formulaFunctions';

interface SpreadsheetAreaProps {
  activeSheet: Sheet;
  activeCell: string;
  formulaValue: string;
  cellSelection: CellSelection | null;
  handleCellChange: (cellId: string, value: string) => void;
  handleCellSelect: (cellId: string) => void;
  handleCellSelectionChange: (selection: CellSelection | null) => void;
  handleFormulaChange: (value: string) => void;
  updateColumnWidth: (columnId: string, width: number) => void;
  updateRowHeight: (rowId: number, height: number) => void;
  handleCopy: () => void;
  handleCut: () => void;
  handlePaste: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleColumnDragDrop?: (sourceIndex: number, targetIndex: number) => void;
  handleRowDragDrop?: (sourceIndex: number, targetIndex: number) => void;
  onMultiCellOperation?: (operation: string, value?: string) => void;
  onFillSeries?: (options: any) => void;
}

const SpreadsheetArea: React.FC<SpreadsheetAreaProps> = ({
  activeSheet,
  activeCell,
  formulaValue,
  cellSelection,
  handleCellChange,
  handleCellSelect,
  handleCellSelectionChange,
  handleFormulaChange,
  updateColumnWidth,
  updateRowHeight,
  handleCopy,
  handleCut,
  handlePaste,
  handleUndo,
  handleRedo,
  handleColumnDragDrop,
  handleRowDragDrop,
  onMultiCellOperation = () => {},
  onFillSeries = () => {}
}) => {
  // Make the column drag drop handler available globally for the SpreadsheetHeader component
  if (handleColumnDragDrop) {
    window.handleColumnDragDrop = handleColumnDragDrop;
  }
  
  // Make the row drag drop handler available globally for the row headers
  if (handleRowDragDrop) {
    window.handleRowDragDrop = handleRowDragDrop;
  }
  
  return (
    <>
      <div className="flex-none h-6 border-b border-gray-300 flex items-center bg-white px-2 print:hidden">
        <div className="text-sm font-mono">{activeCell}</div>
        <div className="mx-2">≡</div>
        <FormulaBar 
          value={formulaValue} 
          onChange={handleFormulaChange} 
          cellId={activeCell}
          formulaFunctions={formulaFunctions}
        />
      </div>
      <div className="flex-grow overflow-hidden">
        <SpreadsheetContainer
          sheet={activeSheet}
          onCellChange={handleCellChange}
          onCellSelect={handleCellSelect}
          onCellSelectionChange={handleCellSelectionChange}
          onColumnWidthChange={updateColumnWidth}
          onRowHeightChange={updateRowHeight}
          onCopy={handleCopy}
          onCut={handleCut}
          onPaste={handlePaste}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDelete={() => {}}
          onFind={() => {}}
        />
      </div>
    </>
  );
};

// Add handleColumnDragDrop to the Window interface
declare global {
  interface Window {
    handleColumnDragDrop?: (sourceIndex: number, targetIndex: number) => void;
    handleRowDragDrop?: (sourceIndex: number, targetIndex: number) => void;
  }
}

export default SpreadsheetArea;
