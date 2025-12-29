import React, { useState } from 'react';
import { FileText, Image, PlayCircle, Download, Loader2, Check } from 'lucide-react';

const FileItem = ({ data, onDownload }) => {
  const [status, setStatus] = useState('IDLE');

  const handleDownload = async () => {
      if(status !== 'IDLE') return;
      setStatus('LOADING');
      const success = await onDownload(data);
      if(success) {
          setStatus('SENT');
          setTimeout(() => setStatus('IDLE'), 3000);
      } else {
          setStatus('IDLE');
      }
  };

  const getIcon = () => {
      if(data.fileType === 'video') return <PlayCircle size={24} className="text-red-500"/>;
      if(data.fileType === 'photo') return <Image size={24} className="text-purple-500"/>;
      return <FileText size={24} className="text-blue-500"/>;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm mb-2">
       <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-slate-700 flex items-center justify-center shrink-0">
              {getIcon()}
          </div>
          <div className="min-w-0">
              <h4 className="text-sm font-bold text-gray-800 dark:text-white truncate">{data.name}</h4>
              <p className="text-[10px] text-gray-400">{data.size || "Unknown Size"}</p>
          </div>
       </div>

       <button 
         onClick={handleDownload}
         className="p-2 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 active:scale-90 transition-transform"
       >
          {status === 'LOADING' ? <Loader2 size={18} className="animate-spin"/> : 
           status === 'SENT' ? <Check size={18} className="text-green-500"/> : 
           <Download size={18} />}
       </button>
    </div>
  );
};

export default FileItem;
