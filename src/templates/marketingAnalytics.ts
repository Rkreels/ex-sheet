import { Cell } from "../types/sheet";

export function generateMarketingAnalyticsTemplate(): Record<string, Cell> {
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

  // Additional Analytics
  demoData['A14'] = { value: 'ADVANCED METRICS', format: { bold: true, fontSize: '14px', backgroundColor: '#F3E5F5' } };
  demoData['A15'] = { value: 'Avg CTR:', format: { bold: true } };
  demoData['B15'] = { value: '=AVERAGE(E2:E6)', format: { bold: true, alignment: 'right' } };
  demoData['A16'] = { value: 'Avg CVR:', format: { bold: true } };
  demoData['B16'] = { value: '=AVERAGE(G2:G6)', format: { bold: true, alignment: 'right' } };
  demoData['A17'] = { value: 'Total Conversions:', format: { bold: true } };
  demoData['B17'] = { value: '=SUM(F2:F6)', format: { bold: true, alignment: 'right' } };

  return demoData;
}