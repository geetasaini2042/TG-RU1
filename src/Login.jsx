import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    // Telegram se user ka naam uthao
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-6 text-white">
      
      {/* Logo Animation */}
      <motion.div 
        initial={{ scale: 0 }} 
        animate={{ scale: 1 }} 
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl"
      >
        <span className="text-4xl font-bold text-blue-600">USG</span>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-blue-100 mb-8">Universities Student Group India</p>
      </motion.div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl"
      >
        <div className="flex items-center gap-4 mb-6">
            {/* User Avatar Placeholder */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-xl font-bold">
                {tgUser ? tgUser.first_name[0] : 'U'}
            </div>
            <div>
                <p className="text-xs text-blue-200">Continuing as</p>
                <h3 className="font-bold text-lg">
                    {tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}` : 'Guest User'}
                </h3>
            </div>
        </div>

        <button 
          onClick={() => onLogin(tgUser)}
          className="w-full bg-white text-blue-600 font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Enter Dashboard <i className="fa-solid fa-arrow-right"></i>
        </button>
      </motion.div>

      <p className="absolute bottom-6 text-xs text-blue-200 opacity-60">
        Secure Login via Telegram
      </p>
    </div>
  );
};

export default Login;
