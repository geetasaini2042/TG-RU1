import React from 'react';
import { BookOpen, Calendar, Award, FileText } from 'lucide-react';

const QuickGrid = () => {
  // Ye static features hain jo app ke andar hi navigate karenge
  const actions = [
    { label: "Syllabus", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Results", icon: Award, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Timetable", icon: Calendar, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Admit Card", icon: FileText, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-8">
       {actions.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform group">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg} shadow-sm border border-transparent dark:border-white/5 group-hover:shadow-md transition-all`}>
                <item.icon size={24} className={item.color} />
             </div>
             <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center">{item.label}</span>
          </div>
       ))}
    </div>
  );
};

export default QuickGrid;
