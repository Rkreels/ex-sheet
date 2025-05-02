
import React, { useState, useEffect, useRef } from 'react';
import { Cell, CellSelection } from '../types/sheet';
import SpreadsheetHeader from './SpreadsheetHeader';
import SpreadsheetRow from './SpreadsheetRow';

interface SpreadsheetProps {
  cells: Record<string, Cell>;
  activeCell: string;
  onCellChange: (cellId: string, value: string) => void;
  onCellSelect: (cellId: string) => void;
  onCellSelectionChange?: (selection: {startCell: string, endCell: string} | null) => void;
  columnWidths: Record<string, number>;
  rowHeights: Record<string, number>;
  onColumnWidthChange: (columnId: string, width: number) => void;
  onRowHeightChange: (rowId: number, height: number) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ 
  cells, 
  activeCell, 
  onCellChange, 
  onCellSelect,
  onCellSelectionChange,
  columnWidths,
  rowHeights,
  onColumnWidthChange,
  onRowHeightChange
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [rows, setRows] = useState(100);
  const [columns, setColumns] = useState(26); // A to Z
  const [selection, setSelection] = useState<CellSelection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [draggedCell, setDraggedCell] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Notify parent of selection changes
  useEffect(() => {
    if (onCellSelectionChange && selection) {
      onCellSelectionChange(selection);
    }
  }, [selection, onCellSelectionChange]);

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
  };

  const handleDoubleClick = (rowIndex: number, colIndex: number) => {
    const cellId = getCellId(rowIndex, colIndex);
    onCellSelect(cellId);
    setEditing(true);
    setEditValue(cells[cellId]?.value || '');
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

  // Column selection handler
  const handleColumnHeaderClick = (colIndex: number, e: React.MouseEvent) => {
    const colLetter = getColumnLabel(colIndex);
    const startCell = `${colLetter}1`;
    const endCell = `${colLetter}${rows}`;
    
    if (e.shiftKey && selection) {
      // Extend existing selection
      setSelection({ ...selection, endCell });
    } else {
      // New selection
      setSelection({ startCell, endCell });
    }
  };

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editing) return; // Don't handle navigation when editing

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
          nextRowIndex = rowIndex + 1;
          break;
        case 'ArrowLeft':
          nextColIndex = Math.max(0, colIndex - 1);
          break;
        case 'ArrowRight':
          nextColIndex = colIndex + 1;
          break;
        case 'Tab':
          e.preventDefault();
          nextColIndex = e.shiftKey ? colIndex - 1 : colIndex + 1;
          break;
        case 'Enter':
          if (!editing) {
            e.preventDefault();
            nextRowIndex = rowIndex + 1;
          }
          break;
        case ' ':
          if (e.ctrlKey) {
            e.preventDefault();
            // Select entire column
            const startCell = `${col}1`;
            const endCell = `${col}${rows}`;
            setSelection({ startCell, endCell });
            return;
          }
          break;
        default:
          return;
      }

      // Handle shift selection
      if (e.shiftKey && !['Tab', 'Enter'].includes(e.key)) {
        e.preventDefault();
        const nextCellId = `${String.fromCharCode(65 + nextColIndex)}${nextRowIndex + 1}`;
        
        if (!selection) {
          setSelection({ startCell: activeCell, endCell: nextCellId });
        } else {
          setSelection({ ...selection, endCell: nextCellId });
        }
      } else {
        // Clear selection if not shift-selecting
        setSelection(null);
      }

      // Update active cell
      const nextCellId = `${String.fromCharCode(65 + nextColIndex)}${nextRowIndex + 1}`;
      onCellSelect(nextCellId);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeCell, editing, rows, selection, onCellSelect]);

  return (
    <div 
      className="relative overflow-auto w-full h-full bg-white" 
      ref={containerRef}
      onMouseUp={handleMouseUp}
    >
      <SpreadsheetHeader 
        columns={columns}
        columnWidths={columnWidths}
        onColumnWidthChange={onColumnWidthChange}
        onColumnHeaderClick={handleColumnHeaderClick}
      />
      
      <div className="flex">
        {/* Grid cells */}
        <div>
          {Array.from({ length: rows }, (_, rowIndex) => (
            <SpreadsheetRow
              key={`row-${rowIndex}`}
              rowIndex={rowIndex}
              columns={columns}
              cells={cells}
              activeCell={activeCell}
              selection={selection}
              columnWidths={columnWidths}
              rowHeight={rowHeights[rowIndex + 1] || 22}
              onCellClick={handleCellClick}
              onDoubleClick={handleDoubleClick}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseOver={handleCellMouseOver}
              onCellDrop={handleCellDrop}
              onCellDragStart={handleCellDragStart}
              onCellDragEnd={handleCellDragEnd}
              onCellValueChange={onCellChange}
              isCellInSelection={isCellInSelection}
              onRowHeightChange={onRowHeightChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Spreadsheet;
