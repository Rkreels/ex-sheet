
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, X, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet } from '../types/sheet';
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface SheetTabsProps {
  sheets: Sheet[];
  activeSheetId: string;
  onSheetSelect: (sheetId: string) => void;
  onAddSheet: () => void;
  onRenameSheet?: (sheetId: string, newName: string) => void;
  onDeleteSheet?: (sheetId: string) => void;
}

const SheetTabs: React.FC<SheetTabsProps> = ({ 
  sheets, 
  activeSheetId, 
  onSheetSelect, 
  onAddSheet,
  onRenameSheet = () => {},
  onDeleteSheet = () => {},
}) => {
  const [editingSheetId, setEditingSheetId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current && editingSheetId) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSheetId]);

  const handleStartRename = (sheetId: string, currentName: string) => {
    setEditingSheetId(sheetId);
    setEditValue(currentName);
  };

  const handleRenameSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingSheetId && editValue.trim()) {
      onRenameSheet(editingSheetId, editValue.trim());
    }
    setEditingSheetId(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingSheetId(null);
    } else if (e.key === 'Enter') {
      handleRenameSubmit();
    }
  };

  const handleBlur = () => {
    handleRenameSubmit();
  };

  return (
    <div className="flex items-center h-7 bg-gray-200 border-t border-gray-300">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 rounded-none"
        data-voice-hover="Previous sheet"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 rounded-none"
        data-voice-hover="Next sheet"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <div className="flex border-l border-gray-300">
        {sheets.map((sheet) => (
          <ContextMenu key={sheet.id}>
            <ContextMenuTrigger>
              <div 
                className={cn(
                  "h-7 flex items-center border-r border-gray-300 cursor-pointer px-3 min-w-[80px] max-w-[120px] text-xs",
                  sheet.id === activeSheetId 
                    ? "bg-white" 
                    : "bg-gray-100 hover:bg-gray-50"
                )}
                onClick={() => onSheetSelect(sheet.id)}
                onDoubleClick={() => handleStartRename(sheet.id, sheet.name)}
                data-voice-hover={`Switch to ${sheet.name}`}
              >
                {editingSheetId === sheet.id ? (
                  <form onSubmit={handleRenameSubmit} className="w-full">
                    <input
                      ref={inputRef}
                      className="w-full h-5 text-xs px-1 outline-none"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleBlur}
                      onKeyDown={handleKeyDown}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </form>
                ) : (
                  <span className="truncate">{sheet.name}</span>
                )}
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => handleStartRename(sheet.id, sheet.name)}>
                <Edit2 className="h-3.5 w-3.5 mr-2" />
                Rename
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  if (sheets.length > 1) {
                    onDeleteSheet(sheet.id);
                  }
                }}
                disabled={sheets.length <= 1}
              >
                <X className="h-3.5 w-3.5 mr-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7 rounded-none"
        onClick={onAddSheet}
        data-voice-hover="Add new sheet"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SheetTabs;
