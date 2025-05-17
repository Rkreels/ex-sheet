
import React, { useRef, useCallback, useState, useEffect } from 'react';

interface VirtualizationContainerProps {
  totalRows: number;
  visibleRowStart: number;
  visibleRowEnd: number;
  onScroll: () => void;
  children: React.ReactNode;
  topSpacerHeight: number;
  bottomSpacerHeight: number;
}

const VirtualizationContainer: React.FC<VirtualizationContainerProps> = ({
  totalRows,
  visibleRowStart,
  visibleRowEnd,
  onScroll,
  children,
  topSpacerHeight,
  bottomSpacerHeight
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', onScroll);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', onScroll);
      }
    };
  }, [onScroll]);

  return (
    <div 
      className="relative overflow-auto w-full h-full bg-white" 
      ref={containerRef}
    >
      {children}
      
      <div className="flex flex-col">
        {/* Top spacer div */}
        {topSpacerHeight > 0 && (
          <div style={{ height: `${topSpacerHeight}px` }} />
        )}
        
        {/* Content is rendered here via children */}
        
        {/* Bottom spacer div */}
        {bottomSpacerHeight > 0 && (
          <div style={{ height: `${bottomSpacerHeight}px` }} />
        )}
      </div>
    </div>
  );
};

export default VirtualizationContainer;
