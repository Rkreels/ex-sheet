
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Cell } from '../../types/sheet';

interface PivotTableCreatorProps {
  data: Record<string, Cell>;
  onUpdate: (config: any) => void;
}

const PivotTableCreator: React.FC<PivotTableCreatorProps> = ({ data, onUpdate }) => {
  const [rowFields, setRowFields] = useState<string[]>([]);
  const [columnFields, setColumnFields] = useState<string[]>([]);
  const [valueFields, setValueFields] = useState<string[]>([]);
  const [aggregateFunction, setAggregateFunction] = useState<string>('SUM');

  // Extract field names from data
  const availableFields = useMemo(() => {
    const fields = new Set<string>();
    Object.entries(data).forEach(([cellId, cell]) => {
      if (cell.value && typeof cell.value === 'string' && !cell.value.startsWith('=')) {
        // Extract column headers (assuming first row contains headers)
        if (cellId.match(/[A-Z]+1/)) {
          fields.add(cell.value);
        }
      }
    });
    return Array.from(fields);
  }, [data]);

  // Generate pivot table data
  const pivotData = useMemo(() => {
    if (rowFields.length === 0 || valueFields.length === 0) return [];
    
    // This is a simplified pivot table generation
    // In a real implementation, you'd want more sophisticated grouping logic
    const groups: Record<string, any> = {};
    
    Object.entries(data).forEach(([cellId, cell]) => {
      if (cell.value && !isNaN(Number(cell.value))) {
        const rowKey = rowFields.join('-'); // Simplified grouping
        if (!groups[rowKey]) {
          groups[rowKey] = {};
          rowFields.forEach(field => groups[rowKey][field] = field);
          valueFields.forEach(field => groups[rowKey][field] = 0);
        }
        
        valueFields.forEach(field => {
          const value = Number(cell.value);
          switch (aggregateFunction) {
            case 'SUM':
              groups[rowKey][field] += value;
              break;
            case 'COUNT':
              groups[rowKey][field] += 1;
              break;
            case 'AVERAGE':
              groups[rowKey][field] = (groups[rowKey][field] + value) / 2;
              break;
          }
        });
      }
    });
    
    return Object.values(groups);
  }, [data, rowFields, columnFields, valueFields, aggregateFunction]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Row Fields</label>
          <Select onValueChange={(value) => setRowFields([...rowFields, value])}>
            <SelectTrigger>
              <SelectValue placeholder="Select row field" />
            </SelectTrigger>
            <SelectContent>
              {availableFields.map(field => (
                <SelectItem key={field} value={field}>{field}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 space-x-1">
            {rowFields.map((field, index) => (
              <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {field}
                <button 
                  onClick={() => setRowFields(rowFields.filter((_, i) => i !== index))}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Value Fields</label>
          <Select onValueChange={(value) => setValueFields([...valueFields, value])}>
            <SelectTrigger>
              <SelectValue placeholder="Select value field" />
            </SelectTrigger>
            <SelectContent>
              {availableFields.map(field => (
                <SelectItem key={field} value={field}>{field}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 space-x-1">
            {valueFields.map((field, index) => (
              <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                {field}
                <button 
                  onClick={() => setValueFields(valueFields.filter((_, i) => i !== index))}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Aggregate Function</label>
        <Select value={aggregateFunction} onValueChange={setAggregateFunction}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SUM">Sum</SelectItem>
            <SelectItem value="COUNT">Count</SelectItem>
            <SelectItem value="AVERAGE">Average</SelectItem>
            <SelectItem value="MIN">Min</SelectItem>
            <SelectItem value="MAX">Max</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {pivotData.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Pivot Table Results</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  {rowFields.map(field => (
                    <th key={field} className="border border-gray-300 px-2 py-1 text-left">{field}</th>
                  ))}
                  {valueFields.map(field => (
                    <th key={field} className="border border-gray-300 px-2 py-1 text-left">{field}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pivotData.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    {rowFields.map(field => (
                      <td key={field} className="border border-gray-300 px-2 py-1">{row[field]}</td>
                    ))}
                    {valueFields.map(field => (
                      <td key={field} className="border border-gray-300 px-2 py-1">{row[field]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PivotTableCreator;
