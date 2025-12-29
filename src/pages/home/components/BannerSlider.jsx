import React, { useState, useEffect } from 'react';
import { fetchBanners } from '../../../services/homeService'; // Import Service

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const data = await fetchBanners();
        setBanners(data);
        setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="h-32 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse mb-6"></div>;
  
  if (banners.length === 0) return null; // Hide if no banners

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar mb-2 snap-x">
      {banners.map((b, index) => (
        <div 
          key={index} 
          className={`min-w-[85%] h-36 rounded-2xl bg-gradient-to-br ${b.color || 'from-blue-600 to-indigo-500'} p-5 relative overflow-hidden shadow-lg snap-center`}
        >
           {/* Abstract Shapes */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
           
           <div className="relative z-10 flex flex-col justify-center h-full text-white">
              <span className="bg-white/20 w-fit px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-md mb-2 border border-white/10">
                  {b.tag || "NOTICE"}
              </span>
              <h3 className="text-xl font-bold leading-tight line-clamp-2">{b.title}</h3>
              <p className="text-white/80 text-xs mt-1 font-medium">{b.subtitle}</p>
           </div>
        </div>
      ))}
    </div>
  );
};

export default BannerSlider;
