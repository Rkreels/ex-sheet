
import React from 'react';
import { cn } from '@/lib/utils';
import { Cell } from '@/types/sheet';

interface CellDisplayProps {
  cellData?: Cell;
  displayValue: string;
}

const CellDisplay: React.FC<CellDisplayProps> = ({ cellData, displayValue }) => {
  return (
    <div 
      className={cn(
        "w-full h-full px-1 overflow-hidden text-sm",
        cellData?.format?.bold && "font-bold",
        cellData?.format?.italic && "italic",
        cellData?.format?.underline && "underline",
        cellData?.format?.alignment === 'left' && "text-left",
        cellData?.format?.alignment === 'center' && "text-center",
        cellData?.format?.alignment === 'right' && "text-right",
        !cellData?.format?.alignment && "text-left"
      )}
      style={{
        color: cellData?.format?.color || 'inherit',
        backgroundColor: cellData?.format?.backgroundColor || 'transparent',
        fontFamily: cellData?.format?.fontFamily || 'inherit',
        fontSize: cellData?.format?.fontSize || 'inherit'
      }}
    >
      {displayValue}
    </div>
  );
};

export default CellDisplay;
