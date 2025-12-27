import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const LoginButton = ({ onClick, isLoading }) => {
  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={isLoading}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
    >
      <span>Enter Dashboard</span>
      <ArrowRight size={20} />
    </motion.button>
  );
};

export default LoginButton;
