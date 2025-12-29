import React from 'react';

const BannerSlider = () => {
  const banners = [
    { id: 1, title: "Exam Forms Out!", sub: "Last Date: 30 Dec", color: "from-blue-600 to-blue-400" },
    { id: 2, title: "Winter Holidays", sub: "25 Dec - 1 Jan", color: "from-purple-600 to-indigo-400" },
    { id: 3, title: "Result Declared", sub: "B.Sc Part II", color: "from-pink-600 to-rose-400" },
  ];

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar mb-2">
      {banners.map((b) => (
        <div 
          key={b.id} 
          className={`min-w-[85%] h-32 rounded-2xl bg-gradient-to-br ${b.color} p-5 relative overflow-hidden shadow-lg shadow-blue-500/20`}
        >
           <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
           <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl -ml-4 -mb-4"></div>
           
           <div className="relative z-10 flex flex-col justify-center h-full">
              <span className="bg-white/20 w-fit px-2 py-0.5 rounded text-[10px] text-white font-bold backdrop-blur-md mb-2">NOTICE</span>
              <h3 className="text-xl font-bold text-white leading-tight">{b.title}</h3>
              <p className="text-white/80 text-xs mt-1">{b.sub}</p>
           </div>
        </div>
      ))}
    </div>
  );
};

export default BannerSlider;
