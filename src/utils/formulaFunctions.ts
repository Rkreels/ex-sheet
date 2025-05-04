
import { FormulaFunction } from '../types/sheet';

// Advanced Excel-like formula functions
export const formulaFunctions: Record<string, FormulaFunction> = {
  SUM: {
    name: 'SUM',
    description: 'Adds all the numbers in a range of cells.',
    usage: 'SUM(number1, [number2], ...)',
    execute: (...args: any[]) => {
      return args.reduce((sum, val) => {
        const num = parseFloat(val);
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
    }
  },
  
  AVERAGE: {
    name: 'AVERAGE',
    description: 'Returns the average (arithmetic mean) of the arguments.',
    usage: 'AVERAGE(number1, [number2], ...)',
    execute: (...args: any[]) => {
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
    usage: 'MIN(number1, [number2], ...)',
    execute: (...args: any[]) => {
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
    usage: 'MAX(number1, [number2], ...)',
    execute: (...args: any[]) => {
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
    usage: 'COUNT(value1, [value2], ...)',
    execute: (...args: any[]) => {
      return args.filter(val => {
        const num = parseFloat(val);
        return !isNaN(num);
      }).length;
    }
  },
  
  IF: {
    name: 'IF',
    description: 'Returns one value if a condition is true and another value if false.',
    usage: 'IF(logical_test, value_if_true, [value_if_false])',
    execute: (test: any, valueIfTrue: any, valueIfFalse: any = "") => {
      return Boolean(test) ? valueIfTrue : valueIfFalse;
    }
  },
  
  CONCATENATE: {
    name: 'CONCATENATE',
    description: 'Joins several text strings into one text string.',
    usage: 'CONCATENATE(text1, [text2], ...)',
    execute: (...args: any[]) => {
      return args.join("");
    }
  },
  
  VLOOKUP: {
    name: 'VLOOKUP',
    description: 'Looks up a value in the first column of a range and returns a value in the same row from a column you specify.',
    usage: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    execute: (lookupValue: any, tableArray: any[][], colIndexNum: number, rangeLoopup: boolean = true) => {
      // Simplified implementation
      if (!Array.isArray(tableArray) || tableArray.length === 0) return "#VALUE!";
      
      for (let i = 0; i < tableArray.length; i++) {
        const row = tableArray[i];
        if (!row || row.length === 0) continue;
        
        if (rangeLoopup) {
          // Approximate match
          if (row[0] === lookupValue || (row[0] >= lookupValue && i > 0)) {
            const matchRow = row[0] === lookupValue ? row : tableArray[i - 1];
            return colIndexNum <= matchRow.length ? matchRow[colIndexNum - 1] : "#REF!";
          }
        } else {
          // Exact match
          if (row[0] === lookupValue) {
            return colIndexNum <= row.length ? row[colIndexNum - 1] : "#REF!";
          }
        }
      }
      
      return "#N/A";
    }
  },
  
  ROUND: {
    name: 'ROUND',
    description: 'Rounds a number to a specified number of digits.',
    usage: 'ROUND(number, num_digits)',
    execute: (number: number, numDigits: number) => {
      const multiplier = Math.pow(10, numDigits);
      return Math.round(number * multiplier) / multiplier;
    }
  },
  
  TODAY: {
    name: 'TODAY',
    description: 'Returns the current date.',
    usage: 'TODAY()',
    execute: () => {
      const today = new Date();
      return today.toLocaleDateString();
    }
  },
  
  NOW: {
    name: 'NOW',
    description: 'Returns the current date and time.',
    usage: 'NOW()',
    execute: () => {
      const now = new Date();
      return now.toLocaleString();
    }
  },
  
  COUNTIF: {
    name: 'COUNTIF',
    description: 'Counts the number of cells within a range that meet the given criteria.',
    usage: 'COUNTIF(range, criteria)',
    execute: (range: any[], criteria: any) => {
      if (!Array.isArray(range)) return 0;
      
      return range.filter(val => {
        if (typeof criteria === 'string' && criteria.startsWith('>')) {
          return val > parseFloat(criteria.substring(1));
        } else if (typeof criteria === 'string' && criteria.startsWith('<')) {
          return val < parseFloat(criteria.substring(1));
        } else if (typeof criteria === 'string' && criteria.startsWith('=')) {
          return val == criteria.substring(1);
        } else {
          return val == criteria;
        }
      }).length;
    }
  },
  
  SUMIF: {
    name: 'SUMIF',
    description: 'Adds the cells specified by a given criteria.',
    usage: 'SUMIF(range, criteria, [sum_range])',
    execute: (range: any[], criteria: any, sumRange?: any[]) => {
      if (!Array.isArray(range)) return 0;
      
      const rangesToSum = sumRange || range;
      let sum = 0;
      
      range.forEach((val, index) => {
        let matches = false;
        
        if (typeof criteria === 'string' && criteria.startsWith('>')) {
          matches = val > parseFloat(criteria.substring(1));
        } else if (typeof criteria === 'string' && criteria.startsWith('<')) {
          matches = val < parseFloat(criteria.substring(1));
        } else if (typeof criteria === 'string' && criteria.startsWith('=')) {
          matches = val == criteria.substring(1);
        } else {
          matches = val == criteria;
        }
        
        if (matches && rangesToSum[index] !== undefined) {
          const num = parseFloat(rangesToSum[index]);
          if (!isNaN(num)) {
            sum += num;
          }
        }
      });
      
      return sum;
    }
  },
  
  TRIM: {
    name: 'TRIM',
    description: 'Removes extra spaces from text.',
    usage: 'TRIM(text)',
    execute: (text: string) => {
      if (typeof text !== 'string') return text;
      return text.trim().replace(/\s+/g, ' ');
    }
  },
  
  PROPER: {
    name: 'PROPER',
    description: 'Capitalizes the first letter in each word of a text value.',
    usage: 'PROPER(text)',
    execute: (text: string) => {
      if (typeof text !== 'string') return text;
      return text.toLowerCase().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
    }
  },
  
  UPPER: {
    name: 'UPPER',
    description: 'Converts text to uppercase.',
    usage: 'UPPER(text)',
    execute: (text: string) => {
      if (typeof text !== 'string') return text;
      return text.toUpperCase();
    }
  },
  
  LOWER: {
    name: 'LOWER',
    description: 'Converts text to lowercase.',
    usage: 'LOWER(text)',
    execute: (text: string) => {
      if (typeof text !== 'string') return text;
      return text.toLowerCase();
    }
  },
  
  IFERROR: {
    name: 'IFERROR',
    description: 'Returns a value if an expression is an error and another value if not.',
    usage: 'IFERROR(value, value_if_error)',
    execute: (value: any, valueIfError: any) => {
      if (typeof value === 'string' && value.startsWith('#')) {
        return valueIfError;
      }
      return value;
    }
  }
};

export default formulaFunctions;
