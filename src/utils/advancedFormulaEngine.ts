import { Cell } from '../types/sheet';
import { formulaFunctions } from './formulaFunctions';
import comprehensiveFormulas from './comprehensiveFormulas';

export class AdvancedFormulaEngine {
  private cells: Record<string, Cell>;
  private dependencyGraph: Map<string, Set<string>> = new Map();
  private calculationOrder: string[] = [];
  private allFunctions: Record<string, any>;

  constructor(cells: Record<string, Cell>) {
    this.cells = cells;
    // Combine existing functions with comprehensive formulas
    this.allFunctions = {
      ...formulaFunctions,
      ...Object.fromEntries(
        Object.entries(comprehensiveFormulas).map(([name, func]) => [
          name,
          { execute: func, category: 'comprehensive', description: `${name} function` }
        ])
      )
    };
    this.buildDependencyGraph();
  }

  private buildDependencyGraph() {
    this.dependencyGraph.clear();
    
    Object.entries(this.cells).forEach(([cellId, cell]) => {
      if (cell?.value?.startsWith('=')) {
        const dependencies = this.extractCellReferences(cell.value);
        this.dependencyGraph.set(cellId, new Set(dependencies));
      }
    });
    
    this.calculateOrder();
  }

  private extractCellReferences(formula: string): string[] {
    const cellRefRegex = /[A-Z]+[0-9]+/g;
    const rangeRefRegex = /[A-Z]+[0-9]+:[A-Z]+[0-9]+/g;
    
    const cellRefs = formula.match(cellRefRegex) || [];
    const rangeRefs = formula.match(rangeRefRegex) || [];
    
    const allRefs = [...cellRefs];
    
    // Expand ranges
    rangeRefs.forEach(range => {
      const [start, end] = range.split(':');
      const expandedRefs = this.expandRange(start, end);
      allRefs.push(...expandedRefs);
    });
    
    return [...new Set(allRefs)];
  }

  private expandRange(start: string, end: string): string[] {
    const startMatch = start.match(/([A-Z]+)([0-9]+)/);
    const endMatch = end.match(/([A-Z]+)([0-9]+)/);
    
    if (!startMatch || !endMatch) return [];
    
    const startCol = startMatch[1];
    const startRow = parseInt(startMatch[2]);
    const endCol = endMatch[1];
    const endRow = parseInt(endMatch[2]);
    
    const refs: string[] = [];
    
    for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
      for (let row = startRow; row <= endRow; row++) {
        refs.push(`${String.fromCharCode(col)}${row}`);
      }
    }
    
    return refs;
  }

  private calculateOrder() {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (cellId: string) => {
      if (visiting.has(cellId)) {
        throw new Error(`Circular reference detected involving ${cellId}`);
      }
      if (visited.has(cellId)) return;

      visiting.add(cellId);
      const dependencies = this.dependencyGraph.get(cellId) || new Set();
      
      for (const dep of dependencies) {
        visit(dep);
      }
      
      visiting.delete(cellId);
      visited.add(cellId);
      order.push(cellId);
    };

    for (const cellId of this.dependencyGraph.keys()) {
      if (!visited.has(cellId)) {
        visit(cellId);
      }
    }

    this.calculationOrder = order;
  }

  public evaluateAll(): Record<string, Cell> {
    const updatedCells = { ...this.cells };

    for (const cellId of this.calculationOrder) {
      const cell = updatedCells[cellId];
      if (cell?.value?.startsWith('=')) {
        try {
          const result = this.evaluateFormula(cell.value.substring(1), updatedCells);
          updatedCells[cellId] = {
            ...cell,
            calculatedValue: result,
            error: undefined
          };
        } catch (error) {
          updatedCells[cellId] = {
            ...cell,
            calculatedValue: `#ERROR`,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }
    }

    return updatedCells;
  }

  private evaluateFormula(formula: string, cells: Record<string, Cell>): any {
    // Replace cell references with values
    let processedFormula = formula;
    
    // Handle ranges first
    const rangeRegex = /[A-Z]+[0-9]+:[A-Z]+[0-9]+/g;
    processedFormula = processedFormula.replace(rangeRegex, (range) => {
      const [start, end] = range.split(':');
      const values = this.expandRange(start, end).map(ref => {
        const cell = cells[ref];
        return this.getCellNumericValue(cell);
      });
      return `[${values.join(',')}]`;
    });

    // Handle individual cell references
    const cellRegex = /[A-Z]+[0-9]+/g;
    processedFormula = processedFormula.replace(cellRegex, (cellRef) => {
      const cell = cells[cellRef];
      return this.getCellNumericValue(cell).toString();
    });

    // Handle function calls with comprehensive functions
    const functionRegex = /([A-Z]+)\(([^)]*)\)/g;
    processedFormula = processedFormula.replace(functionRegex, (match, funcName, args) => {
      const func = this.allFunctions[funcName];
      if (!func) {
        throw new Error(`Unknown function: ${funcName}`);
      }

      const parsedArgs = this.parseArguments(args);
      const result = func.execute ? func.execute(parsedArgs) : func(parsedArgs);
      return result.toString();
    });

    // Evaluate mathematical expression
    try {
      return new Function(`return ${processedFormula}`)();
    } catch (error) {
      throw new Error(`Formula evaluation error: ${error}`);
    }
  }

  private getCellNumericValue(cell: Cell | undefined): number {
    if (!cell) return 0;
    
    const value = cell.calculatedValue !== undefined ? cell.calculatedValue : cell.value;
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }

  private parseArguments(argsString: string): any[] {
    if (!argsString.trim()) return [];
    
    const args: any[] = [];
    let current = '';
    let depth = 0;
    let inQuotes = false;

    for (let i = 0; i < argsString.length; i++) {
      const char = argsString[i];

      if (char === '"' && argsString[i - 1] !== '\\') {
        inQuotes = !inQuotes;
        current += char;
      } else if (!inQuotes) {
        if (char === '[') depth++;
        else if (char === ']') depth--;
        else if (char === ',' && depth === 0) {
          args.push(this.parseArgument(current.trim()));
          current = '';
          continue;
        }
        current += char;
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      args.push(this.parseArgument(current.trim()));
    }

    return args;
  }

  private parseArgument(arg: string): any {
    // Handle arrays
    if (arg.startsWith('[') && arg.endsWith(']')) {
      const content = arg.slice(1, -1);
      return content.split(',').map(item => {
        const trimmed = item.trim();
        const num = parseFloat(trimmed);
        return isNaN(num) ? trimmed : num;
      });
    }

    // Handle strings
    if (arg.startsWith('"') && arg.endsWith('"')) {
      return arg.slice(1, -1);
    }

    // Handle numbers
    const num = parseFloat(arg);
    if (!isNaN(num)) return num;

    // Handle booleans
    if (arg.toLowerCase() === 'true') return true;
    if (arg.toLowerCase() === 'false') return false;

    return arg;
  }
}

export const createAdvancedFormulaEngine = (cells: Record<string, Cell>) => {
  return new AdvancedFormulaEngine(cells);
};
