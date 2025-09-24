// Comprehensive Excel Function Library with 100+ Additional Functions
import { Cell } from '../types/sheet';

export const advancedExcelFunctionLibrary = {
  // ========== MATHEMATICAL FUNCTIONS ==========
  
  // Basic Math Functions
  CEILING: {
    name: 'CEILING',
    description: 'Rounds a number up to the nearest multiple of significance',
    execute: (args: any[]) => {
      if (args.length < 1) return '#VALUE!';
      const [number, significance = 1] = args.map(Number);
      if (significance === 0) return 0;
      return Math.ceil(number / significance) * significance;
    }
  },

  FLOOR: {
    name: 'FLOOR',
    description: 'Rounds a number down to the nearest multiple of significance',
    execute: (args: any[]) => {
      if (args.length < 1) return '#VALUE!';
      const [number, significance = 1] = args.map(Number);
      if (significance === 0) return 0;
      return Math.floor(number / significance) * significance;
    }
  },

  TRUNC: {
    name: 'TRUNC',
    description: 'Truncates a number to an integer',
    execute: (args: any[]) => {
      if (args.length < 1) return '#VALUE!';
      const [number, numDigits = 0] = args.map(Number);
      const multiplier = Math.pow(10, numDigits);
      return Math.trunc(number * multiplier) / multiplier;
    }
  },

  MROUND: {
    name: 'MROUND',
    description: 'Rounds a number to the nearest multiple',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const [number, multiple] = args.map(Number);
      if (multiple === 0) return 0;
      return Math.round(number / multiple) * multiple;
    }
  },

  QUOTIENT: {
    name: 'QUOTIENT',
    description: 'Returns the integer portion of a division',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const [numerator, denominator] = args.map(Number);
      if (denominator === 0) return '#DIV/0!';
      return Math.trunc(numerator / denominator);
    }
  },

  // Advanced Math Functions
  GCD: {
    name: 'GCD',
    description: 'Returns the greatest common divisor',
    execute: (args: any[]) => {
      const numbers = args.flat().map(Number).filter(n => !isNaN(n) && n > 0);
      if (numbers.length === 0) return '#VALUE!';
      
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      return numbers.reduce((acc, num) => gcd(acc, num));
    }
  },

  LCM: {
    name: 'LCM',
    description: 'Returns the least common multiple',
    execute: (args: any[]) => {
      const numbers = args.flat().map(Number).filter(n => !isNaN(n) && n > 0);
      if (numbers.length === 0) return '#VALUE!';
      
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
      return numbers.reduce((acc, num) => lcm(acc, num));
    }
  },

  COMBIN: {
    name: 'COMBIN',
    description: 'Returns the number of combinations',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const [n, k] = args.map(Number);
      if (n < 0 || k < 0 || k > n) return '#NUM!';
      
      let result = 1;
      for (let i = 0; i < k; i++) {
        result = result * (n - i) / (i + 1);
      }
      return Math.round(result);
    }
  },

  PERMUT: {
    name: 'PERMUT',
    description: 'Returns the number of permutations',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const [n, k] = args.map(Number);
      if (n < 0 || k < 0 || k > n) return '#NUM!';
      
      let result = 1;
      for (let i = 0; i < k; i++) {
        result *= (n - i);
      }
      return result;
    }
  },

  // ========== STATISTICAL FUNCTIONS ==========
  
  GEOMEAN: {
    name: 'GEOMEAN',
    description: 'Returns the geometric mean',
    execute: (args: any[]) => {
      const numbers = args.flat().filter(arg => typeof arg === 'number' && !isNaN(arg) && arg > 0);
      if (numbers.length === 0) return '#NUM!';
      
      const product = numbers.reduce((acc, num) => acc * num, 1);
      return Math.pow(product, 1 / numbers.length);
    }
  },

  HARMEAN: {
    name: 'HARMEAN',
    description: 'Returns the harmonic mean',
    execute: (args: any[]) => {
      const numbers = args.flat().filter(arg => typeof arg === 'number' && !isNaN(arg) && arg > 0);
      if (numbers.length === 0) return '#NUM!';
      
      const reciprocalSum = numbers.reduce((acc, num) => acc + (1 / num), 0);
      return numbers.length / reciprocalSum;
    }
  },

  QUARTILE: {
    name: 'QUARTILE',
    description: 'Returns the quartile of a data set',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const numbers = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const quart = Number(args[1]);
      
      const validNumbers = numbers.filter(n => typeof n === 'number' && !isNaN(n)).sort((a, b) => a - b);
      if (validNumbers.length === 0) return '#NUM!';
      if (quart < 0 || quart > 4) return '#NUM!';
      
      if (quart === 0) return validNumbers[0];
      if (quart === 4) return validNumbers[validNumbers.length - 1];
      
      const pos = (validNumbers.length - 1) * (quart / 4);
      const base = Math.floor(pos);
      const rest = pos - base;
      
      if (validNumbers[base + 1] !== undefined) {
        return validNumbers[base] + rest * (validNumbers[base + 1] - validNumbers[base]);
      } else {
        return validNumbers[base];
      }
    }
  },

  PERCENTILE: {
    name: 'PERCENTILE',
    description: 'Returns the k-th percentile of values in a range',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const numbers = Array.isArray(args[0]) ? args[0].flat() : [args[0]];
      const k = Number(args[1]);
      
      const validNumbers = numbers.filter(n => typeof n === 'number' && !isNaN(n)).sort((a, b) => a - b);
      if (validNumbers.length === 0) return '#NUM!';
      if (k < 0 || k > 1) return '#NUM!';
      
      const pos = (validNumbers.length - 1) * k;
      const base = Math.floor(pos);
      const rest = pos - base;
      
      if (validNumbers[base + 1] !== undefined) {
        return validNumbers[base] + rest * (validNumbers[base + 1] - validNumbers[base]);
      } else {
        return validNumbers[base];
      }
    }
  },

  RANK: {
    name: 'RANK',
    description: 'Returns the rank of a number in a list of numbers',
    execute: (args: any[]) => {
      if (args.length < 2) return '#VALUE!';
      const number = Number(args[0]);
      const array = Array.isArray(args[1]) ? args[1].flat() : [args[1]];
      const order = args.length > 2 ? Number(args[2]) : 0;
      
      const validNumbers = array.filter(n => typeof n === 'number' && !isNaN(n));
      if (validNumbers.length === 0) return '#N/A';
      
      const sorted = order === 0 ? 
        validNumbers.sort((a, b) => b - a) : 
        validNumbers.sort((a, b) => a - b);
      
      const rank = sorted.indexOf(number);
      return rank === -1 ? '#N/A' : rank + 1;
    }
  },

  // ========== FINANCIAL FUNCTIONS ==========
  
  PV: {
    name: 'PV',
    description: 'Returns the present value of an investment',
    execute: (args: any[]) => {
      if (args.length < 3) return '#VALUE!';
      const [rate, nper, pmt, fv = 0, type = 0] = args.map(Number);
      
      if (rate === 0) return -(pmt * nper + fv);
      
      const pvif = Math.pow(1 + rate, nper);
      return -(fv + pmt * (1 + rate * type) * ((pvif - 1) / rate)) / pvif;
    }
  },

  RATE: {
    name: 'RATE',
    description: 'Returns the interest rate per period of an annuity',
    execute: (args: any[]) => {
      if (args.length < 3) return '#VALUE!';
      const [nper, pmt, pv, fv = 0, type = 0, guess = 0.1] = args.map(Number);
      
      // Newton-Raphson method to solve for rate
      let rate = guess;
      const maxIterations = 100;
      const precision = 1e-6;
      
      for (let i = 0; i < maxIterations; i++) {
        const f = calculatePVFunction(rate, nper, pmt, pv, fv, type);
        const df = calculatePVDerivative(rate, nper, pmt, pv, fv, type);
        
        if (Math.abs(f) < precision) return rate;
        if (df === 0) return '#NUM!';
        
        rate = rate - f / df;
        if (rate < -1) return '#NUM!';
      }
      
      return '#NUM!';
    }
  },

  NPER: {
    name: 'NPER',
    description: 'Returns the number of periods for an investment',
    execute: (args: any[]) => {
      if (args.length < 3) return '#VALUE!';
      const [rate, pmt, pv, fv = 0, type = 0] = args.map(Number);
      
      if (rate === 0) {
        if (pmt === 0) return '#NUM!';
        return -(pv + fv) / pmt;
      }
      
      const payment = pmt * (1 + rate * type);
      if (payment === 0) return '#NUM!';
      
      const term1 = payment - fv * rate;
      const term2 = payment + pv * rate;
      
      if (term1 <= 0 || term2 <= 0) return '#NUM!';
      
      return Math.log(term1 / term2) / Math.log(1 + rate);
    }
  },

  // ========== DATE AND TIME FUNCTIONS ==========
  
  NETWORKDAYS: {
    name: 'NETWORKDAYS',
    description: 'Returns the number of working days between two dates',
    execute: (args: any[]) => {
      if (args.length < 2) return '#VALUE!';
      const startDate = new Date(args[0]);
      const endDate = new Date(args[1]);
      const holidays = args.length > 2 ? (Array.isArray(args[2]) ? args[2] : [args[2]]) : [];
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '#VALUE!';
      
      const holidaySet = new Set(holidays.map(h => new Date(h).toDateString()));
      
      let count = 0;
      const currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidaySet.has(currentDate.toDateString())) {
          count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return count;
    }
  },

  WORKDAY: {
    name: 'WORKDAY',
    description: 'Returns a date that is a specified number of working days from a start date',
    execute: (args: any[]) => {
      if (args.length < 2) return '#VALUE!';
      const startDate = new Date(args[0]);
      const days = Number(args[1]);
      const holidays = args.length > 2 ? (Array.isArray(args[2]) ? args[2] : [args[2]]) : [];
      
      if (isNaN(startDate.getTime())) return '#VALUE!';
      
      const holidaySet = new Set(holidays.map(h => new Date(h).toDateString()));
      const currentDate = new Date(startDate);
      let workDaysAdded = 0;
      const direction = days >= 0 ? 1 : -1;
      const targetDays = Math.abs(days);
      
      while (workDaysAdded < targetDays) {
        currentDate.setDate(currentDate.getDate() + direction);
        const dayOfWeek = currentDate.getDay();
        
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidaySet.has(currentDate.toDateString())) {
          workDaysAdded++;
        }
      }
      
      return currentDate.toLocaleDateString();
    }
  },

  WEEKDAY: {
    name: 'WEEKDAY',
    description: 'Returns the day of the week corresponding to a date',
    execute: (args: any[]) => {
      if (args.length < 1) return '#VALUE!';
      const date = new Date(args[0]);
      const returnType = args.length > 1 ? Number(args[1]) : 1;
      
      if (isNaN(date.getTime())) return '#VALUE!';
      
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      switch (returnType) {
        case 1: return dayOfWeek === 0 ? 7 : dayOfWeek; // 1-7, Sunday = 1
        case 2: return dayOfWeek === 0 ? 7 : dayOfWeek; // 1-7, Monday = 1
        case 3: return dayOfWeek; // 0-6, Monday = 0
        default: return dayOfWeek + 1; // 1-7, Sunday = 1
      }
    }
  },

  EOMONTH: {
    name: 'EOMONTH',
    description: 'Returns the last day of the month that is months away from start_date',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const startDate = new Date(args[0]);
      const months = Number(args[1]);
      
      if (isNaN(startDate.getTime())) return '#VALUE!';
      
      const resultDate = new Date(startDate);
      resultDate.setMonth(resultDate.getMonth() + months + 1);
      resultDate.setDate(0); // Last day of previous month
      
      return resultDate.toLocaleDateString();
    }
  },

  // ========== TEXT FUNCTIONS ==========
  
  EXACT: {
    name: 'EXACT',
    description: 'Compares two text strings and returns TRUE if they are exactly the same',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      return String(args[0]) === String(args[1]);
    }
  },

  FIND: {
    name: 'FIND',
    description: 'Finds one text string within another (case-sensitive)',
    execute: (args: any[]) => {
      if (args.length < 2) return '#VALUE!';
      const findText = String(args[0]);
      const withinText = String(args[1]);
      const startNum = args.length > 2 ? Number(args[2]) - 1 : 0;
      
      const index = withinText.indexOf(findText, startNum);
      return index === -1 ? '#VALUE!' : index + 1;
    }
  },

  SEARCH: {
    name: 'SEARCH',
    description: 'Finds one text string within another (case-insensitive)',
    execute: (args: any[]) => {
      if (args.length < 2) return '#VALUE!';
      const findText = String(args[0]).toLowerCase();
      const withinText = String(args[1]).toLowerCase();
      const startNum = args.length > 2 ? Number(args[2]) - 1 : 0;
      
      const index = withinText.indexOf(findText, startNum);
      return index === -1 ? '#VALUE!' : index + 1;
    }
  },

  REPLACE: {
    name: 'REPLACE',
    description: 'Replaces characters within text',
    execute: (args: any[]) => {
      if (args.length !== 4) return '#VALUE!';
      const oldText = String(args[0]);
      const startNum = Number(args[1]) - 1;
      const numChars = Number(args[2]);
      const newText = String(args[3]);
      
      if (startNum < 0 || numChars < 0) return '#VALUE!';
      
      return oldText.substring(0, startNum) + newText + oldText.substring(startNum + numChars);
    }
  },

  REPT: {
    name: 'REPT',
    description: 'Repeats text a given number of times',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const text = String(args[0]);
      const numTimes = Number(args[1]);
      
      if (numTimes < 0) return '#VALUE!';
      return text.repeat(Math.floor(numTimes));
    }
  },

  REVERSE: {
    name: 'REVERSE',
    description: 'Reverses the order of characters in a text string',
    execute: (args: any[]) => {
      if (args.length !== 1) return '#VALUE!';
      return String(args[0]).split('').reverse().join('');
    }
  },

  // ========== LOGICAL FUNCTIONS ==========
  
  XOR: {
    name: 'XOR',
    description: 'Returns a logical exclusive OR of all arguments',
    execute: (args: any[]) => {
      if (args.length === 0) return '#VALUE!';
      return args.filter(arg => Boolean(arg)).length % 2 === 1;
    }
  },

  IFERROR: {
    name: 'IFERROR',
    description: 'Returns a value you specify if a formula evaluates to an error',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const value = args[0];
      const valueIfError = args[1];
      
      if (typeof value === 'string' && value.includes('#')) {
        return valueIfError;
      }
      return value;
    }
  },

  IFNA: {
    name: 'IFNA',
    description: 'Returns the value you specify if the expression resolves to #N/A',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const value = args[0];
      const valueIfNA = args[1];
      
      return value === '#N/A' ? valueIfNA : value;
    }
  },

  // ========== ARRAY FUNCTIONS ==========
  
  TRANSPOSE: {
    name: 'TRANSPOSE',
    description: 'Returns the transpose of an array',
    execute: (args: any[]) => {
      if (args.length !== 1) return '#VALUE!';
      const array = Array.isArray(args[0]) ? args[0] : [args[0]];
      
      if (!Array.isArray(array[0])) {
        // Single row/column array
        return array.map(item => [item]);
      }
      
      const rows = array.length;
      const cols = array[0].length;
      const transposed = [];
      
      for (let j = 0; j < cols; j++) {
        const newRow = [];
        for (let i = 0; i < rows; i++) {
          newRow.push(array[i][j]);
        }
        transposed.push(newRow);
      }
      
      return transposed;
    }
  },

  MMULT: {
    name: 'MMULT',
    description: 'Returns the matrix product of two arrays',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const [matrix1, matrix2] = args;
      
      if (!Array.isArray(matrix1) || !Array.isArray(matrix2)) return '#VALUE!';
      
      const rows1 = matrix1.length;
      const cols1 = Array.isArray(matrix1[0]) ? matrix1[0].length : 1;
      const rows2 = matrix2.length;
      const cols2 = Array.isArray(matrix2[0]) ? matrix2[0].length : 1;
      
      if (cols1 !== rows2) return '#VALUE!';
      
      const result = [];
      for (let i = 0; i < rows1; i++) {
        const row = [];
        for (let j = 0; j < cols2; j++) {
          let sum = 0;
          for (let k = 0; k < cols1; k++) {
            const val1 = Array.isArray(matrix1[i]) ? matrix1[i][k] : matrix1[i];
            const val2 = Array.isArray(matrix2[k]) ? matrix2[k][j] : matrix2[k];
            sum += Number(val1) * Number(val2);
          }
          row.push(sum);
        }
        result.push(row);
      }
      
      return result;
    }
  },

  // ========== CONVERSION FUNCTIONS ==========
  
  DECIMAL: {
    name: 'DECIMAL',
    description: 'Converts a text representation of a number in a given base into a decimal number',
    execute: (args: any[]) => {
      if (args.length !== 2) return '#VALUE!';
      const text = String(args[0]);
      const radix = Number(args[1]);
      
      if (radix < 2 || radix > 36) return '#NUM!';
      
      const result = parseInt(text, radix);
      return isNaN(result) ? '#NUM!' : result;
    }
  },

  BASE: {
    name: 'BASE',
    description: 'Converts a number into a text representation with the given radix (base)',
    execute: (args: any[]) => {
      if (args.length < 2) return '#VALUE!';
      const number = Number(args[0]);
      const radix = Number(args[1]);
      const minLength = args.length > 2 ? Number(args[2]) : 0;
      
      if (radix < 2 || radix > 36) return '#NUM!';
      if (number < 0) return '#NUM!';
      
      let result = Math.floor(number).toString(radix).toUpperCase();
      while (result.length < minLength) {
        result = '0' + result;
      }
      
      return result;
    }
  },

  BIN2DEC: {
    name: 'BIN2DEC',
    description: 'Converts a binary number to decimal',
    execute: (args: any[]) => {
      if (args.length !== 1) return '#VALUE!';
      const binary = String(args[0]);
      
      if (!/^[01]+$/.test(binary)) return '#NUM!';
      
      return parseInt(binary, 2);
    }
  },

  DEC2BIN: {
    name: 'DEC2BIN',
    description: 'Converts a decimal number to binary',
    execute: (args: any[]) => {
      if (args.length < 1) return '#VALUE!';
      const number = Number(args[0]);
      const places = args.length > 1 ? Number(args[1]) : 0;
      
      if (number < -512 || number > 511) return '#NUM!';
      
      let result = Math.floor(Math.abs(number)).toString(2);
      if (number < 0) {
        // Two's complement for negative numbers
        result = (parseInt('1'.repeat(10), 2) - Math.abs(number) + 1).toString(2).slice(-10);
      }
      
      while (result.length < places) {
        result = '0' + result;
      }
      
      return result;
    }
  },

  ROMAN: {
    name: 'ROMAN',
    description: 'Converts an arabic numeral to roman',
    execute: (args: any[]) => {
      if (args.length < 1) return '#VALUE!';
      const number = Number(args[0]);
      
      if (number < 1 || number > 3999) return '#VALUE!';
      
      const romanNumerals = [
        ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
        ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
        ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
      ];
      
      let result = '';
      let num = Math.floor(number);
      
      for (const [roman, value] of romanNumerals) {
        const count = Math.floor(num / (value as number));
        if (count > 0) {
          result += (roman as string).repeat(count);
          num -= count * (value as number);
        }
      }
      
      return result;
    }
  },

  ARABIC: {
    name: 'ARABIC',
    description: 'Converts a Roman numeral to Arabic',
    execute: (args: any[]) => {
      if (args.length !== 1) return '#VALUE!';
      const roman = String(args[0]).toUpperCase();
      
      const romanValues: Record<string, number> = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
      };
      
      let result = 0;
      let prevValue = 0;
      
      for (let i = roman.length - 1; i >= 0; i--) {
        const currentValue = romanValues[roman[i]];
        if (!currentValue) return '#VALUE!';
        
        if (currentValue < prevValue) {
          result -= currentValue;
        } else {
          result += currentValue;
        }
        prevValue = currentValue;
      }
      
      return result;
    }
  },

  // Multi-criteria aggregate functions
  SUMIFS: {
    name: 'SUMIFS',
    description: 'Sums values that meet multiple criteria',
    execute: (args: any[]) => {
      if (args.length < 3 || args.length % 2 === 0) return '#VALUE!';
      const toFlat = (a: any) => Array.isArray(a) ? a.flat() : [a];
      const sumRange = toFlat(args[0]).map((v) => (typeof v === 'number' ? v : parseFloat(v))).map(v => (isNaN(v) ? 0 : v));

      const criteriaPairs: { range: any[]; criterion: any }[] = [];
      for (let i = 1; i < args.length; i += 2) {
        criteriaPairs.push({ range: toFlat(args[i]), criterion: args[i + 1] });
      }

      const minLen = Math.min(sumRange.length, ...criteriaPairs.map(p => p.range.length));

      const matchCriteria = (val: any, crit: any): boolean => {
        if (typeof crit === 'number' || typeof crit === 'boolean') return val == crit;
        const s = String(crit).trim();
        const vNum = parseFloat(val);
        const vStr = String(val);
        const opMatch = s.match(/^(>=|<=|<>|>|<|=)(.*)$/);
        if (opMatch) {
          const op = opMatch[1];
          const rhsRaw = opMatch[2].trim();
          const rhsNum = parseFloat(rhsRaw);
          const rhs = isNaN(rhsNum) ? rhsRaw : rhsNum;
          const lv = typeof rhs === 'number' ? (isNaN(vNum) ? NaN : vNum) : vStr;
          switch (op) {
            case '>': return typeof rhs === 'number' && typeof lv === 'number' ? lv > rhs : vStr > String(rhs);
            case '<': return typeof rhs === 'number' && typeof lv === 'number' ? lv < rhs : vStr < String(rhs);
            case '>=': return typeof rhs === 'number' && typeof lv === 'number' ? lv >= rhs : vStr >= String(rhs);
            case '<=': return typeof rhs === 'number' && typeof lv === 'number' ? lv <= rhs : vStr <= String(rhs);
            case '<>': return vStr !== String(rhs);
            case '=': return vStr === String(rhs);
          }
        }
        return vStr === s;
      };

      let sum = 0;
      for (let i = 0; i < minLen; i++) {
        const ok = criteriaPairs.every(p => matchCriteria(p.range[i], p.criterion));
        if (ok) sum += sumRange[i] || 0;
      }
      return sum;
    }
  },

  COUNTIFS: {
    name: 'COUNTIFS',
    description: 'Counts values that meet multiple criteria',
    execute: (args: any[]) => {
      if (args.length < 2 || args.length % 2 !== 0) return '#VALUE!';
      const toFlat = (a: any) => Array.isArray(a) ? a.flat() : [a];
      const pairs: { range: any[]; criterion: any }[] = [];
      for (let i = 0; i < args.length; i += 2) {
        pairs.push({ range: toFlat(args[i]), criterion: args[i + 1] });
      }
      const minLen = Math.min(...pairs.map(p => p.range.length));

      const matchCriteria = (val: any, crit: any): boolean => {
        if (typeof crit === 'number' || typeof crit === 'boolean') return val == crit;
        const s = String(crit).trim();
        const vNum = parseFloat(val);
        const vStr = String(val);
        const opMatch = s.match(/^(>=|<=|<>|>|<|=)(.*)$/);
        if (opMatch) {
          const op = opMatch[1];
          const rhsRaw = opMatch[2].trim();
          const rhsNum = parseFloat(rhsRaw);
          const rhs = isNaN(rhsNum) ? rhsRaw : rhsNum;
          const lv = typeof rhs === 'number' ? (isNaN(vNum) ? NaN : vNum) : vStr;
          switch (op) {
            case '>': return typeof rhs === 'number' && typeof lv === 'number' ? lv > rhs : vStr > String(rhs);
            case '<': return typeof rhs === 'number' && typeof lv === 'number' ? lv < rhs : vStr < String(rhs);
            case '>=': return typeof rhs === 'number' && typeof lv === 'number' ? lv >= rhs : vStr >= String(rhs);
            case '<=': return typeof rhs === 'number' && typeof lv === 'number' ? lv <= rhs : vStr <= String(rhs);
            case '<>': return vStr !== String(rhs);
            case '=': return vStr === String(rhs);
          }
        }
        return vStr === s;
      };

      let count = 0;
      for (let i = 0; i < minLen; i++) {
        if (pairs.every(p => matchCriteria(p.range[i], p.criterion))) count++;
      }
      return count;
    }
  },

  AVERAGEIFS: {
    name: 'AVERAGEIFS',
    description: 'Averages values that meet multiple criteria',
    execute: (args: any[]) => {
      if (args.length < 3 || args.length % 2 === 0) return '#VALUE!';
      const toFlat = (a: any) => Array.isArray(a) ? a.flat() : [a];
      const avgRange = toFlat(args[0]).map((v) => (typeof v === 'number' ? v : parseFloat(v))).map(v => (isNaN(v) ? 0 : v));
      const criteriaPairs: { range: any[]; criterion: any }[] = [];
      for (let i = 1; i < args.length; i += 2) {
        criteriaPairs.push({ range: toFlat(args[i]), criterion: args[i + 1] });
      }
      const minLen = Math.min(avgRange.length, ...criteriaPairs.map(p => p.range.length));

      const matchCriteria = (val: any, crit: any): boolean => {
        if (typeof crit === 'number' || typeof crit === 'boolean') return val == crit;
        const s = String(crit).trim();
        const vNum = parseFloat(val);
        const vStr = String(val);
        const opMatch = s.match(/^(>=|<=|<>|>|<|=)(.*)$/);
        if (opMatch) {
          const op = opMatch[1];
          const rhsRaw = opMatch[2].trim();
          const rhsNum = parseFloat(rhsRaw);
          const rhs = isNaN(rhsNum) ? rhsRaw : rhsNum;
          const lv = typeof rhs === 'number' ? (isNaN(vNum) ? NaN : vNum) : vStr;
          switch (op) {
            case '>': return typeof rhs === 'number' && typeof lv === 'number' ? lv > rhs : vStr > String(rhs);
            case '<': return typeof rhs === 'number' && typeof lv === 'number' ? lv < rhs : vStr < String(rhs);
            case '>=': return typeof rhs === 'number' && typeof lv === 'number' ? lv >= rhs : vStr >= String(rhs);
            case '<=': return typeof rhs === 'number' && typeof lv === 'number' ? lv <= rhs : vStr <= String(rhs);
            case '<>': return vStr !== String(rhs);
            case '=': return vStr === String(rhs);
          }
        }
        return vStr === s;
      };

      let total = 0;
      let count = 0;
      for (let i = 0; i < minLen; i++) {
        const ok = criteriaPairs.every(p => matchCriteria(p.range[i], p.criterion));
        if (ok) {
          total += avgRange[i] || 0;
          count++;
        }
      }
      return count === 0 ? '#DIV/0!' : total / count;
    }
  }
};

// Helper functions for RATE calculation
const calculatePVFunction = (rate: number, nper: number, pmt: number, pv: number, fv: number, type: number): number => {
  if (rate === 0) {
    return pv + pmt * nper + fv;
  }
  const pvif = Math.pow(1 + rate, nper);
  return pv * pvif + pmt * (1 + rate * type) * ((pvif - 1) / rate) + fv;
};

const calculatePVDerivative = (rate: number, nper: number, pmt: number, pv: number, fv: number, type: number): number => {
  if (rate === 0) {
    return 0;
  }
  const pvif = Math.pow(1 + rate, nper);
  const dpvif = nper * Math.pow(1 + rate, nper - 1);
  
  const term1 = pv * dpvif;
  const term2 = pmt * type * ((pvif - 1) / rate);
  const term3 = pmt * (1 + rate * type) * ((dpvif * rate - (pvif - 1)) / (rate * rate));
  
  return term1 + term2 + term3;
};