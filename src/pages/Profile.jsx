import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Settings, 
  CreditCard, Shield, LogOut, ChevronRight, Award, 
  BookOpen, FileText, HelpCircle, Moon, Bell, Lock, 
  Camera, CheckCircle, XCircle, RefreshCw, Download,
  Share2, Copy, AlertCircle, GraduationCap, LayoutGrid
} from 'lucide-react';

// --- CONSTANTS & CONFIG ---
const API_BASE = "https://sainipankaj12.serv00.net/api";
const THEME_COLOR = "blue"; // Change to 'purple', 'orange' etc.

// --- ANIMATION VARIANTS ---
const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};

const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02 }
};

// --- MOCK DATA (Fallback if API fails) ---
const MOCK_USER = {
  id: "USG-2025-001",
  name: "Pankaj Saini",
  course: "B.Sc Computer Science",
  semester: "3rd Semester",
  college: "University of Rajasthan",
  email: "student@usgindia.com",
  phone: "+91 98765 43210",
  dob: "15 Aug 2003",
  bloodGroup: "O+",
  enrollmentNo: "22/1548/CS",
  avatar: "https://i.pravatar.cc/300",
  stats: {
    cgpa: 8.4,
    attendance: 78,
    credits: 45,
    backlogs: 0
  },
  badges: [
    { id: 1, icon: "👑", name: "Class Rep", desc: "Selected CR for 2025" },
    { id: 2, icon: "🚀", name: "Early Bird", desc: "Registered before deadline" },
    { id: 3, icon: "📚", name: "Scholar", desc: "Top 10% in Semester 1" }
  ]
};

// ==========================================
// COMPONENT: TOAST NOTIFICATION
// ==========================================
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 50, opacity: 0 }}
      className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 ${bg} text-white px-6 py-3 rounded-full shadow-xl z-[100] flex items-center gap-2`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

// ==========================================
// COMPONENT: SKELETON LOADER
// ==========================================
const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse p-4">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
      <div className="h-6 w-48 bg-gray-200 rounded"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-24 bg-gray-200 rounded-2xl"></div>
      <div className="h-24 bg-gray-200 rounded-2xl"></div>
    </div>
    <div className="space-y-3">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
      ))}
    </div>
  </div>
);

// ==========================================
// COMPONENT: DIGITAL ID CARD (3D FLIP)
// ==========================================
const DigitalIDCard = ({ user }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="perspective-1000 w-full h-56 cursor-pointer my-6" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div 
        className="w-full h-full relative preserve-3d transition-transform duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* FRONT SIDE */}
        <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-2xl border border-white/10 overflow-hidden">
          {/* Watermark */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">U</div>
               <span className="text-xs font-bold tracking-widest opacity-80">USG INDIA</span>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" className="w-12 h-12 bg-white p-1 rounded-md" alt="QR" />
          </div>
          
          <div className="flex gap-4 items-center">
            <img src={user.avatar} className="w-20 h-20 rounded-lg border-2 border-white/50 object-cover bg-gray-200" alt="Profile" />
            <div>
              <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
              <p className="text-xs text-blue-100 mb-1">{user.course}</p>
              <div className="inline-block bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                ID: {user.enrollmentNo}
              </div>
            </div>
          </div>
          <p className="absolute bottom-4 left-5 text-[10px] opacity-60">Tap to see back side</p>
        </div>

        {/* BACK SIDE */}
        <div className="absolute w-full h-full backface-hidden bg-gray-800 rounded-2xl p-5 text-white shadow-2xl border border-gray-700 rotate-y-180">
          <h3 className="text-sm font-bold border-b border-gray-600 pb-2 mb-3 text-gray-400">Official Details</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
            <div>
              <p className="text-gray-500">Date of Birth</p>
              <p className="font-medium">{user.dob}</p>
            </div>
            <div>
              <p className="text-gray-500">Blood Group</p>
              <p className="font-medium">{user.bloodGroup}</p>
            </div>
            <div>
              <p className="text-gray-500">Valid Upto</p>
              <p className="font-medium">July 2026</p>
            </div>
            <div>
              <p className="text-gray-500">Emergency</p>
              <p className="font-medium">+91 100</p>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-gray-600 text-[9px] text-center text-gray-500">
            This card is issued by University Student Group. <br/>If found, please return to admin office.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// MAIN COMPONENT: PROFILE
// ==========================================
const Profile = () => {
  // --- STATES ---
  const [view, setView] = useState('OVERVIEW'); // OVERVIEW, EDIT, SETTINGS, ACADEMICS, HELP
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // --- API CALL ---
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Haptic Feedback
        if(window.Telegram?.WebApp?.HapticFeedback) {
             window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }

        // Simulating API Call delay
        console.log("Fetching from:", `${API_BASE}/student/profile`);
        // Real fetch implementation:
        // const response = await fetch(`${API_BASE}/student/profile`);
        // const data = await response.json();
        
        // Using Mock Data for demo reliability
        setTimeout(() => {
          setUserData(MOCK_USER);
          setLoading(false);
        }, 1500);

      } catch (error) {
        console.error("API Error", error);
        setToast({ msg: "Failed to load profile", type: "error" });
        setLoading(false);
      }
    };

    fetchProfile();
  }, [refreshKey]);

  // --- HANDLERS ---
  const handleCopyID = () => {
    navigator.clipboard.writeText(userData?.enrollmentNo);
    setToast({ msg: "ID Copied to clipboard", type: "success" });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Simulate API update
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setView('OVERVIEW');
        setToast({ msg: "Profile Updated Successfully", type: "success" });
    }, 1000);
  };

  // --- RENDER HELPERS ---
  const renderHeader = (title, backTo = 'OVERVIEW') => (
    <div className="flex items-center gap-4 mb-6">
      <button 
        onClick={() => setView(backTo)} 
        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
      >
        <ChevronRight size={20} className="rotate-180" />
      </button>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );

  // ==========================
  // VIEW: OVERVIEW (DASHBOARD)
  // ==========================
  const renderOverview = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="pb-24">
      
      {/* HEADER SECTION */}
      <div className="relative mb-16">
        <div className="h-32 w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-b-3xl absolute top-0 left-0 z-0"></div>
        <div className="pt-16 px-4 relative z-10 flex flex-col items-center">
            <div className="relative">
                <div className="w-28 h-28 rounded-full p-1 bg-white shadow-xl">
                    <img src={userData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full border-4 border-white shadow-sm" onClick={() => setView('EDIT')}>
                    <Camera size={14} />
                </button>
            </div>
            <div className="mt-3 text-center">
                <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
                <p className="text-gray-500 text-sm font-medium">{userData.course}</p>
                <div className="flex items-center justify-center gap-2 mt-2" onClick={handleCopyID}>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide border border-blue-100">
                        {userData.enrollmentNo}
                    </span>
                    <Copy size={14} className="text-gray-400" />
                </div>
            </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        
        {/* STATS ROW */}
        <div className="grid grid-cols-3 gap-3">
             <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <div className="w-10 h-10 mb-2 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <CheckCircle size={20} />
                </div>
                <span className="text-lg font-bold text-gray-800">{userData.stats.attendance}%</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Attendance</span>
             </div>
             <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <div className="w-10 h-10 mb-2 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                    <GraduationCap size={20} />
                </div>
                <span className="text-lg font-bold text-gray-800">{userData.stats.cgpa}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">CGPA</span>
             </div>
             <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <div className="w-10 h-10 mb-2 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Award size={20} />
                </div>
                <span className="text-lg font-bold text-gray-800">#{userData.badges.length}</span>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Badges</span>
             </div>
        </div>

        {/* MENU LIST */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <MenuItem icon={LayoutGrid} label="Academic History" subLabel="Marks, Backlogs" onClick={() => setView('ACADEMICS')} color="text-blue-500" />
             <MenuItem icon={CreditCard} label="Digital ID Card" subLabel="View Verification Card" onClick={() => setView('ID_CARD')} color="text-indigo-500" />
             <MenuItem icon={Settings} label="App Settings" subLabel="Dark Mode, Notifications" onClick={() => setView('SETTINGS')} color="text-gray-500" />
             <MenuItem icon={HelpCircle} label="Help & Support" subLabel="Raise a ticket" onClick={() => setView('HELP')} color="text-green-500" />
        </div>

        {/* LOGOUT BUTTON */}
        <button className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <LogOut size={20} /> Sign Out
        </button>

        <div className="text-center pt-4">
            <p className="text-[10px] text-gray-300">USG Version 2.0.1 • Server: Serv00</p>
        </div>
      </div>
    </motion.div>
  );

  // ==========================
  // VIEW: EDIT PROFILE
  // ==========================
  const renderEditProfile = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="px-5 pt-6 pb-24">
       {renderHeader("Edit Profile")}
       
       <form onSubmit={handleUpdateProfile} className="space-y-5">
          <div className="flex justify-center mb-6">
              <div className="relative">
                  <img src={userData.avatar} className="w-24 h-24 rounded-full opacity-70" alt="Edit" />
                  <div className="absolute inset-0 flex items-center justify-center">
                      <Camera size={24} className="text-white drop-shadow-md" />
                  </div>
              </div>
          </div>

          <InputField label="Full Name" value={userData.name} icon={User} />
          <InputField label="Phone Number" value={userData.phone} icon={Phone} />
          <InputField label="Email Address" value={userData.email} icon={Mail} />
          
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex gap-3 items-start">
             <AlertCircle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
             <p className="text-xs text-yellow-700">Course and Enrollment ID cannot be changed. Contact Admin for corrections.</p>
          </div>

          <InputField label="Course" value={userData.course} icon={BookOpen} disabled />
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 mt-4 active:scale-95 transition-transform">
             Save Changes
          </button>
       </form>
    </motion.div>
  );

  // ==========================
  // VIEW: DIGITAL ID
  // ==========================
  const renderDigitalID = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="px-5 pt-6 pb-24">
        {renderHeader("Digital ID")}
        
        <p className="text-sm text-gray-500 mb-2">Tap the card to flip it.</p>
        <DigitalIDCard user={userData} />

        <div className="grid grid-cols-2 gap-4 mt-8">
            <button className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50">
                <Download size={24} className="text-blue-500" />
                <span className="text-xs font-bold text-gray-600">Download PDF</span>
            </button>
            <button className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50">
                <Share2 size={24} className="text-purple-500" />
                <span className="text-xs font-bold text-gray-600">Share ID</span>
            </button>
        </div>

        <div className="mt-8 bg-blue-50 p-5 rounded-2xl">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><Shield size={16}/> Verification Status</h3>
            <p className="text-xs text-blue-600 leading-relaxed">
                This digital ID is cryptographically signed by USG India server. 
                Use this for library access and exam hall entry.
            </p>
        </div>
    </motion.div>
  );

  // ==========================
  // VIEW: SETTINGS
  // ==========================
  const renderSettings = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="px-5 pt-6 pb-24">
        {renderHeader("Settings")}
        
        <div className="space-y-6">
            <Section title="Preferences">
                <SettingItem icon={Moon} label="Dark Mode" type="toggle" />
                <SettingItem icon={Bell} label="Exam Notifications" type="toggle" defaultChecked />
                <SettingItem icon={FileText} label="Result Alert (SMS)" type="toggle" />
            </Section>

            <Section title="Security">
                <SettingItem icon={Lock} label="Change Password" type="link" />
                <SettingItem icon={Shield} label="Privacy Policy" type="link" />
            </Section>

            <Section title="Data">
                <SettingItem icon={RefreshCw} label="Clear Cache" type="button" onClick={() => {
                    setRefreshKey(prev => prev + 1);
                    setToast({msg: "Cache Cleared & Reloading...", type: "success"});
                }} />
            </Section>
        </div>
    </motion.div>
  );

   // ==========================
  // VIEW: ACADEMICS
  // ==========================
  const renderAcademics = () => (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="px-5 pt-6 pb-24">
        {renderHeader("Academic History")}

        {/* ATTENDANCE CHART */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-lg text-gray-800">Attendance</h3>
                <p className="text-xs text-gray-400 mb-4">Current Semester</p>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">Safe</span>
                </div>
            </div>
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="#3b82f6" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * userData.stats.attendance) / 100} strokeLinecap="round" />
                </svg>
                <span className="absolute text-xl font-bold text-gray-800">{userData.stats.attendance}%</span>
            </div>
        </div>

        {/* SEMESTER LIST */}
        <h3 className="font-bold text-gray-700 mb-3 ml-1">Semester Results</h3>
        <div className="space-y-3">
            {[1, 2].map(sem => (
                <div key={sem} className="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center font-bold">
                            {sem}
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Semester {sem}</h4>
                            <p className="text-xs text-gray-400">Passed • Dec 202{3+sem}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-green-600">8.{sem + 2} SGPA</span>
                        <button className="text-[10px] text-blue-500 font-bold underline mt-1">View Marksheet</button>
                    </div>
                </div>
            ))}
            {/* CURRENT SEM */}
            <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex justify-between items-center opacity-70">
                 <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center font-bold">3</div>
                    <div>
                        <h4 className="font-bold text-sm">Semester 3</h4>
                        <p className="text-xs text-gray-400">In Progress</p>
                    </div>
                 </div>
                 <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">PENDING</span>
            </div>
        </div>
    </motion.div>
  );

  // --- MAIN RENDER LOGIC ---
  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        
        {view === 'OVERVIEW' && renderOverview()}
        {view === 'EDIT' && renderEditProfile()}
        {view === 'ID_CARD' && renderDigitalID()}
        {view === 'SETTINGS' && renderSettings()}
        {view === 'ACADEMICS' && renderAcademics()}
        {view === 'HELP' && (
             <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="px-5 pt-6 pb-24">
                {renderHeader("Help Center")}
                <div className="text-center mt-20 opacity-50">
                    <HelpCircle size={48} className="mx-auto mb-4"/>
                    <p>Coming Soon...</p>
                </div>
             </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// SUB-COMPONENTS (Reusables)
// ==========================================

const MenuItem = ({ icon: Icon, label, subLabel, onClick, color }) => (
  <motion.button 
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full bg-opacity-10 flex items-center justify-center ${color.replace('text', 'bg')}`}>
        <Icon size={20} className={color} />
      </div>
      <div className="text-left">
        <h4 className="font-semibold text-gray-800 text-sm">{label}</h4>
        <p className="text-xs text-gray-400">{subLabel}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-gray-300" />
  </motion.button>
);

const InputField = ({ label, value, icon: Icon, disabled }) => (
  <div className="relative">
     <label className="text-xs font-bold text-gray-500 ml-1 mb-1 block uppercase">{label}</label>
     <div className="relative">
         <div className="absolute left-4 top-3.5 text-gray-400">
             <Icon size={18} />
         </div>
         <input 
            type="text" 
            defaultValue={value} 
            disabled={disabled}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border ${disabled ? 'bg-gray-100 border-gray-200 text-gray-500' : 'bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'} outline-none font-medium transition-all`}
         />
     </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">{title}</h3>
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {children}
    </div>
  </div>
);

const SettingItem = ({ icon: Icon, label, type, defaultChecked, onClick }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-50 last:border-none" onClick={type === 'button' || type === 'link' ? onClick : undefined}>
     <div className="flex items-center gap-3">
        <Icon size={18} className="text-gray-500" />
        <span className="font-medium text-sm text-gray-700">{label}</span>
     </div>
     {type === 'toggle' && (
         <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
         </label>
     )}
     {type === 'link' && <ChevronRight size={16} className="text-gray-300" />}
  </div>
);

export default Profile;
