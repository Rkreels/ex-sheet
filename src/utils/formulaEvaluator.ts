// Main formula evaluator - now using the enhanced version with 600+ Excel functions
export { 
  evaluateFormula, 
  evaluateEnhancedFormula,
  getEnhancedCellValue as getCellValue,
  evaluateMultiCellFormula,
  batchEvaluateFormulas 
} from './enhancedFormulaEvaluator';

// Re-export cell reference utilities for backward compatibility
export { 
  getCellRangeData,
  expandRange,
  parseCellRef,
  colLetterToIndex,
  colIndexToLetter 
} from './cellReference';