
import React from 'react';
import ClipboardSection from './ClipboardSection';
import FontSection from './FontSection';
import AlignmentSection from './AlignmentSection';
import NumberSection from './NumberSection';
import CellsSection from './CellsSection';
import EditingSection from './EditingSection';
import HistorySection from './HistorySection';
import { NumberFormat } from '../../types/sheet';

interface HomeTabContentProps {
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onFormatPainter: () => void;
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onFontSizeChange: (size: string) => void;
  onFontFamilyChange: (font: string) => void;
  onColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onCurrencyFormat: () => void;
  onPercentClick: () => void;
  onAlignLeftClick: () => void;
  onAlignCenterClick: () => void;
  onAlignRightClick: () => void;
  onWrapText: () => void;
  onMergeCenter: () => void;
  onNumberFormatChange: (format: NumberFormat) => void;
  onDelete: () => void;
  onInsert: (type: 'cell' | 'row' | 'column') => void;
  onAutoSum: () => void;
  onFill: (direction: 'down' | 'right') => void;
  onClearFormatting: () => void;
  onFind: () => void;
  onFindReplace: () => void;
  onSortAsc: () => void;
  onSortDesc: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPrint: () => void;
  activeCellFormat: {
    bold?: boolean;
    italic?: boolean;
    alignment?: string;
    underline?: boolean;
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    numberFormat?: NumberFormat;
  };
}

const HomeTabContent: React.FC<HomeTabContentProps> = (props) => {
  return (
    <>
      <ClipboardSection
        onCut={props.onCut}
        onCopy={props.onCopy}
        onPaste={props.onPaste}
        onFormatPainter={props.onFormatPainter}
      />
      
      <FontSection
        onBoldClick={props.onBoldClick}
        onItalicClick={props.onItalicClick}
        onUnderlineClick={props.onUnderlineClick}
        onFontSizeChange={props.onFontSizeChange}
        onFontFamilyChange={props.onFontFamilyChange}
        onColorChange={props.onColorChange}
        onBackgroundColorChange={props.onBackgroundColorChange}
        onCurrencyFormat={props.onCurrencyFormat}
        onPercentClick={props.onPercentClick}
        activeCellFormat={props.activeCellFormat}
      />
      
      <AlignmentSection
        onAlignLeftClick={props.onAlignLeftClick}
        onAlignCenterClick={props.onAlignCenterClick}
        onAlignRightClick={props.onAlignRightClick}
        onWrapText={props.onWrapText}
        onMergeCenter={props.onMergeCenter}
        activeCellFormat={props.activeCellFormat}
      />
      
      <NumberSection
        onNumberFormatChange={props.onNumberFormatChange}
        onPercentClick={props.onPercentClick}
        onCurrencyFormat={props.onCurrencyFormat}
        activeCellFormat={props.activeCellFormat}
      />
      
      <CellsSection
        onDelete={props.onDelete}
        onInsert={props.onInsert}
        onBackgroundColorChange={props.onBackgroundColorChange}
        activeCellFormat={props.activeCellFormat}
      />
      
      <EditingSection
        onAutoSum={props.onAutoSum}
        onFill={props.onFill}
        onClearFormatting={props.onClearFormatting}
        onFind={props.onFind}
        onFindReplace={props.onFindReplace}
        onSortAsc={props.onSortAsc}
        onSortDesc={props.onSortDesc}
      />
      
      <HistorySection
        onUndo={props.onUndo}
        onRedo={props.onRedo}
        onPrint={props.onPrint}
      />
    </>
  );
};

export default HomeTabContent;
