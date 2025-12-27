import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Search } from 'lucide-react';

// --- IMPORTING PAGES & COMPONENTS ---
import Login from './Login';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Feeds from './pages/Feeds';
import Resources from './pages/Resources';
import Profile from './pages/Profile';

function App() {
  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [appData, setAppData] = useState({ news: [], feeds: [], resources: [] });
  const [showSplash, setShowSplash] = useState(true);

  // --- INITIAL LOGIC ---
  useEffect(() => {
    // 1. Check Login
    const savedUser = localStorage.getItem('usg_user');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }

    // 2. Fetch Data from JSON
    fetch('./updates.json')
      .then(res => res.json())
      .then(result => {
        setAppData(result);
        setDataLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        // Fallback data in case JSON fails
        setAppData({ news: [], feeds: [], resources: [] });
        setDataLoading(false);
      });

    // 3. Splash Screen Timer
    setTimeout(() => setShowSplash(false), 2000);
  }, []);

  // --- HANDLERS ---
  const handleLogin = (user) => {
    const u = user || { first_name: "Guest", last_name: "Student" };
    setUserData(u);
    setIsLoggedIn(true);
    localStorage.setItem('usg_user', JSON.stringify(u));
  };

  // --- RENDER: SPLASH SCREEN ---
  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white z-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full mb-4"
        />
        <h1 className="text-2xl font-bold text-blue-600 tracking-wider">USG INDIA</h1>
      </div>
    );
  }

  // --- RENDER: LOGIN PAGE ---
  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  // --- RENDER: MAIN APP ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-blue-100">
      
      {/* GLOBAL HEADER (Sticky) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md px-5 py-3 flex justify-between items-center shadow-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-0.5">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {userData?.first_name[0]}
                </div>
            </div>
            <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Welcome</p>
                <h2 className="text-md font-bold text-gray-800 leading-none">
                    {userData?.first_name}
                </h2>
            </div>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-blue-600 active:scale-95 transition-all">
            <Search size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-blue-600 active:scale-95 transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* DYNAMIC CONTENT AREA */}
      <main className="p-5 min-h-[80vh]">
        <AnimatePresence mode="wait">
          
          {activeTab === 'home' && (
            <Home key="home" userData={userData} news={appData.news} />
          )}

          {activeTab === 'feeds' && (
            <Feeds key="feeds" feeds={appData.feeds} />
          )}

          {activeTab === 'resources' && (
            <Resources key="resources" resources={appData.resources} />
          )}

          {activeTab === 'profile' && (
            <Profile key="profile" />
          )}

        </AnimatePresence>
      </main>

      {/* BOTTOM NAVIGATION */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}

export default App;
