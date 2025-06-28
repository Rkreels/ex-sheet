
/**
 * Initialize the Excel application with all required features
 */
const initializeApp = () => {
  console.log('Initializing Excel Application...');
  
  // Initialize voice commands
  if ('speechSynthesis' in window) {
    console.log('Voice synthesis available');
  }
  
  // Initialize keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          document.dispatchEvent(new CustomEvent('excel-undo'));
          break;
        case 'y':
          e.preventDefault();
          document.dispatchEvent(new CustomEvent('excel-redo'));
          break;
        case 'c':
          e.preventDefault();
          document.dispatchEvent(new CustomEvent('excel-copy'));
          break;
        case 'v':
          e.preventDefault();
          document.dispatchEvent(new CustomEvent('excel-paste'));
          break;
        case 's':
          e.preventDefault();
          document.dispatchEvent(new CustomEvent('excel-save'));
          break;
      }
    }
  });
  
  // Initialize responsive design
  const updateViewport = () => {
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile-view', isMobile);
  };
  
  window.addEventListener('resize', updateViewport);
  updateViewport();
  
  console.log('Excel Application initialized successfully');
};

export default initializeApp;
