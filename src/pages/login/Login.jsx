import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldAlert } from 'lucide-react';
import { isTelegramEnvironment, getSecureHeaders } from '../../utils/security';
import { API_ENDPOINTS } from '../../config/apiConfig';

import SignupForm from './SignupForm';
import BrandLogo from './BrandLogo';
import WelcomeText from './WelcomeText';
import UserCard from './UserCard';
import LoginButton from './LoginButton';

const Login = ({ onLogin }) => {
  // Initialize Telegram User Immediately
  const [tgUser] = useState(() => window.Telegram?.WebApp?.initDataUnsafe?.user || null);
  
  const [status, setStatus] = useState('CHECKING'); 
  const [apiUserData, setApiUserData] = useState(null);
  const [apiToken, setApiToken] = useState(null);

  useEffect(() => {
    if (!isTelegramEnvironment()) {
        setStatus('ERROR');
        return;
    }
    if (tgUser) {
        checkUserOnServer(tgUser);
    } else {
        setStatus('ERROR'); 
    }
  }, [tgUser]);

  const checkUserOnServer = async (user) => {
      try {
          const response = await fetch(API_ENDPOINTS.CHECK_USER, {
              method: 'POST',
              headers: getSecureHeaders(),
              body: JSON.stringify({ tg_id: user.id })
          });
          const data = await response.json();

          if (data.STATUS_CODE === 200) {
              if (data.RESPONSE.is_registered) {
                  setApiUserData(data.RESPONSE.user_data);
                  setApiToken(data.RESPONSE.token);
                  setStatus('LOGIN');
              } else {
                  setStatus('SIGNUP');
              }
          } else {
              setStatus('SIGNUP');
          }
      } catch (err) {
          setStatus('SIGNUP'); 
      }
  };

  const handleEnterDashboard = () => {
      if (apiUserData && apiToken) {
          onLogin({ user: apiUserData, token: apiToken });
      }
  };

  // --- RENDER STATES ---

  if (status === 'ERROR') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-400 mt-2">Please open this in Telegram App</p>
    </div>
  );
  
  if (status === 'CHECKING') return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
          <div className="absolute inset-0 overflow-hidden">
             <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
             <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
          </div>
          <Loader2 size={50} className="animate-spin text-blue-400 relative z-10" />
      </div>
  );

  if (status === 'SIGNUP') {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
             <SignupForm onSignupComplete={onLogin} />
         </div>
      );
  }

  // LOGIN UI
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#0f172a]">
        
        {/* Animated Background */}
        <div className="absolute inset-0 w-full h-full">
            <div className="absolute top-0 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Content Card */}
        <div className="w-full max-w-sm z-10 px-6">
            <BrandLogo />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
            >
                <WelcomeText name={apiUserData?.name || tgUser?.first_name} />
                <UserCard user={apiUserData || tgUser} />
                <LoginButton onClick={handleEnterDashboard} isLoading={false} />
            </motion.div>

            <p className="text-center text-white/30 text-[10px] mt-8 tracking-[0.2em] font-medium">
              SECURE STUDENT GATEWAY
            </p>
        </div>
    </div>
  );
};

export default Login;
