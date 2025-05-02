
import React, { useState, useEffect } from 'react';
import { ChartData } from '../types/sheet';
import Navigation from './Navigation';
import SheetTabs from './SheetTabs';
import ChartDialog from './ChartDialog';
import { useSheetState } from '../hooks/useSheetState';
import { useCellOperations } from '../hooks/useCellOperations';
import { toast } from "sonner";
import RibbonContainer from './RibbonContainer';
import SpreadsheetArea from './SpreadsheetArea';

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
    handleUndo,
    handleRedo,
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
    updateRowHeight,
    updateCellValue,
    handleColumnDragDrop,
    handleRowDragDrop
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
  const [showDataAnalysis, setShowDataAnalysis] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleCreateChart = (chartData: ChartData) => {
    setActiveChart(chartData);
    setIsChartDialogOpen(true);
  };

  const handleShowDataAnalysis = () => {
    setShowDataAnalysis(prev => !prev);
    if (!showDataAnalysis) {
      toast.info("Data Analysis Tools are coming soon!");
    }
  };

  const handleFontSizeChange = (size: string) => {
    applyFontSize(size);
    toast.success(`Font size set to ${size}`);
  };

  const handleFontFamilyChange = (font: string) => {
    applyFontFamily(font);
    toast.success(`Font family set to ${font}`);
  };

  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 300);
  };

  return (
    <div className={`w-full h-full flex flex-col ${isPrintMode ? 'print-mode' : ''}`}>
      <div className="flex-none print:hidden">
        <Navigation onLoadDemoData={handleDemoData} />
      </div>
      
      <RibbonContainer 
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
        onFontSizeChange={handleFontSizeChange}
        onFontFamilyChange={handleFontFamilyChange}
        onColorChange={applyColor}
        onBackgroundColorChange={applyBackgroundColor}
        onDelete={handleDelete}
        onSortAsc={handleSortAsc}
        onSortDesc={handleSortDesc}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPrint={handlePrint}
        onCreateChart={handleCreateChart}
      />
      
      <SpreadsheetArea 
        activeSheet={activeSheet}
        activeCell={activeCell}
        formulaValue={formulaValue}
        cellSelection={cellSelection}
        handleCellChange={handleCellChange}
        handleCellSelect={handleCellSelect}
        handleCellSelectionChange={handleCellSelectionChange}
        handleFormulaChange={handleFormulaChange}
        updateColumnWidth={updateColumnWidth}
        updateRowHeight={updateRowHeight}
        handleCopy={handleCopy}
        handleCut={handleCut}
        handlePaste={handlePaste}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleColumnDragDrop={handleColumnDragDrop}
        handleRowDragDrop={handleRowDragDrop}
      />
      
      <div className="flex-none border-t border-excel-gridBorder print:hidden">
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
