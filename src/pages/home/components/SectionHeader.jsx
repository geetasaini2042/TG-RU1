import React from 'react';
import { ChevronRight } from 'lucide-react';

const SectionHeader = ({ title, onViewAll }) => {
  return (
    <div className="flex justify-between items-end mb-4 px-1">
       <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
           <span className="w-1 h-5 bg-blue-500 rounded-full"></span>
           {title}
       </h3>
       <button 
         onClick={onViewAll}
         className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 active:opacity-50"
       >
          View All <ChevronRight size={14} />
       </button>
    </div>
  );
};

export default SectionHeader;
