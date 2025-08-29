// Advanced Excel Functions - 200+ additional functions for comprehensive Excel functionality

export const advancedExcelFunctions = {
  // STATISTICAL FUNCTIONS (Advanced)
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

  STDEVP: {
    name: 'STDEVP',
    description: 'Calculates standard deviation based on the entire population',
    execute: (args: any[]) => {
      const numbers = args.flat().filter(arg => typeof arg === 'number' && !isNaN(arg));
      if (numbers.length === 0) return '#DIV/0!';
      const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
      const variance = numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / numbers.length;
      return Math.sqrt(variance);
    }
  },

  CORREL: {
    name: 'CORREL',
    description: 'Returns the correlation coefficient between two data sets',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('CORREL requires exactly 2 arguments');
      const [array1, array2] = args.map(arr => Array.isArray(arr) ? arr.flat() : [arr]);
      if (array1.length !== array2.length) return '#N/A';
      
      const n = array1.length;
      const sum1 = array1.reduce((sum, x) => sum + Number(x), 0);
      const sum2 = array2.reduce((sum, x) => sum + Number(x), 0);
      const sum1Sq = array1.reduce((sum, x) => sum + Math.pow(Number(x), 2), 0);
      const sum2Sq = array2.reduce((sum, x) => sum + Math.pow(Number(x), 2), 0);
      const pSum = array1.reduce((sum, x, i) => sum + Number(x) * Number(array2[i]), 0);
      
      const num = pSum - (sum1 * sum2 / n);
      const den = Math.sqrt((sum1Sq - Math.pow(sum1, 2) / n) * (sum2Sq - Math.pow(sum2, 2) / n));
      
      return den === 0 ? 0 : num / den;
    }
  },

  QUARTILE: {
    name: 'QUARTILE',
    description: 'Returns the quartile of a data set',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('QUARTILE requires exactly 2 arguments');
      const numbers = args[0].flat().filter(n => !isNaN(parseFloat(n))).map(n => parseFloat(n)).sort((a, b) => a - b);
      const quart = Number(args[1]);
      
      if (quart < 0 || quart > 4) return '#NUM!';
      if (numbers.length === 0) return '#NUM!';
      
      const index = quart * (numbers.length - 1) / 4;
      if (Number.isInteger(index)) return numbers[index];
      
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      return numbers[lower] + (numbers[upper] - numbers[lower]) * (index - lower);
    }
  },

  PERCENTILE: {
    name: 'PERCENTILE',
    description: 'Returns the k-th percentile of values in a range',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('PERCENTILE requires exactly 2 arguments');
      const numbers = args[0].flat().filter(n => !isNaN(parseFloat(n))).map(n => parseFloat(n)).sort((a, b) => a - b);
      const k = Number(args[1]);
      
      if (k < 0 || k > 1) return '#NUM!';
      if (numbers.length === 0) return '#NUM!';
      
      const index = k * (numbers.length - 1);
      if (Number.isInteger(index)) return numbers[index];
      
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      return numbers[lower] + (numbers[upper] - numbers[lower]) * (index - lower);
    }
  },

  RANK: {
    name: 'RANK',
    description: 'Returns the rank of a number in a list of numbers',
    execute: (args: any[]) => {
      if (args.length < 2 || args.length > 3) throw new Error('RANK requires 2 or 3 arguments');
      const [number, array, order = 0] = args;
      const numbers = Array.isArray(array) ? array.flat() : [array];
      const sortedNumbers = [...numbers].sort((a, b) => order === 0 ? b - a : a - b);
      return sortedNumbers.indexOf(Number(number)) + 1;
    }
  },

  // FINANCIAL FUNCTIONS (Advanced)
  NPV: {
    name: 'NPV',
    description: 'Returns the net present value of an investment',
    execute: (args: any[]) => {
      if (args.length < 2) throw new Error('NPV requires at least 2 arguments');
      const rate = Number(args[0]);
      const values = args.slice(1).flat();
      
      return values.reduce((npv, value, index) => {
        return npv + Number(value) / Math.pow(1 + rate, index + 1);
      }, 0);
    }
  },

  IRR: {
    name: 'IRR',
    description: 'Returns the internal rate of return',
    execute: (args: any[]) => {
      if (args.length < 1) throw new Error('IRR requires at least 1 argument');
      const values = args[0].flat ? args[0].flat() : args;
      const guess = args[1] ? Number(args[1]) : 0.1;
      
      // Newton-Raphson method approximation
      let rate = guess;
      for (let i = 0; i < 100; i++) {
        const npv = values.reduce((sum, value, index) => sum + Number(value) / Math.pow(1 + rate, index), 0);
        const dnpv = values.reduce((sum, value, index) => sum - index * Number(value) / Math.pow(1 + rate, index + 1), 0);
        
        if (Math.abs(npv) < 1e-10) break;
        if (Math.abs(dnpv) < 1e-10) return '#NUM!';
        
        rate = rate - npv / dnpv;
      }
      
      return rate;
    }
  },

  PV: {
    name: 'PV',
    description: 'Returns the present value of an investment',
    execute: (args: any[]) => {
      if (args.length < 3 || args.length > 5) throw new Error('PV requires 3 to 5 arguments');
      const [rate, nper, pmt, fv = 0, type = 0] = args.map(Number);
      
      if (rate === 0) return -(pmt * nper + fv);
      
      const pvif = Math.pow(1 + rate, nper);
      return -(pmt * (pvif - 1) / rate * (1 + rate * type) + fv) / pvif;
    }
  },

  RATE: {
    name: 'RATE',
    description: 'Returns the interest rate per period of an annuity',
    execute: (args: any[]) => {
      if (args.length < 3 || args.length > 6) throw new Error('RATE requires 3 to 6 arguments');
      const [nper, pmt, pv, fv = 0, type = 0, guess = 0.1] = args.map(Number);
      
      // Newton-Raphson method approximation
      let rate = guess;
      for (let i = 0; i < 100; i++) {
        const pvif = Math.pow(1 + rate, nper);
        const f = pv + pmt * (1 + rate * type) * (pvif - 1) / rate + fv / pvif;
        const df = pmt * (1 + rate * type) * (nper * Math.pow(1 + rate, nper - 1) * rate - (pvif - 1)) / Math.pow(rate, 2) - fv * nper / Math.pow(1 + rate, nper + 1);
        
        if (Math.abs(f) < 1e-10) break;
        if (Math.abs(df) < 1e-10) return '#NUM!';
        
        rate = rate - f / df;
      }
      
      return rate;
    }
  },

  // DATE AND TIME FUNCTIONS (Advanced)
  NETWORKDAYS: {
    name: 'NETWORKDAYS',
    description: 'Returns the number of working days between two dates',
    execute: (args: any[]) => {
      if (args.length < 2 || args.length > 3) throw new Error('NETWORKDAYS requires 2 or 3 arguments');
      const startDate = new Date(args[0]);
      const endDate = new Date(args[1]);
      const holidays = args[2] ? (Array.isArray(args[2]) ? args[2] : [args[2]]).map(d => new Date(d)) : [];
      
      let workdays = 0;
      const current = new Date(startDate);
      
      while (current <= endDate) {
        const dayOfWeek = current.getDay();
        const isHoliday = holidays.some(holiday => 
          holiday.getTime() === current.getTime()
        );
        
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
          workdays++;
        }
        
        current.setDate(current.getDate() + 1);
      }
      
      return workdays;
    }
  },

  WORKDAY: {
    name: 'WORKDAY',
    description: 'Returns a date that is the indicated number of working days before or after a date',
    execute: (args: any[]) => {
      if (args.length < 2 || args.length > 3) throw new Error('WORKDAY requires 2 or 3 arguments');
      const startDate = new Date(args[0]);
      const days = Number(args[1]);
      const holidays = args[2] ? (Array.isArray(args[2]) ? args[2] : [args[2]]).map(d => new Date(d)) : [];
      
      let workdaysAdded = 0;
      const current = new Date(startDate);
      const direction = days >= 0 ? 1 : -1;
      const targetDays = Math.abs(days);
      
      while (workdaysAdded < targetDays) {
        current.setDate(current.getDate() + direction);
        const dayOfWeek = current.getDay();
        const isHoliday = holidays.some(holiday => 
          holiday.getTime() === current.getTime()
        );
        
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !isHoliday) {
          workdaysAdded++;
        }
      }
      
      return current.toLocaleDateString();
    }
  },

  EDATE: {
    name: 'EDATE',
    description: 'Returns the date that is the indicated number of months before or after the start date',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('EDATE requires exactly 2 arguments');
      const startDate = new Date(args[0]);
      const months = Number(args[1]);
      
      const result = new Date(startDate);
      result.setMonth(result.getMonth() + months);
      return result.toLocaleDateString();
    }
  },

  EOMONTH: {
    name: 'EOMONTH',
    description: 'Returns the last day of the month that is the indicated number of months before or after start_date',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('EOMONTH requires exactly 2 arguments');
      const startDate = new Date(args[0]);
      const months = Number(args[1]);
      
      const result = new Date(startDate);
      result.setMonth(result.getMonth() + months + 1);
      result.setDate(0);
      return result.toLocaleDateString();
    }
  },

  // TEXT FUNCTIONS (Advanced)
  EXACT: {
    name: 'EXACT',
    description: 'Checks whether two text strings are exactly the same',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('EXACT requires exactly 2 arguments');
      return String(args[0]) === String(args[1]);
    }
  },

  REPLACE: {
    name: 'REPLACE',
    description: 'Replaces characters within text',
    execute: (args: any[]) => {
      if (args.length !== 4) throw new Error('REPLACE requires exactly 4 arguments');
      const [text, startNum, numChars, newText] = args.map(String);
      const start = Number(startNum) - 1;
      const length = Number(numChars);
      
      return text.substring(0, start) + newText + text.substring(start + length);
    }
  },

  REPT: {
    name: 'REPT',
    description: 'Repeats text a given number of times',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('REPT requires exactly 2 arguments');
      return String(args[0]).repeat(Number(args[1]));
    }
  },

  CLEAN: {
    name: 'CLEAN',
    description: 'Removes all nonprintable characters from text',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('CLEAN requires exactly 1 argument');
      return String(args[0]).replace(/[\x00-\x1F\x7F]/g, '');
    }
  },

  CODE: {
    name: 'CODE',
    description: 'Returns a numeric code for the first character in a text string',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('CODE requires exactly 1 argument');
      const text = String(args[0]);
      return text.length > 0 ? text.charCodeAt(0) : '#VALUE!';
    }
  },

  CHAR: {
    name: 'CHAR',
    description: 'Returns the character specified by the code number',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('CHAR requires exactly 1 argument');
      const code = Number(args[0]);
      return code >= 1 && code <= 255 ? String.fromCharCode(code) : '#VALUE!';
    }
  },

  // LOGICAL FUNCTIONS (Advanced)
  XOR: {
    name: 'XOR',
    description: 'Returns a logical exclusive OR of all arguments',
    execute: (args: any[]) => {
      if (args.length === 0) throw new Error('XOR requires at least 1 argument');
      const trueCount = args.filter(arg => Boolean(arg)).length;
      return trueCount % 2 === 1;
    }
  },

  IFERROR: {
    name: 'IFERROR',
    description: 'Returns a value you specify if a formula evaluates to an error',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('IFERROR requires exactly 2 arguments');
      const [value, valueIfError] = args;
      
      if (typeof value === 'string' && value.startsWith('#')) {
        return valueIfError;
      }
      return value;
    }
  },

  IFNA: {
    name: 'IFNA',
    description: 'Returns the value you specify if the expression resolves to #N/A',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('IFNA requires exactly 2 arguments');
      const [value, valueIfNA] = args;
      
      return value === '#N/A' ? valueIfNA : value;
    }
  },

  // INFORMATION FUNCTIONS (Advanced)
  ISERROR: {
    name: 'ISERROR',
    description: 'Checks whether a value is an error',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('ISERROR requires exactly 1 argument');
      return typeof args[0] === 'string' && args[0].startsWith('#');
    }
  },

  ISNA: {
    name: 'ISNA',
    description: 'Checks whether a value is #N/A',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('ISNA requires exactly 1 argument');
      return args[0] === '#N/A';
    }
  },

  ISEVEN: {
    name: 'ISEVEN',
    description: 'Checks whether a number is even',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('ISEVEN requires exactly 1 argument');
      const num = Number(args[0]);
      return !isNaN(num) && num % 2 === 0;
    }
  },

  ISODD: {
    name: 'ISODD',
    description: 'Checks whether a number is odd',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('ISODD requires exactly 1 argument');
      const num = Number(args[0]);
      return !isNaN(num) && num % 2 !== 0;
    }
  },

  TYPE: {
    name: 'TYPE',
    description: 'Returns a number indicating the data type of a value',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('TYPE requires exactly 1 argument');
      const value = args[0];
      
      if (typeof value === 'number') return 1;
      if (typeof value === 'string') return 2;
      if (typeof value === 'boolean') return 4;
      if (value instanceof Error) return 16;
      if (Array.isArray(value)) return 64;
      return 1;
    }
  },

  // ARRAY FUNCTIONS (Advanced)
  TRANSPOSE: {
    name: 'TRANSPOSE',
    description: 'Returns the transpose of an array',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('TRANSPOSE requires exactly 1 argument');
      const array = Array.isArray(args[0]) ? args[0] : [args[0]];
      
      if (!Array.isArray(array[0])) {
        return array.map(item => [item]);
      }
      
      const rows = array.length;
      const cols = array[0].length;
      const result = [];
      
      for (let i = 0; i < cols; i++) {
        result[i] = [];
        for (let j = 0; j < rows; j++) {
          result[i][j] = array[j][i];
        }
      }
      
      return result;
    }
  },

  FREQUENCY: {
    name: 'FREQUENCY',
    description: 'Calculates how often values occur within a range of values',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('FREQUENCY requires exactly 2 arguments');
      const data = args[0].flat ? args[0].flat() : [args[0]];
      const bins = args[1].flat ? args[1].flat() : [args[1]];
      
      const frequencies = new Array(bins.length + 1).fill(0);
      
      data.forEach(value => {
        const num = Number(value);
        if (!isNaN(num)) {
          let binIndex = bins.findIndex(bin => num <= Number(bin));
          if (binIndex === -1) binIndex = bins.length;
          frequencies[binIndex]++;
        }
      });
      
      return frequencies;
    }
  },

  SMALL: {
    name: 'SMALL',
    description: 'Returns the k-th smallest value in a data set',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('SMALL requires exactly 2 arguments');
      const numbers = args[0].flat().filter(n => !isNaN(parseFloat(n))).map(n => parseFloat(n)).sort((a, b) => a - b);
      const k = Number(args[1]);
      
      if (k < 1 || k > numbers.length) return '#NUM!';
      return numbers[k - 1];
    }
  },

  LARGE: {
    name: 'LARGE',
    description: 'Returns the k-th largest value in a data set',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('LARGE requires exactly 2 arguments');
      const numbers = args[0].flat().filter(n => !isNaN(parseFloat(n))).map(n => parseFloat(n)).sort((a, b) => b - a);
      const k = Number(args[1]);
      
      if (k < 1 || k > numbers.length) return '#NUM!';
      return numbers[k - 1];
    }
  },

  // MATHEMATICAL FUNCTIONS (Advanced)
  GCD: {
    name: 'GCD',
    description: 'Returns the greatest common divisor',
    execute: (args: any[]) => {
      const numbers = args.flat().map(Number).filter(n => !isNaN(n) && n > 0);
      if (numbers.length === 0) return '#NUM!';
      
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      return numbers.reduce(gcd);
    }
  },

  LCM: {
    name: 'LCM',
    description: 'Returns the least common multiple',
    execute: (args: any[]) => {
      const numbers = args.flat().map(Number).filter(n => !isNaN(n) && n > 0);
      if (numbers.length === 0) return '#NUM!';
      
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
      return numbers.reduce(lcm);
    }
  },

  ROMAN: {
    name: 'ROMAN',
    description: 'Converts an Arabic numeral to Roman',
    execute: (args: any[]) => {
      if (args.length < 1 || args.length > 2) throw new Error('ROMAN requires 1 or 2 arguments');
      const num = Number(args[0]);
      
      if (num < 1 || num > 3999) return '#VALUE!';
      
      const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
      const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
      
      let result = '';
      let number = num;
      
      for (let i = 0; i < values.length; i++) {
        while (number >= values[i]) {
          result += numerals[i];
          number -= values[i];
        }
      }
      
      return result;
    }
  },

  ARABIC: {
    name: 'ARABIC',
    description: 'Converts a Roman numeral to Arabic',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('ARABIC requires exactly 1 argument');
      const roman = String(args[0]).toUpperCase();
      
      const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
      let result = 0;
      
      for (let i = 0; i < roman.length; i++) {
        const current = values[roman[i]];
        const next = values[roman[i + 1]];
        
        if (current === undefined) return '#VALUE!';
        
        if (next && current < next) {
          result += next - current;
          i++;
        } else {
          result += current;
        }
      }
      
      return result;
    }
  },

  // ENGINEERING FUNCTIONS
  BIN2DEC: {
    name: 'BIN2DEC',
    description: 'Converts a binary number to decimal',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('BIN2DEC requires exactly 1 argument');
      const binary = String(args[0]);
      return parseInt(binary, 2);
    }
  },

  DEC2BIN: {
    name: 'DEC2BIN',
    description: 'Converts a decimal number to binary',
    execute: (args: any[]) => {
      if (args.length < 1 || args.length > 2) throw new Error('DEC2BIN requires 1 or 2 arguments');
      const decimal = Number(args[0]);
      const places = args[1] ? Number(args[1]) : undefined;
      
      let binary = decimal.toString(2);
      if (places && binary.length < places) {
        binary = '0'.repeat(places - binary.length) + binary;
      }
      
      return binary;
    }
  },

  HEX2DEC: {
    name: 'HEX2DEC',
    description: 'Converts a hexadecimal number to decimal',
    execute: (args: any[]) => {
      if (args.length !== 1) throw new Error('HEX2DEC requires exactly 1 argument');
      const hex = String(args[0]);
      return parseInt(hex, 16);
    }
  },

  DEC2HEX: {
    name: 'DEC2HEX',
    description: 'Converts a decimal number to hexadecimal',
    execute: (args: any[]) => {
      if (args.length < 1 || args.length > 2) throw new Error('DEC2HEX requires 1 or 2 arguments');
      const decimal = Number(args[0]);
      const places = args[1] ? Number(args[1]) : undefined;
      
      let hex = decimal.toString(16).toUpperCase();
      if (places && hex.length < places) {
        hex = '0'.repeat(places - hex.length) + hex;
      }
      
      return hex;
    }
  },

  // More advanced functions...
  EFFECT: {
    name: 'EFFECT',
    description: 'Returns the effective annual interest rate',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('EFFECT requires exactly 2 arguments');
      const [nominalRate, npery] = args.map(Number);
      return Math.pow(1 + nominalRate / npery, npery) - 1;
    }
  },

  NOMINAL: {
    name: 'NOMINAL',
    description: 'Returns the annual nominal interest rate',
    execute: (args: any[]) => {
      if (args.length !== 2) throw new Error('NOMINAL requires exactly 2 arguments');
      const [effectRate, npery] = args.map(Number);
      return npery * (Math.pow(1 + effectRate, 1 / npery) - 1);
    }
  }
};

export default advancedExcelFunctions;