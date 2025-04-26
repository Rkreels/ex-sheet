
import React, { useState, useRef, useEffect } from 'react';
import FormulaSuggestions from './FormulaSuggestions';
import { FormulaFunction, FormulaFunctionName } from '../types/sheet';

interface FormulaBarProps {
  value: string;
  cellId: string;
  onChange: (value: string) => void;
  formulaFunctions?: Record<FormulaFunctionName, FormulaFunction>;
}

const FormulaBar: React.FC<FormulaBarProps> = ({ 
  value, 
  cellId, 
  onChange,
  formulaFunctions = {} 
}) => {
  const [suggestions, setSuggestions] = useState<FormulaFunction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.startsWith('=')) {
      // Get text after the = symbol
      const formulaText = value.substring(1).toUpperCase();
      
      // Check if we're typing a function name
      if (/^[A-Z]*$/.test(formulaText)) {
        const matchedFunctions = Object.values(formulaFunctions)
          .filter(fn => fn.name.startsWith(formulaText))
          .sort((a, b) => a.name.localeCompare(b.name));
        
        setSuggestions(matchedFunctions);
        setShowSuggestions(matchedFunctions.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [value, formulaFunctions]);

  const handleSelectFormula = (formula: FormulaFunction) => {
    // Insert formula with empty parentheses
    onChange(`=${formula.name}()`);
    setShowSuggestions(false);
    
    // Set cursor position inside parentheses
    if (inputRef.current) {
      const position = formula.name.length + 2; // = + name + (
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(position, position);
      }, 0);
    }
  };

  return (
    <div className="h-full flex items-center px-1 bg-white border-b border-excel-gridBorder">
      <div className="flex-none w-10 flex items-center justify-center mr-2 text-gray-600 border-r border-excel-gridBorder h-full">
        <span>fx</span>
      </div>
      <div className="flex-none w-16 h-7 bg-gray-100 flex items-center justify-center border border-excel-gridBorder mr-2 text-gray-600 text-sm">
        <span>{cellId}</span>
      </div>
      <div className="flex-grow relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full h-7 px-2 focus:outline-none border border-excel-gridBorder"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowSuggestions(false);
            }
          }}
        />
        
        <FormulaSuggestions
          suggestions={suggestions}
          onSelectFormula={handleSelectFormula}
          visible={showSuggestions}
        />
      </div>
    </div>
  );
};

export default FormulaBar;
