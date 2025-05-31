
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Cell } from '../../types/sheet';

interface DataValidationProps {
  cells: Record<string, Cell>;
  activeCell: string;
  onUpdateCell: (cellId: string, updates: Partial<Cell>) => void;
}

export interface ValidationRule {
  type: 'number' | 'date' | 'time' | 'list' | 'custom';
  operator?: 'between' | 'notBetween' | 'equal' | 'notEqual' | 'greater' | 'less' | 'greaterEqual' | 'lessEqual';
  value1?: any;
  value2?: any;
  listValues?: string[];
  formula?: string;
  inputMessage?: string;
  errorMessage?: string;
  showInputMessage?: boolean;
  showErrorAlert?: boolean;
}

const DataValidation: React.FC<DataValidationProps> = ({
  cells,
  activeCell,
  onUpdateCell
}) => {
  const [validationType, setValidationType] = useState<string>('number');
  const [operator, setOperator] = useState<string>('between');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [listValues, setListValues] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showInputMessage, setShowInputMessage] = useState<boolean>(true);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(true);

  const currentCell = cells[activeCell];
  const currentValidation = currentCell?.validation;

  const applyValidation = () => {
    const validation: ValidationRule = {
      type: validationType as any,
      operator: operator as any,
      value1: parseValue(value1),
      value2: parseValue(value2),
      listValues: validationType === 'list' ? listValues.split(',').map(v => v.trim()) : undefined,
      inputMessage: inputMessage || undefined,
      errorMessage: errorMessage || undefined,
      showInputMessage,
      showErrorAlert
    };

    onUpdateCell(activeCell, { validation });
  };

  const removeValidation = () => {
    onUpdateCell(activeCell, { validation: undefined });
  };

  const parseValue = (value: string): any => {
    if (!value) return undefined;
    
    // Try to parse as number
    const num = parseFloat(value);
    if (!isNaN(num)) return num;
    
    // Try to parse as date
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
    
    return value;
  };

  const validateCellValue = (value: string, rule: ValidationRule): boolean => {
    if (!rule) return true;

    const numValue = parseFloat(value);
    const dateValue = new Date(value);

    switch (rule.type) {
      case 'number':
        if (isNaN(numValue)) return false;
        return validateNumberRule(numValue, rule);
      
      case 'date':
        if (isNaN(dateValue.getTime())) return false;
        return validateDateRule(dateValue, rule);
      
      case 'list':
        return rule.listValues?.includes(value) || false;
      
      case 'custom':
        // Implement custom formula validation
        return true;
      
      default:
        return true;
    }
  };

  const validateNumberRule = (value: number, rule: ValidationRule): boolean => {
    const val1 = typeof rule.value1 === 'number' ? rule.value1 : 0;
    const val2 = typeof rule.value2 === 'number' ? rule.value2 : 0;

    switch (rule.operator) {
      case 'between': return value >= val1 && value <= val2;
      case 'notBetween': return value < val1 || value > val2;
      case 'equal': return value === val1;
      case 'notEqual': return value !== val1;
      case 'greater': return value > val1;
      case 'less': return value < val1;
      case 'greaterEqual': return value >= val1;
      case 'lessEqual': return value <= val1;
      default: return true;
    }
  };

  const validateDateRule = (value: Date, rule: ValidationRule): boolean => {
    const val1 = rule.value1 instanceof Date ? rule.value1 : new Date(rule.value1);
    const val2 = rule.value2 instanceof Date ? rule.value2 : new Date(rule.value2);

    switch (rule.operator) {
      case 'between': return value >= val1 && value <= val2;
      case 'notBetween': return value < val1 || value > val2;
      case 'equal': return value.getTime() === val1.getTime();
      case 'notEqual': return value.getTime() !== val1.getTime();
      case 'greater': return value > val1;
      case 'less': return value < val1;
      case 'greaterEqual': return value >= val1;
      case 'lessEqual': return value <= val1;
      default: return true;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Validation - {activeCell}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Validation Type</label>
          <Select value={validationType} onValueChange={setValidationType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="time">Time</SelectItem>
              <SelectItem value="list">List</SelectItem>
              <SelectItem value="custom">Custom Formula</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {validationType !== 'list' && validationType !== 'custom' && (
          <div>
            <label className="text-sm font-medium">Operator</label>
            <Select value={operator} onValueChange={setOperator}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="between">Between</SelectItem>
                <SelectItem value="notBetween">Not Between</SelectItem>
                <SelectItem value="equal">Equal to</SelectItem>
                <SelectItem value="notEqual">Not Equal to</SelectItem>
                <SelectItem value="greater">Greater than</SelectItem>
                <SelectItem value="less">Less than</SelectItem>
                <SelectItem value="greaterEqual">Greater than or equal</SelectItem>
                <SelectItem value="lessEqual">Less than or equal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {validationType === 'list' ? (
          <div>
            <label className="text-sm font-medium">List Values (comma separated)</label>
            <Input
              value={listValues}
              onChange={(e) => setListValues(e.target.value)}
              placeholder="Value1, Value2, Value3"
            />
          </div>
        ) : validationType !== 'custom' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">
                {operator === 'between' || operator === 'notBetween' ? 'Minimum' : 'Value'}
              </label>
              <Input
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder="Enter value"
              />
            </div>
            {(operator === 'between' || operator === 'notBetween') && (
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
        )}

        <div>
          <label className="text-sm font-medium">Input Message</label>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Message to show when cell is selected"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Error Message</label>
          <Input
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            placeholder="Message to show when validation fails"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={applyValidation}>Apply Validation</Button>
          <Button variant="outline" onClick={removeValidation}>Remove Validation</Button>
        </div>

        {currentValidation && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <h4 className="font-medium text-sm mb-2">Current Validation</h4>
            <div className="text-xs space-y-1">
              <div>Type: {currentValidation.type}</div>
              {currentValidation.operator && <div>Operator: {currentValidation.operator}</div>}
              {currentValidation.listValues && (
                <div>Values: {currentValidation.listValues.join(', ')}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataValidation;
