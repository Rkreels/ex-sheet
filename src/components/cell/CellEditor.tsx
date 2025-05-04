
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
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Support keyboard shortcuts
    if (e.key === 'Enter' && !e.shiftKey) {
      onKeyDown(e);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      onKeyDown(e);
    } else if (e.key === 'Escape') {
      onKeyDown(e);
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
