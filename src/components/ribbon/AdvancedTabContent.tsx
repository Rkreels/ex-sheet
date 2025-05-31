
import React, { useState } from 'react';
import RibbonSection from './RibbonSection';
import { Button } from '../ui/button';
import DashboardManager from '../dashboard/DashboardManager';
import AdvancedFeatures from '../features/AdvancedFeatures';
import { BarChart3, Database, Settings, TrendingUp, Filter, FileSpreadsheet, Shield, Eye, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface AdvancedTabContentProps {
  sheets?: any[];
  activeSheet?: any;
  onCreateChart?: (chartData: any) => void;
  onUpdateSheet?: (sheetId: string, updates: any) => void;
}

const AdvancedTabContent: React.FC<AdvancedTabContentProps> = ({
  sheets = [],
  activeSheet = null,
  onCreateChart = () => {},
  onUpdateSheet = () => {}
}) => {
  const [activeFeature, setActiveFeature] = useState<string>('dashboard');

  // Mock functions for demonstration - these would be passed from parent
  const mockProps = {
    activeCell: 'A1',
    selectedRange: 'A1:C3',
    onCreateSheet: () => {},
    onUpdateCell: () => {},
    onUpdateCells: () => {}
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <div className="flex flex-wrap gap-2">
        <RibbonSection title="Analytics">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveFeature('dashboard')}
            className={activeFeature === 'dashboard' ? 'bg-blue-100' : ''}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Dashboard
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveFeature('pivot')}
          >
            <Database className="w-4 h-4 mr-1" />
            PivotTable
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveFeature('kpi')}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            KPI
          </Button>
        </RibbonSection>

        <RibbonSection title="Data Tools">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveFeature('validation')}
          >
            <Shield className="w-4 h-4 mr-1" />
            Validation
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveFeature('formatting')}
          >
            <Settings className="w-4 h-4 mr-1" />
            Conditional
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveFeature('filter')}
          >
            <Filter className="w-4 h-4 mr-1" />
            Slicer
          </Button>
        </RibbonSection>

        <RibbonSection title="Import/Export">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveFeature('import')}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1" />
            Import/Export
          </Button>
        </RibbonSection>

        <RibbonSection title="View">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveFeature('view')}
          >
            <Eye className="w-4 h-4 mr-1" />
            View Tools
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveFeature('comments')}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Comments
          </Button>
        </RibbonSection>
      </div>

      <div className="flex-1">
        {activeFeature === 'dashboard' && (
          <DashboardManager
            sheets={sheets}
            activeSheet={activeSheet}
            onCreateChart={onCreateChart}
            onUpdateSheet={onUpdateSheet}
          />
        )}
        
        {activeFeature !== 'dashboard' && (
          <AdvancedFeatures
            sheets={sheets}
            activeSheet={activeSheet}
            {...mockProps}
            onUpdateSheet={onUpdateSheet}
          />
        )}
      </div>
    </div>
  );
};

export default AdvancedTabContent;
