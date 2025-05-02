
import { useState, useEffect } from 'react';
import { Sheet } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';

export const useNumberFormatting = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>,
  updateCellValue: (cellId: string, value: string) => void
) => {
  const handlePercentFormat = () => {
    const cellData = activeSheet.cells[activeCell];
    if (!cellData) {
      // Create empty cell if it doesn't exist
      updateCellValue(activeCell, '0%');
      return;
    }
    
    let value = cellData.value;
    if (value.startsWith('=')) {
      try {
        const result = evaluateFormula(value.substring(1), activeSheet.cells);
        const numResult = parseFloat(result);
        if (!isNaN(numResult)) {
          const percent = (numResult * 100).toFixed(2) + '%';
          updateCellValue(activeCell, percent);
        }
      } catch (error) {
        console.error('Error evaluating formula for percent format:', error);
      }
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const percent = (numValue * 100).toFixed(2) + '%';
        updateCellValue(activeCell, percent);
      }
    }
  };

  const handleCurrencyFormat = () => {
    const cellData = activeSheet.cells[activeCell];
    if (!cellData) {
      // Create empty cell if it doesn't exist
      updateCellValue(activeCell, '$0.00');
      return;
    }
    
    let value = cellData.value;
    if (value && value.startsWith('=')) {
      try {
        const result = evaluateFormula(value.substring(1), activeSheet.cells);
        const numResult = parseFloat(result);
        if (!isNaN(numResult)) {
          const currency = '$' + numResult.toFixed(2);
          updateCellValue(activeCell, currency);
        }
      } catch (error) {
        console.error('Error evaluating formula for currency format:', error);
      }
    } else if (value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const currency = '$' + numValue.toFixed(2);
        updateCellValue(activeCell, currency);
      }
    }
  };

  return {
    handlePercentFormat,
    handleCurrencyFormat
  };
};
