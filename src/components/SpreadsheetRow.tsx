
import React from 'react';
import SpreadsheetCell from './SpreadsheetCell';
import { Cell } from '../types/sheet';

interface SpreadsheetRowProps {
  rowIndex: number;
  columns: number;
  cells: Record<string, Cell>;
  activeCell: string;
  selection: { startCell: string, endCell: string } | null;
  columnWidths: Record<string, number>;
  rowHeight: number;
  onCellClick: (rowIndex: number, colIndex: number) => void;
  onDoubleClick: (rowIndex: number, colIndex: number) => void;
  onCellMouseDown: (rowIndex: number, colIndex: number, e: React.MouseEvent) => void;
  onCellMouseOver: (rowIndex: number, colIndex: number) => void;
  onCellDrop: (cellId: string) => void;
  onCellDragStart: (cellId: string) => void;
  onCellDragEnd: () => void;
  onCellValueChange: (cellId: string, value: string) => void;
  isCellInSelection: (cellId: string) => boolean;
  onRowHeightChange: (rowId: number, height: number) => void;
  onRowHeaderClick: (rowIndex: number, e: React.MouseEvent) => void;
}

const SpreadsheetRow: React.FC<SpreadsheetRowProps> = ({
  rowIndex,
  columns,
  cells,
  activeCell,
  selection,
  columnWidths,
  rowHeight,
  onCellClick,
  onDoubleClick,
  onCellMouseDown,
  onCellMouseOver,
  onCellDrop,
  onCellDragStart,
  onCellDragEnd,
  onCellValueChange,
  isCellInSelection,
  onRowHeightChange,
  onRowHeaderClick
}) => {
  const getColumnLabel = (index: number) => {
    if (index < 26) {
      return String.fromCharCode(65 + index); // A, B, C, ...
    } else {
      const firstChar = String.fromCharCode(65 + Math.floor(index / 26) - 1);
      const secondChar = String.fromCharCode(65 + (index % 26));
      return `${firstChar}${secondChar}`;
    }
  };

  const getCellId = (rowIndex: number, colIndex: number) => {
    return `${getColumnLabel(colIndex)}${rowIndex + 1}`;
  };

  // Check if this row is in the current selection
  const isRowSelected = () => {
    if (!selection) return false;
    
    const [startCol, startRowStr] = selection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [endCol, endRowStr] = selection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    
    if (!startRowStr || !endRowStr) return false;
    
    const startRowIdx = parseInt(startRowStr, 10) - 1;
    const endRowIdx = parseInt(endRowStr, 10) - 1;
    const minRowIdx = Math.min(startRowIdx, endRowIdx);
    const maxRowIdx = Math.max(startRowIdx, endRowIdx);
    
    return rowIndex >= minRowIdx && rowIndex <= maxRowIdx;
  };

  const handleRowResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Starting Y position
    const startY = e.clientY;
    // Current height
    const currentHeight = rowHeight;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientY - startY;
      const newHeight = Math.max(20, currentHeight + delta);
      onRowHeightChange(rowIndex + 1, newHeight);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRowHeaderClick = (e: React.MouseEvent) => {
    onRowHeaderClick(rowIndex, e);
  };

  return (
    <div className="flex">
      {/* Row header - click to select entire row */}
      <div 
        className={`bg-excel-headerBg border-r border-b border-excel-gridBorder flex-none flex items-center justify-center text-gray-700 font-medium text-xs cursor-pointer relative hover:bg-excel-hoverBg ${isRowSelected() ? 'bg-blue-100' : ''}`}
        style={{ 
          width: '40px', 
          height: `${rowHeight}px`,
          minHeight: `${rowHeight}px`
        }}
        onClick={handleRowHeaderClick}
      >
        {rowIndex + 1}
        {/* Resize handle */}
        <div 
          className="absolute bottom-0 left-0 w-full h-2 cursor-row-resize hover:bg-blue-400"
          onMouseDown={handleRowResize}
        ></div>
      </div>

      {/* Row cells */}
      <div className="flex">
        {Array.from({ length: columns }, (_, colIndex) => {
          const cellId = getCellId(rowIndex, colIndex);
          const cellData = cells[cellId];
          const isActive = cellId === activeCell;
          const isSelected = isCellInSelection(cellId);
          const width = columnWidths[getColumnLabel(colIndex)] || 100;
          
          return (
            <SpreadsheetCell
              key={`cell-${rowIndex}-${colIndex}`}
              cellId={cellId}
              rowIndex={rowIndex}
              colIndex={colIndex}
              cellData={cellData}
              isActive={isActive}
              isSelected={isSelected}
              width={width}
              height={rowHeight}
              cells={cells}
              onCellClick={onCellClick}
              onDoubleClick={onDoubleClick}
              onCellMouseDown={onCellMouseDown}
              onCellMouseOver={onCellMouseOver}
              onCellDrop={onCellDrop}
              onCellDragStart={onCellDragStart}
              onCellDragEnd={onCellDragEnd}
              onCellValueChange={(value) => onCellValueChange(cellId, value)}
              onCellBlur={() => {}}
              onCellKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onCellClick(rowIndex + 1, colIndex);
                } else if (e.key === 'Tab') {
                  e.preventDefault();
                  onCellClick(rowIndex, colIndex + 1);
                } else if (e.key === 'Escape') {
                  // Cancel editing - handled within cell component
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SpreadsheetRow;
