
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Clipboard,
  Scissors,
  PaintBucket,
  Undo2,
  Redo2
} from "lucide-react";

interface ResponsiveControlsProps {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onAlignLeftClick: () => void;
  onAlignCenterClick: () => void;
  onAlignRightClick: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onUndo: () => void;
  onRedo: () => void;
  activeCellFormat: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    alignment?: string;
  };
}

const ResponsiveControls: React.FC<ResponsiveControlsProps> = ({
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onAlignLeftClick,
  onAlignCenterClick,
  onAlignRightClick,
  onCopy,
  onCut,
  onPaste,
  onUndo,
  onRedo,
  activeCellFormat
}) => {
  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Excel Controls</SheetTitle>
            <SheetDescription>
              Quick access to common spreadsheet functions
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <div className="grid grid-cols-4 gap-4">
              <Button 
                variant={activeCellFormat.bold ? "default" : "outline"} 
                size="icon" 
                onClick={onBoldClick}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                variant={activeCellFormat.italic ? "default" : "outline"}  
                size="icon" 
                onClick={onItalicClick}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                variant={activeCellFormat.underline ? "default" : "outline"}  
                size="icon" 
                onClick={onUnderlineClick}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onCopy}
              >
                <Clipboard className="h-4 w-4" />
              </Button>
              <Button 
                variant={activeCellFormat.alignment === 'left' ? "default" : "outline"} 
                size="icon" 
                onClick={onAlignLeftClick}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant={activeCellFormat.alignment === 'center' ? "default" : "outline"}  
                size="icon" 
                onClick={onAlignCenterClick}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button 
                variant={activeCellFormat.alignment === 'right' ? "default" : "outline"}  
                size="icon" 
                onClick={onAlignRightClick}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onCut}
              >
                <Scissors className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onUndo}
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onRedo}
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onPaste}
              >
                <PaintBucket className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ResponsiveControls;
