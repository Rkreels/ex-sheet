
import React from 'react';
import ExcelRibbon from './ExcelRibbon';
import { ChartData, NumberFormat } from '../types/sheet';

interface RibbonContainerProps {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onAlignLeftClick: () => void;
  onAlignCenterClick: () => void;
  onAlignRightClick: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onFormatPainter: () => void;
  onPercentClick: () => void;
  onCurrencyFormat: () => void;
  onMergeCenter: () => void;
  activeCellFormat: Record<string, any>;
  onFontSizeChange: (size: string) => void;
  onFontFamilyChange: (font: string) => void;
  onColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onDelete: () => void;
  onSortAsc: () => void;
  onSortDesc: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPrint: () => void;
  onCreateChart: (chartData: ChartData) => void;
  onNumberFormatChange?: (format: NumberFormat) => void;
  onAutoSum?: () => void;
  onFill?: (direction: 'down' | 'right') => void;
  onClearFormatting?: () => void;
  onFind?: () => void;
  onInsert?: (type: 'cell' | 'row' | 'column') => void;
}

const RibbonContainer: React.FC<RibbonContainerProps> = (props) => {
  return (
    <div className="flex-none print:hidden">
      <ExcelRibbon 
        onBoldClick={props.onBoldClick} 
        onItalicClick={props.onItalicClick}
        onUnderlineClick={props.onUnderlineClick}
        onAlignLeftClick={props.onAlignLeftClick}
        onAlignCenterClick={props.onAlignCenterClick}
        onAlignRightClick={props.onAlignRightClick}
        onCut={props.onCut}
        onCopy={props.onCopy}
        onPaste={props.onPaste}
        onFormatPainter={props.onFormatPainter}
        onPercentClick={props.onPercentClick}
        onCurrencyFormat={props.onCurrencyFormat}
        onMergeCenter={props.onMergeCenter}
        activeCellFormat={props.activeCellFormat}
        onFontSizeChange={props.onFontSizeChange}
        onFontFamilyChange={props.onFontFamilyChange}
        onColorChange={props.onColorChange}
        onBackgroundColorChange={props.onBackgroundColorChange}
        onDelete={props.onDelete}
        onSortAsc={props.onSortAsc}
        onSortDesc={props.onSortDesc}
        onUndo={props.onUndo}
        onRedo={props.onRedo}
        onPrint={props.onPrint}
        onCreateChart={props.onCreateChart}
        onNumberFormatChange={props.onNumberFormatChange}
        onAutoSum={props.onAutoSum}
        onFill={props.onFill}
        onClearFormatting={props.onClearFormatting}
        onFind={props.onFind}
        onInsert={props.onInsert}
      />
    </div>
  );
};

export default RibbonContainer;
