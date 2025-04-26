
import { Cell } from "../types/sheet";

export function generateDemoData(): Record<string, Cell> {
  const demoData: Record<string, Cell> = {};
  
  // Sales Data
  const headers = ["Product", "Category", "Q1 Sales", "Q2 Sales", "Q3 Sales", "Q4 Sales", "Total"];
  headers.forEach((header, index) => {
    demoData[`${String.fromCharCode(65 + index)}1`] = {
      value: header,
      format: { bold: true, alignment: 'center' }
    };
  });

  const products = [
    ["Laptop", "Electronics", "1200", "1500", "1800", "2100"],
    ["Smartphone", "Electronics", "2500", "2800", "3000", "3500"],
    ["Coffee Maker", "Appliances", "500", "600", "550", "700"],
    ["Headphones", "Electronics", "800", "900", "1000", "1200"],
    ["Tablet", "Electronics", "1500", "1600", "1700", "1900"],
    ["Monitor", "Electronics", "900", "1000", "1100", "1300"],
    ["Keyboard", "Accessories", "300", "350", "400", "450"],
    ["Mouse", "Accessories", "200", "250", "300", "350"],
    ["Printer", "Electronics", "600", "700", "800", "900"],
    ["Speaker", "Electronics", "400", "500", "600", "700"]
  ];

  products.forEach((product, rowIndex) => {
    product.forEach((value, colIndex) => {
      const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`;
      demoData[cellId] = {
        value: value,
        format: {
          alignment: colIndex <= 1 ? 'left' : 'right'
        }
      };
    });

    // Calculate total
    const total = product.slice(2).reduce((sum, val) => sum + parseInt(val), 0);
    const totalCellId = `${String.fromCharCode(65 + 6)}${rowIndex + 2}`;
    demoData[totalCellId] = {
      value: `=SUM(C${rowIndex + 2}:F${rowIndex + 2})`,
      format: { alignment: 'right', bold: true }
    };
  });

  // Add some formulas for analysis
  demoData['A12'] = { value: 'Total Sales:', format: { bold: true } };
  demoData['B12'] = { value: '=SUM(G2:G11)', format: { bold: true, alignment: 'right' } };
  
  demoData['A13'] = { value: 'Average Sales:', format: { bold: true } };
  demoData['B13'] = { value: '=AVERAGE(G2:G11)', format: { bold: true, alignment: 'right' } };

  return demoData;
}

