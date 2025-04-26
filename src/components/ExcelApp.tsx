
import React, { useState } from 'react';
import ExcelToolbar from './ExcelToolbar';
import Spreadsheet from './Spreadsheet';
import SheetTabs from './SheetTabs';
import FormulaBar from './FormulaBar';
import { Sheet } from '../types/sheet';

const ExcelApp = () => {
  // Initialize with one empty sheet
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

  const applyFormat = (formatType: string) => {
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

  const applyAlignment = (alignment: string) => {
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

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-none bg-excel-toolbarBg border-b border-excel-gridBorder">
        <ExcelToolbar 
          onBoldClick={() => applyFormat('bold')} 
          onItalicClick={() => applyFormat('italic')}
          onAlignLeftClick={() => applyAlignment('left')}
          onAlignCenterClick={() => applyAlignment('center')}
          onAlignRightClick={() => applyAlignment('right')}
          activeCellFormat={activeSheet?.cells[activeCell]?.format || {}}
        />
      </div>
      <div className="flex-none h-9">
        <FormulaBar 
          value={formulaValue} 
          onChange={handleFormulaChange} 
          cellId={activeCell}
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
    </div>
  );
};

export default ExcelApp;
