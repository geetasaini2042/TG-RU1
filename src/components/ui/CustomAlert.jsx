import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

const CustomAlert = ({ isOpen, type = 'info', title, message, onClose }) => {
  if (!isOpen) return null;

  const config = {
    success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
    error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    warning: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  };

  const style = config[type] || config.info;
  const Icon = style.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
        {/* Backdrop Blur */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-800 w-full max-w-xs rounded-3xl shadow-2xl p-6 relative z-10 overflow-hidden"
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full ${style.bg} ${style.color} flex items-center justify-center mb-4 border-4 border-white dark:border-slate-700 shadow-sm`}>
               <Icon size={32} />
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6 leading-relaxed">
              {message}
            </p>

            <button 
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm active:scale-95 transition-transform"
            >
              Okay, Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomAlert;
