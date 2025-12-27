import React from 'react';
import { motion } from 'framer-motion';

const WelcomeText = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
        Namaste! 🙏
      </h1>
      <p className="text-blue-100 text-sm opacity-90 font-medium">
        Universities Student Group India
      </p>
    </motion.div>
  );
};

export default WelcomeText;
