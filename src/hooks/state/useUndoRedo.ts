
import { toast } from 'sonner';
import { Sheet } from '../../types/sheet';

interface UseUndoRedoProps {
  sheets: Sheet[];
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>;
  activeSheetId: string;
}

export const useUndoRedo = ({ sheets, setSheets, activeSheetId }: UseUndoRedoProps) => {
  
  // Undo functionality
  const handleUndo = () => {
    const sheet = sheets.find(s => s.id === activeSheetId);
    if (!sheet || !sheet.history || sheet.history.past.length === 0) {
      toast.error("Nothing to undo");
      return;
    }

    const lastPast = sheet.history.past.pop();
    if (!lastPast) return;

    setSheets(prevSheets => 
      prevSheets.map(s => 
        s.id === activeSheetId 
          ? {
              ...s,
              cells: lastPast.cells,
              history: {
                past: [...(s.history?.past || [])],
                future: [
                  { cells: { ...s.cells } },
                  ...(s.history?.future || [])
                ]
              }
            }
          : s
      )
    );
    toast.success("Undo successful");
  };
  
  // Redo functionality
  const handleRedo = () => {
    const sheet = sheets.find(s => s.id === activeSheetId);
    if (!sheet || !sheet.history || sheet.history.future.length === 0) {
      toast.error("Nothing to redo");
      return;
    }

    const firstFuture = sheet.history.future.shift();
    if (!firstFuture) return;

    setSheets(prevSheets => 
      prevSheets.map(s => 
        s.id === activeSheetId 
          ? {
              ...s,
              cells: firstFuture.cells,
              history: {
                past: [
                  ...(s.history?.past || []),
                  { cells: { ...s.cells } }
                ],
                future: [...(s.history?.future || [])]
              }
            }
          : s
      )
    );
    toast.success("Redo successful");
  };

  return { handleUndo, handleRedo };
};
