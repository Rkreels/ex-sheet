
import { Cell } from '../types/sheet';
import { getCellRangeData } from './formulaEvaluator';

// Basic Math Functions
export const SUM = (args: any[]): number => {
  const flatArgs = args.flat(Infinity).filter(val => !isNaN(parseFloat(val)));
  return flatArgs.reduce((sum, val) => sum + parseFloat(val), 0);
};

export const AVERAGE = (args: any[]): number => {
  const flatArgs = args.flat(Infinity).filter(val => !isNaN(parseFloat(val)));
  return flatArgs.length > 0 ? SUM(flatArgs) / flatArgs.length : 0;
};

export const COUNT = (args: any[]): number => {
  return args.flat(Infinity).filter(val => !isNaN(parseFloat(val))).length;
};

export const MAX = (args: any[]): number => {
  const flatArgs = args.flat(Infinity).filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
  return flatArgs.length > 0 ? Math.max(...flatArgs) : 0;
};

export const MIN = (args: any[]): number => {
  const flatArgs = args.flat(Infinity).filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
  return flatArgs.length > 0 ? Math.min(...flatArgs) : 0;
};

// Lookup and Reference Functions
export const VLOOKUP = (args: any[]): any => {
  if (args.length < 3) return '#N/A';
  const [lookupValue, tableArray, colIndex, rangeLookup = false] = args;
  
  const table = Array.isArray(tableArray) ? tableArray : [tableArray];
  for (let row of table) {
    const rowArray = Array.isArray(row) ? row : [row];
    if (rowArray[0] === lookupValue) {
      return rowArray[colIndex - 1] || '#N/A';
    }
  }
  return '#N/A';
};

export const HLOOKUP = (args: any[]): any => {
  if (args.length < 3) return '#N/A';
  const [lookupValue, tableArray, rowIndex, rangeLookup = false] = args;
  
  const table = Array.isArray(tableArray) ? tableArray : [tableArray];
  const firstRow = Array.isArray(table[0]) ? table[0] : [table[0]];
  
  const colIndex = firstRow.indexOf(lookupValue);
  if (colIndex === -1) return '#N/A';
  
  const targetRow = table[rowIndex - 1];
  return Array.isArray(targetRow) ? targetRow[colIndex] : targetRow;
};

export const XLOOKUP = (args: any[]): any => {
  if (args.length < 3) return '#N/A';
  const [lookupValue, lookupArray, returnArray, ifNotFound = '#N/A'] = args;
  
  const lookupValues = Array.isArray(lookupArray) ? lookupArray.flat() : [lookupArray];
  const returnValues = Array.isArray(returnArray) ? returnArray.flat() : [returnArray];
  
  const index = lookupValues.indexOf(lookupValue);
  return index !== -1 ? returnValues[index] : ifNotFound;
};

export const INDEX = (args: any[]): any => {
  if (args.length < 2) return '#REF!';
  const [array, rowNum, colNum = 1] = args;
  
  if (Array.isArray(array)) {
    if (Array.isArray(array[0])) {
      // 2D array
      return array[rowNum - 1]?.[colNum - 1] || '#REF!';
    } else {
      // 1D array
      return array[rowNum - 1] || '#REF!';
    }
  }
  return array;
};

export const MATCH = (args: any[]): any => {
  if (args.length < 2) return '#N/A';
  const [lookupValue, lookupArray, matchType = 1] = args;
  
  const values = Array.isArray(lookupArray) ? lookupArray.flat() : [lookupArray];
  const index = values.indexOf(lookupValue);
  return index !== -1 ? index + 1 : '#N/A';
};

// Dynamic Array Functions
export const FILTER = (args: any[]): any => {
  if (args.length < 2) return '#VALUE!';
  const [array, criteria] = args;
  
  const dataArray = Array.isArray(array) ? array : [array];
  const criteriaArray = Array.isArray(criteria) ? criteria : [criteria];
  
  return dataArray.filter((item, index) => {
    const criterion = criteriaArray[index] || criteriaArray[0];
    return Boolean(criterion);
  });
};

export const UNIQUE = (args: any[]): any => {
  if (args.length < 1) return '#VALUE!';
  const [array] = args;
  
  const values = Array.isArray(array) ? array.flat() : [array];
  return [...new Set(values)];
};

export const SORT = (args: any[]): any => {
  if (args.length < 1) return '#VALUE!';
  const [array, sortIndex = 1, sortOrder = 1] = args;
  
  const values = Array.isArray(array) ? [...array] : [array];
  
  return values.sort((a, b) => {
    const aVal = Array.isArray(a) ? a[sortIndex - 1] : a;
    const bVal = Array.isArray(b) ? b[sortIndex - 1] : b;
    
    if (sortOrder === 1) {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

export const SEQUENCE = (args: any[]): any => {
  if (args.length < 1) return '#VALUE!';
  const [rows, columns = 1, start = 1, step = 1] = args;
  
  const result = [];
  let value = start;
  
  for (let i = 0; i < rows; i++) {
    if (columns === 1) {
      result.push(value);
      value += step;
    } else {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(value);
        value += step;
      }
      result.push(row);
    }
  }
  
  return result;
};

// Logical Functions
export const IF = (args: any[]): any => {
  if (args.length < 2) return '#VALUE!';
  const [condition, trueValue, falseValue = ''] = args;
  return condition ? trueValue : falseValue;
};

export const AND = (args: any[]): boolean => {
  return args.every(arg => Boolean(arg));
};

export const OR = (args: any[]): boolean => {
  return args.some(arg => Boolean(arg));
};

export const NOT = (args: any[]): boolean => {
  return !Boolean(args[0]);
};

export const IFERROR = (args: any[]): any => {
  if (args.length < 2) return '#VALUE!';
  const [value, errorValue] = args;
  
  if (typeof value === 'string' && value.startsWith('#')) {
    return errorValue;
  }
  return value;
};

// Text Functions
export const CONCATENATE = (args: any[]): string => {
  return args.map(arg => String(arg)).join('');
};

export const LEFT = (args: any[]): string => {
  if (args.length < 1) return '';
  const [text, numChars = 1] = args;
  return String(text).substring(0, numChars);
};

export const RIGHT = (args: any[]): string => {
  if (args.length < 1) return '';
  const [text, numChars = 1] = args;
  const str = String(text);
  return str.substring(str.length - numChars);
};

export const MID = (args: any[]): string => {
  if (args.length < 2) return '';
  const [text, startNum, numChars] = args;
  return String(text).substring(startNum - 1, startNum - 1 + (numChars || 1));
};

export const LEN = (args: any[]): number => {
  return String(args[0] || '').length;
};

export const UPPER = (args: any[]): string => {
  return String(args[0] || '').toUpperCase();
};

export const LOWER = (args: any[]): string => {
  return String(args[0] || '').toLowerCase();
};

export const TEXTJOIN = (args: any[]): string => {
  if (args.length < 3) return '';
  const [delimiter, ignoreEmpty, ...textValues] = args;
  
  const values = textValues.flat().map(v => String(v));
  
  if (ignoreEmpty) {
    return values.filter(v => v !== '').join(delimiter);
  } else {
    return values.join(delimiter);
  }
};

// Date Functions
export const NOW = (): string => {
  return new Date().toLocaleString();
};

export const TODAY = (): string => {
  return new Date().toLocaleDateString();
};

export const DATE = (args: any[]): string => {
  if (args.length < 3) return '#VALUE!';
  const [year, month, day] = args;
  return new Date(year, month - 1, day).toLocaleDateString();
};

export const YEAR = (args: any[]): number => {
  const date = new Date(args[0]);
  return date.getFullYear();
};

export const MONTH = (args: any[]): number => {
  const date = new Date(args[0]);
  return date.getMonth() + 1;
};

export const DAY = (args: any[]): number => {
  const date = new Date(args[0]);
  return date.getDate();
};

// Statistical Functions
export const STDEV = (args: any[]): number => {
  const numbers = args.flat().filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
  if (numbers.length < 2) return 0;
  
  const mean = AVERAGE(numbers);
  const variance = numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (numbers.length - 1);
  return Math.sqrt(variance);
};

export const VAR = (args: any[]): number => {
  const numbers = args.flat().filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
  if (numbers.length < 2) return 0;
  
  const mean = AVERAGE(numbers);
  return numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (numbers.length - 1);
};

export const CORREL = (args: any[]): number => {
  if (args.length < 2) return 0;
  const [array1, array2] = args;
  
  const x = Array.isArray(array1) ? array1.flat().map(v => parseFloat(v)).filter(v => !isNaN(v)) : [parseFloat(array1)];
  const y = Array.isArray(array2) ? array2.flat().map(v => parseFloat(v)).filter(v => !isNaN(v)) : [parseFloat(array2)];
  
  if (x.length !== y.length || x.length === 0) return 0;
  
  const meanX = AVERAGE(x);
  const meanY = AVERAGE(y);
  
  let numerator = 0;
  let sumSqX = 0;
  let sumSqY = 0;
  
  for (let i = 0; i < x.length; i++) {
    const deltaX = x[i] - meanX;
    const deltaY = y[i] - meanY;
    numerator += deltaX * deltaY;
    sumSqX += deltaX * deltaX;
    sumSqY += deltaY * deltaY;
  }
  
  const denominator = Math.sqrt(sumSqX * sumSqY);
  return denominator === 0 ? 0 : numerator / denominator;
};

// Financial Functions
export const NPV = (args: any[]): number => {
  if (args.length < 2) return 0;
  const [rate, ...values] = args;
  
  const cashFlows = values.flat().map(v => parseFloat(v)).filter(v => !isNaN(v));
  let npv = 0;
  
  for (let i = 0; i < cashFlows.length; i++) {
    npv += cashFlows[i] / Math.pow(1 + rate, i + 1);
  }
  
  return npv;
};

export const IRR = (args: any[]): number => {
  if (args.length < 1) return 0;
  const [values] = args;
  
  const cashFlows = Array.isArray(values) ? values.flat().map(v => parseFloat(v)) : [parseFloat(values)];
  
  // Simple IRR calculation using Newton-Raphson method
  let rate = 0.1; // Initial guess
  const maxIterations = 100;
  const tolerance = 1e-6;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;
    
    for (let j = 0; j < cashFlows.length; j++) {
      const factor = Math.pow(1 + rate, j);
      npv += cashFlows[j] / factor;
      dnpv -= j * cashFlows[j] / (factor * (1 + rate));
    }
    
    if (Math.abs(npv) < tolerance) {
      return rate;
    }
    
    if (dnpv === 0) {
      return 0;
    }
    
    rate = rate - npv / dnpv;
  }
  
  return rate;
};

export const PMT = (args: any[]): number => {
  if (args.length < 3) return 0;
  const [rate, nper, pv, fv = 0, type = 0] = args;
  
  if (rate === 0) {
    return -(pv + fv) / nper;
  }
  
  const factor = Math.pow(1 + rate, nper);
  const payment = (rate * (pv * factor + fv)) / ((type ? 1 + rate : 1) * (factor - 1));
  
  return -payment;
};

// Export all functions
export const formulaFunctions: Record<string, any> = {
  // Math
  SUM: { execute: SUM, category: 'math', description: 'Adds all numbers in a range' },
  AVERAGE: { execute: AVERAGE, category: 'math', description: 'Returns the average of numbers' },
  COUNT: { execute: COUNT, category: 'math', description: 'Counts the number of cells with numbers' },
  MAX: { execute: MAX, category: 'math', description: 'Returns the largest value' },
  MIN: { execute: MIN, category: 'math', description: 'Returns the smallest value' },
  
  // Lookup
  VLOOKUP: { execute: VLOOKUP, category: 'lookup', description: 'Vertical lookup in a table' },
  HLOOKUP: { execute: HLOOKUP, category: 'lookup', description: 'Horizontal lookup in a table' },
  XLOOKUP: { execute: XLOOKUP, category: 'lookup', description: 'Modern lookup function' },
  INDEX: { execute: INDEX, category: 'lookup', description: 'Returns a value from a specific position' },
  MATCH: { execute: MATCH, category: 'lookup', description: 'Finds the position of a value' },
  
  // Dynamic Arrays
  FILTER: { execute: FILTER, category: 'lookup', description: 'Filters an array based on criteria' },
  UNIQUE: { execute: UNIQUE, category: 'lookup', description: 'Returns unique values from a range' },
  SORT: { execute: SORT, category: 'lookup', description: 'Sorts an array' },
  SEQUENCE: { execute: SEQUENCE, category: 'lookup', description: 'Generates a sequence of numbers' },
  
  // Logical
  IF: { execute: IF, category: 'logical', description: 'Returns one value if true, another if false' },
  AND: { execute: AND, category: 'logical', description: 'Returns TRUE if all arguments are TRUE' },
  OR: { execute: OR, category: 'logical', description: 'Returns TRUE if any argument is TRUE' },
  NOT: { execute: NOT, category: 'logical', description: 'Reverses the logic of its argument' },
  IFERROR: { execute: IFERROR, category: 'logical', description: 'Returns a value if no error, otherwise returns error value' },
  
  // Text
  CONCATENATE: { execute: CONCATENATE, category: 'text', description: 'Joins text strings' },
  LEFT: { execute: LEFT, category: 'text', description: 'Returns leftmost characters' },
  RIGHT: { execute: RIGHT, category: 'text', description: 'Returns rightmost characters' },
  MID: { execute: MID, category: 'text', description: 'Returns characters from the middle' },
  LEN: { execute: LEN, category: 'text', description: 'Returns the length of text' },
  UPPER: { execute: UPPER, category: 'text', description: 'Converts text to uppercase' },
  LOWER: { execute: LOWER, category: 'text', description: 'Converts text to lowercase' },
  TEXTJOIN: { execute: TEXTJOIN, category: 'text', description: 'Joins text with a delimiter' },
  
  // Date
  NOW: { execute: NOW, category: 'date', description: 'Returns current date and time' },
  TODAY: { execute: TODAY, category: 'date', description: 'Returns current date' },
  DATE: { execute: DATE, category: 'date', description: 'Creates a date from year, month, day' },
  YEAR: { execute: YEAR, category: 'date', description: 'Returns the year from a date' },
  MONTH: { execute: MONTH, category: 'date', description: 'Returns the month from a date' },
  DAY: { execute: DAY, category: 'date', description: 'Returns the day from a date' },
  
  // Statistical
  STDEV: { execute: STDEV, category: 'statistical', description: 'Returns standard deviation' },
  VAR: { execute: VAR, category: 'statistical', description: 'Returns variance' },
  CORREL: { execute: CORREL, category: 'statistical', description: 'Returns correlation coefficient' },
  
  // Financial
  NPV: { execute: NPV, category: 'financial', description: 'Returns net present value' },
  IRR: { execute: IRR, category: 'financial', description: 'Returns internal rate of return' },
  PMT: { execute: PMT, category: 'financial', description: 'Returns payment for a loan' }
};

export default formulaFunctions;
