
import { Sheet, Cell } from '../types/sheet';

export const useFormatting = (
  activeSheet: Sheet,
  activeSheetId: string,
  activeCell: string,
  setSheets: React.Dispatch<React.SetStateAction<Sheet[]>>,
) => {
  // Apply formatting to cell(s)
  const applyFormat = (formatType: 'bold' | 'italic' | 'underline') => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    [formatType]: !sheet.cells[activeCell]?.format?.[formatType]
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyAlignment = (alignment: 'left' | 'center' | 'right') => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    alignment,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyFontSize = (fontSize: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    fontSize,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyFontFamily = (fontFamily: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    fontFamily,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyColor = (color: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    color,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const applyBackgroundColor = (backgroundColor: string) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? {
              ...sheet,
              cells: {
                ...sheet.cells,
                [activeCell]: {
                  ...sheet.cells[activeCell] || { value: '' },
                  format: {
                    ...sheet.cells[activeCell]?.format || {},
                    backgroundColor,
                  }
                }
              }
            }
          : sheet
      )
    );
  };

  const handleMergeCenter = () => {
    applyAlignment('center');
  };

  return {
    applyFormat,
    applyAlignment,
    applyFontSize,
    applyFontFamily,
    applyColor,
    applyBackgroundColor,
    handleMergeCenter
  };
};
