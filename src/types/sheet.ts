
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
    numberFormat?: 'general' | 'number' | 'currency' | 'percentage' | 'date' | 'time' | 'fraction' | 'scientific' | 'text';
    borders?: {
      top?: {
        style: 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted';
        color: string;
      };
      right?: {
        style: 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted';
        color: string;
      };
      bottom?: {
        style: 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted';
        color: string;
      };
      left?: {
        style: 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed' | 'dotted';
        color: string;
      };
    };
    conditionalFormat?: ConditionalFormat[];
  };
  columnWidth?: number;
  rowHeight?: number;
  comment?: string;
  validation?: DataValidation;
  mergeAcross?: number;
  mergeDown?: number;
  isLocked?: boolean;
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
  isProtected?: boolean;
  protectionPassword?: string;
  visibleRange?: CellRange;
  printSettings?: PrintSettings;
  displayGridlines?: boolean;
  displayHeadings?: boolean;
  zoomLevel?: number;
  freezePanes?: {
    rows: number;
    cols: number;
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
  options?: {
    showLegend?: boolean;
    showAxisLabels?: boolean;
    showGridlines?: boolean;
    colors?: string[];
  };
}

export interface CellSelection {
  startCell: string;
  endCell: string;
}

export type FormulaFunctionName = 
  'SUM' | 'AVERAGE' | 'MIN' | 'MAX' | 'COUNT' | 'IF' | 
  'CONCATENATE' | 'VLOOKUP' | 'HLOOKUP' | 'ROUND' | 'TODAY' | 
  'NOW' | 'DATE' | 'AND' | 'OR' | 'NOT' | 'IFERROR' |
  'COUNTIF' | 'SUMIF' | 'AVERAGEIF' | 'TRIM' | 'LEFT' | 'RIGHT' |
  'MID' | 'FIND' | 'SUBSTITUTE' | 'PROPER' | 'UPPER' | 'LOWER' |
  'INT' | 'ABS' | 'SQRT' | 'POWER' | 'RAND' | 'PI' | 'SIN' |
  'COS' | 'TAN' | 'ASIN' | 'ACOS' | 'ATAN' | 'MONTH' | 'YEAR' | 'DAY';

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

export interface ColDragEvent {
  sourceIndex: number;
  targetIndex: number;
}

export interface RowDragEvent {
  sourceIndex: number;
  targetIndex: number;
}

export type NumberFormat = 'general' | 'number' | 'currency' | 'percentage' | 'date' | 'time' | 'fraction' | 'scientific' | 'text';

export interface ConditionalFormat {
  type: 'greaterThan' | 'lessThan' | 'equalTo' | 'between' | 'containsText' | 'dateOccurring' | 'duplicate' | 'unique' | 'top10' | 'bottom10' | 'aboveAverage' | 'belowAverage';
  value1?: string | number;
  value2?: string | number;
  format: {
    backgroundColor?: string;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export interface DataValidation {
  type: 'list' | 'number' | 'date' | 'text' | 'custom';
  operator?: 'between' | 'notBetween' | 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual';
  value1?: string | number;
  value2?: string | number;
  list?: string[];
  formula?: string;
  allowBlank?: boolean;
  errorMessage?: string;
  showDropdown?: boolean;
}

export interface PrintSettings {
  orientation: 'portrait' | 'landscape';
  paperSize: 'letter' | 'legal' | 'a4' | 'a3';
  fitToPage: boolean;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  header: string;
  footer: string;
  printArea?: CellRange;
  printTitles?: {
    rows?: CellRange;
    cols?: CellRange;
  };
}
