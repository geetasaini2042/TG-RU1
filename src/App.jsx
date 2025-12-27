import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Newspaper, BookOpen, User, Bell, Search, 
  ChevronRight, LogOut, Moon, Heart, Share2, 
  Calendar, GraduationCap, FileText, Globe 
} from 'lucide-react';
import Login from './Login';

function App() {
  // --- STATES ---
  const [loading, setLoading] = useState(true); // App Loading (Splash)
  const [dataLoading, setDataLoading] = useState(true); // API Fetching
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [appData, setAppData] = useState({ news: [], feeds: [], resources: [] });
  const [showSplash, setShowSplash] = useState(true);

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Check Login
    const savedUser = localStorage.getItem('usg_user');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }

    // 2. Fetch Data (Mock API)
    fetch('./updates.json')
      .then(res => res.json())
      .then(result => {
        setAppData(result);
        setDataLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setDataLoading(false);
      });

    // 3. Splash Timer
    setTimeout(() => setShowSplash(false), 2500);
  }, []);

  const handleLogin = (user) => {
    const u = user || { first_name: "Guest", last_name: "Student" };
    setUserData(u);
    setIsLoggedIn(true);
    localStorage.setItem('usg_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    localStorage.removeItem('usg_user');
    setIsLoggedIn(false);
  };

  // --- SPLASH SCREEN VIEW ---
  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white z-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
        />
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
        >
          USG INDIA
        </motion.h1>
        <p className="text-gray-400 text-xs mt-2">Universities Student Group</p>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  // --- MAIN APP VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-24 font-sans">
      
      {/* HEADER (Sticky) */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-5 py-4 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-xs text-gray-500 font-medium">Welcome Back,</p>
          <h2 className="text-lg font-bold text-gray-800 leading-tight">
            {userData?.first_name} {userData?.last_name}
          </h2>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Search size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* DYNAMIC CONTENT AREA */}
      <main className="p-5">
        <AnimatePresence mode="wait">
          
          {/* === TAB 1: HOME === */}
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Hero Banner */}
              <div className="w-full h-48 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white relative overflow-hidden shadow-lg shadow-purple-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <span className="bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm mb-2">New Update</span>
                  <h2 className="text-2xl font-bold mb-1">Results Declared</h2>
                  <p className="text-white/90 text-sm mb-4">Check your semester 1 & 3 results now.</p>
                  <button className="bg-white text-purple-600 px-5 py-2 rounded-lg text-sm font-bold w-fit shadow-md active:scale-95 transition-transform">
                    Check Now
                  </button>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div>
                <h3 className="text-md font-bold text-gray-700 mb-3">Quick Access</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { icon: BookOpen, label: "Syllabus", color: "text-blue-600", bg: "bg-blue-50" },
                    { icon: GraduationCap, label: "Result", color: "text-green-600", bg: "bg-green-50" },
                    { icon: Calendar, label: "Dates", color: "text-orange-600", bg: "bg-orange-50" },
                    { icon: Globe, label: "Portal", color: "text-purple-600", bg: "bg-purple-50" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} shadow-sm active:scale-95 transition-transform`}>
                        <item.icon size={24} />
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Updates List */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-bold text-gray-700">Latest News</h3>
                  <span className="text-xs text-blue-500 font-medium">View All</span>
                </div>
                <div className="space-y-3">
                  {dataLoading ? <p>Loading updates...</p> : appData.news.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-start active:bg-gray-50 transition-colors">
                      <div className={`mt-1 w-2 h-2 rounded-full ${item.urgent ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-800">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.desc}</p>
                        <p className="text-[10px] text-gray-400 mt-2">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* === TAB 2: FEEDS === */}
          {activeTab === 'feeds' && (
            <motion.div 
              key="feeds"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
               <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">Campus Buzz</h2>
               {appData.feeds.map((feed) => (
                 <div key={feed.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <img src={feed.image} alt="Feed" className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{feed.tag}</span>
                        <span className="text-xs text-gray-400">2h ago</span>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">{feed.title}</h3>
                      <div className="flex gap-4 text-gray-500 mt-3 pt-3 border-t border-gray-100">
                        <button className="flex items-center gap-1 text-sm hover:text-red-500"><Heart size={18} /> {feed.likes}</button>
                        <button className="flex items-center gap-1 text-sm hover:text-blue-500"><Share2 size={18} /> Share</button>
                      </div>
                    </div>
                 </div>
               ))}
            </motion.div>
          )}

          {/* === TAB 3: RESOURCES === */}
          {activeTab === 'resources' && (
            <motion.div 
              key="resources"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-blue-600 p-6 rounded-2xl text-white mb-6">
                <h2 className="text-2xl font-bold">Library</h2>
                <p className="text-blue-100 text-sm">Access notes & papers.</p>
              </div>

              {appData.resources.map((res, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 flex justify-between">
                    {res.category} <ChevronRight size={18} className="text-gray-400"/>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {res.items.map((item, i) => (
                      <div key={i} className="p-4 flex items-center gap-3 hover:bg-blue-50 transition-colors cursor-pointer">
                         <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"><FileText size={16}/></div>
                         <span className="text-sm font-medium text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* === TAB 4: PROFILE === */}
          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center pt-6 space-y-6"
            >
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 p-1">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-4xl font-bold text-gray-700">
                    {userData?.first_name[0]}
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{userData?.first_name} {userData?.last_name}</h2>
                <p className="text-gray-500">@telegram_user</p>
                <div className="flex gap-2 justify-center mt-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Student</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">RU Campus</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Moon size={16}/></div>
                    <span className="font-medium">Dark Mode</span>
                  </div>
                  <div className="w-10 h-5 bg-gray-300 rounded-full relative"><div className="w-5 h-5 bg-white rounded-full shadow-md absolute left-0"></div></div>
                </div>
                <button onClick={handleLogout} className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 text-red-500 font-bold hover:bg-red-50">
                   <LogOut size={20} /> Logout
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* GLASS BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 w-full glass-effect z-50 px-6 py-2 flex justify-between items-center pb-6">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'feeds', icon: Newspaper, label: 'Feeds' },
          { id: 'resources', icon: BookOpen, label: 'Study' },
          { id: 'profile', icon: User, label: 'Profile' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center gap-1 p-2 transition-all duration-300"
            >
              <div className={`transition-all duration-300 ${isActive ? 'text-blue-600 -translate-y-2' : 'text-gray-400'}`}>
                <tab.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {isActive && (
                <motion.div layoutId="nav-dot" className="absolute bottom-0 w-12 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

    </div>
  );
}

export default App;
