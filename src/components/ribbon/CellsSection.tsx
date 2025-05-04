
import React from 'react';
import { SquarePlus, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RibbonSection } from './RibbonSection';

interface CellsSectionProps {
  onDelete: () => void;
  onInsert?: (type: 'cell' | 'row' | 'column') => void;
  onBackgroundColorChange: (color: string) => void;
  activeCellFormat: {
    backgroundColor?: string;
  };
}

export const CellsSection: React.FC<CellsSectionProps> = ({
  onDelete,
  onInsert = () => {},
  onBackgroundColorChange,
  activeCellFormat
}) => {
  return (
    <RibbonSection title="Cells">
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10" 
          data-voice-hover="Insert cell"
          onClick={() => onInsert && onInsert('cell')}
        >
          <div className="flex flex-col items-center">
            <SquarePlus className="h-4 w-4 text-green-500" />
            <span className="text-[10px]">Insert</span>
          </div>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10" 
          data-voice-hover="Delete cell"
          onClick={onDelete}
        >
          <div className="flex flex-col items-center">
            <Trash className="h-4 w-4 text-red-500" />
            <span className="text-[10px]">Delete</span>
          </div>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-10 w-10" 
          data-voice-hover="Format cells"
          onClick={() => {
            const color = prompt('Enter background color for cell:', activeCellFormat.backgroundColor || '#FFFFFF');
            if (color) onBackgroundColorChange(color);
          }}
        >
          <div className="flex flex-col items-center">
            <div className="bg-blue-500 h-4 w-4 rounded"></div>
            <span className="text-[10px]">Format</span>
          </div>
        </Button>
      </div>
    </RibbonSection>
  );
};

export default CellsSection;
