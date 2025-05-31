
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import RibbonSection from './RibbonSection';
import DashboardManager from '../dashboard/DashboardManager';
import FinancialModeling from '../analysis/FinancialModeling';
import DataTransformation from '../analysis/DataTransformation';
import { BarChart3, Calculator, Database, TrendingUp } from 'lucide-react';

interface AdvancedTabContentProps {
  sheets: any[];
  activeSheet: any;
  onCreateChart: (chartData: any) => void;
  onUpdateSheet: (sheetId: string, updates: any) => void;
}

const AdvancedTabContent: React.FC<AdvancedTabContentProps> = ({
  sheets,
  activeSheet,
  onCreateChart,
  onUpdateSheet
}) => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  return (
    <div className="flex p-2">
      <RibbonSection title="Business Intelligence" voiceCommand="open dashboard">
        <Dialog open={activeDialog === 'dashboard'} onOpenChange={(open) => setActiveDialog(open ? 'dashboard' : null)}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex flex-col items-center p-2 h-auto">
              <BarChart3 className="w-6 h-6 mb-1" />
              <span className="text-xs">Dashboard</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Dashboard Builder</DialogTitle>
            </DialogHeader>
            <DashboardManager
              sheets={sheets}
              activeSheet={activeSheet}
              onCreateChart={onCreateChart}
              onUpdateSheet={onUpdateSheet}
            />
          </DialogContent>
        </Dialog>
      </RibbonSection>

      <RibbonSection title="Financial Analysis" voiceCommand="open financial modeling">
        <Dialog open={activeDialog === 'financial'} onOpenChange={(open) => setActiveDialog(open ? 'financial' : null)}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex flex-col items-center p-2 h-auto">
              <Calculator className="w-6 h-6 mb-1" />
              <span className="text-xs">Financial</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Financial Modeling Suite</DialogTitle>
            </DialogHeader>
            <FinancialModeling
              activeSheet={activeSheet}
              onUpdateSheet={onUpdateSheet}
            />
          </DialogContent>
        </Dialog>
      </RibbonSection>

      <RibbonSection title="Data Tools" voiceCommand="open data transformation">
        <Dialog open={activeDialog === 'data'} onOpenChange={(open) => setActiveDialog(open ? 'data' : null)}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex flex-col items-center p-2 h-auto">
              <Database className="w-6 h-6 mb-1" />
              <span className="text-xs">Power Query</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Data Transformation & Power Query</DialogTitle>
            </DialogHeader>
            <DataTransformation
              activeSheet={activeSheet}
              onUpdateSheet={onUpdateSheet}
            />
          </DialogContent>
        </Dialog>
      </RibbonSection>

      <RibbonSection title="What-If Analysis" voiceCommand="scenario analysis">
        <Button variant="outline" className="flex flex-col items-center p-2 h-auto">
          <TrendingUp className="w-6 h-6 mb-1" />
          <span className="text-xs">Scenarios</span>
        </Button>
      </RibbonSection>
    </div>
  );
};

export default AdvancedTabContent;
