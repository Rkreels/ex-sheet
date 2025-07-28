
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { Cell } from '../types/sheet';
import CellContextMenu from './CellContextMenu';
import CellDisplay from './cell/CellDisplay';
import CellEditor from './cell/CellEditor';
import CellFormatting from './cell/CellFormatting';

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
  const cellRef = useRef<HTMLDivElement>(null);

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
    if (isActive && !editing) {
      setEditValue(cellData?.value || '');
    }
  }, [isActive, cellData, editing]);

  // Handle keyboard events for starting edit mode
  useEffect(() => {
    if (isActive && cellRef.current) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Don't handle if already editing
        if (editing) return;
        
        // Start editing on alphanumeric keys, =, or Delete/Backspace
        if (e.key === 'F2' || 
            e.key === 'Delete' || 
            e.key === 'Backspace' ||
            e.key === '=' ||
            (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)) {
          
          e.preventDefault();
          startEditing();
          
          if (e.key === 'Delete' || e.key === 'Backspace') {
            setEditValue('');
            onCellValueChange('');
          } else if (e.key !== 'F2') {
            setEditValue(e.key);
            onCellValueChange(e.key);
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, editing, onCellValueChange]);

  // Start editing function for cell
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
      e.preventDefault();
      setEditing(false);
      onCellKeyDown(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditing(false);
      setEditValue(cellData?.value || '');
      onCellValueChange(cellData?.value || '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setEditing(false);
      onCellKeyDown(e);
    }
  };

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    onCellDrop(cellId);
  };

  // Context menu handlers
  const handleCellCopy = () => {
    const copyEvent = new CustomEvent('excel-copy', { detail: { cellId } });
    document.dispatchEvent(copyEvent);
  };
  
  const handleCellCut = () => {
    const cutEvent = new CustomEvent('excel-cut', { detail: { cellId } });
    document.dispatchEvent(cutEvent);
  };
  
  const handleCellPaste = () => {
    const pasteEvent = new CustomEvent('excel-paste', { detail: { cellId } });
    document.dispatchEvent(pasteEvent);
  };
  
  const handleCellDelete = () => {
    onCellValueChange('');
  };

  // Get column letter from index
  const getColumnLabel = (index: number) => {
    if (index < 26) {
      return String.fromCharCode(65 + index);
    } else {
      const firstChar = String.fromCharCode(65 + Math.floor(index / 26) - 1);
      const secondChar = String.fromCharCode(65 + (index % 26));
      return `${firstChar}${secondChar}`;
    }
  };

  // Apply cell formatting
  const getCellStyle = () => {
    const format = cellData?.format;
    const style: React.CSSProperties = {
      width: `${width}px`,
      minWidth: `${width}px`,
      height: `${height}px`,
      minHeight: `${height}px`,
    };

    if (format) {
      if (format.bold) style.fontWeight = 'bold';
      if (format.italic) style.fontStyle = 'italic';
      if (format.underline) style.textDecoration = 'underline';
      if (format.fontSize) style.fontSize = format.fontSize;
      if (format.fontFamily) style.fontFamily = format.fontFamily;
      if (format.color) style.color = format.color;
      if (format.backgroundColor) style.backgroundColor = format.backgroundColor;
      if (format.alignment) style.textAlign = format.alignment;
    }

    return style;
  };

  const cellContent = (
    <div
      ref={cellRef}
      className={cn(
        "border-r border-b border-excel-gridBorder relative cursor-cell flex items-center px-1",
        isActive && "border-2 border-blue-500 z-10",
        isSelected && !isActive && "bg-blue-100",
        dragOver && "bg-green-50 border-green-500",
        !isActive && !isSelected && !dragOver && "hover:bg-gray-50"
      )}
      style={getCellStyle()}
      onClick={() => onCellClick(rowIndex, colIndex)}
      onDoubleClick={() => {
        onDoubleClick(rowIndex, colIndex);
        startEditing();
      }}
      onMouseDown={(e) => onCellMouseDown(rowIndex, colIndex, e)}
      onMouseOver={() => onCellMouseOver(rowIndex, colIndex)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={!editing}
      onDragStart={() => onCellDragStart(cellId)} 
      onDragEnd={onCellDragEnd}
      data-cell-id={cellId}
      tabIndex={isActive ? 0 : -1}
      aria-label={`Cell ${cellId}`}
    >
      {isActive && editing ? (
        <CellEditor
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <CellFormatting 
          cellData={cellData} 
          displayValue={displayValue}
          width={width}
          height={height}
        />
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
