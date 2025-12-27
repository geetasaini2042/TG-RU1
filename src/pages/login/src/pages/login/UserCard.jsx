import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const UserCard = ({ user }) => {
  // Agar user null hai to fallback logic
  const firstName = user?.first_name || "Guest";
  const lastName = user?.last_name || "User";
  const initial = firstName[0];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 mb-6 shadow-lg"
    >
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-0.5 shadow-md">
        <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl font-bold text-white border border-white/30">
          {initial}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-xs text-blue-200 uppercase tracking-wider font-bold mb-0.5">Continuing as</p>
        <h3 className="text-lg font-bold text-white leading-none">
          {firstName} {lastName}
        </h3>
      </div>

      {/* Icon */}
      <ShieldCheck className="text-green-400 drop-shadow-md" size={24} />
    </motion.div>
  );
};

export default UserCard;
