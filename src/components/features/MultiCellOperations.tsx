import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Calculator, TrendingUp, BarChart3, Percent } from 'lucide-react';
import { Sheet, CellSelection } from '../../types/sheet';

interface MultiCellOperationsProps {
  activeSheet: Sheet;
  cellSelection: CellSelection | null;
  onApplyOperation: (operation: string, value?: string) => void;
}

const MultiCellOperations: React.FC<MultiCellOperationsProps> = ({
  activeSheet,
  cellSelection,
  onApplyOperation
}) => {
  const [operationValue, setOperationValue] = useState<string>('');
  const [selectedOperation, setSelectedOperation] = useState<string>('');

  const getCellCount = () => {
    if (!cellSelection) return 0;
    
    const { startCell, endCell } = cellSelection;
    const startMatch = startCell.match(/([A-Z]+)([0-9]+)/);
    const endMatch = endCell.match(/([A-Z]+)([0-9]+)/);
    
    if (!startMatch || !endMatch) return 0;
    
    const startCol = startMatch[1].charCodeAt(0) - 65;
    const startRow = parseInt(startMatch[2]);
    const endCol = endMatch[1].charCodeAt(0) - 65;
    const endRow = parseInt(endMatch[2]);
    
    return (Math.abs(endRow - startRow) + 1) * (Math.abs(endCol - startCol) + 1);
  };

  const operations = [
    {
      id: 'add',
      name: 'Add',
      description: 'Add value to all selected cells',
      icon: Calculator,
      requiresValue: true
    },
    {
      id: 'subtract',
      name: 'Subtract',
      description: 'Subtract value from all selected cells',
      icon: Calculator,
      requiresValue: true
    },
    {
      id: 'multiply',
      name: 'Multiply',
      description: 'Multiply all selected cells by value',
      icon: Calculator,
      requiresValue: true
    },
    {
      id: 'divide',
      name: 'Divide',
      description: 'Divide all selected cells by value',
      icon: Calculator,
      requiresValue: true
    },
    {
      id: 'power',
      name: 'Power',
      description: 'Raise all selected cells to power',
      icon: TrendingUp,
      requiresValue: true
    },
    {
      id: 'percentage',
      name: 'Convert to %',
      description: 'Convert all values to percentages',
      icon: Percent,
      requiresValue: false
    },
    {
      id: 'round',
      name: 'Round',
      description: 'Round to specified decimal places',
      icon: Calculator,
      requiresValue: true
    },
    {
      id: 'absolute',
      name: 'Absolute',
      description: 'Convert to absolute values',
      icon: BarChart3,
      requiresValue: false
    },
    {
      id: 'uppercase',
      name: 'UPPERCASE',
      description: 'Convert text to uppercase',
      icon: Calculator,
      requiresValue: false
    },
    {
      id: 'lowercase',
      name: 'lowercase',
      description: 'Convert text to lowercase',
      icon: Calculator,
      requiresValue: false
    },
    {
      id: 'trim',
      name: 'Trim',
      description: 'Remove leading/trailing spaces',
      icon: Calculator,
      requiresValue: false
    },
    {
      id: 'prefix',
      name: 'Add Prefix',
      description: 'Add prefix to all text values',
      icon: Calculator,
      requiresValue: true
    },
    {
      id: 'suffix',
      name: 'Add Suffix',
      description: 'Add suffix to all text values',
      icon: Calculator,
      requiresValue: true
    }
  ];

  const handleApplyOperation = () => {
    if (!selectedOperation) return;
    
    const operation = operations.find(op => op.id === selectedOperation);
    if (operation?.requiresValue && !operationValue) return;
    
    onApplyOperation(selectedOperation, operationValue);
    setOperationValue('');
  };

  const getQuickStatistics = () => {
    if (!cellSelection) return null;

    const { startCell, endCell } = cellSelection;
    const startMatch = startCell.match(/([A-Z]+)([0-9]+)/);
    const endMatch = endCell.match(/([A-Z]+)([0-9]+)/);
    
    if (!startMatch || !endMatch) return null;

    const startCol = startMatch[1].charCodeAt(0) - 65;
    const startRow = parseInt(startMatch[2]);
    const endCol = endMatch[1].charCodeAt(0) - 65;
    const endRow = parseInt(endMatch[2]);

    const values: number[] = [];
    let textCount = 0;
    let emptyCount = 0;
    
    for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
      for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
        const cellId = `${String.fromCharCode(65 + col)}${row}`;
        const cell = activeSheet.cells[cellId];
        
        if (!cell || !cell.value) {
          emptyCount++;
        } else {
          const value = cell.calculatedValue !== undefined ? cell.calculatedValue : cell.value;
          
          if (typeof value === 'number' && !isNaN(value)) {
            values.push(value);
          } else if (typeof value === 'string') {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              values.push(numValue);
            } else {
              textCount++;
            }
          }
        }
      }
    }

    if (values.length === 0) return { textCount, emptyCount, numCount: 0 };

    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      numCount: values.length,
      textCount,
      emptyCount,
      sum: sum.toFixed(2),
      avg: avg.toFixed(2),
      min: min.toFixed(2),
      max: max.toFixed(2)
    };
  };

  const stats = getQuickStatistics();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Multi-Cell Operations
            <Badge variant="outline">{getCellCount()} cells</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!cellSelection ? (
            <p className="text-sm text-muted-foreground">
              Select multiple cells to perform operations
            </p>
          ) : (
            <>
              {/* Quick Statistics */}
              {stats && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-xs font-medium mb-2">Quick Stats</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Numbers: {stats.numCount}</div>
                    <div>Text: {stats.textCount}</div>
                    <div>Empty: {stats.emptyCount}</div>
                    <div>Sum: {stats.sum}</div>
                    <div>Avg: {stats.avg}</div>
                    <div>Min: {stats.min}</div>
                    <div>Max: {stats.max}</div>
                  </div>
                </div>
              )}

              {/* Operation Selection */}
              <div>
                <Label className="text-sm font-medium">Operation</Label>
                <Select value={selectedOperation} onValueChange={setSelectedOperation}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose operation..." />
                  </SelectTrigger>
                  <SelectContent>
                    {operations.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        <div className="flex items-center space-x-2">
                          <op.icon className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{op.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {op.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Value Input */}
              {selectedOperation && operations.find(op => op.id === selectedOperation)?.requiresValue && (
                <div>
                  <Label className="text-sm font-medium">Value</Label>
                  <Input
                    type={['add', 'subtract', 'multiply', 'divide', 'power', 'round'].includes(selectedOperation) ? 'number' : 'text'}
                    value={operationValue}
                    onChange={(e) => setOperationValue(e.target.value)}
                    placeholder="Enter value..."
                    className="mt-2"
                  />
                </div>
              )}

              {/* Apply Button */}
              <Button 
                onClick={handleApplyOperation}
                disabled={!selectedOperation || (operations.find(op => op.id === selectedOperation)?.requiresValue && !operationValue)}
                className="w-full"
              >
                Apply Operation
              </Button>

              {/* Quick Operation Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onApplyOperation('percentage')}
                >
                  To %
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onApplyOperation('absolute')}
                >
                  ABS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onApplyOperation('uppercase')}
                >
                  ABC
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onApplyOperation('trim')}
                >
                  Trim
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiCellOperations;