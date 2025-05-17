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

// Helper component for the Home tab
const HomeTabContent: React.FC<{
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
}> = ({ 
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

// Helper component for the Insert tab
const InsertTabContent: React.FC<{
  onCreateChart: (chartData: ChartData) => void;
}> = ({ onCreateChart }) => {
  return (
    <div className="flex p-2">
      <RibbonSection title="Charts" voiceCommand="insert chart">
        <div className="flex flex-col items-center">
          <button 
            className="ribbon-button p-1" 
            onClick={() => onCreateChart({
              type: 'bar',
              title: 'Sales Chart',
              data: [],
              labels: [],
              selection: { startCell: 'A1', endCell: 'B5' } // Fixed error - added required properties
            })}
            data-voice-command="insert bar chart"
          >
            <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
              <span style={{ fontSize: '20px' }}>📊</span>
            </div>
            <div className="text-xs mt-1">Bar Chart</div>
          </button>
        </div>
      </RibbonSection>
      
      <RibbonSection title="Tables" voiceCommand="insert table">
        <div className="flex flex-col items-center">
          <button className="ribbon-button p-1" onClick={() => alert('Table feature coming soon')}>
            <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
              <span style={{ fontSize: '20px' }}>🧮</span>
            </div>
            <div className="text-xs mt-1">Table</div>
          </button>
        </div>
      </RibbonSection>
      
      <RibbonSection title="Illustrations" voiceCommand="insert illustration">
        <div className="flex flex-col items-center">
          <button className="ribbon-button p-1" onClick={() => alert('Images feature coming soon')}>
            <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
              <span style={{ fontSize: '20px' }}>🖼️</span>
            </div>
            <div className="text-xs mt-1">Images</div>
          </button>
        </div>
      </RibbonSection>
    </div>
  );
};

// Helper component for the Page Layout tab
const PageLayoutTabContent: React.FC = () => {
  return (
    <div className="flex p-2">
      <RibbonSection title="Themes" voiceCommand="change theme">
        <button className="ribbon-button p-1" onClick={() => alert('Themes feature coming soon')}>
          <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
            <span style={{ fontSize: '20px' }}>🎨</span>
          </div>
          <div className="text-xs mt-1">Themes</div>
        </button>
      </RibbonSection>
      
      <RibbonSection title="Page Setup" voiceCommand="page setup">
        <button className="ribbon-button p-1" onClick={() => alert('Page Setup feature coming soon')}>
          <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
            <span style={{ fontSize: '20px' }}>📄</span>
          </div>
          <div className="text-xs mt-1">Margins</div>
        </button>
      </RibbonSection>
    </div>
  );
};

// Helper component for the Formulas tab
const FormulasTabContent: React.FC<{
  onAutoSum: () => void;
}> = ({ onAutoSum }) => {
  return (
    <div className="flex p-2">
      <RibbonSection title="Function Library" voiceCommand="insert function">
        <button 
          className="ribbon-button p-1" 
          onClick={onAutoSum}
          data-voice-command="autosum"
        >
          <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
            <span style={{ fontSize: '20px' }}>∑</span>
          </div>
          <div className="text-xs mt-1">AutoSum</div>
        </button>
        
        <button className="ribbon-button p-1" onClick={() => alert('More functions coming soon')}>
          <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
            <span style={{ fontSize: '15px' }}>f(x)</span>
          </div>
          <div className="text-xs mt-1">Functions</div>
        </button>
      </RibbonSection>
    </div>
  );
};

// Helper component for the Data tab
const DataTabContent: React.FC<{
  onSortAsc: () => void;
  onSortDesc: () => void;
}> = ({ onSortAsc, onSortDesc }) => {
  return (
    <div className="flex p-2">
      <RibbonSection title="Sort & Filter" voiceCommand="sort data">
        <button 
          className="ribbon-button p-1" 
          onClick={onSortAsc}
          data-voice-command="sort ascending"
        >
          <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
            <span style={{ fontSize: '15px' }}>A→Z</span>
          </div>
          <div className="text-xs mt-1">Sort A-Z</div>
        </button>
        
        <button 
          className="ribbon-button p-1" 
          onClick={onSortDesc}
          data-voice-command="sort descending"
        >
          <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
            <span style={{ fontSize: '15px' }}>Z→A</span>
          </div>
          <div className="text-xs mt-1">Sort Z-A</div>
        </button>
      </RibbonSection>
      
      <RibbonSection title="Data Tools" voiceCommand="data tools">
        <button 
          className="ribbon-button p-1" 
          onClick={() => alert('Data validation coming soon')}
        >
          <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
            <span style={{ fontSize: '15px' }}>✓</span>
          </div>
          <div className="text-xs mt-1">Validation</div>
        </button>
      </RibbonSection>
    </div>
  );
};

// Helper component for the Review tab
const ReviewTabContent: React.FC = () => {
  return (
    <div className="flex p-2">
      <RibbonSection title="Proofing" voiceCommand="spell check">
        <button 
          className="ribbon-button p-1" 
          onClick={() => alert('Spell check coming soon')}
        >
          <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
            <span style={{ fontSize: '15px' }}>ABC</span>
          </div>
          <div className="text-xs mt-1">Spelling</div>
        </button>
      </RibbonSection>
      
      <RibbonSection title="Comments" voiceCommand="insert comment">
        <button 
          className="ribbon-button p-1" 
          onClick={() => alert('Comments feature coming soon')}
        >
          <div className="w-10 h-10 flex items-center justify-center border border-gray-300 bg-white">
            <span style={{ fontSize: '15px' }}>💬</span>
          </div>
          <div className="text-xs mt-1">Comment</div>
        </button>
      </RibbonSection>
    </div>
  );
};

// Helper component for the Insert/Page Layout/etc tabs
const RibbonSection: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  voiceCommand?: string;
}> = ({ title, children, className, voiceCommand }) => {
  return (
    <div 
      className={`ribbon-section border-r border-gray-300 p-1 ${className || ''}`}
      data-voice-section={title.toLowerCase()}
      data-voice-command={voiceCommand || title.toLowerCase()}
    >
      <div className="text-xs text-center font-semibold mb-1">{title}</div>
      <div className="flex flex-wrap gap-1">
        {children}
      </div>
    </div>
  );
};

export default ExcelRibbon;
