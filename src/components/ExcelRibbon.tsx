
import React, { useState } from 'react';
import ClipboardSection from './ribbon/ClipboardSection';
import FontSection from './ribbon/FontSection';
import AlignmentSection from './ribbon/AlignmentSection';
import NumberSection from './ribbon/NumberSection';
import CellsSection from './ribbon/CellsSection';
import EditingSection from './ribbon/EditingSection';
import HistorySection from './ribbon/HistorySection';
import { ChartData, NumberFormat, CellSelection, Sheet } from '../types/sheet';
import { Toaster } from 'sonner';
import RibbonSection from './ribbon/RibbonSection';

// Import all tab content components
import HomeTabContent from './ribbon/HomeTabContent';
import InsertTabContent from './ribbon/InsertTabContent';
import PageLayoutTabContent from './ribbon/PageLayoutTabContent';
import FormulasTabContent from './ribbon/FormulasTabContent';
import DataTabContent from './ribbon/DataTabContent';
import ReviewTabContent from './ribbon/ReviewTabContent';
import AdvancedTabContent from './ribbon/AdvancedTabContent';

interface ExcelRibbonProps {
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

const ExcelRibbon: React.FC<ExcelRibbonProps> = ({ 
  activeSheet,
  activeCell,
  cellSelection,
  onCellChange,
  onFormatApply,
  onAlignmentApply,
  onFontSizeApply,
  onFontFamilyApply,
  onColorApply,
  onBackgroundColorApply,
  onNumberFormatApply,
  onSortAsc,
  onSortDesc,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onUndo,
  onRedo,
  onMergeCenter,
  onAutoSum,
  onInsert,
  onFind,
  onFindReplace,
  onPercentFormat,
  onCurrencyFormat,
  onFormatPainter,
  onFill,
  onClearFormatting,
  onDemoData
}) => {
  // Menu tabs - added Advanced tab
  const menuTabs = ["Home", "Insert", "Page Layout", "Formulas", "Data", "Review", "Advanced"];
  const [activeTab, setActiveTab] = useState("Home");
  
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Get active cell format
  const activeCellFormat = activeSheet?.cells?.[activeCell] || {};
  
  const renderTabContent = () => {
    switch(activeTab) {
      case "Home":
        return <HomeTabContent {...{
          onCut, onCopy, onPaste, onFormatPainter: onFormatPainter, 
          onBoldClick: () => onFormatApply('bold'), 
          onItalicClick: () => onFormatApply('italic'), 
          onUnderlineClick: () => onFormatApply('underline'), 
          onFontSizeChange: onFontSizeApply, 
          onFontFamilyChange: onFontFamilyApply, 
          onColorChange: onColorApply, 
          onBackgroundColorChange: onBackgroundColorApply,
          onCurrencyFormat: onCurrencyFormat, 
          onPercentClick: onPercentFormat, 
          onAlignLeftClick: () => onAlignmentApply('left'), 
          onAlignCenterClick: () => onAlignmentApply('center'), 
          onAlignRightClick: () => onAlignmentApply('right'),
          onWrapText: () => {}, 
          onMergeCenter: onMergeCenter, 
          onNumberFormatChange: onNumberFormatApply,
          onDelete, onInsert, 
          onAutoSum, onFill, onClearFormatting, 
          onFind, onFindReplace, onSortAsc, onSortDesc,
          onUndo, onRedo, onPrint: () => {},
          activeCellFormat
        }} />;
      
      case "Insert":
        return <InsertTabContent onCreateChart={() => {}} />;
      
      case "Page Layout":
        return <PageLayoutTabContent />;
      
      case "Formulas":
        return <FormulasTabContent onAutoSum={onAutoSum} />;
      
      case "Data":
        return <DataTabContent onSortAsc={onSortAsc} onSortDesc={onSortDesc} />;
      
      case "Review":
        return <ReviewTabContent />;
      
      case "Advanced":
        return <AdvancedTabContent 
          sheets={[activeSheet]}
          activeSheet={activeSheet}
          onCreateChart={() => {}}
          onUpdateSheet={() => {}}
        />;
      
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
