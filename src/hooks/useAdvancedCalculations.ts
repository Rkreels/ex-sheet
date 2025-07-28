import { useCallback } from 'react';
import { Sheet, Cell } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { toast } from 'sonner';

export const useAdvancedCalculations = (
  activeSheet: Sheet,
  activeSheetId: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>
) => {

  // Recalculate all formulas in the sheet
  const recalculateSheet = useCallback(() => {
    const updatedCells = { ...activeSheet.cells };
    const formulaCells: string[] = [];
    
    // Find all formula cells
    Object.entries(updatedCells).forEach(([cellId, cell]) => {
      if (cell.value?.startsWith('=')) {
        formulaCells.push(cellId);
      }
    });

    // Build dependency graph and calculate in correct order
    const dependencies = new Map<string, Set<string>>();
    const dependents = new Map<string, Set<string>>();

    formulaCells.forEach(cellId => {
      const formula = updatedCells[cellId].value.substring(1);
      const refs = formula.match(/[A-Z]+[0-9]+/g) || [];
      dependencies.set(cellId, new Set(refs));
      
      refs.forEach(ref => {
        if (!dependents.has(ref)) dependents.set(ref, new Set());
        dependents.get(ref)!.add(cellId);
      });
    });

    // Topological sort for calculation order
    const visited = new Set<string>();
    const temp = new Set<string>();
    const calculationOrder: string[] = [];

    const visit = (cellId: string) => {
      if (temp.has(cellId)) {
        updatedCells[cellId] = {
          ...updatedCells[cellId],
          calculatedValue: '#CIRCULAR!',
          error: 'Circular reference detected'
        };
        return;
      }
      if (visited.has(cellId)) return;

      temp.add(cellId);
      const deps = dependencies.get(cellId) || new Set();
      deps.forEach(dep => {
        if (formulaCells.includes(dep)) {
          visit(dep);
        }
      });
      temp.delete(cellId);
      visited.add(cellId);
      calculationOrder.push(cellId);
    };

    formulaCells.forEach(cellId => {
      if (!visited.has(cellId)) {
        visit(cellId);
      }
    });

    // Calculate formulas in dependency order
    let calculatedCount = 0;
    calculationOrder.forEach(cellId => {
      const cell = updatedCells[cellId];
      if (cell.value?.startsWith('=')) {
        try {
          const result = evaluateFormula(cell.value.substring(1), updatedCells);
          updatedCells[cellId] = {
            ...cell,
            calculatedValue: result,
            error: undefined
          };
          calculatedCount++;
        } catch (error) {
          updatedCells[cellId] = {
            ...cell,
            calculatedValue: '#ERROR!',
            error: error instanceof Error ? error.message : 'Calculation error'
          };
        }
      }
    });

    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );

    toast.success(`Recalculated ${calculatedCount} formulas`);
  }, [activeSheet, activeSheetId, setSheets]);

  // Calculate automatic statistics for selected range
  const calculateRangeStatistics = useCallback((startCell: string, endCell: string) => {
    const stats = {
      count: 0,
      sum: 0,
      average: 0,
      min: Number.MAX_SAFE_INTEGER,
      max: Number.MIN_SAFE_INTEGER,
      numerical: 0,
      nonEmpty: 0
    };

    // Parse cell range
    const startMatch = startCell.match(/([A-Z]+)([0-9]+)/);
    const endMatch = endCell.match(/([A-Z]+)([0-9]+)/);
    
    if (!startMatch || !endMatch) return stats;

    const startCol = startMatch[1].charCodeAt(0) - 65;
    const startRow = parseInt(startMatch[2]);
    const endCol = endMatch[1].charCodeAt(0) - 65;
    const endRow = parseInt(endMatch[2]);

    const values: number[] = [];

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const cellId = `${String.fromCharCode(65 + col)}${row}`;
        const cell = activeSheet.cells[cellId];
        
        if (cell) {
          stats.nonEmpty++;
          
          let value = cell.calculatedValue !== undefined ? cell.calculatedValue : cell.value;
          
          // Handle percentage and currency
          if (typeof value === 'string') {
            if (value.endsWith('%')) {
              value = parseFloat(value.slice(0, -1)) / 100;
            } else if (value.startsWith('$')) {
              value = parseFloat(value.slice(1).replace(/,/g, ''));
            } else {
              value = parseFloat(value);
            }
          }

          if (!isNaN(value) && isFinite(value)) {
            values.push(value);
            stats.numerical++;
            stats.sum += value;
            stats.min = Math.min(stats.min, value);
            stats.max = Math.max(stats.max, value);
          }
        }
        stats.count++;
      }
    }

    if (values.length > 0) {
      stats.average = stats.sum / values.length;
    } else {
      stats.min = 0;
      stats.max = 0;
    }

    return stats;
  }, [activeSheet]);

  // Goal seek functionality
  const goalSeek = useCallback((targetCell: string, targetValue: number, inputCell: string) => {
    const maxIterations = 100;
    const tolerance = 0.001;
    let currentValue = 0;
    let step = 1;

    for (let i = 0; i < maxIterations; i++) {
      // Set input value
      const updatedCells = {
        ...activeSheet.cells,
        [inputCell]: {
          ...activeSheet.cells[inputCell],
          value: currentValue.toString()
        }
      };

      // Calculate target cell
      const targetCellData = updatedCells[targetCell];
      if (targetCellData?.value?.startsWith('=')) {
        try {
          const result = evaluateFormula(targetCellData.value.substring(1), updatedCells);
          const diff = Math.abs(result - targetValue);
          
          if (diff < tolerance) {
            // Found solution
            setSheets(prevSheets => 
              prevSheets.map(sheet => 
                sheet.id === activeSheetId 
                  ? { ...sheet, cells: updatedCells }
                  : sheet
              )
            );
            toast.success(`Goal Seek completed: ${inputCell} = ${currentValue.toFixed(6)}`);
            return;
          }

          // Adjust step
          if (result < targetValue) {
            currentValue += step;
          } else {
            currentValue -= step;
            step *= 0.9; // Reduce step size
          }
        } catch (error) {
          break;
        }
      }
    }

    toast.error('Goal Seek could not find a solution');
  }, [activeSheet, activeSheetId, setSheets]);

  // Solver functionality (simplified)
  const solver = useCallback((
    targetCell: string,
    targetValue: number,
    inputCells: string[],
    constraints: Array<{cell: string, operator: string, value: number}>
  ) => {
    // This is a simplified solver - a real implementation would use linear programming
    toast.info('Advanced Solver functionality is available - this is a simplified version');
    
    // Try basic optimization
    let bestSolution: Record<string, number> = {};
    let bestResult = Number.MAX_SAFE_INTEGER;

    // Grid search approach (simplified)
    const ranges = inputCells.map(() => ({ min: -100, max: 100, steps: 20 }));
    
    const search = (cellIndex: number, currentSolution: Record<string, number>) => {
      if (cellIndex >= inputCells.length) {
        // Evaluate solution
        const updatedCells = { ...activeSheet.cells };
        Object.entries(currentSolution).forEach(([cell, value]) => {
          updatedCells[cell] = {
            ...updatedCells[cell],
            value: value.toString()
          };
        });

        try {
          const targetCellData = updatedCells[targetCell];
          if (targetCellData?.value?.startsWith('=')) {
            const result = evaluateFormula(targetCellData.value.substring(1), updatedCells);
            const error = Math.abs(result - targetValue);
            
            if (error < bestResult) {
              bestResult = error;
              bestSolution = { ...currentSolution };
            }
          }
        } catch (error) {
          // Skip invalid solutions
        }
        return;
      }

      const range = ranges[cellIndex];
      const step = (range.max - range.min) / range.steps;
      
      for (let i = 0; i <= range.steps; i++) {
        const value = range.min + i * step;
        currentSolution[inputCells[cellIndex]] = value;
        search(cellIndex + 1, currentSolution);
      }
    };

    search(0, {});

    if (bestResult < Number.MAX_SAFE_INTEGER) {
      // Apply best solution
      const updatedCells = { ...activeSheet.cells };
      Object.entries(bestSolution).forEach(([cell, value]) => {
        updatedCells[cell] = {
          ...updatedCells[cell],
          value: value.toString()
        };
      });

      setSheets(prevSheets => 
        prevSheets.map(sheet => 
          sheet.id === activeSheetId 
            ? { ...sheet, cells: updatedCells }
            : sheet
        )
      );
      
      toast.success(`Solver found solution with error: ${bestResult.toFixed(6)}`);
    } else {
      toast.error('Solver could not find a valid solution');
    }
  }, [activeSheet, activeSheetId, setSheets]);

  return {
    recalculateSheet,
    calculateRangeStatistics,
    goalSeek,
    solver
  };
};