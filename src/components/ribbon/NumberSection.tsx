
import React from 'react';
import { DollarSign, PercentIcon } from 'lucide-react';
import { RibbonSection } from './RibbonSection';
import { NumberFormat } from '@/types/sheet';

interface NumberSectionProps {
  onNumberFormatChange: (format: NumberFormat) => void;
  onPercentClick: () => void;
  onCurrencyFormat: () => void;
  activeCellFormat: {
    numberFormat?: NumberFormat;
  };
}

export const NumberSection: React.FC<NumberSectionProps> = ({
  onNumberFormatChange,
  onPercentClick,
  onCurrencyFormat,
  activeCellFormat
}) => {
  return (
    <RibbonSection title="Number">
      <div className="flex flex-col gap-1">
        <select 
          className="text-xs p-1 border border-gray-300 rounded w-24"
          value={activeCellFormat.numberFormat || 'general'}
          onChange={(e) => onNumberFormatChange(e.target.value as NumberFormat)}
        >
          <option value="general">General</option>
          <option value="number">Number</option>
          <option value="currency">Currency</option>
          <option value="percentage">Percentage</option>
          <option value="date">Date</option>
          <option value="time">Time</option>
          <option value="fraction">Fraction</option>
          <option value="scientific">Scientific</option>
          <option value="text">Text</option>
        </select>

        <div className="flex gap-1">
          <button 
            className="text-xs border border-gray-300 rounded px-2 py-1 flex items-center"
            onClick={onCurrencyFormat}
          >
            <DollarSign className="h-3 w-3 mr-1" />
            <span>Currency</span>
          </button>
          
          <button 
            className="text-xs border border-gray-300 rounded px-2 py-1 flex items-center"
            onClick={onPercentClick}
          >
            <PercentIcon className="h-3 w-3 mr-1" />
            <span>Percent</span>
          </button>
        </div>
      </div>
    </RibbonSection>
  );
};

export default NumberSection;
