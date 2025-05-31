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
  columnWidths?: Record<string, number>;
  rowHeights?: Record<number, number>;
  history?: {
    past: any[];
    future: any[];
  };
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
  id?: string;
  type: string;
  title: string;
  data?: any[];
  labels?: string[];
  selection?: CellRange;
  dataRange: CellRange;
}

// Conditional formatting
export interface ConditionalFormat {
  id: string;
  range: CellRange;
  type: 'cellValue' | 'colorScale' | 'dataBar' | 'iconSet' | 'duplicateValues' | 'between' | 'containsText' | 'greaterThan' | 'lessThan' | 'equalTo' | 'top10' | 'aboveAverage' | 'belowAverage';
  operator?: 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'between' | 'contains';
  values: string[];
  format: Partial<CellFormat>;
  value1?: string | number;
  value2?: string | number;
}

// Data validation
export interface DataValidation {
  id: string;
  range: CellRange;
  type: 'list' | 'date' | 'number' | 'textLength' | 'custom' | 'text';
  operator?: 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'between';
  values: string[];
  errorMessage?: string;
  promptMessage?: string;
  allowBlank?: boolean;
  value1?: string | number;
  value2?: string | number;
  list?: string[];
  formula?: string;
  showDropdown?: boolean;
}

// Formula functions
export interface FormulaFunction {
  name: FormulaFunctionName;
  description: string;
  syntax: string;
  example: string;
  category: FormulaCategory;
  minArgs: number;
  maxArgs: number;
  execute: (args: any[]) => any;
  usage?: string;
}

// Available formula function names
export type FormulaFunctionName = 
  | 'SUM' | 'AVERAGE' | 'COUNT' | 'MAX' | 'MIN'
  | 'IF' | 'VLOOKUP' | 'HLOOKUP' | 'XLOOKUP'
  | 'INDEX' | 'MATCH' | 'FILTER' | 'UNIQUE' | 'SORT' | 'SEQUENCE'
  | 'CONCATENATE' | 'LEFT' | 'RIGHT' | 'MID' | 'LEN' | 'UPPER' | 'LOWER' | 'TEXTJOIN' | 'REGEX'
  | 'NOW' | 'TODAY' | 'DATE' | 'YEAR' | 'MONTH' | 'DAY'
  | 'AND' | 'OR' | 'NOT' | 'IFERROR'
  | 'STDEV' | 'VAR' | 'CORREL'
  | 'NPV' | 'IRR' | 'PMT';

export type FormulaCategory = 'text' | 'math' | 'logical' | 'lookup' | 'date' | 'statistical' | 'financial';

export interface Comment {
  text: string;
  author: string;
  timestamp: string;
}

export interface SheetProtection {
  enabled: boolean;
  password: string;
  allowFormatCells: boolean;
  allowInsertRows: boolean;
  allowDeleteRows: boolean;
}

export interface Cell {
  value: string;
  format?: CellFormat;
  formula?: string;
  calculatedValue?: any;
  error?: string;
  validation?: any;
  conditionalFormat?: any;
  comment?: Comment;
}

export interface Sheet {
  id: string;
  name: string;
  cells: Record<string, Cell>;
  columns: Record<string, ColumnDefinition>;
  rows: Record<string, RowDefinition>;
  activeCell: string;
  columnWidths: Record<string, number>;
  rowHeights: Record<number, number>;
  history?: {
    past: any[];
    future: any[];
  };
  protection?: SheetProtection;
  freezePanes?: {
    row: number;
    col: number;
  };
}
