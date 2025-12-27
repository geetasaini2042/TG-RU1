import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Building, GraduationCap, ChevronDown, CheckCircle, 
  Loader2, AlertCircle, BookOpen, Smartphone 
} from 'lucide-react';
import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';

const SignupForm = ({ onSignupComplete }) => {
  const tgUser = getTelegramUser();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  
  // 🔥 Error State
  const [error, setError] = useState(null);

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    tg_id: tgUser?.id || '',
    username: tgUser?.username || '',
    name: tgUser?.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : '',
    photo: tgUser?.photo_url || null,
    universityId: '',
    universityName: '',
    collegeCode: '',
    collegeName: '',
    courseId: '',
    courseName: '',
    mobile: '',
    email: ''
  });

  // --- Load Data Effects (Same as before) ---
  useEffect(() => {
    fetch(STATIC_FILES.UNIVERSITIES).then(res => res.json()).then(setUniversities).catch(console.error);
  }, []);

  useEffect(() => {
    if (!formData.universityId) return;
    setDataLoading(true);
    fetch(API_ENDPOINTS.GET_COLLEGES(formData.universityId), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        setColleges(data.STATUS_CODE === 200 ? data.RESPONSE : []);
        setDataLoading(false);
    });
  }, [formData.universityId]);

  useEffect(() => {
    if (!formData.universityId) return;
    fetch(API_ENDPOINTS.GET_COURSES(formData.universityId), { headers: getSecureHeaders() })
    .then(res => res.json())
    .then(data => {
        if(data.STATUS_CODE === 200) setCourses(data.RESPONSE);
    });
  }, [formData.universityId]);

  // --- Handlers ---
  const handleUniChange = (e) => {
      const id = e.target.value;
      const uni = universities.find(u => u.id.toString() === id);
      setFormData({ ...formData, universityId: id, universityName: uni?.name || '' });
  };

  const handleCollegeChange = (e) => {
      const code = e.target.value;
      const col = colleges.find(c => c.collegeCode === code);
      setFormData({ ...formData, collegeCode: code, collegeName: col?.collegeName || '' });
  };

  const handleCourseChange = (e) => {
      const id = e.target.value;
      const course = courses.find(c => c.courseId.toString() === id);
      setFormData({ ...formData, courseId: id, courseName: course?.courseData.courseShortName || '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on typing
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
        const response = await fetch(API_ENDPOINTS.REGISTER_USER, {
            method: 'POST',
            headers: getSecureHeaders(),
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.STATUS_CODE === 200) {
            onSignupComplete({
                user: data.RESPONSE.user_data,
                token: data.RESPONSE.token
            });
        } else {
            // 🔥 SERVER ERROR (Like: Email/Mobile already exists)
            setError(data.MESSAGE || "Registration Failed");
            
            // Haptic Error
            if(window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }
        }
    } catch (err) {
        setError("Network Connection Failed");
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      <div className="mb-6 text-center">
         <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
         <p className="text-gray-400 text-xs mt-1">Join USG Community</p>
      </div>

      {/* 🔥 ERROR MESSAGE BOX (LAL AKASHAR) */}
      {error && (
        <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
        >
            <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-red-600 leading-relaxed">
                {error}
            </p>
        </motion.div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* Name */}
        <div className="relative">
            <User size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-semibold" />
        </div>

        {/* Dropdowns */}
        <div className="relative">
            <Building size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <select name="universityId" onChange={handleUniChange} className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium text-gray-700">
                <option value="">Select University</option>
                {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-4 text-gray-400 pointer-events-none"/>
        </div>

        <div className="relative">
            <GraduationCap size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <select name="collegeCode" onChange={handleCollegeChange} disabled={!formData.universityId} className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium text-gray-700 disabled:opacity-50">
                <option value="">{dataLoading ? "Loading..." : "Select College"}</option>
                {colleges.map(c => <option key={c.collegeCode} value={c.collegeCode}>{c.collegeName}</option>)}
            </select>
        </div>

        <div className="relative">
            <BookOpen size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <select name="courseId" onChange={handleCourseChange} disabled={!formData.universityId} className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium text-gray-700 disabled:opacity-50">
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseData.courseShortName}</option>)}
            </select>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-3">
             <div className="relative">
                <Smartphone size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input type="tel" name="mobile" onChange={handleChange} placeholder="Mobile Number" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-semibold" />
             </div>
             <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input type="email" name="email" onChange={handleChange} placeholder="Email Address" className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm font-medium" />
             </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg mt-4 flex justify-center gap-2 hover:shadow-xl transition-all">
            {loading ? <Loader2 className="animate-spin" /> : <>Complete <CheckCircle size={20} /></>}
        </button>
      </form>
    </motion.div>
  );
};

export default SignupForm;
