
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
    voiceAssistant.announceDemoData();
  };

  const handleToggleMute = () => {
    voiceAssistant.toggleMute();
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-background border-b">
      <Button
        variant="outline"
        onClick={handleDemoData}
      >
        Load Demo Data
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleMute}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Navigation;

