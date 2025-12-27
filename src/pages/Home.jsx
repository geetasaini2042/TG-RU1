import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Calendar, Globe, ChevronRight } from 'lucide-react';

const Home = ({ userData, news }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-24"
    >
      {/* HERO BANNER */}
      <div className="w-full h-48 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="relative z-10 h-full flex flex-col justify-center">
          <span className="bg-white/20 w-fit px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm mb-2 uppercase tracking-wide">
            Exam Update
          </span>
          <h2 className="text-2xl font-bold mb-1">Semester Results Out</h2>
          <p className="text-blue-100 text-sm mb-4">Check your Semester 1, 3 & 5 results on the portal.</p>
          <button className="bg-white text-blue-600 px-5 py-2.5 rounded-lg text-sm font-bold w-fit shadow-md active:scale-95 transition-transform">
            Check Result
          </button>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div>
        <h3 className="text-md font-bold text-gray-700 mb-4 px-1">Quick Access</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: "Syllabus", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: GraduationCap, label: "Result", color: "text-green-600", bg: "bg-green-50" },
            { icon: Calendar, label: "Datesheet", color: "text-orange-600", bg: "bg-orange-50" },
            { icon: Globe, label: "Portal", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-active:scale-95 transition-all duration-200 border border-transparent group-hover:border-${item.color.split('-')[1]}-200`}>
                <item.icon size={26} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-medium text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LATEST UPDATES LIST */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-md font-bold text-gray-700">Latest Notices</h3>
          <span className="text-xs text-blue-600 font-bold cursor-pointer">View All</span>
        </div>
        
        <div className="space-y-3">
          {news && news.length > 0 ? news.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-start active:bg-gray-50 transition-colors cursor-pointer">
              {/* Status Indicator */}
              <div className="mt-1.5 relative">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.urgent ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm text-gray-800 leading-tight">{item.title}</h4>
                    {item.urgent && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">NEW</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded">{item.date}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-gray-400 text-sm">No updates available</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
