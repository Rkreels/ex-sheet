
import React from 'react';
import { Copy, Scissors, ClipboardPaste, Clipboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RibbonSection } from './RibbonSection';

interface ClipboardSectionProps {
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onFormatPainter: () => void;
}

export const ClipboardSection: React.FC<ClipboardSectionProps> = ({
  onCopy,
  onCut,
  onPaste,
  onFormatPainter
}) => {
  return (
    <RibbonSection title="Clipboard">
      <div className="flex gap-1">
        <div className="flex flex-col items-center">
          <Button variant="ghost" size="sm" onClick={onPaste} className="h-10 w-12" data-voice-hover="Paste">
            <ClipboardPaste className="h-5 w-5" />
          </Button>
          <span className="text-xs">Paste</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <Button variant="ghost" size="sm" onClick={onCut} className="h-6 w-12 justify-start px-2" data-voice-hover="Cut">
            <Scissors className="h-4 w-4 mr-1" />
            <span className="text-xs">Cut</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onCopy} className="h-6 w-12 justify-start px-2" data-voice-hover="Copy">
            <Copy className="h-4 w-4 mr-1" />
            <span className="text-xs">Copy</span>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onFormatPainter} className="h-6 w-12 justify-start px-2" data-voice-hover="Format Painter">
            <Clipboard className="h-4 w-4 mr-1" />
            <span className="text-xs">Format</span>
          </Button>
        </div>
      </div>
    </RibbonSection>
  );
};

export default ClipboardSection;
