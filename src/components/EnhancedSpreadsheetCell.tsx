import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cell, CellFormat } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';

interface EnhancedSpreadsheetCellProps {
  cellId: string;
  cell?: Cell;
  isActive: boolean;
  isSelected: boolean;
  width?: number;
  height?: number;
  onCellChange: (cellId: string, value: string) => void;
  onCellSelect: (cellId: string) => void;
  onCellDoubleClick?: (cellId: string) => void;
  onCellRightClick?: (cellId: string, event: React.MouseEvent) => void;
  onMouseDown?: (event: React.MouseEvent) => void;
  onMouseOver?: (event: React.MouseEvent) => void;
  allCells: Record<string, Cell>;
}

const EnhancedSpreadsheetCell: React.FC<EnhancedSpreadsheetCellProps> = ({
  cellId,
  cell,
  isActive,
  isSelected,
  width = 100,
  height = 25,
  onCellChange,
  onCellSelect,
  onCellDoubleClick,
  onCellRightClick,
  onMouseDown,
  onMouseOver,
  allCells
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);

  const value = cell?.value || '';
  const format = cell?.format || {};

  // Calculate display value with proper formatting
  const getDisplayValue = useCallback(() => {
    if (!cell) return '';
    
    // If editing, show raw value
    if (isEditing) return editValue;
    
    // If cell has calculated value, use it
    if (cell.calculatedValue !== undefined) {
      const calcValue = cell.calculatedValue;
      
      // Handle error values
      if (typeof calcValue === 'string' && calcValue.startsWith('#')) {
        return calcValue;
      }
      
      // Apply number formatting
      if (typeof calcValue === 'number' && format.numberFormat) {
        return formatNumber(calcValue, format.numberFormat);
      }
      
      return String(calcValue);
    }
    
    // For formulas, show calculated result
    if (value.startsWith('=')) {
      try {
        const result = evaluateFormula(value.substring(1), allCells);
        if (typeof result === 'number' && format.numberFormat) {
          return formatNumber(result, format.numberFormat);
        }
        return String(result);
      } catch (error) {
        return '#ERROR!';
      }
    }
    
    // For regular values, apply formatting
    if (format.numberFormat && !isNaN(parseFloat(value))) {
      return formatNumber(parseFloat(value), format.numberFormat);
    }
    
    return value;
  }, [cell, value, format, editValue, isEditing, allCells]);

  // Format numbers according to Excel standards
  const formatNumber = (num: number, formatType: string): string => {
    switch (formatType) {
      case 'currency':
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case 'percentage':
        return (num * 100).toFixed(2) + '%';
      case 'number':
        return num.toLocaleString('en-US');
      case 'accounting':
        return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case 'scientific':
        return num.toExponential(2);
      case 'date':
        return new Date(num).toLocaleDateString();
      case 'time':
        return new Date(num).toLocaleTimeString();
      default:
        return String(num);
    }
  };

  // Build cell styles from format
  const getCellStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      width: `${width}px`,
      height: `${height}px`,
      minHeight: `${height}px`,
      border: '1px solid #d1d5db',
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: isActive ? '#dbeafe' : isSelected ? '#e0f2fe' : '#ffffff',
      fontSize: '14px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'cell'
    };

    // Apply formatting
    if (format.bold) styles.fontWeight = 'bold';
    if (format.italic) styles.fontStyle = 'italic';
    if (format.underline) styles.textDecoration = 'underline';
    if (format.color) styles.color = format.color;
    if (format.backgroundColor) styles.backgroundColor = format.backgroundColor;
    if (format.fontSize) styles.fontSize = format.fontSize;
    if (format.fontFamily) styles.fontFamily = format.fontFamily;
    
    // Text alignment
    if (format.alignment) {
      styles.justifyContent = format.alignment === 'center' ? 'center' : 
                              format.alignment === 'right' ? 'flex-end' : 'flex-start';
    } else {
      // Default alignment based on content type
      const displayValue = getDisplayValue();
      if (!isNaN(parseFloat(displayValue)) && isFinite(parseFloat(displayValue))) {
        styles.justifyContent = 'flex-end'; // Right align numbers
      }
    }

    // Borders
    if (format.borders) {
      if (format.borders.all) {
        styles.border = `1px ${format.borders.all.style} ${format.borders.all.color}`;
      } else {
        if (format.borders.top) styles.borderTop = `1px ${format.borders.top.style} ${format.borders.top.color}`;
        if (format.borders.right) styles.borderRight = `1px ${format.borders.right.style} ${format.borders.right.color}`;
        if (format.borders.bottom) styles.borderBottom = `1px ${format.borders.bottom.style} ${format.borders.bottom.color}`;
        if (format.borders.left) styles.borderLeft = `1px ${format.borders.left.style} ${format.borders.left.color}`;
      }
    }

    // Active cell styling
    if (isActive) {
      styles.border = '2px solid #3b82f6';
      styles.zIndex = 10;
    }

    return styles;
  };

  // Handle editing
  const startEdit = useCallback(() => {
    setIsEditing(true);
    setEditValue(value);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  }, [value]);

  const stopEdit = useCallback((save = true) => {
    if (save && editValue !== value) {
      onCellChange(cellId, editValue);
    }
    setIsEditing(false);
    setEditValue('');
  }, [editValue, value, cellId, onCellChange]);

  // Event handlers
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onCellSelect(cellId);
  }, [cellId, onCellSelect]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    startEdit();
    onCellDoubleClick?.(cellId);
  }, [cellId, onCellDoubleClick, startEdit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (isEditing) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          stopEdit(true);
          break;
        case 'Escape':
          e.preventDefault();
          stopEdit(false);
          break;
        case 'Tab':
          e.preventDefault();
          stopEdit(true);
          break;
      }
    } else {
      switch (e.key) {
        case 'Enter':
        case 'F2':
          e.preventDefault();
          startEdit();
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          onCellChange(cellId, '');
          break;
      }
    }
  }, [isEditing, stopEdit, startEdit, cellId, onCellChange]);

  // Auto-focus on active cell change
  useEffect(() => {
    if (isActive && !isEditing && cellRef.current) {
      cellRef.current.focus();
    }
  }, [isActive, isEditing]);

  return (
    <div
      ref={cellRef}
      style={getCellStyles()}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={onMouseDown}
      onMouseOver={onMouseOver}
      onContextMenu={(e) => {
        e.preventDefault();
        onCellRightClick?.(cellId, e);
      }}
      onKeyDown={handleKeyDown}
      tabIndex={isActive ? 0 : -1}
      data-cell-id={cellId}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => stopEdit(true)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            padding: 0,
            margin: 0
          }}
        />
      ) : (
        <span style={{ 
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {getDisplayValue()}
        </span>
      )}
    </div>
  );
};

export default EnhancedSpreadsheetCell;