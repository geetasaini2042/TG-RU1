import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Camera, 
  Moon, Sun, Loader2, LogOut, Building, GraduationCap, Fingerprint, AlertCircle 
} from 'lucide-react';

// Imports
import { getSecureHeaders } from '../../utils/security';
import ProfileField from './components/ProfileField';
import CustomAlert from '../../components/ui/CustomAlert';

const Profile = () => {
  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const fileInputRef = useRef(null);

  // Dark Mode State (LocalStorage se read karega)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  const [user, setUser] = useState({});

  // --- 1. INITIAL LOAD ---
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('usg_user') || '{}');
    if (storedUser) {
        setUser({
            ...storedUser,
            university: storedUser.universityName || storedUser.university || "Not Set",
            college: storedUser.collegeName || storedUser.college || "Not Set",
            course: storedUser.courseName || storedUser.course || "Not Set",
            enrollmentNo: storedUser.tg_id || "Pending",
            bio: storedUser.bio || "Student",
            address: storedUser.address || "India",
            dob: storedUser.dob || "2000-01-01"
        });
    }
    setLoading(false);
  }, []);

  // --- 2. DARK MODE LOGIC ---
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

  const triggerAlert = (msg, type = 'info') => {
      setAlert({ message: msg, type });
      if(window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred(type === 'error' ? 'error' : 'success');
      }
  };

  // Update Detail API
  const handleUpdateDetail = async (field, value) => {
    const token = localStorage.getItem('usg_token');
    const userId = user.tg_id; 
    const API_URL = `https://sainipankaj12.serv00.net/api/user/update/detail`; 

    try {
        const response = await fetch(API_URL, {
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
            const updatedUser = { ...user, [field]: value };
            setUser(updatedUser);
            localStorage.setItem('usg_user', JSON.stringify(updatedUser));
            triggerAlert("Updated Successfully", 'success');
            return true;
        } else {
            triggerAlert(data.MESSAGE || "Update Failed", 'error');
            return false;
        }
    } catch (error) {
        triggerAlert("Network Error", 'error');
        return false;
    }
  };

  // Update Photo API
  const handlePhotoUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoLoading(true);
    const formData = new FormData();
    formData.append('photo', file);
    const token = localStorage.getItem('usg_token');
    const API_URL = `https://sainipankaj12.serv00.net/api/profile/update-photo`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { ...getSecureHeaders(), 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const data = await response.json();

        if (response.ok && data.STATUS_CODE === 200) {
            const newUser = { ...user, avatar: data.RESPONSE.photo_url };
            setUser(newUser);
            localStorage.setItem('usg_user', JSON.stringify(newUser));
            triggerAlert("Photo Updated", 'success');
        } else {
            triggerAlert("Upload Failed", 'error');
        }
    } catch (error) {
        triggerAlert("Upload Error", 'error');
    } finally {
        setPhotoLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Logout?")) {
        localStorage.clear();
        window.location.reload();
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-24">
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* ================= HEADER (SIMPLE) ================= */}
      <div className="relative bg-gradient-to-b from-blue-600 to-indigo-700 pb-12 pt-8 rounded-b-[2rem] shadow-lg">
         
         <div className="px-6 flex justify-between items-start">
             <h1 className="text-xl font-bold text-white tracking-wide">My Profile</h1>
             
             {/* DARK MODE TOGGLE */}
             <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all active:scale-90"
             >
                 {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
         </div>

         {/* Avatar & Name */}
         <div className="flex flex-col items-center mt-4">
             <div className="relative group">
                 <div className="w-24 h-24 rounded-full p-1 bg-white/20 backdrop-blur-sm shadow-xl">
                     <img 
                        src={user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                        alt="User" 
                        className={`w-full h-full rounded-full object-cover bg-gray-200 ${photoLoading ? 'opacity-50' : ''}`} 
                     />
                 </div>
                 <button 
                    onClick={() => fileInputRef.current.click()}
                    disabled={photoLoading}
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full border-2 border-indigo-700 hover:scale-110 active:scale-95 transition-all"
                 >
                     {photoLoading ? <Loader2 size={14} className="animate-spin"/> : <Camera size={14} />}
                 </button>
                 <input type="file" ref={fileInputRef} onChange={handlePhotoUpdate} className="hidden" accept="image/*" />
             </div>
             
             <h2 className="text-xl font-bold text-white mt-3">{user.name}</h2>
             <p className="text-blue-100 text-sm">{user.enrollmentNo}</p>
         </div>
      </div>

      {/* ================= DETAILS LIST ================= */}
      <div className="px-5 -mt-6 relative z-10 space-y-2">
         
         {/* Editable Fields */}
         <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2 ml-2">Personal</h3>
            <ProfileField icon={User} label="Full Name" value={user.name} fieldKey="name" onSave={handleUpdateDetail} />
            <ProfileField icon={Edit3} label="Bio / Status" value={user.bio} fieldKey="bio" onSave={handleUpdateDetail} />
            <ProfileField icon={MapPin} label="Address" value={user.address} fieldKey="address" onSave={handleUpdateDetail} />
            <ProfileField icon={Calendar} label="Date of Birth" value={user.dob} fieldKey="dob" type="date" onSave={handleUpdateDetail} />
         </div>

         {/* Locked Fields */}
         <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2 ml-2">Academic (Locked)</h3>
            <ProfileField icon={Phone} label="Mobile" value={user.mobile} locked={true} />
            <ProfileField icon={Mail} label="Email" value={user.email} locked={true} />
            <ProfileField icon={Building} label="University" value={user.university} locked={true} />
            <ProfileField icon={GraduationCap} label="College" value={user.college} locked={true} />
            <ProfileField icon={Fingerprint} label="Course" value={user.course} locked={true} />
         </div>

         {/* Logout */}
         <button 
            onClick={handleLogout}
            className="w-full py-4 mt-4 rounded-2xl bg-white dark:bg-slate-800 text-red-500 font-bold flex items-center justify-center gap-2 shadow-sm border border-gray-100 dark:border-slate-700 active:scale-95 transition-transform hover:bg-red-50 dark:hover:bg-red-900/10"
         >
             <LogOut size={20} /> Logout
         </button>
         
         <p className="text-center text-[10px] text-gray-400 py-4">USG Student App v2.5</p>
      </div>

    </div>
  );
};

export default Profile;
