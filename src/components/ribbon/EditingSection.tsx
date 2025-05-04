
import React from 'react';
import { Search, ArrowDownAZ, ArrowUpAZ, Replace } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RibbonSection } from './RibbonSection';

interface EditingSectionProps {
  onAutoSum?: () => void;
  onFill?: (direction: 'down' | 'right') => void;
  onClearFormatting?: () => void;
  onFind?: () => void;
  onFindReplace?: () => void; // Add find-replace function
  onSortAsc?: () => void;
  onSortDesc?: () => void;
}

export const EditingSection: React.FC<EditingSectionProps> = ({
  onAutoSum = () => {},
  onFill = () => {},
  onClearFormatting = () => {},
  onFind = () => {},
  onFindReplace = () => {}, // Initialize with default function
  onSortAsc = () => {},
  onSortDesc = () => {}
}) => {
  return (
    <RibbonSection title="Editing" voiceCommand="editing section">
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 flex flex-col items-center" 
          data-voice-hover="Auto Sum"
          onClick={() => onAutoSum()}
        >
          <span className="font-bold">Σ</span>
          <span className="text-[10px]">AutoSum</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 flex flex-col items-center" 
          data-voice-hover="Fill Down"
          onClick={() => onFill('down')}
        >
          <div className="h-4 w-4 flex items-center justify-center">↓</div>
          <span className="text-[10px]">Fill</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 flex flex-col items-center" 
          data-voice-hover="Clear Formatting"
          onClick={onClearFormatting}
        >
          <div className="h-4 w-4 flex items-center justify-center">✕</div>
          <span className="text-[10px]">Clear</span>
        </Button>
        
        <div className="h-10 flex flex-col items-center">
          <div className="flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 flex items-center justify-center p-0"
              onClick={onSortAsc}
              data-voice-hover="Sort ascending"
            >
              <ArrowDownAZ className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 flex items-center justify-center p-0"
              onClick={onSortDesc}
              data-voice-hover="Sort descending"
            >
              <ArrowUpAZ className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-[10px]">Sort</span>
        </div>
        
        <div className="h-10 flex flex-col items-center">
          <div className="flex">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 flex items-center justify-center p-0"
              onClick={onFind}
              data-voice-hover="Find"
            >
              <Search className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-5 w-5 flex items-center justify-center p-0"
              onClick={onFindReplace}
              data-voice-hover="Find and Replace"
            >
              <Replace className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-[10px]">Find</span>
        </div>
      </div>
    </RibbonSection>
  );
};

export default EditingSection;
