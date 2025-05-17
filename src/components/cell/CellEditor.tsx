
import React, { useRef, useEffect } from 'react';

interface CellEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const CellEditor: React.FC<CellEditorProps> = ({ value, onChange, onBlur, onKeyDown }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      
      // Position cursor at the end of the text
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Support keyboard shortcuts
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onKeyDown(e);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      onKeyDown(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onKeyDown(e);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || 
               e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Don't stop propagation for navigation keys when at boundaries
      const input = inputRef.current;
      if (input) {
        const atStart = input.selectionStart === 0;
        const atEnd = input.selectionEnd === input.value.length;
        
        // Only prevent default if not at boundaries or with shift/ctrl modifiers
        if ((e.key === 'ArrowLeft' && !atStart) || 
            (e.key === 'ArrowRight' && !atEnd) ||
            e.shiftKey || e.ctrlKey) {
          e.stopPropagation();
        } else {
          onKeyDown(e);
        }
      } else {
        onKeyDown(e);
      }
    } else {
      onKeyDown(e);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      className="absolute top-0 left-0 w-full h-full px-1 outline-none"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      aria-label="Cell editor"
      data-voice-control="true"
      data-editing="true"
    />
  );
};

export default CellEditor;
