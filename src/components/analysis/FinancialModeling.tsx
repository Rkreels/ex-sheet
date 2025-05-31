
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet } from '../../types/sheet';

interface FinancialModelingProps {
  activeSheet: Sheet;
  onUpdateSheet: (sheetId: string, updates: Partial<Sheet>) => void;
}

const FinancialModeling: React.FC<FinancialModelingProps> = ({ activeSheet, onUpdateSheet }) => {
  const [assumptions, setAssumptions] = useState({
    revenueGrowth: 0.15,
    costOfGoodsSold: 0.65,
    operatingExpenses: 0.20,
    taxRate: 0.25,
    discountRate: 0.10,
    terminalGrowthRate: 0.03
  });

  const generateIncomeStatement = () => {
    const years = 5;
    const incomeStatementData: Record<string, any> = {};
    
    // Base year revenue (example)
    let baseRevenue = 1000000;
    
    for (let year = 1; year <= years; year++) {
      const revenue = baseRevenue * Math.pow(1 + assumptions.revenueGrowth, year);
      const cogs = revenue * assumptions.costOfGoodsSold;
      const grossProfit = revenue - cogs;
      const opex = revenue * assumptions.operatingExpenses;
      const ebit = grossProfit - opex;
      const tax = ebit * assumptions.taxRate;
      const netIncome = ebit - tax;
      
      incomeStatementData[`A${year + 10}`] = { value: `Year ${year}` };
      incomeStatementData[`B${year + 10}`] = { value: revenue.toFixed(0) };
      incomeStatementData[`C${year + 10}`] = { value: cogs.toFixed(0) };
      incomeStatementData[`D${year + 10}`] = { value: grossProfit.toFixed(0) };
      incomeStatementData[`E${year + 10}`] = { value: opex.toFixed(0) };
      incomeStatementData[`F${year + 10}`] = { value: ebit.toFixed(0) };
      incomeStatementData[`G${year + 10}`] = { value: tax.toFixed(0) };
      incomeStatementData[`H${year + 10}`] = { value: netIncome.toFixed(0) };
    }
    
    // Headers
    incomeStatementData['A10'] = { value: 'Period' };
    incomeStatementData['B10'] = { value: 'Revenue' };
    incomeStatementData['C10'] = { value: 'COGS' };
    incomeStatementData['D10'] = { value: 'Gross Profit' };
    incomeStatementData['E10'] = { value: 'OpEx' };
    incomeStatementData['F10'] = { value: 'EBIT' };
    incomeStatementData['G10'] = { value: 'Tax' };
    incomeStatementData['H10'] = { value: 'Net Income' };
    
    onUpdateSheet(activeSheet.id, {
      cells: { ...activeSheet.cells, ...incomeStatementData }
    });
  };

  const generateBalanceSheet = () => {
    const balanceSheetData: Record<string, any> = {};
    
    // Sample balance sheet structure
    const balanceSheetItems = [
      'Assets', 'Current Assets', 'Cash', 'Accounts Receivable', 'Inventory',
      'Fixed Assets', 'PP&E', 'Total Assets', '',
      'Liabilities', 'Current Liabilities', 'Accounts Payable', 'Short-term Debt',
      'Long-term Debt', 'Total Liabilities', '',
      'Equity', 'Share Capital', 'Retained Earnings', 'Total Equity'
    ];
    
    balanceSheetItems.forEach((item, index) => {
      balanceSheetData[`A${20 + index}`] = { value: item };
      if (item && !['Assets', 'Liabilities', 'Equity', ''].includes(item)) {
        balanceSheetData[`B${20 + index}`] = { value: '0' };
      }
    });
    
    onUpdateSheet(activeSheet.id, {
      cells: { ...activeSheet.cells, ...balanceSheetData }
    });
  };

  const generateCashFlowStatement = () => {
    const cashFlowData: Record<string, any> = {};
    
    const cashFlowItems = [
      'Operating Cash Flow', 'Net Income', 'Depreciation', 'Working Capital Changes',
      'Net Operating Cash Flow', '',
      'Investing Cash Flow', 'CapEx', 'Net Investing Cash Flow', '',
      'Financing Cash Flow', 'Debt Issuance', 'Debt Repayment', 'Dividends',
      'Net Financing Cash Flow', '',
      'Net Change in Cash', 'Beginning Cash', 'Ending Cash'
    ];
    
    cashFlowItems.forEach((item, index) => {
      cashFlowData[`A${50 + index}`] = { value: item };
      if (item && !['', 'Operating Cash Flow', 'Investing Cash Flow', 'Financing Cash Flow'].includes(item)) {
        cashFlowData[`B${50 + index}`] = { value: '0' };
      }
    });
    
    onUpdateSheet(activeSheet.id, {
      cells: { ...activeSheet.cells, ...cashFlowData }
    });
  };

  const calculateDCF = () => {
    // Simple DCF calculation
    const years = 5;
    const terminalValue = 1000000 * Math.pow(1 + assumptions.revenueGrowth, years) * (1 + assumptions.terminalGrowthRate) / (assumptions.discountRate - assumptions.terminalGrowthRate);
    
    let presentValue = 0;
    for (let year = 1; year <= years; year++) {
      const cashFlow = 100000 * Math.pow(1 + assumptions.revenueGrowth, year); // Simplified
      presentValue += cashFlow / Math.pow(1 + assumptions.discountRate, year);
    }
    
    const terminalPV = terminalValue / Math.pow(1 + assumptions.discountRate, years);
    const totalValue = presentValue + terminalPV;
    
    const dcfData: Record<string, any> = {
      'K10': { value: 'DCF Valuation' },
      'K11': { value: 'Present Value of Cash Flows' },
      'L11': { value: presentValue.toFixed(0) },
      'K12': { value: 'Terminal Value (PV)' },
      'L12': { value: terminalPV.toFixed(0) },
      'K13': { value: 'Total Enterprise Value' },
      'L13': { value: totalValue.toFixed(0) }
    };
    
    onUpdateSheet(activeSheet.id, {
      cells: { ...activeSheet.cells, ...dcfData }
    });
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Financial Modeling Suite</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="assumptions">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
              <TabsTrigger value="statements">3-Statement Model</TabsTrigger>
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
              <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assumptions" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revenueGrowth">Revenue Growth Rate</Label>
                  <Input
                    id="revenueGrowth"
                    type="number"
                    step="0.01"
                    value={assumptions.revenueGrowth}
                    onChange={(e) => setAssumptions({...assumptions, revenueGrowth: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="cogs">Cost of Goods Sold %</Label>
                  <Input
                    id="cogs"
                    type="number"
                    step="0.01"
                    value={assumptions.costOfGoodsSold}
                    onChange={(e) => setAssumptions({...assumptions, costOfGoodsSold: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="opex">Operating Expenses %</Label>
                  <Input
                    id="opex"
                    type="number"
                    step="0.01"
                    value={assumptions.operatingExpenses}
                    onChange={(e) => setAssumptions({...assumptions, operatingExpenses: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="taxRate">Tax Rate</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={assumptions.taxRate}
                    onChange={(e) => setAssumptions({...assumptions, taxRate: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="discountRate">Discount Rate</Label>
                  <Input
                    id="discountRate"
                    type="number"
                    step="0.01"
                    value={assumptions.discountRate}
                    onChange={(e) => setAssumptions({...assumptions, discountRate: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="terminalGrowth">Terminal Growth Rate</Label>
                  <Input
                    id="terminalGrowth"
                    type="number"
                    step="0.01"
                    value={assumptions.terminalGrowthRate}
                    onChange={(e) => setAssumptions({...assumptions, terminalGrowthRate: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="statements" className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={generateIncomeStatement}>Generate Income Statement</Button>
                <Button onClick={generateBalanceSheet}>Generate Balance Sheet</Button>
                <Button onClick={generateCashFlowStatement}>Generate Cash Flow</Button>
              </div>
              <p className="text-sm text-gray-600">
                Click the buttons above to generate the three financial statements in your spreadsheet.
              </p>
            </TabsContent>
            
            <TabsContent value="valuation" className="space-y-4">
              <Button onClick={calculateDCF}>Calculate DCF Valuation</Button>
              <p className="text-sm text-gray-600">
                This will generate a discounted cash flow analysis based on your assumptions.
              </p>
            </TabsContent>
            
            <TabsContent value="scenarios" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Scenario Analysis</h4>
                <p className="text-sm text-gray-600">
                  Create different scenarios by adjusting key assumptions and comparing outcomes.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-3">
                    <h5 className="font-medium text-green-600">Bull Case</h5>
                    <p className="text-xs">Revenue Growth: 25%</p>
                    <p className="text-xs">COGS: 60%</p>
                  </Card>
                  <Card className="p-3">
                    <h5 className="font-medium text-blue-600">Base Case</h5>
                    <p className="text-xs">Revenue Growth: 15%</p>
                    <p className="text-xs">COGS: 65%</p>
                  </Card>
                  <Card className="p-3">
                    <h5 className="font-medium text-red-600">Bear Case</h5>
                    <p className="text-xs">Revenue Growth: 5%</p>
                    <p className="text-xs">COGS: 70%</p>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialModeling;
