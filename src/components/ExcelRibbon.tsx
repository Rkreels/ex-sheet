import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Underline,
  Scissors,
  Copy,
  ClipboardPaste,
  PercentIcon,
  WrapText,
  MergeIcon,
  DollarSign,
  Trash,
  ArrowDownAZ,
  ArrowUpAZ,
  Undo,
  Redo,
  Printer,
  FormatPaint,
  SquarePlus,
  Fill,
  Eraser,
  Search,
  Calculator
} from 'lucide-react';
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
          {/* Clipboard section */}
          <div className="ribbon-section border-r border-gray-300 p-1">
            <div className="text-xs text-center font-semibold mb-1">Clipboard</div>
            <div className="flex gap-1">
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="sm" onClick={onPaste} className="h-10 w-12" data-voice-hover="Paste">
                  <ClipboardPaste className="h-5 w-5" />
                </Button>
                <span className="text-xs">Paste</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm" onClick={onCut} className="h-6 w-12 justify-start px-2" data-voice-hover="Cut">
                  <Scissors className="h-4 w-4 mr-1" />
                  <span className="text-xs">Cut</span>
                </Button>
                
                <Button variant="ghost" size="sm" onClick={onCopy} className="h-6 w-12 justify-start px-2" data-voice-hover="Copy">
                  <Copy className="h-4 w-4 mr-1" />
                  <span className="text-xs">Copy</span>
                </Button>
                
                <Button variant="ghost" size="sm" onClick={onFormatPainter} className="h-6 w-12 justify-start px-2" data-voice-hover="Format Painter">
                  <FormatPaint className="h-4 w-4 mr-1" />
                  <span className="text-xs">Format</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Font section */}
          <div className="ribbon-section border-r border-gray-300 p-1">
            <div className="text-xs text-center font-semibold mb-1">Font</div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <select 
                  className="text-xs p-1 border border-gray-300 rounded w-24"
                  value={activeCellFormat.fontFamily || 'Calibri'}
                  onChange={(e) => onFontFamilyChange(e.target.value)}
                >
                  <option>Calibri</option>
                  <option>Arial</option>
                  <option>Times New Roman</option>
                  <option>Courier New</option>
                  <option>Georgia</option>
                  <option>Verdana</option>
                </select>
                
                <select 
                  className="text-xs p-1 border border-gray-300 rounded w-10"
                  value={activeCellFormat.fontSize || '11'}
                  onChange={(e) => onFontSizeChange(e.target.value)}
                >
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>14</option>
                  <option>16</option>
                  <option>18</option>
                  <option>20</option>
                  <option>22</option>
                  <option>24</option>
                </select>
              </div>
              
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onBoldClick} 
                  className={`h-6 w-6 ${activeCellFormat.bold ? 'bg-gray-300' : ''}`}
                  data-voice-hover="Bold"
                >
                  <Bold className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onItalicClick} 
                  className={`h-6 w-6 ${activeCellFormat.italic ? 'bg-gray-300' : ''}`}
                  data-voice-hover="Italic"
                >
                  <Italic className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onUnderlineClick} 
                  className={`h-6 w-6 ${activeCellFormat.underline ? 'bg-gray-300' : ''}`}
                  data-voice-hover="Underline"
                >
                  <Underline className="h-4 w-4" />
                </Button>
                
                <div className="h-6 border-l border-gray-300 mx-1"></div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onCurrencyFormat}
                  className="h-6 w-6"
                  data-voice-hover="Currency format"
                >
                  <DollarSign className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onPercentClick}
                  className="h-6 w-6"
                  data-voice-hover="Percent format"
                >
                  <PercentIcon className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6"
                  onClick={() => {
                    const color = prompt('Enter color (e.g. red, #FF0000):', activeCellFormat.color || '#000000');
                    if (color) onColorChange(color);
                  }}
                >
                  <div className="w-4 h-4 border border-gray-400" style={{backgroundColor: activeCellFormat.color || 'black'}} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6"
                  onClick={() => {
                    const color = prompt('Enter background color:', activeCellFormat.backgroundColor || '#FFFFFF');
                    if (color) onBackgroundColorChange(color);
                  }}
                >
                  <div className="w-4 h-4 border border-gray-400 bg-white">
                    <div className="w-2 h-2" style={{backgroundColor: activeCellFormat.backgroundColor || 'transparent'}} />
                  </div>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Alignment section */}
          <div className="ribbon-section border-r border-gray-300 p-1">
            <div className="text-xs text-center font-semibold mb-1">Alignment</div>
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onAlignLeftClick} 
                  className={`h-6 w-6 ${activeCellFormat.alignment === 'left' ? 'bg-gray-300' : ''}`}
                  data-voice-hover="Align left"
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onAlignCenterClick} 
                  className={`h-6 w-6 ${activeCellFormat.alignment === 'center' ? 'bg-gray-300' : ''}`}
                  data-voice-hover="Align center"
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onAlignRightClick} 
                  className={`h-6 w-6 ${activeCellFormat.alignment === 'right' ? 'bg-gray-300' : ''}`}
                  data-voice-hover="Align right"
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onWrapText}
                  className="h-6 w-6"
                  data-voice-hover="Wrap text"
                >
                  <WrapText className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onMergeCenter}
                  className="h-6 w-6"
                  data-voice-hover="Merge and center"
                >
                  <MergeIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Number section */}
          <div className="ribbon-section border-r border-gray-300 p-1">
            <div className="text-xs text-center font-semibold mb-1">Number</div>
            <div className="flex flex-col gap-1">
              <select 
                className="text-xs p-1 border border-gray-300 rounded w-24"
                value={activeCellFormat.numberFormat || 'general'}
                onChange={(e) => onNumberFormatChange(e.target.value as NumberFormat)}
              >
                <option value="general">General</option>
                <option value="number">Number</option>
                <option value="currency">Currency</option>
                <option value="percentage">Percentage</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
                <option value="fraction">Fraction</option>
                <option value="scientific">Scientific</option>
                <option value="text">Text</option>
              </select>
            </div>
          </div>
          
          {/* Cells section */}
          <div className="ribbon-section border-r border-gray-300 p-1">
            <div className="text-xs text-center font-semibold mb-1">Cells</div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10" 
                data-voice-hover="Insert cell"
                onClick={() => onInsert && onInsert('cell')}
              >
                <div className="flex flex-col items-center">
                  <SquarePlus className="h-4 w-4 text-green-500" />
                  <span className="text-[10px]">Insert</span>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10" 
                data-voice-hover="Delete cell"
                onClick={onDelete}
              >
                <div className="flex flex-col items-center">
                  <Trash className="h-4 w-4 text-red-500" />
                  <span className="text-[10px]">Delete</span>
                </div>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10" 
                data-voice-hover="Format cells"
                onClick={() => {
                  const color = prompt('Enter background color for cell:', activeCellFormat.backgroundColor || '#FFFFFF');
                  if (color) onBackgroundColorChange(color);
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 h-4 w-4 rounded"></div>
                  <span className="text-[10px]">Format</span>
                </div>
              </Button>
            </div>
          </div>
          
          {/* Editing section */}
          <div className="ribbon-section p-1 border-r border-gray-300">
            <div className="text-xs text-center font-semibold mb-1">Editing</div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 flex flex-col items-center" 
                data-voice-hover="AutoSum"
                onClick={onAutoSum}
              >
                <span className="font-bold">Σ</span>
                <span className="text-[10px]">AutoSum</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 flex flex-col items-center" 
                data-voice-hover="Fill"
                onClick={() => onFill && onFill('down')}
              >
                <Fill className="h-4 w-4" />
                <span className="text-[10px]">Fill</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 flex flex-col items-center" 
                data-voice-hover="Clear"
                onClick={onClearFormatting}
              >
                <Eraser className="h-4 w-4" />
                <span className="text-[10px]">Clear</span>
              </Button>
              
              <div className="h-10 flex flex-col items-center">
                <div className="flex">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 flex items-center justify-center p-0"
                    onClick={onSortAsc}
                    data-voice-hover="Sort ascending"
                  >
                    <ArrowDownAZ className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 flex items-center justify-center p-0"
                    onClick={onSortDesc}
                    data-voice-hover="Sort descending"
                  >
                    <ArrowUpAZ className="h-3 w-3" />
                  </Button>
                </div>
                <span className="text-[10px]">Sort</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 flex flex-col items-center" 
                data-voice-hover="Find and select"
                onClick={onFind}
              >
                <Search className="h-3 w-3" />
                <span className="text-[10px]">Find &</span>
                <span className="text-[10px]">Select</span>
              </Button>
            </div>
          </div>

          {/* History section */}
          <div className="ribbon-section p-1">
            <div className="text-xs text-center font-semibold mb-1">History</div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 flex flex-col items-center" 
                onClick={onUndo}
                data-voice-hover="Undo"
              >
                <Undo className="h-4 w-4" />
                <span className="text-[10px]">Undo</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 flex flex-col items-center"
                onClick={onRedo}
                data-voice-hover="Redo"
              >
                <Redo className="h-4 w-4" />
                <span className="text-[10px]">Redo</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-10 w-10 flex flex-col items-center"
                onClick={onPrint}
                data-voice-hover="Print"
              >
                <Printer className="h-4 w-4" />
                <span className="text-[10px]">Print</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelRibbon;
