
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { Cell } from '../types/sheet';

interface SpreadsheetProps {
  cells: Record<string, Cell>;
  activeCell: string;
  onCellChange: (cellId: string, value: string) => void;
  onCellSelect: (cellId: string) => void;
  columnWidths: Record<string, number>;
  rowHeights: Record<string, number>;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ 
  cells, 
  activeCell, 
  onCellChange, 
  onCellSelect,
  columnWidths,
  rowHeights
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [rows, setRows] = useState(50);
  const [columns, setColumns] = useState(26); // A to Z
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Focus input when editing begins
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const getColumnLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, ...
  };

  const getCellId = (rowIndex: number, colIndex: number) => {
    return `${getColumnLabel(colIndex)}${rowIndex + 1}`;
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellId = getCellId(rowIndex, colIndex);
    onCellSelect(cellId);
    
    if (cellId === activeCell) {
      setEditing(true);
      setEditValue(cells[cellId]?.value || '');
    } else {
      setEditing(false);
    }
  };

  const handleDoubleClick = (rowIndex: number, colIndex: number) => {
    const cellId = getCellId(rowIndex, colIndex);
    onCellSelect(cellId);
    setEditing(true);
    setEditValue(cells[cellId]?.value || '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleInputBlur = () => {
    setEditing(false);
    onCellChange(activeCell, editValue);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditing(false);
      onCellChange(activeCell, editValue);
      
      // Move to the cell below
      const [col, rowStr] = activeCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      if (col && rowStr) {
        const nextRow = parseInt(rowStr, 10) + 1;
        if (nextRow <= rows) {
          onCellSelect(`${col}${nextRow}`);
        }
      }
    } else if (e.key === 'Escape') {
      setEditing(false);
      setEditValue(cells[activeCell]?.value || '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setEditing(false);
      onCellChange(activeCell, editValue);
      
      // Move to the next cell (right)
      const [col, rowStr] = activeCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      if (col && rowStr) {
        const colIndex = col.charCodeAt(0) - 65;
        const nextColIndex = e.shiftKey ? colIndex - 1 : colIndex + 1;
        
        if (nextColIndex >= 0 && nextColIndex < columns) {
          const nextCol = String.fromCharCode(65 + nextColIndex);
          onCellSelect(`${nextCol}${rowStr}`);
        }
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
               e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Handle arrow key navigation when editing
      if (editing) return;
      
      e.preventDefault();
      const [col, rowStr] = activeCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      if (!col || !rowStr) return;
      
      const colIndex = col.charCodeAt(0) - 65;
      const rowIndex = parseInt(rowStr, 10) - 1;
      
      let nextColIndex = colIndex;
      let nextRowIndex = rowIndex;
      
      switch (e.key) {
        case 'ArrowUp':
          nextRowIndex = Math.max(0, rowIndex - 1);
          break;
        case 'ArrowDown':
          nextRowIndex = Math.min(rows - 1, rowIndex + 1);
          break;
        case 'ArrowLeft':
          nextColIndex = Math.max(0, colIndex - 1);
          break;
        case 'ArrowRight':
          nextColIndex = Math.min(columns - 1, colIndex + 1);
          break;
      }
      
      const nextCellId = `${String.fromCharCode(65 + nextColIndex)}${nextRowIndex + 1}`;
      onCellSelect(nextCellId);
    }
  };

  const renderCell = (rowIndex: number, colIndex: number) => {
    const cellId = getCellId(rowIndex, colIndex);
    const cellData = cells[cellId];
    const isActive = cellId === activeCell;
    
    // Calculate display value (for formulas)
    let displayValue = '';
    if (cellData?.value) {
      if (cellData.value.startsWith('=')) {
        try {
          displayValue = evaluateFormula(cellData.value.substring(1), cells);
        } catch (error) {
          displayValue = '#ERROR';
          console.error('Formula evaluation error:', error);
        }
      } else {
        displayValue = cellData.value;
      }
    }

    // Get column width
    const width = columnWidths[getColumnLabel(colIndex)] || 100;
    
    // Get row height
    const height = rowHeights[rowIndex + 1] || 24;

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={cn(
          "border-r border-b border-excel-gridBorder relative",
          isActive && "border border-excel-blue z-10",
          !isActive && "hover:bg-excel-hoverBg"
        )}
        style={{ 
          width: `${width}px`, 
          minWidth: `${width}px`,
          height: `${height}px`,
          minHeight: `${height}px`,
        }}
        onClick={() => handleCellClick(rowIndex, colIndex)}
        onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)}
      >
        {isActive && editing ? (
          <input
            ref={inputRef}
            type="text"
            className="absolute top-0 left-0 w-full h-full px-1 outline-none"
            value={editValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
          />
        ) : (
          <div 
            className={cn(
              "w-full h-full px-1 overflow-hidden",
              cellData?.format?.bold && "font-bold",
              cellData?.format?.italic && "italic",
              cellData?.format?.underline && "underline",
              cellData?.format?.alignment === 'left' && "text-left",
              cellData?.format?.alignment === 'center' && "text-center",
              cellData?.format?.alignment === 'right' && "text-right",
              !cellData?.format?.alignment && "text-left"
            )}
          >
            {displayValue}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative overflow-auto w-full h-full" ref={gridRef}>
      {/* Header row with column labels */}
      <div className="sticky top-0 z-20 flex">
        <div 
          className="bg-excel-headerBg border-r border-b border-excel-gridBorder flex-none"
          style={{ width: '50px', height: '24px' }}
        ></div>
        <div className="flex">
          {Array.from({ length: columns }, (_, i) => (
            <div 
              key={`header-${i}`} 
              className="bg-excel-headerBg border-r border-b border-excel-gridBorder flex items-center justify-center text-gray-700 font-medium text-sm flex-none"
              style={{ 
                width: `${columnWidths[getColumnLabel(i)] || 100}px`, 
                minWidth: `${columnWidths[getColumnLabel(i)] || 100}px`,
                height: '24px'
              }}
            >
              {getColumnLabel(i)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Main grid content */}
      <div className="flex">
        {/* Row headers column */}
        <div className="flex-none">
          {Array.from({ length: rows }, (_, i) => (
            <div 
              key={`row-${i}`} 
              className="bg-excel-headerBg border-r border-b border-excel-gridBorder flex items-center justify-center text-gray-700 font-medium text-sm"
              style={{ 
                width: '50px', 
                height: `${rowHeights[i + 1] || 24}px`,
                minHeight: `${rowHeights[i + 1] || 24}px`
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* Grid cells */}
        <div>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex">
              {Array.from({ length: columns }, (_, colIndex) => 
                renderCell(rowIndex, colIndex)
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
