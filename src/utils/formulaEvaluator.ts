
import { Cell } from '../types/sheet';

export function evaluateFormula(formula: string, cells: Record<string, Cell>): string {
  // Remove all spaces
  formula = formula.replace(/\s+/g, '');
  
  // Basic cell reference pattern
  const cellPattern = /[A-Z]+\d+/g;
  
  // Replace cell references with their values
  const formulaWithValues = formula.replace(cellPattern, (cellId) => {
    const cellData = cells[cellId];
    if (!cellData) return '0';
    
    const cellValue = cellData.value;
    
    // Handle recursive formulas
    if (cellValue && cellValue.startsWith('=')) {
      return evaluateFormula(cellValue.substring(1), cells);
    }
    
    // If it's a number, return it, otherwise return 0
    return !isNaN(Number(cellValue)) ? cellValue : '0';
  });
  
  try {
    // Use Function constructor to evaluate the expression safely
    // This is safer than eval() but still has limitations
    const result = Function(`"use strict"; return (${formulaWithValues})`)();
    
    // Format the result
    if (typeof result === 'number') {
      // Check if it's an integer
      if (Number.isInteger(result)) {
        return result.toString();
      } else {
        // Return with up to 2 decimal places, but only if needed
        return result.toFixed(2).replace(/\.00$/, '');
      }
    }
    
    return result.toString();
  } catch (error) {
    console.error('Formula evaluation error:', error);
    return '#ERROR';
  }
}
