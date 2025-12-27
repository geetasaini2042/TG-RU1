import React from 'react';
import { motion } from 'framer-motion';
import { Home, Newspaper, BookOpen, User } from 'lucide-react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'feeds', icon: Newspaper, label: 'Feeds' },
    { id: 'resources', icon: BookOpen, label: 'Study' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 z-50 px-6 py-2 flex justify-between items-center pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className="relative flex flex-col items-center gap-1 p-2 transition-all duration-300 w-16"
          >
            <div className={`transition-all duration-300 ${isActive ? 'text-blue-600 -translate-y-2' : 'text-gray-400'}`}>
              <tab.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            {isActive && (
              <motion.div 
                layoutId="nav-dot" 
                className="absolute bottom-1 w-12 h-1 bg-blue-600 rounded-full" 
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  );
};

export default BottomNav;
