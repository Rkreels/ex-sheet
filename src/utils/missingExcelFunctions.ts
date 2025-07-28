// Additional Excel functions that were missing

export const missingExcelFunctions = {
  // Math Functions
  POWER: {
    name: 'POWER',
    description: 'Returns the result of a number raised to a power',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('POWER requires exactly 2 arguments');
      const [base, exponent] = args.map(Number);
      return Math.pow(base, exponent);
    }
  },
  
  SQRT: {
    name: 'SQRT',
    description: 'Returns the square root of a number',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('SQRT requires exactly 1 argument');
      const num = Number(args[0]);
      if (num < 0) return '#NUM!';
      return Math.sqrt(num);
    }
  },
  
  LOG: {
    name: 'LOG',
    description: 'Returns the logarithm of a number',
    execute: (args: any[]) => {
      if (args.length < 1 || args.length > 2) throw new Error('LOG requires 1 or 2 arguments');
      const num = Number(args[0]);
      const base = args.length > 1 ? Number(args[1]) : 10;
      if (num <= 0 || base <= 0 || base === 1) return '#NUM!';
      return Math.log(num) / Math.log(base);
    }
  },
  
  LN: {
    name: 'LN',
    description: 'Returns the natural logarithm of a number',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('LN requires exactly 1 argument');
      const num = Number(args[0]);
      if (num <= 0) return '#NUM!';
      return Math.log(num);
    }
  },
  
  FACT: {
    name: 'FACT',
    description: 'Returns the factorial of a number',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('FACT requires exactly 1 argument');
      const num = Number(args[0]);
      if (num < 0 || !Number.isInteger(num)) return '#NUM!';
      let result = 1;
      for (let i = 2; i <= num; i++) {
        result *= i;
      }
      return result;
    }
  },
  
  // Text Functions
  CONCATENATE: {
    name: 'CONCATENATE',
    description: 'Joins several text strings into one text string',
    execute: (args: any[]) => {
      return args.map(arg => String(arg)).join('');
    }
  },
  
  TRIM: {
    name: 'TRIM',
    description: 'Removes spaces from text',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('TRIM requires exactly 1 argument');
      return String(args[0]).trim();
    }
  },
  
  PROPER: {
    name: 'PROPER',
    description: 'Capitalizes the first letter in each word of a text value',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('PROPER requires exactly 1 argument');
      return String(args[0]).replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    }
  },
  
  SUBSTITUTE: {
    name: 'SUBSTITUTE',
    description: 'Substitutes text in a text string',
    execute: (args: any[]) => {
      if (args.length < 3 || args.length > 4) throw new Error('SUBSTITUTE requires 3 or 4 arguments');
      const [text, oldText, newText, instanceNum] = args.map(String);
      
      if (args.length === 4) {
        const num = Number(instanceNum);
        if (num <= 0) return text;
        
        let count = 0;
        let result = text;
        let index = 0;
        
        while ((index = result.indexOf(oldText, index)) !== -1) {
          count++;
          if (count === num) {
            result = result.substring(0, index) + newText + result.substring(index + oldText.length);
            break;
          }
          index += oldText.length;
        }
        return result;
      }
      
      return text.split(oldText).join(newText);
    }
  },
  
  // Date Functions
  TODAY: {
    name: 'TODAY',
    description: 'Returns the current date',
    execute: (args: any[]) => {
      if (args.length !== 0) throw new Error('TODAY requires no arguments');
      return new Date().toLocaleDateString();
    }
  },
  
  NOW: {
    name: 'NOW',
    description: 'Returns the current date and time',
    execute: (args: any[]) => {
      if (args.length !== 0) throw new Error('NOW requires no arguments');
      return new Date().toLocaleString();
    }
  },
  
  YEAR: {
    name: 'YEAR',
    description: 'Returns the year of a date',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('YEAR requires exactly 1 argument');
      const date = new Date(args[0]);
      if (isNaN(date.getTime())) return '#VALUE!';
      return date.getFullYear();
    }
  },
  
  MONTH: {
    name: 'MONTH',
    description: 'Returns the month of a date',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('MONTH requires exactly 1 argument');
      const date = new Date(args[0]);
      if (isNaN(date.getTime())) return '#VALUE!';
      return date.getMonth() + 1;
    }
  },
  
  DAY: {
    name: 'DAY',
    description: 'Returns the day of a date',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('DAY requires exactly 1 argument');
      const date = new Date(args[0]);
      if (isNaN(date.getTime())) return '#VALUE!';
      return date.getDate();
    }
  },
  
  // Logical Functions
  NOT: {
    name: 'NOT',
    description: 'Reverses the logic of its argument',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('NOT requires exactly 1 argument');
      return !Boolean(args[0]);
    }
  },
  
  OR: {
    name: 'OR',
    description: 'Returns TRUE if any argument is TRUE',
    execute: (args: any[]) => {
      if (args.length === 0) throw new Error('OR requires at least 1 argument');
      return args.some(arg => Boolean(arg));
    }
  },
  
  // Statistical Functions
  MEDIAN: {
    name: 'MEDIAN',
    description: 'Returns the median of the given numbers',
    execute: (args: any[]) => {
      const numbers = args.flat().filter(arg => typeof arg === 'number' && !isNaN(arg)).sort((a, b) => a - b);
      if (numbers.length === 0) return '#DIV/0!';
      
      const mid = Math.floor(numbers.length / 2);
      return numbers.length % 2 === 0 
        ? (numbers[mid - 1] + numbers[mid]) / 2 
        : numbers[mid];
    }
  },
  
  MODE: {
    name: 'MODE',
    description: 'Returns the most common value in a data set',
    execute: (args: any[]) => {
      const numbers = args.flat().filter(arg => typeof arg === 'number' && !isNaN(arg));
      if (numbers.length === 0) return '#N/A';
      
      const frequency: Record<number, number> = {};
      let maxCount = 0;
      let mode: number | null = null;
      
      for (const num of numbers) {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxCount) {
          maxCount = frequency[num];
          mode = num;
        }
      }
      
      return mode !== null ? mode : '#N/A';
    }
  },
  
  STDEV: {
    name: 'STDEV',
    description: 'Estimates standard deviation based on a sample',
    execute: (args: any[]) => {
      const numbers = args.flat().filter(arg => typeof arg === 'number' && !isNaN(arg));
      if (numbers.length < 2) return '#DIV/0!';
      
      const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
      const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / (numbers.length - 1);
      return Math.sqrt(variance);
    }
  },
  
  VAR: {
    name: 'VAR',
    description: 'Estimates variance based on a sample',
    execute: (args: any[]) => {
      const numbers = args.flat().filter(arg => typeof arg === 'number' && !isNaN(arg));
      if (numbers.length < 2) return '#DIV/0!';
      
      const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
      return numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / (numbers.length - 1);
    }
  },
  
  // Financial Functions
  PMT: {
    name: 'PMT',
    description: 'Calculates the payment for a loan',
    execute: (args: any[]) => {
      if (args.length !== 3) throw new Error('PMT requires exactly 3 arguments');
      const [rate, nper, pv] = args.map(Number);
      
      if (rate === 0) return -pv / nper;
      
      const pvif = Math.pow(1 + rate, nper);
      return (rate * pv * pvif) / (pvif - 1) * -1;
    }
  },
  
  FV: {
    name: 'FV',
    description: 'Returns the future value of an investment',
    execute: (args: any[]) => {
      if (args.length < 3 || args.length > 5) throw new Error('FV requires 3 to 5 arguments');
      const [rate, nper, pmt, pv = 0, type = 0] = args.map(Number);
      
      if (rate === 0) return -(pv + pmt * nper);
      
      const pvif = Math.pow(1 + rate, nper);
      return -(pv * pvif + pmt * (pvif - 1) / rate * (1 + rate * type));
    }
  },
  
  // Lookup Functions
  VLOOKUP: {
    name: 'VLOOKUP',
    description: 'Looks up a value in the first column of a range and returns a value in the same row from another column',
    execute: (args: any[]) => {
      if (args.length < 3 || args.length > 4) throw new Error('VLOOKUP requires 3 or 4 arguments');
      // This is a simplified implementation - in a real Excel app, this would work with actual ranges
      return '#N/A'; // Placeholder for complex implementation
    }
  }
};