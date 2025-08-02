
import { Cell } from '../types/sheet';
import { parseCellRef, colLetterToIndex, colIndexToLetter, expandRange, getCellRangeData } from './cellReference';
import { getCellValue, extractAndEvaluateFunctions } from './formulaParser';

// Parse the formula and evaluate it with enhanced error handling and circular reference detection
export const evaluateFormula = (formula: string, cells: Record<string, Cell>, parentFormula = '', visited = new Set<string>()): any => {
  try {
    // Enhanced circular reference detection
    const cellRefs = formula.match(/[A-Z]+[0-9]+/g) || [];
    for (const cellRef of cellRefs) {
      if (visited.has(cellRef)) {
        return `#CIRCULAR!`;
      }
    }

    // First, handle function calls with proper argument parsing
    let result = extractAndEvaluateFunctions(formula, cells, parentFormula, visited);
    
    // Process cell references that are not inside a function call
    const cellRegex = /(?<![A-Z(])([A-Z]+[0-9]+)(?![A-Z0-9),])/g;
    result = result.replace(cellRegex, (cellRef) => {
      if (visited.has(cellRef)) {
        return '#CIRCULAR!';
      }
      const newVisited = new Set(visited);
      newVisited.add(cellRef);
      return getCellValue(cellRef, cells, parentFormula, newVisited).toString();
    });
    
    // Enhanced formula evaluation with proper operator handling
    try {
      // Handle string concatenation with &
      result = result.replace(/([^&])&([^&])/g, '$1+$2');
      
      // Handle percentage calculations
      result = result.replace(/(\d+(?:\.\d+)?)%/g, (match, num) => {
        return (parseFloat(num) / 100).toString();
      });
      
      // Fix multiplication, division, and other operators
      result = result.replace(/\*/g, '*');
      result = result.replace(/\//g, '/');
      result = result.replace(/\+/g, '+');
      result = result.replace(/-/g, '-');
      
      // Evaluate the expression safely
      const evalResult = new Function(`"use strict"; return (${result})`)();
      
      // Return proper values
      if (typeof evalResult === 'number') {
        return isNaN(evalResult) ? '#VALUE!' : evalResult;
      }
      return evalResult;
    } catch (error) {
      // If mathematical evaluation fails, try as string concatenation
      if (result.includes('"') || result.includes("'")) {
        return result.replace(/"/g, '').replace(/'/g, '');
      }
      return '#VALUE!';
    }
  } catch (err: any) {
    console.error('Formula evaluation error:', err.message);
    return `#ERROR! ${err.message}`;
  }
};

// Export the helper functions for use in other modules
export { getCellRangeData };
