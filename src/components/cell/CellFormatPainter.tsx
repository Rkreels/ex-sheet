
import React from 'react';

interface CellFormatPainterProps {
  children: React.ReactNode;
  handleFormatPainted: () => void;
}

const CellFormatPainter: React.FC<CellFormatPainterProps> = ({
  children,
  handleFormatPainted
}) => {
  // Check if format painter is active
  const isFormatPainterActive = document.body.style.cursor === 'cell';

  // Handle click when format painter is active
  const handleClick = () => {
    if (isFormatPainterActive) {
      handleFormatPainted();
      // Reset cursor after applying format
      document.body.style.cursor = 'default';
    }
  };

  return (
    <div 
      onClick={isFormatPainterActive ? handleClick : undefined}
      className={isFormatPainterActive ? 'cursor-cell' : undefined}
      data-format-painter-target={isFormatPainterActive ? 'true' : undefined}
    >
      {children}
    </div>
  );
};

export default CellFormatPainter;
