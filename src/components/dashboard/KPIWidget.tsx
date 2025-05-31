
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Cell } from '../../types/sheet';

interface KPIWidgetProps {
  data: Record<string, Cell>;
  config: {
    title?: string;
    valueRange?: string;
    targetValue?: number;
    comparisonRange?: string;
  };
}

const KPIWidget: React.FC<KPIWidgetProps> = ({ data, config }) => {
  const kpiData = useMemo(() => {
    // Calculate KPI metrics from data
    const values: number[] = [];
    const previousValues: number[] = [];
    
    Object.entries(data).forEach(([cellId, cell]) => {
      if (cell.value && !isNaN(Number(cell.value))) {
        values.push(Number(cell.value));
      }
    });
    
    const currentValue = values.reduce((sum, val) => sum + val, 0);
    const averageValue = values.length > 0 ? currentValue / values.length : 0;
    const targetValue = config.targetValue || averageValue * 1.1;
    const previousValue = averageValue * 0.9; // Simulated previous period
    
    const trend = currentValue > previousValue ? 'up' : currentValue < previousValue ? 'down' : 'flat';
    const trendPercentage = previousValue !== 0 ? ((currentValue - previousValue) / previousValue) * 100 : 0;
    const targetAchievement = targetValue !== 0 ? (currentValue / targetValue) * 100 : 0;
    
    return {
      currentValue,
      previousValue,
      targetValue,
      trend,
      trendPercentage,
      targetAchievement
    };
  }, [data, config]);

  const getTrendIcon = () => {
    switch (kpiData.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (kpiData.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{config.title || 'KPI Metric'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{kpiData.currentValue.toLocaleString()}</span>
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`text-sm ${getTrendColor()}`}>
                {Math.abs(kpiData.trendPercentage).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Target: {kpiData.targetValue.toLocaleString()}</span>
              <span>{kpiData.targetAchievement.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  kpiData.targetAchievement >= 100 ? 'bg-green-500' : 
                  kpiData.targetAchievement >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, kpiData.targetAchievement)}%` }}
              />
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Previous: {kpiData.previousValue.toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIWidget;
