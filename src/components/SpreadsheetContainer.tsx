
import React from 'react';
import Spreadsheet from './Spreadsheet';
import { Sheet, CellSelection } from '../types/sheet';
import { useHotkeys } from '../hooks/useHotkeys';

interface SpreadsheetContainerProps {
  sheet: Sheet;
  onCellChange: (cellId: string, value: string) => void;
  onCellSelect: (cellId: string) => void;
  onCellSelectionChange: (selection: CellSelection | null) => void;
  onColumnWidthChange: (columnId: string, width: number) => void;
  onRowHeightChange: (rowId: number, height: number) => void;
}

const SpreadsheetContainer: React.FC<SpreadsheetContainerProps> = ({
  sheet,
  onCellChange,
  onCellSelect,
  onCellSelectionChange,
  onColumnWidthChange,
  onRowHeightChange
}) => {
  // Initialize hotkeys for keyboard navigation
  useHotkeys();

  return (
    <div className="w-full h-full overflow-auto bg-white">
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
    </div>
  );
};

export default SpreadsheetContainer;
