
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface PivotTableCreatorProps {
  data: any[];
  isOpen: boolean;
  onClose: () => void;
  onCreatePivot: (pivotConfig: any) => void;
}

const PivotTableCreator: React.FC<PivotTableCreatorProps> = ({
  data,
  isOpen,
  onClose,
  onCreatePivot
}) => {
  const [rowFields, setRowFields] = useState<string[]>([]);
  const [columnFields, setColumnFields] = useState<string[]>([]);
  const [valueFields, setValueFields] = useState<string[]>([]);
  const [aggregationMethod, setAggregationMethod] = useState<string>('sum');

  const availableFields = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0] || {});
  }, [data]);

  const aggregationMethods = [
    { value: 'sum', label: 'Sum' },
    { value: 'count', label: 'Count' },
    { value: 'average', label: 'Average' },
    { value: 'max', label: 'Maximum' },
    { value: 'min', label: 'Minimum' }
  ];

  const handleFieldToggle = (field: string, fieldType: 'row' | 'column' | 'value') => {
    switch (fieldType) {
      case 'row':
        setRowFields(prev => 
          prev.includes(field) 
            ? prev.filter(f => f !== field)
            : [...prev, field]
        );
        break;
      case 'column':
        setColumnFields(prev => 
          prev.includes(field) 
            ? prev.filter(f => f !== field)
            : [...prev, field]
        );
        break;
      case 'value':
        setValueFields(prev => 
          prev.includes(field) 
            ? prev.filter(f => f !== field)
            : [...prev, field]
        );
        break;
    }
  };

  const generatePivotTable = () => {
    if (!data || data.length === 0) return null;

    const pivotData = {};
    
    // Group data by row and column fields
    data.forEach(row => {
      const rowKey = rowFields.map(field => row[field]).join(' | ');
      const colKey = columnFields.map(field => row[field]).join(' | ');
      
      if (!pivotData[rowKey]) {
        pivotData[rowKey] = {};
      }
      
      if (!pivotData[rowKey][colKey]) {
        pivotData[rowKey][colKey] = [];
      }
      
      pivotData[rowKey][colKey].push(row);
    });

    // Calculate aggregated values
    const processedData = {};
    Object.keys(pivotData).forEach(rowKey => {
      processedData[rowKey] = {};
      Object.keys(pivotData[rowKey]).forEach(colKey => {
        const values = pivotData[rowKey][colKey];
        
        valueFields.forEach(valueField => {
          const fieldValues = values.map(v => parseFloat(v[valueField]) || 0);
          let aggregatedValue = 0;
          
          switch (aggregationMethod) {
            case 'sum':
              aggregatedValue = fieldValues.reduce((sum, val) => sum + val, 0);
              break;
            case 'count':
              aggregatedValue = fieldValues.length;
              break;
            case 'average':
              aggregatedValue = fieldValues.reduce((sum, val) => sum + val, 0) / fieldValues.length;
              break;
            case 'max':
              aggregatedValue = Math.max(...fieldValues);
              break;
            case 'min':
              aggregatedValue = Math.min(...fieldValues);
              break;
          }
          
          const key = `${colKey}_${valueField}`;
          processedData[rowKey][key] = aggregatedValue;
        });
      });
    });

    return processedData;
  };

  const pivotTable = generatePivotTable();

  const handleCreatePivot = () => {
    const pivotConfig = {
      id: `pivot_${Date.now()}`,
      rowFields,
      columnFields,
      valueFields,
      aggregationMethod,
      data: pivotTable,
      sourceData: data
    };
    
    onCreatePivot(pivotConfig);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Pivot Table</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Field Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Aggregation Method</Label>
                  <Select value={aggregationMethod} onValueChange={setAggregationMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aggregationMethods.map(method => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Row Fields</Label>
                  <div className="space-y-2 mt-2">
                    {availableFields.map(field => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={`row-${field}`}
                          checked={rowFields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field, 'row')}
                        />
                        <Label htmlFor={`row-${field}`} className="text-sm">{field}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Column Fields</Label>
                  <div className="space-y-2 mt-2">
                    {availableFields.map(field => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={`col-${field}`}
                          checked={columnFields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field, 'column')}
                        />
                        <Label htmlFor={`col-${field}`} className="text-sm">{field}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Value Fields</Label>
                  <div className="space-y-2 mt-2">
                    {availableFields.map(field => (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={`val-${field}`}
                          checked={valueFields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field, 'value')}
                        />
                        <Label htmlFor={`val-${field}`} className="text-sm">{field}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pivot Table Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {pivotTable && Object.keys(pivotTable).length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rows</TableHead>
                          {columnFields.length > 0 && valueFields.length > 0 && 
                            Object.keys(Object.values(pivotTable)[0] || {}).map(colKey => (
                              <TableHead key={colKey}>{colKey}</TableHead>
                            ))
                          }
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(pivotTable).map(([rowKey, values]) => (
                          <TableRow key={rowKey}>
                            <TableCell className="font-medium">{rowKey}</TableCell>
                            {Object.values(values as object).map((value, index) => (
                              <TableCell key={index}>
                                {typeof value === 'number' ? value.toFixed(2) : value}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Select row fields, column fields, and value fields to generate pivot table
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreatePivot}
            disabled={!rowFields.length || !valueFields.length}
          >
            Create Pivot Table
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PivotTableCreator;
