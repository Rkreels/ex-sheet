
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { Cell } from '../types/sheet';
import CellContextMenu from './CellContextMenu';

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isActive && editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isActive, editing]);

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

  // Handle double click to start editing
  const handleDoubleClickInternal = () => {
    onDoubleClick(rowIndex, colIndex);
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

  // Prepare context menu handlers
  const handleCellCopy = () => {
    // Trigger copy function via context
    const copyEvent = new Event('copy-cell') as any;
    copyEvent.cellId = cellId;
    document.dispatchEvent(copyEvent);
  };
  
  const handleCellCut = () => {
    // Trigger cut function via context
    const cutEvent = new Event('cut-cell') as any;
    cutEvent.cellId = cellId;
    document.dispatchEvent(cutEvent);
  };
  
  const handleCellPaste = () => {
    // Trigger paste function via context
    const pasteEvent = new Event('paste-cell') as any;
    pasteEvent.cellId = cellId;
    document.dispatchEvent(pasteEvent);
  };
  
  const handleCellDelete = () => {
    // Trigger delete function via context
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
      onClick={() => onCellClick(rowIndex, colIndex)}
      onDoubleClick={handleDoubleClickInternal}
      onMouseDown={(e) => onCellMouseDown(rowIndex, colIndex, e)}
      onMouseOver={() => onCellMouseOver(rowIndex, colIndex)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={!editing}
      onDragStart={() => onCellDragStart(cellId)} 
      onDragEnd={onCellDragEnd}
      onClick={handleFormatPainted}
      data-cell-id={cellId}
    >
      {isActive && editing ? (
        <input
          ref={inputRef}
          type="text"
          className="absolute top-0 left-0 w-full h-full px-1 outline-none"
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div 
          className={cn(
            "w-full h-full px-1 overflow-hidden text-sm",
            cellData?.format?.bold && "font-bold",
            cellData?.format?.italic && "italic",
            cellData?.format?.underline && "underline",
            cellData?.format?.alignment === 'left' && "text-left",
            cellData?.format?.alignment === 'center' && "text-center",
            cellData?.format?.alignment === 'right' && "text-right",
            !cellData?.format?.alignment && "text-left"
          )}
          style={{
            color: cellData?.format?.color || 'inherit',
            backgroundColor: cellData?.format?.backgroundColor || 'transparent',
            fontFamily: cellData?.format?.fontFamily || 'inherit',
            fontSize: cellData?.format?.fontSize || 'inherit'
          }}
        >
          {displayValue}
        </div>
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
