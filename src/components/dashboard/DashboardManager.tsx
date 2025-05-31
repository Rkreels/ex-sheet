
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sheet, ChartData } from '../../types/sheet';
import PivotTableCreator from './PivotTableCreator';
import KPIWidget from './KPIWidget';
import SlicerControl from './SlicerControl';
import { BarChart3, PieChart, TrendingUp, Filter } from 'lucide-react';

interface DashboardManagerProps {
  sheets: Sheet[];
  activeSheet: Sheet;
  onCreateChart: (chartData: ChartData) => void;
  onUpdateSheet: (sheetId: string, updates: Partial<Sheet>) => void;
}

const DashboardManager: React.FC<DashboardManagerProps> = ({
  sheets,
  activeSheet,
  onCreateChart,
  onUpdateSheet
}) => {
  const [activeWidget, setActiveWidget] = useState<string>('pivottable');
  const [dashboardWidgets, setDashboardWidgets] = useState<any[]>([]);

  const addWidget = (type: string) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      config: {}
    };
    setDashboardWidgets([...dashboardWidgets, newWidget]);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={() => addWidget('pivottable')} variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Add PivotTable
            </Button>
            <Button onClick={() => addWidget('chart')} variant="outline">
              <PieChart className="w-4 h-4 mr-2" />
              Add Chart
            </Button>
            <Button onClick={() => addWidget('kpi')} variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Add KPI
            </Button>
            <Button onClick={() => addWidget('slicer')} variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Add Slicer
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardWidgets.map((widget) => (
              <Card key={widget.id} className="min-h-[200px]">
                <CardHeader>
                  <CardTitle className="text-sm">{widget.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {widget.type === 'pivottable' && (
                    <PivotTableCreator 
                      data={activeSheet.cells} 
                      onUpdate={(config) => {
                        // Update widget config
                      }}
                    />
                  )}
                  {widget.type === 'kpi' && (
                    <KPIWidget 
                      data={activeSheet.cells}
                      config={widget.config}
                    />
                  )}
                  {widget.type === 'slicer' && (
                    <SlicerControl 
                      data={activeSheet.cells}
                      onFilter={(filters) => {
                        // Apply filters to dashboard
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardManager;
