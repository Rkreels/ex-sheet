
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Cell } from '../../types/sheet';

interface SlicerControlProps {
  data: Record<string, Cell>;
  onFilter: (filters: Record<string, string[]>) => void;
}

const SlicerControl: React.FC<SlicerControlProps> = ({ data, onFilter }) => {
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [uniqueValues, setUniqueValues] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Extract column headers
  const getColumns = () => {
    const headers: string[] = [];
    Object.keys(data).forEach(cellId => {
      const match = cellId.match(/^([A-Z]+)1$/);
      if (match) {
        headers.push(data[cellId]?.value || cellId);
      }
    });
    return headers;
  };

  // Get unique values for selected column
  const getUniqueValues = (column: string) => {
    const values = new Set<string>();
    const headers = getColumns();
    const columnIndex = headers.indexOf(column);
    
    if (columnIndex === -1) return [];

    // Find the maximum row number
    let maxRow = 1;
    Object.keys(data).forEach(cellId => {
      const match = cellId.match(/(\d+)$/);
      if (match) {
        maxRow = Math.max(maxRow, parseInt(match[1]));
      }
    });

    // Extract values from the selected column
    for (let row = 2; row <= maxRow; row++) {
      const cellId = `${String.fromCharCode(65 + columnIndex)}${row}`;
      const value = data[cellId]?.value || '';
      if (value.trim() !== '') {
        values.add(value.toString());
      }
    }

    return Array.from(values).sort();
  };

  useEffect(() => {
    if (selectedColumn) {
      const values = getUniqueValues(selectedColumn);
      setUniqueValues(values);
      setSelectedValues(values); // Select all by default
    }
  }, [selectedColumn, data]);

  const handleValueToggle = (value: string, checked: boolean) => {
    setSelectedValues(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(v => v !== value);
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedValues(uniqueValues);
  };

  const handleClearAll = () => {
    setSelectedValues([]);
  };

  const applyFilter = () => {
    if (selectedColumn && selectedValues.length > 0) {
      const newFilters = {
        ...activeFilters,
        [selectedColumn]: selectedValues
      };
      setActiveFilters(newFilters);
      onFilter(newFilters);
    }
  };

  const clearFilter = (column: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[column];
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    onFilter({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Data Slicer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs font-medium">Column</label>
          <Select value={selectedColumn} onValueChange={setSelectedColumn}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Select column to filter" />
            </SelectTrigger>
            <SelectContent>
              {getColumns().map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedColumn && uniqueValues.length > 0 && (
          <div>
            <div className="flex gap-2 mb-2">
              <Button size="sm" variant="outline" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button size="sm" variant="outline" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>

            <div className="max-h-32 overflow-y-auto space-y-1">
              {uniqueValues.map((value) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={value}
                    checked={selectedValues.includes(value)}
                    onCheckedChange={(checked) => handleValueToggle(value, checked as boolean)}
                  />
                  <label htmlFor={value} className="text-xs cursor-pointer">
                    {value}
                  </label>
                </div>
              ))}
            </div>

            <Button onClick={applyFilter} className="w-full mt-2" size="sm">
              Apply Filter
            </Button>
          </div>
        )}

        {Object.keys(activeFilters).length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium">Active Filters</span>
              <Button size="sm" variant="ghost" onClick={clearAllFilters}>
                Clear All
              </Button>
            </div>
            
            <div className="space-y-1">
              {Object.entries(activeFilters).map(([column, values]) => (
                <div key={column} className="flex justify-between items-center text-xs">
                  <span>{column}: {values.length} items</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => clearFilter(column)}
                    className="h-4 px-1"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SlicerControl;
