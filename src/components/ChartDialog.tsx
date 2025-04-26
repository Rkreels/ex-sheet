
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { ChartData } from '../types/sheet';
import { getCellRangeData } from '../utils/formulaEvaluator';

interface ChartDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chartData: ChartData | null;
  cells: Record<string, any>;
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', 
  '#00c49f', '#ff8042', '#ffbb28', '#8884d8', '#83a6ed'
];

const ChartDialog: React.FC<ChartDialogProps> = ({ isOpen, onClose, chartData, cells }) => {
  const [processedData, setProcessedData] = useState<any[]>([]);
  
  useEffect(() => {
    if (!chartData || !isOpen) return;

    const { dataRange } = chartData;
    
    // Get data from the specified range
    const rawData = getCellRangeData(dataRange.startCell, dataRange.endCell, cells);
    
    // Process data based on chart type
    const processed = processChartData(rawData, chartData);
    setProcessedData(processed);
  }, [chartData, cells, isOpen]);
  
  const processChartData = (rawData: any[][], chartData: ChartData): any[] => {
    if (!rawData || rawData.length === 0) return [];
    
    // For simple charts like pie, bar with a single series
    if (chartData.type === 'pie') {
      // Assume first row has headers and first column has labels
      const headers = rawData[0];
      return rawData.slice(1).map((row, index) => ({
        name: row[0] || `Item ${index + 1}`,
        value: row[1] || 0
      }));
    }
    
    // For bar, line, area charts
    const headers = rawData[0].slice(1); // Skip first cell which is often empty
    
    return rawData.slice(1).map((row) => {
      const dataPoint: any = {
        name: row[0] || '',
      };
      
      // Add each column as a separate data point
      headers.forEach((header, idx) => {
        dataPoint[header || `Series ${idx + 1}`] = row[idx + 1] || 0;
      });
      
      return dataPoint;
    });
  };
  
  const renderChart = () => {
    if (!chartData || processedData.length === 0) return null;
    
    const config = {
      series1: { color: '#8884d8' },
      series2: { color: '#82ca9d' },
      series3: { color: '#ffc658' },
    };
    
    switch (chartData.type) {
      case 'bar':
        return (
          <ChartContainer config={config} className="w-full aspect-video">
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(processedData[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
                ))
              }
            </BarChart>
          </ChartContainer>
        );
      
      case 'line':
        return (
          <ChartContainer config={config} className="w-full aspect-video">
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(processedData[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={COLORS[index % COLORS.length]}
                    activeDot={{ r: 8 }}
                  />
                ))
              }
            </LineChart>
          </ChartContainer>
        );
      
      case 'pie':
        return (
          <ChartContainer config={config} className="w-full aspect-video">
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={processedData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        );
      
      case 'area':
        return (
          <ChartContainer config={config} className="w-full aspect-video">
            <AreaChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(processedData[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Area 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stackId="1"
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))
              }
            </AreaChart>
          </ChartContainer>
        );
      
      case 'scatter':
        return (
          <ChartContainer config={config} className="w-full aspect-video">
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="x" />
              <YAxis type="number" dataKey="y" name="y" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Data Points" data={processedData} fill="#8884d8" />
            </ScatterChart>
          </ChartContainer>
        );
      
      default:
        return <div>Unsupported chart type</div>;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{chartData?.title || 'Chart'}</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 h-[500px] flex items-center justify-center">
          {processedData.length > 0 ? (
            renderChart()
          ) : (
            <div className="text-center text-gray-500">No data to display</div>
          )}
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChartDialog;
