import React from 'react';

const CategoryFilter = ({ activeCat, setCat }) => {
  const categories = ["All", "B.Sc", "B.A", "B.Com", "M.Sc", "M.A", "PhD"];

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar px-5">
       {categories.map((cat) => (
         <button
           key={cat}
           onClick={() => setCat(cat)}
           className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all
           ${activeCat === cat 
             ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
             : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-slate-700'}`}
         >
           {cat}
         </button>
       ))}
    </div>
  );
};

export default CategoryFilter;
