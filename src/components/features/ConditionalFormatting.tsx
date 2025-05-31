
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Cell } from '../../types/sheet';

interface ConditionalFormattingProps {
  cells: Record<string, Cell>;
  selectedRange: string;
  onUpdateCells: (updates: Record<string, Partial<Cell>>) => void;
}

export interface ConditionalRule {
  id: string;
  type: 'cellValue' | 'formula' | 'colorScale' | 'dataBar' | 'iconSet';
  operator?: 'greater' | 'less' | 'between' | 'equal' | 'contains' | 'notEqual';
  value1?: any;
  value2?: any;
  formula?: string;
  format: {
    backgroundColor?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  priority: number;
}

const ConditionalFormatting: React.FC<ConditionalFormattingProps> = ({
  cells,
  selectedRange,
  onUpdateCells
}) => {
  const [ruleType, setRuleType] = useState<string>('cellValue');
  const [operator, setOperator] = useState<string>('greater');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffeb3b');
  const [textColor, setTextColor] = useState<string>('#000000');
  const [bold, setBold] = useState<boolean>(false);
  const [italic, setItalic] = useState<boolean>(false);

  const parseRange = (range: string): string[] => {
    if (range.includes(':')) {
      const [start, end] = range.split(':');
      const startMatch = start.match(/([A-Z]+)([0-9]+)/);
      const endMatch = end.match(/([A-Z]+)([0-9]+)/);
      
      if (!startMatch || !endMatch) return [range];
      
      const startCol = startMatch[1].charCodeAt(0) - 65;
      const startRow = parseInt(startMatch[2]);
      const endCol = endMatch[1].charCodeAt(0) - 65;
      const endRow = parseInt(endMatch[2]);
      
      const cellIds: string[] = [];
      for (let col = startCol; col <= endCol; col++) {
        for (let row = startRow; row <= endRow; row++) {
          cellIds.push(`${String.fromCharCode(col + 65)}${row}`);
        }
      }
      return cellIds;
    }
    return [range];
  };

  const evaluateCondition = (cellValue: string, rule: Partial<ConditionalRule>): boolean => {
    const numValue = parseFloat(cellValue);
    const val1 = parseFloat(rule.value1 || '0');
    const val2 = parseFloat(rule.value2 || '0');

    switch (rule.operator) {
      case 'greater':
        return !isNaN(numValue) && numValue > val1;
      case 'less':
        return !isNaN(numValue) && numValue < val1;
      case 'between':
        return !isNaN(numValue) && numValue >= val1 && numValue <= val2;
      case 'equal':
        return cellValue === rule.value1;
      case 'notEqual':
        return cellValue !== rule.value1;
      case 'contains':
        return cellValue.toLowerCase().includes(rule.value1?.toLowerCase() || '');
      default:
        return false;
    }
  };

  const applyConditionalFormatting = () => {
    const rule: ConditionalRule = {
      id: `rule_${Date.now()}`,
      type: ruleType as any,
      operator: operator as any,
      value1,
      value2: operator === 'between' ? value2 : undefined,
      format: {
        backgroundColor,
        color: textColor,
        bold,
        italic
      },
      priority: 1
    };

    const cellIds = parseRange(selectedRange);
    const updates: Record<string, Partial<Cell>> = {};

    cellIds.forEach(cellId => {
      const cell = cells[cellId];
      const cellValue = cell?.value || '';
      
      if (evaluateCondition(cellValue, rule)) {
        updates[cellId] = {
          conditionalFormat: {
            ...cell?.conditionalFormat,
            [rule.id]: rule
          },
          format: {
            ...cell?.format,
            ...rule.format
          }
        };
      }
    });

    onUpdateCells(updates);
  };

  const clearConditionalFormatting = () => {
    const cellIds = parseRange(selectedRange);
    const updates: Record<string, Partial<Cell>> = {};

    cellIds.forEach(cellId => {
      const cell = cells[cellId];
      if (cell?.conditionalFormat) {
        updates[cellId] = {
          conditionalFormat: undefined,
          format: {
            ...cell.format,
            backgroundColor: undefined,
            color: undefined
          }
        };
      }
    });

    onUpdateCells(updates);
  };

  const presetRules = [
    {
      name: 'Highlight Greater Than',
      type: 'cellValue',
      operator: 'greater',
      backgroundColor: '#4caf50',
      textColor: '#ffffff'
    },
    {
      name: 'Highlight Less Than',
      type: 'cellValue',
      operator: 'less',
      backgroundColor: '#f44336',
      textColor: '#ffffff'
    },
    {
      name: 'Highlight Equal To',
      type: 'cellValue',
      operator: 'equal',
      backgroundColor: '#2196f3',
      textColor: '#ffffff'
    },
    {
      name: 'Highlight Contains',
      type: 'cellValue',
      operator: 'contains',
      backgroundColor: '#ff9800',
      textColor: '#ffffff'
    }
  ];

  const applyPresetRule = (preset: any) => {
    setRuleType(preset.type);
    setOperator(preset.operator);
    setBackgroundColor(preset.backgroundColor);
    setTextColor(preset.textColor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conditional Formatting - {selectedRange}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {presetRules.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyPresetRule(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Rule Type</label>
          <Select value={ruleType} onValueChange={setRuleType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cellValue">Cell Value</SelectItem>
              <SelectItem value="formula">Formula</SelectItem>
              <SelectItem value="colorScale">Color Scale</SelectItem>
              <SelectItem value="dataBar">Data Bar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {ruleType === 'cellValue' && (
          <>
            <div>
              <label className="text-sm font-medium">Condition</label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater">Greater than</SelectItem>
                  <SelectItem value="less">Less than</SelectItem>
                  <SelectItem value="between">Between</SelectItem>
                  <SelectItem value="equal">Equal to</SelectItem>
                  <SelectItem value="notEqual">Not equal to</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">
                  {operator === 'between' ? 'Minimum' : 'Value'}
                </label>
                <Input
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
              {operator === 'between' && (
                <div>
                  <label className="text-sm font-medium">Maximum</label>
                  <Input
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    placeholder="Enter value"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div>
          <label className="text-sm font-medium">Format</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="text-xs">Background Color</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full h-8 border rounded"
              />
            </div>
            <div>
              <label className="text-xs">Text Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-8 border rounded"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={bold}
                onChange={(e) => setBold(e.target.checked)}
                className="mr-1"
              />
              Bold
            </label>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={italic}
                onChange={(e) => setItalic(e.target.checked)}
                className="mr-1"
              />
              Italic
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={applyConditionalFormatting}>Apply Rule</Button>
          <Button variant="outline" onClick={clearConditionalFormatting}>Clear Rules</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConditionalFormatting;
