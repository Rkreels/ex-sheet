
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
    }
  };

  return (
    <div onClick={isFormatPainterActive ? handleClick : undefined}>
      {children}
    </div>
  );
};

export default CellFormatPainter;
