import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Camera, 
  Moon, Sun, Check, X, Loader2, Shield, Fingerprint, 
  LogOut, ChevronRight, GraduationCap, Building, Trash2, AlertCircle, CheckCircle 
} from 'lucide-react';

// --- IMPORTS ---
import { getSecureHeaders } from '../../utils/security';
import { API_ENDPOINTS } from '../../config/apiConfig';

// ==========================================
// 🔔 1. STYLISH CUSTOM TOAST (Bottom-Right)
// ==========================================
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // 5 Seconds Auto Hide
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`fixed bottom-5 right-5 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 min-w-[280px]
      ${type === 'success' ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'}`}
    >
      {type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider">{type === 'success' ? 'Success' : 'Error'}</h4>
        <p className="text-xs font-medium opacity-90">{message}</p>
      </div>
      <button onClick={onClose} className="ml-auto p-1 hover:bg-white/20 rounded-full">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// ==========================================
// 📝 2. SMART PROFILE FIELD (Editable Logic)
// ==========================================
const ProfileField = ({ icon: Icon, label, value, fieldKey, isOfficial, onSave, type = "text" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [loading, setLoading] = useState(false);

  // Sync value when parent updates
  useEffect(() => { setTempValue(value); }, [value]);

  // 🔥 LOGIC: Locked tabhi hoga agar Official hai AUR Value bhari hui hai
  const hasValue = value && value !== "Not Set" && value.trim() !== "";
  const isLocked = isOfficial && hasValue;

  const handleSave = async () => {
    // Agar value same hai ya empty hai (official ke case me) to save mat karo
    if (tempValue === value) { setIsEditing(false); return; }
    
    setLoading(true);
    const success = await onSave(fieldKey, tempValue); // Parent function call
    setLoading(false);
    
    if (success) setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between group transition-all hover:shadow-md mb-3">
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        {/* Icon Box */}
        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${isLocked ? 'bg-gray-100 dark:bg-slate-700 text-gray-400' : 'bg-blue-50 dark:bg-slate-700/50 text-blue-600 dark:text-blue-400'}`}>
          <Icon size={18} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
            {label}
            {isLocked && <Shield size={10} className="text-green-500" />}
          </p>
          
          {isEditing ? (
            <input 
              type={type} 
              value={tempValue} 
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900 rounded-lg px-2 py-1 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoFocus
              placeholder={`Enter ${label}`}
            />
          ) : (
            <p className={`text-sm font-semibold truncate ${!hasValue ? 'text-red-400 italic' : 'text-gray-800 dark:text-white'}`}>
              {hasValue ? value : "Not Set (Tap to fill)"}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="ml-3 shrink-0">
        {isLocked ? (
           <Shield size={16} className="text-gray-300 dark:text-slate-600" />
        ) : isEditing ? (
          <div className="flex gap-2">
            <button onClick={() => { setTempValue(value); setIsEditing(false); }} className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg"><X size={16}/></button>
            <button onClick={handleSave} disabled={loading} className="p-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg flex items-center">
                {loading ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>}
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="p-2 bg-gray-50 dark:bg-slate-700 text-gray-400 hover:text-blue-600 rounded-xl transition-colors">
            <Edit3 size={16}/>
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 🚀 3. MAIN COMPONENT
// ==========================================
const Profile = () => {
  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }
  const fileInputRef = useRef(null);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState({});

  // --- 1. INITIAL LOAD ---
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('usg_user') || '{}');
    if (storedUser) {
        // Data Normalization
        setUser({
            ...storedUser,
            // Use "Not Set" only if genuinely missing
            university: storedUser.universityName || storedUser.university || "",
            college: storedUser.collegeName || storedUser.college || "",
            course: storedUser.courseName || storedUser.course || "",
            enrollmentNo: storedUser.tg_id || "", 
            
            mobile: storedUser.mobile || "",
            email: storedUser.email || "",
            
            bio: storedUser.bio || "Student at GNIKNAP",
            address: storedUser.address || "India",
            dob: storedUser.dob || "2000-01-01"
        });
    }
    setLoading(false);
  }, []);

  // --- 2. DARK MODE SYNC ---
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

  // --- HELPERS ---
  const showToast = (msg, type = 'success') => {
      setToast({ message: msg, type });
      if(window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
      }
  };

  // --- API ACTIONS ---

  // 1. UPDATE DETAILS
  const handleUpdateDetail = async (field, value) => {
    if(!value.trim()) {
        showToast("Field cannot be empty", "error");
        return false;
    }

    const token = localStorage.getItem('usg_token');
    const userId = user.tg_id; 

    try {
        const response = await fetch(API_ENDPOINTS.UPDATE_DETAIL, {
            method: 'POST',
            headers: {
                ...getSecureHeaders(),
                'Authorization': `Bearer ${token}`,
                'X-User-ID': userId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ field, value })
        });

        const data = await response.json();

        if (response.ok && data.STATUS_CODE === 200) {
            // Update State & Storage
            const updatedUser = { ...user, [field]: value };
            setUser(updatedUser);
            localStorage.setItem('usg_user', JSON.stringify(updatedUser));
            
            showToast(`${field.toUpperCase()} Updated!`, 'success');
            return true;
        } else {
            showToast(data.MESSAGE || "Update Failed", 'error');
            return false;
        }
    } catch (error) {
        showToast("Network Error", 'error');
        return false;
    }
  };

  // 2. UPDATE PHOTO
  const handlePhotoUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoLoading(true);
    const formData = new FormData();
    formData.append('photo', file);
    const token = localStorage.getItem('usg_token');

    try {
        const response = await fetch(API_ENDPOINTS.UPDATE_PHOTO, {
            method: 'POST',
            headers: { ...getSecureHeaders(), 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const data = await response.json();

        if (response.ok && data.STATUS_CODE === 200) {
            const newUser = { ...user, avatar: data.RESPONSE.photo_url };
            setUser(newUser);
            localStorage.setItem('usg_user', JSON.stringify(newUser));
            showToast("Photo Updated Successfully", 'success');
        } else {
            showToast("Upload Failed", 'error');
        }
    } catch (error) {
        showToast("Network Upload Error", 'error');
    } finally {
        setPhotoLoading(false);
    }
  };

  // 3. DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ DANGER ZONE\n\nAre you sure you want to delete your account? This cannot be undone.")) {
        return;
    }

    const token = localStorage.getItem('usg_token');
    const userId = user.tg_id;
    
    // Using Delete API (Ensure endpoint exists in config)
    const DELETE_API = `${API_ENDPOINTS.CHECK_USER.replace('/check', '/delete')}`; 

    try {
        const response = await fetch(DELETE_API, {
            method: 'DELETE',
            headers: {
                ...getSecureHeaders(),
                'Authorization': `Bearer ${token}`,
                'X-User-ID': userId
            }
        });

        const data = await response.json();

        if (response.ok && data.STATUS_CODE === 200) {
            localStorage.clear();
            alert("Account Deleted. Goodbye!");
            window.location.reload();
        } else {
            showToast(data.MESSAGE || "Delete Failed", "error");
        }
    } catch (error) {
        showToast("Connection Error", "error");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Sure you want to logout?")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white flex flex-col items-center"><Loader2 className="animate-spin mb-2"/>Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-24 relative overflow-hidden">
      
      {/* TOAST NOTIFICATION AREA */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* HEADER */}
      <div className="relative bg-gradient-to-b from-blue-600 to-indigo-700 pb-12 pt-8 rounded-b-[2rem] shadow-lg">
         <div className="px-6 flex justify-between items-start">
             <h1 className="text-xl font-bold text-white tracking-wide">My Profile</h1>
             <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all active:scale-90">
                 {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
         </div>

         {/* Avatar Section */}
         <div className="flex flex-col items-center mt-4">
             <div className="relative group">
                 <div className="w-24 h-24 rounded-full p-1 bg-white/20 backdrop-blur-sm shadow-xl">
                     <img 
                        src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        alt="User" 
                        className={`w-full h-full rounded-full object-cover bg-gray-200 ${photoLoading ? 'opacity-50' : ''}`} 
                     />
                 </div>
                 <button onClick={() => fileInputRef.current.click()} disabled={photoLoading} className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full border-2 border-indigo-700 hover:scale-110 active:scale-95 transition-all">
                     {photoLoading ? <Loader2 size={14} className="animate-spin"/> : <Camera size={14} />}
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handlePhotoUpdate} className="hidden" accept="image/*" />
             </div>
             <h2 className="text-xl font-bold text-white mt-3">{user.name}</h2>
             <p className="text-blue-100 text-sm font-mono tracking-wide">{user.enrollmentNo || "ID Not Generated"}</p>
         </div>
      </div>

      {/* DETAILS LIST */}
      <div className="px-5 -mt-6 relative z-10 space-y-2">
         
         {/* 1. PERSONAL DETAILS (Always Editable) */}
         <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2 ml-2">Personal</h3>
            <ProfileField icon={User} label="Full Name" value={user.name} fieldKey="name" isOfficial={false} onSave={handleUpdateDetail} />
            <ProfileField icon={Edit3} label="Bio / Status" value={user.bio} fieldKey="bio" isOfficial={false} onSave={handleUpdateDetail} />
            <ProfileField icon={MapPin} label="Address" value={user.address} fieldKey="address" isOfficial={false} onSave={handleUpdateDetail} />
            <ProfileField icon={Calendar} label="Date of Birth" value={user.dob} fieldKey="dob" type="date" isOfficial={false} onSave={handleUpdateDetail} />
         </div>

         {/* 2. OFFICIAL DETAILS (Smart Lock: Edit if Empty) */}
         <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2 ml-2 flex items-center gap-2">
                Official <Shield size={12} className="text-blue-500"/>
            </h3>
            
            <ProfileField icon={Phone} label="Mobile" value={user.mobile} fieldKey="mobile" isOfficial={true} onSave={handleUpdateDetail} type="tel"/>
            <ProfileField icon={Mail} label="Email" value={user.email} fieldKey="email" isOfficial={true} onSave={handleUpdateDetail} type="email"/>
            
            {/* Note: In production, Uni/College selectors require dropdowns, keeping text for simplicity or user correction */}
            <ProfileField icon={Building} label="University" value={user.university} fieldKey="universityName" isOfficial={true} onSave={handleUpdateDetail} />
            <ProfileField icon={GraduationCap} label="College" value={user.college} fieldKey="collegeName" isOfficial={true} onSave={handleUpdateDetail} />
            <ProfileField icon={Fingerprint} label="Course" value={user.course} fieldKey="courseName" isOfficial={true} onSave={handleUpdateDetail} />
         </div>

         {/* ACTION BUTTONS */}
         <div className="grid grid-cols-2 gap-3 mt-4">
             <button onClick={handleLogout} className="py-4 rounded-2xl bg-white dark:bg-slate-800 text-gray-500 font-bold flex items-center justify-center gap-2 shadow-sm border border-gray-100 dark:border-slate-700 active:scale-95 transition-transform">
                 <LogOut size={18} /> Logout
             </button>
             <button onClick={handleDeleteAccount} className="py-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500 font-bold flex items-center justify-center gap-2 shadow-sm border border-red-100 dark:border-red-900/30 active:scale-95 transition-transform">
                 <Trash2 size={18} /> Delete
             </button>
         </div>
         
         <p className="text-center text-[10px] text-gray-400 py-6 opacity-60">
             GNIKNAP Student Portal • v3.0 Secured
         </p>
      </div>

    </div>
  );
};

export default Profile;
