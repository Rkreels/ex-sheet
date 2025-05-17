
// Sheet and cell related types

// Cell representation
export interface Cell {
  value: string;
  displayValue?: string;
  format?: CellFormat;
  formula?: string;
  error?: string;
  mergeArea?: string;
}

// Cell format specification
export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  alignment?: 'left' | 'center' | 'right';
  numberFormat?: NumberFormat;
  borders?: CellBorders;
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  textWrap?: boolean;
  rotation?: number;
}

// Border specifications for cells
export interface CellBorders {
  top?: BorderStyle;
  right?: BorderStyle;
  bottom?: BorderStyle;
  left?: BorderStyle;
  all?: BorderStyle;
}

// Border style specification
export interface BorderStyle {
  style: 'thin' | 'medium' | 'thick' | 'dashed' | 'dotted' | 'double';
  color: string;
}

// Number format options
export type NumberFormat = 
  'general' | 
  'number' | 
  'currency' | 
  'accounting' | 
  'date' | 
  'time' | 
  'percentage' | 
  'fraction' | 
  'scientific' | 
  'text' |
  'custom';

// Sheet representation
export interface Sheet {
  id: string;
  name: string;
  cells: Record<string, Cell>;
  columns: Record<string, ColumnDefinition>;
  rows: Record<string, RowDefinition>;
  mergedCells?: string[];
  conditionalFormats?: ConditionalFormat[];
  dataValidations?: DataValidation[];
  activeCell?: string;
  charts?: ChartData[];
}

// Row definition
export interface RowDefinition {
  height?: number;
  hidden?: boolean;
  frozen?: boolean;
  autoFit?: boolean;
}

// Column definition
export interface ColumnDefinition {
  width?: number;
  hidden?: boolean;
  frozen?: boolean;
  autoFit?: boolean;
}

// Cell selection
export interface CellSelection {
  startCell: string;
  endCell: string;
}

// Cell range
export interface CellRange {
  startCell: string;
  endCell: string;
}

// Chart data
export interface ChartData {
  type: string;
  title: string;
  data: any[];
  labels: string[];
  selection: CellRange;
  dataRange: string;
}

// Conditional formatting
export interface ConditionalFormat {
  id: string;
  range: CellRange;
  type: 'cellValue' | 'colorScale' | 'dataBar' | 'iconSet' | 'duplicateValues';
  operator?: 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'between' | 'contains';
  values: string[];
  format: Partial<CellFormat>;
}

// Data validation
export interface DataValidation {
  id: string;
  range: CellRange;
  type: 'list' | 'date' | 'number' | 'textLength' | 'custom';
  operator?: 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'between';
  values: string[];
  errorMessage?: string;
  promptMessage?: string;
}

// Formula functions
export interface FormulaFunction {
  name: FormulaFunctionName;
  description: string;
  syntax: string;
  example: string;
  category: 'math' | 'text' | 'logical' | 'lookup' | 'date' | 'statistical';
  minArgs: number;
  maxArgs: number;
  execute: (args: any[]) => any;
}

// Available formula function names
export type FormulaFunctionName = 
  'SUM' | 'AVERAGE' | 'COUNT' | 'MAX' | 'MIN' | 
  'IF' | 'CONCATENATE' | 'LEFT' | 'RIGHT' | 'MID' | 
  'TODAY' | 'NOW' | 'VLOOKUP' | 'HLOOKUP' | 'PMT';
