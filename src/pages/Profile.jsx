import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Camera, 
  Moon, Sun, Check, X, Loader2, Shield, Fingerprint, 
  LogOut, ChevronRight, GraduationCap, Building, AlertCircle 
} from 'lucide-react';

// --- CONFIGURATION ---
import { API_BASE_URL } from '../config/apiConfig'; // Ensure this exists
import { getSecureHeaders } from '../utils/security'; // Security utils

// API Endpoints for this page
const API_UPDATE_DETAIL = `${API_BASE_URL}/api/user/update/detail`;
const API_UPDATE_PHOTO = `${API_BASE_URL}/api/profile/update-photo`;

// ==========================================
// 🧩 REUSABLE COMPONENT: EDITABLE FIELD
// ==========================================
const ProfileField = ({ 
  icon: Icon, 
  label, 
  value, 
  fieldKey, 
  locked, 
  onSave, 
  type = "text" 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [loading, setLoading] = useState(false);

  // Sync value if parent updates
  useEffect(() => { setTempValue(value); }, [value]);

  const handleSave = async () => {
    if (tempValue === value) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    const success = await onSave(fieldKey, tempValue);
    setLoading(false);
    if (success) setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center justify-between group transition-all hover:shadow-md">
      <div className="flex items-center gap-4 flex-1">
        {/* Icon Box */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${locked ? 'bg-gray-100 dark:bg-slate-700 text-gray-400' : 'bg-blue-50 dark:bg-slate-700/50 text-blue-600 dark:text-blue-400'}`}>
          <Icon size={18} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
          
          {isEditing ? (
            <input 
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900 rounded-lg px-2 py-1 text-sm font-semibold text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              autoFocus
            />
          ) : (
            <p className={`text-sm font-semibold ${locked ? 'text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-white'}`}>
              {value || <span className="text-gray-300 italic">Not Set</span>}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="ml-3">
        {locked ? (
          <Shield size={16} className="text-gray-300 dark:text-slate-600" />
        ) : isEditing ? (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
              <X size={16} />
            </button>
            <button onClick={handleSave} disabled={loading} className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center">
              {loading ? <Loader2 size={16} className="animate-spin"/> : <Check size={16} />}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)} 
            className="p-2 bg-gray-50 dark:bg-slate-700 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 transition-colors rounded-xl opacity-0 group-hover:opacity-100"
          >
            <Edit3 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 🚀 MAIN COMPONENT: PROFILE
// ==========================================
const Profile = () => {
  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const fileInputRef = useRef(null);
  
  // User Data State
  const [user, setUser] = useState({
    name: '',
    bio: '',
    address: '',
    dob: '',
    email: '',
    mobile: '',
    university: '',
    college: '',
    course: '',
    enrollmentNo: '',
    avatar: ''
  });

  // --- INITIAL LOAD ---
  useEffect(() => {
    // LocalStorage se fast load karo, fir API se refresh kar sakte ho
    const storedUser = JSON.parse(localStorage.getItem('usg_user') || '{}');
    if (storedUser) {
        // Ensure default structure
        setUser({
            ...storedUser,
            bio: storedUser.bio || "Student at USG",
            address: storedUser.address || "India",
            dob: storedUser.dob || "2000-01-01"
        });
    }
    setLoading(false);
  }, []);

  // --- THEME HANDLER ---
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

  // --- ACTIONS ---

  // 1. Update Specific Detail
  const handleUpdateDetail = async (field, value) => {
    const token = localStorage.getItem('usg_token');
    
    try {
        const response = await fetch(API_UPDATE_DETAIL, {
            method: 'POST',
            headers: {
                ...getSecureHeaders(),
                'Authorization': `Bearer ${token}`, // Token Auth
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ field, value })
        });

        const data = await response.json();

        if (response.ok && data.STATUS_CODE === 200) {
            // Update Local State & Storage
            const updatedUser = { ...user, [field]: value };
            setUser(updatedUser);
            localStorage.setItem('usg_user', JSON.stringify(updatedUser));
            
            // Haptic Success
            window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
            return true;
        } else {
            alert("Update Failed: " + (data.MESSAGE || "Server Error"));
            return false;
        }
    } catch (error) {
        console.error("API Error:", error);
        alert("Network Error. Check connection.");
        return false;
    }
  };

  // 2. Update Photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoLoading(true);
    const formData = new FormData();
    formData.append('photo', file);

    const token = localStorage.getItem('usg_token');

    try {
        const response = await fetch(API_UPDATE_PHOTO, {
            method: 'POST',
            headers: {
                ...getSecureHeaders(), // Standard Headers
                'Authorization': `Bearer ${token}` 
                // Note: Content-Type header mat lagana, FormData apne aap boundary set karta hai
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.STATUS_CODE === 200) {
            const newPhotoUrl = data.RESPONSE.photo_url;
            
            // Update State
            const updatedUser = { ...user, avatar: newPhotoUrl };
            setUser(updatedUser);
            localStorage.setItem('usg_user', JSON.stringify(updatedUser));
            
            window.Telegram?.WebApp?.HapticFeedback.notificationOccurred('success');
        } else {
            alert("Photo Upload Failed");
        }
    } catch (error) {
        console.error("Upload Error:", error);
    } finally {
        setPhotoLoading(false);
    }
  };

  // 3. Logout
  const handleLogout = () => {
    if (window.confirm("Logout from this device?")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/> Loading...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24 font-sans transition-colors duration-300"
    >
      
      {/* ================= HEADER ================= */}
      <div className="relative bg-gradient-to-b from-blue-600 to-indigo-700 pb-16 pt-8 rounded-b-[2.5rem] shadow-xl overflow-hidden">
         {/* Decoration */}
         <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>

         <div className="relative px-6 flex justify-between items-start">
             <h1 className="text-xl font-bold text-white tracking-wide">My Profile</h1>
             
             {/* Theme Toggle */}
             <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all active:scale-90"
             >
                 {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
         </div>

         {/* Avatar Section */}
         <div className="flex flex-col items-center mt-6">
             <div className="relative group">
                 <div className="w-28 h-28 rounded-full p-1 bg-white/20 backdrop-blur-sm shadow-2xl">
                     <img 
                        src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        alt="User" 
                        className={`w-full h-full rounded-full object-cover bg-gray-200 ${photoLoading ? 'opacity-50' : ''}`} 
                     />
                 </div>
                 
                 {/* Photo Upload Trigger */}
                 <button 
                    onClick={() => fileInputRef.current.click()}
                    disabled={photoLoading}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2.5 rounded-full shadow-lg border-4 border-indigo-700 hover:scale-110 active:scale-95 transition-all"
                 >
                     {photoLoading ? <Loader2 size={16} className="animate-spin"/> : <Camera size={16} />}
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
             </div>
             
             <h2 className="text-2xl font-bold text-white mt-4">{user.name}</h2>
             <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded uppercase tracking-wider backdrop-blur-md">Student</span>
                <span className="text-blue-200 text-sm">•</span>
                <span className="text-blue-100 text-sm font-medium">{user.enrollmentNo}</span>
             </div>
         </div>
      </div>

      {/* ================= EDITABLE SECTIONS ================= */}
      <div className="px-5 -mt-8 relative z-10 space-y-6">
         
         {/* SECTION 1: PERSONAL INFO */}
         <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">Personal Information</h3>
            <div className="space-y-3">
                <ProfileField 
                    icon={User} label="Full Name" value={user.name} 
                    fieldKey="name" onSave={handleUpdateDetail} 
                />
                <ProfileField 
                    icon={Edit3} label="Bio / Status" value={user.bio} 
                    fieldKey="bio" onSave={handleUpdateDetail} 
                />
                <ProfileField 
                    icon={MapPin} label="Address" value={user.address} 
                    fieldKey="address" onSave={handleUpdateDetail} 
                />
                <ProfileField 
                    icon={Calendar} label="Date of Birth" value={user.dob} 
                    fieldKey="dob" type="date" onSave={handleUpdateDetail} 
                />
            </div>
         </div>

         {/* SECTION 2: OFFICIAL INFO (LOCKED) */}
         <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2 flex items-center gap-2">
                Official Records <Shield size={12} className="text-green-500"/>
            </h3>
            <div className="space-y-3 opacity-90">
                <ProfileField icon={Phone} label="Mobile Number" value={user.mobile} locked={true} />
                <ProfileField icon={Mail} label="Email Address" value={user.email} locked={true} />
                <ProfileField icon={Building} label="University" value={user.university} locked={true} />
                <ProfileField icon={GraduationCap} label="College" value={user.college} locked={true} />
                <ProfileField icon={Fingerprint} label="Enrollment ID" value={user.enrollmentNo} locked={true} />
            </div>
            
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-xl flex gap-3 items-start">
                <AlertCircle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-700 dark:text-yellow-500 leading-relaxed">
                    Official records like Mobile, Email, and College details are locked by Administration. 
                    Contact Help Center for corrections.
                </p>
            </div>
         </div>

         {/* LOGOUT */}
         <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl bg-white dark:bg-slate-800 text-red-500 font-bold flex items-center justify-center gap-2 shadow-sm border border-gray-100 dark:border-slate-700 active:scale-95 transition-transform"
         >
             <LogOut size={20} /> Logout Account
         </button>

         <div className="h-4"></div>
      </div>

    </motion.div>
  );
};

export default Profile;
