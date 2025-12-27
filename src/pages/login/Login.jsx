import React, { useState, useEffect } from 'react';

// --- IMPORTING SUB-COMPONENTS ---
import BrandLogo from './BrandLogo';
import WelcomeText from './WelcomeText';
import UserCard from './UserCard';
import LoginButton from './LoginButton';

const Login = ({ onLogin }) => {
  const [tgUser, setTgUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Telegram User on Mount
  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setTgUser(window.Telegram.WebApp.initDataUnsafe.user);
    }
  }, []);

  // 2. Handle Login Click
  const handleEnter = () => {
    // Haptic Feedback (Vibration)
    if(window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    setIsLoading(true);

    // Fake loading delay for better UX
    setTimeout(() => {
      onLogin(tgUser); // Parent (App.jsx) ko batao ki login ho gaya
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 p-6 overflow-hidden relative">
      
      {/* Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* --- MODULAR COMPONENTS --- */}
      <BrandLogo />
      
      <div className="w-full max-w-sm z-10">
        <WelcomeText />
        <UserCard user={tgUser} />
        <LoginButton onClick={handleEnter} isLoading={isLoading} />
        
        <p className="text-center text-blue-200/50 text-[10px] mt-8 tracking-wider">
          SECURE LOGIN VIA TELEGRAM WEB APP
        </p>
      </div>

    </div>
  );
};

export default Login;
