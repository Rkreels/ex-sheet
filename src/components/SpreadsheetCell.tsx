
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

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

  // Optimized display value calculation with memoization
  useEffect(() => {
    if (!cellData?.value) {
      setDisplayValue('');
      return;
    }

    if (typeof cellData.value === 'string' && cellData.value.startsWith('=')) {
      // Prefer precomputed value when available (performance)
      const computed = (cellData as any).calculatedValue;
      if (computed !== undefined) {
        const result = computed as any;
        if (typeof result === 'number' && cellData.format?.numberFormat) {
          switch (cellData.format.numberFormat) {
            case 'percentage':
              setDisplayValue((result * 100).toFixed(2) + '%');
              break;
            case 'currency':
              setDisplayValue('$' + result.toFixed(2));
              break;
            case 'number':
              setDisplayValue(result.toFixed(2));
              break;
            default:
              setDisplayValue(result.toString());
          }
        } else {
          setDisplayValue(String(result));
        }
        return;
      }

      // Fallback: defer evaluation to background worker to keep UI responsive
      setDisplayValue('...');

    } else {
      // Handle direct number formatting
      if (cellData.format?.numberFormat && !isNaN(parseFloat(cellData.value))) {
        const num = parseFloat(cellData.value);
        switch (cellData.format.numberFormat) {
          case 'percentage':
            setDisplayValue((num * 100).toFixed(2) + '%');
            break;
          case 'currency':
            setDisplayValue('$' + num.toFixed(2));
            break;
          case 'number':
            setDisplayValue(num.toFixed(2));
            break;
          default:
            setDisplayValue(String(cellData.value));
        }
      } else {
        setDisplayValue(String(cellData.value));
      }
    }
  }, [cellData?.value, cellData?.format, (cellData as any)?.calculatedValue]);

  // Update edit value when cell becomes active
  useEffect(() => {
    if (isActive && !editing) {
      setEditValue(cellData?.value || '');
    }
  }, [isActive, cellData, editing]);

  // Enhanced keyboard events for fast editing
  useEffect(() => {
    if (isActive && cellRef.current) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (editing) return;
        
        // Start editing immediately on printable characters
        if (e.key === 'F2' || 
            e.key === 'Delete' || 
            e.key === 'Backspace' ||
            e.key === '=' ||
            (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey)) {
          
          e.preventDefault();
          setEditing(true);
          
          if (e.key === 'Delete' || e.key === 'Backspace') {
            setEditValue('');
            onCellValueChange('');
          } else if (e.key !== 'F2') {
            setEditValue(e.key);
            onCellValueChange(e.key);
          } else {
            setEditValue(cellData?.value || '');
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, editing, cellData?.value, onCellValueChange]);

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
        "border-r border-b border-excel-gridBorder relative cursor-cell flex items-center px-1 transition-colors duration-75",
        isActive && "border-2 border-blue-500 z-10 bg-white",
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

export default React.memo(SpreadsheetCell);
