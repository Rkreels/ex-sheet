
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet, Cell } from '../../types/sheet';
import { toast } from 'sonner';

interface DataTransformationProps {
  activeSheet: Sheet;
  onUpdateSheet: (sheetId: string, updates: Partial<Sheet>) => void;
}

const DataTransformation: React.FC<DataTransformationProps> = ({ activeSheet, onUpdateSheet }) => {
  const [selectedRange, setSelectedRange] = useState('A1:Z100');
  const [transformationType, setTransformationType] = useState('removeDuplicates');

  const extractedData = useMemo(() => {
    // Extract data from the selected range
    const data: Record<string, string>[] = [];
    const headers: string[] = [];
    
    // Parse range (simplified)
    const [startCell, endCell] = selectedRange.split(':');
    if (!startCell || !endCell) return { headers, data };
    
    // Extract headers and data (simplified implementation)
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      if (cell.value && typeof cell.value === 'string') {
        // This is a simplified extraction - would need proper range parsing
        const match = cellId.match(/([A-Z]+)([0-9]+)/);
        if (match) {
          const col = match[1];
          const row = parseInt(match[2]);
          
          if (row === 1 && !headers.includes(cell.value)) {
            headers.push(cell.value);
          } else if (row > 1) {
            if (!data[row - 2]) data[row - 2] = {};
            data[row - 2][col] = cell.value;
          }
        }
      }
    });
    
    return { headers, data: data.filter(Boolean) };
  }, [activeSheet.cells, selectedRange]);

  const removeDuplicates = () => {
    const uniqueData = [];
    const seen = new Set();
    
    extractedData.data.forEach(row => {
      const key = JSON.stringify(row);
      if (!seen.has(key)) {
        seen.add(key);
        uniqueData.push(row);
      }
    });
    
    // Write back to sheet
    const newCells: Record<string, Cell> = {};
    uniqueData.forEach((row, index) => {
      Object.entries(row).forEach(([col, value]) => {
        newCells[`${col}${index + 2}`] = { value };
      });
    });
    
    onUpdateSheet(activeSheet.id, {
      cells: { ...activeSheet.cells, ...newCells }
    });
    
    toast.success(`Removed ${extractedData.data.length - uniqueData.length} duplicate rows`);
  };

  const splitColumn = () => {
    // Example: Split a column by delimiter
    const delimiter = ',';
    const sourceColumn = 'A';
    
    const newCells: Record<string, Cell> = {};
    
    extractedData.data.forEach((row, index) => {
      const value = row[sourceColumn];
      if (value && value.includes(delimiter)) {
        const parts = value.split(delimiter);
        parts.forEach((part, partIndex) => {
          const newCol = String.fromCharCode(65 + partIndex + 1); // B, C, D, etc.
          newCells[`${newCol}${index + 2}`] = { value: part.trim() };
        });
      }
    });
    
    onUpdateSheet(activeSheet.id, {
      cells: { ...activeSheet.cells, ...newCells }
    });
    
    toast.success('Column split completed');
  };

  const pivotData = () => {
    // Simple pivot operation
    const pivoted: Record<string, any> = {};
    
    extractedData.data.forEach(row => {
      const key = row['A'] || 'Unknown'; // Group by first column
      if (!pivoted[key]) {
        pivoted[key] = { count: 0, sum: 0 };
      }
      pivoted[key].count++;
      
      // Try to sum numeric values from second column
      const value = parseFloat(row['B'] || '0');
      if (!isNaN(value)) {
        pivoted[key].sum += value;
      }
    });
    
    // Write pivot results
    const newCells: Record<string, Cell> = {};
    let rowIndex = 50; // Start at row 50 for pivot results
    
    newCells[`A${rowIndex}`] = { value: 'Category' };
    newCells[`B${rowIndex}`] = { value: 'Count' };
    newCells[`C${rowIndex}`] = { value: 'Sum' };
    
    Object.entries(pivoted).forEach(([key, values], index) => {
      const row = rowIndex + index + 1;
      newCells[`A${row}`] = { value: key };
      newCells[`B${row}`] = { value: values.count.toString() };
      newCells[`C${row}`] = { value: values.sum.toString() };
    });
    
    onUpdateSheet(activeSheet.id, {
      cells: { ...activeSheet.cells, ...newCells }
    });
    
    toast.success('Data pivoted successfully');
  };

  const unpivotData = () => {
    // Convert wide format to long format
    const unpivoted: any[] = [];
    
    extractedData.data.forEach(row => {
      const identifier = row['A'];
      Object.entries(row).forEach(([col, value]) => {
        if (col !== 'A' && value) {
          unpivoted.push({
            identifier,
            category: extractedData.headers[col.charCodeAt(0) - 65] || col,
            value
          });
        }
      });
    });
    
    // Write unpivoted results
    const newCells: Record<string, Cell> = {};
    let rowIndex = 70; // Start at row 70 for unpivot results
    
    newCells[`A${rowIndex}`] = { value: 'Identifier' };
    newCells[`B${rowIndex}`] = { value: 'Category' };
    newCells[`C${rowIndex}`] = { value: 'Value' };
    
    unpivoted.forEach((item, index) => {
      const row = rowIndex + index + 1;
      newCells[`A${row}`] = { value: item.identifier };
      newCells[`B${row}`] = { value: item.category };
      newCells[`C${row}`] = { value: item.value };
    });
    
    onUpdateSheet(activeSheet.id, {
      cells: { ...activeSheet.cells, ...newCells }
    });
    
    toast.success('Data unpivoted successfully');
  };

  const executeTransformation = () => {
    switch (transformationType) {
      case 'removeDuplicates':
        removeDuplicates();
        break;
      case 'splitColumn':
        splitColumn();
        break;
      case 'pivot':
        pivotData();
        break;
      case 'unpivot':
        unpivotData();
        break;
      default:
        toast.error('Unknown transformation type');
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Transformation & Power Query</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transform">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transform">Transform</TabsTrigger>
              <TabsTrigger value="merge">Merge Data</TabsTrigger>
              <TabsTrigger value="staging">Staging Tables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transform" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="range">Data Range</Label>
                  <Input
                    id="range"
                    value={selectedRange}
                    onChange={(e) => setSelectedRange(e.target.value)}
                    placeholder="A1:Z100"
                  />
                </div>
                
                <div>
                  <Label htmlFor="transformation">Transformation Type</Label>
                  <Select value={transformationType} onValueChange={setTransformationType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="removeDuplicates">Remove Duplicates</SelectItem>
                      <SelectItem value="splitColumn">Split Column</SelectItem>
                      <SelectItem value="pivot">Pivot Data</SelectItem>
                      <SelectItem value="unpivot">Unpivot Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={executeTransformation}>
                  Execute Transformation
                </Button>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Data Preview</h4>
                  <div className="text-sm">
                    <p>Headers: {extractedData.headers.join(', ')}</p>
                    <p>Rows: {extractedData.data.length}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="merge" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Merge Multiple Data Sources</h4>
                <p className="text-sm text-gray-600">
                  Combine data from different sheets or ranges using common keys.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Data Range</Label>
                    <Input placeholder="Sheet1!A1:C100" />
                  </div>
                  <div>
                    <Label>Secondary Data Range</Label>
                    <Input placeholder="Sheet2!A1:D50" />
                  </div>
                </div>
                
                <div>
                  <Label>Join Column</Label>
                  <Input placeholder="ID" />
                </div>
                
                <div className="flex gap-2">
                  <Checkbox id="innerJoin" />
                  <Label htmlFor="innerJoin">Inner Join</Label>
                </div>
                
                <Button>Merge Data Sources</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="staging" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Create Staging Tables</h4>
                <p className="text-sm text-gray-600">
                  Prepare clean, structured data for analysis.
                </p>
                
                <div className="space-y-2">
                  <Button variant="outline" onClick={() => toast.info('Creating dimension table...')}>
                    Create Dimension Table
                  </Button>
                  <Button variant="outline" onClick={() => toast.info('Creating fact table...')}>
                    Create Fact Table
                  </Button>
                  <Button variant="outline" onClick={() => toast.info('Creating lookup table...')}>
                    Create Lookup Table
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTransformation;
