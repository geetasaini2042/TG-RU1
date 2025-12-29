import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { fetchSyllabus } from '../../../../services/homeService';

const SyllabusList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const data = await fetchSyllabus();
        setList(data);
        setLoading(false);
    };
    loadData();
  }, []);

  if(loading) return <div className="grid grid-cols-2 gap-3"><div className="h-20 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div><div className="h-20 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse"></div></div>;

  return (
    <div className="grid grid-cols-2 gap-3">
       {list.map((file, idx) => (
          <div key={idx} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col gap-3 group active:border-blue-500 transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center">
                      <FileText size={16} />
                  </div>
                  <Download size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <div>
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 line-clamp-1">{file.title}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">{file.size || "PDF File"}</p>
              </div>
          </div>
       ))}
    </div>
  );
};

export default SyllabusList;
