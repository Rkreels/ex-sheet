
import React from 'react';
import { Undo, Redo, Printer } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RibbonSection } from './RibbonSection';

interface HistorySectionProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onPrint?: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  onUndo = () => {},
  onRedo = () => {},
  onPrint = () => {}
}) => {
  return (
    <RibbonSection title="History" className="border-r-0">
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 flex flex-col items-center" 
          onClick={onUndo}
          data-voice-hover="Undo"
        >
          <Undo className="h-4 w-4" />
          <span className="text-[10px]">Undo</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 flex flex-col items-center"
          onClick={onRedo}
          data-voice-hover="Redo"
        >
          <Redo className="h-4 w-4" />
          <span className="text-[10px]">Redo</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10 flex flex-col items-center"
          onClick={onPrint}
          data-voice-hover="Print"
        >
          <Printer className="h-4 w-4" />
          <span className="text-[10px]">Print</span>
        </Button>
      </div>
    </RibbonSection>
  );
};

export default HistorySection;
