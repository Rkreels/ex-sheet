
import React from 'react';
import Spreadsheet from './Spreadsheet';
import SpreadsheetEnhancer from './SpreadsheetEnhancer';
import { Sheet, CellSelection } from '../types/sheet';
import { useHotkeys } from '../hooks/useHotkeys';
import { formulaFunctions } from '../utils/formulaFunctions';

interface SpreadsheetContainerProps {
  sheet: Sheet;
  onCellChange: (cellId: string, value: string) => void;
  onCellSelect: (cellId: string) => void;
  onCellSelectionChange: (selection: CellSelection | null) => void;
  onColumnWidthChange: (columnId: string, width: number) => void;
  onRowHeightChange: (rowId: number, height: number) => void;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onFind?: () => void;
}

const SpreadsheetContainer: React.FC<SpreadsheetContainerProps> = ({
  sheet,
  onCellChange,
  onCellSelect,
  onCellSelectionChange,
  onColumnWidthChange,
  onRowHeightChange,
  onCopy = () => {},
  onCut = () => {},
  onPaste = () => {},
  onUndo = () => {},
  onRedo = () => {},
  onDelete = () => {},
  onFind = () => {}
}) => {
  // Initialize hotkeys for keyboard navigation with all callbacks
  useHotkeys(
    sheet?.activeCell || 'A1',
    onCellSelect,
    onCopy,
    onCut,
    onPaste,
    onUndo,
    onRedo
  );

  return (
    <div className="w-full h-full overflow-auto bg-white">
      <SpreadsheetEnhancer
        cells={sheet?.cells || {}}
        activeCell={sheet?.activeCell || 'A1'}
        onCellChange={onCellChange}
        onCellSelect={onCellSelect}
        onCopy={onCopy}
        onCut={onCut}
        onPaste={onPaste}
        onUndo={onUndo}
        onRedo={onRedo}
        onDelete={onDelete}
        onFind={onFind}
        formulaFunctions={Object.values(formulaFunctions)}
      >
        <Spreadsheet 
          cells={sheet?.cells || {}} 
          activeCell={sheet?.activeCell || 'A1'}
          onCellChange={onCellChange}
          onCellSelect={onCellSelect}
          onCellSelectionChange={onCellSelectionChange}
          columnWidths={sheet?.columnWidths || {}}
          rowHeights={sheet?.rowHeights || {}}
          onColumnWidthChange={onColumnWidthChange}
          onRowHeightChange={onRowHeightChange}
        />
      </SpreadsheetEnhancer>
    </div>
  );
};

export default SpreadsheetContainer;
