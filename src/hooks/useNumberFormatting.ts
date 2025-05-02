
import { useState, useEffect } from 'react';
import { Sheet, NumberFormat } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { toast } from 'sonner';

export const useNumberFormatting = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>,
  updateCellValue: (cellId: string, value: string) => void
) => {
  const applyNumberFormat = (format: NumberFormat) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    numberFormat: format,
                  }
                }
              }
            }
          : sheet
      )
    );
    
    // Apply visual formatting based on the format type
    const cell = activeSheet.cells[activeCell];
    if (!cell) return;
    
    const value = cell.value;
    if (!value) return;
    
    // If it's a formula, evaluate it first
    let numValue: number | null = null;
    if (value.startsWith('=')) {
      try {
        const result = evaluateFormula(value.substring(1), activeSheet.cells);
        numValue = parseFloat(result);
      } catch (error) {
        console.error('Error evaluating formula:', error);
      }
    } else {
      numValue = parseFloat(value);
    }
    
    if (isNaN(numValue || 0)) return; // Only apply to numeric values
    
    // Format the value based on the selected format
    let formattedValue = value;
    
    switch (format) {
      case 'general':
        // Leave as is
        break;
      case 'number':
        formattedValue = numValue!.toLocaleString();
        break;
      case 'currency':
        formattedValue = '$' + numValue!.toFixed(2);
        break;
      case 'percentage':
        formattedValue = (numValue! * 100).toFixed(2) + '%';
        break;
      case 'date':
        // Convert number to date (Excel stores dates as days since 1/1/1900)
        try {
          const date = new Date(numValue!);
          formattedValue = date.toLocaleDateString();
        } catch (e) {
          console.error('Invalid date format', e);
        }
        break;
      case 'scientific':
        formattedValue = numValue!.toExponential(2);
        break;
      case 'fraction':
        // Simple fraction conversion
        const whole = Math.floor(Math.abs(numValue!));
        const decimal = Math.abs(numValue!) - whole;
        if (decimal === 0) {
          formattedValue = whole.toString();
        } else {
          // Find close fraction (simplified)
          const denominator = 4; // Using quarters as simple example
          const numerator = Math.round(decimal * denominator);
          formattedValue = whole > 0 ? 
            `${whole} ${numerator}/${denominator}` : 
            `${numerator}/${denominator}`;
        }
        break;
    }
    
    updateCellValue(activeCell, formattedValue);
    toast.success(`Applied ${format} format`);
  };

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
    
    // Also set the format in the cell properties
    applyNumberFormat('percentage');
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
    
    // Also set the format in the cell properties
    applyNumberFormat('currency');
  };

  return {
    applyNumberFormat,
    handlePercentFormat,
    handleCurrencyFormat
  };
};
