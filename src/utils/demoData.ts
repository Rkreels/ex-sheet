
import { Cell } from "../types/sheet";

export function generateDemoData(): Record<string, Cell> {
  const demoData: Record<string, Cell> = {};
  
  // Dataset 1: Sales Performance Dashboard (A1:K30)
  const salesHeaders = ["Region", "Quarter", "Product", "Sales Rep", "Units Sold", "Unit Price", "Total Revenue", "Commission Rate", "Commission", "Target", "Achievement %"];
  salesHeaders.forEach((header, index) => {
    demoData[`${String.fromCharCode(65 + index)}1`] = {
      value: header,
      format: { bold: true, alignment: 'center', backgroundColor: '#4A90E2', color: '#FFFFFF' }
    };
  });

  const salesData = [
    ["North", "Q1", "Laptop Pro", "John Smith", "150", "1200", "=E2*F2", "0.08", "=G2*H2", "180000", "=G2/J2"],
    ["South", "Q1", "Tablet X", "Sarah Johnson", "200", "800", "=E3*F3", "0.06", "=G3*H3", "160000", "=G3/J3"],
    ["East", "Q1", "Phone Elite", "Mike Chen", "300", "900", "=E4*F4", "0.07", "=G4*H4", "270000", "=G4/J4"],
    ["West", "Q1", "Watch Smart", "Lisa Brown", "100", "400", "=E5*F5", "0.05", "=G5*H5", "40000", "=G5/J5"],
    ["North", "Q2", "Laptop Pro", "John Smith", "180", "1200", "=E6*F6", "0.08", "=G6*H6", "216000", "=G6/J6"],
    ["South", "Q2", "Tablet X", "Sarah Johnson", "250", "800", "=E7*F7", "0.06", "=G7*H7", "200000", "=G7/J7"],
    ["East", "Q2", "Phone Elite", "Mike Chen", "320", "900", "=E8*F8", "0.07", "=G8*H8", "288000", "=G8/J8"],
    ["West", "Q2", "Watch Smart", "Lisa Brown", "120", "400", "=E9*F9", "0.05", "=G9*H9", "48000", "=G9/J9"],
  ];

  salesData.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`;
      demoData[cellId] = {
        value: value,
        format: { alignment: colIndex >= 4 ? 'right' : 'left' }
      };
    });
  });

  // Sales Summary with advanced formulas
  demoData['A12'] = { value: 'SALES SUMMARY', format: { bold: true, fontSize: '14px', backgroundColor: '#E8F4FD' } };
  demoData['A13'] = { value: 'Total Revenue:', format: { bold: true } };
  demoData['B13'] = { value: '=SUM(G2:G9)', format: { bold: true, alignment: 'right' } };
  demoData['A14'] = { value: 'Avg Commission:', format: { bold: true } };
  demoData['B14'] = { value: '=AVERAGE(I2:I9)', format: { bold: true, alignment: 'right' } };
  demoData['A15'] = { value: 'Top Performer:', format: { bold: true } };
  demoData['B15'] = { value: '=INDEX(D2:D9,MATCH(MAX(G2:G9),G2:G9,0))', format: { bold: true, alignment: 'right' } };

  // Dataset 2: HR Department Analytics (A17:L35)
  const hrHeaders = ["Employee ID", "Name", "Department", "Position", "Hire Date", "Salary", "Bonus", "Total Comp", "Performance", "Training Hours", "Sick Days", "Productivity"];
  hrHeaders.forEach((header, index) => {
    demoData[`${String.fromCharCode(65 + index)}17`] = {
      value: header,
      format: { bold: true, alignment: 'center', backgroundColor: '#2ECC71', color: '#FFFFFF' }
    };
  });

  const hrData = [
    ["EMP001", "Alice Williams", "Engineering", "Senior Dev", "2022-01-15", "95000", "=F18*0.15", "=F18+G18", "4.5", "40", "3", "=IF(I18>=4,\"High\",IF(I18>=3,\"Medium\",\"Low\"))"],
    ["EMP002", "Bob Davis", "Marketing", "Manager", "2021-03-20", "75000", "=F19*0.12", "=F19+G19", "4.2", "35", "5", "=IF(I19>=4,\"High\",IF(I19>=3,\"Medium\",\"Low\"))"],
    ["EMP003", "Carol Martinez", "Finance", "Analyst", "2023-06-10", "65000", "=F20*0.08", "=F20+G20", "3.8", "25", "2", "=IF(I20>=4,\"High\",IF(I20>=3,\"Medium\",\"Low\"))"],
    ["EMP004", "David Lee", "Engineering", "Junior Dev", "2023-09-01", "55000", "=F21*0.10", "=F21+G21", "3.5", "50", "1", "=IF(I21>=4,\"High\",IF(I21>=3,\"Medium\",\"Low\"))"],
    ["EMP005", "Eva Garcia", "HR", "Specialist", "2022-11-12", "60000", "=F22*0.08", "=F22+G22", "4.0", "30", "4", "=IF(I22>=4,\"High\",IF(I22>=3,\"Medium\",\"Low\"))"],
  ];

  hrData.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 18}`;
      demoData[cellId] = {
        value: value,
        format: { alignment: colIndex >= 5 && colIndex <= 7 ? 'right' : 'left' }
      };
    });
  });

  // HR Analytics
  demoData['A25'] = { value: 'HR ANALYTICS', format: { bold: true, fontSize: '14px', backgroundColor: '#D5F4E6' } };
  demoData['A26'] = { value: 'Avg Salary:', format: { bold: true } };
  demoData['B26'] = { value: '=AVERAGE(F18:F22)', format: { bold: true, alignment: 'right' } };
  demoData['A27'] = { value: 'Total Training Hours:', format: { bold: true } };
  demoData['B27'] = { value: '=SUM(J18:J22)', format: { bold: true, alignment: 'right' } };
  demoData['A28'] = { value: 'High Performers:', format: { bold: true } };
  demoData['B28'] = { value: '=COUNTIF(L18:L22,"High")', format: { bold: true, alignment: 'right' } };

  // Dataset 3: Financial P&L Statement (N1:S25)
  const financeHeaders = ["Account", "Q1", "Q2", "Q3", "Q4", "Total"];
  financeHeaders.forEach((header, index) => {
    demoData[`${String.fromCharCode(78 + index)}1`] = {
      value: header,
      format: { bold: true, alignment: 'center', backgroundColor: '#E74C3C', color: '#FFFFFF' }
    };
  });

  const financeData = [
    ["REVENUE", "", "", "", "", ""],
    ["Product Sales", "250000", "280000", "320000", "350000", "=SUM(O3:R3)"],
    ["Service Revenue", "80000", "90000", "100000", "110000", "=SUM(O4:R4)"],
    ["Total Revenue", "=O3+O4", "=P3+P4", "=Q3+Q4", "=R3+R4", "=SUM(O5:R5)"],
    ["", "", "", "", "", ""],
    ["EXPENSES", "", "", "", "", ""],
    ["Cost of Goods", "120000", "135000", "150000", "165000", "=SUM(O8:R8)"],
    ["Salaries", "60000", "62000", "64000", "66000", "=SUM(O9:R9)"],
    ["Marketing", "25000", "30000", "35000", "40000", "=SUM(O10:R10)"],
    ["Operations", "15000", "16000", "17000", "18000", "=SUM(O11:R11)"],
    ["Total Expenses", "=SUM(O8:O11)", "=SUM(P8:P11)", "=SUM(Q8:Q11)", "=SUM(R8:R11)", "=SUM(O12:R12)"],
    ["", "", "", "", "", ""],
    ["NET INCOME", "=O5-O12", "=P5-P12", "=Q5-Q12", "=R5-R12", "=SUM(O14:R14)"],
    ["", "", "", "", "", ""],
    ["RATIOS", "", "", "", "", ""],
    ["Gross Margin %", "=(O5-O8)/O5", "=(P5-P8)/P5", "=(Q5-Q8)/Q5", "=(R5-R8)/R5", "=(S5-S8)/S5"],
    ["Net Margin %", "=O14/O5", "=P14/P5", "=Q14/Q5", "=R14/R5", "=S14/S5"],
  ];

  financeData.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cellId = `${String.fromCharCode(78 + colIndex)}${rowIndex + 2}`;
      demoData[cellId] = {
        value: value,
        format: { 
          alignment: colIndex === 0 ? 'left' : 'right',
          bold: [0, 3, 5, 12, 14, 15, 16].includes(rowIndex),
          backgroundColor: [0, 5, 14].includes(rowIndex) ? '#FCE4EC' : undefined
        }
      };
    });
  });

  // Dataset 4: Inventory Management (A30:J50)
  const inventoryHeaders = ["SKU", "Product Name", "Category", "Current Stock", "Reorder Level", "Unit Cost", "Selling Price", "Margin", "Days in Stock", "Reorder Status"];
  inventoryHeaders.forEach((header, index) => {
    demoData[`${String.fromCharCode(65 + index)}30`] = {
      value: header,
      format: { bold: true, alignment: 'center', backgroundColor: '#9C27B0', color: '#FFFFFF' }
    };
  });

  const inventoryData = [
    ["SKU001", "Wireless Mouse", "Electronics", "45", "20", "15", "35", "=G31-F31", "=RANDBETWEEN(1,90)", "=IF(D31<=E31,\"REORDER\",\"OK\")"],
    ["SKU002", "Bluetooth Speaker", "Electronics", "12", "15", "25", "60", "=G32-F32", "=RANDBETWEEN(1,90)", "=IF(D32<=E32,\"REORDER\",\"OK\")"],
    ["SKU003", "USB Cable", "Accessories", "150", "50", "5", "15", "=G33-F33", "=RANDBETWEEN(1,90)", "=IF(D33<=E33,\"REORDER\",\"OK\")"],
    ["SKU004", "Laptop Stand", "Accessories", "25", "10", "20", "45", "=G34-F34", "=RANDBETWEEN(1,90)", "=IF(D34<=E34,\"REORDER\",\"OK\")"],
    ["SKU005", "Webcam HD", "Electronics", "8", "12", "30", "75", "=G35-F35", "=RANDBETWEEN(1,90)", "=IF(D35<=E35,\"REORDER\",\"OK\")"],
    ["SKU006", "Power Bank", "Electronics", "35", "20", "18", "40", "=G36-F36", "=RANDBETWEEN(1,90)", "=IF(D36<=E36,\"REORDER\",\"OK\")"],
    ["SKU007", "Phone Case", "Accessories", "80", "30", "8", "20", "=G37-F37", "=RANDBETWEEN(1,90)", "=IF(D37<=E37,\"REORDER\",\"OK\")"],
  ];

  inventoryData.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 31}`;
      demoData[cellId] = {
        value: value,
        format: { alignment: colIndex >= 3 ? 'right' : 'left' }
      };
    });
  });

  // Inventory Summary
  demoData['A40'] = { value: 'INVENTORY SUMMARY', format: { bold: true, fontSize: '14px', backgroundColor: '#F3E5F5' } };
  demoData['A41'] = { value: 'Total Items:', format: { bold: true } };
  demoData['B41'] = { value: '=COUNTA(A31:A37)', format: { bold: true, alignment: 'right' } };
  demoData['A42'] = { value: 'Items to Reorder:', format: { bold: true } };
  demoData['B42'] = { value: '=COUNTIF(J31:J37,"REORDER")', format: { bold: true, alignment: 'right' } };
  demoData['A43'] = { value: 'Total Stock Value:', format: { bold: true } };
  demoData['B43'] = { value: '=SUMPRODUCT(D31:D37,F31:F37)', format: { bold: true, alignment: 'right' } };

  // Dataset 5: Project Management Dashboard (L30:T50)
  const projectHeaders = ["Project ID", "Project Name", "Start Date", "End Date", "Duration", "Completion %", "Budget", "Spent", "Remaining"];
  projectHeaders.forEach((header, index) => {
    demoData[`${String.fromCharCode(76 + index)}30`] = {
      value: header,
      format: { bold: true, alignment: 'center', backgroundColor: '#FF9800', color: '#FFFFFF' }
    };
  });

  const projectData = [
    ["PRJ001", "Website Redesign", "2024-01-01", "2024-03-31", "=N31-M31", "85", "50000", "42500", "=Q31-R31"],
    ["PRJ002", "Mobile App", "2024-02-15", "2024-06-30", "=N32-M32", "60", "75000", "45000", "=Q32-R32"],
    ["PRJ003", "Database Migration", "2024-01-15", "2024-04-15", "=N33-M33", "95", "30000", "28500", "=Q33-R33"],
    ["PRJ004", "Security Audit", "2024-03-01", "2024-05-01", "=N34-M34", "40", "25000", "10000", "=Q34-R34"],
    ["PRJ005", "Training Program", "2024-02-01", "2024-07-31", "=N35-M35", "25", "40000", "10000", "=Q35-R35"],
  ];

  projectData.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cellId = `${String.fromCharCode(76 + colIndex)}${rowIndex + 31}`;
      demoData[cellId] = {
        value: value,
        format: { alignment: colIndex >= 4 ? 'right' : 'left' }
      };
    });
  });

  // Project Summary
  demoData['L38'] = { value: 'PROJECT SUMMARY', format: { bold: true, fontSize: '14px', backgroundColor: '#FFF3E0' } };
  demoData['L39'] = { value: 'Total Projects:', format: { bold: true } };
  demoData['M39'] = { value: '=COUNTA(L31:L35)', format: { bold: true, alignment: 'right' } };
  demoData['L40'] = { value: 'Avg Completion:', format: { bold: true } };
  demoData['M40'] = { value: '=AVERAGE(P31:P35)', format: { bold: true, alignment: 'right' } };
  demoData['L41'] = { value: 'Total Budget:', format: { bold: true } };
  demoData['M41'] = { value: '=SUM(Q31:Q35)', format: { bold: true, alignment: 'right' } };
  demoData['L42'] = { value: 'Total Spent:', format: { bold: true } };
  demoData['M42'] = { value: '=SUM(R31:R35)', format: { bold: true, alignment: 'right' } };
  demoData['L43'] = { value: 'Budget Utilization:', format: { bold: true } };
  demoData['M43'] = { value: '=M42/M41', format: { bold: true, alignment: 'right' } };

  return demoData;
}

// Generate multiple demo datasets for different sheets
export function generateMultiSheetDemo(): Record<string, Record<string, Cell>> {
  return {
    'Sheet1': generateDemoData(),
    'Sheet2': generateFinancialModelDemo(),
    'Sheet3': generateMarketingAnalyticsDemo()
  };
}

export function generateFinancialModelDemo(): Record<string, Cell> {
  const demoData: Record<string, Cell> = {};
  
  // Financial Model with DCF Analysis
  const headers = ["Year", "Revenue", "Growth %", "EBITDA", "EBITDA %", "CAPEX", "FCF", "Discount Rate", "PV Factor", "PV of FCF"];
  headers.forEach((header, index) => {
    demoData[`${String.fromCharCode(65 + index)}1`] = {
      value: header,
      format: { bold: true, alignment: 'center', backgroundColor: '#1565C0', color: '#FFFFFF' }
    };
  });

  const financialData = [
    ["2024", "1000000", "15%", "=B2*0.25", "25%", "50000", "=D2-F2", "10%", "=1/(1+H2)^(A2-2023)", "=G2*I2"],
    ["2025", "=B2*(1+C2)", "12%", "=B3*0.26", "26%", "55000", "=D3-F3", "10%", "=1/(1+H3)^(A3-2023)", "=G3*I3"],
    ["2026", "=B3*(1+C3)", "10%", "=B4*0.27", "27%", "60000", "=D4-F4", "10%", "=1/(1+H4)^(A4-2023)", "=G4*I4"],
    ["2027", "=B4*(1+C4)", "8%", "=B5*0.28", "28%", "65000", "=D5-F5", "10%", "=1/(1+H5)^(A5-2023)", "=G5*I5"],
    ["2028", "=B5*(1+C5)", "6%", "=B6*0.29", "29%", "70000", "=D6-F6", "10%", "=1/(1+H6)^(A6-2023)", "=G6*I6"],
  ];

  financialData.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`;
      demoData[cellId] = {
        value: value,
        format: { alignment: colIndex >= 1 ? 'right' : 'center' }
      };
    });
  });

  // Valuation Summary
  demoData['A8'] = { value: 'VALUATION SUMMARY', format: { bold: true, fontSize: '14px', backgroundColor: '#E3F2FD' } };
  demoData['A9'] = { value: 'Sum of PV:', format: { bold: true } };
  demoData['B9'] = { value: '=SUM(J2:J6)', format: { bold: true, alignment: 'right' } };
  demoData['A10'] = { value: 'Terminal Value:', format: { bold: true } };
  demoData['B10'] = { value: '=G6*1.02/0.08', format: { bold: true, alignment: 'right' } };
  demoData['A11'] = { value: 'Enterprise Value:', format: { bold: true } };
  demoData['B11'] = { value: '=B9+B10', format: { bold: true, alignment: 'right' } };

  return demoData;
}

export function generateMarketingAnalyticsDemo(): Record<string, Cell> {
  const demoData: Record<string, Cell> = {};
  
  // Marketing Campaign Analytics
  const headers = ["Campaign", "Channel", "Impressions", "Clicks", "CTR", "Conversions", "CVR", "Cost", "CPC", "CPA", "Revenue", "ROAS"];
  headers.forEach((header, index) => {
    demoData[`${String.fromCharCode(65 + index)}1`] = {
      value: header,
      format: { bold: true, alignment: 'center', backgroundColor: '#7B1FA2', color: '#FFFFFF' }
    };
  });

  const marketingData = [
    ["Summer Sale", "Google Ads", "50000", "2500", "=D2/C2", "125", "=F2/D2", "5000", "=H2/D2", "=H2/F2", "12500", "=K2/H2"],
    ["Brand Awareness", "Facebook", "75000", "3000", "=D3/C3", "90", "=F3/D3", "3500", "=H3/D3", "=H3/F3", "9000", "=K3/H3"],
    ["Product Launch", "Instagram", "30000", "1800", "=D4/C4", "108", "=F4/D4", "2800", "=H4/D4", "=H4/F4", "16200", "=K4/H4"],
    ["Retargeting", "LinkedIn", "25000", "1250", "=D5/C5", "75", "=F5/D5", "4000", "=H5/D5", "=H5/F5", "11250", "=K5/H5"],
    ["Email Campaign", "Email", "10000", "800", "=D6/C6", "60", "=F6/D6", "500", "=H6/D6", "=H6/F6", "7200", "=K6/H6"],
  ];

  marketingData.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`;
      demoData[cellId] = {
        value: value,
        format: { alignment: colIndex >= 2 ? 'right' : 'left' }
      };
    });
  });

  // Marketing Summary
  demoData['A8'] = { value: 'MARKETING SUMMARY', format: { bold: true, fontSize: '14px', backgroundColor: '#F3E5F5' } };
  demoData['A9'] = { value: 'Total Cost:', format: { bold: true } };
  demoData['B9'] = { value: '=SUM(H2:H6)', format: { bold: true, alignment: 'right' } };
  demoData['A10'] = { value: 'Total Revenue:', format: { bold: true } };
  demoData['B10'] = { value: '=SUM(K2:K6)', format: { bold: true, alignment: 'right' } };
  demoData['A11'] = { value: 'Overall ROAS:', format: { bold: true } };
  demoData['B11'] = { value: '=B10/B9', format: { bold: true, alignment: 'right' } };
  demoData['A12'] = { value: 'Best Performing:', format: { bold: true } };
  demoData['B12'] = { value: '=INDEX(A2:A6,MATCH(MAX(L2:L6),L2:L6,0))', format: { bold: true, alignment: 'right' } };

  return demoData;
}
