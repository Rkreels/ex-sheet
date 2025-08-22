import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Sheet, CellSelection } from '../../types/sheet';

interface AdvancedStatisticsProps {
  activeSheet: Sheet;
  cellSelection: CellSelection | null;
}

const AdvancedStatistics: React.FC<AdvancedStatisticsProps> = ({
  activeSheet,
  cellSelection
}) => {
  const [statistics, setStatistics] = useState<any>(null);

  const calculateAdvancedStatistics = () => {
    if (!cellSelection) return null;

    const { startCell, endCell } = cellSelection;
    const startMatch = startCell.match(/([A-Z]+)([0-9]+)/);
    const endMatch = endCell.match(/([A-Z]+)([0-9]+)/);
    
    if (!startMatch || !endMatch) return null;

    const startCol = startMatch[1].charCodeAt(0) - 65;
    const startRow = parseInt(startMatch[2]);
    const endCol = endMatch[1].charCodeAt(0) - 65;
    const endRow = parseInt(endMatch[2]);

    const values: number[] = [];
    const textValues: string[] = [];
    
    for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
      for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
        const cellId = `${String.fromCharCode(65 + col)}${row}`;
        const cell = activeSheet.cells[cellId];
        
        if (cell) {
          const value = cell.calculatedValue !== undefined ? cell.calculatedValue : cell.value;
          
          if (typeof value === 'number' && !isNaN(value)) {
            values.push(value);
          } else if (typeof value === 'string' && value.trim()) {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              values.push(numValue);
            } else {
              textValues.push(value);
            }
          }
        }
      }
    }

    if (values.length === 0) return null;

    // Sort values for percentile calculations
    const sortedValues = [...values].sort((a, b) => a - b);
    
    // Basic statistics
    const count = values.length;
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Median
    const median = sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)];
    
    // Standard deviation
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const standardDeviation = Math.sqrt(variance);
    
    // Percentiles
    const getPercentile = (p: number) => {
      const index = (p / 100) * (sortedValues.length - 1);
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      const weight = index % 1;
      
      if (upper >= sortedValues.length) return sortedValues[sortedValues.length - 1];
      return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
    };
    
    // Mode calculation
    const frequency: Record<number, number> = {};
    values.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency)
      .filter(key => frequency[parseFloat(key)] === maxFreq)
      .map(key => parseFloat(key));
    
    // Range and quartiles
    const range = max - min;
    const q1 = getPercentile(25);
    const q3 = getPercentile(75);
    const iqr = q3 - q1;
    
    // Skewness and kurtosis
    const skewness = values.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 3), 0) / count;
    const kurtosis = values.reduce((acc, val) => acc + Math.pow((val - mean) / standardDeviation, 4), 0) / count - 3;

    return {
      basic: {
        count,
        sum,
        mean,
        median,
        mode: modes.length === 1 ? modes[0] : modes,
        min,
        max,
        range
      },
      distribution: {
        standardDeviation,
        variance,
        skewness,
        kurtosis,
        q1,
        q3,
        iqr
      },
      percentiles: {
        p10: getPercentile(10),
        p25: getPercentile(25),
        p50: getPercentile(50),
        p75: getPercentile(75),
        p90: getPercentile(90),
        p95: getPercentile(95),
        p99: getPercentile(99)
      },
      textStats: {
        textCount: textValues.length,
        uniqueText: [...new Set(textValues)].length
      }
    };
  };

  useEffect(() => {
    const stats = calculateAdvancedStatistics();
    setStatistics(stats);
  }, [cellSelection, activeSheet.cells]);

  if (!statistics) {
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-sm">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a range of cells to see statistics
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number | number[]) => {
    if (Array.isArray(num)) {
      return num.map(n => n.toFixed(2)).join(', ');
    }
    return num.toFixed(2);
  };

  return (
    <div className="space-y-4 w-80">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Basic Statistics
            <Badge variant="outline">{statistics.basic.count} cells</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Sum:</span>
              <div>{formatNumber(statistics.basic.sum)}</div>
            </div>
            <div>
              <span className="font-medium">Average:</span>
              <div>{formatNumber(statistics.basic.mean)}</div>
            </div>
            <div>
              <span className="font-medium">Median:</span>
              <div>{formatNumber(statistics.basic.median)}</div>
            </div>
            <div>
              <span className="font-medium">Mode:</span>
              <div>{formatNumber(statistics.basic.mode)}</div>
            </div>
            <div>
              <span className="font-medium">Min:</span>
              <div>{formatNumber(statistics.basic.min)}</div>
            </div>
            <div>
              <span className="font-medium">Max:</span>
              <div>{formatNumber(statistics.basic.max)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Std Dev:</span>
              <div>{formatNumber(statistics.distribution.standardDeviation)}</div>
            </div>
            <div>
              <span className="font-medium">Variance:</span>
              <div>{formatNumber(statistics.distribution.variance)}</div>
            </div>
            <div>
              <span className="font-medium">Skewness:</span>
              <div>{formatNumber(statistics.distribution.skewness)}</div>
            </div>
            <div>
              <span className="font-medium">Kurtosis:</span>
              <div>{formatNumber(statistics.distribution.kurtosis)}</div>
            </div>
            <div>
              <span className="font-medium">Q1:</span>
              <div>{formatNumber(statistics.distribution.q1)}</div>
            </div>
            <div>
              <span className="font-medium">Q3:</span>
              <div>{formatNumber(statistics.distribution.q3)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Percentiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">10th:</span>
              <div>{formatNumber(statistics.percentiles.p10)}</div>
            </div>
            <div>
              <span className="font-medium">25th:</span>
              <div>{formatNumber(statistics.percentiles.p25)}</div>
            </div>
            <div>
              <span className="font-medium">75th:</span>
              <div>{formatNumber(statistics.percentiles.p75)}</div>
            </div>
            <div>
              <span className="font-medium">90th:</span>
              <div>{formatNumber(statistics.percentiles.p90)}</div>
            </div>
            <div>
              <span className="font-medium">95th:</span>
              <div>{formatNumber(statistics.percentiles.p95)}</div>
            </div>
            <div>
              <span className="font-medium">99th:</span>
              <div>{formatNumber(statistics.percentiles.p99)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedStatistics;