import React from 'react';
import { ShieldCheck } from 'lucide-react';

const UserCard = ({ user }) => {
  const displayName = user?.name || (user?.first_name ? `${user.first_name} ${user.last_name || ''}` : "Guest");
  const photo = user?.avatar || user?.photo_url;

  return (
    <div className="bg-black/20 rounded-2xl p-3 flex items-center gap-3 mb-6 border border-white/5">
      <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-r from-blue-500 to-purple-500">
        <img 
          src={photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
          className="w-full h-full rounded-full object-cover bg-gray-800" 
          alt="User" 
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Logged in as</p>
        <h3 className="text-white font-bold text-sm truncate">{displayName}</h3>
      </div>
      <ShieldCheck size={20} className="text-green-400" />
    </div>
  );
};

export default UserCard;
