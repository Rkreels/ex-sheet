import { Cell } from "../types/sheet";

export function generateFinancialModelTemplate(): Record<string, Cell> {
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

  // Additional Financial Metrics
  demoData['A13'] = { value: 'FINANCIAL RATIOS', format: { bold: true, fontSize: '14px', backgroundColor: '#E3F2FD' } };
  demoData['A14'] = { value: 'IRR:', format: { bold: true } };
  demoData['B14'] = { value: '=IRR(G2:G6)', format: { bold: true, alignment: 'right' } };
  demoData['A15'] = { value: 'NPV @ 10%:', format: { bold: true } };
  demoData['B15'] = { value: '=NPV(0.1,G2:G6)', format: { bold: true, alignment: 'right' } };
  demoData['A16'] = { value: 'Payback Period:', format: { bold: true } };
  demoData['B16'] = { value: '=PAYBACK(G2:G6)', format: { bold: true, alignment: 'right' } };

  return demoData;
}