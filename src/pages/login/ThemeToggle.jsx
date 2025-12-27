import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-full transition-all duration-300 ${isDark ? 'bg-slate-700 text-yellow-400' : 'bg-blue-100 text-blue-600'} shadow-md`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
