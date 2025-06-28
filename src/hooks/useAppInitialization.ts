
import { useState, useEffect } from 'react';
import initializeApp from '../utils/initializeApp';
import { getMissingFeatures, checkBrowserCompatibility } from '../utils/featureCheck';

export const useAppInitialization = () => {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingFeatures, setMissingFeatures] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Starting app initialization...');
        
        // Check browser compatibility
        const isCompatible = checkBrowserCompatibility();
        if (!isCompatible) {
          throw new Error('Browser not compatible with this application');
        }

        // Check for missing features
        const missing = getMissingFeatures();
        setMissingFeatures(missing);
        
        if (missing.length > 0) {
          console.warn('Missing features detected:', missing);
        }

        // Initialize the app
        initializeApp();
        
        // Small delay to ensure everything is loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        setInitialized(true);
        console.log('App initialization completed successfully');
      } catch (err: any) {
        console.error('App initialization failed:', err);
        setError(err.message || 'Unknown initialization error');
      }
    };

    init();
  }, []);

  return {
    initialized,
    error,
    missingFeatures
  };
};
