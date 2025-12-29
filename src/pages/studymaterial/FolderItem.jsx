import React from 'react';
import { Folder } from 'lucide-react';

const FolderItem = ({ data, onClick }) => {
  return (
    <div 
      onClick={() => onClick(data)}
      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform cursor-pointer group"
    >
       <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
          <Folder size={28} fill="currentColor" className="opacity-80" />
       </div>
       <span className="text-xs font-bold text-gray-700 dark:text-gray-200 text-center line-clamp-2">
          {data.name}
       </span>
       <span className="text-[10px] text-gray-400 mt-1">{data.itemCount || 0} Items</span>
    </div>
  );
};

export default FolderItem;
