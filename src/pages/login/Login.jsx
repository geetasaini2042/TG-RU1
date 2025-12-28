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
  const [tgUser] = useState(() => window.Telegram?.WebApp?.initDataUnsafe?.user || null);
  const [status, setStatus] = useState('CHECKING'); // CHECKING | FOUND | SIGNUP | ERROR
  const [previewUser, setPreviewUser] = useState(null); // Sirf Name/Photo dikhane ke liye
  const [loadingLogin, setLoadingLogin] = useState(false);

  useEffect(() => {
    // 1. Clear Old Data on Mount (Fixes Data Mixing)
    const savedTgId = localStorage.getItem('last_tg_id');
    if (tgUser && savedTgId && savedTgId !== String(tgUser.id)) {
        localStorage.clear(); // Agar Telegram account badal gaya to sab saaf karo
    }
    if(tgUser) localStorage.setItem('last_tg_id', tgUser.id);

    // 2. Start Check
    if (!isTelegramEnvironment()) {
        setStatus('ERROR');
    } else if (tgUser) {
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

          if (data.STATUS_CODE === 200 && data.RESPONSE.is_registered) {
              setPreviewUser(data.RESPONSE.preview); // Backend se Name/Photo mili
              setStatus('FOUND'); // "Continue as..." screen dikhao
          } else {
              setStatus('SIGNUP');
          }
      } catch (err) {
          setStatus('SIGNUP'); 
      }
  };

  const handleContinueLogin = async () => {
      setLoadingLogin(true);
      try {
          // Ab asli login call karo aur Token mango
          const response = await fetch(API_ENDPOINTS.LOGIN_USER, {
              method: 'POST',
              headers: getSecureHeaders(),
              body: JSON.stringify({ tg_id: tgUser.id })
          });
          const data = await response.json();

          if (data.STATUS_CODE === 200) {
              // Full Data + Token mila
              onLogin({ user: data.RESPONSE.user_data, token: data.RESPONSE.token });
          } else {
              alert("Login Failed: " + data.MESSAGE);
              setStatus('SIGNUP');
          }
      } catch (e) {
          alert("Network Error");
      } finally {
          setLoadingLogin(false);
      }
  };

  // --- RENDERS ---

  if (status === 'ERROR') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-gray-400 mt-2">Open via Telegram App</p>
    </div>
  );
  
  if (status === 'CHECKING') return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
          <Loader2 size={50} className="animate-spin text-blue-400" />
      </div>
  );

  if (status === 'SIGNUP') {
      return (
         <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
             <SignupForm onSignupComplete={onLogin} />
         </div>
      );
  }

  // STATUS === FOUND (Show Preview & Ask to Continue)
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] relative overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

        <div className="w-full max-w-sm z-10 px-6">
            <BrandLogo />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl"
            >
                <WelcomeText name={previewUser?.name} />
                
                {/* Preview Card */}
                <UserCard user={previewUser} />
                
                <LoginButton onClick={handleContinueLogin} isLoading={loadingLogin} />
            </motion.div>

            <p className="text-center text-white/30 text-[10px] mt-8 tracking-[0.2em] font-medium">
              TAP TO CONTINUE
            </p>
        </div>
    </div>
  );
};

export default Login;
