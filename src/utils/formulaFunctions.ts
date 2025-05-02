
import { FormulaFunction, FormulaFunctionName } from '../types/sheet';

export const formulaFunctions: Record<FormulaFunctionName, FormulaFunction> = {
  SUM: {
    name: 'SUM',
    description: 'Adds all the numbers in a range of cells',
    usage: 'SUM(number1, [number2], ...)',
    execute: (...args) => args.reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
  },
  AVERAGE: {
    name: 'AVERAGE',
    description: 'Returns the average of its arguments',
    usage: 'AVERAGE(number1, [number2], ...)',
    execute: (...args) => {
      const validNumbers = args.filter(val => !isNaN(parseFloat(val)));
      if (validNumbers.length === 0) return 0;
      return validNumbers.reduce((sum, val) => sum + parseFloat(val), 0) / validNumbers.length;
    }
  },
  MIN: {
    name: 'MIN',
    description: 'Returns the minimum value in a list of arguments',
    usage: 'MIN(number1, [number2], ...)',
    execute: (...args) => {
      const validNumbers = args.filter(val => !isNaN(parseFloat(val)));
      if (validNumbers.length === 0) return 0;
      return Math.min(...validNumbers.map(val => parseFloat(val)));
    }
  },
  MAX: {
    name: 'MAX',
    description: 'Returns the maximum value in a list of arguments',
    usage: 'MAX(number1, [number2], ...)',
    execute: (...args) => {
      const validNumbers = args.filter(val => !isNaN(parseFloat(val)));
      if (validNumbers.length === 0) return 0;
      return Math.max(...validNumbers.map(val => parseFloat(val)));
    }
  },
  COUNT: {
    name: 'COUNT',
    description: 'Counts the number of cells that contain numbers',
    usage: 'COUNT(value1, [value2], ...)',
    execute: (...args) => args.filter(val => !isNaN(parseFloat(val))).length
  },
  IF: {
    name: 'IF',
    description: 'Returns one value if a condition is true and another if it is false',
    usage: 'IF(logical_test, value_if_true, value_if_false)',
    execute: (condition, trueResult, falseResult) => {
      return condition ? trueResult : falseResult;
    }
  },
  CONCATENATE: {
    name: 'CONCATENATE',
    description: 'Joins several text strings into one text string',
    usage: 'CONCATENATE(text1, [text2], ...)',
    execute: (...args) => args.join('')
  },
  VLOOKUP: {
    name: 'VLOOKUP',
    description: 'Looks up a value in the first column of a table and returns a value in the same row',
    usage: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    execute: () => 'VLOOKUP not fully implemented'
  },
  HLOOKUP: {
    name: 'HLOOKUP',
    description: 'Looks up a value in the top row of a table and returns a value in the same column',
    usage: 'HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])',
    execute: () => 'HLOOKUP not fully implemented'
  },
  ROUND: {
    name: 'ROUND',
    description: 'Rounds a number to a specified number of digits',
    usage: 'ROUND(number, num_digits)',
    execute: (number, digits) => {
      const power = Math.pow(10, parseInt(digits) || 0);
      return Math.round(parseFloat(number) * power) / power;
    }
  },
  TODAY: {
    name: 'TODAY',
    description: 'Returns the current date',
    usage: 'TODAY()',
    execute: () => {
      const today = new Date();
      return `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    }
  },
  NOW: {
    name: 'NOW',
    description: 'Returns the current date and time',
    usage: 'NOW()',
    execute: () => {
      return new Date().toLocaleString();
    }
  },
  DATE: {
    name: 'DATE',
    description: 'Returns a date value',
    usage: 'DATE(year, month, day)',
    execute: (year, month, day) => {
      try {
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString();
      } catch (error) {
        return '#ERROR';
      }
    }
  },
  AND: {
    name: 'AND',
    description: 'Returns TRUE if all its arguments are TRUE',
    usage: 'AND(logical1, [logical2], ...)',
    execute: (...args) => args.every(arg => arg && arg !== '0' && arg !== 'FALSE')
  },
  OR: {
    name: 'OR',
    description: 'Returns TRUE if any argument is TRUE',
    usage: 'OR(logical1, [logical2], ...)',
    execute: (...args) => args.some(arg => arg && arg !== '0' && arg !== 'FALSE')
  },
  NOT: {
    name: 'NOT',
    description: 'Reverses the logic of its argument',
    usage: 'NOT(logical)',
    execute: (logical) => !(logical && logical !== '0' && logical !== 'FALSE')
  },
  IFERROR: {
    name: 'IFERROR',
    description: 'Returns a value if an expression evaluates to an error; otherwise returns the result of the expression',
    usage: 'IFERROR(value, value_if_error)',
    execute: (value, valueIfError) => {
      return value !== '#ERROR' ? value : valueIfError;
    }
  }
};
