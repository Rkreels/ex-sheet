// Formula Integration - Ensures all Excel functions work properly across the application
import { Cell } from '../types/sheet';
import { evaluateFormula, batchEvaluateFormulas } from './enhancedFormulaEvaluator';
import { comprehensiveFormulas } from './comprehensiveFormulas';

// Function to test formula availability and functionality
export const testFormulaFunctionality = (): { 
  totalFunctions: number; 
  workingFunctions: number; 
  categories: Record<string, number>;
} => {
  const categories: Record<string, number> = {
    'Math': 0,
    'Statistical': 0, 
    'Financial': 0,
    'Date': 0,
    'Text': 0,
    'Logical': 0,
    'Lookup': 0,
    'Array': 0,
    'Engineering': 0,
    'Information': 0
  };

  let workingFunctions = 0;
  const totalFunctions = Object.keys(comprehensiveFormulas).length;

  // Test each function with sample data
  const testCells: Record<string, Cell> = {
    'A1': { value: '10' },
    'A2': { value: '20' },
    'A3': { value: '30' },
    'B1': { value: '5' },
    'B2': { value: '15' },
    'B3': { value: '25' },
  };

  Object.entries(comprehensiveFormulas).forEach(([funcName, func]) => {
    try {
      // Test basic functionality
      let testArgs: any[] = [];
      
      // Determine test arguments based on function name
      if (['SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT'].includes(funcName)) {
        testArgs = [[10, 20, 30]];
      } else if (['SQRT', 'ABS', 'ROUND'].includes(funcName)) {
        testArgs = [16];
      } else if (['POWER', 'MOD'].includes(funcName)) {
        testArgs = [2, 3];
      } else if (['IF'].includes(funcName)) {
        testArgs = [true, 'Yes', 'No'];
      } else if (['CONCATENATE', 'LEFT', 'RIGHT'].includes(funcName)) {
        testArgs = ['Hello'];
      } else {
        testArgs = [1]; // Default test
      }

      const result = func.execute ? func.execute(testArgs) : (func as any)(testArgs);
      
      if (result !== undefined && !String(result).includes('#ERROR')) {
        workingFunctions++;
        
        // Categorize function
        if (['SUM', 'PRODUCT', 'POWER', 'SQRT', 'ABS', 'ROUND', 'CEILING', 'FLOOR'].includes(funcName)) {
          categories['Math']++;
        } else if (['AVERAGE', 'MEDIAN', 'STDEV', 'VAR', 'CORREL'].includes(funcName)) {
          categories['Statistical']++;
        } else if (['PMT', 'PV', 'FV', 'NPV', 'IRR', 'RATE'].includes(funcName)) {
          categories['Financial']++;
        } else if (['TODAY', 'NOW', 'YEAR', 'MONTH', 'DAY', 'WEEKDAY'].includes(funcName)) {
          categories['Date']++;
        } else if (['LEFT', 'RIGHT', 'MID', 'LEN', 'UPPER', 'LOWER', 'TRIM'].includes(funcName)) {
          categories['Text']++;
        } else if (['IF', 'AND', 'OR', 'NOT', 'XOR'].includes(funcName)) {
          categories['Logical']++;
        } else if (['VLOOKUP', 'HLOOKUP', 'INDEX', 'MATCH'].includes(funcName)) {
          categories['Lookup']++;
        } else if (['TRANSPOSE', 'SORT', 'UNIQUE', 'FILTER'].includes(funcName)) {
          categories['Array']++;
        } else {
          categories['Information']++;
        }
      }
    } catch (error) {
      console.warn(`Function ${funcName} failed test:`, error);
    }
  });

  return {
    totalFunctions,
    workingFunctions,
    categories
  };
};

// Initialize and validate all formula functionality
export const initializeFormulaEngine = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const testResults = testFormulaFunctionality();
      
      console.log('📊 Formula Engine Initialized:', {
        totalFunctions: testResults.totalFunctions,
        workingFunctions: testResults.workingFunctions,
        successRate: `${Math.round((testResults.workingFunctions / testResults.totalFunctions) * 100)}%`,
        categories: testResults.categories
      });

      // Test complex multi-cell formulas
      const testCells: Record<string, Cell> = {
        'A1': { value: '100' },
        'A2': { value: '200' },
        'A3': { value: '300' },
        'B1': { value: '10' },
        'B2': { value: '20' },
        'B3': { value: '30' },
        'C1': { value: '=A1*B1' },
        'C2': { value: '=A2*B2' },
        'C3': { value: '=A3*B3' },
        'D1': { value: '=SUM(C1:C3)' },
        'E1': { value: '=AVERAGE(A1:A3)' },
        'F1': { value: '=IF(D1>10000,"High","Low")' }
      };

      // Test batch evaluation
      const results = batchEvaluateFormulas(['C1', 'C2', 'C3', 'D1', 'E1', 'F1'], testCells);
      
      const allWorking = Object.values(results).every(result => 
        !String(result).includes('#ERROR') && !String(result).includes('#VALUE')
      );

      if (allWorking) {
        console.log('✅ Multi-cell formula evaluation working correctly');
        console.log('📝 Test Results:', results);
      } else {
        console.warn('⚠️ Some multi-cell formulas failed:', results);
      }

      resolve(testResults.workingFunctions > testResults.totalFunctions * 0.9); // 90% success rate required
      
    } catch (error) {
      console.error('❌ Formula engine initialization failed:', error);
      resolve(false);
    }
  });
};

// Comprehensive formula validation for specific operations
export const validateFormulaOperations = (operations: string[]): Record<string, boolean> => {
  const results: Record<string, boolean> = {};
  
  const testCells: Record<string, Cell> = {
    'A1': { value: '100' },
    'A2': { value: '200' },
    'B1': { value: '50' },
    'B2': { value: '25' },
  };

  operations.forEach(operation => {
    try {
      const result = evaluateFormula(operation, testCells);
      results[operation] = !String(result).includes('#ERROR') && !String(result).includes('#VALUE');
    } catch (error) {
      results[operation] = false;
    }
  });

  return results;
};

// Export comprehensive formula list for UI components
export const getAvailableFormulas = (): { name: string; category: string; description: string }[] => {
  return Object.entries(comprehensiveFormulas).map(([name, func]) => ({
    name,
    category: categorizeFunctionByName(name),
    description: func.description || `${name} function`
  }));
};

// Helper to categorize functions
const categorizeFunctionByName = (funcName: string): string => {
  if (['SUM', 'PRODUCT', 'POWER', 'SQRT', 'ABS', 'ROUND', 'CEILING', 'FLOOR', 'TRUNC', 'MOD'].includes(funcName)) {
    return 'Math & Trigonometry';
  } else if (['AVERAGE', 'MEDIAN', 'MODE', 'STDEV', 'VAR', 'CORREL', 'QUARTILE', 'PERCENTILE'].includes(funcName)) {
    return 'Statistical';
  } else if (['PMT', 'PV', 'FV', 'NPV', 'IRR', 'RATE', 'NPER'].includes(funcName)) {
    return 'Financial';
  } else if (['TODAY', 'NOW', 'YEAR', 'MONTH', 'DAY', 'WEEKDAY', 'NETWORKDAYS', 'WORKDAY'].includes(funcName)) {
    return 'Date & Time';
  } else if (['LEFT', 'RIGHT', 'MID', 'LEN', 'UPPER', 'LOWER', 'TRIM', 'CONCATENATE', 'EXACT', 'FIND'].includes(funcName)) {
    return 'Text';
  } else if (['IF', 'AND', 'OR', 'NOT', 'XOR', 'IFERROR', 'IFNA'].includes(funcName)) {
    return 'Logical';
  } else if (['VLOOKUP', 'HLOOKUP', 'INDEX', 'MATCH', 'XLOOKUP'].includes(funcName)) {
    return 'Lookup & Reference';
  } else if (['TRANSPOSE', 'SORT', 'UNIQUE', 'FILTER', 'MMULT'].includes(funcName)) {
    return 'Array';
  } else if (['BIN2DEC', 'DEC2BIN', 'ROMAN', 'ARABIC', 'BASE', 'DECIMAL'].includes(funcName)) {
    return 'Engineering';
  } else {
    return 'Information';
  }
};