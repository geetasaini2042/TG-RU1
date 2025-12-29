import React from 'react';
import { Folder, BookOpen, Archive, FileText } from 'lucide-react';

const FolderItem = ({ data, onClick }) => {
  // 1. Safe Defaults
  const name = data.name || "Untitled Folder";
  const desc = data.short_des || "";
  const count = data.itemCount || 0;
  const color = data.text_colour || "#374151"; // Default Gray
  
  // 2. Icon Logic
  const renderIcon = () => {
    // Agar image link hai
    if (data.Icon && (data.Icon.startsWith('http') || data.Icon.startsWith('/'))) {
       return <img src={data.Icon} alt="icon" className="w-8 h-8 object-contain" />;
    }

    // Agar "default" hai ya category based
    switch (data.category) {
        case 'SYLLABUS': return <BookOpen size={28} style={{ color }} />;
        case 'NOTES': return <FileText size={28} style={{ color }} />;
        case 'PAPERS': return <Archive size={28} style={{ color }} />;
        default: return <Folder size={28} style={{ color }} />;
    }
  };

  return (
    <div 
      onClick={() => onClick(data)}
      className="flex flex-col p-4 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm active:scale-95 transition-transform cursor-pointer group hover:shadow-md"
    >
       <div className="flex items-start justify-between mb-2">
           <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center">
               {renderIcon()}
           </div>
           <span className="text-[10px] bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full text-gray-500 font-bold">
               {count}
           </span>
       </div>
       
       <h4 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-1" style={{ color: color }}>
           {name}
       </h4>
       <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
           {desc}
       </p>
    </div>
  );
};

export default FolderItem;
