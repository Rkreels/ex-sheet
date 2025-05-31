
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataValidation, CellRange } from '../types/sheet';

interface DataValidationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (validation: DataValidation) => void;
  selectedRange?: CellRange;
}

const DataValidationDialog: React.FC<DataValidationDialogProps> = ({ 
  isOpen, 
  onClose,
  onApply,
  selectedRange
}) => {
  const [validationType, setValidationType] = useState<DataValidation['type']>('list');
  const [operator, setOperator] = useState<string>('equal');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [listValues, setListValues] = useState<string>('');
  const [formula, setFormula] = useState<string>('');
  const [allowBlank, setAllowBlank] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showDropdown, setShowDropdown] = useState<boolean>(true);

  const handleApply = () => {
    let validation: DataValidation = {
      id: `dv-${Date.now()}`,
      range: selectedRange || { startCell: 'A1', endCell: 'A1' },
      type: validationType,
      values: [],
      allowBlank,
      errorMessage,
      showDropdown
    };

    if (validationType === 'list') {
      validation.list = listValues.split(',').map(item => item.trim());
      validation.values = validation.list;
    } else if (validationType === 'custom') {
      validation.formula = formula;
    } else {
      validation.operator = operator as any;
      validation.value1 = value1 ? (isNaN(Number(value1)) ? value1 : Number(value1)) : undefined;
      
      if (['between', 'notBetween'].includes(operator)) {
        validation.value2 = value2 ? (isNaN(Number(value2)) ? value2 : Number(value2)) : undefined;
      }
      
      validation.values = [value1, value2].filter(Boolean);
    }

    onApply(validation);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Data Validation</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="validation-type" className="col-span-1">Allow</Label>
            <div className="col-span-3">
              <Select
                value={validationType}
                onValueChange={(value) => setValidationType(value as DataValidation['type'])}
              >
                <SelectTrigger id="validation-type">
                  <SelectValue placeholder="Select validation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="custom">Custom Formula</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {validationType === 'list' && (
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="list-values" className="col-span-1">Values</Label>
              <Input
                id="list-values"
                value={listValues}
                onChange={(e) => setListValues(e.target.value)}
                placeholder="Enter comma-separated values"
                className="col-span-3"
              />
            </div>
          )}

          {validationType === 'custom' && (
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="formula" className="col-span-1">Formula</Label>
              <Input
                id="formula"
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="Enter formula (e.g. =A1>100)"
                className="col-span-3"
              />
            </div>
          )}

          {(validationType === 'number' || validationType === 'date' || validationType === 'text') && (
            <>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="operator" className="col-span-1">Operator</Label>
                <div className="col-span-3">
                  <Select
                    value={operator}
                    onValueChange={setOperator}
                  >
                    <SelectTrigger id="operator">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equal">Equal to</SelectItem>
                      <SelectItem value="notEqual">Not equal to</SelectItem>
                      <SelectItem value="greaterThan">Greater than</SelectItem>
                      <SelectItem value="lessThan">Less than</SelectItem>
                      <SelectItem value="greaterThanOrEqual">Greater than or equal to</SelectItem>
                      <SelectItem value="lessThanOrEqual">Less than or equal to</SelectItem>
                      <SelectItem value="between">Between</SelectItem>
                      <SelectItem value="notBetween">Not between</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="value1" className="col-span-1">
                  {['between', 'notBetween'].includes(operator) ? 'Minimum' : 'Value'}
                </Label>
                <Input
                  id="value1"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  className="col-span-3"
                  type={validationType === 'date' ? 'date' : 'text'}
                  placeholder={validationType === 'date' ? '' : "Enter a value"}
                />
              </div>

              {['between', 'notBetween'].includes(operator) && (
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="value2" className="col-span-1">Maximum</Label>
                  <Input
                    id="value2"
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    className="col-span-3"
                    type={validationType === 'date' ? 'date' : 'text'}
                    placeholder={validationType === 'date' ? '' : "Enter maximum value"}
                  />
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="error-message" className="col-span-1">Error Message</Label>
            <Input
              id="error-message"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              className="col-span-3"
              placeholder="Optional error message"
            />
          </div>

          <div className="flex items-center mt-2">
            <input 
              type="checkbox" 
              id="allow-blank" 
              checked={allowBlank} 
              onChange={() => setAllowBlank(!allowBlank)} 
              className="mr-2"
            />
            <Label htmlFor="allow-blank">Allow blank values</Label>
          </div>

          {validationType === 'list' && (
            <div className="flex items-center mt-2">
              <input 
                type="checkbox" 
                id="show-dropdown" 
                checked={showDropdown} 
                onChange={() => setShowDropdown(!showDropdown)} 
                className="mr-2"
              />
              <Label htmlFor="show-dropdown">Show dropdown in cell</Label>
            </div>
          )}

          {selectedRange && (
            <div className="grid grid-cols-4 items-center gap-2 mt-2">
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

export default DataValidationDialog;
