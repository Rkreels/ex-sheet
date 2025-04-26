
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Underline,
  Calculator,
  SortAsc,
  SortDesc,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExcelToolbarProps {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onAlignLeftClick: () => void;
  onAlignCenterClick: () => void;
  onAlignRightClick: () => void;
  activeCellFormat: {
    bold?: boolean;
    italic?: boolean;
    alignment?: string;
  };
}

const ExcelToolbar: React.FC<ExcelToolbarProps> = ({ 
  onBoldClick, 
  onItalicClick, 
  onAlignLeftClick, 
  onAlignCenterClick, 
  onAlignRightClick,
  activeCellFormat 
}) => {
  return (
    <div className="flex flex-wrap items-center p-1 gap-1 border-b border-excel-gridBorder">
      <div className="flex items-center gap-1 mr-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8", 
            activeCellFormat.bold && "bg-excel-activeBg"
          )}
          onClick={onBoldClick}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8", 
            activeCellFormat.italic && "bg-excel-activeBg"
          )}
          onClick={onItalicClick}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-8 border-r border-excel-gridBorder mx-1"></div>
      
      <div className="flex items-center gap-1 mr-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8", 
            activeCellFormat.alignment === 'left' && "bg-excel-activeBg"
          )}
          onClick={onAlignLeftClick}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8", 
            activeCellFormat.alignment === 'center' && "bg-excel-activeBg"
          )}
          onClick={onAlignCenterClick}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8", 
            activeCellFormat.alignment === 'right' && "bg-excel-activeBg"
          )}
          onClick={onAlignRightClick}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-8 border-r border-excel-gridBorder mx-1"></div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <SortAsc className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <SortDesc className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-8 border-r border-excel-gridBorder mx-1"></div>
      
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Percent className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Calculator className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ExcelToolbar;
