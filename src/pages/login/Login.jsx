import React, { useState, useEffect } from 'react';
import { isTelegramEnvironment, getSecureHeaders } from '../../utils/security';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { ShieldAlert, Loader2 } from 'lucide-react';

import SignupForm from './SignupForm';
import BrandLogo from './BrandLogo';
import WelcomeText from './WelcomeText';
import UserCard from './UserCard';
import LoginButton from './LoginButton';

const Login = ({ onLogin }) => {
  const [status, setStatus] = useState('CHECKING'); // CHECKING | SIGNUP | LOGIN | ERROR
  const [tgUser, setTgUser] = useState(null);
  const [apiUserData, setApiUserData] = useState(null); // Data from Server
  const [apiToken, setApiToken] = useState(null);       // Token from Server

  useEffect(() => {
    // 1. Security Check
    if (!isTelegramEnvironment()) {
        setStatus('ERROR');
        return;
    }

    const user = window.Telegram.WebApp.initDataUnsafe.user;
    setTgUser(user);
    
    // 2. Start API Check
    checkUserOnServer(user);
  }, []);

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
                  // User Hai -> Login Mode
                  setApiUserData(data.RESPONSE.user_data);
                  setApiToken(data.RESPONSE.token);
                  setStatus('LOGIN');
              } else {
                  // User Nahi Hai -> Signup Mode
                  setStatus('SIGNUP');
              }
          } else {
              // Server Error
              alert("Server Error: " + data.MESSAGE);
          }
      } catch (err) {
          console.error("Connection Failed", err);
          // Fallback logic for testing (Remove in production)
          setStatus('SIGNUP'); 
      }
  };

  const handleEnterDashboard = () => {
      // Login button dabane par App.jsx ko data bhejo
      if (apiUserData && apiToken) {
          onLogin({ user: apiUserData, token: apiToken });
      }
  };

  const handleSignupSuccess = (responseFromSignup) => {
      // Signup form se jo final data (user + token) milega, usse login karao
      onLogin(responseFromSignup); 
  };

  // --- RENDER LOGIC ---

  if (status === 'ERROR') return <div className="p-10 text-center text-red-500 font-bold">Please open in Telegram App</div>;
  
  if (status === 'CHECKING') return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900 text-white">
          <Loader2 size={48} className="animate-spin text-blue-400 mb-4" />
          <p className="text-sm font-bold tracking-widest animate-pulse">CONNECTING TO SERVER...</p>
      </div>
  );

  if (status === 'SIGNUP') {
      return (
         <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
             {/* Signup Form ab API se token lekar wapas yaha aayega */}
             <SignupForm onSignupComplete={handleSignupSuccess} />
         </div>
      );
  }

  // STATUS === LOGIN
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 p-6 relative">
        <BrandLogo />
        <div className="w-full max-w-sm z-10">
            <WelcomeText />
            <UserCard user={apiUserData || tgUser} /> {/* Show Server Name if available */}
            
            <LoginButton onClick={handleEnterDashboard} isLoading={false} />
            
            <p className="text-center text-blue-200/50 text-[10px] mt-8 tracking-wider">
              SESSION SECURED • TOKEN READY
            </p>
        </div>
    </div>
  );
};

export default Login;
