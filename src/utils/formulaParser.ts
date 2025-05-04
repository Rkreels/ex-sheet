import formulaFunctions from './formulaFunctions';
import { Cell } from '../types/sheet';
import { parseCellRef, colLetterToIndex, expandRange } from './cellReference';

// Get the value of a cell reference, supporting ranges
export const getCellValue = (cellRef: string, cells: Record<string, Cell>, formula = ''): any => {
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
    // Import dynamically to avoid circular reference
    const { evaluateFormula } = require('./formulaEvaluator');
    return evaluateFormula(value.substring(1), cells, formula + cellRef);
  }
  
  // Try to convert to number if possible
  const numValue = parseFloat(value);
  return isNaN(numValue) ? value : numValue;
};

// Parse arguments for a formula function, respecting nested parentheses
export const parseFormulaArgs = (argsString: string): string[] => {
  const args: string[] = [];
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
  
  return args;
};

// Process function arguments and prepare them for execution
export const processFunctionArgs = (args: string[], cells: Record<string, Cell>, parentFormula: string): any[] => {
  return args.map(arg => {
    // If arg is a cell reference or range
    if (/^[A-Z]+[0-9]+$/.test(arg) || /^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/.test(arg)) {
      return getCellValue(arg, cells, parentFormula);
    }
    
    // If arg is a nested formula
    if (arg.includes('(')) {
      // Import dynamically to avoid circular reference
      const { evaluateFormula } = require('./formulaEvaluator');
      return evaluateFormula(arg, cells, parentFormula);
    }
    
    // If arg is a number
    const num = parseFloat(arg);
    if (!isNaN(num)) return num;
    
    // Otherwise it's a string
    return arg.replace(/^"(.*)"$/, '$1'); // Remove quotes
  });
};

// Extract and evaluate functions in a formula
export const extractAndEvaluateFunctions = (formula: string, cells: Record<string, Cell>, parentFormula: string): string => {
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
    const args = parseFormulaArgs(argsString);
    
    // Process each argument
    const processedArgs = processFunctionArgs(args, cells, parentFormula);
    
    // Execute the function
    const func = formulaFunctions[funcName];
    if (!func) throw new Error(`Unknown function: ${funcName}`);
    
    let funcResult;
    
    // Handle special case for functions that process ranges
    if (funcName === 'SUM' || funcName === 'AVERAGE' || funcName === 'MIN' || 
        funcName === 'MAX' || funcName === 'COUNT') {
      // Flatten nested arrays from range arguments
      const flatArgs = processedArgs.flat(Infinity);
      funcResult = func.execute(...flatArgs);
    } else {
      funcResult = func.execute(...processedArgs);
    }
    
    // Replace the function call with its result
    result = result.replace(fullMatch, funcResult.toString());
  }
  
  return result;
};
