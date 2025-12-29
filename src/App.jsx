import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS } from './config/apiConfig';
import { getSecureHeaders } from './utils/security';

// --- IMPORTS ---
import Login from './pages/login/Login';
import BottomNav from './components/BottomNav';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';

// 🔥 NEW IMPORTS
import Syllabus from './pages/syllabus/Syllabus';
import StudyMaterial from './pages/studymaterial/StudyMaterial';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Tabs: 'home', 'feeds', 'resources', 'profile', 'syllabus'
  const [activeTab, setActiveTab] = useState('home'); 
  const [sessionError, setSessionError] = useState(null);

  // --- 1. INITIAL SESSION CHECK ---
  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const savedUserStr = localStorage.getItem('usg_user');
    
    if (tgUser && savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        // Security: Agar TG ID match nahi karti to data clear karo
        if (String(savedUser.tg_id) !== String(tgUser.id)) {
            console.log("Account Mismatch. Clearing Data.");
            localStorage.clear();
            setIsLoggedIn(false);
            return;
        }
    }

    const savedToken = localStorage.getItem('usg_token');
    if (savedUserStr && savedToken) {
      setUserData(JSON.parse(savedUserStr));
      setIsLoggedIn(true);
    }
  }, []);

  // --- 2. HEARTBEAT (Session Validation) ---
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
             handleLogout("Session Expired");
          }
        } catch (error) {
           // Network error - ignore
        }
      }, 10000);
    }
    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  // --- HANDLERS ---
  const handleLogin = ({ user, token }) => {
    localStorage.clear();
    localStorage.setItem('usg_user', JSON.stringify(user));
    localStorage.setItem('usg_token', token);
    localStorage.setItem('last_tg_id', user.tg_id);
    
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

  // 🔥 INTERNAL NAVIGATION HANDLER (Home se Syllabus/StudyMaterial jane ke liye)
  const handleInternalNav = (destination) => {
      setActiveTab(destination);
  };

  // --- RENDER ---
  if (!isLoggedIn) {
      return (
        <>
            {sessionError && (
                <div className="fixed top-0 w-full bg-red-600 text-white text-center text-xs py-2 z-50 font-bold">
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
            
            {/* HOME TAB */}
            {activeTab === 'home' && (
                <Home 
                    key="home" 
                    userData={userData} 
                    onNavigate={handleInternalNav} // Pass navigation handler to Home
                />
            )}

            {/* SYLLABUS PAGE (Triggered from Home 'View All') */}
            {activeTab === 'syllabus' && (
                <Syllabus 
                    key="syllabus" 
                    onBack={() => setActiveTab('home')} 
                />
            )}

            {/* RESOURCES TAB (Mapped to StudyMaterial) */}
            {activeTab === 'resources' && (
                <StudyMaterial 
                    key="resources" 
                    onBack={() => setActiveTab('home')} 
                />
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <Profile key="profile" />
            )}

            {/* Placeholder for Feeds (Agar abhi nahi bana) */}
            {activeTab === 'feeds' && (
                <div key="feeds" className="flex items-center justify-center h-screen text-gray-400">
                    Feeds Coming Soon
                </div>
            )}

         </AnimatePresence>
       </main>
       
       {/* Bottom Navigation */}
       <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
