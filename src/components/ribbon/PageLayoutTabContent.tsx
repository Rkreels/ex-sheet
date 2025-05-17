
import React from 'react';
import RibbonSection from './RibbonSection';

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

export default PageLayoutTabContent;
