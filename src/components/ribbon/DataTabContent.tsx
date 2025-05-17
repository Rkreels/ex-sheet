
import React from 'react';
import RibbonSection from './RibbonSection';

interface DataTabContentProps {
  onSortAsc: () => void;
  onSortDesc: () => void;
}

const DataTabContent: React.FC<DataTabContentProps> = ({ onSortAsc, onSortDesc }) => {
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

export default DataTabContent;
