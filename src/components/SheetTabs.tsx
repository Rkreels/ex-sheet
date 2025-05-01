
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet } from '../types/sheet';

interface SheetTabsProps {
  sheets: Sheet[];
  activeSheetId: string;
  onSheetSelect: (sheetId: string) => void;
  onAddSheet: () => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({ 
  sheets, 
  activeSheetId, 
  onSheetSelect, 
  onAddSheet 
}) => {
  return (
    <div className="flex items-center h-7 bg-gray-200 border-t border-gray-300">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 rounded-none"
        data-voice-hover="Previous sheet"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 rounded-none"
        data-voice-hover="Next sheet"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <div className="flex border-l border-gray-300">
        {sheets.map((sheet) => (
          <div 
            key={sheet.id}
            className={cn(
              "h-7 flex items-center border-r border-gray-300 cursor-pointer px-3 min-w-[80px] max-w-[120px] text-xs",
              sheet.id === activeSheetId 
                ? "bg-white" 
                : "bg-gray-100 hover:bg-gray-50"
            )}
            onClick={() => onSheetSelect(sheet.id)}
            data-voice-hover={`Switch to ${sheet.name}`}
          >
            <span className="truncate">{sheet.name}</span>
          </div>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 rounded-none"
        onClick={onAddSheet}
        data-voice-hover="Add new sheet"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SheetTabs;
