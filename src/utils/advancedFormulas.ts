
import { Cell } from '../types/sheet';

// Enhanced formula functions with Excel-like capabilities
export const advancedFormulaFunctions = {
  // Lookup and Reference Functions
  XLOOKUP: (args: any[]) => {
    if (args.length < 3) return '#VALUE!';
    const [lookupValue, lookupArray, returnArray, ifNotFound = '#N/A', matchMode = 0, searchMode = 1] = args;
    
    const lookupValues = Array.isArray(lookupArray) ? lookupArray.flat() : [lookupArray];
    const returnValues = Array.isArray(returnArray) ? returnArray.flat() : [returnArray];
    
    for (let i = 0; i < lookupValues.length; i++) {
      if (lookupValues[i] === lookupValue) {
        return returnValues[i] || ifNotFound;
      }
    }
    
    return ifNotFound;
  },

  INDEX: (args: any[]) => {
    if (args.length < 2) return '#VALUE!';
    const [array, rowNum, colNum = 1] = args;
    
    if (Array.isArray(array)) {
      const flatArray = array.flat();
      const index = rowNum - 1;
      return flatArray[index] || '#REF!';
    }
    
    return array;
  },

  MATCH: (args: any[]) => {
    if (args.length < 2) return '#VALUE!';
    const [lookupValue, lookupArray, matchType = 1] = args;
    
    const values = Array.isArray(lookupArray) ? lookupArray.flat() : [lookupArray];
    
    for (let i = 0; i < values.length; i++) {
      if (values[i] === lookupValue) {
        return i + 1; // 1-based index
      }
    }
    
    return '#N/A';
  },

  // Dynamic Array Functions
  FILTER: (args: any[]) => {
    if (args.length < 2) return '#VALUE!';
    const [array, criteria] = args;
    
    const dataArray = Array.isArray(array) ? array : [array];
    const criteriaArray = Array.isArray(criteria) ? criteria : [criteria];
    
    return dataArray.filter((item, index) => {
      const criterion = criteriaArray[index] || criteriaArray[0];
      return Boolean(criterion);
    });
  },

  UNIQUE: (args: any[]) => {
    if (args.length < 1) return '#VALUE!';
    const [array] = args;
    
    const values = Array.isArray(array) ? array.flat() : [array];
    return [...new Set(values)];
  },

  SORT: (args: any[]) => {
    if (args.length < 1) return '#VALUE!';
    const [array, sortIndex = 1, sortOrder = 1, byCol = false] = args;
    
    const values = Array.isArray(array) ? array : [array];
    
    return values.sort((a, b) => {
      if (sortOrder === 1) {
        return a > b ? 1 : -1;
      } else {
        return a < b ? 1 : -1;
      }
    });
  },

  SEQUENCE: (args: any[]) => {
    if (args.length < 1) return '#VALUE!';
    const [rows, columns = 1, start = 1, step = 1] = args;
    
    const result = [];
    let value = start;
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push(value);
        value += step;
      }
      result.push(row);
    }
    
    return result;
  },

  // Advanced Statistical Functions
  STDEV: (args: any[]) => {
    const numbers = args.flat().filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
    if (numbers.length < 2) return '#N/A';
    
    const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
    const variance = numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (numbers.length - 1);
    return Math.sqrt(variance);
  },

  CORREL: (args: any[]) => {
    if (args.length < 2) return '#VALUE!';
    const [array1, array2] = args;
    
    const x = Array.isArray(array1) ? array1.flat().map(v => parseFloat(v)).filter(v => !isNaN(v)) : [parseFloat(array1)];
    const y = Array.isArray(array2) ? array2.flat().map(v => parseFloat(v)).filter(v => !isNaN(v)) : [parseFloat(array2)];
    
    if (x.length !== y.length || x.length === 0) return '#N/A';
    
    const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
    
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
    return denominator === 0 ? '#DIV/0!' : numerator / denominator;
  },

  // Financial Functions
  NPV: (args: any[]) => {
    if (args.length < 2) return '#VALUE!';
    const [rate, ...values] = args;
    
    const cashFlows = values.flat().map(v => parseFloat(v)).filter(v => !isNaN(v));
    let npv = 0;
    
    for (let i = 0; i < cashFlows.length; i++) {
      npv += cashFlows[i] / Math.pow(1 + rate, i + 1);
    }
    
    return npv;
  },

  IRR: (args: any[]) => {
    if (args.length < 1) return '#VALUE!';
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
        return '#NUM!';
      }
      
      rate = rate - npv / dnpv;
    }
    
    return '#NUM!';
  },

  PMT: (args: any[]) => {
    if (args.length < 3) return '#VALUE!';
    const [rate, nper, pv, fv = 0, type = 0] = args;
    
    if (rate === 0) {
      return -(pv + fv) / nper;
    }
    
    const factor = Math.pow(1 + rate, nper);
    const payment = (rate * (pv * factor + fv)) / ((type ? 1 + rate : 1) * (factor - 1));
    
    return -payment;
  },

  // Text Functions
  TEXTJOIN: (args: any[]) => {
    if (args.length < 3) return '#VALUE!';
    const [delimiter, ignoreEmpty, ...textValues] = args;
    
    const values = textValues.flat().map(v => String(v));
    
    if (ignoreEmpty) {
      return values.filter(v => v !== '').join(delimiter);
    } else {
      return values.join(delimiter);
    }
  },

  REGEX: (args: any[]) => {
    if (args.length < 2) return '#VALUE!';
    const [text, pattern, flags = 'g'] = args;
    
    try {
      const regex = new RegExp(pattern, flags);
      const matches = String(text).match(regex);
      return matches ? matches : '#N/A';
    } catch (error) {
      return '#VALUE!';
    }
  }
};

// Enhanced formula parser with better error handling
export const parseAdvancedFormula = (formula: string, cells: Record<string, Cell>): any => {
  try {
    // Remove the leading = sign
    let expression = formula.startsWith('=') ? formula.slice(1) : formula;
    
    // Handle cell references
    expression = expression.replace(/[A-Z]+[0-9]+/g, (cellRef) => {
      const cell = cells[cellRef];
      const value = cell?.value || '';
      
      // If it's a number, return it as is
      if (!isNaN(parseFloat(value)) && isFinite(parseFloat(value))) {
        return value;
      }
      
      // If it's text, wrap in quotes
      return `"${value}"`;
    });
    
    // Handle advanced functions
    Object.entries(advancedFormulaFunctions).forEach(([name, func]) => {
      const regex = new RegExp(`${name}\\(([^)]+)\\)`, 'gi');
      expression = expression.replace(regex, (match, argsStr) => {
        try {
          const args = argsStr.split(',').map((arg: string) => {
            const trimmed = arg.trim();
            // Try to parse as number
            const num = parseFloat(trimmed);
            if (!isNaN(num) && isFinite(num)) return num;
            // Remove quotes if it's a string
            return trimmed.replace(/^["'](.*)["']$/, '$1');
          });
          
          const result = func(args);
          return typeof result === 'number' ? result.toString() : `"${result}"`;
        } catch (error) {
          return '"#ERROR!"';
        }
      });
    });
    
    // Evaluate the expression
    return new Function(`return ${expression}`)();
  } catch (error) {
    return '#ERROR!';
  }
};
