import React, { useState, useEffect } from 'react';
import { Send, Users } from 'lucide-react';
import { fetchChannels } from '../../../../services/homeService';

const TelegramList = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const data = await fetchChannels();
        setChannels(data);
        setLoading(false);
    };
    loadData();
  }, []);

  if(loading) return <div className="space-y-3"><div className="h-14 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div><div className="h-14 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div></div>;

  return (
    <div className="space-y-3">
       {channels.map((ch, idx) => (
         <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
               {/* Channel Icon */}
               <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Send size={18} className="-ml-0.5 mt-0.5" />
               </div>
               <div>
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white">{ch.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                      <Users size={10} /> {ch.subscribers} Subscribers
                  </p>
               </div>
            </div>
            <a href={ch.link} target="_blank" rel="noreferrer" className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-blue-500/20 shadow-md active:scale-95 transition-transform">
               Join
            </a>
         </div>
       ))}
    </div>
  );
};

export default TelegramList;
