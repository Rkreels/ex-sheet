
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Shield, Filter, Eye, MessageSquare, FileSpreadsheet, Settings } from 'lucide-react';

interface AdvancedFeaturesProps {
  sheets?: any[];
  activeSheet?: any;
  activeCell?: string;
  selectedRange?: string;
  onCreateSheet?: () => void;
  onUpdateCell?: (cellId: string, value: string) => void;
  onUpdateCells?: (updates: Record<string, string>) => void;
  onUpdateSheet?: (sheetId: string, updates: any) => void;
}

const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({
  sheets = [],
  activeSheet = null,
  activeCell = 'A1',
  selectedRange = 'A1:C3',
  onCreateSheet = () => {},
  onUpdateCell = () => {},
  onUpdateCells = () => {},
  onUpdateSheet = () => {}
}) => {
  const [validationRule, setValidationRule] = useState('');
  const [conditionalFormat, setConditionalFormat] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('');

  return (
    <Tabs defaultValue="validation" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="validation">Validation</TabsTrigger>
        <TabsTrigger value="formatting">Formatting</TabsTrigger>
        <TabsTrigger value="filter">Filter</TabsTrigger>
        <TabsTrigger value="import">Import/Export</TabsTrigger>
        <TabsTrigger value="view">View</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
      </TabsList>

      <TabsContent value="validation" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Data Validation
            </CardTitle>
            <CardDescription>Set validation rules for cell data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="validation-type">Validation Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select validation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="number">Number Range</SelectItem>
                  <SelectItem value="list">Dropdown List</SelectItem>
                  <SelectItem value="date">Date Range</SelectItem>
                  <SelectItem value="text">Text Length</SelectItem>
                  <SelectItem value="custom">Custom Formula</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="validation-rule">Validation Rule</Label>
              <Input 
                id="validation-rule"
                placeholder="Enter validation criteria"
                value={validationRule}
                onChange={(e) => setValidationRule(e.target.value)}
              />
            </div>
            <Button onClick={() => console.log('Apply validation:', validationRule)}>
              Apply Validation
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="formatting" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Conditional Formatting
            </CardTitle>
            <CardDescription>Apply formatting based on cell values</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="format-condition">Condition</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater">Greater Than</SelectItem>
                  <SelectItem value="less">Less Than</SelectItem>
                  <SelectItem value="equal">Equal To</SelectItem>
                  <SelectItem value="between">Between</SelectItem>
                  <SelectItem value="contains">Contains Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="format-value">Value</Label>
              <Input 
                id="format-value"
                placeholder="Enter comparison value"
                value={conditionalFormat}
                onChange={(e) => setConditionalFormat(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="highlight" />
              <Label htmlFor="highlight">Highlight cells</Label>
            </div>
            <Button onClick={() => console.log('Apply formatting:', conditionalFormat)}>
              Apply Formatting
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="filter" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Data Slicer & Filter
            </CardTitle>
            <CardDescription>Filter and slice your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="filter-column">Filter Column</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select column to filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Column A</SelectItem>
                  <SelectItem value="B">Column B</SelectItem>
                  <SelectItem value="C">Column C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filter-criteria">Filter Criteria</Label>
              <Input 
                id="filter-criteria"
                placeholder="Enter filter value"
                value={filterCriteria}
                onChange={(e) => setFilterCriteria(e.target.value)}
              />
            </div>
            <Button onClick={() => console.log('Apply filter:', filterCriteria)}>
              Apply Filter
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="import" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Import/Export Data
            </CardTitle>
            <CardDescription>Import and export data in various formats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                Import CSV
              </Button>
              <Button variant="outline">
                Import JSON
              </Button>
              <Button variant="outline">
                Export CSV
              </Button>
              <Button variant="outline">
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="view" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              View Tools
            </CardTitle>
            <CardDescription>Customize your view</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="freeze-panes" />
              <Label htmlFor="freeze-panes">Freeze Panes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-gridlines" />
              <Label htmlFor="show-gridlines">Show Gridlines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-headers" />
              <Label htmlFor="show-headers">Show Headers</Label>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="comments" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Comments & Collaboration
            </CardTitle>
            <CardDescription>Add comments to cells</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="comment-text">Comment</Label>
              <Input 
                id="comment-text"
                placeholder="Enter your comment"
              />
            </div>
            <Button>
              Add Comment to {activeCell}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AdvancedFeatures;
