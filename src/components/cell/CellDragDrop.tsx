
import React, { useState } from 'react';

interface CellDragDropProps {
  cellId: string;
  children: React.ReactNode;
  onCellDrop: (cellId: string) => void;
  onCellDragStart: (cellId: string) => void;
  onCellDragEnd: () => void;
}

const CellDragDrop: React.FC<CellDragDropProps> = ({
  cellId,
  children,
  onCellDrop,
  onCellDragStart,
  onCellDragEnd
}) => {
  const [dragOver, setDragOver] = useState(false);

  // Handle drag over for visual feedback
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  // Handle drag leave
  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Handle drop
  const handleDrop = () => {
    setDragOver(false);
    onCellDrop(cellId);
  };

  return (
    <div
      className={dragOver ? "bg-green-50 border-green-500" : ""}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={true}
      onDragStart={() => onCellDragStart(cellId)}
      onDragEnd={onCellDragEnd}
      data-cell-id={cellId}
    >
      {React.cloneElement(children as React.ReactElement, { 
        isDragOver: dragOver 
      })}
    </div>
  );
};

export default CellDragDrop;
