// Enhanced Formula Evaluator with Multi-Row/Column Support
import { Cell } from '../types/sheet';
import { comprehensiveFormulas } from './comprehensiveFormulas';
import { advancedExcelFunctionLibrary } from './advancedExcelFunctionLibrary';
import { missingExcelFunctions } from './missingExcelFunctions';
import { advancedFormulaFunctions } from './advancedFormulas';
import { expandRange, parseCellRef, colLetterToIndex, colIndexToLetter } from './cellReference';

// Combine all available functions
const allFormulas = {
  ...comprehensiveFormulas,
  ...advancedExcelFunctionLibrary,
  ...missingExcelFunctions,
  ...Object.fromEntries(
    Object.entries(advancedFormulaFunctions).map(([name, func]) => [
      name, 
      { name, description: `Advanced ${name} function`, execute: func }
    ])
  )
};

// Enhanced cell value getter with proper range support
export const getEnhancedCellValue = (
  cellRef: string, 
  cells: Record<string, Cell>, 
  visited = new Set<string>()
): any => {
  // Check for circular reference
  if (visited.has(cellRef)) {
    return '#CIRCULAR!';
  }

  // Handle ranges
  if (cellRef.includes(':')) {
    const expandedRefs = expandRange(cellRef);
    return expandedRefs.map(ref => getEnhancedCellValue(ref, cells, visited));
  }

  const cell = cells[cellRef];
  if (!cell) return 0;

  // If calculated value exists, return it
  if (cell.calculatedValue !== undefined) {
    return cell.calculatedValue;
  }

  const value = cell.value;

  // Handle formulas
  if (value && typeof value === 'string' && value.startsWith('=')) {
    const newVisited = new Set(visited);
    newVisited.add(cellRef);
    
    try {
      const result = evaluateEnhancedFormula(value.substring(1), cells, newVisited);
      // Cache the result
      cells[cellRef].calculatedValue = result;
      return result;
    } catch (error) {
      return '#ERROR!';
    }
  }

  // Handle different data types
  if (typeof value === 'string') {
    // Handle percentage
    if (value.endsWith('%')) {
      const numValue = parseFloat(value.slice(0, -1));
      return isNaN(numValue) ? value : numValue / 100;
    }
    
    // Handle currency
    if (value.startsWith('$')) {
      const numValue = parseFloat(value.slice(1).replace(/,/g, ''));
      return isNaN(numValue) ? value : numValue;
    }
    
    // Handle dates
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime()) && value.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      return dateValue;
    }
    
    // Try to convert to number
    const numValue = parseFloat(value);
    return isNaN(numValue) ? value : numValue;
  }

  return value;
};

// Enhanced formula evaluator with comprehensive function support
export const evaluateEnhancedFormula = (
  formula: string, 
  cells: Record<string, Cell>, 
  visited = new Set<string>()
): any => {
  try {
    // Clean up the formula
    let processedFormula = formula.trim();

    // Step 1: Process all function calls first
    processedFormula = processFunctionCalls(processedFormula, cells, visited);

    // Step 2: Process cell references and ranges
    processedFormula = processCellReferences(processedFormula, cells, visited);

    // Step 3: Handle operators and mathematical expressions
    processedFormula = processOperators(processedFormula);

    // Step 4: Evaluate the final expression
    return evaluateFinalExpression(processedFormula);

  } catch (error) {
    console.error('Formula evaluation error:', error);
    return '#ERROR!';
  }
};

// Process function calls with proper argument parsing
const processFunctionCalls = (
  formula: string, 
  cells: Record<string, Cell>, 
  visited: Set<string>
): string => {
  // Enhanced function regex to handle nested functions
  const functionRegex = /([A-Z_]+)\s*\(([^()]*(?:\([^()]*\))*[^()]*)\)/gi;
  
  let result = formula;
  let match;
  
  // Process functions from innermost to outermost
  while ((match = functionRegex.exec(formula)) !== null) {
    const funcName = match[1].toUpperCase();
    const argsString = match[2];
    
    try {
      const func = allFormulas[funcName];
      if (!func) {
        throw new Error(`Unknown function: ${funcName}`);
      }

      // Parse arguments with proper handling of nested structures
      const args = parseEnhancedArguments(argsString, cells, visited);
      
      // Execute the function
      const funcResult = func.execute ? func.execute(args) : func(args);
      
      // Replace the function call with its result
      result = result.replace(match[0], String(funcResult));
      
      // Reset regex to process any remaining functions
      functionRegex.lastIndex = 0;
      
    } catch (error) {
      console.error(`Error executing function ${funcName}:`, error);
      result = result.replace(match[0], '#ERROR!');
    }
  }
  
  return result;
};

// Enhanced argument parsing with support for ranges, arrays, and nested expressions
const parseEnhancedArguments = (
  argsString: string, 
  cells: Record<string, Cell>, 
  visited: Set<string>
): any[] => {
  if (!argsString.trim()) return [];

  const args: any[] = [];
  let currentArg = '';
  let parenDepth = 0;
  let bracketDepth = 0;
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < argsString.length; i++) {
    const char = argsString[i];
    const prevChar = i > 0 ? argsString[i - 1] : '';

    // Handle quotes
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      }
      currentArg += char;
    }
    // Handle delimiters when not in quotes
    else if (!inQuotes) {
      if (char === '(') parenDepth++;
      else if (char === ')') parenDepth--;
      else if (char === '[') bracketDepth++;
      else if (char === ']') bracketDepth--;
      else if (char === ',' && parenDepth === 0 && bracketDepth === 0) {
        args.push(processArgument(currentArg.trim(), cells, visited));
        currentArg = '';
        continue;
      }
      currentArg += char;
    }
    else {
      currentArg += char;
    }
  }

  // Process the last argument
  if (currentArg.trim()) {
    args.push(processArgument(currentArg.trim(), cells, visited));
  }

  return args;
};

// Process individual argument with type detection
const processArgument = (
  arg: string, 
  cells: Record<string, Cell>, 
  visited: Set<string>
): any => {
  // Handle empty arguments
  if (!arg) return '';

  // Handle quoted strings
  if ((arg.startsWith('"') && arg.endsWith('"')) || 
      (arg.startsWith("'") && arg.endsWith("'"))) {
    return arg.slice(1, -1);
  }

  // Handle arrays [1,2,3] or {1;2;3}
  if ((arg.startsWith('[') && arg.endsWith(']')) || 
      (arg.startsWith('{') && arg.endsWith('}'))) {
    const content = arg.slice(1, -1);
    const delimiter = arg.includes(';') ? ';' : ',';
    return content.split(delimiter).map(item => processArgument(item.trim(), cells, visited));
  }

  // Handle cell ranges (A1:B5)
  if (/^[A-Z]+[0-9]+:[A-Z]+[0-9]+$/i.test(arg)) {
    return getEnhancedCellValue(arg, cells, visited);
  }

  // Handle single cell references (A1, B2, etc.)
  if (/^[A-Z]+[0-9]+$/i.test(arg)) {
    return getEnhancedCellValue(arg, cells, visited);
  }

  // Handle nested formulas
  if (arg.includes('(') && arg.includes(')')) {
    return evaluateEnhancedFormula(arg, cells, visited);
  }

  // Handle numbers
  const numValue = parseFloat(arg);
  if (!isNaN(numValue) && isFinite(numValue)) {
    return numValue;
  }

  // Handle percentages
  if (arg.endsWith('%')) {
    const percentValue = parseFloat(arg.slice(0, -1));
    return isNaN(percentValue) ? arg : percentValue / 100;
  }

  // Handle booleans
  if (arg.toLowerCase() === 'true') return true;
  if (arg.toLowerCase() === 'false') return false;

  // Return as string for everything else
  return arg;
};

// Process cell references in the formula
const processCellReferences = (
  formula: string, 
  cells: Record<string, Cell>, 
  visited: Set<string>
): string => {
  // Match cell references that are not part of function calls
  const cellRegex = /(?<![A-Z_0-9])([A-Z]+[0-9]+)(?![A-Z0-9_:])/gi;
  
  return formula.replace(cellRegex, (cellRef) => {
    if (visited.has(cellRef.toUpperCase())) {
      return '#CIRCULAR!';
    }
    
    const value = getEnhancedCellValue(cellRef.toUpperCase(), cells, visited);
    return String(value);
  });
};

// Handle mathematical operators and expressions
const processOperators = (formula: string): string => {
  let result = formula;

  // Handle percentage calculations (convert % to /100)
  result = result.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

  // Handle string concatenation (&)
  result = result.replace(/([^&\s]+)\s*&\s*([^&\s]+)/g, 'CONCATENATE($1,$2)');

  // Handle exponentiation (^ to **)
  result = result.replace(/\^/g, '**');

  // Clean up multiple operators
  result = result.replace(/\+\s*\+/g, '+');
  result = result.replace(/-\s*-/g, '+');
  result = result.replace(/\*\s*\*/g, '**');

  return result;
};

// Safely evaluate the final mathematical expression
const evaluateFinalExpression = (expression: string): any => {
  try {
    // Handle CONCATENATE functions for string operations
    if (expression.includes('CONCATENATE')) {
      return expression; // Return as is for now, should be processed by function handler
    }

    // For pure mathematical expressions
    if (/^[\d\s+\-*/.()]+$/.test(expression)) {
      const result = new Function(`"use strict"; return (${expression})`)();
      
      if (typeof result === 'number') {
        if (isNaN(result)) return '#VALUE!';
        if (!isFinite(result)) return '#DIV/0!';
        return result;
      }
      return result;
    }

    // For mixed expressions, try direct evaluation
    const result = new Function(`"use strict"; return (${expression})`)();
    return result;

  } catch (error) {
    // If mathematical evaluation fails, return as string
    return expression;
  }
};

// Multi-cell operation support
export const evaluateMultiCellFormula = (
  formula: string,
  targetCells: string[],
  cells: Record<string, Cell>
): Record<string, any> => {
  const results: Record<string, any> = {};

  for (const cellId of targetCells) {
    try {
      // Replace relative references for each target cell
      const adjustedFormula = adjustFormulaForCell(formula, cellId);
      const result = evaluateEnhancedFormula(adjustedFormula, cells);
      results[cellId] = result;
    } catch (error) {
      results[cellId] = '#ERROR!';
    }
  }

  return results;
};

// Adjust formula for relative cell references
const adjustFormulaForCell = (formula: string, targetCell: string): string => {
  // This is a simplified version - in a full implementation,
  // you would need to handle relative vs absolute references ($A$1 vs A1)
  return formula; // For now, return as-is
};

// Batch formula evaluation for performance
export const batchEvaluateFormulas = (
  cellsToEvaluate: string[],
  cells: Record<string, Cell>
): Record<string, any> => {
  const results: Record<string, any> = {};
  const visited = new Set<string>();

  // Sort cells by dependency order to minimize recalculations
  const sortedCells = topologicalSort(cellsToEvaluate, cells);

  for (const cellId of sortedCells) {
    const cell = cells[cellId];
    if (cell?.value?.startsWith('=')) {
      try {
        const result = evaluateEnhancedFormula(cell.value.substring(1), cells, visited);
        results[cellId] = result;
        // Update the calculated value in the cell
        cells[cellId].calculatedValue = result;
      } catch (error) {
        results[cellId] = '#ERROR!';
        cells[cellId].calculatedValue = '#ERROR!';
      }
    }
  }

  return results;
};

// Simple topological sort for dependency resolution
const topologicalSort = (cellIds: string[], cells: Record<string, Cell>): string[] => {
  // This is a simplified implementation
  // A full implementation would build a proper dependency graph
  return cellIds.sort();
};

// Export the main evaluation function
export { evaluateEnhancedFormula as evaluateFormula };