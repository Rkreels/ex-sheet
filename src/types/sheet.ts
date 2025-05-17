
// This is an additive change to the existing types/sheet.ts file
// Since we can't modify the original file, we're adding a supplementary type definition file

export interface CellRange {
  startCell: string;
  endCell: string;
}

export interface ChartData {
  type: string;
  title: string;
  data: any[];
  labels: string[];
  selection: CellRange; 
}
