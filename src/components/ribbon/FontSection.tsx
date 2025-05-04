
import React from 'react';
import { Bold, Italic, Underline } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { RibbonSection } from './RibbonSection';

interface FontSectionProps {
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onFontSizeChange: (size: string) => void;
  onFontFamilyChange: (font: string) => void;
  onColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onCurrencyFormat: () => void;
  onPercentClick: () => void;
  activeCellFormat: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
  };
}

export const FontSection: React.FC<FontSectionProps> = ({
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onFontSizeChange,
  onFontFamilyChange,
  onColorChange,
  onBackgroundColorChange,
  onCurrencyFormat,
  onPercentClick,
  activeCellFormat
}) => {
  return (
    <RibbonSection title="Font">
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
    </RibbonSection>
  );
};

export default FontSection;
