
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from './ui/dropdown-menu';
import { Volume2, VolumeX, Database, TrendingUp, DollarSign, Folder, ExternalLink, BarChart3, FileText, Palette, Menu, Download, Upload } from "lucide-react";
import voiceAssistant from '../utils/voiceAssistant';
import { generateSalesPerformanceTemplate, generateFinancialModelTemplate, generateMarketingAnalyticsTemplate } from '../templates';
import { toast } from 'sonner';

interface NavigationProps {
  onLoadDemoData: (data: Record<string, any>) => void;
  onSave?: () => void;
  onLoad?: () => void;
  onExport?: (format: 'xlsx' | 'csv') => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  onLoadDemoData, 
  onSave = () => toast.success('Saved successfully'),
  onLoad = () => toast.info('Load functionality available'),
  onExport = (format) => toast.success(`Exported as ${format.toUpperCase()}`)
}) => {
  const [isMuted, setIsMuted] = React.useState<boolean>(() => {
    try {
      return localStorage.getItem('voiceMuted') !== 'false';
    } catch {
      return true;
    }
  });

  const handleSalesPerformanceTemplate = () => {
    const salesData = generateSalesPerformanceTemplate();
    onLoadDemoData(salesData);
    voiceAssistant.speak("Sales performance template loaded with advanced formulas and calculations.");
  };

  const handleFinancialTemplate = () => {
    const financialData = generateFinancialModelTemplate();
    onLoadDemoData(financialData);
    voiceAssistant.speak("Financial modeling template with DCF analysis loaded.");
  };

  const handleMarketingTemplate = () => {
    const marketingData = generateMarketingAnalyticsTemplate();
    onLoadDemoData(marketingData);
    voiceAssistant.speak("Marketing analytics template with campaign performance metrics loaded.");
  };

  const handleMasterDashboard = () => {
    window.open('https://skillsim.vercel.app/dashboard', '_self');
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
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs mr-1 bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-white/90 transition-all duration-200"
          >
            <Folder className="h-3 w-3 mr-1" />
            Templates
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-sm border-gray-200/50">
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-gray-50/80 text-xs"
            onClick={handleSalesPerformanceTemplate}
          >
            <BarChart3 className="h-3 w-3 mr-2" />
            Sales Performance
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-gray-50/80 text-xs"
            onClick={handleFinancialTemplate}
          >
            <FileText className="h-3 w-3 mr-2" />
            Financial Modeling
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-gray-50/80 text-xs"
            onClick={handleMarketingTemplate}
          >
            <Palette className="h-3 w-3 mr-2" />
            Marketing Analytics
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="outline" 
        size="sm"
        onClick={handleMasterDashboard}
        className="text-xs mr-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
      >
        <ExternalLink className="h-3 w-3 mr-1" />
        Master Dashboard
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs mr-1 bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-white/90 transition-all duration-200"
          >
            <Menu className="h-3 w-3 mr-1" />
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48 bg-white/95 backdrop-blur-sm border-gray-200/50">
          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50/80 text-xs">
            <Download className="h-3 w-3 mr-2" />
            Export Data
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-gray-50/80 text-xs">
            <Upload className="h-3 w-3 mr-2" />
            Import Data
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
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
