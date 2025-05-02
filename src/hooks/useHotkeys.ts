
import { useEffect } from 'react';

export const useHotkeys = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // This hook is mainly a placeholder for future keyboard shortcut enhancements
      // More hotkeys can be implemented here as needed
      
      // Prevent default behavior for common spreadsheet keys
      const isSpreadsheetKey = 
        e.key === 'Tab' || 
        (e.key === 'Enter' && !e.shiftKey) ||
        e.key.startsWith('Arrow');
      
      // Don't prevent default if we're in an editable field
      const isInInput = 
        document.activeElement instanceof HTMLInputElement || 
        document.activeElement instanceof HTMLTextAreaElement;
        
      if (isSpreadsheetKey && !isInInput) {
        // Don't prevent Tab key default behavior for accessibility
        if (e.key !== 'Tab') {
          e.preventDefault();
        }
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};

export default useHotkeys;
