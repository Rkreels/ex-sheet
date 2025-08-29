import { Cell } from "../types/sheet";

export function generateSalesPerformanceTemplate(): Record<string, Cell> {
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

  // HR Department Analytics (A17:L35)
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

  return demoData;
}