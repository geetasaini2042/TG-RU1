import React from 'react';
import { motion } from 'framer-motion';

const BrandLogo = () => {
  return (
    <motion.div 
      initial={{ scale: 0, rotate: -180 }} 
      animate={{ scale: 1, rotate: 0 }} 
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="mb-8 relative"
    >
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
      
      {/* Main Logo Circle */}
      <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl z-10">
        <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600">
          USG
        </span>
      </div>
    </motion.div>
  );
};

export default BrandLogo;
