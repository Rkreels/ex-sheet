import React, { useState, useEffect } from 'react';
import ExcelToolbar from './ExcelToolbar';
import Spreadsheet from './Spreadsheet';
import SheetTabs from './SheetTabs';
import FormulaBar from './FormulaBar';
import ChartDialog from './ChartDialog';
import Navigation from './Navigation';
import voiceAssistant from '../utils/voiceAssistant';
import { Sheet, ChartData, FormulaFunctionName, FormulaFunction } from '../types/sheet';
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

  const handleCreateChart = (chartData: ChartData) => {
    setActiveChart(chartData);
    setIsChartDialogOpen(true);
    toast.success(`Created ${chartData.type} chart`);
  };

  const handleDataAnalysis = () => {
    toast.info("Data analysis feature coming soon!");
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
      <Navigation onLoadDemoData={handleDemoData} />
      <div className="flex-none bg-excel-toolbarBg border-b border-excel-gridBorder">
        <ExcelToolbar 
          onBoldClick={() => applyFormat('bold')} 
          onItalicClick={() => applyFormat('italic')}
          onUnderlineClick={() => applyFormat('underline')}
          onAlignLeftClick={() => applyAlignment('left')}
          onAlignCenterClick={() => applyAlignment('center')}
          onAlignRightClick={() => applyAlignment('right')}
          onSortAscClick={handleSortAsc}
          onSortDescClick={handleSortDesc}
          onPercentClick={handlePercentFormat}
          onCreateChart={handleCreateChart}
          onShowDataAnalysis={handleDataAnalysis}
          activeCellFormat={activeSheet?.cells[activeCell]?.format || {}}
        />
      </div>
      <div className="flex-none h-9">
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
