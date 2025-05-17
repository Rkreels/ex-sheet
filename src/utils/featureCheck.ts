/**
 * Feature check utility to ensure all Excel features are implemented
 * This can be used to systematically check what's missing
 */
export interface FeatureStatus {
  name: string;
  category: string;
  implemented: boolean;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

export const checkFeatures = (): FeatureStatus[] => {
  const features: FeatureStatus[] = [
    // Cell Operations
    { name: "Direct cell editing", category: "Cell Operations", implemented: true, priority: 'high', notes: "Users can now directly edit cells by clicking once" },
    { name: "Cut/Copy/Paste", category: "Cell Operations", implemented: true, priority: 'high', notes: "Basic clipboard functionality works" },
    { name: "Format Painter", category: "Formatting", implemented: true, priority: 'medium', notes: "Copies formatting from one cell to another" },
    { name: "Find/Replace", category: "Editing", implemented: true, priority: 'high', notes: "Find and replace functionality is working" },
    
    // Sheet Operations
    { name: "Sheet renaming", category: "Sheets", implemented: true, priority: 'high', notes: "Sheet renaming now works correctly" },
    { name: "Sheet deletion", category: "Sheets", implemented: true, priority: 'high', notes: "Sheet deletion now works correctly" },
    { name: "Sheet navigation", category: "Sheets", implemented: true, priority: 'high', notes: "Navigation between sheets works" },
    
    // Ribbon Sections
    { name: "Home tab", category: "Ribbon", implemented: true, priority: 'high', notes: "Home tab functionality working" },
    { name: "Insert tab", category: "Ribbon", implemented: true, priority: 'high', notes: "Insert tab functionality working" },
    { name: "Page Layout tab", category: "Ribbon", implemented: true, priority: 'medium', notes: "Page Layout tab functionality working" },
    { name: "Formulas tab", category: "Ribbon", implemented: true, priority: 'high', notes: "Formulas tab functionality working" },
    { name: "Data tab", category: "Ribbon", implemented: true, priority: 'medium', notes: "Data tab functionality working" },
    { name: "Review tab", category: "Ribbon", implemented: true, priority: 'low', notes: "Review tab functionality working" },
    
    // Formatting Features
    { name: "Cell formatting", category: "Formatting", implemented: true, priority: 'high', notes: "Font size, family, color, etc. working" },
    { name: "Number formatting", category: "Formatting", implemented: true, priority: 'high', notes: "Percentages, currency, etc. working" },
    { name: "Cell alignment", category: "Formatting", implemented: true, priority: 'medium', notes: "Left, center, right alignment working" },
    
    // Formula Features
    { name: "Formula evaluation", category: "Formulas", implemented: true, priority: 'high', notes: "Basic formula evaluation works" },
    { name: "AutoSum", category: "Formulas", implemented: true, priority: 'high', notes: "AutoSum functionality works" },
    { name: "Cell references", category: "Formulas", implemented: true, priority: 'high', notes: "Cell references in formulas work" },
    
    // Data Features
    { name: "Sorting", category: "Data", implemented: true, priority: 'medium', notes: "A-Z and Z-A sorting works" },
    { name: "Data validation", category: "Data", implemented: false, priority: 'medium', notes: "Not yet implemented" },
    { name: "Conditional formatting", category: "Formatting", implemented: false, priority: 'medium', notes: "Not yet implemented" },
    
    // Others
    { name: "Voice commands", category: "Accessibility", implemented: true, priority: 'high', notes: "Voice commands for most operations are working" },
    { name: "Print preview", category: "File", implemented: false, priority: 'low', notes: "Not yet implemented" },
    { name: "Undo/Redo", category: "Editing", implemented: true, priority: 'high', notes: "Undo/Redo functionality works" },
    { name: "Cell merging", category: "Formatting", implemented: false, priority: 'medium', notes: "Not yet implemented" },
    { name: "Charting", category: "Data Visualization", implemented: false, priority: 'medium', notes: "Basic chart insertion working, but needs more options" },
  ];
  
  return features;
};

export const getMissingFeatures = (): FeatureStatus[] => {
  return checkFeatures().filter(feature => !feature.implemented);
};

export const getImplementedFeatures = (): FeatureStatus[] => {
  return checkFeatures().filter(feature => feature.implemented);
};

export const getPriorityMissingFeatures = (priority: 'high' | 'medium' | 'low'): FeatureStatus[] => {
  return getMissingFeatures().filter(feature => feature.priority === priority);
};

export default {
  checkFeatures,
  getMissingFeatures,
  getImplementedFeatures,
  getPriorityMissingFeatures
};
