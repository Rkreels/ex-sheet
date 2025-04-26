
export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  alignment?: 'left' | 'center' | 'right';
}

export interface Cell {
  value: string;
  format?: CellFormat;
}

export interface Sheet {
  id: string;
  name: string;
  cells: Record<string, Cell>;
  activeCell: string;
  columnWidths: Record<string, number>;
  rowHeights: Record<string, number>;
}
