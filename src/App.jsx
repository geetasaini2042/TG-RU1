import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS } from './config/apiConfig';
import { getSecureHeaders } from './utils/security';

// Imports (Profile, Home etc...)
import Login from './pages/login/Login';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Profile from './pages/profile/Profile'; 
// ... other imports

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [sessionError, setSessionError] = useState(null);

  useEffect(() => {
    // 🔥 FIX DATA MIXING: Check Current TG User vs Saved User
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const savedUserStr = localStorage.getItem('usg_user');
    
    if (tgUser && savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        // Agar Saved ID aur Current Telegram ID match nahi karte -> Clear All
        if (String(savedUser.tg_id) !== String(tgUser.id)) {
            console.log("Account Mismatch Detected. Clearing Data.");
            localStorage.clear();
            setIsLoggedIn(false);
            return;
        }
    }

    // Normal Load
    const savedToken = localStorage.getItem('usg_token');
    if (savedUserStr && savedToken) {
      setUserData(JSON.parse(savedUserStr));
      setIsLoggedIn(true);
    }
  }, []);

  // --- HEARTBEAT (Session Check) ---
  useEffect(() => {
    let intervalId;
    if (isLoggedIn) {
      intervalId = setInterval(async () => {
        const token = localStorage.getItem('usg_token');
        if (!token) return;

        try {
          const res = await fetch(API_ENDPOINTS.VALIDATE_TOKEN, {
             method: 'POST',
             headers: { ...getSecureHeaders(), 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          
          if (res.status === 401 || data.isValid === false) {
             handleLogout("Session Expired or Logged in elsewhere");
          }
        } catch (error) {
           // Network error - do nothing, don't logout immediately
        }
      }, 10000);
    }
    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  const handleLogin = ({ user, token }) => {
    // Clear old data first
    localStorage.clear();
    
    // Save new data
    localStorage.setItem('usg_user', JSON.stringify(user));
    localStorage.setItem('usg_token', token);
    localStorage.setItem('last_tg_id', user.tg_id); // Helper for Login page
    
    setUserData(user);
    setIsLoggedIn(true);
    setSessionError(null);
  };

  const handleLogout = (reason = "") => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserData(null);
    setActiveTab('home');
    if (reason) setSessionError(reason);
  };

  if (!isLoggedIn) {
      return (
        <>
            {sessionError && (
                <div className="fixed top-0 w-full bg-red-600 text-white text-center text-xs py-2 z-50">
                    {sessionError}
                </div>
            )}
            <Login onLogin={handleLogin} />
        </>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
       <main className="pb-24">
         <AnimatePresence mode="wait">
            {activeTab === 'home' && <Home key="home" userData={userData} />}
            {activeTab === 'profile' && <Profile key="profile" />}
            {/* ... other tabs */}
         </AnimatePresence>
       </main>
       <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
