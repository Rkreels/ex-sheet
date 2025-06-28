
import React, { useState } from 'react';
import RibbonSection from './RibbonSection';
import { Button } from '../ui/button';
import DashboardManager from '../dashboard/DashboardManager';
import AdvancedFeatures from '../features/AdvancedFeatures';
import ChartCreator from '../charts/ChartCreator';
import PivotTableCreator from '../pivot/PivotTableCreator';
import { BarChart3, Database, Settings, TrendingUp, Filter, FileSpreadsheet, Shield, Eye, MessageSquare, PieChart, LineChart } from 'lucide-react';
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
  const [showChartCreator, setShowChartCreator] = useState(false);
  const [showPivotCreator, setShowPivotCreator] = useState(false);

  // Mock functions for demonstration - these would be passed from parent
  const mockProps = {
    activeCell: 'A1',
    selectedRange: 'A1:C3',
    onCreateSheet: () => {},
    onUpdateCell: () => {},
    onUpdateCells: () => {}
  };

  const handleCreateChart = (chartConfig: any) => {
    onCreateChart(chartConfig);
    console.log('Chart created:', chartConfig);
  };

  const handleCreatePivot = (pivotConfig: any) => {
    console.log('Pivot table created:', pivotConfig);
    // Here you would handle the pivot table creation
  };

  const mockData = [
    { name: 'Jan', value: 400, category: 'A' },
    { name: 'Feb', value: 300, category: 'B' },
    { name: 'Mar', value: 200, category: 'A' },
    { name: 'Apr', value: 278, category: 'B' },
    { name: 'May', value: 189, category: 'A' },
  ];

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
            onClick={() => setShowPivotCreator(true)}
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

        <RibbonSection title="Charts">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowChartCreator(true)}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Bar Chart
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowChartCreator(true)}
          >
            <PieChart className="w-4 h-4 mr-1" />
            Pie Chart
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowChartCreator(true)}
          >
            <LineChart className="w-4 h-4 mr-1" />
            Line Chart
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

      {/* Chart Creator Dialog */}
      <ChartCreator
        isOpen={showChartCreator}
        onClose={() => setShowChartCreator(false)}
        onCreateChart={handleCreateChart}
        selectedData={mockData}
      />

      {/* Pivot Table Creator Dialog */}
      <PivotTableCreator
        isOpen={showPivotCreator}
        onClose={() => setShowPivotCreator(false)}
        onCreatePivot={handleCreatePivot}
        data={mockData}
      />
    </div>
  );
};

export default AdvancedTabContent;
