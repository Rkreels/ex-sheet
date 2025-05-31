
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cell } from '../../types/sheet';

interface EnhancedCellEditorProps {
  cellId: string;
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  position: { x: number; y: number };
  formulaFunctions?: any[];
}

const EnhancedCellEditor: React.FC<EnhancedCellEditorProps> = ({
  cellId,
  initialValue,
  onSave,
  onCancel,
  position,
  formulaFunctions = []
}) => {
  const [value, setValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  // Auto-complete for formulas
  useEffect(() => {
    if (value.startsWith('=')) {
      const partial = value.slice(1).toUpperCase();
      const matches = formulaFunctions
        .filter(fn => fn.name.startsWith(partial))
        .map(fn => fn.name)
        .slice(0, 5);
      setSuggestions(matches);
      setSelectedSuggestion(0);
    } else {
      setSuggestions([]);
    }
  }, [value, formulaFunctions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (suggestions.length > 0 && selectedSuggestion >= 0) {
          setValue(`=${suggestions[selectedSuggestion]}(`);
          setSuggestions([]);
        } else {
          onSave(value);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onCancel();
        break;
      case 'Tab':
        e.preventDefault();
        if (suggestions.length > 0) {
          setValue(`=${suggestions[selectedSuggestion]}(`);
          setSuggestions([]);
        } else {
          onSave(value);
        }
        break;
      case 'ArrowDown':
        if (suggestions.length > 0) {
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        if (suggestions.length > 0) {
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
        }
        break;
    }
  }, [value, suggestions, selectedSuggestion, onSave, onCancel]);

  return (
    <div 
      className="absolute z-50 bg-white border border-blue-500 shadow-lg"
      style={{ 
        left: position.x, 
        top: position.y,
        minWidth: '150px'
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => onSave(value)}
        className="w-full px-2 py-1 border-0 outline-0 font-mono text-sm"
        placeholder="Enter value or formula..."
      />
      
      {suggestions.length > 0 && (
        <div className="border-t bg-gray-50 max-h-32 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-2 py-1 text-sm cursor-pointer ${
                index === selectedSuggestion ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                setValue(`=${suggestion}(`);
                setSuggestions([]);
                inputRef.current?.focus();
              }}
            >
              <span className="font-mono font-bold text-blue-600">{suggestion}</span>
              <span className="text-gray-500 ml-1">
                {formulaFunctions.find(fn => fn.name === suggestion)?.description || ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedCellEditor;
