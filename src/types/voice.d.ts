
declare global {
  interface Window {
    voiceCommands: Record<string, () => void>;
    handleColumnDragDrop?: (sourceIndex: number, targetIndex: number) => void;
    handleRowDragDrop?: (sourceIndex: number, targetIndex: number) => void;
  }
}

export {};
