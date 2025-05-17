
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

const HomeTabContent: React.FC<HomeTabContentProps> = ({ 
  onCut, 
  onCopy, 
  onPaste, 
  onFormatPainter, 
  onBoldClick, 
  onItalicClick, 
  onUnderlineClick, 
  onFontSizeChange, 
  onFontFamilyChange, 
  onColorChange, 
  onBackgroundColorChange, 
  onCurrencyFormat, 
  onPercentClick, 
  onAlignLeftClick, 
  onAlignCenterClick, 
  onAlignRightClick, 
  onWrapText, 
  onMergeCenter, 
  onNumberFormatChange, 
  onDelete, 
  onInsert, 
  onAutoSum, 
  onFill, 
  onClearFormatting, 
  onFind, 
  onFindReplace, 
  onSortAsc, 
  onSortDesc, 
  onUndo, 
  onRedo, 
  onPrint, 
  activeCellFormat 
}) => {
  return (
    <>
      <ClipboardSection
        onCut={onCut}
        onCopy={onCopy}
        onPaste={onPaste}
        onFormatPainter={onFormatPainter}
      />
      
      <FontSection
        onBoldClick={onBoldClick}
        onItalicClick={onItalicClick}
        onUnderlineClick={onUnderlineClick}
        onFontSizeChange={onFontSizeChange}
        onFontFamilyChange={onFontFamilyChange}
        onColorChange={onColorChange}
        onBackgroundColorChange={onBackgroundColorChange}
        onCurrencyFormat={onCurrencyFormat}
        onPercentClick={onPercentClick}
        activeCellFormat={activeCellFormat}
      />
      
      <AlignmentSection
        onAlignLeftClick={onAlignLeftClick}
        onAlignCenterClick={onAlignCenterClick}
        onAlignRightClick={onAlignRightClick}
        onWrapText={onWrapText}
        onMergeCenter={onMergeCenter}
        activeCellFormat={activeCellFormat}
      />
      
      <NumberSection
        onNumberFormatChange={onNumberFormatChange}
        onPercentClick={onPercentClick}
        onCurrencyFormat={onCurrencyFormat}
        activeCellFormat={activeCellFormat}
      />
      
      <CellsSection
        onDelete={onDelete}
        onInsert={onInsert}
        onBackgroundColorChange={onBackgroundColorChange}
        activeCellFormat={activeCellFormat}
      />
      
      <EditingSection
        onAutoSum={onAutoSum}
        onFill={onFill}
        onClearFormatting={onClearFormatting}
        onFind={onFind}
        onFindReplace={onFindReplace}
        onSortAsc={onSortAsc}
        onSortDesc={onSortDesc}
      />
      
      <HistorySection
        onUndo={onUndo}
        onRedo={onRedo}
        onPrint={onPrint}
      />
    </>
  );
};

export default HomeTabContent;
