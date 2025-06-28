
// Additional comprehensive formula functions for advanced Excel-like functionality
export const comprehensiveFormulas = {
  // Advanced Math Functions
  RANDBETWEEN: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,
  
  ROUND: (number: number, digits: number = 0) => Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits),
  
  ROUNDUP: (number: number, digits: number = 0) => Math.ceil(number * Math.pow(10, digits)) / Math.pow(10, digits),
  
  ROUNDDOWN: (number: number, digits: number = 0) => Math.floor(number * Math.pow(10, digits)) / Math.pow(10, digits),
  
  ABS: (number: number) => Math.abs(number),
  
  SQRT: (number: number) => Math.sqrt(number),
  
  POWER: (number: number, power: number) => Math.pow(number, power),
  
  MOD: (number: number, divisor:number) => number % divisor,
  
  // Advanced Statistical Functions
  MEDIAN: (args: number[]) => {
    const sorted = args.sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },
  
  MODE: (args: number[]) => {
    const frequency = {};
    let maxFreq = 0;
    let mode = args[0];
    
    args.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        mode = num;
      }
    });
    
    return mode;
  },
  
  QUARTILE: (args: number[], quartile: number) => {
    const sorted = args.sort((a, b) => a - b);
    const n = sorted.length;
    
    switch(quartile) {
      case 0: return sorted[0];
      case 1: return sorted[Math.floor(n * 0.25)];
      case 2: return sorted[Math.floor(n * 0.5)];
      case 3: return sorted[Math.floor(n * 0.75)];
      case 4: return sorted[n - 1];
      default: return 0;
    }
  },
  
  PERCENTILE: (args: number[], k: number) => {
    const sorted = args.sort((a, b) => a - b);
    const index = k * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (upper >= sorted.length) return sorted[sorted.length - 1];
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
  },
  
  // Financial Functions Extended
  FV: (rate: number, nper: number, pmt: number, pv: number = 0, type: number = 0) => {
    if (rate === 0) return -(pv + pmt * nper);
    
    const factor = Math.pow(1 + rate, nper);
    return -(pv * factor + pmt * (factor - 1) / rate * (1 + rate * type));
  },
  
  PV: (rate: number, nper: number, pmt: number, fv: number = 0, type: number = 0) => {
    if (rate === 0) return -(fv + pmt * nper);
    
    const factor = Math.pow(1 + rate, nper);
    return -(fv + pmt * (factor - 1) / rate * (1 + rate * type)) / factor;
  },
  
  NPER: (rate: number, pmt: number, pv: number, fv: number = 0, type: number = 0) => {
    if (rate === 0) return -(fv + pv) / pmt;
    
    const num = pmt * (1 + rate * type) - fv * rate;
    const den = pv * rate + pmt * (1 + rate * type);
    
    return Math.log(num / den) / Math.log(1 + rate);
  },
  
  RATE: (nper: number, pmt: number, pv: number, fv: number = 0, type: number = 0, guess: number = 0.1) => {
    // Newton-Raphson method for finding rate
    let rate = guess;
    for (let i = 0; i < 100; i++) {
      const f = pv + pmt * (1 + rate * type) * ((Math.pow(1 + rate, nper) - 1) / rate) + fv * Math.pow(1 + rate, -nper);
      const df = pmt * (1 + rate * type) * (nper * Math.pow(1 + rate, nper - 1) / rate - (Math.pow(1 + rate, nper) - 1) / (rate * rate)) - fv * nper * Math.pow(1 + rate, -nper - 1);
      
      const newRate = rate - f / df;
      if (Math.abs(newRate - rate) < 1e-10) return newRate;
      rate = newRate;
    }
    return rate;
  },
  
  // Date Functions Extended
  DATEDIF: (startDate: Date, endDate: Date, unit: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    switch(unit.toUpperCase()) {
      case 'Y': return end.getFullYear() - start.getFullYear();
      case 'M': return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      case 'D': return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      default: return 0;
    }
  },
  
  WEEKDAY: (date: Date, type: number = 1) => {
    const day = new Date(date).getDay();
    switch(type) {
      case 1: return day === 0 ? 7 : day; // Sunday = 7
      case 2: return day === 0 ? 6 : day - 1; // Monday = 0
      case 3: return day; // Sunday = 0
      default: return day;
    }
  },
  
  WORKDAY: (startDate: Date, days: number, holidays: Date[] = []) => {
    const result = new Date(startDate);
    let addedDays = 0;
    
    while (addedDays < Math.abs(days)) {
      result.setDate(result.getDate() + (days > 0 ? 1 : -1));
      
      // Skip weekends and holidays
      if (result.getDay() !== 0 && result.getDay() !== 6 && 
          !holidays.some(holiday => holiday.toDateString() === result.toDateString())) {
        addedDays++;
      }
    }
    
    return result;
  },
  
  // Text Functions Extended
  PROPER: (text: string) => text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
  
  TRIM: (text: string) => text.trim().replace(/\s+/g, ' '),
  
  SUBSTITUTE: (text: string, oldText: string, newText: string, instanceNum?: number) => {
    if (instanceNum) {
      let count = 0;
      return text.replace(new RegExp(oldText, 'g'), match => {
        count++;
        return count === instanceNum ? newText : match;
      });
    }
    return text.replace(new RegExp(oldText, 'g'), newText);
  },
  
  FIND: (findText: string, withinText: string, startNum: number = 1) => {
    const index = withinText.indexOf(findText, startNum - 1);
    return index === -1 ? '#VALUE!' : index + 1;
  },
  
  SEARCH: (findText: string, withinText: string, startNum: number = 1) => {
    const regex = new RegExp(findText, 'i');
    const match = withinText.substring(startNum - 1).match(regex);
    return match ? match.index + startNum : '#VALUE!';
  },
  
  // Logical Functions Extended
  SWITCH: (expression: any, ...cases: any[]) => {
    for (let i = 0; i < cases.length - 1; i += 2) {
      if (expression === cases[i]) return cases[i + 1];
    }
    return cases.length % 2 === 1 ? cases[cases.length - 1] : '#N/A';
  },
  
  IFS: (...conditions: any[]) => {
    for (let i = 0; i < conditions.length - 1; i += 2) {
      if (conditions[i]) return conditions[i + 1];
    }
    return '#N/A';
  },
  
  // Array Functions
  TRANSPOSE: (array: any[][]) => {
    return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
  },
  
  SUMIF: (range: any[], criteria: any, sumRange?: any[]) => {
    const sum = sumRange || range;
    return range.reduce((total, value, index) => {
      if (typeof criteria === 'string' && criteria.includes('>')) {
        const threshold = parseFloat(criteria.substring(1));
        return value > threshold ? total + (sum[index] || 0) : total;
      } else if (typeof criteria === 'string' && criteria.includes('<')) {
        const threshold = parseFloat(criteria.substring(1));
        return value < threshold ? total + (sum[index] || 0) : total;
      } else if (value === criteria) {
        return total + (sum[index] || 0);
      }
      return total;
    }, 0);
  },
  
  COUNTIF: (range: any[], criteria: any) => {
    return range.filter(value => {
      if (typeof criteria === 'string' && criteria.includes('>')) {
        const threshold = parseFloat(criteria.substring(1));
        return value > threshold;
      } else if (typeof criteria === 'string' && criteria.includes('<')) {
        const threshold = parseFloat(criteria.substring(1));
        return value < threshold;
      }
      return value === criteria;
    }).length;
  },
  
  AVERAGEIF: (range: any[], criteria: any, averageRange?: any[]) => {
    const avgRange = averageRange || range;
    const matchingValues = range.reduce((acc, value, index) => {
      if (typeof criteria === 'string' && criteria.includes('>')) {
        const threshold = parseFloat(criteria.substring(1));
        if (value > threshold) acc.push(avgRange[index]);
      } else if (typeof criteria === 'string' && criteria.includes('<')) {
        const threshold = parseFloat(criteria.substring(1));
        if (value < threshold) acc.push(avgRange[index]);
      } else if (value === criteria) {
        acc.push(avgRange[index]);
      }
      return acc;
    }, []);
    
    return matchingValues.length > 0 ? matchingValues.reduce((sum, val) => sum + val, 0) / matchingValues.length : 0;
  }
};

export default comprehensiveFormulas;
