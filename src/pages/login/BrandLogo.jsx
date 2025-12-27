import React from 'react';
import { motion } from 'framer-motion';

const BrandLogo = () => {
  return (
    <motion.div 
      initial={{ scale: 0 }} animate={{ scale: 1 }} 
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex justify-center mb-8"
    >
      <div className="relative w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/30 rotate-3">
        <div className="absolute inset-0 border-2 border-white/20 rounded-3xl"></div>
        <span className="text-3xl font-extrabold text-white tracking-tighter">USG</span>
        {/* Glow Dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#0f172a] shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
      </div>
    </motion.div>
  );
};

export default BrandLogo;
