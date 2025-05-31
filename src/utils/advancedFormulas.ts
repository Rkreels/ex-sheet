
import { Cell } from '../types/sheet';

// Advanced formula evaluation with better error handling and more functions
export const advancedFormulaFunctions = {
  // Statistical functions
  STDEV: (args: any[]) => {
    const numbers = args.flat().filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
    if (numbers.length < 2) return '#N/A';
    
    const mean = numbers.reduce((sum, val) => sum + val, 0) / numbers.length;
    const variance = numbers.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (numbers.length - 1);
    return Math.sqrt(variance);
  },

  MEDIAN: (args: any[]) => {
    const numbers = args.flat().filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val)).sort((a, b) => a - b);
    if (numbers.length === 0) return '#N/A';
    
    const mid = Math.floor(numbers.length / 2);
    return numbers.length % 2 === 0 ? (numbers[mid - 1] + numbers[mid]) / 2 : numbers[mid];
  },

  MODE: (args: any[]) => {
    const numbers = args.flat().filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
    const frequency: Record<number, number> = {};
    
    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    
    let maxFreq = 0;
    let mode = 0;
    
    Object.entries(frequency).forEach(([num, freq]) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = parseFloat(num);
      }
    });
    
    return maxFreq > 1 ? mode : '#N/A';
  },

  // Text functions
  SUBSTITUTE: (args: any[]) => {
    if (args.length < 3) return '#VALUE!';
    const [text, oldText, newText, instanceNum] = args;
    
    if (instanceNum) {
      let count = 0;
      return text.replace(new RegExp(oldText, 'g'), (match: string) => {
        count++;
        return count === instanceNum ? newText : match;
      });
    }
    
    return text.replace(new RegExp(oldText, 'g'), newText);
  },

  FIND: (args: any[]) => {
    if (args.length < 2) return '#VALUE!';
    const [findText, withinText, startNum = 1] = args;
    const index = withinText.indexOf(findText, startNum - 1);
    return index !== -1 ? index + 1 : '#VALUE!';
  },

  // Date functions
  DATEDIF: (args: any[]) => {
    if (args.length < 3) return '#VALUE!';
    const [startDate, endDate, unit] = args;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '#VALUE!';
    
    const diffTime = end.getTime() - start.getTime();
    
    switch (unit.toUpperCase()) {
      case 'D':
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
      case 'M':
        return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      case 'Y':
        return end.getFullYear() - start.getFullYear();
      default:
        return '#VALUE!';
    }
  },

  WEEKDAY: (args: any[]) => {
    if (args.length < 1) return '#VALUE!';
    const date = new Date(args[0]);
    return isNaN(date.getTime()) ? '#VALUE!' : date.getDay() + 1;
  },

  // Logical functions
  SWITCH: (args: any[]) => {
    if (args.length < 3) return '#VALUE!';
    const [expression, ...cases] = args;
    
    for (let i = 0; i < cases.length - 1; i += 2) {
      if (expression === cases[i]) {
        return cases[i + 1];
      }
    }
    
    // Return default value if provided
    return cases.length % 2 === 1 ? cases[cases.length - 1] : '#N/A';
  },

  IFS: (args: any[]) => {
    if (args.length < 2 || args.length % 2 !== 0) return '#VALUE!';
    
    for (let i = 0; i < args.length; i += 2) {
      if (args[i]) {
        return args[i + 1];
      }
    }
    
    return '#N/A';
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
