
import { FormulaFunction } from '../types/sheet';

// Advanced Excel-like formula functions
export const formulaFunctions: Record<string, FormulaFunction> = {
  SUM: {
    name: 'SUM',
    description: 'Adds all the numbers in a range of cells.',
    syntax: 'SUM(number1, [number2], ...)',
    example: 'SUM(A1:A10)',
    category: 'math',
    minArgs: 1,
    maxArgs: 255,
    usage: 'SUM(number1, [number2], ...)',
    execute: (args: any[]) => {
      return args.reduce((sum, val) => {
        const num = parseFloat(val);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
    }
  },
  
  AVERAGE: {
    name: 'AVERAGE',
    description: 'Returns the average (arithmetic mean) of the arguments.',
    syntax: 'AVERAGE(number1, [number2], ...)',
    example: 'AVERAGE(A1:A10)',
    category: 'statistical',
    minArgs: 1,
    maxArgs: 255,
    usage: 'AVERAGE(number1, [number2], ...)',
    execute: (args: any[]) => {
      if (args.length === 0) return 0;
      const sum = args.reduce((acc, val) => {
        const num = parseFloat(val);
        return acc + (isNaN(num) ? 0 : num);
      }, 0);
      return sum / args.length;
    }
  },
  
  MIN: {
    name: 'MIN',
    description: 'Returns the minimum value in a list of arguments.',
    syntax: 'MIN(number1, [number2], ...)',
    example: 'MIN(A1:A10)',
    category: 'statistical',
    minArgs: 1,
    maxArgs: 255,
    usage: 'MIN(number1, [number2], ...)',
    execute: (args: any[]) => {
      if (args.length === 0) return 0;
      return Math.min(...args.map(val => {
        const num = parseFloat(val);
        return isNaN(num) ? Infinity : num;
      }));
    }
  },
  
  MAX: {
    name: 'MAX',
    description: 'Returns the maximum value in a list of arguments.',
    syntax: 'MAX(number1, [number2], ...)',
    example: 'MAX(A1:A10)',
    category: 'statistical',
    minArgs: 1,
    maxArgs: 255,
    usage: 'MAX(number1, [number2], ...)',
    execute: (args: any[]) => {
      if (args.length === 0) return 0;
      return Math.max(...args.map(val => {
        const num = parseFloat(val);
        return isNaN(num) ? -Infinity : num;
      }));
    }
  },
  
  COUNT: {
    name: 'COUNT',
    description: 'Counts how many numbers are in the list of arguments.',
    syntax: 'COUNT(value1, [value2], ...)',
    example: 'COUNT(A1:A10)',
    category: 'statistical',
    minArgs: 1,
    maxArgs: 255,
    usage: 'COUNT(value1, [value2], ...)',
    execute: (args: any[]) => {
      return args.filter(val => {
        const num = parseFloat(val);
        return !isNaN(num);
      }).length;
    }
  },
  
  IF: {
    name: 'IF',
    description: 'Returns one value if a condition is true and another value if false.',
    syntax: 'IF(logical_test, value_if_true, [value_if_false])',
    example: 'IF(A1>10, "High", "Low")',
    category: 'logical',
    minArgs: 2,
    maxArgs: 3,
    usage: 'IF(logical_test, value_if_true, [value_if_false])',
    execute: (args: any[]) => {
      const [test, valueIfTrue, valueIfFalse = ""] = args;
      return Boolean(test) ? valueIfTrue : valueIfFalse;
    }
  },
  
  CONCATENATE: {
    name: 'CONCATENATE',
    description: 'Joins several text strings into one text string.',
    syntax: 'CONCATENATE(text1, [text2], ...)',
    example: 'CONCATENATE("Hello", " ", "World")',
    category: 'text',
    minArgs: 1,
    maxArgs: 255,
    usage: 'CONCATENATE(text1, [text2], ...)',
    execute: (args: any[]) => {
      return args.join("");
    }
  },
  
  VLOOKUP: {
    name: 'VLOOKUP',
    description: 'Looks up a value in the first column of a range and returns a value in the same row from a column you specify.',
    syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    example: 'VLOOKUP("John", A1:C10, 2, FALSE)',
    category: 'lookup',
    minArgs: 3,
    maxArgs: 4,
    usage: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    execute: (args: any[]) => {
      const [lookupValue, tableArray, colIndexNum, rangeLoopup = true] = args;
      
      if (!Array.isArray(tableArray) || tableArray.length === 0) return "#VALUE!";
      
      for (let i = 0; i < tableArray.length; i++) {
        const row = tableArray[i];
        if (!row || row.length === 0) continue;
        
        if (rangeLoopup) {
          if (row[0] === lookupValue || (row[0] >= lookupValue && i > 0)) {
            const matchRow = row[0] === lookupValue ? row : tableArray[i - 1];
            return colIndexNum <= matchRow.length ? matchRow[colIndexNum - 1] : "#REF!";
          }
        } else {
          if (row[0] === lookupValue) {
            return colIndexNum <= row.length ? row[colIndexNum - 1] : "#REF!";
          }
        }
      }
      
      return "#N/A";
    }
  },
  
  TODAY: {
    name: 'TODAY',
    description: 'Returns the current date.',
    syntax: 'TODAY()',
    example: 'TODAY()',
    category: 'date',
    minArgs: 0,
    maxArgs: 0,
    usage: 'TODAY()',
    execute: (args: any[]) => {
      const today = new Date();
      return today.toLocaleDateString();
    }
  },
  
  NOW: {
    name: 'NOW',
    description: 'Returns the current date and time.',
    syntax: 'NOW()',
    example: 'NOW()',
    category: 'date',
    minArgs: 0,
    maxArgs: 0,
    usage: 'NOW()',
    execute: (args: any[]) => {
      const now = new Date();
      return now.toLocaleString();
    }
  },
  
  LEFT: {
    name: 'LEFT',
    description: 'Returns the specified number of characters from the start of a text string.',
    syntax: 'LEFT(text, num_chars)',
    example: 'LEFT("Hello", 3)',
    category: 'text',
    minArgs: 1,
    maxArgs: 2,
    usage: 'LEFT(text, num_chars)',
    execute: (args: any[]) => {
      const [text, numChars = 1] = args;
      if (typeof text !== 'string') return '';
      return text.substring(0, numChars);
    }
  },
  
  RIGHT: {
    name: 'RIGHT',
    description: 'Returns the specified number of characters from the end of a text string.',
    syntax: 'RIGHT(text, num_chars)',
    example: 'RIGHT("Hello", 3)',
    category: 'text',
    minArgs: 1,
    maxArgs: 2,
    usage: 'RIGHT(text, num_chars)',
    execute: (args: any[]) => {
      const [text, numChars = 1] = args;
      if (typeof text !== 'string') return '';
      return text.substring(text.length - numChars);
    }
  },
  
  MID: {
    name: 'MID',
    description: 'Returns the characters from the middle of a text string, given a starting position and length.',
    syntax: 'MID(text, start_num, num_chars)',
    example: 'MID("Hello", 2, 3)',
    category: 'text',
    minArgs: 3,
    maxArgs: 3,
    usage: 'MID(text, start_num, num_chars)',
    execute: (args: any[]) => {
      const [text, startNum, numChars] = args;
      if (typeof text !== 'string') return '';
      return text.substring(startNum - 1, startNum - 1 + numChars);
    }
  },
  
  AND: {
    name: 'AND',
    description: 'Returns TRUE if all arguments are TRUE.',
    syntax: 'AND(logical1, [logical2], ...)',
    example: 'AND(A1>5, B1<10)',
    category: 'logical',
    minArgs: 1,
    maxArgs: 255,
    usage: 'AND(logical1, [logical2], ...)',
    execute: (args: any[]) => {
      return args.every(Boolean);
    }
  },
  
  OR: {
    name: 'OR',
    description: 'Returns TRUE if any argument is TRUE.',
    syntax: 'OR(logical1, [logical2], ...)',
    example: 'OR(A1>5, B1<10)',
    category: 'logical',
    minArgs: 1,
    maxArgs: 255,
    usage: 'OR(logical1, [logical2], ...)',
    execute: (args: any[]) => {
      return args.some(Boolean);
    }
  },
  
  NOT: {
    name: 'NOT',
    description: 'Reverses the logical value of its argument.',
    syntax: 'NOT(logical)',
    example: 'NOT(A1>5)',
    category: 'logical',
    minArgs: 1,
    maxArgs: 1,
    usage: 'NOT(logical)',
    execute: (args: any[]) => {
      return !Boolean(args[0]);
    }
  }
};

export default formulaFunctions;
