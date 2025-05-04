
import React from 'react';
import ClipboardSection from './ribbon/ClipboardSection';
import FontSection from './ribbon/FontSection';
import AlignmentSection from './ribbon/AlignmentSection';
import NumberSection from './ribbon/NumberSection';
import CellsSection from './ribbon/CellsSection';
import EditingSection from './ribbon/EditingSection';
import HistorySection from './ribbon/HistorySection';
import { ChartData, NumberFormat } from '../types/sheet';

interface ExcelRibbonProps {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onAlignLeftClick: () => void;
  onAlignCenterClick: () => void;
  onAlignRightClick: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onFormatPainter?: () => void;
  onPercentClick: () => void;
  onMergeCenter?: () => void;
  onWrapText?: () => void;
  onCurrencyFormat?: () => void;
  onFontSizeChange?: (size: string) => void;
  onFontFamilyChange?: (font: string) => void;
  onColorChange?: (color: string) => void;
  onBackgroundColorChange?: (color: string) => void;
  onDelete?: () => void;
  onSortAsc?: () => void;
  onSortDesc?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onPrint?: () => void;
  onCreateChart?: (chartData: ChartData) => void;
  onNumberFormatChange?: (format: NumberFormat) => void;
  onAutoSum?: () => void;
  onFill?: (direction: 'down' | 'right') => void;
  onClearFormatting?: () => void;
  onFind?: () => void;
  onInsert?: (type: 'cell' | 'row' | 'column') => void;
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

const ExcelRibbon: React.FC<ExcelRibbonProps> = ({ 
  onBoldClick, 
  onItalicClick, 
  onUnderlineClick,
  onAlignLeftClick, 
  onAlignCenterClick, 
  onAlignRightClick,
  onCut,
  onCopy,
  onPaste,
  onPercentClick,
  onFormatPainter = () => {},
  onMergeCenter = () => {},
  onWrapText = () => {},
  onCurrencyFormat = () => {},
  onFontSizeChange = () => {},
  onFontFamilyChange = () => {},
  onColorChange = () => {},
  onBackgroundColorChange = () => {},
  onDelete = () => {},
  onSortAsc = () => {},
  onSortDesc = () => {},
  onUndo = () => {},
  onRedo = () => {},
  onPrint = () => {},
  onCreateChart = () => {},
  onNumberFormatChange = () => {},
  onAutoSum = () => {},
  onFill = () => {},
  onClearFormatting = () => {},
  onFind = () => {},
  onInsert = () => {},
  activeCellFormat 
}) => {
  // Menu tabs
  const menuTabs = ["Home", "Insert", "Page Layout", "Formulas", "Data", "Review"];
  
  return (
    <div className="ribbon border-b border-gray-300">
      <div className="flex flex-col">
        {/* Top row with tabs */}
        <div className="flex bg-white border-b border-gray-300">
          <div className="flex px-4 py-2 space-x-4">
            {menuTabs.map((tab, index) => (
              <div 
                key={index} 
                className={`text-sm px-2 py-1 cursor-pointer ${index === 0 ? 'font-semibold border-b-2 border-blue-500' : ''}`}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main ribbon content */}
        <div className="flex flex-wrap bg-gray-100 overflow-x-auto">
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
            onSortAsc={onSortAsc}
            onSortDesc={onSortDesc}
          />
          
          <HistorySection
            onUndo={onUndo}
            onRedo={onRedo}
            onPrint={onPrint}
          />
        </div>
      </div>
    </div>
  );
};

export default ExcelRibbon;
