
import React, { useState, useEffect } from 'react';
import ExcelRibbon from './ExcelRibbon';
import Spreadsheet from './Spreadsheet';
import SheetTabs from './SheetTabs';
import FormulaBar from './FormulaBar';
import ChartDialog from './ChartDialog';
import Navigation from './Navigation';
import voiceAssistant from '../utils/voiceAssistant';
import { Sheet, ChartData, FormulaFunctionName, FormulaFunction, CellRange, Cell } from '../types/sheet';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { toast } from "sonner";

const formulaFunctions: Record<FormulaFunctionName, FormulaFunction> = {
  SUM: {
    name: 'SUM',
    description: 'Adds all the numbers in a range of cells',
    usage: 'SUM(number1, [number2], ...)',
    execute: () => 0
  },
  AVERAGE: {
    name: 'AVERAGE',
    description: 'Returns the average of its arguments',
    usage: 'AVERAGE(number1, [number2], ...)',
    execute: () => 0
  },
  MIN: {
    name: 'MIN',
    description: 'Returns the minimum value in a list of arguments',
    usage: 'MIN(number1, [number2], ...)',
    execute: () => 0
  },
  MAX: {
    name: 'MAX',
    description: 'Returns the maximum value in a list of arguments',
    usage: 'MAX(number1, [number2], ...)',
    execute: () => 0
  },
  COUNT: {
    name: 'COUNT',
    description: 'Counts the number of cells that contain numbers',
    usage: 'COUNT(value1, [value2], ...)',
    execute: () => 0
  },
  IF: {
    name: 'IF',
    description: 'Returns one value if a condition is true and another if it is false',
    usage: 'IF(logical_test, value_if_true, value_if_false)',
    execute: () => 0
  },
  CONCATENATE: {
    name: 'CONCATENATE',
    description: 'Joins several text strings into one text string',
    usage: 'CONCATENATE(text1, [text2], ...)',
    execute: () => ''
  },
  VLOOKUP: {
    name: 'VLOOKUP',
    description: 'Looks up a value in the first column of a table and returns a value in the same row',
    usage: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    execute: () => ''
  },
  HLOOKUP: {
    name: 'HLOOKUP',
    description: 'Looks up a value in the top row of a table and returns a value in the same column',
    usage: 'HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])',
    execute: () => ''
  },
  ROUND: {
    name: 'ROUND',
    description: 'Rounds a number to a specified number of digits',
    usage: 'ROUND(number, num_digits)',
    execute: () => 0
  },
  TODAY: {
    name: 'TODAY',
    description: 'Returns the current date',
    usage: 'TODAY()',
    execute: () => ''
  },
  NOW: {
    name: 'NOW',
    description: 'Returns the current date and time',
    usage: 'NOW()',
    execute: () => ''
  },
  DATE: {
    name: 'DATE',
    description: 'Returns a date value',
    usage: 'DATE(year, month, day)',
    execute: () => ''
  },
  AND: {
    name: 'AND',
    description: 'Returns TRUE if all its arguments are TRUE',
    usage: 'AND(logical1, [logical2], ...)',
    execute: () => true
  },
  OR: {
    name: 'OR',
    description: 'Returns TRUE if any argument is TRUE',
    usage: 'OR(logical1, [logical2], ...)',
    execute: () => true
  },
  NOT: {
    name: 'NOT',
    description: 'Reverses the logic of its argument',
    usage: 'NOT(logical)',
    execute: () => true
  },
  IFERROR: {
    name: 'IFERROR',
    description: 'Returns a value if an expression evaluates to an error; otherwise returns the result of the expression',
    usage: 'IFERROR(value, value_if_error)',
    execute: () => ''
  }
};

const ExcelApp = () => {
  const [sheets, setSheets] = useState<Sheet[]>([
    { 
      id: 'sheet1', 
      name: 'Sheet1', 
      cells: {}, 
      activeCell: 'A1',
      columnWidths: {},
      rowHeights: {},
    },
  ]);
  const [activeSheetId, setActiveSheetId] = useState('sheet1');
  const [formulaValue, setFormulaValue] = useState('');
  const [activeChart, setActiveChart] = useState<ChartData | null>(null);
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
  const [cellSelection, setCellSelection] = useState<{startCell: string, endCell: string} | null>(null);
  const [clipboard, setClipboard] = useState<{cells: Record<string, Cell>, startCell: string} | null>(null);

  const activeSheet = sheets.find(sheet => sheet.id === activeSheetId) || sheets[0];
  const activeCell = activeSheet?.activeCell || 'A1';
  const activeCellValue = activeSheet?.cells[activeCell]?.value || '';

  const handleCellChange = (cellId: string, value: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [cellId]: {
                  ...sheet.cells[cellId],
                  value,
                }
              }
            }
          : sheet
      )
    );
  };

  const handleCellSelect = (cellId: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, activeCell: cellId }
          : sheet
      )
    );
    
    const cellValue = activeSheet.cells[cellId]?.value || '';
    setFormulaValue(cellValue);
    voiceAssistant.speak(`Selected cell ${cellId}`);
  };

  const handleCellSelectionChange = (selection: {startCell: string, endCell: string} | null) => {
    setCellSelection(selection);
  };

  const handleFormulaChange = (value: string) => {
    setFormulaValue(value);
    handleCellChange(activeCell, value);
  };

  const addNewSheet = () => {
    const newSheetId = `sheet${sheets.length + 1}`;
    const newSheetName = `Sheet${sheets.length + 1}`;
    
    setSheets([
      ...sheets, 
      { id: newSheetId, name: newSheetName, cells: {}, activeCell: 'A1', columnWidths: {}, rowHeights: {} }
    ]);
    setActiveSheetId(newSheetId);
  };

  const handleSheetSelect = (sheetId: string) => {
    setActiveSheetId(sheetId);
    const sheet = sheets.find(s => s.id === sheetId) || sheets[0];
    setFormulaValue(sheet.cells[sheet.activeCell]?.value || '');
  };

  const applyFormat = (formatType: 'bold' | 'italic' | 'underline') => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell],
                  format: {
                    ...sheet.cells[activeCell]?.format,
                    [formatType]: !sheet.cells[activeCell]?.format?.[formatType]
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyAlignment = (alignment: 'left' | 'center' | 'right') => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell],
                  format: {
                    ...sheet.cells[activeCell]?.format,
                    alignment,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const handleSortAsc = () => {
    const colLetter = activeCell.match(/[A-Z]+/)?.[0] || 'A';
    if (!colLetter) return;
    
    const cellsInColumn: {id: string, value: string, row: number}[] = [];
    
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      const cellColLetter = cellId.match(/[A-Z]+/)?.[0];
      if (cellColLetter === colLetter) {
        const rowNum = parseInt(cellId.substring(colLetter.length), 10);
        cellsInColumn.push({ 
          id: cellId, 
          value: cell.value.startsWith('=') 
            ? evaluateFormula(cell.value.substring(1), activeSheet.cells)
            : cell.value,
          row: rowNum
        });
      }
    });
    
    cellsInColumn.sort((a, b) => {
      const numA = parseFloat(a.value);
      const numB = parseFloat(b.value);
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      
      return a.value.localeCompare(b.value);
    });
    
    const updatedCells = { ...activeSheet.cells };
    
    cellsInColumn.forEach((cell, index) => {
      Object.entries(activeSheet.cells).forEach(([cellId, cellData]) => {
        const rowMatch = cellId.match(/[A-Z]+(\d+)/);
        if (rowMatch && parseInt(rowMatch[1], 10) === cell.row) {
          const colLetter = cellId.match(/[A-Z]+/)?.[0] || '';
          const newCellId = `${colLetter}${cellsInColumn[index].row}`;
          updatedCells[newCellId] = { ...cellData };
        }
      });
    });
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );
    
    toast.success("Sorted column ascending");
  };

  const handleSortDesc = () => {
    const colLetter = activeCell.match(/[A-Z]+/)?.[0] || 'A';
    if (!colLetter) return;
    
    const cellsInColumn: {id: string, value: string, row: number}[] = [];
    
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      const cellColLetter = cellId.match(/[A-Z]+/)?.[0];
      if (cellColLetter === colLetter) {
        const rowNum = parseInt(cellId.substring(colLetter.length), 10);
        cellsInColumn.push({ 
          id: cellId, 
          value: cell.value.startsWith('=') 
            ? evaluateFormula(cell.value.substring(1), activeSheet.cells)
            : cell.value,
          row: rowNum
        });
      }
    });
    
    cellsInColumn.sort((a, b) => {
      const numA = parseFloat(a.value);
      const numB = parseFloat(b.value);
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return numB - numA;
      }
      
      return b.value.localeCompare(a.value);
    });
    
    const updatedCells = { ...activeSheet.cells };
    
    cellsInColumn.forEach((cell, index) => {
      Object.entries(activeSheet.cells).forEach(([cellId, cellData]) => {
        const rowMatch = cellId.match(/[A-Z]+(\d+)/);
        if (rowMatch && parseInt(rowMatch[1], 10) === cell.row) {
          const colLetter = cellId.match(/[A-Z]+/)?.[0] || '';
          const newCellId = `${colLetter}${cellsInColumn[index].row}`;
          updatedCells[newCellId] = { ...cellData };
        }
      });
    });
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );
    
    toast.success("Sorted column descending");
  };

  const handlePercentFormat = () => {
    const cellData = activeSheet.cells[activeCell];
    if (!cellData) return;
    
    let value = cellData.value;
    if (value.startsWith('=')) {
      const result = evaluateFormula(value.substring(1), activeSheet.cells);
      const numResult = parseFloat(result);
      if (!isNaN(numResult)) {
        const percent = (numResult * 100).toFixed(2) + '%';
        handleCellChange(activeCell, percent);
      }
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const percent = (numValue * 100).toFixed(2) + '%';
        handleCellChange(activeCell, percent);
      }
    }
  };

  const handleCurrencyFormat = () => {
    const cellData = activeSheet.cells[activeCell];
    if (!cellData) return;
    
    let value = cellData.value;
    if (value.startsWith('=')) {
      const result = evaluateFormula(value.substring(1), activeSheet.cells);
      const numResult = parseFloat(result);
      if (!isNaN(numResult)) {
        const currency = '$' + numResult.toFixed(2);
        handleCellChange(activeCell, currency);
      }
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const currency = '$' + numValue.toFixed(2);
        handleCellChange(activeCell, currency);
      }
    }
  };

  const handleCreateChart = (chartData: ChartData) => {
    setActiveChart(chartData);
    setIsChartDialogOpen(true);
    toast.success(`Created ${chartData.type} chart`);
  };

  const handleCopy = () => {
    if (!cellSelection && activeCell) {
      // Copy single cell
      const activeCellData = activeSheet.cells[activeCell];
      if (activeCellData) {
        const selectedCells: Record<string, Cell> = {
          [activeCell]: { ...activeCellData }
        };
        setClipboard({
          cells: selectedCells,
          startCell: activeCell
        });
        toast.success("Cell copied to clipboard");
      }
    } else if (cellSelection) {
      // Copy selection
      const [startCol, startRowStr] = cellSelection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const [endCol, endRowStr] = cellSelection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      
      if (!startCol || !startRowStr || !endCol || !endRowStr) return;
      
      const startColIdx = startCol.charCodeAt(0) - 65;
      const startRowIdx = parseInt(startRowStr, 10) - 1;
      const endColIdx = endCol.charCodeAt(0) - 65;
      const endRowIdx = parseInt(endRowStr, 10) - 1;
      
      const minColIdx = Math.min(startColIdx, endColIdx);
      const maxColIdx = Math.max(startColIdx, endColIdx);
      const minRowIdx = Math.min(startRowIdx, endRowIdx);
      const maxRowIdx = Math.max(startRowIdx, endRowIdx);
      
      const selectedCells: Record<string, Cell> = {};
      
      for (let row = minRowIdx; row <= maxRowIdx; row++) {
        for (let col = minColIdx; col <= maxColIdx; col++) {
          const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
          if (activeSheet.cells[cellId]) {
            selectedCells[cellId] = { ...activeSheet.cells[cellId] };
          }
        }
      }
      
      setClipboard({
        cells: selectedCells,
        startCell: `${String.fromCharCode(65 + minColIdx)}${minRowIdx + 1}`
      });
      
      toast.success("Cells copied to clipboard");
    }
  };

  const handleCut = () => {
    handleCopy();
    handleDelete();
  };

  const handlePaste = () => {
    if (!clipboard) {
      toast.error("Nothing to paste");
      return;
    }
    
    const [targetCol, targetRowStr] = activeCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [startCol, startRowStr] = clipboard.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    
    if (!targetCol || !targetRowStr || !startCol || !startRowStr) return;
    
    const targetColIdx = targetCol.charCodeAt(0) - 65;
    const targetRowIdx = parseInt(targetRowStr, 10) - 1;
    const startColIdx = startCol.charCodeAt(0) - 65;
    const startRowIdx = parseInt(startRowStr, 10) - 1;
    
    const colOffset = targetColIdx - startColIdx;
    const rowOffset = targetRowIdx - startRowIdx;
    
    const updatedCells = { ...activeSheet.cells };
    
    Object.entries(clipboard.cells).forEach(([cellId, cell]) => {
      const [col, rowStr] = cellId.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      
      if (!col || !rowStr) return;
      
      const colIdx = col.charCodeAt(0) - 65;
      const rowIdx = parseInt(rowStr, 10) - 1;
      
      const newColIdx = colIdx + colOffset;
      const newRowIdx = rowIdx + rowOffset;
      
      const newCellId = `${String.fromCharCode(65 + newColIdx)}${newRowIdx + 1}`;
      updatedCells[newCellId] = { ...cell };
    });
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: updatedCells }
          : sheet
      )
    );
    
    toast.success("Pasted from clipboard");
  };

  const handleDelete = () => {
    if (!cellSelection && activeCell) {
      // Delete single cell
      handleCellChange(activeCell, '');
      toast.success("Cell cleared");
    } else if (cellSelection) {
      // Delete selection
      const [startCol, startRowStr] = cellSelection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      const [endCol, endRowStr] = cellSelection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
      
      if (!startCol || !startRowStr || !endCol || !endRowStr) return;
      
      const startColIdx = startCol.charCodeAt(0) - 65;
      const startRowIdx = parseInt(startRowStr, 10) - 1;
      const endColIdx = endCol.charCodeAt(0) - 65;
      const endRowIdx = parseInt(endRowStr, 10) - 1;
      
      const minColIdx = Math.min(startColIdx, endColIdx);
      const maxColIdx = Math.max(startColIdx, endColIdx);
      const minRowIdx = Math.min(startRowIdx, endRowIdx);
      const maxRowIdx = Math.max(startRowIdx, endRowIdx);
      
      const updatedCells = { ...activeSheet.cells };
      
      for (let row = minRowIdx; row <= maxRowIdx; row++) {
        for (let col = minColIdx; col <= maxColIdx; col++) {
          const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
          if (updatedCells[cellId]) {
            updatedCells[cellId] = {
              ...updatedCells[cellId],
              value: ''
            };
          }
        }
      }
      
      setSheets(prevSheets => 
        prevSheets.map(sheet => 
          sheet.id === activeSheetId 
            ? { ...sheet, cells: updatedCells }
            : sheet
        )
      );
      
      toast.success("Cells cleared");
    }
  };

  const handleDemoData = (demoData: Record<string, any>) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, cells: demoData }
          : sheet
      )
    );
    toast.success("Demo data loaded successfully!");
  };

  const handleMergeCenter = () => {
    if (!cellSelection) {
      toast.error("Please select multiple cells to merge");
      return;
    }

    const [startCol, startRowStr] = cellSelection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    const [endCol, endRowStr] = cellSelection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
    
    if (!startCol || !startRowStr || !endCol || !endRowStr) return;
    
    // For now, just apply center alignment to the active cell
    applyAlignment('center');
    toast.success("Cells merged and centered (visual representation only)");
  };

  useEffect(() => {
    Object.entries(activeSheet.cells).forEach(([cellId, cell]) => {
      if (cell.value.startsWith('=')) {
        try {
          evaluateFormula(cell.value.substring(1), activeSheet.cells);
        } catch (error) {
          console.error(`Error evaluating formula in ${cellId}:`, error);
        }
      }
    });
  }, [activeSheet.cells, activeSheet.id]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-none">
        <Navigation onLoadDemoData={handleDemoData} />
      </div>
      <div className="flex-none">
        <ExcelRibbon 
          onBoldClick={() => applyFormat('bold')} 
          onItalicClick={() => applyFormat('italic')}
          onUnderlineClick={() => applyFormat('underline')}
          onAlignLeftClick={() => applyAlignment('left')}
          onAlignCenterClick={() => applyAlignment('center')}
          onAlignRightClick={() => applyAlignment('right')}
          onCut={handleCut}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onPercentClick={handlePercentFormat}
          onCurrencyFormat={handleCurrencyFormat}
          onMergeCenter={handleMergeCenter}
          activeCellFormat={activeSheet?.cells[activeCell]?.format || {}}
        />
      </div>
      <div className="flex-none h-6 border-b border-gray-300 flex items-center bg-white px-2">
        <div className="text-sm font-mono">{activeCell}</div>
        <div className="mx-2">≡</div>
        <FormulaBar 
          value={formulaValue} 
          onChange={handleFormulaChange} 
          cellId={activeCell}
          formulaFunctions={formulaFunctions}
        />
      </div>
      <div className="flex-grow overflow-auto">
        <Spreadsheet 
          cells={activeSheet?.cells || {}} 
          activeCell={activeCell}
          onCellChange={handleCellChange}
          onCellSelect={handleCellSelect}
          onCellSelectionChange={handleCellSelectionChange}
          columnWidths={activeSheet?.columnWidths || {}}
          rowHeights={activeSheet?.rowHeights || {}}
        />
      </div>
      <div className="flex-none border-t border-excel-gridBorder">
        <SheetTabs 
          sheets={sheets} 
          activeSheetId={activeSheetId}
          onSheetSelect={handleSheetSelect}
          onAddSheet={addNewSheet}
        />
      </div>
      
      <ChartDialog 
        isOpen={isChartDialogOpen}
        onClose={() => setIsChartDialogOpen(false)}
        chartData={activeChart}
        cells={activeSheet?.cells || {}}
      />
    </div>
  );
};

export default ExcelApp;
