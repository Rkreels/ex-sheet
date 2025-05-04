
/**
 * Cell reference utilities for formula evaluation
 */

// Parse a cell reference like "A1" into row and column
export const parseCellRef = (cellRef: string): { col: string, row: number } => {
  const match = cellRef.match(/([A-Z]+)([0-9]+)/);
  if (!match) throw new Error(`Invalid cell reference: ${cellRef}`);
  return { col: match[1], row: parseInt(match[2], 10) };
};

// Convert column letter to index (A -> 0, B -> 1, etc.)
export const colLetterToIndex = (colLetter: string): number => {
  let result = 0;
  for (let i = 0; i < colLetter.length; i++) {
    result = result * 26 + (colLetter.charCodeAt(i) - 64);
  }
  return result - 1;
};

// Convert column index to letter (0 -> A, 1 -> B, etc.)
export const colIndexToLetter = (colIndex: number): string => {
  let letter = '';
  while (colIndex >= 0) {
    letter = String.fromCharCode(65 + (colIndex % 26)) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
};

// Expand a range like "A1:B3" into an array of cell references
export const expandRange = (range: string): string[] => {
  const [start, end] = range.split(':');
  if (!start || !end) return [range]; // Not a range
  
  const startCell = parseCellRef(start);
  const endCell = parseCellRef(end);
  
  const startColIndex = colLetterToIndex(startCell.col);
  const endColIndex = colLetterToIndex(endCell.col);
  const startRow = startCell.row;
  const endRow = endCell.row;
  
  const cells: string[] = [];
  
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startColIndex; col <= endColIndex; col++) {
      const colLetter = colIndexToLetter(col);
      cells.push(`${colLetter}${row}`);
    }
  }
  
  return cells;
};

// Helper function to get cell range data
export const getCellRangeData = (startCell: string, endCell: string, cells: Record<string, any>): any[][] => {
  const match1 = startCell.match(/([A-Z]+)(\d+)/);
  const match2 = endCell.match(/([A-Z]+)(\d+)/);
  
  if (!match1 || !match2) return [[]];
  
  const startCol = match1[1].charCodeAt(0) - 65; // Convert 'A' to 0, 'B' to 1, etc.
  const startRow = parseInt(match1[2]) - 1;    // Convert to 0-based index
  const endCol = match2[1].charCodeAt(0) - 65;
  const endRow = parseInt(match2[2]) - 1;
  
  const data: any[][] = [];
  
  for (let row = startRow; row <= endRow; row++) {
    const rowData: any[] = [];
    for (let col = startCol; col <= endCol; col++) {
      const cellId = `${String.fromCharCode(65 + col)}${row + 1}`;
      const cell = cells[cellId];
      
      let value = '';
      if (cell) {
        if (typeof cell.value === 'string' && cell.value.startsWith('=')) {
          value = cell.value; // Will be evaluated separately
        } else {
          value = cell.value;
        }
      }
      
      // Try to convert to number if possible
      const numValue = parseFloat(value);
      rowData.push(isNaN(numValue) ? value : numValue);
    }
    data.push(rowData);
  }
  
  return data;
};
