import React from 'react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Palette } from 'lucide-react';

interface ExcelColorPickerProps {
  onColorSelect: (color: string) => void;
  label: string;
  currentColor?: string;
}

const EXCEL_COLORS = [
  // Theme Colors
  '#FFFFFF', '#000000', '#E7E6E6', '#44546A', '#5B9BD5', '#70AD47', '#A5A5A5', '#FFC000', '#4472C4', '#264478',
  
  // Standard Colors  
  '#C00000', '#FF0000', '#FFC000', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#002060', '#7030A0',
  
  // Light variants
  '#FFE6E6', '#FFE6CC', '#FFFFCC', '#E6FFE6', '#E6F7FF', '#E6E6FF', '#F2E6FF', '#FFE6F2', '#F2F2F2', '#D9D9D9',
  
  // Dark variants
  '#800000', '#993300', '#808000', '#008000', '#008080', '#000080', '#800080', '#666666', '#333333', '#000000'
];

const ExcelColorPicker: React.FC<ExcelColorPickerProps> = ({
  onColorSelect,
  label,
  currentColor
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-8 h-8 p-0">
          <div className="flex flex-col items-center">
            <Palette className="h-4 w-4" />
            {currentColor && (
              <div 
                className="w-4 h-1 mt-0.5" 
                style={{ backgroundColor: currentColor }}
              />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="mb-2 text-sm font-medium">{label}</div>
        <div className="grid grid-cols-10 gap-1">
          {EXCEL_COLORS.map((color, index) => (
            <button
              key={index}
              className={`w-6 h-6 border border-gray-300 hover:border-gray-500 transition-colors ${
                currentColor === color ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              title={color}
            />
          ))}
        </div>
        <div className="mt-2 pt-2 border-t">
          <button
            className="w-full text-left text-sm hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => onColorSelect('')}
          >
            No Color
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ExcelColorPicker;