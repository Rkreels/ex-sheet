
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import DataValidation from './DataValidation';
import ConditionalFormatting from './ConditionalFormatting';
import ImportExport from './ImportExport';
import { Cell, Sheet } from '../../types/sheet';

interface AdvancedFeaturesProps {
  sheets: Sheet[];
  activeSheet: Sheet;
  activeCell: string;
  selectedRange: string;
  onUpdateSheet: (sheetId: string, updates: Partial<Sheet>) => void;
  onCreateSheet: (sheetData: Partial<Sheet>) => void;
  onUpdateCell: (cellId: string, updates: Partial<Cell>) => void;
  onUpdateCells: (updates: Record<string, Partial<Cell>>) => void;
}

const AdvancedFeatures: React.FC<AdvancedFeaturesProps> = ({
  sheets,
  activeSheet,
  activeCell,
  selectedRange,
  onUpdateSheet,
  onCreateSheet,
  onUpdateCell,
  onUpdateCells
}) => {
  const [freezePanes, setFreezePanes] = useState<{row: number, col: number} | null>(null);

  const handleImportData = (data: Record<string, Cell>) => {
    onUpdateSheet(activeSheet.id, { cells: { ...activeSheet.cells, ...data } });
  };

  const handleFreezePane = () => {
    const match = activeCell.match(/([A-Z]+)(\d+)/);
    if (match) {
      const col = match[1].charCodeAt(0) - 65;
      const row = parseInt(match[2]) - 1;
      setFreezePanes({ row, col });
      
      // Apply freeze panes styling
      const style = document.createElement('style');
      style.innerHTML = `
        .spreadsheet-container .row:nth-child(-n+${row + 1}) {
          position: sticky;
          top: 0;
          z-index: 10;
          background: white;
        }
        .spreadsheet-container .cell:nth-child(-n+${col + 1}) {
          position: sticky;
          left: 0;
          z-index: 10;
          background: white;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const handleUnfreezePane = () => {
    setFreezePanes(null);
    // Remove freeze panes styling
    const styles = document.head.querySelectorAll('style');
    styles.forEach(style => {
      if (style.innerHTML.includes('position: sticky')) {
        style.remove();
      }
    });
  };

  const insertComment = () => {
    const comment = prompt('Enter comment:');
    if (comment) {
      onUpdateCell(activeCell, {
        comment: {
          text: comment,
          author: 'User',
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const deleteComment = () => {
    onUpdateCell(activeCell, { comment: undefined });
  };

  const protectSheet = () => {
    const password = prompt('Enter password to protect sheet:');
    if (password) {
      onUpdateSheet(activeSheet.id, {
        protection: {
          enabled: true,
          password: btoa(password), // Simple encoding
          allowFormatCells: false,
          allowInsertRows: false,
          allowDeleteRows: false
        }
      });
    }
  };

  const unprotectSheet = () => {
    const password = prompt('Enter password to unprotect sheet:');
    if (password && activeSheet.protection) {
      if (btoa(password) === activeSheet.protection.password) {
        onUpdateSheet(activeSheet.id, { protection: undefined });
      } else {
        alert('Incorrect password');
      }
    }
  };

  return (
    <div className="p-4">
      <Tabs defaultValue="validation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="formatting">Formatting</TabsTrigger>
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="validation">
          <DataValidation
            cells={activeSheet.cells}
            activeCell={activeCell}
            onUpdateCell={onUpdateCell}
          />
        </TabsContent>

        <TabsContent value="formatting">
          <ConditionalFormatting
            cells={activeSheet.cells}
            selectedRange={selectedRange || activeCell}
            onUpdateCells={onUpdateCells}
          />
        </TabsContent>

        <TabsContent value="import-export">
          <ImportExport
            sheets={sheets}
            activeSheet={activeSheet}
            onImportData={handleImportData}
            onCreateSheet={onCreateSheet}
          />
        </TabsContent>

        <TabsContent value="tools">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>View Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button onClick={handleFreezePane} variant="outline">
                    Freeze Panes at {activeCell}
                  </Button>
                  <Button onClick={handleUnfreezePane} variant="outline">
                    Unfreeze Panes
                  </Button>
                </div>
                {freezePanes && (
                  <p className="text-sm text-gray-600">
                    Panes frozen at row {freezePanes.row + 1}, column {String.fromCharCode(freezePanes.col + 65)}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comments & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button onClick={insertComment} variant="outline">
                    Add Comment
                  </Button>
                  <Button onClick={deleteComment} variant="outline">
                    Delete Comment
                  </Button>
                </div>
                {activeSheet.cells[activeCell]?.comment && (
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                    <strong>Comment:</strong> {activeSheet.cells[activeCell]?.comment?.text}
                    <br />
                    <small className="text-gray-500">
                      By {activeSheet.cells[activeCell]?.comment?.author} on{' '}
                      {new Date(activeSheet.cells[activeCell]?.comment?.timestamp || '').toLocaleDateString()}
                    </small>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sheet Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Button onClick={protectSheet} variant="outline">
                    Protect Sheet
                  </Button>
                  <Button onClick={unprotectSheet} variant="outline">
                    Unprotect Sheet
                  </Button>
                </div>
                {activeSheet.protection?.enabled && (
                  <p className="text-sm text-green-600">
                    Sheet is protected
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedFeatures;
