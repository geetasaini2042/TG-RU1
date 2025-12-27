import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getSecureHeaders } from './utils/security'; // Security headers import
import { API_ENDPOINTS } from './config/apiConfig';

// Import Components
import Login from './pages/login/Login';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Feeds from './pages/Feeds';
import Resources from './pages/Resources';
import Profile from './pages/profile/Profile';
import { LogOut } from 'lucide-react';

function App() {
  // --- STATES ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [sessionError, setSessionError] = useState(null);

  // --- 1. INITIAL LOAD (Check LocalStorage) ---
  useEffect(() => {
    const savedUser = localStorage.getItem('usg_user');
    const savedToken = localStorage.getItem('usg_token');

    if (savedUser && savedToken) {
      setUserData(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // --- 2. HEARTBEAT SYSTEM (10 Second Token Check) ---
  useEffect(() => {
    let intervalId;

    if (isLoggedIn) {
      console.log("🟢 Session Monitor Started");
      
      intervalId = setInterval(async () => {
        const token = localStorage.getItem('usg_token');
        if (!token) {
           handleLogout("Session Expired");
           return;
        }

        try {
          // Server ko pucho: "Kya ye token abhi bhi zinda hai?"
          const res = await fetch(API_ENDPOINTS.VALIDATE_TOKEN, {
             method: 'POST',
             headers: {
                 ...getSecureHeaders(),
                 'Authorization': `Bearer ${token}` // Token bhejo check karne ko
             }
          });
          
          const data = await res.json();
          
          // Agar server bole token invalid hai (matlab dusre phone me login hua)
          if (res.status === 401 || data.isValid === false) {
             handleLogout("Logged in on another device");
          }

        } catch (error) {
           console.error("Heartbeat skipped (Network Error)");
        }

      }, 10000); // 10,000 ms = 10 Seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isLoggedIn]);

  // --- HANDLERS ---
  const handleLogin = (data) => {
    // Data me { user: {...}, token: "xyz..." } hona chahiye
    const { user, token } = data;
    
    setUserData(user);
    setIsLoggedIn(true);
    setSessionError(null);

    // Secure Storage
    localStorage.setItem('usg_user', JSON.stringify(user));
    localStorage.setItem('usg_token', token);
  };

  const handleLogout = (reason = "") => {
    // Storage Clear
    localStorage.removeItem('usg_user');
    localStorage.removeItem('usg_token');
    
    // State Reset
    setIsLoggedIn(false);
    setUserData(null);
    setActiveTab('home');

    // Show Error if forced logout
    if (reason) {
        setSessionError(reason);
        // Haptic feedback for alert
        if(window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
    }
  };

  // --- VIEW ROUTING ---
  if (!isLoggedIn) {
      return (
        <>
            {/* Show Session Error Alert if exists */}
            {sessionError && (
                <div className="fixed top-0 left-0 w-full bg-red-500 text-white p-3 text-center text-xs font-bold z-[100] animate-bounce">
                    ⚠️ {sessionError}
                </div>
            )}
            <Login onLogin={handleLogin} />
        </>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-24">
       {/* HEADER, TABS, NAV same as before... */}
       {/* Main App UI yahan rahega... */}
       <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-5 py-3 flex justify-between items-center shadow-sm border-b border-gray-100">
           {/* ... Header Code ... */}
           <div className="font-bold text-blue-600">{userData?.name}</div>
           <button onClick={() => handleLogout()}><LogOut size={20}/></button>
       </header>

       <main className="p-5">
         <AnimatePresence mode="wait">
            {activeTab === 'home' && <Home key="home" userData={userData} />}
            {activeTab === 'feeds' && <Feeds key="feeds" />}
            {activeTab === 'resources' && <Resources key="resources" />}
            {activeTab === 'profile' && <Profile key="profile" />}
         </AnimatePresence>
       </main>

       <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
