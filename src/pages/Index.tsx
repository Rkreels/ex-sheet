
import React from 'react';
import ExcelApp from '../components/ExcelApp';

const Index = () => {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-white">
      <div className="flex-none bg-gray-100 py-1 px-2 border-b border-gray-300 hidden md:block">
        <div className="flex flex-wrap gap-2 md:gap-4">
          <button className="px-2 md:px-3 py-1 text-sm rounded hover:bg-gray-200">Home</button>
          <button className="px-2 md:px-3 py-1 text-sm rounded hover:bg-gray-200">Insert</button>
          <button className="px-2 md:px-3 py-1 text-sm rounded hover:bg-gray-200 hidden md:block">Page Layout</button>
          <button className="px-2 md:px-3 py-1 text-sm rounded hover:bg-gray-200">Formulas</button>
          <button className="px-2 md:px-3 py-1 text-sm rounded hover:bg-gray-200">Data</button>
          <button className="px-2 md:px-3 py-1 text-sm rounded hover:bg-gray-200 hidden md:block">Review</button>
          <button className="px-2 md:px-3 py-1 text-sm rounded hover:bg-gray-200 hidden lg:block">View</button>
          <button className="px-2 md:px-3 py-1 text-sm rounded hover:bg-gray-200 hidden lg:block">Developer</button>
        </div>
      </div>
      <div className="flex-none bg-gray-100 py-1 px-2 border-b border-gray-300 md:hidden">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Excel Online</span>
          <div className="flex space-x-2">
            <button className="px-2 py-1 text-sm rounded hover:bg-gray-200">Home</button>
            <button className="px-2 py-1 text-sm rounded hover:bg-gray-200">Data</button>
          </div>
        </div>
      </div>
      <ExcelApp />
    </div>
  );
};

export default Index;
