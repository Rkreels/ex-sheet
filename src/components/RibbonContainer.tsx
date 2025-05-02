
import React from 'react';
import ExcelRibbon from './ExcelRibbon';
import { ChartData } from '../types/sheet';

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
      />
    </div>
  );
};

export default RibbonContainer;
