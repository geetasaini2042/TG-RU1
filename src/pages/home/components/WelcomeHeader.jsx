import React from 'react';
import { Bell } from 'lucide-react';

const WelcomeHeader = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-md">
           <img 
             src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
             alt="Profile" 
             className="w-full h-full rounded-full object-cover border-2 border-white dark:border-slate-800 bg-white"
           />
        </div>
        <div>
           <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{getGreeting()}</p>
           <h2 className="text-xl font-extrabold text-gray-800 dark:text-white leading-none">
             {user?.name?.split(' ')[0] || "Student"} 👋
           </h2>
        </div>
      </div>

      <button className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 relative active:scale-90 transition-transform">
        <Bell size={20} className="text-gray-600 dark:text-gray-300" />
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </div>
  );
};

export default WelcomeHeader;
