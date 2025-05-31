
import { Cell } from "../types/sheet";

export function generateDemoData(): Record<string, Cell> {
  const demoData: Record<string, Cell> = {};
  
  // Basic headers like in the Excel image
  const headers = ["Date", "What is it", "How much?", "Category", "Notes"];
  headers.forEach((header, index) => {
    demoData[`${String.fromCharCode(65 + index)}1`] = {
      value: header,
      format: { bold: true, alignment: 'center' }
    };
  });

  // Sample personal expense data
  const expenses = [
    ["2023-01-15", "Groceries", "120.50", "Food", "Weekly shopping"],
    ["2023-01-18", "Electricity Bill", "85.20", "Utilities", "January bill"],
    ["2023-01-20", "Gasoline", "45.75", "Transportation", "Full tank"],
    ["2023-01-25", "Restaurant", "65.30", "Food", "Dinner with friends"],
    ["2023-01-28", "Internet", "59.99", "Utilities", "Monthly subscription"],
    ["2023-02-01", "Rent", "1200.00", "Housing", "February rent"],
    ["2023-02-05", "Groceries", "95.45", "Food", "Weekly shopping"],
    ["2023-02-10", "Movie Tickets", "24.00", "Entertainment", "New release"],
    ["2023-02-15", "Car Insurance", "110.00", "Insurance", "Monthly premium"],
    ["2023-02-20", "Gym Membership", "50.00", "Health", "Monthly fee"]
  ];

  expenses.forEach((expense, rowIndex) => {
    expense.forEach((value, colIndex) => {
      const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 2}`;
      demoData[cellId] = {
        value: value,
        format: {
          alignment: colIndex === 0 || colIndex === 3 || colIndex === 4 ? 'left' : 'right'
        }
      };
    });
  });

  // Add some analysis formulas at the bottom
  demoData['B13'] = { value: 'Total Expenses:', format: { bold: true, alignment: 'right' } };
  demoData['C13'] = { value: '=SUM(C2:C11)', format: { bold: true, alignment: 'right' } };
  
  demoData['B14'] = { value: 'Average Expense:', format: { bold: true, alignment: 'right' } };
  demoData['C14'] = { value: '=AVERAGE(C2:C11)', format: { bold: true, alignment: 'right' } };
  
  demoData['B15'] = { value: 'Highest Expense:', format: { bold: true, alignment: 'right' } };
  demoData['C15'] = { value: '=MAX(C2:C11)', format: { bold: true, alignment: 'right' } };

  // Highlight cells for easier navigation
  demoData['E2'] = { 
    value: expenses[0][4],
    format: { alignment: 'left', bold: true } 
  };

  return demoData;
}
