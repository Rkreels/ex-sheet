
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import voiceAssistant from "./utils/voiceAssistant";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize voice assistant
    voiceAssistant.bindHoverSpeak();
    
    // Add print-specific styles
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .spreadsheet-container, .spreadsheet-container * {
          visibility: visible;
        }
        .spreadsheet-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
      }
      
      @media (max-width: 640px) {
        .responsive-hidden {
          display: none;
        }
        .responsive-compact {
          padding: 4px !important;
          font-size: 0.75rem !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Welcome message with responsive info
    setTimeout(() => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        voiceAssistant.speak("Welcome to Excel Online mobile version. Use the menu button for formatting options.");
      } else {
        voiceAssistant.speak("Welcome to Excel Online. Use the keyboard to navigate and edit cells.");
      }
    }, 1000);
    
    // Add responsive listener
    const handleResize = () => {
      document.body.classList.toggle('mobile-view', window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
