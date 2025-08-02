import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { Cell } from '../types/sheet';
import { comprehensiveFormulas } from '../utils/comprehensiveFormulas';

interface OptimizedSpreadsheetCellProps {
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
  onCellValueChange: (value: string) => void;
  onCellBlur: () => void;
  onCellKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const OptimizedSpreadsheetCell = memo<OptimizedSpreadsheetCellProps>(({
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
  onCellValueChange,
  onCellBlur,
  onCellKeyDown
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const cellRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optimized formula evaluation with caching
  const evaluateFormulaCached = useCallback((formula: string, cellsData: Record<string, Cell>) => {
    try {
      const cleanFormula = formula.startsWith('=') ? formula.substring(1) : formula;
      
      // Check if it's a function call
      const functionMatch = cleanFormula.match(/^([A-Z]+)\s*\(/);
      if (functionMatch) {
        const functionName = functionMatch[1];
        const formulaFunction = comprehensiveFormulas[functionName];
        
        if (formulaFunction) {
          // Parse arguments
          const argsString = cleanFormula.substring(functionName.length + 1, cleanFormula.lastIndexOf(')'));
          const args = argsString.split(',').map(arg => {
            const trimmed = arg.trim();
            
            // Check if it's a cell reference
            if (/^[A-Z]+\d+$/.test(trimmed)) {
              return cellsData[trimmed]?.value || 0;
            }
            
            // Check if it's a number
            const num = parseFloat(trimmed);
            if (!isNaN(num)) return num;
            
            // Return as string (remove quotes if present)
            return trimmed.replace(/^["']|["']$/g, '');
          });
          
          return formulaFunction.execute(args);
        }
      }
      
      // Fallback to original evaluation
      return evaluateFormula(cleanFormula, cellsData);
    } catch (error) {
      console.error('Formula evaluation error:', error);
      return '#ERROR!';
    }
  }, []);

  // Calculate display value with optimization
  useEffect(() => {
    if (!cellData?.value) {
      setDisplayValue('');
      return;
    }

    if (cellData.value.startsWith('=')) {
      const result = evaluateFormulaCached(cellData.value, cells);
      
      // Format numbers based on cell format
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
        setDisplayValue(result.toString());
      }
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
            setDisplayValue(cellData.value);
        }
      } else {
        setDisplayValue(cellData.value);
      }
    }
  }, [cellData, cells, evaluateFormulaCached]);

  // Handle single click to select
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onCellClick(rowIndex, colIndex);
  }, [onCellClick, rowIndex, colIndex]);

  // Handle double click to edit (fast editing)
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onDoubleClick(rowIndex, colIndex);
    setEditing(true);
    setEditValue(cellData?.value || '');
    
    // Focus input after state update
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, [onDoubleClick, rowIndex, colIndex, cellData]);

  // Handle key press for quick editing
  useEffect(() => {
    if (isActive && !editing && cellRef.current) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Start editing on printable characters or F2
        if (e.key === 'F2' || 
            e.key === 'Delete' || 
            e.key === 'Backspace' ||
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
          
          setTimeout(() => {
            inputRef.current?.focus();
            if (e.key !== 'F2') {
              inputRef.current?.setSelectionRange(1, 1);
            } else {
              inputRef.current?.select();
            }
          }, 0);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isActive, editing, cellData, onCellValueChange]);

  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEditValue(value);
    onCellValueChange(value);
  }, [onCellValueChange]);

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    setEditing(false);
    onCellBlur();
  }, [onCellBlur]);

  // Handle key down in input
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      setEditing(false);
      onCellKeyDown(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setEditing(false);
      setEditValue(cellData?.value || '');
      onCellValueChange(cellData?.value || '');
    }
  }, [cellData, onCellKeyDown, onCellValueChange]);

  // Get optimized cell styles
  const getCellStyle = useCallback((): React.CSSProperties => {
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
      if (format.verticalAlignment) {
        style.alignItems = format.verticalAlignment === 'top' ? 'flex-start' :
                          format.verticalAlignment === 'bottom' ? 'flex-end' : 'center';
      }
    }

    return style;
  }, [cellData, width, height]);

  return (
    <div
      ref={cellRef}
      className={cn(
        "border-r border-b border-excel-gridBorder relative cursor-cell flex items-center px-1 transition-colors duration-75",
        isActive && "border-2 border-blue-500 z-10",
        isSelected && !isActive && "bg-blue-100",
        !isActive && !isSelected && "hover:bg-gray-50"
      )}
      style={getCellStyle()}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={(e) => onCellMouseDown(rowIndex, colIndex, e)}
      onMouseOver={() => onCellMouseOver(rowIndex, colIndex)}
      data-cell-id={cellId}
      tabIndex={isActive ? 0 : -1}
      aria-label={`Cell ${cellId}`}
    >
      {isActive && editing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          className="w-full h-full bg-transparent border-none outline-none px-0"
          style={{
            fontFamily: cellData?.format?.fontFamily || 'inherit',
            fontSize: cellData?.format?.fontSize || 'inherit',
            fontWeight: cellData?.format?.bold ? 'bold' : 'normal',
            fontStyle: cellData?.format?.italic ? 'italic' : 'normal',
          }}
          autoFocus
        />
      ) : (
        <span 
          className="w-full overflow-hidden text-ellipsis whitespace-nowrap"
          title={displayValue}
        >
          {displayValue}
        </span>
      )}
    </div>
  );
});

OptimizedSpreadsheetCell.displayName = 'OptimizedSpreadsheetCell';

export default OptimizedSpreadsheetCell;