
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
  DollarSign
} from 'lucide-react';

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
  onPercentClick: () => void;
  onFormatPainter?: () => void;
  onMergeCenter?: () => void;
  onWrapText?: () => void;
  onCurrencyFormat?: () => void;
  activeCellFormat: {
    bold?: boolean;
    italic?: boolean;
    alignment?: string;
    underline?: boolean;
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
  activeCellFormat 
}) => {
  return (
    <div className="ribbon border-b border-gray-300">
      <div className="flex flex-col">
        {/* Top row with tabs */}
        
        {/* Main ribbon content */}
        <div className="flex flex-wrap bg-gray-100">
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
                <select className="text-xs p-1 border border-gray-300 rounded w-24">
                  <option>Calibri</option>
                  <option>Arial</option>
                  <option>Times New Roman</option>
                </select>
                
                <select className="text-xs p-1 border border-gray-300 rounded w-10">
                  <option>11</option>
                  <option>12</option>
                  <option>14</option>
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
              <select className="text-xs p-1 border border-gray-300 rounded w-24">
                <option>General</option>
                <option>Number</option>
                <option>Currency</option>
                <option>Date</option>
                <option>Percentage</option>
              </select>
            </div>
          </div>
          
          {/* Cells section */}
          <div className="ribbon-section border-r border-gray-300 p-1">
            <div className="text-xs text-center font-semibold mb-1">Cells</div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-10 w-10" data-voice-hover="Insert cell">
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 h-4 w-4"></div>
                  <span className="text-[10px]">Insert</span>
                </div>
              </Button>
              
              <Button variant="ghost" size="sm" className="h-10 w-10" data-voice-hover="Delete cell">
                <div className="flex flex-col items-center">
                  <div className="bg-red-500 h-4 w-4"></div>
                  <span className="text-[10px]">Delete</span>
                </div>
              </Button>
              
              <Button variant="ghost" size="sm" className="h-10 w-10" data-voice-hover="Format cells">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 h-4 w-4"></div>
                  <span className="text-[10px]">Format</span>
                </div>
              </Button>
            </div>
          </div>
          
          {/* Editing section */}
          <div className="ribbon-section p-1">
            <div className="text-xs text-center font-semibold mb-1">Editing</div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-10 w-10 flex flex-col items-center" data-voice-hover="AutoSum">
                <span className="font-bold">Σ</span>
                <span className="text-[10px]">AutoSum</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="h-10 w-10 flex flex-col items-center" data-voice-hover="Fill">
                <span className="text-[10px]">Fill</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="h-10 w-10 flex flex-col items-center" data-voice-hover="Clear">
                <span className="text-[10px]">Clear</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="h-10 w-10 flex flex-col items-center" data-voice-hover="Sort and filter">
                <span className="text-[10px]">Sort &</span>
                <span className="text-[10px]">Filter</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="h-10 w-10 flex flex-col items-center" data-voice-hover="Find and select">
                <span className="text-[10px]">Find &</span>
                <span className="text-[10px]">Select</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelRibbon;
