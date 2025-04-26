
import React from 'react';

interface FormulaBarProps {
  value: string;
  cellId: string;
  onChange: (value: string) => void;
}

const FormulaBar: React.FC<FormulaBarProps> = ({ value, cellId, onChange }) => {
  return (
    <div className="h-full flex items-center px-1 bg-white border-b border-excel-gridBorder">
      <div className="flex-none w-10 flex items-center justify-center mr-2 text-gray-600 border-r border-excel-gridBorder h-full">
        <span>fx</span>
      </div>
      <div className="flex-none w-16 h-7 bg-gray-100 flex items-center justify-center border border-excel-gridBorder mr-2 text-gray-600 text-sm">
        <span>{cellId}</span>
      </div>
      <div className="flex-grow">
        <input
          type="text"
          className="w-full h-7 px-2 focus:outline-none border border-excel-gridBorder"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FormulaBar;
