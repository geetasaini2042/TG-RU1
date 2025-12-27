import React, { useState, useEffect } from 'react';
import { isTelegramEnvironment, getSecureHeaders } from '../../utils/security';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { Loader2 } from 'lucide-react';

import SignupForm from './SignupForm';
import BrandLogo from './BrandLogo';
import WelcomeText from './WelcomeText';
import UserCard from './UserCard';
import LoginButton from './LoginButton';

const Login = ({ onLogin }) => {
  // --- FIX: Initialize tgUser IMMEDIATELY (Lazy State) ---
  const [tgUser] = useState(() => {
    // Ye line component load hone se pehle hi data utha legi
    return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
  });

  const [status, setStatus] = useState('CHECKING'); 
  const [apiUserData, setApiUserData] = useState(null);
  const [apiToken, setApiToken] = useState(null);

  useEffect(() => {
    // 1. Security Check
    if (!isTelegramEnvironment()) {
        setStatus('ERROR');
        return;
    }
    
    // 2. Start API Check using the tgUser we already have
    if (tgUser) {
        checkUserOnServer(tgUser);
    } else {
        // Agar Telegram user hi nahi mila (Browser testing)
        setStatus('ERROR'); 
    }
  }, [tgUser]);

  const checkUserOnServer = async (user) => {
      try {
          // Fake delay hatakar direct call karein
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
              // Agar server issue ho, tab bhi Signup na dikhaye, Alert de
              console.error("Server Message:", data.MESSAGE);
              setStatus('SIGNUP'); // Fallback logic
          }
      } catch (err) {
          console.error("Connection Failed", err);
          setStatus('SIGNUP'); 
      }
  };

  const handleEnterDashboard = () => {
      if (apiUserData && apiToken) {
          onLogin({ user: apiUserData, token: apiToken });
      }
  };

  const handleSignupSuccess = (responseFromSignup) => {
      onLogin(responseFromSignup); 
  };

  // --- RENDERS ---

  if (status === 'ERROR') return <div className="p-10 text-center text-red-500 font-bold">Please open in Telegram App</div>;
  
  if (status === 'CHECKING') return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900 text-white">
          <Loader2 size={48} className="animate-spin text-blue-400 mb-4" />
          <p className="text-sm font-bold tracking-widest animate-pulse">VERIFYING...</p>
      </div>
  );

  if (status === 'SIGNUP') {
      return (
         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
             <SignupForm onSignupComplete={handleSignupSuccess} />
         </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 p-6 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>

        <BrandLogo />
        <div className="w-full max-w-sm z-10">
            <WelcomeText />
            
            {/* Logic: Agar API data hai to wo dikhao, nahi to Telegram ka naam dikhao */}
            <UserCard user={apiUserData || tgUser} /> 
            
            <LoginButton onClick={handleEnterDashboard} isLoading={false} />
            
            <p className="text-center text-blue-200/50 text-[10px] mt-8 tracking-wider">
              SECURE SESSION READY
            </p>
        </div>
    </div>
  );
};

export default Login;
