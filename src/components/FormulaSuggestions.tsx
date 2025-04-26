
import React from 'react';
import { FormulaFunction } from '../types/sheet';

interface FormulaSuggestionsProps {
  suggestions: FormulaFunction[];
  onSelectFormula: (formula: FormulaFunction) => void;
  visible: boolean;
}

const FormulaSuggestions: React.FC<FormulaSuggestionsProps> = ({ 
  suggestions, 
  onSelectFormula, 
  visible 
}) => {
  if (!visible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-50 mt-1 w-96 bg-white shadow-lg rounded-md border border-excel-gridBorder max-h-64 overflow-y-auto">
      {suggestions.map((formula) => (
        <div
          key={formula.name}
          className="p-2 hover:bg-excel-hoverBg cursor-pointer border-b border-excel-gridBorder last:border-b-0"
          onClick={() => onSelectFormula(formula)}
        >
          <div className="font-medium">{formula.name}</div>
          <div className="text-sm text-gray-600">{formula.description}</div>
          <div className="text-xs text-gray-500 font-mono">{formula.usage}</div>
        </div>
      ))}
    </div>
  );
};

export default FormulaSuggestions;
