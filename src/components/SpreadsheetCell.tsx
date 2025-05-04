
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { Cell } from '../types/sheet';
import CellContextMenu from './CellContextMenu';
import CellDisplay from './cell/CellDisplay';
import CellEditor from './cell/CellEditor';

interface SpreadsheetCellProps {
  cellId: string;
  rowIndex: number;
  colIndex: number;
  cellData: Cell | undefined;
  isActive: boolean;
  isSelected: boolean;
  width: number;
  height: number;
  cells: Record<string, Cell>;
  onCellClick: (rowIndex: number, colIndex: number) => void;
  onDoubleClick: (rowIndex: number, colIndex: number) => void;
  onCellMouseDown: (rowIndex: number, colIndex: number, e: React.MouseEvent) => void;
  onCellMouseOver: (rowIndex: number, colIndex: number) => void;
  onCellDrop: (cellId: string) => void;
  onCellDragStart: (cellId: string) => void;
  onCellDragEnd: () => void;
  onCellValueChange: (value: string) => void;
  onCellBlur: () => void;
  onCellKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SpreadsheetCell: React.FC<SpreadsheetCellProps> = ({
  cellId,
  rowIndex,
  colIndex,
  cellData,
  isActive,
  isSelected,
  width,
  height,
  cells,
  onCellClick,
  onDoubleClick,
  onCellMouseDown,
  onCellMouseOver,
  onCellDrop,
  onCellDragStart,
  onCellDragEnd,
  onCellValueChange,
  onCellBlur,
  onCellKeyDown
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Calculate display value for formulas and update when cells change
  useEffect(() => {
    if (!cellData?.value) {
      setDisplayValue('');
      return;
    }

    if (cellData.value.startsWith('=')) {
      try {
        const result = evaluateFormula(cellData.value.substring(1), cells);
        setDisplayValue(result.toString());
      } catch (error) {
        console.error('Formula evaluation error:', error);
        setDisplayValue('#ERROR');
      }
    } else {
      setDisplayValue(cellData.value);
    }
  }, [cellData, cells]);

  // Update edit value when cell becomes active
  useEffect(() => {
    if (isActive) {
      setEditValue(cellData?.value || '');
    }
  }, [isActive, cellData]);

  // Handle click with improved timing detection for edit mode
  const handleCellClick = (e: React.MouseEvent) => {
    onCellClick(rowIndex, colIndex);
    
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;
    
    // If this is a second click within 300ms, treat as double click
    if (timeDiff < 300 && isActive) {
      startEditing();
    } else if (isActive) {
      // If cell is already active and we're clicking on it again, start editing
      startEditing();
    }
    
    setLastClickTime(currentTime);
    
    // Handle format painter case
    if (document.body.style.cursor === 'cell') {
      handleFormatPainted();
    }
  };
  
  const startEditing = () => {
    setEditing(true);
    setEditValue(cellData?.value || '');
  };

  // Handle input change in edit mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
    onCellValueChange(e.target.value);
  };

  // Handle input blur (finish editing)
  const handleInputBlur = () => {
    setEditing(false);
    onCellBlur();
  };

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditing(false);
      onCellKeyDown(e);
    } else if (e.key === 'Escape') {
      setEditing(false);
      // Restore original value
      onCellValueChange(cellData?.value || '');
    } else {
      onCellKeyDown(e);
    }
  };

  // Handle drag over for visual feedback
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Handle drop
  const handleDrop = () => {
    setDragOver(false);
    onCellDrop(cellId);
  };

  // Handle format painter
  const handleFormatPainted = () => {
    // This will be handled by the global format painter handler
    if (document.body.style.cursor === 'cell') {
      document.body.style.cursor = 'default';
    }
  };

  // Get column letter from index
  const getColumnLabel = (index: number) => {
    if (index < 26) {
      return String.fromCharCode(65 + index); // A, B, C, ...
    } else {
      const firstChar = String.fromCharCode(65 + Math.floor(index / 26) - 1);
      const secondChar = String.fromCharCode(65 + (index % 26));
      return `${firstChar}${secondChar}`;
    }
  };

  // Highlight specific columns to match Excel-like styling
  const isColumnE = getColumnLabel(colIndex) === 'E';
  const isRow3 = rowIndex + 1 === 3;

  // Context menu handlers
  const handleCellCopy = () => {
    const copyEvent = new Event('copy-cell') as any;
    copyEvent.cellId = cellId;
    document.dispatchEvent(copyEvent);
  };
  
  const handleCellCut = () => {
    const cutEvent = new Event('cut-cell') as any;
    cutEvent.cellId = cellId;
    document.dispatchEvent(cutEvent);
  };
  
  const handleCellPaste = () => {
    const pasteEvent = new Event('paste-cell') as any;
    pasteEvent.cellId = cellId;
    document.dispatchEvent(pasteEvent);
  };
  
  const handleCellDelete = () => {
    const deleteEvent = new Event('delete-cell') as any;
    deleteEvent.cellId = cellId;
    document.dispatchEvent(deleteEvent);
  };

  const cellContent = (
    <div
      className={cn(
        "border-r border-b border-excel-gridBorder relative",
        isActive && "border border-excel-blue z-10",
        isSelected && !isActive && "bg-blue-100",
        dragOver && "bg-green-50 border-green-500",
        isColumnE && !isActive && !isSelected && !dragOver && "bg-amber-50",
        isRow3 && !isActive && !isSelected && !dragOver && "bg-amber-50",
        !isActive && !isSelected && !isColumnE && !isRow3 && !dragOver && "hover:bg-excel-hoverBg"
      )}
      style={{ 
        width: `${width}px`, 
        minWidth: `${width}px`,
        height: `${height}px`,
        minHeight: `${height}px`,
      }}
      onClick={handleCellClick}
      onDoubleClick={() => onDoubleClick(rowIndex, colIndex)}
      onMouseDown={(e) => onCellMouseDown(rowIndex, colIndex, e)}
      onMouseOver={() => onCellMouseOver(rowIndex, colIndex)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={!editing}
      onDragStart={() => onCellDragStart(cellId)} 
      onDragEnd={onCellDragEnd}
      data-cell-id={cellId}
    >
      {isActive && editing ? (
        <CellEditor
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <CellDisplay cellData={cellData} displayValue={displayValue} />
      )}
    </div>
  );

  return (
    <CellContextMenu
      onCopy={handleCellCopy}
      onCut={handleCellCut}
      onPaste={handleCellPaste}
      onDelete={handleCellDelete}
      onMove={() => {}}
    >
      {cellContent}
    </CellContextMenu>
  );
};

export default SpreadsheetCell;
