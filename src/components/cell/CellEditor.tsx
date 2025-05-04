
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

  return (
    <input
      ref={inputRef}
      type="text"
      className="absolute top-0 left-0 w-full h-full px-1 outline-none"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
};

export default CellEditor;
