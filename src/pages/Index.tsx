
import React from 'react';
import ExcelApp from '../components/ExcelApp';

const Index = () => {
  return (
    <div className="w-full h-screen flex flex-col overflow-hidden bg-white">
      <div className="flex-none bg-gray-100 py-1 px-2 border-b border-gray-300">
        <div className="flex gap-4">
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-200">Home</button>
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-200">Insert</button>
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-200">Page Layout</button>
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-200">Formulas</button>
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-200">Data</button>
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-200">Review</button>
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-200">View</button>
          <button className="px-3 py-1 text-sm rounded hover:bg-gray-200">Developer</button>
        </div>
      </div>
      <ExcelApp />
    </div>
  );
};

export default Index;
