
import React from 'react';
import RibbonSection from './RibbonSection';

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

export default ReviewTabContent;
