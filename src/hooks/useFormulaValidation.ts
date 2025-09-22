// Hook for validating and testing Excel formula functionality
import { useState, useEffect } from 'react';
import { initializeFormulaEngine, testFormulaFunctionality, getAvailableFormulas } from '../utils/formulaIntegration';

export const useFormulaValidation = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [functionStats, setFunctionStats] = useState<{
    totalFunctions: number;
    workingFunctions: number;
    categories: Record<string, number>;
  } | null>(null);
  const [availableFormulas, setAvailableFormulas] = useState<
    { name: string; category: string; description: string }[]
  >([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const success = await initializeFormulaEngine();
        setIsInitialized(success);
        
        if (success) {
          const stats = testFormulaFunctionality();
          setFunctionStats(stats);
          
          const formulas = getAvailableFormulas();
          setAvailableFormulas(formulas);
          
          console.log(`✅ Excel Formula Engine Ready: ${stats.workingFunctions}/${stats.totalFunctions} functions working`);
        }
      } catch (error) {
        console.error('Formula engine initialization failed:', error);
        setIsInitialized(false);
      }
    };

    initialize();
  }, []);

  return {
    isInitialized,
    functionStats,
    availableFormulas,
    totalFunctions: functionStats?.totalFunctions || 0,
    workingFunctions: functionStats?.workingFunctions || 0,
    successRate: functionStats ? Math.round((functionStats.workingFunctions / functionStats.totalFunctions) * 100) : 0
  };
};