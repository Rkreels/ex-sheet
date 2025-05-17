
import { CellFormat, CellRange } from './sheet';

// Expanded operator types for conditional formatting
export type ConditionalFormatOperator = 
  'equal' | 
  'notEqual' | 
  'greaterThan' | 
  'lessThan' | 
  'between' | 
  'contains' | 
  'containsText' | 
  'beginsWith' | 
  'endsWith' |
  'greaterThanOrEqual' |
  'lessThanOrEqual';

// Expanded type for conditional formatting
export type ConditionalFormatType = 
  'cellValue' | 
  'colorScale' | 
  'dataBar' | 
  'iconSet' | 
  'duplicateValues' | 
  'between' |
  'containsText';

// Extended conditional format interface with value properties for UI
export interface ExtendedConditionalFormat {
  id: string;
  range: CellRange;
  type: ConditionalFormatType;
  operator?: ConditionalFormatOperator;
  values: string[];
  format: Partial<CellFormat>;
  value1?: string;
  value2?: string;
}

// Extended data validation interface with UI specific properties
export interface ExtendedDataValidation {
  id: string;
  range: CellRange;
  type: 'list' | 'date' | 'number' | 'textLength' | 'custom' | 'text';
  operator?: 'equal' | 'notEqual' | 'greaterThan' | 'lessThan' | 'between';
  values: string[];
  errorMessage?: string;
  promptMessage?: string;
  allowBlank?: boolean;
  value1?: string;
  value2?: string;
  list?: string[];
  formula?: string;
}
