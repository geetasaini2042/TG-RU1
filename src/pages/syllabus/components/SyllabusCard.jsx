import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Check, Loader2, Send } from 'lucide-react';

const SyllabusCard = ({ data, onDownload }) => {
  const [status, setStatus] = useState('IDLE');

  const handleClick = async () => {
    if (status !== 'IDLE') return;
    setStatus('LOADING');
    const success = await onDownload(data);
    
    if (success) {
        setStatus('SENT');
        setTimeout(() => setStatus('IDLE'), 3000);
    } else {
        setStatus('IDLE');
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
      className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between group active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center shrink-0">
           <FileText size={24} />
        </div>
        <div className="min-w-0">
           <h4 className="font-bold text-gray-800 dark:text-white truncate text-sm mb-1">{data.title}</h4>
           <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
              <span className="bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{data.size}</span>
              <span className="flex items-center gap-1"><Calendar size={10} /> {data.date}</span>
           </div>
        </div>
      </div>
      <button 
        onClick={handleClick}
        className={`p-3 rounded-full transition-all ${status === 'SENT' ? 'bg-green-500 text-white' : status === 'LOADING' ? 'bg-blue-100 text-blue-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white'}`}
      >
        {status === 'LOADING' ? <Loader2 size={20} className="animate-spin" /> : status === 'SENT' ? <Check size={20} /> : <Send size={20} />}
      </button>
    </motion.div>
  );
};

export default SyllabusCard;
