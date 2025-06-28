
import React, { useState, useEffect, useCallback } from 'react';
import { Sheet, CellSelection } from '../types/sheet';
import { useSheetState } from '../hooks/useSheetState';
import { useCellOperations } from '../hooks/useCellOperations';
import Navigation from './Navigation';
import RibbonContainer from './RibbonContainer';
import SpreadsheetArea from './SpreadsheetArea';
import SheetTabs from './SheetTabs';
import { useAdvancedKeyboardNavigation } from '../hooks/useAdvancedKeyboardNavigation';
import { toast } from 'sonner';

const ExcelApp: React.FC = () => {
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
    handleRenameSheet,
    handleDeleteSheet,
    handleDemoData,
    handleUndo,
    handleRedo,
    setSheets
  } = useSheetState();

  const cellOperations = useCellOperations(
    activeSheet,
    activeSheetId,
    activeCell,
    setSheets,
    cellSelection,
    clipboard,
    setClipboard
  );

  // Enhanced keyboard navigation
  useAdvancedKeyboardNavigation({
    activeCell,
    onCellSelect: handleCellSelect,
    onCopy: cellOperations.handleCopy,
    onCut: cellOperations.handleCut,
    onPaste: cellOperations.handlePaste,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDelete: cellOperations.handleDelete,
    onFind: cellOperations.handleFind,
    onSave: () => toast.success('Saved')
  });

  const updateColumnWidth = useCallback((columnId: string, width: number) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              columnWidths: {
                ...sheet.columnWidths,
                [columnId]: width
              }
            }
          : sheet
      )
    );
  }, [activeSheetId, setSheets]);

  const updateRowHeight = useCallback((rowId: number, height: number) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              rowHeights: {
                ...sheet.rowHeights,
                [rowId]: height
              }
            }
          : sheet
      )
    );
  }, [activeSheetId, setSheets]);

  const handleColumnDragDrop = useCallback((sourceIndex: number, targetIndex: number) => {
    // Implementation for column reordering
    console.log('Column drag drop:', sourceIndex, targetIndex);
  }, []);

  const handleRowDragDrop = useCallback((sourceIndex: number, targetIndex: number) => {
    // Implementation for row reordering
    console.log('Row drag drop:', sourceIndex, targetIndex);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Navigation Bar */}
      <Navigation onLoadDemoData={handleDemoData} />

      {/* Excel Ribbon */}
      <RibbonContainer
        activeSheet={activeSheet}
        activeCell={activeCell}
        cellSelection={cellSelection}
        onCellChange={handleCellChange}
        onFormatApply={cellOperations.applyFormat}
        onAlignmentApply={cellOperations.applyAlignment}
        onFontSizeApply={cellOperations.applyFontSize}
        onFontFamilyApply={cellOperations.applyFontFamily}
        onColorApply={cellOperations.applyColor}
        onBackgroundColorApply={cellOperations.applyBackgroundColor}
        onNumberFormatApply={cellOperations.applyNumberFormat}
        onSortAsc={cellOperations.handleSortAsc}
        onSortDesc={cellOperations.handleSortDesc}
        onCopy={cellOperations.handleCopy}
        onCut={cellOperations.handleCut}
        onPaste={cellOperations.handlePaste}
        onDelete={cellOperations.handleDelete}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onMergeCenter={cellOperations.handleMergeCenter}
        onAutoSum={cellOperations.handleAutoSum}
        onInsert={cellOperations.handleInsert}
        onFind={cellOperations.handleFind}
        onFindReplace={cellOperations.handleFindReplace}
        onPercentFormat={cellOperations.handlePercentFormat}
        onCurrencyFormat={cellOperations.handleCurrencyFormat}
        onFormatPainter={cellOperations.handleFormatPainter}
        onFill={cellOperations.handleFill}
        onClearFormatting={cellOperations.handleClearFormatting}
        onDemoData={handleDemoData}
      />

      {/* Main Spreadsheet Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
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
          handleCopy={cellOperations.handleCopy}
          handleCut={cellOperations.handleCut}
          handlePaste={cellOperations.handlePaste}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          handleColumnDragDrop={handleColumnDragDrop}
          handleRowDragDrop={handleRowDragDrop}
        />
      </div>

      {/* Sheet Tabs */}
      <SheetTabs
        sheets={sheets}
        activeSheetId={activeSheetId}
        onSheetSelect={handleSheetSelect}
        onAddSheet={addNewSheet}
        onRenameSheet={handleRenameSheet}
        onDeleteSheet={handleDeleteSheet}
      />
    </div>
  );
};

export default ExcelApp;
