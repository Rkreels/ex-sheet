
import React from 'react';
import { AlignLeft, AlignCenter, AlignRight, Combine } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RibbonSection } from './RibbonSection';

interface AlignmentSectionProps {
  onAlignLeftClick: () => void;
  onAlignCenterClick: () => void;
  onAlignRightClick: () => void;
  onWrapText?: () => void;
  onMergeCenter?: () => void;
  activeCellFormat: {
    alignment?: string;
  };
}

export const AlignmentSection: React.FC<AlignmentSectionProps> = ({
  onAlignLeftClick,
  onAlignCenterClick,
  onAlignRightClick,
  onWrapText = () => {},
  onMergeCenter = () => {},
  activeCellFormat
}) => {
  return (
    <RibbonSection title="Alignment">
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAlignLeftClick} 
            className={`h-6 w-6 ${activeCellFormat.alignment === 'left' ? 'bg-gray-300' : ''}`}
            data-voice-hover="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAlignCenterClick} 
            className={`h-6 w-6 ${activeCellFormat.alignment === 'center' ? 'bg-gray-300' : ''}`}
            data-voice-hover="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onAlignRightClick} 
            className={`h-6 w-6 ${activeCellFormat.alignment === 'right' ? 'bg-gray-300' : ''}`}
            data-voice-hover="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onWrapText}
            className="h-6 w-6"
            data-voice-hover="Wrap text"
          >
            <div className="flex flex-col h-4 w-4 items-center justify-center text-[8px]">
              <span>Wrap</span>
            </div>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMergeCenter}
            className="h-6 w-6"
            data-voice-hover="Merge and center"
          >
            <Combine className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </RibbonSection>
  );
};

export default AlignmentSection;
