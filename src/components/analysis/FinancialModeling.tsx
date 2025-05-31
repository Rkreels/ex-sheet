
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Sheet } from '../../types/sheet';
import { toast } from 'sonner';

interface FinancialModelingProps {
  activeSheet: Sheet;
  onUpdateSheet: (sheetId: string, updates: Partial<Sheet>) => void;
}

const FinancialModeling: React.FC<FinancialModelingProps> = ({
  activeSheet,
  onUpdateSheet
}) => {
  const [modelType, setModelType] = useState<'dcf' | 'npv' | 'three-statement'>('dcf');
  const [assumptions, setAssumptions] = useState({
    revenue: 1000000,
    growthRate: 0.05,
    discountRate: 0.10,
    terminalGrowthRate: 0.02,
    capex: 50000,
    workingCapital: 100000,
    taxRate: 0.25,
    years: 5
  });

  const generateDCFModel = () => {
    const newCells = { ...activeSheet.cells };
    
    // Headers
    newCells['A1'] = { value: 'DCF Valuation Model' };
    newCells['A3'] = { value: 'Year' };
    newCells['B3'] = { value: 'Revenue' };
    newCells['C3'] = { value: 'EBITDA' };
    newCells['D3'] = { value: 'EBIT' };
    newCells['E3'] = { value: 'Tax' };
    newCells['F3'] = { value: 'NOPAT' };
    newCells['G3'] = { value: 'FCF' };
    newCells['H3'] = { value: 'PV Factor' };
    newCells['I3'] = { value: 'PV of FCF' };

    // Generate projections
    for (let year = 1; year <= assumptions.years; year++) {
      const row = 3 + year;
      const revenue = assumptions.revenue * Math.pow(1 + assumptions.growthRate, year);
      const ebitda = revenue * 0.3; // 30% EBITDA margin
      const depreciation = assumptions.capex * 0.1; // 10% depreciation
      const ebit = ebitda - depreciation;
      const tax = ebit * assumptions.taxRate;
      const nopat = ebit - tax;
      const fcf = nopat + depreciation - assumptions.capex - (assumptions.workingCapital * assumptions.growthRate);
      const pvFactor = 1 / Math.pow(1 + assumptions.discountRate, year);
      const pvFcf = fcf * pvFactor;

      newCells[`A${row}`] = { value: year.toString() };
      newCells[`B${row}`] = { value: revenue.toFixed(0) };
      newCells[`C${row}`] = { value: ebitda.toFixed(0) };
      newCells[`D${row}`] = { value: ebit.toFixed(0) };
      newCells[`E${row}`] = { value: tax.toFixed(0) };
      newCells[`F${row}`] = { value: nopat.toFixed(0) };
      newCells[`G${row}`] = { value: fcf.toFixed(0) };
      newCells[`H${row}`] = { value: pvFactor.toFixed(4) };
      newCells[`I${row}`] = { value: pvFcf.toFixed(0) };
    }

    // Terminal value calculation
    const terminalRow = 3 + assumptions.years + 2;
    const terminalFCF = parseFloat(newCells[`G${3 + assumptions.years}`]?.value || '0') * (1 + assumptions.terminalGrowthRate);
    const terminalValue = terminalFCF / (assumptions.discountRate - assumptions.terminalGrowthRate);
    const pvTerminalValue = terminalValue / Math.pow(1 + assumptions.discountRate, assumptions.years);

    newCells[`A${terminalRow}`] = { value: 'Terminal Value' };
    newCells[`G${terminalRow}`] = { value: terminalValue.toFixed(0) };
    newCells[`I${terminalRow}`] = { value: pvTerminalValue.toFixed(0) };

    // Sum up enterprise value
    const enterpriseValueRow = terminalRow + 1;
    let totalPV = pvTerminalValue;
    for (let year = 1; year <= assumptions.years; year++) {
      totalPV += parseFloat(newCells[`I${3 + year}`]?.value || '0');
    }

    newCells[`A${enterpriseValueRow}`] = { value: 'Enterprise Value' };
    newCells[`I${enterpriseValueRow}`] = { value: totalPV.toFixed(0) };

    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("DCF model generated successfully!");
  };

  const generateThreeStatementModel = () => {
    const newCells = { ...activeSheet.cells };
    
    // Income Statement
    newCells['A1'] = { value: 'Three-Statement Financial Model' };
    newCells['A3'] = { value: 'INCOME STATEMENT' };
    newCells['A4'] = { value: 'Revenue' };
    newCells['A5'] = { value: 'COGS' };
    newCells['A6'] = { value: 'Gross Profit' };
    newCells['A7'] = { value: 'Operating Expenses' };
    newCells['A8'] = { value: 'EBITDA' };
    newCells['A9'] = { value: 'Depreciation' };
    newCells['A10'] = { value: 'EBIT' };
    newCells['A11'] = { value: 'Interest Expense' };
    newCells['A12'] = { value: 'EBT' };
    newCells['A13'] = { value: 'Tax' };
    newCells['A14'] = { value: 'Net Income' };

    // Balance Sheet
    newCells['A16'] = { value: 'BALANCE SHEET' };
    newCells['A17'] = { value: 'Cash' };
    newCells['A18'] = { value: 'Accounts Receivable' };
    newCells['A19'] = { value: 'Inventory' };
    newCells['A20'] = { value: 'Total Current Assets' };
    newCells['A21'] = { value: 'PP&E' };
    newCells['A22'] = { value: 'Total Assets' };
    newCells['A24'] = { value: 'Accounts Payable' };
    newCells['A25'] = { value: 'Short-term Debt' };
    newCells['A26'] = { value: 'Total Current Liabilities' };
    newCells['A27'] = { value: 'Long-term Debt' };
    newCells['A28'] = { value: 'Total Liabilities' };
    newCells['A29'] = { value: 'Shareholders Equity' };

    // Cash Flow Statement
    newCells['A31'] = { value: 'CASH FLOW STATEMENT' };
    newCells['A32'] = { value: 'Net Income' };
    newCells['A33'] = { value: 'Depreciation' };
    newCells['A34'] = { value: 'Change in Working Capital' };
    newCells['A35'] = { value: 'Operating Cash Flow' };
    newCells['A36'] = { value: 'Capital Expenditures' };
    newCells['A37'] = { value: 'Investing Cash Flow' };
    newCells['A38'] = { value: 'Debt Issuance' };
    newCells['A39'] = { value: 'Financing Cash Flow' };
    newCells['A40'] = { value: 'Net Change in Cash' };

    // Generate 3 years of projections
    for (let year = 0; year < 3; year++) {
      const col = String.fromCharCode(66 + year); // B, C, D
      const revenue = assumptions.revenue * Math.pow(1 + assumptions.growthRate, year);
      const cogs = revenue * 0.6;
      const grossProfit = revenue - cogs;
      const opex = revenue * 0.2;
      const ebitda = grossProfit - opex;
      const depreciation = 50000;
      const ebit = ebitda - depreciation;
      const interest = 20000;
      const ebt = ebit - interest;
      const tax = ebt * assumptions.taxRate;
      const netIncome = ebt - tax;

      // Income Statement
      newCells[`${col}4`] = { value: revenue.toFixed(0) };
      newCells[`${col}5`] = { value: cogs.toFixed(0) };
      newCells[`${col}6`] = { value: grossProfit.toFixed(0) };
      newCells[`${col}7`] = { value: opex.toFixed(0) };
      newCells[`${col}8`] = { value: ebitda.toFixed(0) };
      newCells[`${col}9`] = { value: depreciation.toFixed(0) };
      newCells[`${col}10`] = { value: ebit.toFixed(0) };
      newCells[`${col}11`] = { value: interest.toFixed(0) };
      newCells[`${col}12`] = { value: ebt.toFixed(0) };
      newCells[`${col}13`] = { value: tax.toFixed(0) };
      newCells[`${col}14`] = { value: netIncome.toFixed(0) };

      // Balance Sheet (simplified)
      const cash = 100000 + netIncome;
      const ar = revenue * 0.1;
      const inventory = revenue * 0.15;
      const currentAssets = cash + ar + inventory;
      const ppe = 500000 + (year * 50000);
      const totalAssets = currentAssets + ppe;

      newCells[`${col}17`] = { value: cash.toFixed(0) };
      newCells[`${col}18`] = { value: ar.toFixed(0) };
      newCells[`${col}19`] = { value: inventory.toFixed(0) };
      newCells[`${col}20`] = { value: currentAssets.toFixed(0) };
      newCells[`${col}21`] = { value: ppe.toFixed(0) };
      newCells[`${col}22`] = { value: totalAssets.toFixed(0) };

      const ap = revenue * 0.08;
      const shortDebt = 50000;
      const currentLiab = ap + shortDebt;
      const longDebt = 300000;
      const totalLiab = currentLiab + longDebt;
      const equity = totalAssets - totalLiab;

      newCells[`${col}24`] = { value: ap.toFixed(0) };
      newCells[`${col}25`] = { value: shortDebt.toFixed(0) };
      newCells[`${col}26`] = { value: currentLiab.toFixed(0) };
      newCells[`${col}27`] = { value: longDebt.toFixed(0) };
      newCells[`${col}28`] = { value: totalLiab.toFixed(0) };
      newCells[`${col}29`] = { value: equity.toFixed(0) };

      // Cash Flow Statement
      const workingCapitalChange = -10000;
      const ocf = netIncome + depreciation + workingCapitalChange;
      const capex = -50000;
      const icf = capex;
      const debtIssuance = 0;
      const fcf = debtIssuance;
      const netCashChange = ocf + icf + fcf;

      newCells[`${col}32`] = { value: netIncome.toFixed(0) };
      newCells[`${col}33`] = { value: depreciation.toFixed(0) };
      newCells[`${col}34`] = { value: workingCapitalChange.toFixed(0) };
      newCells[`${col}35`] = { value: ocf.toFixed(0) };
      newCells[`${col}36`] = { value: capex.toFixed(0) };
      newCells[`${col}37`] = { value: icf.toFixed(0) };
      newCells[`${col}38`] = { value: debtIssuance.toFixed(0) };
      newCells[`${col}39`] = { value: fcf.toFixed(0) };
      newCells[`${col}40`] = { value: netCashChange.toFixed(0) };
    }

    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("Three-statement model generated successfully!");
  };

  const generateNPVAnalysis = () => {
    const newCells = { ...activeSheet.cells };
    
    newCells['A1'] = { value: 'NPV Analysis' };
    newCells['A3'] = { value: 'Year' };
    newCells['B3'] = { value: 'Cash Flow' };
    newCells['C3'] = { value: 'Discount Factor' };
    newCells['D3'] = { value: 'Present Value' };

    let npv = -assumptions.revenue; // Initial investment
    
    for (let year = 1; year <= assumptions.years; year++) {
      const row = 3 + year;
      const cashFlow = assumptions.revenue * assumptions.growthRate * year;
      const discountFactor = 1 / Math.pow(1 + assumptions.discountRate, year);
      const presentValue = cashFlow * discountFactor;
      npv += presentValue;

      newCells[`A${row}`] = { value: year.toString() };
      newCells[`B${row}`] = { value: cashFlow.toFixed(0) };
      newCells[`C${row}`] = { value: discountFactor.toFixed(4) };
      newCells[`D${row}`] = { value: presentValue.toFixed(0) };
    }

    const npvRow = 3 + assumptions.years + 2;
    newCells[`A${npvRow}`] = { value: 'Net Present Value' };
    newCells[`D${npvRow}`] = { value: npv.toFixed(0) };

    // IRR calculation (simplified)
    const irr = assumptions.discountRate + 0.05; // Placeholder
    newCells[`A${npvRow + 1}`] = { value: 'Internal Rate of Return' };
    newCells[`D${npvRow + 1}`] = { value: (irr * 100).toFixed(2) + '%' };

    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("NPV analysis generated successfully!");
  };

  const generateModel = () => {
    switch (modelType) {
      case 'dcf':
        generateDCFModel();
        break;
      case 'three-statement':
        generateThreeStatementModel();
        break;
      case 'npv':
        generateNPVAnalysis();
        break;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Financial Modeling Suite</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="model" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="model">Model Selection</TabsTrigger>
              <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="model" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Model Type</label>
                <Select value={modelType} onValueChange={(value: any) => setModelType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dcf">DCF Valuation Model</SelectItem>
                    <SelectItem value="three-statement">Three-Statement Model</SelectItem>
                    <SelectItem value="npv">NPV Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={generateModel} className="w-full">
                Generate {modelType.toUpperCase()} Model
              </Button>
            </TabsContent>
            
            <TabsContent value="assumptions" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Initial Revenue</label>
                  <Input
                    type="number"
                    value={assumptions.revenue}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, revenue: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Growth Rate (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={assumptions.growthRate * 100}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, growthRate: (parseFloat(e.target.value) || 0) / 100 }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Discount Rate (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={assumptions.discountRate * 100}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, discountRate: (parseFloat(e.target.value) || 0) / 100 }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Terminal Growth Rate (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={assumptions.terminalGrowthRate * 100}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, terminalGrowthRate: (parseFloat(e.target.value) || 0) / 100 }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Annual CapEx</label>
                  <Input
                    type="number"
                    value={assumptions.capex}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, capex: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Tax Rate (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={assumptions.taxRate * 100}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, taxRate: (parseFloat(e.target.value) || 0) / 100 }))}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Projection Years</label>
                  <Input
                    type="number"
                    value={assumptions.years}
                    onChange={(e) => setAssumptions(prev => ({ ...prev, years: parseInt(e.target.value) || 5 }))}
                  />
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
