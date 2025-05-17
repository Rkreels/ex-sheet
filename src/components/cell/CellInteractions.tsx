
import React, { useState, useEffect } from 'react';

interface CellInteractionsProps {
  isActive: boolean;
  rowIndex: number;
  colIndex: number;
  children: React.ReactNode;
  startEditing: () => void;
  onCellClick: (rowIndex: number, colIndex: number) => void;
  onDoubleClick: (rowIndex: number, colIndex: number) => void;
  onCellMouseDown: (rowIndex: number, colIndex: number, e: React.MouseEvent) => void;
  onCellMouseOver: (rowIndex: number, colIndex: number) => void;
}

const CellInteractions: React.FC<CellInteractionsProps> = ({
  isActive,
  rowIndex,
  colIndex,
  children,
  startEditing,
  onCellClick,
  onDoubleClick,
  onCellMouseDown,
  onCellMouseOver
}) => {
  const [lastClickTime, setLastClickTime] = useState(0);

  // Handle click with improved timing detection for edit mode
  const handleCellClick = (e: React.MouseEvent) => {
    onCellClick(rowIndex, colIndex);
    
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - lastClickTime;
    
    // If this is a second click within 300ms, treat as double click
    if (timeDiff < 300 && isActive) {
      startEditing();
    } else if (isActive) {
      // If cell is already active and we're clicking on it again, start editing
      startEditing();
    }
    
    setLastClickTime(currentTime);
  };

  return React.cloneElement(children as React.ReactElement, {
    onClick: handleCellClick,
    onDoubleClick: () => onDoubleClick(rowIndex, colIndex),
    onMouseDown: (e: React.MouseEvent) => onCellMouseDown(rowIndex, colIndex, e),
    onMouseOver: () => onCellMouseOver(rowIndex, colIndex)
  });
};

export default CellInteractions;
