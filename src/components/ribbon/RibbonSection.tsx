
import React from 'react';

interface RibbonSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  voiceCommand?: string;
}

export const RibbonSection: React.FC<RibbonSectionProps> = ({ 
  title, 
  children, 
  className, 
  voiceCommand 
}) => {
  return (
    <div 
      className={`ribbon-section border-r border-gray-300 p-1 ${className || ''}`}
      data-voice-section={title.toLowerCase()}
      data-voice-command={voiceCommand || title.toLowerCase()}
    >
      <div className="text-xs text-center font-semibold mb-1">{title}</div>
      <div className="flex flex-wrap gap-1">
        {children}
      </div>
    </div>
  );
};

export default RibbonSection;
