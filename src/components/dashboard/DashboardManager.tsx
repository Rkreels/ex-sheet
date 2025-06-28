
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, PieChart, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from 'recharts';

interface DashboardManagerProps {
  sheets?: any[];
  activeSheet?: any;
  onCreateChart?: (chartData: any) => void;
  onUpdateSheet?: (sheetId: string, updates: any) => void;
}

const DashboardManager: React.FC<DashboardManagerProps> = ({
  sheets = [],
  activeSheet = null,
  onCreateChart = () => {},
  onUpdateSheet = () => {}
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'analytics' | 'reports'>('overview');

  // Mock data for dashboard
  const mockMetrics = [
    { name: 'Revenue', value: 45231, change: '+12%', icon: DollarSign },
    { name: 'Users', value: 2350, change: '+5%', icon: Users },
    { name: 'Growth', value: 89.2, change: '+18%', icon: TrendingUp },
    { name: 'Activity', value: 156, change: '+3%', icon: Activity }
  ];

  const mockChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 280 },
    { name: 'May', value: 590 }
  ];

  const pieData = [
    { name: 'Sales', value: 400, color: '#0088FE' },
    { name: 'Marketing', value: 300, color: '#00C49F' },
    { name: 'Support', value: 200, color: '#FFBB28' },
    { name: 'Development', value: 100, color: '#FF8042' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button 
          variant={activeView === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveView('overview')}
        >
          Overview
        </Button>
        <Button 
          variant={activeView === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveView('analytics')}
        >
          Analytics
        </Button>
        <Button 
          variant={activeView === 'reports' ? 'default' : 'outline'}
          onClick={() => setActiveView('reports')}
        >
          Reports
        </Button>
      </div>

      {activeView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{metric.change} from last month</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Resource allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Tooltip />
                  <RechartsPieChart data={pieData} cx="50%" cy="50%" outerRadius={80}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeView === 'reports' && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <CardDescription>Create custom reports from your data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => onCreateChart({ type: 'bar', title: 'Monthly Report' })}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Monthly Performance Report
              </Button>
              <Button onClick={() => onCreateChart({ type: 'pie', title: 'Department Report' })}>
                <PieChart className="w-4 h-4 mr-2" />
                Department Analysis Report
              </Button>
              <Button onClick={() => onCreateChart({ type: 'line', title: 'Trend Report' })}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Growth Trend Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardManager;
