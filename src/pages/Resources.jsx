import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ChevronRight, Folder } from 'lucide-react';

const Resources = ({ resources }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 pb-24"
    >
      {/* Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg mb-6">
        <h2 className="text-2xl font-bold">Digital Library</h2>
        <p className="text-indigo-100 text-sm opacity-90 mt-1">
            Access previous year papers, syllabus, and notes anytime.
        </p>
      </div>

      {resources && resources.map((res, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Category Header */}
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center cursor-pointer">
            <div className="flex items-center gap-3">
                <Folder size={20} className="text-blue-500 fill-blue-100" />
                <h3 className="font-bold text-gray-700">{res.category}</h3>
            </div>
            <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-400">
                {res.items.length} Files
            </span>
          </div>

          {/* Items List */}
          <div className="divide-y divide-gray-50">
            {res.items.map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer group">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <FileText size={16}/>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{item}</p>
                        <p className="text-[10px] text-gray-400">PDF • 2.4 MB</p>
                    </div>
                 </div>
                 <button className="text-gray-300 hover:text-blue-500">
                    <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default Resources;
