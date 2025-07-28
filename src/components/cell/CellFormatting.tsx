import React from 'react';
import { Cell } from '../../types/sheet';

interface CellFormattingProps {
  cellData: Cell | undefined;
  displayValue: string;
  width: number;
  height: number;
}

const CellFormatting: React.FC<CellFormattingProps> = ({
  cellData,
  displayValue,
  width,
  height
}) => {
  // Apply cell formatting and display the value with proper Excel-like formatting
  const getCellStyle = () => {
    const format = cellData?.format;
    const style: React.CSSProperties = {
      width: `${width}px`,
      minWidth: `${width}px`,
      height: `${height}px`,
      minHeight: `${height}px`,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px',
    };

    if (format) {
      if (format.bold) style.fontWeight = 'bold';
      if (format.italic) style.fontStyle = 'italic';
      if (format.underline) style.textDecoration = 'underline';
      if (format.fontSize) style.fontSize = format.fontSize;
      if (format.fontFamily) style.fontFamily = format.fontFamily;
      if (format.color) style.color = format.color;
      if (format.backgroundColor) style.backgroundColor = format.backgroundColor;
      if (format.alignment) style.justifyContent = format.alignment === 'left' ? 'flex-start' : format.alignment === 'right' ? 'flex-end' : 'center';
      
      // Number formatting
      if (format.numberFormat) {
        style.textAlign = 'right'; // Numbers typically align right in Excel
      }
    }

    return style;
  };

  // Format the display value based on cell format
  const getFormattedValue = () => {
    if (!displayValue) return '';
    
    const format = cellData?.format;
    if (!format?.numberFormat) return displayValue;

    const numValue = parseFloat(displayValue);
    if (isNaN(numValue)) return displayValue;

    switch (format.numberFormat) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(numValue);
      
      case 'percentage':
        return new Intl.NumberFormat('en-US', {
          style: 'percent',
          minimumFractionDigits: 2
        }).format(numValue);
      
      case 'number':
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(numValue);
      
      case 'date':
        const dateValue = new Date(numValue);
        return isNaN(dateValue.getTime()) ? displayValue : dateValue.toLocaleDateString();
      
      default:
        return displayValue;
    }
  };

  return (
    <div style={getCellStyle()}>
      <span className="truncate w-full">
        {getFormattedValue()}
      </span>
    </div>
  );
};

export default CellFormatting;