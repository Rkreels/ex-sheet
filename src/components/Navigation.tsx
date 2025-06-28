
import React from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Database, TrendingUp, DollarSign } from "lucide-react";
import voiceAssistant from '../utils/voiceAssistant';
import { generateDemoData, generateFinancialModelDemo, generateMarketingAnalyticsDemo } from '../utils/demoData';

interface NavigationProps {
  onLoadDemoData: (data: Record<string, any>) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoadDemoData }) => {
  const [isMuted, setIsMuted] = React.useState(false);

  const handleDemoData = () => {
    const demoData = generateDemoData();
    onLoadDemoData(demoData);
    voiceAssistant.speak("Comprehensive multi-departmental demo data loaded with advanced formulas and calculations.");
  };

  const handleFinancialDemo = () => {
    const financialData = generateFinancialModelDemo();
    onLoadDemoData(financialData);
    voiceAssistant.speak("Financial modeling demo with DCF analysis loaded.");
  };

  const handleMarketingDemo = () => {
    const marketingData = generateMarketingAnalyticsDemo();
    onLoadDemoData(marketingData);
    voiceAssistant.speak("Marketing analytics demo with campaign performance metrics loaded.");
  };

  const handleToggleMute = () => {
    const muteState = voiceAssistant.toggleMute();
    setIsMuted(muteState);
  };

  return (
    <div className="flex items-center p-1 bg-gray-200 border-b border-gray-300">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg" 
        alt="Excel Logo" 
        className="h-6 w-6 mr-2" 
      />
      
      <div className="border-l border-gray-300 h-6 mx-2"></div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleDemoData}
        className="text-xs mr-1"
        data-voice-hover="Load comprehensive multi-departmental demo data"
      >
        <Database className="h-3 w-3 mr-1" />
        Multi-Dept Demo
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleFinancialDemo}
        className="text-xs mr-1"
        data-voice-hover="Load financial modeling demo"
      >
        <DollarSign className="h-3 w-3 mr-1" />
        Financial Model
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleMarketingDemo}
        className="text-xs mr-1"
        data-voice-hover="Load marketing analytics demo"
      >
        <TrendingUp className="h-3 w-3 mr-1" />
        Marketing Analytics
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 ml-2"
        onClick={handleToggleMute}
        data-voice-hover={isMuted ? "Unmute voice assistant" : "Mute voice assistant"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Navigation;
