import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Sheet, Cell } from '../../types/sheet';
import { toast } from 'sonner';

interface DataTransformationProps {
  sheets: Sheet[];
  activeSheet: Sheet;
  onUpdateSheet: (sheetId: string, updates: Partial<Sheet>) => void;
}

const DataTransformation: React.FC<DataTransformationProps> = ({
  sheets,
  activeSheet,
  onUpdateSheet
}) => {
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [splitDelimiter, setSplitDelimiter] = useState<string>(',');

  const removeDuplicates = () => {
    const cells = activeSheet.cells;
    const uniqueValues = new Set();
    const newCells: Record<string, Cell> = {};
    
    Object.entries(cells).forEach(([cellId, cell]) => {
      const cellValue = cell.value?.toString() || '';
      if (!uniqueValues.has(cellValue)) {
        uniqueValues.add(cellValue);
        newCells[cellId] = cell;
      }
    });
    
    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("Duplicates removed successfully!");
  };

  const splitColumn = () => {
    const cells = activeSheet.cells;
    const newCells: Record<string, Cell> = { ...cells };
    
    Object.entries(cells).forEach(([cellId, cell]) => {
      const cellValue = typeof cell.value === 'string' ? cell.value : String(cell.value || '');
      if (cellValue.includes(splitDelimiter)) {
        const parts = cellValue.split(splitDelimiter);
        parts.forEach((part, index) => {
          const colMatch = cellId.match(/[A-Z]+/);
          const rowMatch = cellId.match(/\d+/);
          if (colMatch && rowMatch) {
            const col = String.fromCharCode(colMatch[0].charCodeAt(0) + index);
            const newCellId = col + rowMatch[0];
            newCells[newCellId] = { ...cell, value: part.trim() };
          }
        });
      }
    });
    
    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("Column split successfully!");
  };

  const mergeSheets = (targetSheetId: string) => {
    const targetSheet = sheets.find(s => s.id === targetSheetId);
    if (!targetSheet) return;
    
    const mergedCells = { ...activeSheet.cells };
    let rowOffset = Object.keys(activeSheet.cells).length;
    
    Object.entries(targetSheet.cells).forEach(([cellId, cell]) => {
      const rowMatch = cellId.match(/\d+/);
      if (rowMatch) {
        const newRow = parseInt(rowMatch[0]) + rowOffset;
        const newCellId = cellId.replace(/\d+/, newRow.toString());
        mergedCells[newCellId] = cell;
      }
    });
    
    onUpdateSheet(activeSheet.id, { cells: mergedCells });
    toast.success("Sheets merged successfully!");
  };

  const applyTransformation = () => {
    switch (selectedOperation) {
      case 'remove-duplicates':
        removeDuplicates();
        break;
      case 'split-column':
        splitColumn();
        break;
      case 'merge-sheets':
        if (sheets.length > 1) {
          mergeSheets(sheets[1].id);
        } else {
          toast.error("At least two sheets are required to merge.");
        }
        break;
      default:
        toast.warning("No transformation selected.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Transformation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedOperation} onValueChange={setSelectedOperation}>
            <SelectTrigger>
              <SelectValue placeholder="Select transformation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remove-duplicates">Remove Duplicates</SelectItem>
              <SelectItem value="split-column">Split Column</SelectItem>
              <SelectItem value="merge-sheets">Merge Sheets</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedOperation === 'split-column' && (
            <Input
              type="text"
              placeholder="Enter delimiter"
              value={splitDelimiter}
              onChange={(e) => setSplitDelimiter(e.target.value)}
            />
          )}

          <Button onClick={applyTransformation} variant="outline">
            Apply Transformation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTransformation;
