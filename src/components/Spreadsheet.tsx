
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cell, CellSelection } from '../types/sheet';
import SpreadsheetHeader from './SpreadsheetHeader';
import SpreadsheetRow from './SpreadsheetRow';
import SelectionHandler from './spreadsheet/SelectionHandler';
import { isCellInSelection, getColumnLabel, getCellId } from './spreadsheet/SelectionUtils';
import voiceAssistant from '../utils/voiceAssistant';

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
  // State hooks for spreadsheet functionality
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [rows, setRows] = useState(100);
  const [columns, setColumns] = useState(26); // A to Z
  const [selection, setSelection] = useState<CellSelection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [draggedCell, setDraggedCell] = useState<string | null>(null);
  const [visibleRows, setVisibleRows] = useState({ start: 0, end: 30 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Notify parent of selection changes
  useEffect(() => {
    if (onCellSelectionChange && selection) {
      onCellSelectionChange(selection);
    }
  }, [selection, onCellSelectionChange]);

  // Calculate visible rows for virtualization
  const calculateVisibleRows = useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const clientHeight = containerRef.current.clientHeight;
    
    // Assuming average row height of 22px
    const avgRowHeight = 22;
    const buffer = 10; // Extra rows to render above and below
    
    const startRow = Math.max(0, Math.floor(scrollTop / avgRowHeight) - buffer);
    const visibleRowCount = Math.ceil(clientHeight / avgRowHeight) + buffer * 2;
    const endRow = Math.min(rows, startRow + visibleRowCount);
    
    setVisibleRows({ start: startRow, end: endRow });
  }, [rows]);

  // Implement infinite scrolling and virtualization
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // Calculate visible rows for virtualization
    calculateVisibleRows();
    
    // If user has scrolled near the bottom, add more rows
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      setRows(prevRows => prevRows + 50);
      voiceAssistant.speak("Added more rows");
    }
    
    // Check horizontal scroll to add more columns if needed
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 200) {
      setColumns(prevCols => prevCols + 10);
      voiceAssistant.speak("Added more columns");
    }
  }, [calculateVisibleRows]);

  useEffect(() => {
    calculateVisibleRows();
  }, [calculateVisibleRows]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Cell interaction handlers
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellId = getCellId(rowIndex, colIndex);
    onCellSelect(cellId);
    
    if (cellId === activeCell) {
      setEditing(true);
      setEditValue(cells[cellId]?.value || '');
    } else {
      setEditing(false);
    }
    
    voiceAssistant.speak(`Selected cell ${cellId}`);
  };

  const handleCellMouseDown = (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    const cellId = getCellId(rowIndex, colIndex);
    setIsSelecting(true);
    setSelection({ startCell: cellId, endCell: cellId });
    onCellSelect(cellId);
    
    voiceAssistant.speak(`Started selection from ${cellId}`);
  };

  const handleCellMouseOver = (rowIndex: number, colIndex: number) => {
    if (isSelecting && selection) {
      const cellId = getCellId(rowIndex, colIndex);
      setSelection(prev => prev ? { ...prev, endCell: cellId } : null);
    }
  };

  const handleDoubleClick = (rowIndex: number, colIndex: number) => {
    const cellId = getCellId(rowIndex, colIndex);
    onCellSelect(cellId);
    setEditing(true);
    setEditValue(cells[cellId]?.value || '');
    
    voiceAssistant.speak(`Editing cell ${cellId}`);
  };

  // Drag and drop handlers
  const handleCellDragStart = (cellId: string) => {
    setDraggedCell(cellId);
    // Set visual drag effect
    document.body.style.cursor = 'move';
    
    voiceAssistant.speak(`Dragging cell ${cellId}`);
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
    
    voiceAssistant.speak(`Moved cell ${draggedCell} to ${targetCellId}`);
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
    
    voiceAssistant.speak(`Selected column ${colLetter}`);
  };

  // Row selection handler
  const handleRowHeaderClick = (rowIndex: number, e: React.MouseEvent) => {
    const startCell = `A${rowIndex + 1}`;
    const endCell = `${getColumnLabel(columns - 1)}${rowIndex + 1}`;
    
    if (e.shiftKey && selection) {
      // Extend existing selection
      setSelection({ ...selection, endCell });
    } else {
      // New selection
      setSelection({ startCell, endCell });
    }
    
    voiceAssistant.speak(`Selected row ${rowIndex + 1}`);
  };

  // Render only visible rows for better performance
  const visibleRowsList = [];
  for (let i = visibleRows.start; i < visibleRows.end && i < rows; i++) {
    visibleRowsList.push(
      <SpreadsheetRow
        key={`row-${i}`}
        rowIndex={i}
        columns={columns}
        cells={cells}
        activeCell={activeCell}
        selection={selection}
        columnWidths={columnWidths}
        rowHeight={rowHeights[i + 1] || 22}
        onCellClick={handleCellClick}
        onDoubleClick={handleDoubleClick}
        onCellMouseDown={handleCellMouseDown}
        onCellMouseOver={handleCellMouseOver}
        onCellDrop={handleCellDrop}
        onCellDragStart={handleCellDragStart}
        onCellDragEnd={handleCellDragEnd}
        onCellValueChange={onCellChange}
        isCellInSelection={(cellId) => isCellInSelection(cellId, selection)}
        onRowHeightChange={onRowHeightChange}
        onRowHeaderClick={handleRowHeaderClick}
      />
    );
  }

  // Top spacer for virtualization
  const topSpacerHeight = visibleRows.start * 22;
  
  // Bottom spacer for virtualization
  const bottomRowsCount = rows - visibleRows.end;
  const bottomSpacerHeight = bottomRowsCount > 0 ? bottomRowsCount * 22 : 0;

  return (
    <div 
      className="relative overflow-auto w-full h-full bg-white" 
      ref={containerRef}
      data-voice-area="spreadsheet"
    >
      <SelectionHandler 
        selection={selection} 
        setIsSelecting={setIsSelecting}
      >
        <SpreadsheetHeader 
          columns={columns}
          columnWidths={columnWidths}
          onColumnWidthChange={onColumnWidthChange}
          onColumnHeaderClick={handleColumnHeaderClick}
        />
        
        <div className="flex flex-col">
          {/* Top spacer div */}
          {topSpacerHeight > 0 && (
            <div style={{ height: `${topSpacerHeight}px` }} />
          )}
          
          {/* Visible rows */}
          {visibleRowsList}
          
          {/* Bottom spacer div */}
          {bottomSpacerHeight > 0 && (
            <div style={{ height: `${bottomSpacerHeight}px` }} />
          )}
        </div>
      </SelectionHandler>
    </div>
  );
};

export default Spreadsheet;
