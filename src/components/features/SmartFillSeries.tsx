import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Sheet, CellSelection } from '../../types/sheet';

interface SmartFillSeriesProps {
  isOpen: boolean;
  onClose: () => void;
  activeSheet: Sheet;
  cellSelection: CellSelection | null;
  onFillSeries: (options: FillSeriesOptions) => void;
}

interface FillSeriesOptions {
  type: 'linear' | 'growth' | 'date' | 'autofill';
  direction: 'down' | 'right' | 'up' | 'left';
  stepValue: number;
  stopValue?: number;
  dateUnit?: 'day' | 'week' | 'month' | 'year';
  weekdays?: boolean;
  trend?: boolean;
}

const SmartFillSeries: React.FC<SmartFillSeriesProps> = ({
  isOpen,
  onClose,
  activeSheet,
  cellSelection,
  onFillSeries
}) => {
  const [fillType, setFillType] = useState<'linear' | 'growth' | 'date' | 'autofill'>('linear');
  const [direction, setDirection] = useState<'down' | 'right' | 'up' | 'left'>('down');
  const [stepValue, setStepValue] = useState<number>(1);
  const [stopValue, setStopValue] = useState<string>('');
  const [dateUnit, setDateUnit] = useState<'day' | 'week' | 'month' | 'year'>('day');
  const [weekdays, setWeekdays] = useState<boolean>(false);
  const [trend, setTrend] = useState<boolean>(false);

  const handleFill = () => {
    const options: FillSeriesOptions = {
      type: fillType,
      direction,
      stepValue,
      stopValue: stopValue ? parseFloat(stopValue) : undefined,
      dateUnit: fillType === 'date' ? dateUnit : undefined,
      weekdays: fillType === 'date' ? weekdays : undefined,
      trend
    };

    onFillSeries(options);
    onClose();
  };

  const getPreview = (): string[] => {
    if (!cellSelection) return [];

    const { startCell } = cellSelection;
    const sourceCell = activeSheet.cells[startCell];
    if (!sourceCell) return [];

    const sourceValue = sourceCell.calculatedValue !== undefined 
      ? sourceCell.calculatedValue 
      : sourceCell.value;

    const preview: string[] = [sourceValue?.toString() || ''];

    // Generate preview based on fill type
    for (let i = 1; i <= 5; i++) {
      let nextValue: string;

      switch (fillType) {
        case 'linear':
          if (typeof sourceValue === 'number') {
            nextValue = (sourceValue + (stepValue * i)).toString();
          } else {
            nextValue = `${sourceValue}${i}`;
          }
          break;

        case 'growth':
          if (typeof sourceValue === 'number') {
            nextValue = (sourceValue * Math.pow(stepValue, i)).toString();
          } else {
            nextValue = sourceValue?.toString() || '';
          }
          break;

        case 'date':
          if (Date.parse(sourceValue?.toString() || '')) {
            const date = new Date(sourceValue?.toString() || '');
            const newDate = new Date(date);
            
            switch (dateUnit) {
              case 'day':
                newDate.setDate(date.getDate() + (stepValue * i));
                break;
              case 'week':
                newDate.setDate(date.getDate() + (stepValue * i * 7));
                break;
              case 'month':
                newDate.setMonth(date.getMonth() + (stepValue * i));
                break;
              case 'year':
                newDate.setFullYear(date.getFullYear() + (stepValue * i));
                break;
            }
            
            nextValue = newDate.toLocaleDateString();
          } else {
            nextValue = sourceValue?.toString() || '';
          }
          break;

        case 'autofill':
          // Smart pattern detection
          const sourceStr = sourceValue?.toString() || '';
          if (/\d+$/.test(sourceStr)) {
            const match = sourceStr.match(/^(.*?)(\d+)$/);
            if (match) {
              const prefix = match[1];
              const num = parseInt(match[2]);
              nextValue = `${prefix}${num + i}`;
            } else {
              nextValue = sourceStr;
            }
          } else {
            nextValue = sourceStr;
          }
          break;

        default:
          nextValue = sourceValue?.toString() || '';
      }

      preview.push(nextValue);
    }

    return preview;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Fill Series</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Series Type */}
          <div>
            <Label className="text-sm font-medium">Series Type</Label>
            <RadioGroup 
              value={fillType} 
              onValueChange={(value) => setFillType(value as any)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="linear" id="linear" />
                <Label htmlFor="linear">Linear</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="growth" id="growth" />
                <Label htmlFor="growth">Growth</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="date" id="date" />
                <Label htmlFor="date">Date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="autofill" id="autofill" />
                <Label htmlFor="autofill">AutoFill</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Direction */}
          <div>
            <Label className="text-sm font-medium">Direction</Label>
            <Select value={direction} onValueChange={(value) => setDirection(value as any)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="down">Down</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="up">Up</SelectItem>
                <SelectItem value="left">Left</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Step Value */}
          {(fillType === 'linear' || fillType === 'growth' || fillType === 'date') && (
            <div>
              <Label className="text-sm font-medium">
                {fillType === 'growth' ? 'Growth Factor' : 'Step Value'}
              </Label>
              <Input
                type="number"
                value={stepValue}
                onChange={(e) => setStepValue(parseFloat(e.target.value) || 1)}
                className="mt-2"
                step={fillType === 'growth' ? 0.1 : 1}
              />
            </div>
          )}

          {/* Date Unit */}
          {fillType === 'date' && (
            <div>
              <Label className="text-sm font-medium">Date Unit</Label>
              <Select value={dateUnit} onValueChange={(value) => setDateUnit(value as any)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Stop Value */}
          <div>
            <Label className="text-sm font-medium">Stop Value (Optional)</Label>
            <Input
              type="number"
              value={stopValue}
              onChange={(e) => setStopValue(e.target.value)}
              className="mt-2"
              placeholder="Leave empty for auto-fill range"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            {fillType === 'date' && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="weekdays" 
                  checked={weekdays}
                  onCheckedChange={(checked) => setWeekdays(checked === true)}
                />
                <Label htmlFor="weekdays">Weekdays only</Label>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="trend" 
                checked={trend}
                onCheckedChange={(checked) => setTrend(checked === true)}
              />
              <Label htmlFor="trend">Extend trend</Label>
            </div>
          </div>

          {/* Preview */}
          <div>
            <Label className="text-sm font-medium">Preview</Label>
            <div className="mt-2 p-2 bg-gray-50 rounded border text-xs">
              {getPreview().slice(0, 5).map((value, index) => (
                <div key={index} className={index === 0 ? 'font-medium' : ''}>
                  {value}
                </div>
              ))}
              {getPreview().length > 5 && <div>...</div>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleFill}>
              Fill Series
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartFillSeries;