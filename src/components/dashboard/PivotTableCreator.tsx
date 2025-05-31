
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Cell } from '../../types/sheet';
import { toast } from 'sonner';

interface PivotTableCreatorProps {
  data: Record<string, Cell>;
  onUpdate: (config: any) => void;
}

const PivotTableCreator: React.FC<PivotTableCreatorProps> = ({ data, onUpdate }) => {
  const [rows, setRows] = useState<string[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);
  const [aggregation, setAggregation] = useState<'sum' | 'count' | 'average' | 'max' | 'min'>('sum');

  // Extract column headers from data
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

  const createPivotTable = () => {
    if (rows.length === 0 || values.length === 0) {
      toast.error("Please select at least one row field and one value field");
      return;
    }

    // Get data rows (excluding header)
    const dataRows: Record<string, any>[] = [];
    const headers = getColumns();
    
    // Find the maximum row number
    let maxRow = 1;
    Object.keys(data).forEach(cellId => {
      const match = cellId.match(/(\d+)$/);
      if (match) {
        maxRow = Math.max(maxRow, parseInt(match[1]));
      }
    });

    // Extract data rows
    for (let row = 2; row <= maxRow; row++) {
      const rowData: Record<string, any> = {};
      headers.forEach((header, colIndex) => {
        const cellId = `${String.fromCharCode(65 + colIndex)}${row}`;
        rowData[header] = data[cellId]?.value || '';
      });
      if (Object.values(rowData).some(val => val !== '')) {
        dataRows.push(rowData);
      }
    }

    // Create pivot table
    const pivotData: Record<string, any> = {};
    
    dataRows.forEach(row => {
      const rowKey = rows.map(field => row[field]).join(' | ');
      const colKey = columns.length > 0 ? columns.map(field => row[field]).join(' | ') : 'Total';
      
      if (!pivotData[rowKey]) {
        pivotData[rowKey] = {};
      }
      
      if (!pivotData[rowKey][colKey]) {
        pivotData[rowKey][colKey] = [];
      }
      
      values.forEach(valueField => {
        const value = parseFloat(row[valueField]) || 0;
        pivotData[rowKey][colKey].push(value);
      });
    });

    // Aggregate values
    Object.keys(pivotData).forEach(rowKey => {
      Object.keys(pivotData[rowKey]).forEach(colKey => {
        const values = pivotData[rowKey][colKey];
        let result = 0;
        
        switch (aggregation) {
          case 'sum':
            result = values.reduce((sum: number, val: number) => sum + val, 0);
            break;
          case 'count':
            result = values.length;
            break;
          case 'average':
            result = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
            break;
          case 'max':
            result = Math.max(...values);
            break;
          case 'min':
            result = Math.min(...values);
            break;
        }
        
        pivotData[rowKey][colKey] = result;
      });
    });

    onUpdate({ rows, columns, values, aggregation, data: pivotData });
    toast.success("Pivot table created successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PivotTable Creator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Row Fields</label>
          <Select value={rows[0] || ''} onValueChange={(value) => setRows([value])}>
            <SelectTrigger>
              <SelectValue placeholder="Select row field" />
            </SelectTrigger>
            <SelectContent>
              {getColumns().map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Column Fields</label>
          <Select value={columns[0] || ''} onValueChange={(value) => setColumns(value ? [value] : [])}>
            <SelectTrigger>
              <SelectValue placeholder="Select column field (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">None</SelectItem>
              {getColumns().map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Value Fields</label>
          <Select value={values[0] || ''} onValueChange={(value) => setValues([value])}>
            <SelectTrigger>
              <SelectValue placeholder="Select value field" />
            </SelectTrigger>
            <SelectContent>
              {getColumns().map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Aggregation</label>
          <Select value={aggregation} onValueChange={(value: any) => setAggregation(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sum">Sum</SelectItem>
              <SelectItem value="count">Count</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="max">Maximum</SelectItem>
              <SelectItem value="min">Minimum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={createPivotTable} className="w-full">
          Create PivotTable
        </Button>
      </CardContent>
    </Card>
  );
};

export default PivotTableCreator;
