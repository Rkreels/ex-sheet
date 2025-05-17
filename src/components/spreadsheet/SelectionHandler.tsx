
import React from 'react';
import { CellSelection } from '../../types/sheet';

interface SelectionHandlerProps {
  selection: CellSelection | null;
  setIsSelecting: (isSelecting: boolean) => void;
  children: React.ReactNode;
}

const SelectionHandler: React.FC<SelectionHandlerProps> = ({
  selection,
  setIsSelecting,
  children
}) => {
  const handleMouseUp = () => {
    setIsSelecting(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard navigation and selection
    if (e.key === 'Escape') {
      setIsSelecting(false);
    }
  };

  return (
    <div 
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0} // Make div focusable for keyboard events
      className="outline-none h-full" // Remove outline and ensure full height
    >
      {children}
    </div>
  );
};

export default SelectionHandler;
