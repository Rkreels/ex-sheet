
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { Cell, CellSelection } from '../types/sheet';
import CellContextMenu from './CellContextMenu';
import { toast } from "sonner";

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
  const [rows, setRows] = useState(100);
  const [columns, setColumns] = useState(26); // A to Z
  const [selection, setSelection] = useState<CellSelection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [draggedCell, setDraggedCell] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<{cells: Record<string, Cell>, startCell: string} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when editing begins
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  // Implement infinite scrolling
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // If user has scrolled near the bottom, add more rows
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      setRows(prevRows => prevRows + 50);
    }
    
    // Check horizontal scroll to add more columns if needed
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 200) {
      setColumns(prevCols => prevCols + 10);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const getColumnLabel = (index: number) => {
    // Handle column labels beyond Z (AA, AB, etc.)
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

  const handleCellMouseDown = (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    const cellId = getCellId(rowIndex, colIndex);
    setIsSelecting(true);
    setSelection({ startCell: cellId, endCell: cellId });
    onCellSelect(cellId);
  };

  const handleCellMouseOver = (rowIndex: number, colIndex: number) => {
    if (isSelecting && selection) {
      const cellId = getCellId(rowIndex, colIndex);
      setSelection(prev => prev ? { ...prev, endCell: cellId } : null);
    }
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    if (selection) {
      toast.info("Selected range: " + selection.startCell + " to " + selection.endCell);
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

  const handleCellDragStart = (cellId: string) => {
    setDraggedCell(cellId);
    // Set visual drag effect
    document.body.style.cursor = 'move';
  };

  const handleCellDragEnd = () => {
    setDraggedCell(null);
    document.body.style.cursor = 'default';
  };

  const handleCellDrop = (targetCellId: string) => {
    if (!draggedCell || draggedCell === targetCellId) return;
    
    // Swap cell contents
    const sourceCell = cells[draggedCell];
    const targetCell = cells[targetCellId];
    
    if (sourceCell) {
      onCellChange(targetCellId, sourceCell.value);
    }
    
    if (targetCell) {
      onCellChange(draggedCell, targetCell.value);
    } else {
      // If target was empty, clear source
      onCellChange(draggedCell, '');
    }
    
    toast.success(`Moved cell from ${draggedCell} to ${targetCellId}`);
  };

  const handleCopy = () => {
    if (selection) {
      // Extract the selected range
      const [startCol, startRowStr] = selection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const [endCol, endRowStr] = selection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      
      if (!startCol || !startRowStr || !endCol || !endRowStr) return;
      
      // Get the selection rectangle
      const startColIdx = startCol.charCodeAt(0) - 65;
      const startRowIdx = parseInt(startRowStr, 10) - 1;
      const endColIdx = endCol.charCodeAt(0) - 65;
      const endRowIdx = parseInt(endRowStr, 10) - 1;
      
      const minColIdx = Math.min(startColIdx, endColIdx);
      const maxColIdx = Math.max(startColIdx, endColIdx);
      const minRowIdx = Math.min(startRowIdx, endRowIdx);
      const maxRowIdx = Math.max(startRowIdx, endRowIdx);
      
      // Copy all cells in the selection
      const selectedCells: Record<string, Cell> = {};
      
      for (let row = minRowIdx; row <= maxRowIdx; row++) {
        for (let col = minColIdx; col <= maxColIdx; col++) {
          const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
          if (cells[cellId]) {
            selectedCells[cellId] = { ...cells[cellId] };
          }
        }
      }
      
      // Store in clipboard with position information
      setClipboard({
        cells: selectedCells,
        startCell: `${String.fromCharCode(65 + minColIdx)}${minRowIdx + 1}`
      });
      
      toast.success("Cells copied to clipboard");
    } else if (activeCell && cells[activeCell]) {
      // Copy single active cell
      const selectedCells: Record<string, Cell> = {
        [activeCell]: { ...cells[activeCell] }
      };
      setClipboard({
        cells: selectedCells,
        startCell: activeCell
      });
      
      toast.success("Cell copied to clipboard");
    }
  };

  const handleCut = () => {
    handleCopy();
    handleDelete();
  };

  const handlePaste = () => {
    if (!clipboard) {
      toast.error("Nothing to paste");
      return;
    }
    
    // Get target position
    const [targetCol, targetRowStr] = activeCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [startCol, startRowStr] = clipboard.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    
    if (!targetCol || !targetRowStr || !startCol || !startRowStr) return;
    
    const targetColIdx = targetCol.charCodeAt(0) - 65;
    const targetRowIdx = parseInt(targetRowStr, 10) - 1;
    const startColIdx = startCol.charCodeAt(0) - 65;
    const startRowIdx = parseInt(startRowStr, 10) - 1;
    
    // Calculate offset
    const colOffset = targetColIdx - startColIdx;
    const rowOffset = targetRowIdx - startRowIdx;
    
    // Paste all cells with the offset
    Object.entries(clipboard.cells).forEach(([cellId, cell]) => {
      const [col, rowStr] = cellId.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      
      if (!col || !rowStr) return;
      
      const colIdx = col.charCodeAt(0) - 65;
      const rowIdx = parseInt(rowStr, 10) - 1;
      
      const newColIdx = colIdx + colOffset;
      const newRowIdx = rowIdx + rowOffset;
      
      if (newColIdx >= 0 && newColIdx < columns && newRowIdx >= 0 && newRowIdx < rows) {
        const newCellId = `${String.fromCharCode(65 + newColIdx)}${newRowIdx + 1}`;
        onCellChange(newCellId, cell.value);
      }
    });
    
    toast.success("Pasted from clipboard");
  };

  const handleDelete = () => {
    if (selection) {
      // Delete all cells in the selection
      const [startCol, startRowStr] = selection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const [endCol, endRowStr] = selection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      
      if (!startCol || !startRowStr || !endCol || !endRowStr) return;
      
      // Get the selection rectangle
      const startColIdx = startCol.charCodeAt(0) - 65;
      const startRowIdx = parseInt(startRowStr, 10) - 1;
      const endColIdx = endCol.charCodeAt(0) - 65;
      const endRowIdx = parseInt(endRowStr, 10) - 1;
      
      const minColIdx = Math.min(startColIdx, endColIdx);
      const maxColIdx = Math.max(startColIdx, endColIdx);
      const minRowIdx = Math.min(startRowIdx, endRowIdx);
      const maxRowIdx = Math.max(startRowIdx, endRowIdx);
      
      // Delete all cells in the selection
      for (let row = minRowIdx; row <= maxRowIdx; row++) {
        for (let col = minColIdx; col <= maxColIdx; col++) {
          const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
          if (cells[cellId]) {
            onCellChange(cellId, '');
          }
        }
      }
      
      toast.success("Cells deleted");
    } else if (activeCell) {
      // Delete active cell
      onCellChange(activeCell, '');
      toast.success("Cell deleted");
    }
  };

  const handleMove = () => {
    if (draggedCell) {
      toast.info("Drop on target cell to move content");
    } else {
      setDraggedCell(activeCell);
      document.body.style.cursor = 'move';
      toast.info("Select destination cell to move");
    }
  };

  const isCellInSelection = (cellId: string) => {
    if (!selection) return false;
    
    const [startCol, startRowStr] = selection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [endCol, endRowStr] = selection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [cellCol, cellRowStr] = cellId.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    
    if (!startCol || !startRowStr || !endCol || !endRowStr || !cellCol || !cellRowStr) return false;
    
    const startColIdx = startCol.charCodeAt(0) - 65;
    const startRowIdx = parseInt(startRowStr, 10) - 1;
    const endColIdx = endCol.charCodeAt(0) - 65;
    const endRowIdx = parseInt(endRowStr, 10) - 1;
    const cellColIdx = cellCol.charCodeAt(0) - 65;
    const cellRowIdx = parseInt(cellRowStr, 10) - 1;
    
    const minColIdx = Math.min(startColIdx, endColIdx);
    const maxColIdx = Math.max(startColIdx, endColIdx);
    const minRowIdx = Math.min(startRowIdx, endRowIdx);
    const maxRowIdx = Math.max(startRowIdx, endRowIdx);
    
    return cellColIdx >= minColIdx && cellColIdx <= maxColIdx && cellRowIdx >= minRowIdx && cellRowIdx <= maxRowIdx;
  };

  const renderCell = (rowIndex: number, colIndex: number) => {
    const cellId = getCellId(rowIndex, colIndex);
    const cellData = cells[cellId];
    const isActive = cellId === activeCell;
    const isSelected = isCellInSelection(cellId);
    
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

    const cellContent = (
      <div
        className={cn(
          "border-r border-b border-excel-gridBorder relative",
          isActive && "border border-excel-blue z-10",
          isSelected && !isActive && "bg-excel-blue/20",
          !isActive && !isSelected && "hover:bg-excel-hoverBg"
        )}
        style={{ 
          width: `${width}px`, 
          minWidth: `${width}px`,
          height: `${height}px`,
          minHeight: `${height}px`,
        }}
        onClick={() => handleCellClick(rowIndex, colIndex)}
        onDoubleClick={() => handleDoubleClick(rowIndex, colIndex)}
        onMouseDown={(e) => handleCellMouseDown(rowIndex, colIndex, e)}
        onMouseOver={() => handleCellMouseOver(rowIndex, colIndex)}
        onDrop={() => handleCellDrop(cellId)}
        onDragOver={(e) => e.preventDefault()}
        draggable={!editing}
        onDragStart={() => handleCellDragStart(cellId)} 
        onDragEnd={handleCellDragEnd}
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

    return (
      <CellContextMenu
        key={`${rowIndex}-${colIndex}`}
        onCopy={handleCopy}
        onCut={handleCut}
        onPaste={handlePaste}
        onDelete={handleDelete}
        onMove={handleMove}
      >
        {cellContent}
      </CellContextMenu>
    );
  };

  return (
    <div 
      className="relative overflow-auto w-full h-full" 
      ref={containerRef}
      onMouseUp={handleMouseUp}
    >
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
