import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { BarChart, LineChart, PieChart, AreaChart } from 'lucide-react';
import { ChartData } from '../types/sheet';

interface ChartToolbarProps {
  onCreateChart: (chartData: ChartData) => void;
}

const ChartToolbar: React.FC<ChartToolbarProps> = ({ onCreateChart }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area' | 'scatter'>('bar');
  const [title, setTitle] = useState('New Chart');
  const [dataRange, setDataRange] = useState('');
  const [labelRange, setLabelRange] = useState('');
  
  const handleCreateChart = () => {
    // Parse data range
    const rangeParts = dataRange.split(':');
    if (rangeParts.length !== 2) {
      alert('Please enter a valid data range (e.g., A1:B5)');
      return;
    }
    
    const newChart: ChartData = {
      id: `chart-${Date.now()}`,
      type: chartType,
      title,
      dataRange: {
        startCell: rangeParts[0],
        endCell: rangeParts[1]
      }
    };
    
    onCreateChart(newChart);
    setIsDialogOpen(false);
    
    // Reset form
    setTitle('New Chart');
    setDataRange('');
    setLabelRange('');
  };
  
  return (
    <>
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setChartType('bar');
            setIsDialogOpen(true);
          }}
        >
          <BarChart className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setChartType('line');
            setIsDialogOpen(true);
          }}
        >
          <LineChart className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setChartType('pie');
            setIsDialogOpen(true);
          }}
        >
          <PieChart className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setChartType('area');
            setIsDialogOpen(true);
          }}
        >
          <AreaChart className="h-4 w-4" />
        </Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Insert Chart</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chart-type" className="text-right">
                Chart Type
              </Label>
              <Select
                value={chartType}
                onValueChange={(value: any) => setChartType(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="data-range" className="text-right">
                Data Range
              </Label>
              <Input
                id="data-range"
                value={dataRange}
                onChange={(e) => setDataRange(e.target.value)}
                placeholder="e.g., A1:B5"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label-range" className="text-right">
                Label Range
              </Label>
              <Input
                id="label-range"
                value={labelRange}
                onChange={(e) => setLabelRange(e.target.value)}
                placeholder="e.g., A1:A5 (optional)"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCreateChart}>
              Create Chart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChartToolbar;
