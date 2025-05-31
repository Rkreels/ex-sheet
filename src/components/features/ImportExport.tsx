
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Cell, Sheet } from '../../types/sheet';
import { Upload, Download, FileText, Table } from 'lucide-react';

interface ImportExportProps {
  sheets: Sheet[];
  activeSheet: Sheet;
  onImportData: (data: Record<string, Cell>) => void;
  onCreateSheet: (sheetData: Partial<Sheet>) => void;
}

const ImportExport: React.FC<ImportExportProps> = ({
  sheets,
  activeSheet,
  onImportData,
  onCreateSheet
}) => {
  const [importFormat, setImportFormat] = useState<string>('csv');
  const [exportFormat, setExportFormat] = useState<string>('csv');
  const [delimiter, setDelimiter] = useState<string>(',');

  const parseCSV = (csvText: string, delimiter: string = ','): Record<string, Cell> => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const cells: Record<string, Cell> = {};

    lines.forEach((line, rowIndex) => {
      const values = line.split(delimiter).map(val => val.trim().replace(/^"|"$/g, ''));
      
      values.forEach((value, colIndex) => {
        if (value) {
          const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
          cells[cellId] = {
            value: value,
            format: {}
          };
        }
      });
    });

    return cells;
  };

  const parseJSON = (jsonText: string): Record<string, Cell> => {
    const data = JSON.parse(jsonText);
    const cells: Record<string, Cell> = {};

    if (Array.isArray(data)) {
      data.forEach((row, rowIndex) => {
        if (typeof row === 'object' && row !== null) {
          Object.entries(row).forEach(([key, value], colIndex) => {
            const cellId = `${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`;
            cells[cellId] = {
              value: String(value),
              format: {}
            };
          });
        }
      });
    }

    return cells;
  };

  const generateCSV = (cells: Record<string, Cell>): string => {
    const maxRow = Math.max(...Object.keys(cells).map(id => {
      const match = id.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }));

    const maxCol = Math.max(...Object.keys(cells).map(id => {
      const match = id.match(/[A-Z]+/);
      return match ? match[0].charCodeAt(0) - 65 : 0;
    }));

    const rows: string[] = [];

    for (let row = 1; row <= maxRow; row++) {
      const rowData: string[] = [];
      for (let col = 0; col <= maxCol; col++) {
        const cellId = `${String.fromCharCode(65 + col)}${row}`;
        const cell = cells[cellId];
        const value = cell?.value || '';
        
        // Escape values containing delimiter or quotes
        if (value.includes(delimiter) || value.includes('"')) {
          rowData.push(`"${value.replace(/"/g, '""')}"`);
        } else {
          rowData.push(value);
        }
      }
      rows.push(rowData.join(delimiter));
    }

    return rows.join('\n');
  };

  const generateJSON = (cells: Record<string, Cell>): string => {
    const data: any[] = [];
    const headers: string[] = [];

    // Get headers from first row
    Object.keys(cells).forEach(cellId => {
      const match = cellId.match(/([A-Z]+)(\d+)/);
      if (match && match[2] === '1') {
        const colIndex = match[1].charCodeAt(0) - 65;
        headers[colIndex] = cells[cellId].value;
      }
    });

    // Get max row
    const maxRow = Math.max(...Object.keys(cells).map(id => {
      const match = id.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }));

    // Convert rows to objects
    for (let row = 2; row <= maxRow; row++) {
      const rowData: any = {};
      headers.forEach((header, colIndex) => {
        const cellId = `${String.fromCharCode(65 + colIndex)}${row}`;
        const cell = cells[cellId];
        if (cell) {
          rowData[header] = cell.value;
        }
      });
      if (Object.keys(rowData).length > 0) {
        data.push(rowData);
      }
    }

    return JSON.stringify(data, null, 2);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      let cells: Record<string, Cell> = {};

      try {
        switch (importFormat) {
          case 'csv':
            cells = parseCSV(text, delimiter);
            break;
          case 'json':
            cells = parseJSON(text);
            break;
          case 'tsv':
            cells = parseCSV(text, '\t');
            break;
          default:
            console.error('Unsupported import format');
            return;
        }

        onImportData(cells);
      } catch (error) {
        console.error('Import error:', error);
        alert('Error importing file. Please check the format.');
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleExport = () => {
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (exportFormat) {
      case 'csv':
        content = generateCSV(activeSheet.cells);
        filename = `${activeSheet.name}.csv`;
        mimeType = 'text/csv';
        break;
      case 'json':
        content = generateJSON(activeSheet.cells);
        filename = `${activeSheet.name}.json`;
        mimeType = 'application/json';
        break;
      case 'tsv':
        content = generateCSV(activeSheet.cells).replace(/,/g, '\t');
        filename = `${activeSheet.name}.tsv`;
        mimeType = 'text/tab-separated-values';
        break;
      case 'excel':
        // For Excel export, we'll generate CSV for now
        content = generateCSV(activeSheet.cells);
        filename = `${activeSheet.name}.csv`;
        mimeType = 'text/csv';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const sampleTemplates = [
    {
      name: 'Budget Template',
      data: {
        'A1': { value: 'Category', format: { bold: true } },
        'B1': { value: 'Planned', format: { bold: true } },
        'C1': { value: 'Actual', format: { bold: true } },
        'D1': { value: 'Variance', format: { bold: true } },
        'A2': { value: 'Income', format: {} },
        'A3': { value: 'Housing', format: {} },
        'A4': { value: 'Food', format: {} },
        'A5': { value: 'Transportation', format: {} },
        'D2': { value: '=C2-B2', format: {} },
        'D3': { value: '=C3-B3', format: {} },
        'D4': { value: '=C4-B4', format: {} },
        'D5': { value: '=C5-B5', format: {} }
      }
    },
    {
      name: 'Sales Report',
      data: {
        'A1': { value: 'Product', format: { bold: true } },
        'B1': { value: 'Q1', format: { bold: true } },
        'C1': { value: 'Q2', format: { bold: true } },
        'D1': { value: 'Q3', format: { bold: true } },
        'E1': { value: 'Q4', format: { bold: true } },
        'F1': { value: 'Total', format: { bold: true } },
        'A2': { value: 'Product A', format: {} },
        'A3': { value: 'Product B', format: {} },
        'A4': { value: 'Product C', format: {} },
        'F2': { value: '=SUM(B2:E2)', format: {} },
        'F3': { value: '=SUM(B3:E3)', format: {} },
        'F4': { value: '=SUM(B4:E4)', format: {} }
      }
    }
  ];

  const loadTemplate = (template: any) => {
    onCreateSheet({
      name: template.name,
      cells: template.data
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import/Export Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Import Section */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Select value={importFormat} onValueChange={setImportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="tsv">TSV</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
              
              {importFormat === 'csv' && (
                <Select value={delimiter} onValueChange={setDelimiter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value=",">Comma (,)</SelectItem>
                    <SelectItem value=";">Semicolon (;)</SelectItem>
                    <SelectItem value="|">Pipe (|)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div>
              <input
                type="file"
                accept=".csv,.tsv,.json,.txt"
                onChange={handleFileImport}
                className="hidden"
                id="file-import"
              />
              <label htmlFor="file-import">
                <Button asChild>
                  <span>Choose File to Import</span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </h3>
          
          <div className="space-y-3">
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="tsv">TSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="excel">Excel Compatible</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleExport} className="w-full">
              Export Current Sheet
            </Button>
          </div>
        </div>

        {/* Templates Section */}
        <div>
          <h3 className="font-medium mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Quick Templates
          </h3>
          
          <div className="grid grid-cols-1 gap-2">
            {sampleTemplates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => loadTemplate(template)}
                className="justify-start"
              >
                <Table className="w-4 h-4 mr-2" />
                {template.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportExport;
