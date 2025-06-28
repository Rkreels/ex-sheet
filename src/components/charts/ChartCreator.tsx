
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { BarChart3, LineChart, PieChart, ScatterChart, AreaChart, RadarChart } from 'lucide-react';

interface ChartCreatorProps {
  onCreateChart: (chartConfig: any) => void;
  selectedData?: any[];
  isOpen: boolean;
  onClose: () => void;
}

const ChartCreator: React.FC<ChartCreatorProps> = ({
  onCreateChart,
  selectedData = [],
  isOpen,
  onClose
}) => {
  const [chartType, setChartType] = useState('bar');
  const [chartTitle, setChartTitle] = useState('');
  const [xAxisLabel, setXAxisLabel] = useState('');
  const [yAxisLabel, setYAxisLabel] = useState('');
  const [dataRange, setDataRange] = useState('A1:C10');

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'scatter', label: 'Scatter Plot', icon: ScatterChart },
    { value: 'area', label: 'Area Chart', icon: AreaChart },
    { value: 'radar', label: 'Radar Chart', icon: RadarChart }
  ];

  const handleCreateChart = () => {
    const chartConfig = {
      type: chartType,
      title: chartTitle || 'Chart',
      xAxisLabel,
      yAxisLabel,
      dataRange,
      data: selectedData,
      id: `chart_${Date.now()}`,
      width: 400,
      height: 300
    };

    onCreateChart(chartConfig);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Chart</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="chart-type">Chart Type</Label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="chart-title">Chart Title</Label>
              <Input
                id="chart-title"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                placeholder="Enter chart title"
              />
            </div>
            <div>
              <Label htmlFor="data-range">Data Range</Label>
              <Input
                id="data-range"
                value={dataRange}
                onChange={(e) => setDataRange(e.target.value)}
                placeholder="A1:C10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="x-axis">X-Axis Label</Label>
              <Input
                id="x-axis"
                value={xAxisLabel}
                onChange={(e) => setXAxisLabel(e.target.value)}
                placeholder="X-Axis Label"
              />
            </div>
            <div>
              <Label htmlFor="y-axis">Y-Axis Label</Label>
              <Input
                id="y-axis"
                value={yAxisLabel}
                onChange={(e) => setYAxisLabel(e.target.value)}
                placeholder="Y-Axis Label"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCreateChart}>
              Create Chart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChartCreator;
