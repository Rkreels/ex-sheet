
// If this file already exists, I'll just add what's missing

export interface Cell {
  value: string;
  format?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    alignment?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
    fontSize?: string;
    fontFamily?: string;
  };
  columnWidth?: number;
  rowHeight?: number;
}

export interface Sheet {
  id: string;
  name: string;
  cells: Record<string, Cell>;
  activeCell: string;
  columnWidths: Record<string, number>;
  rowHeights: Record<string, number>;
  history?: {
    past: Array<{cells: Record<string, Cell>}>;
    future: Array<{cells: Record<string, Cell>}>;
  };
}

export interface CellRange {
  startCell: string;
  endCell: string;
}

export interface ChartData {
  id?: string; 
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  title: string;
  dataRange: CellRange;
  labels?: CellRange;
}

export interface CellSelection {
  startCell: string;
  endCell: string;
}

export type FormulaFunctionName = 
  'SUM' | 'AVERAGE' | 'MIN' | 'MAX' | 'COUNT' | 'IF' | 
  'CONCATENATE' | 'VLOOKUP' | 'HLOOKUP' | 'ROUND' | 'TODAY' | 
  'NOW' | 'DATE' | 'AND' | 'OR' | 'NOT' | 'IFERROR';

export interface FormulaFunction {
  name: FormulaFunctionName;
  description: string;
  usage: string;
  execute: (...args: any[]) => any;
}

export interface UndoRedoState {
  past: Array<{cells: Record<string, Cell>}>;
  future: Array<{cells: Record<string, Cell>}>;
}
