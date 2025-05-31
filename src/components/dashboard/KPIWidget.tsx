
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Cell } from '../../types/sheet';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPIWidgetProps {
  data: Record<string, Cell>;
  config?: any;
}

const KPIWidget: React.FC<KPIWidgetProps> = ({ data, config = {} }) => {
  const [kpiValue, setKpiValue] = useState<number>(0);
  const [targetValue, setTargetValue] = useState<number>(100);
  const [previousValue, setPreviousValue] = useState<number>(0);
  const [selectedRange, setSelectedRange] = useState<string>('');
  const [kpiTitle, setKpiTitle] = useState<string>('KPI Metric');

  const getCellRanges = () => {
    const ranges: string[] = [];
    // Add some common ranges
    ranges.push('A1:A10', 'B1:B10', 'C1:C10', 'D1:D10', 'E1:E10');
    return ranges;
  };

  const calculateKPI = (range: string) => {
    if (!range) return 0;
    
    const [start, end] = range.split(':');
    if (!start || !end) return 0;

    const startCol = start.match(/[A-Z]+/)?.[0];
    const startRow = parseInt(start.match(/\d+/)?.[0] || '1');
    const endCol = end.match(/[A-Z]+/)?.[0];
    const endRow = parseInt(end.match(/\d+/)?.[0] || '1');

    let total = 0;
    let count = 0;

    if (startCol && endCol) {
      const startColIndex = startCol.charCodeAt(0) - 65;
      const endColIndex = endCol.charCodeAt(0) - 65;

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startColIndex; col <= endColIndex; col++) {
          const cellId = `${String.fromCharCode(65 + col)}${row}`;
          const value = parseFloat(data[cellId]?.value || '0');
          if (!isNaN(value)) {
            total += value;
            count++;
          }
        }
      }
    }

    return count > 0 ? total / count : 0;
  };

  useEffect(() => {
    if (selectedRange) {
      const value = calculateKPI(selectedRange);
      setKpiValue(value);
    }
  }, [selectedRange, data]);

  const getTrend = () => {
    if (kpiValue > previousValue) return 'up';
    if (kpiValue < previousValue) return 'down';
    return 'flat';
  };

  const getProgressPercentage = () => {
    return targetValue > 0 ? Math.min((kpiValue / targetValue) * 100, 100) : 0;
  };

  const getTrendIcon = () => {
    const trend = getTrend();
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{kpiTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Input
            placeholder="KPI Title"
            value={kpiTitle}
            onChange={(e) => setKpiTitle(e.target.value)}
            className="text-xs"
          />
          
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Select data range" />
            </SelectTrigger>
            <SelectContent>
              {getCellRanges().map((range) => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Target value"
            value={targetValue}
            onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
            className="text-xs"
          />

          <Input
            type="number"
            placeholder="Previous value"
            value={previousValue}
            onChange={(e) => setPreviousValue(parseFloat(e.target.value) || 0)}
            className="text-xs"
          />
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold flex items-center justify-center gap-2">
            {kpiValue.toFixed(2)}
            {getTrendIcon()}
          </div>
          
          <div className="text-xs text-gray-500">
            Target: {targetValue.toFixed(2)}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          <div className="text-xs text-gray-500 mt-1">
            {getProgressPercentage().toFixed(1)}% of target
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIWidget;
