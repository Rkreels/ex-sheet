
import React from 'react';
import RibbonSection from './RibbonSection';
import { ChartData } from '../../types/sheet';

interface InsertTabContentProps {
  onCreateChart: (chartData: ChartData) => void;
}

const InsertTabContent: React.FC<InsertTabContentProps> = ({ onCreateChart }) => {
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
              dataRange: { startCell: 'A1', endCell: 'B5' }
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

export default InsertTabContent;
