
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Cell } from '../../types/sheet';

interface SlicerControlProps {
  data: Record<string, Cell>;
  onFilter: (filters: Record<string, string[]>) => void;
  field?: string;
}

const SlicerControl: React.FC<SlicerControlProps> = ({ data, onFilter, field = 'Category' }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const uniqueValues = useMemo(() => {
    const values = new Set<string>();
    Object.entries(data).forEach(([cellId, cell]) => {
      if (cell.value && typeof cell.value === 'string' && !cell.value.startsWith('=')) {
        values.add(cell.value);
      }
    });
    return Array.from(values).sort();
  }, [data]);

  const handleValueToggle = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    
    setSelectedValues(newSelection);
    onFilter({ [field]: newSelection });
  };

  const selectAll = () => {
    setSelectedValues(uniqueValues);
    onFilter({ [field]: uniqueValues });
  };

  const clearAll = () => {
    setSelectedValues([]);
    onFilter({ [field]: [] });
  };

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{field} Filter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear
            </Button>
          </div>
          
          <div className="max-h-48 overflow-y-auto space-y-2">
            {uniqueValues.map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={value}
                  checked={selectedValues.includes(value)}
                  onCheckedChange={() => handleValueToggle(value)}
                />
                <label 
                  htmlFor={value} 
                  className="text-sm cursor-pointer flex-1 truncate"
                  title={value}
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
          
          {selectedValues.length > 0 && (
            <div className="text-xs text-gray-500 mt-2">
              {selectedValues.length} of {uniqueValues.length} selected
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SlicerControl;
