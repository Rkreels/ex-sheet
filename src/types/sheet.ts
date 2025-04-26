
export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  alignment?: 'left' | 'center' | 'right';
}

export interface Cell {
  value: string;
  format?: CellFormat;
}

export interface Sheet {
  id: string;
  name: string;
  cells: Record<string, Cell>;
  activeCell: string;
  columnWidths: Record<string, number>;
  rowHeights: Record<string, number>;
}

// Enhanced formula types
export type FormulaFunctionName = 
  'SUM' | 'AVERAGE' | 'MIN' | 'MAX' | 'COUNT' | 
  'IF' | 'CONCATENATE' | 'VLOOKUP' | 'HLOOKUP' |
  'ROUND' | 'TODAY' | 'NOW' | 'DATE' |
  'AND' | 'OR' | 'NOT' | 'IFERROR';

export interface FormulaFunction {
  name: FormulaFunctionName;
  description: string;
  usage: string;
  execute: (args: any[], cells: Record<string, Cell>) => any;
}

// Data analysis types
export interface DataRange {
  startCell: string;
  endCell: string;
}

export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  dataRange: DataRange;
  title: string;
  labels?: DataRange;
}
