import { Cell } from '../types/sheet';

// Comprehensive Excel-like formula functions
export const comprehensiveFormulas = {
  // Math & Trigonometry Functions
  ABS: (args: any[]) => Math.abs(Number(args[0]) || 0),
  ACOS: (args: any[]) => Math.acos(Number(args[0]) || 0),
  ASIN: (args: any[]) => Math.asin(Number(args[0]) || 0),
  ATAN: (args: any[]) => Math.atan(Number(args[0]) || 0),
  ATAN2: (args: any[]) => Math.atan2(Number(args[0]) || 0, Number(args[1]) || 0),
  CEILING: (args: any[]) => Math.ceil(Number(args[0]) || 0),
  COS: (args: any[]) => Math.cos(Number(args[0]) || 0),
  DEGREES: (args: any[]) => (Number(args[0]) || 0) * (180 / Math.PI),
  EXP: (args: any[]) => Math.exp(Number(args[0]) || 0),
  FACT: (args: any[]) => {
    const n = Number(args[0]) || 0;
    if (n < 0) return '#NUM!';
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  },
  FLOOR: (args: any[]) => Math.floor(Number(args[0]) || 0),
  GCD: (args: any[]) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const numbers = args.map(arg => Number(arg) || 0);
    return numbers.reduce(gcd);
  },
  INT: (args: any[]) => Math.floor(Number(args[0]) || 0),
  LCM: (args: any[]) => {
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);
    const numbers = args.map(arg => Number(arg) || 0);
    return numbers.reduce(lcm);
  },
  LN: (args: any[]) => Math.log(Number(args[0]) || 1),
  LOG: (args: any[]) => {
    const value = Number(args[0]) || 1;
    const base = args.length > 1 ? Number(args[1]) || 10 : 10;
    return base === 10 ? Math.log10(value) : Math.log(value) / Math.log(base);
  },
  LOG10: (args: any[]) => Math.log10(Number(args[0]) || 1),
  MOD: (args: any[]) => (Number(args[0]) || 0) % (Number(args[1]) || 1),
  PI: () => Math.PI,
  POWER: (args: any[]) => Math.pow(Number(args[0]) || 0, Number(args[1]) || 0),
  RADIANS: (args: any[]) => (Number(args[0]) || 0) * (Math.PI / 180),
  RAND: () => Math.random(),
  RANDBETWEEN: (args: any[]) => {
    const min = Number(args[0]) || 0;
    const max = Number(args[1]) || 0;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  ROUND: (args: any[]) => {
    const value = Number(args[0]) || 0;
    const digits = Number(args[1]) || 0;
    return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
  },
  ROUNDDOWN: (args: any[]) => {
    const value = Number(args[0]) || 0;
    const digits = Number(args[1]) || 0;
    return Math.floor(value * Math.pow(10, digits)) / Math.pow(10, digits);
  },
  ROUNDUP: (args: any[]) => {
    const value = Number(args[0]) || 0;
    const digits = Number(args[1]) || 0;
    return Math.ceil(value * Math.pow(10, digits)) / Math.pow(10, digits);
  },
  SIGN: (args: any[]) => {
    const value = Number(args[0]) || 0;
    return value > 0 ? 1 : value < 0 ? -1 : 0;
  },
  SIN: (args: any[]) => Math.sin(Number(args[0]) || 0),
  SQRT: (args: any[]) => Math.sqrt(Number(args[0]) || 0),
  SUBTOTAL: (args: any[]) => {
    const funcNum = Number(args[0]) || 0;
    const values = args.slice(1).flat().map(val => Number(val) || 0);
    switch (funcNum) {
      case 1: case 101: return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 2: case 102: return values.filter(val => !isNaN(val)).length;
      case 9: case 109: return values.reduce((sum, val) => sum + val, 0);
      case 4: case 104: return Math.max(...values);
      case 5: case 105: return Math.min(...values);
      default: return 0;
    }
  },
  TAN: (args: any[]) => Math.tan(Number(args[0]) || 0),
  TRUNC: (args: any[]) => Math.trunc(Number(args[0]) || 0),

  // Statistical Functions
  AVERAGE: (args: any[]) => {
    const values = args.flat().filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
    return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  },
  AVERAGEIF: (args: any[]) => {
    const [range, criteria] = args;
    const values = Array.isArray(range) ? range.flat() : [range];
    const matching = values.filter(val => val === criteria);
    return matching.length > 0 ? matching.reduce((sum, val) => sum + parseFloat(val), 0) / matching.length : 0;
  },
  COUNT: (args: any[]) => args.flat().filter(val => !isNaN(parseFloat(val))).length,
  COUNTA: (args: any[]) => args.flat().filter(val => val !== null && val !== undefined && val !== '').length,
  COUNTBLANK: (args: any[]) => args.flat().filter(val => val === null || val === undefined || val === '').length,
  COUNTIF: (args: any[]) => {
    const [range, criteria] = args;
    const values = Array.isArray(range) ? range.flat() : [range];
    return values.filter(val => val === criteria).length;
  },
  COUNTIFS: (args: any[]) => {
    const ranges = [];
    const criteria = [];
    for (let i = 0; i < args.length; i += 2) {
      ranges.push(Array.isArray(args[i]) ? args[i].flat() : [args[i]]);
      criteria.push(args[i + 1]);
    }
    
    let count = 0;
    const maxLength = Math.max(...ranges.map(r => r.length));
    
    for (let i = 0; i < maxLength; i++) {
      let matches = true;
      for (let j = 0; j < ranges.length; j++) {
        if (ranges[j][i] !== criteria[j]) {
          matches = false;
          break;
        }
      }
      if (matches) count++;
    }
    return count;
  },
  FREQUENCY: (args: any[]) => {
    const [dataArray, binsArray] = args;
    const data = Array.isArray(dataArray) ? dataArray.flat() : [dataArray];
    const bins = Array.isArray(binsArray) ? binsArray.flat() : [binsArray];
    
    const result = new Array(bins.length + 1).fill(0);
    data.forEach(value => {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        let binIndex = bins.findIndex(bin => num <= bin);
        if (binIndex === -1) binIndex = bins.length;
        result[binIndex]++;
      }
    });
    return result;
  },
  LARGE: (args: any[]) => {
    const [array, k] = args;
    const values = (Array.isArray(array) ? array.flat() : [array])
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val))
      .sort((a, b) => b - a);
    return values[k - 1] || '#NUM!';
  },
  MAX: (args: any[]) => {
    const values = args.flat().map(val => parseFloat(val)).filter(val => !isNaN(val));
    return values.length > 0 ? Math.max(...values) : 0;
  },
  MEDIAN: (args: any[]) => {
    const values = args.flat().map(val => parseFloat(val)).filter(val => !isNaN(val)).sort((a, b) => a - b);
    const len = values.length;
    return len === 0 ? 0 : len % 2 === 0 ? (values[len / 2 - 1] + values[len / 2]) / 2 : values[Math.floor(len / 2)];
  },
  MIN: (args: any[]) => {
    const values = args.flat().map(val => parseFloat(val)).filter(val => !isNaN(val));
    return values.length > 0 ? Math.min(...values) : 0;
  },
  MODE: (args: any[]) => {
    const values = args.flat().map(val => parseFloat(val)).filter(val => !isNaN(val));
    const frequency = {};
    values.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
    let maxFreq = 0;
    let mode = null;
    for (const [val, freq] of Object.entries(frequency)) {
      if (freq > maxFreq) {
        maxFreq = freq;
        mode = parseFloat(val);
      }
    }
    return maxFreq > 1 ? mode : '#N/A';
  },
  NORMDIST: (args: any[]) => {
    const [x, mean, stdDev, cumulative] = args;
    if (cumulative) {
      // Cumulative normal distribution (approximation)
      const z = (x - mean) / stdDev;
      return 0.5 * (1 + erf(z / Math.sqrt(2)));
    } else {
      // Probability density function
      const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
      const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
      return coefficient * Math.exp(exponent);
    }
  },
  PERCENTILE: (args: any[]) => {
    const [array, k] = args;
    const values = (Array.isArray(array) ? array.flat() : [array])
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val))
      .sort((a, b) => a - b);
    
    const index = k * (values.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    if (lower === upper) return values[lower];
    return values[lower] + (values[upper] - values[lower]) * (index - lower);
  },
  QUARTILE: (args: any[]) => {
    const [array, quart] = args;
    const values = (Array.isArray(array) ? array.flat() : [array])
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val))
      .sort((a, b) => a - b);
    
    switch (quart) {
      case 0: return Math.min(...values);
      case 1: return comprehensiveFormulas.PERCENTILE([values, 0.25]);
      case 2: return comprehensiveFormulas.PERCENTILE([values, 0.5]);
      case 3: return comprehensiveFormulas.PERCENTILE([values, 0.75]);
      case 4: return Math.max(...values);
      default: return '#NUM!';
    }
  },
  RANK: (args: any[]) => {
    const [number, array, order = 0] = args;
    const values = (Array.isArray(array) ? array.flat() : [array])
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val));
    
    if (order === 0) {
      // Descending order
      values.sort((a, b) => b - a);
    } else {
      // Ascending order
      values.sort((a, b) => a - b);
    }
    
    return values.indexOf(number) + 1 || '#N/A';
  },
  SMALL: (args: any[]) => {
    const [array, k] = args;
    const values = (Array.isArray(array) ? array.flat() : [array])
      .map(val => parseFloat(val))
      .filter(val => !isNaN(val))
      .sort((a, b) => a - b);
    return values[k - 1] || '#NUM!';
  },
  STANDARDIZE: (args: any[]) => {
    const [x, mean, stdDev] = args;
    return (x - mean) / stdDev;
  },
  STDEV: (args: any[]) => {
    const values = args.flat().map(val => parseFloat(val)).filter(val => !isNaN(val));
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
    return Math.sqrt(variance);
  },
  STDEVP: (args: any[]) => {
    const values = args.flat().map(val => parseFloat(val)).filter(val => !isNaN(val));
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  },
  VAR: (args: any[]) => {
    const values = args.flat().map(val => parseFloat(val)).filter(val => !isNaN(val));
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
  },
  VARP: (args: any[]) => {
    const values = args.flat().map(val => parseFloat(val)).filter(val => !isNaN(val));
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  },

  // Financial Functions
  FV: (args: any[]) => {
    const [rate, nper, pmt, pv = 0, type = 0] = args;
    const pvFactor = Math.pow(1 + rate, nper);
    const pmtFactor = type === 0 ? 
      (Math.pow(1 + rate, nper) - 1) / rate : 
      (1 + rate) * (Math.pow(1 + rate, nper) - 1) / rate;
    return -(pv * pvFactor + pmt * pmtFactor);
  },
  PV: (args: any[]) => {
    const [rate, nper, pmt, fv = 0, type = 0] = args;
    const pvFactor = Math.pow(1 + rate, -nper);
    const pmtFactor = type === 0 ? 
      (1 - pvFactor) / rate : 
      (1 + rate) * (1 - pvFactor) / rate;
    return -(fv * pvFactor + pmt * pmtFactor);
  },
  RATE: (args: any[]) => {
    const [nper, pmt, pv, fv = 0, type = 0, guess = 0.1] = args;
    let rate = guess;
    const maxIterations = 100;
    const tolerance = 1e-6;
    
    for (let i = 0; i < maxIterations; i++) {
      const f = comprehensiveFormulas.PV([rate, nper, pmt, fv, type]) + pv;
      const df = -nper * Math.pow(1 + rate, -nper - 1) * fv - 
                 pmt * (type === 0 ? 
                   (nper * Math.pow(1 + rate, -nper - 1) * rate - (1 - Math.pow(1 + rate, -nper))) / (rate * rate) :
                   (1 + rate) * (nper * Math.pow(1 + rate, -nper - 1) * rate - (1 - Math.pow(1 + rate, -nper))) / (rate * rate));
      
      if (Math.abs(f) < tolerance) return rate;
      if (Math.abs(df) < tolerance) return '#NUM!';
      
      rate = rate - f / df;
    }
    return '#NUM!';
  },
  NPER: (args: any[]) => {
    const [rate, pmt, pv, fv = 0, type = 0] = args;
    if (rate === 0) return -(pv + fv) / pmt;
    
    const factor = type === 0 ? pmt / rate : pmt * (1 + rate) / rate;
    return Math.log((factor - fv) / (factor + pv)) / Math.log(1 + rate);
  },

  // Date & Time Functions
  DATE: (args: any[]) => {
    const [year, month, day] = args;
    return new Date(year, month - 1, day).toLocaleDateString();
  },
  DATEVALUE: (args: any[]) => {
    const date = new Date(args[0]);
    return date.getTime() / (1000 * 60 * 60 * 24) + 25569; // Excel date serial number
  },
  DAY: (args: any[]) => new Date(args[0]).getDate(),
  DAYS: (args: any[]) => {
    const [endDate, startDate] = args;
    const end = new Date(endDate);
    const start = new Date(startDate);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  },
  EDATE: (args: any[]) => {
    const [startDate, months] = args;
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + months);
    return date.toLocaleDateString();
  },
  EOMONTH: (args: any[]) => {
    const [startDate, months] = args;
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + months + 1);
    date.setDate(0);
    return date.toLocaleDateString();
  },
  HOUR: (args: any[]) => new Date(args[0]).getHours(),
  MINUTE: (args: any[]) => new Date(args[0]).getMinutes(),
  MONTH: (args: any[]) => new Date(args[0]).getMonth() + 1,
  NETWORKDAYS: (args: any[]) => {
    const [startDate, endDate, holidays = []] = args;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const holidaySet = new Set(holidays.map(h => new Date(h).toDateString()));
    
    let count = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidaySet.has(current.toDateString())) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  },
  NOW: () => new Date().toLocaleString(),
  SECOND: (args: any[]) => new Date(args[0]).getSeconds(),
  TIME: (args: any[]) => {
    const [hour, minute, second] = args;
    const date = new Date();
    date.setHours(hour, minute, second);
    return date.toLocaleTimeString();
  },
  TIMEVALUE: (args: any[]) => {
    const date = new Date(`1/1/1970 ${args[0]}`);
    return (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 86400;
  },
  TODAY: () => new Date().toLocaleDateString(),
  WEEKDAY: (args: any[]) => {
    const [date, returnType = 1] = args;
    const dayOfWeek = new Date(date).getDay();
    switch (returnType) {
      case 1: return dayOfWeek === 0 ? 7 : dayOfWeek; // Sunday = 7
      case 2: return dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
      case 3: return dayOfWeek; // Sunday = 0
      default: return dayOfWeek;
    }
  },
  WEEKNUM: (args: any[]) => {
    const [date, returnType = 1] = args;
    const d = new Date(date);
    const startOfYear = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  },
  WORKDAY: (args: any[]) => {
    const [startDate, days, holidays = []] = args;
    const start = new Date(startDate);
    const holidaySet = new Set(holidays.map(h => new Date(h).toDateString()));
    
    let current = new Date(start);
    let workdaysAdded = 0;
    
    while (workdaysAdded < days) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidaySet.has(current.toDateString())) {
        workdaysAdded++;
      }
    }
    
    return current.toLocaleDateString();
  },
  YEAR: (args: any[]) => new Date(args[0]).getFullYear(),
  YEARFRAC: (args: any[]) => {
    const [startDate, endDate, basis = 0] = args;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    
    switch (basis) {
      case 0: return days / 360; // 30/360
      case 1: return days / 365; // Actual/365
      case 2: return days / 360; // Actual/360
      case 3: return days / 365; // Actual/365
      case 4: return days / 360; // 30/360 European
      default: return days / 365;
    }
  },

  // Text Functions
  CHAR: (args: any[]) => String.fromCharCode(args[0]),
  CLEAN: (args: any[]) => args[0].replace(/[\x00-\x1F\x7F]/g, ''),
  CODE: (args: any[]) => args[0].charCodeAt(0),
  CONCATENATE: (args: any[]) => args.join(''),
  DOLLAR: (args: any[]) => {
    const [number, decimals = 2] = args;
    return '$' + parseFloat(number).toFixed(decimals);
  },
  EXACT: (args: any[]) => args[0] === args[1],
  FIND: (args: any[]) => {
    const [findText, withinText, startNum = 1] = args;
    const index = withinText.indexOf(findText, startNum - 1);
    return index === -1 ? '#VALUE!' : index + 1;
  },
  FIXED: (args: any[]) => {
    const [number, decimals = 2, noCommas = false] = args;
    const fixed = parseFloat(number).toFixed(decimals);
    return noCommas ? fixed : fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  LEFT: (args: any[]) => {
    const [text, numChars = 1] = args;
    return String(text).substring(0, numChars);
  },
  LEN: (args: any[]) => String(args[0]).length,
  LOWER: (args: any[]) => String(args[0]).toLowerCase(),
  MID: (args: any[]) => {
    const [text, startNum, numChars] = args;
    return String(text).substring(startNum - 1, startNum - 1 + numChars);
  },
  PROPER: (args: any[]) => {
    return String(args[0]).replace(/\w\S*/g, txt => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  },
  REPLACE: (args: any[]) => {
    const [oldText, startNum, numChars, newText] = args;
    const str = String(oldText);
    return str.substring(0, startNum - 1) + newText + str.substring(startNum - 1 + numChars);
  },
  REPT: (args: any[]) => String(args[0]).repeat(args[1]),
  RIGHT: (args: any[]) => {
    const [text, numChars = 1] = args;
    const str = String(text);
    return str.substring(str.length - numChars);
  },
  SEARCH: (args: any[]) => {
    const [findText, withinText, startNum = 1] = args;
    const index = withinText.toLowerCase().indexOf(findText.toLowerCase(), startNum - 1);
    return index === -1 ? '#VALUE!' : index + 1;
  },
  SUBSTITUTE: (args: any[]) => {
    const [text, oldText, newText, instanceNum] = args;
    let result = String(text);
    if (instanceNum) {
      let count = 0;
      let index = 0;
      while ((index = result.indexOf(oldText, index)) !== -1) {
        count++;
        if (count === instanceNum) {
          result = result.substring(0, index) + newText + result.substring(index + oldText.length);
          break;
        }
        index += oldText.length;
      }
    } else {
      result = result.replace(new RegExp(oldText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);
    }
    return result;
  },
  T: (args: any[]) => typeof args[0] === 'string' ? args[0] : '',
  TEXT: (args: any[]) => {
    const [value, formatText] = args;
    // Simplified text formatting
    if (formatText.includes('0.00')) {
      return parseFloat(value).toFixed(2);
    } else if (formatText.includes('0')) {
      return Math.round(parseFloat(value)).toString();
    }
    return String(value);
  },
  TRIM: (args: any[]) => String(args[0]).trim(),
  UPPER: (args: any[]) => String(args[0]).toUpperCase(),
  VALUE: (args: any[]) => parseFloat(args[0]) || 0
};

// Helper function for normal distribution
function erf(x: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

export default comprehensiveFormulas;
