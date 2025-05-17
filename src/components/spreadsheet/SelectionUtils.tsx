
export const isCellInSelection = (cellId: string, selection: {startCell: string, endCell: string} | null): boolean => {
  if (!selection) return false;
  
  const [startCol, startRowStr] = selection.startCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
  const [endCol, endRowStr] = selection.endCell.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
  const [cellCol, cellRowStr] = cellId.match(/([A-Z]+)(\d+)/)?.slice(1) || [];
  
  if (!startCol || !startRowStr || !endCol || !endRowStr || !cellCol || !cellRowStr) return false;
  
  const startColIdx = startCol.charCodeAt(0) - 65;
  const startRowIdx = parseInt(startRowStr, 10) - 1;
  const endColIdx = endCol.charCodeAt(0) - 65;
  const endRowIdx = parseInt(endRowStr, 10) - 1;
  const cellColIdx = cellCol.charCodeAt(0) - 65;
  const cellRowIdx = parseInt(cellRowStr, 10) - 1;
  
  const minColIdx = Math.min(startColIdx, endColIdx);
  const maxColIdx = Math.max(startColIdx, endColIdx);
  const minRowIdx = Math.min(startRowIdx, endRowIdx);
  const maxRowIdx = Math.max(startRowIdx, endRowIdx);
  
  return cellColIdx >= minColIdx && cellColIdx <= maxColIdx && cellRowIdx >= minRowIdx && cellRowIdx <= maxRowIdx;
};

export const getColumnLabel = (index: number): string => {
  // Handle column labels beyond Z (AA, AB, etc.)
  if (index < 26) {
    return String.fromCharCode(65 + index); // A, B, C, ...
  } else {
    const firstChar = String.fromCharCode(65 + Math.floor(index / 26) - 1);
    const secondChar = String.fromCharCode(65 + (index % 26));
    return `${firstChar}${secondChar}`;
  }
};

export const getCellId = (rowIndex: number, colIndex: number): string => {
  return `${getColumnLabel(colIndex)}${rowIndex + 1}`;
};
