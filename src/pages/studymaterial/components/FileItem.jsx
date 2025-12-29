import React, { useState } from 'react';
import { FileText, Image, PlayCircle, Download, Loader2, Check, Send } from 'lucide-react';

const FileItem = ({ data, onDownload }) => {
  const [status, setStatus] = useState('IDLE'); // IDLE | LOADING | SENT

  // 1. Handle Download Click
  const handleClick = async (e) => {
    e.stopPropagation(); // Parent click na ho jaye
    
    if (status !== 'IDLE') return; // Already processing
    
    setStatus('LOADING');
    const success = await onDownload(data); // Parent function call
    
    if (success) {
        setStatus('SENT');
        // 3 second baad wapas reset
        setTimeout(() => setStatus('IDLE'), 3000);
    } else {
        setStatus('IDLE');
    }
  };

  // 2. Icon Logic based on File Type
  const getIcon = () => {
      const color = data.text_colour || "#3b82f6"; // Default Blue
      const type = data.fileType?.toLowerCase() || 'doc';

      if (['video', 'mp4', 'mkv'].includes(type)) {
          return <PlayCircle size={24} className="text-red-500" />;
      }
      if (['image', 'png', 'jpg', 'jpeg'].includes(type)) {
          return <Image size={24} className="text-purple-500" />;
      }
      // Default Document
      return <FileText size={24} style={{ color: color }} />;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm mb-2 hover:shadow-md transition-all active:scale-[0.99]">
       
       <div className="flex items-center gap-3 overflow-hidden flex-1">
          {/* Icon Box */}
          <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
              {getIcon()}
          </div>

          {/* Text Details */}
          <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                  {data.name || "Untitled File"}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-gray-500 font-medium">
                    {data.size || "Unknown"}
                </span>
                {data.short_des && (
                    <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                        • {data.short_des}
                    </span>
                )}
              </div>
          </div>
       </div>

       {/* Download/Send Button */}
       <button 
         onClick={handleClick}
         disabled={status !== 'IDLE'}
         className={`ml-3 p-2.5 rounded-full transition-all duration-300 relative overflow-hidden shrink-0
         ${status === 'SENT' 
             ? 'bg-green-500 text-white' 
             : status === 'LOADING' 
                 ? 'bg-blue-100 text-blue-500' 
                 : 'bg-gray-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white'
         }`}
       >
          {status === 'LOADING' ? (
              <Loader2 size={18} className="animate-spin" />
          ) : status === 'SENT' ? (
              <Check size={18} />
          ) : (
              <Send size={18} className={status === 'IDLE' ? 'ml-0.5' : ''} />
          )}
       </button>
    </div>
  );
};

export default FileItem;
