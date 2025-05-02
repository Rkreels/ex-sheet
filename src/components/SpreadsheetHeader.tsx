
import React from 'react';

interface SpreadsheetHeaderProps {
  columns: number;
  columnWidths: Record<string, number>;
  onColumnWidthChange: (columnId: string, width: number) => void;
  onColumnHeaderClick: (colIndex: number, e: React.MouseEvent) => void;
}

const SpreadsheetHeader: React.FC<SpreadsheetHeaderProps> = ({ 
  columns, 
  columnWidths, 
  onColumnWidthChange,
  onColumnHeaderClick
}) => {
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

  const handleColumnResize = (colIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const colId = getColumnLabel(colIndex);
    
    // Starting X position
    const startX = e.clientX;
    // Current width
    const currentWidth = columnWidths[colId] || 100;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(50, currentWidth + delta);
      onColumnWidthChange(colId, newWidth);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="sticky top-0 z-20 flex">
      <div 
        className="bg-excel-headerBg border-r border-b border-excel-gridBorder flex-none"
        style={{ width: '40px', height: '22px' }}
      ></div>
      <div className="flex">
        {Array.from({ length: columns }, (_, i) => (
          <div 
            key={`header-${i}`} 
            className="bg-excel-headerBg border-r border-b border-excel-gridBorder flex items-center justify-center text-gray-700 font-medium text-xs flex-none cursor-pointer relative hover:bg-excel-hoverBg"
            style={{ 
              width: `${columnWidths[getColumnLabel(i)] || 100}px`, 
              minWidth: `${columnWidths[getColumnLabel(i)] || 100}px`,
              height: '22px'
            }}
            onClick={(e) => onColumnHeaderClick(i, e)}
          >
            {getColumnLabel(i)}
            
            {/* Resize handle */}
            <div 
              className="absolute right-0 top-0 w-2 h-full cursor-col-resize hover:bg-blue-400"
              onMouseDown={(e) => handleColumnResize(i, e)}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpreadsheetHeader;
