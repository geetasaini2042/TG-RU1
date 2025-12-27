import React, { useState, useEffect } from 'react';
import { isTelegramEnvironment, getSecureHeaders } from '../../utils/security';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { ShieldAlert, Loader2 } from 'lucide-react';

// Sub-components
import SignupForm from './SignupForm';
import BrandLogo from './BrandLogo';
import WelcomeText from './WelcomeText';
import UserCard from './UserCard';
import LoginButton from './LoginButton';

const Login = ({ onLogin }) => {
  const [status, setStatus] = useState('CHECKING'); // CHECKING | ERROR | SIGNUP | LOGIN
  const [tgUser, setTgUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // 1. SECURITY CHECK: Is it Telegram?
    if (!isTelegramEnvironment()) {
        setStatus('ERROR');
        setErrorMsg("Access Denied: Please open this in Telegram App.");
        return;
    }

    const user = window.Telegram.WebApp.initDataUnsafe.user;
    setTgUser(user);

    // 2. CHECK API: Does user exist?
    checkUserExistence(user);

  }, []);

  const checkUserExistence = async (user) => {
      try {
          // Fake API check for demo (Replace with real fetch)
          // const res = await fetch(API_ENDPOINTS.CHECK_USER, { headers: getSecureHeaders() });
          
          // Simulation: If user ID ends with '1' -> New User (Signup)
          // Otherwise -> Existing User (Login)
          setTimeout(() => {
              if (user.id.toString().endsWith('1')) {
                  setStatus('SIGNUP'); // User not found in DB
              } else {
                  setStatus('LOGIN'); // User found
              }
          }, 1500);

      } catch (err) {
          console.error("Server Error");
          setStatus('SIGNUP'); // Fallback to signup if check fails (or handle error)
      }
  };

  const handleSignupComplete = (newUserData) => {
      // Registration API call is done inside form.
      // Now simply log them in.
      onLogin(newUserData);
  };

  // --- RENDER: ERROR SCREEN (Browser Detect) ---
  if (status === 'ERROR') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
              <ShieldAlert size={64} className="text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-red-400">Security Alert</h1>
              <p className="text-gray-400 mt-2">{errorMsg}</p>
              <p className="text-xs text-gray-600 mt-8">USG Security Protocol v1.0</p>
          </div>
      );
  }

  // --- RENDER: LOADING SCREEN ---
  if (status === 'CHECKING') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-blue-900 text-white">
              <Loader2 size={48} className="animate-spin text-blue-400 mb-4" />
              <p className="text-sm font-bold tracking-widest animate-pulse">VERIFYING IDENTITY...</p>
          </div>
      );
  }

  // --- RENDER: SIGNUP SCREEN ---
  if (status === 'SIGNUP') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
              <SignupForm onSignupComplete={handleSignupComplete} />
          </div>
      );
  }

  // --- RENDER: LOGIN SCREEN (Existing User) ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 p-6 overflow-hidden relative">
        <BrandLogo />
        <div className="w-full max-w-sm z-10">
            <WelcomeText />
            <UserCard user={tgUser} />
            <LoginButton onClick={() => onLogin(tgUser)} isLoading={false} />
        </div>
    </div>
  );
};

export default Login;
