
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
  const [operator, setOperator] = useState<any>('between');
  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [listValues, setListValues] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [allowBlank, setAllowBlank] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(true);

  const handleApply = () => {
    let validation: DataValidation = {
      type: validationType,
      allowBlank,
      errorMessage: errorMessage.trim() ? errorMessage : undefined
    };

    // Add type-specific properties
    switch (validationType) {
      case 'list':
        validation.list = listValues.split(',').map(item => item.trim());
        validation.showDropdown = showDropdown;
        break;
      case 'number':
      case 'date':
        validation.operator = operator;
        validation.value1 = validationType === 'number' && !isNaN(Number(value1)) 
          ? Number(value1) 
          : value1;
        
        if (operator === 'between' || operator === 'notBetween') {
          validation.value2 = validationType === 'number' && !isNaN(Number(value2)) 
            ? Number(value2) 
            : value2;
        }
        break;
      case 'text':
        validation.operator = operator;
        validation.value1 = value1;
        break;
      case 'custom':
        validation.formula = value1;
        break;
    }

    onApply(validation);
    onClose();
  };

  const renderValidationFields = () => {
    switch (validationType) {
      case 'list':
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="list-values" className="col-span-1">Source</Label>
              <Textarea
                id="list-values"
                value={listValues}
                onChange={(e) => setListValues(e.target.value)}
                placeholder="Enter values separated by commas"
                className="col-span-3 min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="show-dropdown" className="col-span-1">In-cell dropdown</Label>
              <div className="col-span-3">
                <Switch 
                  id="show-dropdown" 
                  checked={showDropdown} 
                  onCheckedChange={setShowDropdown} 
                />
              </div>
            </div>
          </>
        );
      
      case 'number':
      case 'date':
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="operator" className="col-span-1">Operator</Label>
              <Select
                value={operator}
                onValueChange={setOperator}
                className="col-span-3"
              >
                <SelectTrigger id="operator">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="between">between</SelectItem>
                  <SelectItem value="notBetween">not between</SelectItem>
                  <SelectItem value="equal">equal to</SelectItem>
                  <SelectItem value="notEqual">not equal to</SelectItem>
                  <SelectItem value="greaterThan">greater than</SelectItem>
                  <SelectItem value="lessThan">less than</SelectItem>
                  <SelectItem value="greaterThanOrEqual">greater than or equal to</SelectItem>
                  <SelectItem value="lessThanOrEqual">less than or equal to</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(operator === 'between' || operator === 'notBetween') ? (
              <>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="minimum" className="col-span-1">Minimum</Label>
                  <Input
                    id="minimum"
                    type={validationType === 'date' ? "date" : "text"}
                    value={value1}
                    onChange={(e) => setValue1(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-2">
                  <Label htmlFor="maximum" className="col-span-1">Maximum</Label>
                  <Input
                    id="maximum"
                    type={validationType === 'date' ? "date" : "text"}
                    value={value2}
                    onChange={(e) => setValue2(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="value" className="col-span-1">Value</Label>
                <Input
                  id="value"
                  type={validationType === 'date' ? "date" : "text"}
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}
          </>
        );
      
      case 'text':
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="text-operator" className="col-span-1">Data</Label>
              <Select
                value={operator}
                onValueChange={setOperator}
                className="col-span-3"
              >
                <SelectTrigger id="text-operator">
                  <SelectValue placeholder="Select criteria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equal">equal to</SelectItem>
                  <SelectItem value="notEqual">not equal to</SelectItem>
                  <SelectItem value="contains">contains</SelectItem>
                  <SelectItem value="notContains">does not contain</SelectItem>
                  <SelectItem value="startsWith">starts with</SelectItem>
                  <SelectItem value="endsWith">ends with</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="text-value" className="col-span-1">Text</Label>
              <Input
                id="text-value"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                className="col-span-3"
              />
            </div>
          </>
        );
      
      case 'custom':
        return (
          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="formula" className="col-span-1">Formula</Label>
            <Input
              id="formula"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
              className="col-span-3"
              placeholder="=A1>0"
            />
          </div>
        );

      default:
        return null;
    }
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
            <Select
              value={validationType}
              onValueChange={(value) => setValidationType(value as DataValidation['type'])}
              className="col-span-3"
            >
              <SelectTrigger id="validation-type">
                <SelectValue placeholder="Select validation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="list">List</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="custom">Custom formula</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderValidationFields()}

          <div className="grid grid-cols-4 items-center gap-2">
            <Label htmlFor="allow-blank" className="col-span-1">Ignore blanks</Label>
            <div className="col-span-3">
              <Switch 
                id="allow-blank" 
                checked={allowBlank} 
                onCheckedChange={setAllowBlank} 
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-2">
            <Label htmlFor="error-message" className="col-span-1">Error message</Label>
            <Textarea
              id="error-message"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="Custom error message (optional)"
              className="col-span-3 min-h-[60px]"
            />
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

export default DataValidationDialog;
