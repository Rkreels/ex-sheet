
import React from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import voiceAssistant from '../utils/voiceAssistant';
import { generateDemoData } from '../utils/demoData';

interface NavigationProps {
  onLoadDemoData: (data: Record<string, any>) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoadDemoData }) => {
  const [isMuted, setIsMuted] = React.useState(false);

  const handleDemoData = () => {
    const demoData = generateDemoData();
    onLoadDemoData(demoData);
    voiceAssistant.speak("Demo data loaded. Try creating a chart or sorting data.");
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
        className="text-xs"
        data-voice-hover="Load demo data for practice"
      >
        Load Demo Data
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
