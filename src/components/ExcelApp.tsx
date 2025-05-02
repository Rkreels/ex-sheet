
import React, { useState } from 'react';
import { ChartData } from '../types/sheet';
import ExcelRibbon from './ExcelRibbon';
import Navigation from './Navigation';
import FormulaBar from './FormulaBar';
import SheetTabs from './SheetTabs';
import SpreadsheetContainer from './SpreadsheetContainer';
import ChartDialog from './ChartDialog';
import { useSheetState } from '../hooks/useSheetState';
import { useCellOperations } from '../hooks/useCellOperations';

// Formula function definitions
import { formulaFunctions } from '../utils/formulaFunctions';

const ExcelApp = () => {
  const {
    sheets,
    activeSheetId,
    activeSheet,
    activeCell,
    formulaValue,
    cellSelection,
    clipboard,
    setClipboard,
    handleCellChange,
    handleCellSelect,
    handleCellSelectionChange,
    handleFormulaChange,
    addNewSheet,
    handleSheetSelect,
    handleDemoData,
    setSheets
  } = useSheetState();

  const {
    applyFormat,
    applyAlignment,
    applyFontSize,
    applyFontFamily,
    applyColor,
    applyBackgroundColor,
    handleSortAsc,
    handleSortDesc,
    handlePercentFormat,
    handleCurrencyFormat,
    handleCopy,
    handleCut,
    handlePaste,
    handleDelete,
    handleMergeCenter,
    updateColumnWidth,
    updateRowHeight
  } = useCellOperations(
    activeSheet,
    activeSheetId,
    activeCell,
    setSheets,
    cellSelection,
    clipboard,
    setClipboard
  );

  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false);
  const [activeChart, setActiveChart] = useState<ChartData | null>(null);

  const handleCreateChart = (chartData: ChartData) => {
    setActiveChart(chartData);
    setIsChartDialogOpen(true);
  };

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
          onFontSizeChange={applyFontSize}
          onFontFamilyChange={applyFontFamily}
          onColorChange={applyColor}
          onBackgroundColorChange={applyBackgroundColor}
          onDelete={handleDelete}
          onSortAsc={handleSortAsc}
          onSortDesc={handleSortDesc}
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
      <div className="flex-grow overflow-hidden">
        <SpreadsheetContainer 
          sheet={activeSheet}
          onCellChange={handleCellChange}
          onCellSelect={handleCellSelect}
          onCellSelectionChange={handleCellSelectionChange}
          onColumnWidthChange={updateColumnWidth}
          onRowHeightChange={updateRowHeight}
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
