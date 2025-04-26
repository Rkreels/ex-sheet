import { Cell, FormulaFunction, FormulaFunctionName } from '../types/sheet';

// Define advanced formula functions
const formulaFunctions: Record<FormulaFunctionName, FormulaFunction> = {
  SUM: {
    name: 'SUM',
    description: 'Adds all the numbers in a range of cells',
    usage: 'SUM(number1, [number2], ...)',
    execute: (args, cells) => {
      return args.reduce((sum, val) => {
        const num = parseFloat(String(val));
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
    }
  },
  AVERAGE: {
    name: 'AVERAGE',
    description: 'Returns the average of its arguments',
    usage: 'AVERAGE(number1, [number2], ...)',
    execute: (args, cells) => {
      if (args.length === 0) return 0;
      const sum = formulaFunctions.SUM.execute(args, cells);
      return sum / args.length;
    }
  },
  MIN: {
    name: 'MIN',
    description: 'Returns the minimum value in a list of arguments',
    usage: 'MIN(number1, [number2], ...)',
    execute: (args, cells) => {
      if (args.length === 0) return 0;
      return Math.min(...args.map(val => {
        const num = parseFloat(String(val));
        return isNaN(num) ? Infinity : num;
      }));
    }
  },
  MAX: {
    name: 'MAX',
    description: 'Returns the maximum value in a list of arguments',
    usage: 'MAX(number1, [number2], ...)',
    execute: (args, cells) => {
      if (args.length === 0) return 0;
      return Math.max(...args.map(val => {
        const num = parseFloat(String(val));
        return isNaN(num) ? -Infinity : num;
      }));
    }
  },
  COUNT: {
    name: 'COUNT',
    description: 'Counts the number of cells that contain numbers',
    usage: 'COUNT(value1, [value2], ...)',
    execute: (args, cells) => {
      return args.filter(val => !isNaN(parseFloat(String(val)))).length;
    }
  },
  IF: {
    name: 'IF',
    description: 'Returns one value if a condition is true and another if it is false',
    usage: 'IF(logical_test, value_if_true, value_if_false)',
    execute: (args, cells) => {
      if (args.length < 3) return '#ERROR';
      const condition = !!args[0];
      return condition ? args[1] : args[2];
    }
  },
  CONCATENATE: {
    name: 'CONCATENATE',
    description: 'Joins several text strings into one text string',
    usage: 'CONCATENATE(text1, [text2], ...)',
    execute: (args, cells) => {
      return args.join('');
    }
  },
  VLOOKUP: {
    name: 'VLOOKUP',
    description: 'Looks up a value in the first column of a table and returns a value in the same row',
    usage: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    execute: (args, cells) => {
      // Simplified implementation
      return 'VLOOKUP not fully implemented';
    }
  },
  HLOOKUP: {
    name: 'HLOOKUP',
    description: 'Looks up a value in the top row of a table and returns a value in the same column',
    usage: 'HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])',
    execute: (args, cells) => {
      // Simplified implementation
      return 'HLOOKUP not fully implemented';
    }
  },
  ROUND: {
    name: 'ROUND',
    description: 'Rounds a number to a specified number of digits',
    usage: 'ROUND(number, num_digits)',
    execute: (args, cells) => {
      if (args.length < 2) return '#ERROR';
      const num = parseFloat(String(args[0]));
      const digits = parseInt(String(args[1]));
      if (isNaN(num) || isNaN(digits)) return '#ERROR';
      const factor = Math.pow(10, digits);
      return Math.round(num * factor) / factor;
    }
  },
  TODAY: {
    name: 'TODAY',
    description: 'Returns the current date',
    usage: 'TODAY()',
    execute: (args, cells) => {
      const today = new Date();
      return `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    }
  },
  NOW: {
    name: 'NOW',
    description: 'Returns the current date and time',
    usage: 'NOW()',
    execute: (args, cells) => {
      const now = new Date();
      return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    }
  },
  DATE: {
    name: 'DATE',
    description: 'Returns the number that represents the date in Excel date-time code',
    usage: 'DATE(year, month, day)',
    execute: (args, cells) => {
      if (args.length < 3) return '#ERROR';
      const year = parseInt(String(args[0]));
      const month = parseInt(String(args[1]));
      const day = parseInt(String(args[2]));
      if (isNaN(year) || isNaN(month) || isNaN(day)) return '#ERROR';
      return `${month}/${day}/${year}`;
    }
  },
  AND: {
    name: 'AND',
    description: 'Returns TRUE if all its arguments are TRUE',
    usage: 'AND(logical1, [logical2], ...)',
    execute: (args, cells) => {
      return args.every(arg => !!arg);
    }
  },
  OR: {
    name: 'OR',
    description: 'Returns TRUE if any argument is TRUE',
    usage: 'OR(logical1, [logical2], ...)',
    execute: (args, cells) => {
      return args.some(arg => !!arg);
    }
  },
  NOT: {
    name: 'NOT',
    description: 'Reverses the logic of its argument',
    usage: 'NOT(logical)',
    execute: (args, cells) => {
      if (args.length === 0) return '#ERROR';
      return !args[0];
    }
  },
  IFERROR: {
    name: 'IFERROR',
    description: 'Returns a value if an expression evaluates to an error; otherwise returns the result of the expression',
    usage: 'IFERROR(value, value_if_error)',
    execute: (args, cells) => {
      if (args.length < 2) return '#ERROR';
      const value = args[0];
      return value === '#ERROR' ? args[1] : value;
    }
  }
};

// Function to convert cell reference range into array of cell references
function expandCellRangeToReferences(range: string): string[] {
  const match = range.match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
  if (!match) return [range];
  
  const [_, startCol, startRow, endCol, endRow] = match;
  const cellRefs = [];
  
  const startColIndex = startCol.charCodeAt(0) - 65; // Convert 'A' to 0, 'B' to 1, etc.
  const endColIndex = endCol.charCodeAt(0) - 65;
  const startRowNum = parseInt(startRow);
  const endRowNum = parseInt(endRow);
  
  for (let col = startColIndex; col <= endColIndex; col++) {
    for (let row = startRowNum; row <= endRowNum; row++) {
      cellRefs.push(`${String.fromCharCode(65 + col)}${row}`);
    }
  }
  
  return cellRefs;
}

// Enhanced formula parser
function parseFormula(formula: string, cells: Record<string, Cell>): string {
  // Handle function calls first (e.g., SUM(A1:A5))
  const functionRegex = /([A-Z]+)\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g;
  let match;
  let parsedFormula = formula;
  
  // Process functions from innermost to outermost
  while ((match = functionRegex.exec(parsedFormula)) !== null) {
    const [fullMatch, funcName, argsText] = match;
    
    // Check if function exists
    if (formulaFunctions[funcName as FormulaFunctionName]) {
      const func = formulaFunctions[funcName as FormulaFunctionName];
      
      // Parse arguments
      let args: any[] = [];
      if (argsText.trim()) {
        // Split by commas, but respect nested functions
        const argsArray = argsText.split(',').map(arg => arg.trim());
        
        // Process each argument
        args = argsArray.map(arg => {
          // Check if it's a range (e.g., A1:A5)
          if (arg.includes(':')) {
            const cellRefs = expandCellRangeToReferences(arg);
            return cellRefs.map(ref => {
              if (cells[ref]) {
                const cellValue = cells[ref].value;
                // If the cell contains a formula, evaluate it recursively
                if (cellValue && cellValue.startsWith('=')) {
                  return evaluateFormula(cellValue.substring(1), cells);
                }
                return isNaN(Number(cellValue)) ? cellValue : Number(cellValue);
              }
              return 0;
            });
          } 
          // Check if it's a cell reference
          else if (/^[A-Z]+\d+$/.test(arg)) {
            if (cells[arg]) {
              const cellValue = cells[arg].value;
              // If the cell contains a formula, evaluate it recursively
              if (cellValue && cellValue.startsWith('=')) {
                return evaluateFormula(cellValue.substring(1), cells);
              }
              return isNaN(Number(cellValue)) ? cellValue : Number(cellValue);
            }
            return 0;
          } 
          // Otherwise, it's a literal value
          else {
            return isNaN(Number(arg)) ? arg : Number(arg);
          }
        });
        
        // Flatten array arguments for functions like SUM
        if (funcName === 'SUM' || funcName === 'AVERAGE' || funcName === 'MIN' || funcName === 'MAX' || funcName === 'COUNT') {
          args = args.flat();
        }
      }
      
      // Execute function
      try {
        const result = func.execute(args, cells);
        
        // Replace the function call in the formula with its result
        parsedFormula = parsedFormula.replace(fullMatch, String(result));
        
        // Reset regex to start over with the new formula string
        functionRegex.lastIndex = 0;
      } catch (error) {
        console.error(`Error executing ${funcName}:`, error);
        parsedFormula = parsedFormula.replace(fullMatch, '#ERROR');
        functionRegex.lastIndex = 0;
      }
    } else {
      // Unknown function
      parsedFormula = parsedFormula.replace(fullMatch, '#UNKNOWN_FUNCTION');
      functionRegex.lastIndex = 0;
    }
  }
  
  return parsedFormula;
}

export function evaluateFormula(formula: string, cells: Record<string, Cell>): string {
  try {
    // Remove all spaces
    formula = formula.replace(/\s+/g, '');
    
    // Parse and evaluate functions
    const parsedFormula = parseFormula(formula, cells);
    
    // Basic cell reference pattern
    const cellPattern = /[A-Z]+\d+/g;
    
    // Replace remaining cell references with their values
    const formulaWithValues = parsedFormula.replace(cellPattern, (cellId) => {
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
  } catch (error) {
    console.error('Formula parsing error:', error);
    return '#ERROR';
  }
}

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
