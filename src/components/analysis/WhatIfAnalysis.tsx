
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet } from '../../types/sheet';
import { toast } from 'sonner';

interface WhatIfAnalysisProps {
  activeSheet: Sheet;
  onUpdateSheet: (sheetId: string, updates: Partial<Sheet>) => void;
}

const WhatIfAnalysis: React.FC<WhatIfAnalysisProps> = ({
  activeSheet,
  onUpdateSheet
}) => {
  const [analysisType, setAnalysisType] = useState<'data-table' | 'goal-seek' | 'scenario'>('data-table');
  const [inputCell, setInputCell] = useState<string>('B1');
  const [formulaCell, setFormulaCell] = useState<string>('B2');
  const [targetValue, setTargetValue] = useState<number>(100);
  const [scenarios, setScenarios] = useState([
    { name: 'Base Case', values: {} },
    { name: 'Best Case', values: {} },
    { name: 'Worst Case', values: {} }
  ]);

  const createDataTable = () => {
    const newCells = { ...activeSheet.cells };
    
    // Create a one-variable data table
    newCells['A1'] = { value: 'Data Table Analysis' };
    newCells['A3'] = { value: 'Input Variable' };
    newCells['B3'] = { value: 'Output Result' };
    
    // Generate sensitivity analysis
    const baseValue = parseFloat(activeSheet.cells[inputCell]?.value || '10');
    
    for (let i = -5; i <= 5; i++) {
      const row = 4 + i + 5;
      const testValue = baseValue * (1 + i * 0.1); // +/- 10% increments
      const resultValue = testValue * 2; // Simple calculation for demo
      
      newCells[`A${row}`] = { value: testValue.toFixed(2) };
      newCells[`B${row}`] = { value: resultValue.toFixed(2) };
    }
    
    // Two-variable data table
    newCells['D1'] = { value: 'Two-Variable Data Table' };
    newCells['D3'] = { value: 'Var1\\Var2' };
    
    // Create headers for variable 2
    for (let j = 1; j <= 5; j++) {
      const col = String.fromCharCode(68 + j); // E, F, G, H, I
      newCells[`${col}3`] = { value: (j * 10).toString() };
    }
    
    // Create rows for variable 1 and fill results
    for (let i = 1; i <= 5; i++) {
      const row = 3 + i;
      newCells[`D${row}`] = { value: (i * 5).toString() };
      
      for (let j = 1; j <= 5; j++) {
        const col = String.fromCharCode(68 + j);
        const result = (i * 5) + (j * 10); // Simple calculation
        newCells[`${col}${row}`] = { value: result.toString() };
      }
    }
    
    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("Data table created successfully!");
  };

  const performGoalSeek = () => {
    const newCells = { ...activeSheet.cells };
    
    newCells['A1'] = { value: 'Goal Seek Analysis' };
    newCells['A3'] = { value: 'Target Cell' };
    newCells['B3'] = { value: formulaCell };
    newCells['A4'] = { value: 'Target Value' };
    newCells['B4'] = { value: targetValue.toString() };
    newCells['A5'] = { value: 'Variable Cell' };
    newCells['B5'] = { value: inputCell };
    
    // Simple goal seek calculation (in real Excel, this would use Solver)
    const currentValue = parseFloat(activeSheet.cells[formulaCell]?.value || '0');
    const inputValue = parseFloat(activeSheet.cells[inputCell]?.value || '1');
    
    // Assuming linear relationship for simplification
    const requiredInput = (targetValue / currentValue) * inputValue;
    
    newCells['A7'] = { value: 'Solution' };
    newCells['A8'] = { value: 'Required Input Value' };
    newCells['B8'] = { value: requiredInput.toFixed(4) };
    
    // Update the actual input cell
    newCells[inputCell] = { value: requiredInput.toFixed(4) };
    
    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("Goal seek completed!");
  };

  const createScenarioAnalysis = () => {
    const newCells = { ...activeSheet.cells };
    
    newCells['A1'] = { value: 'Scenario Analysis' };
    newCells['A3'] = { value: 'Scenario' };
    newCells['B3'] = { value: 'Variable 1' };
    newCells['C3'] = { value: 'Variable 2' };
    newCells['D3'] = { value: 'Result' };
    
    // Define scenario values
    const scenarioData = [
      { name: 'Base Case', var1: 100, var2: 10, result: 110 },
      { name: 'Best Case', var1: 120, var2: 15, result: 135 },
      { name: 'Worst Case', var1: 80, var2: 5, result: 85 },
      { name: 'Optimistic', var1: 130, var2: 18, result: 148 },
      { name: 'Pessimistic', var1: 70, var2: 3, result: 73 }
    ];
    
    scenarioData.forEach((scenario, index) => {
      const row = 4 + index;
      newCells[`A${row}`] = { value: scenario.name };
      newCells[`B${row}`] = { value: scenario.var1.toString() };
      newCells[`C${row}`] = { value: scenario.var2.toString() };
      newCells[`D${row}`] = { value: scenario.result.toString() };
    });
    
    // Summary statistics
    newCells['A10'] = { value: 'Summary Statistics' };
    newCells['A11'] = { value: 'Average Result' };
    newCells['B11'] = { value: '=AVERAGE(D4:D8)' };
    newCells['A12'] = { value: 'Standard Deviation' };
    newCells['B12'] = { value: '=STDEV(D4:D8)' };
    newCells['A13'] = { value: 'Min Result' };
    newCells['B13'] = { value: '=MIN(D4:D8)' };
    newCells['A14'] = { value: 'Max Result' };
    newCells['B14'] = { value: '=MAX(D4:D8)' };
    
    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("Scenario analysis created!");
  };

  const runAnalysis = () => {
    switch (analysisType) {
      case 'data-table':
        createDataTable();
        break;
      case 'goal-seek':
        performGoalSeek();
        break;
      case 'scenario':
        createScenarioAnalysis();
        break;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>What-If Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4">
            <div>
              <label className="text-sm font-medium">Analysis Type</label>
              <Select value={analysisType} onValueChange={(value: any) => setAnalysisType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="data-table">Data Table</SelectItem>
                  <SelectItem value="goal-seek">Goal Seek</SelectItem>
                  <SelectItem value="scenario">Scenario Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {analysisType === 'goal-seek' && (
              <>
                <div>
                  <label className="text-sm font-medium">Formula Cell</label>
                  <Input
                    value={formulaCell}
                    onChange={(e) => setFormulaCell(e.target.value)}
                    placeholder="e.g., B2"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Target Value</label>
                  <Input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Variable Cell</label>
                  <Input
                    value={inputCell}
                    onChange={(e) => setInputCell(e.target.value)}
                    placeholder="e.g., B1"
                  />
                </div>
              </>
            )}
            
            {analysisType === 'data-table' && (
              <div>
                <label className="text-sm font-medium">Input Cell</label>
                <Input
                  value={inputCell}
                  onChange={(e) => setInputCell(e.target.value)}
                  placeholder="e.g., B1"
                />
              </div>
            )}
            
            <Button onClick={runAnalysis} className="w-full">
              Run {analysisType.replace('-', ' ')} Analysis
            </Button>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium">Advanced Features:</h4>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Monte Carlo Simulation</li>
                <li>Sensitivity Analysis</li>
                <li>Tornado Charts</li>
                <li>Risk Analysis</li>
                <li>Optimization with Solver</li>
              </ul>
            </div>
            
            <Button variant="outline" className="w-full" disabled>
              Coming Soon: Advanced Analytics
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WhatIfAnalysis;
