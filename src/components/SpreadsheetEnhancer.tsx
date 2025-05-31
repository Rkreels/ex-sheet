
import React, { useState, useCallback } from 'react';
import { Cell } from '../types/sheet';
import EnhancedCellEditor from './cell/EnhancedCellEditor';
import { useAdvancedKeyboardNavigation } from '../hooks/useAdvancedKeyboardNavigation';

interface SpreadsheetEnhancerProps {
  children: React.ReactNode;
  cells: Record<string, Cell>;
  activeCell: string;
  onCellChange: (cellId: string, value: string) => void;
  onCellSelect: (cellId: string) => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onFind: () => void;
  formulaFunctions?: any[];
}

const SpreadsheetEnhancer: React.FC<SpreadsheetEnhancerProps> = ({
  children,
  cells,
  activeCell,
  onCellChange,
  onCellSelect,
  onCopy,
  onCut,
  onPaste,
  onUndo,
  onRedo,
  onDelete,
  onFind,
  formulaFunctions = []
}) => {
  const [editingCell, setEditingCell] = useState<{
    cellId: string;
    position: { x: number; y: number };
  } | null>(null);

  // Enhanced keyboard navigation
  useAdvancedKeyboardNavigation({
    activeCell,
    onCellSelect,
    onCopy,
    onCut,
    onPaste,
    onUndo,
    onRedo,
    onDelete,
    onFind
  });

  const handleCellDoubleClick = useCallback((cellId: string, event: MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setEditingCell({
      cellId,
      position: { x: rect.left, y: rect.top }
    });
  }, []);

  const handleEditorSave = useCallback((value: string) => {
    if (editingCell) {
      onCellChange(editingCell.cellId, value);
      setEditingCell(null);
    }
  }, [editingCell, onCellChange]);

  const handleEditorCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  // Add double-click listeners to cells
  React.useEffect(() => {
    const handleDoubleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const cellId = target.getAttribute('data-cell-id');
      if (cellId) {
        handleCellDoubleClick(cellId, e as MouseEvent);
      }
    };

    document.addEventListener('dblclick', handleDoubleClick);
    return () => document.removeEventListener('dblclick', handleDoubleClick);
  }, [handleCellDoubleClick]);

  return (
    <div className="relative w-full h-full">
      {children}
      
      {editingCell && (
        <EnhancedCellEditor
          cellId={editingCell.cellId}
          initialValue={cells[editingCell.cellId]?.value || ''}
          onSave={handleEditorSave}
          onCancel={handleEditorCancel}
          position={editingCell.position}
          formulaFunctions={formulaFunctions}
        />
      )}
    </div>
  );
};

export default SpreadsheetEnhancer;
