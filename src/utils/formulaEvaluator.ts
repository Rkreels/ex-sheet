import { FormulaFunction } from '../types/sheet';
import formulaFunctions from './formulaFunctions';
import { Cell } from '../types/sheet';

// Parse a cell reference like "A1" into row and column
const parseCellRef = (cellRef: string): { col: string, row: number } => {
  const match = cellRef.match(/([A-Z]+)([0-9]+)/);
  if (!match) throw new Error(`Invalid cell reference: ${cellRef}`);
  return { col: match[1], row: parseInt(match[2], 10) };
};

// Convert column letter to index (A -> 0, B -> 1, etc.)
const colLetterToIndex = (colLetter: string): number => {
  let result = 0;
  for (let i = 0; i < colLetter.length; i++) {
    result = result * 26 + (colLetter.charCodeAt(i) - 64);
  }
  return result - 1;
};

// Convert column index to letter (0 -> A, 1 -> B, etc.)
const colIndexToLetter = (colIndex: number): string => {
  let letter = '';
  while (colIndex >= 0) {
    letter = String.fromCharCode(65 + (colIndex % 26)) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
};

// Expand a range like "A1:B3" into an array of cell references
const expandRange = (range: string): string[] => {
  const [start, end] = range.split(':');
  if (!start || !end) return [range]; // Not a range
  
  const startCell = parseCellRef(start);
  const endCell = parseCellRef(end);
  
  const startColIndex = colLetterToIndex(startCell.col);
  const endColIndex = colLetterToIndex(endCell.col);
  const startRow = startCell.row;
  const endRow = endCell.row;
  
  const cells: string[] = [];
  
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startColIndex; col <= endColIndex; col++) {
      const colLetter = colIndexToLetter(col);
      cells.push(`${colLetter}${row}`);
    }
  }
  
  return cells;
};

// Get the value of a cell reference, supporting ranges
const getCellValue = (cellRef: string, cells: Record<string, Cell>, formula = ''): any => {
  // Check for circular reference
  if (formula.includes(cellRef)) {
    throw new Error(`Circular reference detected: ${formula} references ${cellRef}`);
  }
  
  // Check if it's a range
  if (cellRef.includes(':')) {
    const cellRefs = expandRange(cellRef);
    return cellRefs.map(ref => getCellValue(ref, cells, formula));
  }
  
  const cell = cells[cellRef];
  if (!cell) return 0;
  
  const value = cell.value;
  
  // If the cell contains a formula, evaluate it
  if (value && value.startsWith('=')) {
    return evaluateFormula(value.substring(1), cells, formula + cellRef);
  }
  
  // Try to convert to number if possible
  const numValue = parseFloat(value);
  return isNaN(numValue) ? value : numValue;
};

// Parse the formula and evaluate it
export const evaluateFormula = (formula: string, cells: Record<string, Cell>, parentFormula = ''): any => {
  try {
    // Extract function calls like SUM(A1:A5)
    const functionRegex = /([A-Z]+)\(([^()]*|\([^()]*\))*\)/g;
    let result = formula;
    
    // Replace all function calls with their evaluated results
    let match;
    while ((match = functionRegex.exec(formula)) !== null) {
      const fullMatch = match[0];
      const funcName = match[1];
      const argsString = fullMatch.substring(funcName.length + 1, fullMatch.length - 1);
      
      // Split arguments by comma, but respect nested parentheses
      const args = [];
      let currentArg = '';
      let parenCount = 0;
      
      for (let i = 0; i < argsString.length; i++) {
        const char = argsString[i];
        if (char === '(' ) parenCount++;
        else if (char === ')') parenCount--;
        
        if (char === ',' && parenCount === 0) {
          args.push(currentArg.trim());
          currentArg = '';
        } else {
          currentArg += char;
        }
      }
      
      if (currentArg) args.push(currentArg.trim());
      
      // Process each argument
      const processedArgs = args.map(arg => {
        // If arg is a cell reference or range
        if (/^[A-Z]+[0-9]+$/.test(arg) || /^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/.test(arg)) {
          return getCellValue(arg, cells, parentFormula);
        }
        
        // If arg is a nested formula
        if (arg.includes('(')) {
          return evaluateFormula(arg, cells, parentFormula);
        }
        
        // If arg is a number
        const num = parseFloat(arg);
        if (!isNaN(num)) return num;
        
        // Otherwise it's a string
        return arg.replace(/^"(.*)"$/, '$1'); // Remove quotes
      });
      
      // Execute the function
      const func = formulaFunctions[funcName];
      if (!func) throw new Error(`Unknown function: ${funcName}`);
      
      let funcResult;
      
      // Handle special case for functions that process ranges
      if (funcName === 'SUM' || funcName === 'AVERAGE' || funcName === 'MIN' || funcName === 'MAX' || funcName === 'COUNT') {
        // Flatten nested arrays from range arguments
        const flatArgs = processedArgs.flat(Infinity);
        funcResult = func.execute(...flatArgs);
      } else {
        funcResult = func.execute(...processedArgs);
      }
      
      // Replace the function call with its result
      result = result.replace(fullMatch, funcResult.toString());
    }
    
    // Process cell references that are not inside a function call
    const cellRegex = /[A-Z]+[0-9]+/g;
    result = result.replace(cellRegex, (cellRef) => {
      return getCellValue(cellRef, cells, parentFormula).toString();
    });
    
    // Process operators
    // This is a simplified version - a real implementation would handle operator precedence
    // and support more operations
    const evalResult = new Function(`return ${result}`)();
    return evalResult;
  } catch (err: any) {
    console.error('Formula evaluation error:', err.message);
    return `#ERROR! ${err.message}`;
  }
};

// Helper function to get cell range data
export function getCellRangeData(startCell: string, endCell: string, cells: Record<string, Cell>): any[][] {
  const match1 = startCell.match(/([A-Z]+)(\d+)/);
  const match2 = endCell.match(/([A-Z]+)(\d+)/);
  
  if (!match1 || !match2) return [[]];
  
  const startCol = match1[1].charCodeAt(0) - 65; // Convert 'A' to 0, 'B' to 1, etc.
  const startRow = parseInt(match1[2]) - 1;    // Convert to 0-based index
  const endCol = match2[1].charCodeAt(0) - 65;
  const endRow = parseInt(match2[2]) - 1;
  
  const data: any[][] = [];
  
  for (let row = startRow; row <= endRow; row++) {
    const rowData: any[] = [];
    for (let col = startCol; col <= endCol; col++) {
      const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
      const cell = cells[cellId];
      
      let value = '';
      if (cell) {
        if (cell.value.startsWith('=')) {
          value = evaluateFormula(cell.value.substring(1), cells);
        } else {
          value = cell.value;
        }
      }
      
      // Try to convert to number if possible
      const numValue = parseFloat(value);
      rowData.push(isNaN(numValue) ? value : numValue);
    }
    data.push(rowData);
  }
  
  return data;
}
