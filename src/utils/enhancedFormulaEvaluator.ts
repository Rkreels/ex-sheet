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
  if (visited.has(cellRef.toUpperCase())) {
    return '#CIRCULAR!';
  }

  // Handle ranges
  if (cellRef.includes(':')) {
    const expandedRefs = expandRange(cellRef);
    return expandedRefs.map(ref => getEnhancedCellValue(ref, cells, visited));
  }

  const cell = cells[cellRef.toUpperCase()];
  if (!cell) return 0;

  // If calculated value exists and is not undefined/null, return it
  if (cell.calculatedValue !== undefined && cell.calculatedValue !== null) {
    return cell.calculatedValue;
  }

  const value = cell.value;

  // Handle empty cells
  if (value === undefined || value === null || value === '') return 0;

  // Handle formulas
  if (value && typeof value === 'string' && value.startsWith('=')) {
    const newVisited = new Set(visited);
    newVisited.add(cellRef.toUpperCase());
    
    try {
      const result = evaluateEnhancedFormula(value.substring(1), cells, newVisited);
      // Cache the result
      cells[cellRef.toUpperCase()].calculatedValue = result;
      return result;
    } catch (error) {
      console.error('Formula evaluation error in cell', cellRef, ':', error);
      return '#ERROR!';
    }
  }

  // Handle different data types
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'string') {
    // Handle percentage
    if (value.endsWith('%')) {
      const numValue = parseFloat(value.slice(0, -1));
      return isNaN(numValue) ? 0 : numValue / 100;
    }
    
    // Handle currency
    if (value.startsWith('$') || value.startsWith('€') || value.startsWith('£')) {
      const numValue = parseFloat(value.slice(1).replace(/,/g, ''));
      return isNaN(numValue) ? 0 : numValue;
    }
    
    // Handle negative numbers in parentheses: (100)
    if (value.startsWith('(') && value.endsWith(')')) {
      const numValue = parseFloat(value.slice(1, -1).replace(/,/g, ''));
      return isNaN(numValue) ? value : -numValue;
    }
    
    // Handle numbers with commas: 1,000
    if (value.includes(',') && /^[\d,]+\.?\d*$/.test(value)) {
      const numValue = parseFloat(value.replace(/,/g, ''));
      return isNaN(numValue) ? value : numValue;
    }
    
    // Handle dates
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime()) && value.match(/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/)) {
      return dateValue;
    }
    
    // Try to convert to number
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && isFinite(numValue)) {
      return numValue;
    }
    
    // Return as string for text values
    return value;
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


// Process function calls with proper argument parsing - handles nested functions recursively
const processFunctionCalls = (
  formula: string, 
  cells: Record<string, Cell>, 
  visited: Set<string>
): string => {
  let result = formula;
  let hasChanges = true;
  let iterations = 0;
  const MAX_ITERATIONS = 50; // Prevent infinite loops
  
  // Keep processing until no more functions are found
  while (hasChanges && iterations < MAX_ITERATIONS) {
    hasChanges = false;
    iterations++;
    
    // Match function calls - process innermost first
    // This regex matches: FUNCNAME(args) where args can contain nested parens
    const functionRegex = /([A-Z_]+)\s*\(([^()]*(?:\((?:[^()]*(?:\([^()]*\))*[^()]*)\)[^()]*)*)\)/gi;
    
    result = result.replace(functionRegex, (match, funcName, argsString) => {
      hasChanges = true;
      const upperFuncName = funcName.toUpperCase();
      
      try {
        const func = allFormulas[upperFuncName];
        if (!func) {
          console.error(`Unknown function: ${upperFuncName}`);
          return '#NAME?';
        }

        // Parse arguments with proper handling of nested structures
        const args = parseEnhancedArguments(argsString, cells, visited);
        
        // Execute the function
        let funcResult;
        if (func.execute) {
          funcResult = func.execute(args);
        } else if (typeof func === 'function') {
          funcResult = func(args);
        } else {
          funcResult = '#VALUE!';
        }
        
        // Handle array results from functions
        if (Array.isArray(funcResult)) {
          // Flatten arrays for use in calculations
          return funcResult.flat(Infinity).join(',');
        }
        
        return String(funcResult);
        
      } catch (error) {
        console.error(`Error executing function ${upperFuncName}:`, error);
        return '#ERROR!';
      }
    });
  }
  
  if (iterations >= MAX_ITERATIONS) {
    console.warn('Max iterations reached in function processing');
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
    const rangeValue = getEnhancedCellValue(arg.toUpperCase(), cells, visited);
    // Ensure array results are flattened for function arguments
    return Array.isArray(rangeValue) ? rangeValue.flat(Infinity) : rangeValue;
  }

  // Handle single cell references (A1, B2, etc.)
  if (/^[A-Z]+[0-9]+$/i.test(arg)) {
    return getEnhancedCellValue(arg.toUpperCase(), cells, visited);
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
  // First handle ranges (A1:B5)
  const rangeRegex = /\b([A-Z]+[0-9]+:[A-Z]+[0-9]+)\b/gi;
  let result = formula.replace(rangeRegex, (rangeRef) => {
    const value = getEnhancedCellValue(rangeRef.toUpperCase(), cells, visited);
    if (Array.isArray(value)) {
      // For ranges in formulas (not in functions), join the values
      return value.flat(Infinity).join(',');
    }
    return String(value);
  });
  
  // Then handle single cell references (A1, B2, etc.)
  // Match cell references that are not part of ranges
  const cellRegex = /(?<![A-Z_0-9:])([A-Z]+[0-9]+)(?![A-Z0-9_:])/gi;
  
  result = result.replace(cellRegex, (cellRef) => {
    const upper = cellRef.toUpperCase();
    if (visited.has(upper)) {
      return '#CIRCULAR!';
    }
    
    const value = getEnhancedCellValue(upper, cells, visited);
    
    // Handle array values
    if (Array.isArray(value)) {
      return value.flat(Infinity).join(',');
    }
    
    // Convert to number if possible for calculations
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));
    if (!isNaN(numValue) && isFinite(numValue)) {
      return String(numValue);
    }
    
    return String(value);
  });
  
  return result;
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
    // Clean up the expression
    let cleanExpr = expression.trim();
    
    // Handle error codes - don't evaluate them
    if (cleanExpr.startsWith('#') && cleanExpr.endsWith('!')) {
      return cleanExpr;
    }
    
    // If expression contains only error codes, return the first one
    if (/^#[A-Z]+!$/.test(cleanExpr)) {
      return cleanExpr;
    }
    
    // Handle pure string results (from CONCATENATE etc)
    if (cleanExpr.includes('CONCATENATE') || /^["'].*["']$/.test(cleanExpr)) {
      return cleanExpr.replace(/^["']|["']$/g, '');
    }
    
    // Handle simple number returns
    const numValue = parseFloat(cleanExpr);
    if (!isNaN(numValue) && isFinite(numValue) && /^-?\d+\.?\d*$/.test(cleanExpr)) {
      return numValue;
    }
    
    // For mathematical expressions with operators
    if (/^[\d\s+\-*/.()%]+$/.test(cleanExpr)) {
      // Handle percentage in final expression
      cleanExpr = cleanExpr.replace(/(\d+\.?\d*)%/g, '($1/100)');
      
      const result = new Function(`"use strict"; return (${cleanExpr})`)();
      
      if (typeof result === 'number') {
        if (isNaN(result)) return '#VALUE!';
        if (!isFinite(result)) return '#DIV/0!';
        // Round to avoid floating point errors
        return Math.round(result * 1e10) / 1e10;
      }
      return result;
    }
    
    // Try to evaluate more complex expressions
    // Remove any trailing/leading whitespace and check for valid expression
    if (cleanExpr.length > 0 && !/[a-zA-Z]/.test(cleanExpr.replace(/[eE]/g, ''))) {
      const result = new Function(`"use strict"; return (${cleanExpr})`)();
      
      if (typeof result === 'number') {
        if (isNaN(result)) return '#VALUE!';
        if (!isFinite(result)) return '#DIV/0!';
        return Math.round(result * 1e10) / 1e10;
      }
      return result;
    }
    
    // If can't evaluate mathematically, return as-is
    return cleanExpr;

  } catch (error) {
    console.error('Expression evaluation error:', error, 'Expression:', expression);
    return '#VALUE!';
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
    if (cell?.value && typeof cell.value === 'string' && cell.value.startsWith('=')) {
      try {
        // Clear any previous cached value to force recalculation
        delete cells[cellId].calculatedValue;
        
        const result = evaluateEnhancedFormula(cell.value.substring(1), cells, new Set());
        results[cellId] = result;
        // Update the calculated value in the cell
        cells[cellId].calculatedValue = result;
      } catch (error) {
        console.error(`Error evaluating ${cellId}:`, error);
        results[cellId] = '#ERROR!';
        cells[cellId].calculatedValue = '#ERROR!';
      }
    }
  }

  return results;
};

// Dependency-aware topological sort for correct recalculation order
const topologicalSort = (cellIds: string[], cells: Record<string, Cell>): string[] => {
  const targets = new Set(cellIds.map((id) => id.toUpperCase()));

  // Build adjacency list: node -> set(dependencies within targets)
  const graph: Record<string, Set<string>> = {};
  const refsRegex = /\b([A-Z]+[0-9]+)\b/g;
  const rangeRegex = /\b([A-Z]+[0-9]+:[A-Z]+[0-9]+)\b/g;

  const addDeps = (id: string) => {
    const cell = cells[id];
    const deps = new Set<string>();
    if (cell?.value?.startsWith('=')) {
      const formula = cell.value.toUpperCase();
      // Add single refs
      const singleRefs = formula.match(refsRegex) || [];
      for (const r of singleRefs) {
        const ref = r.toUpperCase();
        if (targets.has(ref) && ref !== id.toUpperCase()) deps.add(ref);
      }
      // Add ranges
      const ranges = formula.match(rangeRegex) || [];
      for (const range of ranges) {
        try {
          const expanded = expandRange(range.toUpperCase());
          for (const ref of expanded) {
            const up = ref.toUpperCase();
            if (targets.has(up) && up !== id.toUpperCase()) deps.add(up);
          }
        } catch {
          // ignore malformed ranges
        }
      }
    }
    graph[id] = deps;
  };

  for (const id of targets) addDeps(id);

  // Kahn's algorithm
  const inDegree: Record<string, number> = {};
  for (const id of Object.keys(graph)) inDegree[id] = 0;
  for (const [id, deps] of Object.entries(graph)) {
    for (const d of deps) inDegree[id] = (inDegree[id] || 0) + 1;
  }

  const queue: string[] = Object.entries(inDegree)
    .filter(([, deg]) => deg === 0)
    .map(([id]) => id);

  const order: string[] = [];
  while (queue.length) {
    const n = queue.shift()!;
    order.push(n);
    for (const [id, deps] of Object.entries(graph)) {
      if (deps.has(n)) {
        inDegree[id] -= 1;
        deps.delete(n);
        if (inDegree[id] === 0) queue.push(id);
      }
    }
  }

  // If cycle detected, append remaining nodes in deterministic order
  if (order.length < targets.size) {
    const remaining = Array.from(targets).filter((t) => !order.includes(t)).sort();
    order.push(...remaining);
  }

  return order;
};

// Export the main evaluation function
export { evaluateEnhancedFormula as evaluateFormula };