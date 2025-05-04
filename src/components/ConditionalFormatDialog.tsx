
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConditionalFormat, CellRange } from '../types/sheet';

interface ConditionalFormatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (format: ConditionalFormat) => void;
  selectedRange?: CellRange;
}

const ConditionalFormatDialog: React.FC<ConditionalFormatDialogProps> = ({ 
  isOpen, 
  onClose,
  onApply,
  selectedRange
}) => {
  const [formatType, setFormatType] = useState<ConditionalFormat['type']>('greaterThan');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [bgColor, setBgColor] = useState<string>('#FFEB3B'); // Yellow default
  const [textColor, setTextColor] = useState<string>('#000000'); // Black default
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);

  const handleApply = () => {
    const format: ConditionalFormat = {
      type: formatType,
      value1: value1 ? (isNaN(Number(value1)) ? value1 : Number(value1)) : undefined,
      value2: value2 ? (isNaN(Number(value2)) ? value2 : Number(value2)) : undefined,
      format: {
        backgroundColor: bgColor,
        color: textColor,
        bold: isBold,
        italic: isItalic
      }
    };

    onApply(format);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conditional Formatting Rule</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="rule-type" className="col-span-1">Rule Type</Label>
            <Select
              value={formatType}
              onValueChange={(value) => setFormatType(value as ConditionalFormat['type'])}
              className="col-span-3"
            >
              <SelectTrigger id="rule-type">
                <SelectValue placeholder="Select rule type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="greaterThan">Greater Than</SelectItem>
                <SelectItem value="lessThan">Less Than</SelectItem>
                <SelectItem value="equalTo">Equal To</SelectItem>
                <SelectItem value="between">Between</SelectItem>
                <SelectItem value="containsText">Contains Text</SelectItem>
                <SelectItem value="top10">Top 10 Items</SelectItem>
                <SelectItem value="aboveAverage">Above Average</SelectItem>
                <SelectItem value="belowAverage">Below Average</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="value1" className="col-span-1">
              {formatType === 'between' ? 'Minimum' : 'Value'}
            </Label>
            <Input
              id="value1"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              className="col-span-3"
              placeholder={formatType === 'containsText' ? "Text to find" : "Enter a value"}
            />
          </div>

          {formatType === 'between' && (
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="value2" className="col-span-1">Maximum</Label>
              <Input
                id="value2"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                className="col-span-3"
                placeholder="Enter maximum value"
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="col-span-1">Format</Label>
            <div className="col-span-3 flex gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="bg-color">Background:</Label>
                <Input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-8 p-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="text-color">Text:</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-12 h-8 p-0"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-2">
            <Label className="col-span-1">Style</Label>
            <div className="col-span-3 flex gap-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="bold" 
                  checked={isBold} 
                  onChange={() => setIsBold(!isBold)} 
                />
                <Label htmlFor="bold" className="font-bold">Bold</Label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="italic" 
                  checked={isItalic} 
                  onChange={() => setIsItalic(!isItalic)} 
                />
                <Label htmlFor="italic" className="italic">Italic</Label>
              </div>
            </div>
          </div>

          {selectedRange && (
            <div className="grid grid-cols-4 items-center gap-2">
              <Label className="col-span-1">Applies to</Label>
              <div className="col-span-3">
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {selectedRange.startCell}:{selectedRange.endCell}
                </code>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConditionalFormatDialog;
