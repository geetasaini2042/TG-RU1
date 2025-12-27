import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const UserCard = ({ user }) => {
  // Logic Fix:
  // 1. Agar API user hai to 'name' use karo.
  // 2. Agar Telegram user hai to 'first_name' use karo.
  // 3. Agar kuch nahi hai tabhi 'Guest' dikhao.
  
  const displayName = user?.name || 
                      (user?.first_name ? `${user.first_name} ${user.last_name || ''}` : "Guest User");
  
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 mb-6 shadow-lg"
    >
      {/* Avatar */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-0.5 shadow-md">
        {user?.avatar || user?.photo_url ? (
            <img 
                src={user.avatar || user.photo_url} 
                alt="Avatar" 
                className="w-full h-full rounded-full object-cover border border-white/30"
            />
        ) : (
            <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl font-bold text-white border border-white/30">
            {initial}
            </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <p className="text-xs text-blue-200 uppercase tracking-wider font-bold mb-0.5">
            Continuing as
        </p>
        <h3 className="text-lg font-bold text-white leading-none truncate pr-2">
          {displayName}
        </h3>
        {/* Agar Telegram ID available hai to dikha sakte hain for confirmation */}
        {user?.id && <p className="text-[10px] text-blue-300 mt-1 font-mono">ID: {user.id}</p>}
      </div>

      {/* Icon */}
      <ShieldCheck className="text-green-400 drop-shadow-md" size={24} />
    </motion.div>
  );
};

export default UserCard;
