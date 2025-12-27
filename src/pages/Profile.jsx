import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Settings, 
  CreditCard, Shield, LogOut, ChevronRight, Award, 
  BookOpen, FileText, HelpCircle, Moon, Sun, Bell, Lock, 
  Camera, CheckCircle, XCircle, RefreshCw, Download,
  Share2, Copy, AlertCircle, GraduationCap, LayoutGrid,
  Save, X, Smartphone, Fingerprint
} from 'lucide-react';

// --- CONFIGURATION ---
const MOCK_API_DELAY = 1500;

// ==========================================
// 🎨 UTILITY COMPONENTS (FOR MODULARITY)
// ==========================================

// 1. TOAST NOTIFICATION
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      exit={{ y: 50, opacity: 0 }}
      className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 backdrop-blur-md border border-white/10 ${
        type === 'success' ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'
      }`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-bold tracking-wide">{message}</span>
    </motion.div>
  );
};

// 2. TOGGLE SWITCH (DARK MODE)
const ToggleSwitch = ({ isOn, onToggle, icon: Icon }) => (
  <div onClick={onToggle} className={`cursor-pointer w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-700'}`}>
    <motion.div 
      layout 
      className="bg-white w-6 h-6 rounded-full shadow-md flex items-center justify-center text-xs"
    >
        {Icon && <Icon size={12} className={isOn ? 'text-blue-600' : 'text-gray-400'} />}
    </motion.div>
  </div>
);

// 3. EDITABLE INPUT FIELD (SMART)
const ProfileInput = ({ label, value, name, icon: Icon, isEditing, isLocked, onChange, type = "text" }) => {
  return (
    <div className="mb-4">
      <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 ml-1 block">
        {label} {isLocked && <span className="text-red-400 text-[9px] ml-1">(Read Only)</span>}
      </label>
      <div className={`relative group ${isLocked ? 'opacity-70' : ''}`}>
        <div className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors">
          <Icon size={18} />
        </div>
        <input 
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={!isEditing || isLocked}
          className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all font-medium text-sm
            ${!isEditing 
                ? 'bg-gray-50 dark:bg-slate-800 border-transparent text-gray-600 dark:text-gray-300' 
                : isLocked
                    ? 'bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-800 dark:text-white shadow-sm'
            }
          `}
        />
        {isLocked && isEditing && (
            <Lock size={14} className="absolute right-4 top-4 text-gray-400" />
        )}
      </div>
    </div>
  );
};

// ==========================================
// 🚀 MAIN COMPONENT: PROFILE
// ==========================================
const Profile = () => {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('PERSONAL'); // PERSONAL, ACADEMIC, ID_CARD, SETTINGS
  const [toast, setToast] = useState(null);
  
  // DARK MODE STATE
  const [darkMode, setDarkMode] = useState(() => {
      return localStorage.getItem('theme') === 'dark';
  });

  // USER DATA STATE
  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    university: '',
    college: '',
    course: '',
    enrollmentNo: '',
    dob: '',
    address: '',
    bio: '',
    avatar: '',
    stats: { attendance: 0, cgpa: 0, badges: 0 }
  });

  // --- EFFECTS ---

  // 1. Initial Load & Theme
  useEffect(() => {
    // Load User from LocalStorage or API
    const loadData = () => {
        const storedUser = JSON.parse(localStorage.getItem('usg_user') || '{}');
        
        // Mock Data merging if some fields are missing
        setUser({
            ...storedUser,
            address: storedUser.address || "Jaipur, Rajasthan",
            bio: storedUser.bio || "Student at RU | Tech Enthusiast",
            dob: storedUser.dob || "2003-08-15",
            university: storedUser.university || "Rajasthan University", // Locked
            college: storedUser.college || "Maharaja College",           // Locked
            course: storedUser.course || "B.Sc Mathematics",             // Locked
            enrollmentNo: storedUser.enrollmentNo || "2023/RU/15480",    // Locked
            stats: { attendance: 78, cgpa: 8.4, badges: 5 }
        });
        setLoading(false);
    };

    setTimeout(loadData, 800);
  }, []);

  // 2. Handle Dark Mode Class
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // --- HANDLERS ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const toggleDarkMode = () => {
    triggerHaptic();
    setDarkMode(!darkMode);
  };

  const triggerHaptic = (style = 'light') => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
    }
  };

  const handleSaveProfile = () => {
    triggerHaptic('medium');
    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
        setLoading(false);
        setIsEditing(false);
        localStorage.setItem('usg_user', JSON.stringify(user));
        setToast({ msg: "Profile Updated Successfully!", type: "success" });
    }, MOCK_API_DELAY);
  };

  const handleLogout = () => {
    triggerHaptic('heavy');
    if (window.confirm("Are you sure you want to logout?")) {
        localStorage.removeItem('usg_user');
        window.location.reload();
    }
  };

  // --- RENDER HELPERS ---

  if (loading && !user.name) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col items-center justify-center">
            <RefreshCw className="animate-spin text-blue-600 dark:text-blue-400 mb-4" size={32} />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold animate-pulse">Loading Profile...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-24">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ================= HEADER SECTION ================= */}
      <div className="relative pb-24">
        {/* Background Gradient */}
        <div className="absolute top-0 w-full h-48 bg-gradient-to-br from-blue-600 to-purple-700 rounded-b-[2.5rem] shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative pt-8 px-6 flex flex-col items-center z-10">
            {/* Header Top Row */}
            <div className="w-full flex justify-between items-center text-white mb-6">
                <h1 className="text-xl font-bold tracking-wide">My Profile</h1>
                <button onClick={toggleDarkMode} className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Avatar Circle */}
            <div className="relative group">
                <div className="w-32 h-32 rounded-full p-1 bg-white dark:bg-slate-800 shadow-2xl transition-transform duration-300">
                    <img 
                        src={user.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-slate-700"
                    />
                </div>
                {/* Camera Icon (Only visual) */}
                <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full border-4 border-white dark:border-slate-800 shadow-lg hover:scale-110 transition-transform">
                    <Camera size={16} />
                </button>
            </div>

            {/* Name & ID */}
            <div className="text-center mt-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center gap-2">
                    {user.name}
                    {isEditing && <Edit3 size={16} className="text-blue-500 animate-bounce" />}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                     <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{user.course}</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                     <span className="text-xs font-mono bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-100 dark:border-slate-700">
                        {user.enrollmentNo}
                     </span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center gap-4 mt-6 w-full max-w-sm">
                <StatCard label="Attendance" value={`${user.stats.attendance}%`} icon={CheckCircle} color="text-green-500" />
                <StatCard label="CGPA" value={user.stats.cgpa} icon={GraduationCap} color="text-purple-500" />
                <StatCard label="Rank" value="#12" icon={Award} color="text-orange-500" />
            </div>
        </div>
      </div>

      {/* ================= TABS NAVIGATION ================= */}
      <div className="px-4 mt-2 mb-6">
        <div className="bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex justify-between overflow-x-auto no-scrollbar">
            <TabButton label="Personal" isActive={activeTab === 'PERSONAL'} onClick={() => setActiveTab('PERSONAL')} />
            <TabButton label="Academics" isActive={activeTab === 'ACADEMIC'} onClick={() => setActiveTab('ACADEMIC')} />
            <TabButton label="ID Card" isActive={activeTab === 'ID_CARD'} onClick={() => setActiveTab('ID_CARD')} />
            <TabButton label="Settings" isActive={activeTab === 'SETTINGS'} onClick={() => setActiveTab('SETTINGS')} />
        </div>
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="px-5 min-h-[400px]">
        <AnimatePresence mode="wait">
            
            {/* --- TAB 1: PERSONAL DETAILS (EDITABLE) --- */}
            {activeTab === 'PERSONAL' && (
                <motion.div 
                    key="personal"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                >
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-700 dark:text-white">Personal Details</h3>
                        {!isEditing ? (
                            <button onClick={() => { setIsEditing(true); triggerHaptic(); }} className="text-sm font-bold text-blue-600 bg-blue-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-slate-700">
                                Edit Details
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-500"><X size={18}/></button>
                                <button onClick={handleSaveProfile} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/30">
                                    {loading ? <RefreshCw className="animate-spin" size={16}/> : <Save size={16}/>} Save
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-1">
                        {/* Editable Fields */}
                        <ProfileInput label="Full Name" name="name" value={user.name} icon={User} isEditing={isEditing} onChange={handleInputChange} />
                        <ProfileInput label="Bio / Status" name="bio" value={user.bio} icon={FileText} isEditing={isEditing} onChange={handleInputChange} />
                        <ProfileInput label="Home Address" name="address" value={user.address} icon={MapPin} isEditing={isEditing} onChange={handleInputChange} />
                        <ProfileInput label="Date of Birth" name="dob" value={user.dob} icon={Calendar} isEditing={isEditing} onChange={handleInputChange} type="date" />

                        <div className="my-6 border-t border-gray-100 dark:border-slate-700"></div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Official Records (Locked)</h4>

                        {/* Locked Fields */}
                        <ProfileInput label="Mobile Number" value={user.mobile || '+91 XXXXX XXXXX'} icon={Smartphone} isEditing={true} isLocked={true} />
                        <ProfileInput label="Email Address" value={user.email} icon={Mail} isEditing={true} isLocked={true} />
                        <ProfileInput label="University" value={user.university} icon={Shield} isEditing={true} isLocked={true} />
                        <ProfileInput label="College Name" value={user.college} icon={LayoutGrid} isEditing={true} isLocked={true} />
                        <ProfileInput label="Enrollment ID" value={user.enrollmentNo} icon={Fingerprint} isEditing={true} isLocked={true} />
                    </div>
                </motion.div>
            )}

            {/* --- TAB 2: ACADEMICS --- */}
            {activeTab === 'ACADEMIC' && (
                <motion.div 
                    key="academic"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                >
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Attendance</h3>
                            <p className="text-xs text-gray-400 mb-4">Overall Performance</p>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-lg">Safe Zone</span>
                        </div>
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-slate-700" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * user.stats.attendance) / 100} strokeLinecap="round" className="text-blue-500" />
                            </svg>
                            <span className="absolute text-xl font-bold text-gray-800 dark:text-white">{user.stats.attendance}%</span>
                        </div>
                    </div>

                    <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-3 ml-1">Previous Results</h3>
                    <div className="space-y-3">
                         {/* Mock Result Cards */}
                         <ResultCard sem="Sem 1" gpa="8.2" status="Passed" date="Dec 2023" />
                         <ResultCard sem="Sem 2" gpa="8.6" status="Passed" date="May 2024" />
                         <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 flex justify-between items-center opacity-70">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 text-gray-500 rounded-lg flex items-center justify-center font-bold">3</div>
                                <div><h4 className="font-bold text-sm text-gray-600 dark:text-gray-400">Semester 3</h4><p className="text-xs text-gray-400">Pending</p></div>
                            </div>
                         </div>
                    </div>
                </motion.div>
            )}

            {/* --- TAB 3: DIGITAL ID CARD --- */}
            {activeTab === 'ID_CARD' && (
                <motion.div 
                    key="idcard"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center"
                >
                    <div className="perspective-1000 w-full h-56 cursor-pointer group mb-8">
                        <div className="relative w-full h-full duration-700 preserve-3d group-hover:rotate-y-180">
                            
                            {/* FRONT */}
                            <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-5 text-white shadow-2xl border border-white/10 overflow-hidden">
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
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
                                        <div className="inline-block bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">ID: {user.enrollmentNo}</div>
                                    </div>
                                </div>
                            </div>

                            {/* BACK */}
                            <div className="absolute w-full h-full backface-hidden bg-slate-800 rounded-2xl p-5 text-white shadow-2xl border border-slate-600 rotate-y-180">
                                <h3 className="text-sm font-bold border-b border-gray-600 pb-2 mb-3 text-gray-400">Details</h3>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                                    <div><p className="text-gray-500">DOB</p><p>{user.dob}</p></div>
                                    <div><p className="text-gray-500">Phone</p><p>{user.mobile}</p></div>
                                    <div className="col-span-2"><p className="text-gray-500">Address</p><p className="truncate">{user.address}</p></div>
                                </div>
                                <div className="mt-4 pt-2 border-t border-gray-600 text-[9px] text-center text-gray-500">Digitally Verified by USG Server</div>
                            </div>

                        </div>
                    </div>
                    
                    <div className="flex gap-4 w-full">
                        <ActionButton icon={Download} label="Download PDF" color="blue" />
                        <ActionButton icon={Share2} label="Share ID" color="purple" />
                    </div>
                </motion.div>
            )}

            {/* --- TAB 4: SETTINGS --- */}
            {activeTab === 'SETTINGS' && (
                <motion.div 
                    key="settings"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    {/* App Appearance */}
                    <SettingSection title="Appearance">
                        <div className="flex justify-between items-center p-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400"><Moon size={18}/></div>
                                <div><h4 className="font-medium text-sm text-gray-800 dark:text-white">Dark Mode</h4><p className="text-[10px] text-gray-400">Reduce eye strain</p></div>
                            </div>
                            <ToggleSwitch isOn={darkMode} onToggle={toggleDarkMode} />
                        </div>
                    </SettingSection>

                    {/* Notifications */}
                    <SettingSection title="Notifications">
                         <SettingRow icon={Bell} label="Push Notifications" sub="Exam alerts & results" isToggle={true} defaultOn={true} />
                         <SettingRow icon={Mail} label="Email Digest" sub="Weekly summary" isToggle={true} defaultOn={false} />
                    </SettingSection>

                    {/* Account */}
                    <SettingSection title="Account Action">
                        <SettingRow icon={Lock} label="Change Password" />
                        <SettingRow icon={HelpCircle} label="Help & Support" />
                        <SettingRow icon={RefreshCw} label="Clear App Cache" onClick={() => { setToast({msg: "Cache Cleared", type: "success"}); triggerHaptic(); }} />
                    </SettingSection>

                    <button onClick={handleLogout} className="w-full py-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform border border-red-100 dark:border-red-900/30">
                        <LogOut size={20} /> Logout Safely
                    </button>

                    <p className="text-center text-[10px] text-gray-300 dark:text-slate-700 mt-4">
                        USG App v2.4.0 • Build 2025.10.25
                    </p>
                </motion.div>
            )}

        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// 🧩 SUB-COMPONENTS
// ==========================================

const TabButton = ({ label, isActive, onClick }) => (
    <button 
        onClick={() => { onClick(); if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.selectionChanged(); }}
        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
    >
        {label}
    </button>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg shadow-black/5 flex flex-col items-center w-24 border border-gray-100 dark:border-slate-700">
        <div className={`mb-1 p-1.5 rounded-full bg-opacity-10 ${color.replace('text', 'bg')}`}>
            <Icon size={16} className={color} />
        </div>
        <span className="text-sm font-extrabold text-gray-800 dark:text-white">{value}</span>
        <span className="text-[9px] font-bold text-gray-400 uppercase">{label}</span>
    </div>
);

const ResultCard = ({ sem, gpa, status, date }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
        <div className="flex gap-3 items-center">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center font-bold text-xs">{sem}</div>
            <div>
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">{status}</h4>
                <p className="text-xs text-gray-400">{date}</p>
            </div>
        </div>
        <div className="text-right">
            <span className="block font-bold text-green-600 dark:text-green-400">{gpa} SGPA</span>
            <button className="text-[10px] text-blue-500 font-bold underline mt-1">Download</button>
        </div>
    </div>
);

const ActionButton = ({ icon: Icon, label, color }) => (
    <button className="flex-1 flex flex-col items-center gap-2 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 active:scale-95 transition-transform">
        <Icon size={24} className={`text-${color}-500`} />
        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{label}</span>
    </button>
);

const SettingSection = ({ title, children }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="px-4 py-2 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-slate-700">
            {children}
        </div>
    </div>
);

const SettingRow = ({ icon: Icon, label, sub, isToggle, defaultOn, onClick }) => (
    <div onClick={onClick} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-500 dark:text-gray-300"><Icon size={18}/></div>
            <div>
                <h4 className="font-medium text-sm text-gray-800 dark:text-white">{label}</h4>
                {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
            </div>
        </div>
        {isToggle ? <ToggleSwitch isOn={defaultOn} /> : <ChevronRight size={16} className="text-gray-300"/>}
    </div>
);

export default Profile;
