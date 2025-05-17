
import React from 'react';
import RibbonSection from './RibbonSection';

interface FormulasTabContentProps {
  onAutoSum: () => void;
}

const FormulasTabContent: React.FC<FormulasTabContentProps> = ({ onAutoSum }) => {
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

export default FormulasTabContent;
