
import React from 'react';
import ExcelRibbon from './ExcelRibbon';
import { ChartData, NumberFormat, CellSelection, Sheet } from '../types/sheet';

interface RibbonContainerProps {
  activeSheet: Sheet;
  activeCell: string;
  cellSelection: CellSelection | null;
  onCellChange: (cellId: string, value: string) => void;
  onFormatApply: (formatType: 'bold' | 'italic' | 'underline') => void;
  onAlignmentApply: (alignment: 'left' | 'center' | 'right') => void;
  onFontSizeApply: (size: string) => void;
  onFontFamilyApply: (family: string) => void;
  onColorApply: (color: string) => void;
  onBackgroundColorApply: (color: string) => void;
  onNumberFormatApply: (format: NumberFormat) => void;
  onSortAsc: () => void;
  onSortDesc: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onMergeCenter: () => void;
  onAutoSum: () => void;
  onInsert: (type: 'cell' | 'row' | 'column') => void;
  onFind: () => void;
  onFindReplace: () => void;
  onPercentFormat: () => void;
  onCurrencyFormat: () => void;
  onFormatPainter: () => void;
  onFill: (direction: 'down' | 'right') => void;
  onClearFormatting: () => void;
  onDemoData: (demoData: Record<string, any>) => void;
}

const RibbonContainer: React.FC<RibbonContainerProps> = (props) => {
  return (
    <div className="flex-none print:hidden">
      <ExcelRibbon 
        activeSheet={props.activeSheet}
        activeCell={props.activeCell}
        cellSelection={props.cellSelection}
        onCellChange={props.onCellChange}
        onFormatApply={props.onFormatApply}
        onAlignmentApply={props.onAlignmentApply}
        onFontSizeApply={props.onFontSizeApply}
        onFontFamilyApply={props.onFontFamilyApply}
        onColorApply={props.onColorApply}
        onBackgroundColorApply={props.onBackgroundColorApply}
        onNumberFormatApply={props.onNumberFormatApply}
        onSortAsc={props.onSortAsc}
        onSortDesc={props.onSortDesc}
        onCopy={props.onCopy}
        onCut={props.onCut}
        onPaste={props.onPaste}
        onDelete={props.onDelete}
        onUndo={props.onUndo}
        onRedo={props.onRedo}
        onMergeCenter={props.onMergeCenter}
        onAutoSum={props.onAutoSum}
        onInsert={props.onInsert}
        onFind={props.onFind}
        onFindReplace={props.onFindReplace}
        onPercentFormat={props.onPercentFormat}
        onCurrencyFormat={props.onCurrencyFormat}
        onFormatPainter={props.onFormatPainter}
        onFill={props.onFill}
        onClearFormatting={props.onClearFormatting}
        onDemoData={props.onDemoData}
      />
    </div>
  );
};

export default RibbonContainer;
