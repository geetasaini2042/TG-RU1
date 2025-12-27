import { useState, useEffect } from 'react';
import { Loader2, Home, Newspaper, User, LogOut } from 'lucide-react';
import Login from './Login'; // Login page import kiya

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. CHECK LOGIN STATUS ---
  useEffect(() => {
    // Check karein kya user pehle se logged in hai?
    const savedUser = localStorage.getItem('usg_user');
    if (savedUser) {
        setUserData(JSON.parse(savedUser));
        setIsLoggedIn(true);
    }
  }, []);

  // --- 2. FETCH DATA ---
  useEffect(() => {
    if (isLoggedIn) {
        // Data tabhi fetch karo jab banda andar aa jaye
        fetch('./updates.json')
        .then(res => res.json())
        .then(result => {
            setData(result);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error:", err);
            setLoading(false);
        });
    }
  }, [isLoggedIn]);

  // --- 3. LOGIN FUNCTION ---
  const handleLogin = (tgUser) => {
      const userObj = tgUser || { first_name: "Guest", last_name: "Student" };
      setUserData(userObj);
      setIsLoggedIn(true);
      // LocalStorage me save karein taaki refresh karne par logout na ho
      localStorage.setItem('usg_user', JSON.stringify(userObj));
  };

  // --- 4. LOGOUT FUNCTION ---
  const handleLogout = () => {
      localStorage.removeItem('usg_user');
      setIsLoggedIn(false);
      setUserData(null);
  };

  // === AGAR LOGIN NAHI HAI TO LOGIN PAGE DIKHAO ===
  if (!isLoggedIn) {
      return <Login onLogin={handleLogin} />;
  }

  // === MAIN APP UI ===
  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
      
      {/* HEADER */}
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div>
            <p className="text-xs text-gray-400">Namaste,</p>
            <h1 className="text-lg font-bold text-blue-700">
                {userData?.first_name} {userData?.last_name}
            </h1>
        </div>
        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            {userData?.first_name[0]}
        </div>
      </header>

      <main className="p-4">
        
        {/* === HOME TAB === */}
        {activeTab === 'home' && (
            <div className="space-y-5">
                {/* Hero Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                    <h2 className="text-xl font-bold mb-1">USG Updates</h2>
                    <p className="text-blue-100 text-sm mb-3">Stay updated with university news.</p>
                </div>

                {/* Updates List */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-3">Recent Notices</h3>
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500"/></div>
                    ) : (
                        <div className="space-y-3">
                            {data.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
                                        {item.urgent && <span className="text-[10px] bg-red-100 text-red-500 px-2 py-0.5 rounded-full font-bold">NEW</span>}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                    <p className="text-[10px] text-gray-400 mt-2 text-right">{item.date}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* === PROFILE TAB === */}
        {activeTab === 'profile' && (
            <div className="flex flex-col items-center pt-8 space-y-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-400 border-4 border-white shadow-lg">
                    {userData?.first_name[0]}
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold">{userData?.first_name} {userData?.last_name}</h2>
                    <p className="text-sm text-gray-500">Student Member</p>
                </div>
                
                <div className="w-full bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
                    <button onClick={handleLogout} className="w-full p-4 text-left flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        )}
      </main>

      {/* BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center z-50 pb-5">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Home size={24} />
            <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => setActiveTab('feeds')} className={`flex flex-col items-center gap-1 ${activeTab === 'feeds' ? 'text-blue-600' : 'text-gray-400'}`}>
            <Newspaper size={24} />
            <span className="text-[10px] font-medium">Feeds</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
            <User size={24} />
            <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>

    </div>
  );
}

export default App;
