import formulaFunctions from './formulaFunctions';
import { missingExcelFunctions } from './missingExcelFunctions';

// Comprehensive formula functions combining all Excel functionality
export const comprehensiveFormulas = {
  ...formulaFunctions,
  ...missingExcelFunctions,
  
  // Advanced Math Functions
  RANDBETWEEN: {
    name: 'RANDBETWEEN',
    description: 'Returns a random integer between two values',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('RANDBETWEEN requires exactly 2 arguments');
      const [min, max] = args.map(Number);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  },
  
  ROUND: {
    name: 'ROUND',
    description: 'Rounds a number to a specified number of digits',
    execute: (args: any[]) => {
      if (args.length < 1 || args.length > 2) throw new Error('ROUND requires 1 or 2 arguments');
      const number = Number(args[0]);
      const digits = args.length > 1 ? Number(args[1]) : 0;
      return Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
    }
  },
  
  ROUNDUP: {
    name: 'ROUNDUP',
    description: 'Rounds a number up to a specified number of digits',
    execute: (args: any[]) => {
      if (args.length < 1 || args.length > 2) throw new Error('ROUNDUP requires 1 or 2 arguments');
      const number = Number(args[0]);
      const digits = args.length > 1 ? Number(args[1]) : 0;
      return Math.ceil(number * Math.pow(10, digits)) / Math.pow(10, digits);
    }
  },
  
  ROUNDDOWN: {
    name: 'ROUNDDOWN',
    description: 'Rounds a number down to a specified number of digits',
    execute: (args: any[]) => {
      if (args.length < 1 || args.length > 2) throw new Error('ROUNDDOWN requires 1 or 2 arguments');
      const number = Number(args[0]);
      const digits = args.length > 1 ? Number(args[1]) : 0;
      return Math.floor(number * Math.pow(10, digits)) / Math.pow(10, digits);
    }
  },
  
  MOD: {
    name: 'MOD',
    description: 'Returns the remainder after division',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('MOD requires exactly 2 arguments');
      const [number, divisor] = args.map(Number);
      if (divisor === 0) return '#DIV/0!';
      return number % divisor;
    }
  },
  
  // Advanced Text Functions  
  FIND: {
    name: 'FIND',
    description: 'Finds one text string within another text string',
    execute: (args: any[]) => {
      if (args.length < 2 || args.length > 3) throw new Error('FIND requires 2 or 3 arguments');
      const [findText, withinText, startNum = 1] = args.map(String);
      const index = withinText.indexOf(findText, Number(startNum) - 1);
      return index === -1 ? '#VALUE!' : index + 1;
    }
  },
  
  SEARCH: {
    name: 'SEARCH',
    description: 'Finds one text string within another text string (case-insensitive)',
    execute: (args: any[]) => {
      if (args.length < 2 || args.length > 3) throw new Error('SEARCH requires 2 or 3 arguments');
      const [findText, withinText, startNum = 1] = args;
      const regex = new RegExp(String(findText), 'i');
      const match = String(withinText).substring(Number(startNum) - 1).match(regex);
      return match ? match.index + Number(startNum) : '#VALUE!';
    }
  },
  
  // Date Functions Extended
  DATEDIF: {
    name: 'DATEDIF',
    description: 'Calculates the difference between two dates',
    execute: (args: any[]) => {
      if (args.length !== 3) throw new Error('DATEDIF requires exactly 3 arguments');
      const [startDate, endDate, unit] = args;
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      switch(String(unit).toUpperCase()) {
        case 'Y': return end.getFullYear() - start.getFullYear();
        case 'M': return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        case 'D': return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        default: return '#VALUE!';
      }
    }
  },
  
  WEEKDAY: {
    name: 'WEEKDAY',
    description: 'Returns the day of the week',
    execute: (args: any[]) => {
      if (args.length < 1 || args.length > 2) throw new Error('WEEKDAY requires 1 or 2 arguments');
      const [date, type = 1] = args;
      const day = new Date(date).getDay();
      const typeNum = Number(type);
      
      switch(typeNum) {
        case 1: return day === 0 ? 7 : day; // Sunday = 7
        case 2: return day === 0 ? 6 : day - 1; // Monday = 0
        case 3: return day; // Sunday = 0
        default: return day;
      }
    }
  },
  
  // Array Functions
  SUMIF: {
    name: 'SUMIF',
    description: 'Sums cells that meet a criteria',
    execute: (args: any[]) => {
      if (args.length < 2 || args.length > 3) throw new Error('SUMIF requires 2 or 3 arguments');
      const [range, criteria, sumRange] = args;
      const rangeArray = Array.isArray(range) ? range.flat() : [range];
      const sumArray = sumRange ? (Array.isArray(sumRange) ? sumRange.flat() : [sumRange]) : rangeArray;
      
      return rangeArray.reduce((total, value, index) => {
        let match = false;
        const criteriaStr = String(criteria);
        
        if (criteriaStr.startsWith('>')) {
          const threshold = parseFloat(criteriaStr.substring(1));
          match = Number(value) > threshold;
        } else if (criteriaStr.startsWith('<')) {
          const threshold = parseFloat(criteriaStr.substring(1));
          match = Number(value) < threshold;
        } else {
          match = value == criteria;
        }
        
        return match ? total + Number(sumArray[index] || 0) : total;
      }, 0);
    }
  },
  
  COUNTIF: {
    name: 'COUNTIF',
    description: 'Counts cells that meet a criteria',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('COUNTIF requires exactly 2 arguments');
      const [range, criteria] = args;
      const rangeArray = Array.isArray(range) ? range.flat() : [range];
      
      return rangeArray.filter(value => {
        const criteriaStr = String(criteria);
        
        if (criteriaStr.startsWith('>')) {
          const threshold = parseFloat(criteriaStr.substring(1));
          return Number(value) > threshold;
        } else if (criteriaStr.startsWith('<')) {
          const threshold = parseFloat(criteriaStr.substring(1));
          return Number(value) < threshold;
        }
        return value == criteria;
      }).length;
    }
  },
  
  AVERAGEIF: {
    name: 'AVERAGEIF',
    description: 'Averages cells that meet a criteria',
    execute: (args: any[]) => {
      if (args.length < 2 || args.length > 3) throw new Error('AVERAGEIF requires 2 or 3 arguments');
      const [range, criteria, averageRange] = args;
      const rangeArray = Array.isArray(range) ? range.flat() : [range];
      const avgArray = averageRange ? (Array.isArray(averageRange) ? averageRange.flat() : [averageRange]) : rangeArray;
      
      const matchingValues: number[] = [];
      
      rangeArray.forEach((value, index) => {
        let match = false;
        const criteriaStr = String(criteria);
        
        if (criteriaStr.startsWith('>')) {
          const threshold = parseFloat(criteriaStr.substring(1));
          match = Number(value) > threshold;
        } else if (criteriaStr.startsWith('<')) {
          const threshold = parseFloat(criteriaStr.substring(1));
          match = Number(value) < threshold;
        } else {
          match = value == criteria;
        }
        
        if (match && avgArray[index] !== undefined) {
          matchingValues.push(Number(avgArray[index]));
        }
      });
      
      return matchingValues.length > 0 ? 
        matchingValues.reduce((sum, val) => sum + val, 0) / matchingValues.length : 0;
    }
  }
};

export default comprehensiveFormulas;