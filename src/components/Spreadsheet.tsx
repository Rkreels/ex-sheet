
import React, { useState, useCallback, useEffect } from 'react';
import { Cell, CellSelection } from '../types/sheet';
import SpreadsheetHeader from './SpreadsheetHeader';
import SpreadsheetRow from './SpreadsheetRow';
import SelectionHandler from './spreadsheet/SelectionHandler';
import { isCellInSelection, getCellId } from './spreadsheet/SelectionUtils';

interface SpreadsheetProps {
  cells: Record<string, Cell>;
  activeCell: string;
  onCellChange: (cellId: string, value: string) => void;
  onCellSelect: (cellId: string) => void;
  onCellSelectionChange: (selection: CellSelection | null) => void;
  columnWidths: Record<string, number>;
  rowHeights: Record<number, number>;
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
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<CellSelection | null>(null);
  const [draggedCell, setDraggedCell] = useState<string | null>(null);

  const ROWS = 100;
  const COLUMNS = 26;

  const handleCellClick = useCallback((rowIndex: number, colIndex: number) => {
    // If in formula editing mode, clicks are handled in onMouseDown to insert references
    const formulaEditing = (window as any).__formulaEditing;
    const isEditingFormulaHere = formulaEditing && formulaEditing.activeCellId === activeCell;
    if (isEditingFormulaHere) return;

    const cellId = getCellId(rowIndex, colIndex);
    onCellSelect(cellId);
    setSelection(null);
    onCellSelectionChange(null);
  }, [onCellSelect, onCellSelectionChange, activeCell]);

  // Handle cell double click for editing
  const handleDoubleClick = useCallback((rowIndex: number, colIndex: number) => {
    const cellId = getCellId(rowIndex, colIndex);
    onCellSelect(cellId);
    // Trigger editing mode
    const cellElement = document.querySelector(`[data-cell-id="${cellId}"]`);
    if (cellElement) {
      (cellElement as HTMLElement).focus();
    }
  }, [onCellSelect]);

  // Handle cell mouse down for selection start
  const handleCellMouseDown = useCallback((rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click

    // Excel-like formula point-and-click: if editing a formula, insert reference instead of changing selection
    const formulaEditing = (window as any).__formulaEditing;
    const isEditingFormulaHere = formulaEditing && formulaEditing.activeCellId === activeCell;
    const currentVal = cells[activeCell]?.value || '';
    if (isEditingFormulaHere && typeof currentVal === 'string' && currentVal.startsWith('=')) {
      e.preventDefault();
      e.stopPropagation();
      const refId = getCellId(rowIndex, colIndex);
      onCellChange(activeCell, currentVal + refId);
      // Refocus editor input
      setTimeout(() => {
        const input = document.querySelector(`[data-cell-id="${activeCell}"] input`) as HTMLInputElement | null;
        input?.focus();
        if (input) {
          const len = input.value.length;
          input.setSelectionRange(len, len);
        }
      }, 0);
      return;
    }
    
    const cellId = getCellId(rowIndex, colIndex);
    setIsSelecting(true);
    setSelection({ startCell: cellId, endCell: cellId });
  }, [onCellSelect, activeCell, cells]);

  // Handle cell mouse over for selection extension
  const handleCellMouseOver = useCallback((rowIndex: number, colIndex: number) => {
    if (!isSelecting) return;
    
    const cellId = getCellId(rowIndex, colIndex);
    setSelection(prev => prev ? { ...prev, endCell: cellId } : null);
  }, [isSelecting]);

  // Handle cell value changes
  const handleCellValueChange = useCallback((cellId: string, value: string) => {
    onCellChange(cellId, value);
  }, [onCellChange]);

  // Handle drag and drop
  const handleCellDragStart = useCallback((cellId: string) => {
    setDraggedCell(cellId);
  }, []);

  const handleCellDrop = useCallback((targetCellId: string) => {
    if (draggedCell && draggedCell !== targetCellId) {
      const draggedValue = cells[draggedCell]?.value || '';
      onCellChange(targetCellId, draggedValue);
      onCellChange(draggedCell, '');
    }
    setDraggedCell(null);
  }, [draggedCell, cells, onCellChange]);

  const handleCellDragEnd = useCallback(() => {
    setDraggedCell(null);
  }, []);

  // Handle column header click for column selection
  const handleColumnHeaderClick = useCallback((colIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    const startCell = getCellId(0, colIndex);
    const endCell = getCellId(ROWS - 1, colIndex);
    const columnSelection = { startCell, endCell };
    setSelection(columnSelection);
    onCellSelectionChange(columnSelection);
  }, [ROWS, onCellSelectionChange]);

  // Handle row header click for row selection
  const handleRowHeaderClick = useCallback((rowIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    const startCell = getCellId(rowIndex, 0);
    const endCell = getCellId(rowIndex, COLUMNS - 1);
    const rowSelection = { startCell, endCell };
    setSelection(rowSelection);
    onCellSelectionChange(rowSelection);
  }, [COLUMNS, onCellSelectionChange]);

  // Update parent selection when local selection changes
  useEffect(() => {
    onCellSelectionChange(selection);
  }, [selection, onCellSelectionChange]);

  // Check if cell is in current selection
  const checkCellInSelection = useCallback((cellId: string) => {
    return isCellInSelection(cellId, selection);
  }, [selection]);

  return (
    <SelectionHandler 
      selection={selection} 
      setIsSelecting={setIsSelecting}
    >
      <div className="flex flex-col h-full overflow-auto">
        {/* Spreadsheet Header */}
        <SpreadsheetHeader
          columns={COLUMNS}
          columnWidths={columnWidths}
          onColumnWidthChange={onColumnWidthChange}
          onColumnHeaderClick={handleColumnHeaderClick}
        />

        {/* Spreadsheet Rows */}
        <div className="flex-grow">
          {Array.from({ length: ROWS }, (_, rowIndex) => (
            <SpreadsheetRow
              key={`row-${rowIndex}`}
              rowIndex={rowIndex}
              columns={COLUMNS}
              cells={cells}
              activeCell={activeCell}
              selection={selection}
              columnWidths={columnWidths}
              rowHeight={rowHeights[rowIndex + 1] || 25}
              onCellClick={handleCellClick}
              onDoubleClick={handleDoubleClick}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseOver={handleCellMouseOver}
              onCellDrop={handleCellDrop}
              onCellDragStart={handleCellDragStart}
              onCellDragEnd={handleCellDragEnd}
              onCellValueChange={handleCellValueChange}
              isCellInSelection={checkCellInSelection}
              onRowHeightChange={onRowHeightChange}
              onRowHeaderClick={handleRowHeaderClick}
            />
          ))}
        </div>
      </div>
    </SelectionHandler>
  );
};

export default Spreadsheet;
