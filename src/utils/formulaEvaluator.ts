
import { Cell } from '../types/sheet';
import { parseCellRef, colLetterToIndex, colIndexToLetter, expandRange, getCellRangeData } from './cellReference';
import { getCellValue, extractAndEvaluateFunctions } from './formulaParser';

// Parse the formula and evaluate it
export const evaluateFormula = (formula: string, cells: Record<string, Cell>, parentFormula = ''): any => {
  try {
    // First, handle function calls
    let result = extractAndEvaluateFunctions(formula, cells, parentFormula);
    
    // Process cell references that are not inside a function call
    const cellRegex = /[A-Z]+[0-9]+/g;
    result = result.replace(cellRegex, (cellRef) => {
      return getCellValue(cellRef, cells, parentFormula).toString();
    });
    
    // Process operators
    try {
      // This is a simplified version - a real implementation would handle operator precedence
      // and support more operations
      return new Function(`return ${result}`)();
    } catch (error) {
      // If there was a math error, return the string as is
      // This allows for text formulas like ="Hello "&A1
      return result;
    }
  } catch (err: any) {
    console.error('Formula evaluation error:', err.message);
    return `#ERROR! ${err.message}`;
  }
};

// Export the helper functions for use in other modules
export { getCellRangeData };
