
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
    <div className="flex items-center h-9 bg-excel-toolbarBg">
      <div className="flex">
        {sheets.map((sheet) => (
          <div 
            key={sheet.id}
            className={cn(
              "px-4 h-9 flex items-center border-r border-excel-gridBorder cursor-pointer min-w-[100px] max-w-[200px]",
              sheet.id === activeSheetId 
                ? "bg-white border-t-2 border-t-excel-tabSelected" 
                : "hover:bg-excel-tabHover"
            )}
            onClick={() => onSheetSelect(sheet.id)}
          >
            <span className="truncate">{sheet.name}</span>
          </div>
        ))}
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 rounded-none"
        onClick={onAddSheet}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SheetTabs;
