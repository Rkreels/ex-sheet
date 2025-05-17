
import React, { useState } from 'react';
import ClipboardSection from './ribbon/ClipboardSection';
import FontSection from './ribbon/FontSection';
import AlignmentSection from './ribbon/AlignmentSection';
import NumberSection from './ribbon/NumberSection';
import CellsSection from './ribbon/CellsSection';
import EditingSection from './ribbon/EditingSection';
import HistorySection from './ribbon/HistorySection';
import { ChartData, NumberFormat, CellSelection } from '../types/sheet';
import { Toaster } from 'sonner';
import RibbonSection from './ribbon/RibbonSection';

// Import all tab content components
import HomeTabContent from './ribbon/HomeTabContent';
import InsertTabContent from './ribbon/InsertTabContent';
import PageLayoutTabContent from './ribbon/PageLayoutTabContent';
import FormulasTabContent from './ribbon/FormulasTabContent';
import DataTabContent from './ribbon/DataTabContent';
import ReviewTabContent from './ribbon/ReviewTabContent';

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
  onFindReplace?: () => void;
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
  onFindReplace = () => {},
  onInsert = () => {},
  activeCellFormat 
}) => {
  // Menu tabs
  const menuTabs = ["Home", "Insert", "Page Layout", "Formulas", "Data", "Review"];
  const [activeTab, setActiveTab] = useState("Home");
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  
  const renderTabContent = () => {
    switch(activeTab) {
      case "Home":
        return <HomeTabContent {...{
          onCut, onCopy, onPaste, onFormatPainter, 
          onBoldClick, onItalicClick, onUnderlineClick, 
          onFontSizeChange, onFontFamilyChange, 
          onColorChange, onBackgroundColorChange,
          onCurrencyFormat, onPercentClick, 
          onAlignLeftClick, onAlignCenterClick, onAlignRightClick,
          onWrapText, onMergeCenter, 
          onNumberFormatChange,
          onDelete, onInsert, 
          onAutoSum, onFill, onClearFormatting, 
          onFind, onFindReplace, onSortAsc, onSortDesc,
          onUndo, onRedo, onPrint,
          activeCellFormat
        }} />;
      
      case "Insert":
        return <InsertTabContent onCreateChart={onCreateChart} />;
      
      case "Page Layout":
        return <PageLayoutTabContent />;
      
      case "Formulas":
        return <FormulasTabContent onAutoSum={onAutoSum} />;
      
      case "Data":
        return <DataTabContent onSortAsc={onSortAsc} onSortDesc={onSortDesc} />;
      
      case "Review":
        return <ReviewTabContent />;
      
      default:
        return null;
    }
  };
  
  return (
    <div className="ribbon border-b border-gray-300">
      <div className="flex flex-col">
        {/* Top row with tabs */}
        <div className="flex bg-white border-b border-gray-300">
          <div className="flex px-4 py-2 space-x-4">
            {menuTabs.map((tab, index) => (
              <div 
                key={index} 
                className={`text-sm px-2 py-1 cursor-pointer ${activeTab === tab ? 'font-semibold border-b-2 border-blue-500' : ''}`}
                onClick={() => handleTabClick(tab)}
                data-voice-command={`goto ${tab.toLowerCase()} tab`}
              >
                {tab}
              </div>
            ))}
          </div>
        </div>
        
        {/* Main ribbon content */}
        <div className="flex flex-wrap bg-gray-100 overflow-x-auto">
          {renderTabContent()}
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default ExcelRibbon;
