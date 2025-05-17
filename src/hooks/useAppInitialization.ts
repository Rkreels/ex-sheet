
import { useEffect } from 'react';
import initializeApp from '../utils/initializeApp';
import { getMissingFeatures } from '../utils/featureCheck';

/**
 * Custom hook to initialize the app and monitor feature status
 */
export const useAppInitialization = () => {
  useEffect(() => {
    // Initialize all app features
    initializeApp();
    
    // Log missing features to help with development
    const missingFeatures = getMissingFeatures();
    if (missingFeatures.length > 0) {
      console.log('Missing features:', missingFeatures);
    }
    
    // Cleanup function
    return () => {
      // Perform cleanup if needed when component unmounts
      console.log("App cleanup");
    };
  }, []);
  
  return { initialized: true };
};

export default useAppInitialization;
