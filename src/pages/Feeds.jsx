import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Share2, MessageCircle } from 'lucide-react';

const Feeds = ({ feeds }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} 
      animate={{ opacity: 1, x: 0 }} 
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pb-24"
    >
      <div className="px-1">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Campus Buzz
          </h2>
          <p className="text-xs text-gray-400">What's happening around you</p>
      </div>

      {feeds && feeds.map((feed) => (
         <div key={feed.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="relative">
                <img src={feed.image} alt="Feed" className="w-full h-48 object-cover" />
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg">
                    <span className="text-xs font-bold text-white tracking-wide">{feed.tag}</span>
                </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-gray-800 text-lg leading-tight w-3/4">{feed.title}</h3>
                 <span className="text-[10px] text-gray-400 whitespace-nowrap">2h ago</span>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors group">
                        <Heart size={20} className="group-active:scale-125 transition-transform" />
                        <span className="text-xs font-bold">{feed.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle size={20} />
                        <span className="text-xs font-bold">Comment</span>
                    </button>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                    <Share2 size={20} />
                </button>
              </div>
            </div>
         </div>
       ))}
       
       <div className="text-center py-4 text-xs text-gray-300">
           That's all for now!
       </div>
    </motion.div>
  );
};

export default Feeds;
