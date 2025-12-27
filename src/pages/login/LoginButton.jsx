import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

const LoginButton = ({ onClick, isLoading }) => {
  return (
    <motion.button 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isLoading}
      className="group w-full bg-white text-blue-700 font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
    >
      {/* Button Background Animation on Hover */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-blue-100 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      
      {isLoading ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          <span>Setting up...</span>
        </>
      ) : (
        <>
          <span className="relative z-10">Enter Dashboard</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
        </>
      )}
    </motion.button>
  );
};

export default LoginButton;
