
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

  return (
    <div onMouseUp={handleMouseUp}>
      {children}
    </div>
  );
};

export default SelectionHandler;
