import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Smartphone, Mail, Building, GraduationCap, 
  ChevronDown, CheckCircle, Loader2, AlertCircle, BookOpen 
} from 'lucide-react';

// Utils & Config
import { getSecureHeaders, getTelegramUser } from '../../utils/security';
import { API_ENDPOINTS, STATIC_FILES } from '../../config/apiConfig';

const SignupForm = ({ onSignupComplete }) => {
  // --- INITIAL DATA FROM TELEGRAM ---
  const tgUser = getTelegramUser();
  
  // --- STATES ---
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false); // For dropdowns
  const [error, setError] = useState(null);

  // Dropdown Lists
  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);

  // Form Data State
  const [formData, setFormData] = useState({
    tg_id: tgUser?.id || '',
    username: tgUser?.username || '',
    // Name editable hai, par default Telegram wala rahega
    name: tgUser?.first_name ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : '',
    photo: tgUser?.photo_url || null,
    
    universityId: '',
    collegeCode: '',
    courseId: '',
    
    mobile: '',
    email: ''
  });

  // --- 1. LOAD UNIVERSITIES (Static JSON) ---
  useEffect(() => {
    fetch(STATIC_FILES.UNIVERSITIES)
      .then(res => res.json())
      .then(data => setUniversities(data))
      .catch(err => console.error("Uni Load Error", err));
  }, []);

  // --- 2. LOAD COLLEGES (Jab University Select Ho) ---
  useEffect(() => {
    if (!formData.universityId) {
        setColleges([]);
        return;
    }
    
    setDataLoading(true);
    fetch(API_ENDPOINTS.GET_COLLEGES(formData.universityId), {
        headers: getSecureHeaders()
    })
    .then(res => res.json())
    .then(data => {
        if(data.STATUS_CODE === 200) {
            setColleges(data.RESPONSE);
        } else {
            setColleges([]); // Empty if error
        }
        setDataLoading(false);
    })
    .catch(() => setDataLoading(false));
  }, [formData.universityId]);

  // --- 3. LOAD COURSES (Jab University Select Ho) ---
  useEffect(() => {
    if (!formData.universityId) {
        setCourses([]);
        return;
    }

    // API structure ke hisab se University ID bhej rahe hain
    fetch(API_ENDPOINTS.GET_COURSES(formData.universityId), {
        headers: getSecureHeaders()
    })
    .then(res => res.json())
    .then(data => {
        if(data.STATUS_CODE === 200) {
            setCourses(data.RESPONSE);
        }
    });
  }, [formData.universityId]);

  // --- HANDLERS ---

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on typing
  };

  const validateForm = () => {
    if (!formData.universityId || !formData.collegeCode || !formData.courseId) {
        setError("Please select University, College, and Course.");
        return false;
    }
    
    // Indian Mobile Regex (6-9 se start, total 10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
        setError("Invalid Indian Mobile Number.");
        return false;
    }

    // Simple Email Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        setError("Invalid Email Address.");
        return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    try {
        const response = await fetch(API_ENDPOINTS.REGISTER_USER, {
            method: 'POST',
            headers: getSecureHeaders(), // Secure Headers + Hash
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.STATUS_CODE === 200) {
            // Success! Parent ko Data bhejo (User + Token)
            onSignupComplete({
                user: data.RESPONSE.user_data,
                token: data.RESPONSE.token
            });
        } else {
            setError(data.MESSAGE || "Registration Failed");
        }
    } catch (err) {
        console.error(err);
        setError("Server Connection Failed. Try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl relative overflow-hidden"
    >
      {/* Top Decorative Line */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>

      <div className="mb-6 text-center">
         <h2 className="text-2xl font-bold text-gray-800">Student Sign Up</h2>
         <p className="text-xs text-gray-400 mt-1">Join the largest student community</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-pulse">
            <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        
        {/* READ ONLY SECTION (Telegram Data) */}
        <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100 flex items-center gap-3">
             <div className="relative">
                 <img 
                    src={formData.photo || "https://cdn-icons-png.flaticon.com/512/847/847969.png"} 
                    className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm" 
                    alt="Profile" 
                 />
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
             </div>
             <div className="flex-1">
                 <p className="text-[10px] text-gray-400 font-bold uppercase">Telegram ID (Verified)</p>
                 <p className="text-sm font-mono font-bold text-gray-700">{formData.tg_id}</p>
             </div>
        </div>

        {/* INPUT: FULL NAME */}
        <div className="relative">
            <User size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-semibold transition-all"
            />
        </div>

        {/* SELECT: UNIVERSITY */}
        <div className="relative">
            <Building size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <select 
                name="universityId" 
                onChange={handleChange} 
                className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm appearance-none font-medium text-gray-700"
            >
                <option value="">Select University</option>
                {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-4 text-gray-400 pointer-events-none"/>
        </div>

        {/* SELECT: COLLEGE (Dynamic) */}
        <div className="relative">
            <GraduationCap size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <select 
                name="collegeCode" 
                onChange={handleChange} 
                disabled={!formData.universityId} 
                className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm appearance-none font-medium text-gray-700 disabled:opacity-50"
            >
                <option value="">{dataLoading ? "Loading Colleges..." : "Select College"}</option>
                {colleges.map(c => <option key={c.collegeCode} value={c.collegeCode}>{c.collegeName}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-4 text-gray-400 pointer-events-none"/>
        </div>

        {/* SELECT: COURSE (Dynamic) */}
        <div className="relative">
            <BookOpen size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            <select 
                name="courseId" 
                onChange={handleChange} 
                disabled={!formData.universityId} 
                className="w-full pl-10 pr-8 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none text-sm appearance-none font-medium text-gray-700 disabled:opacity-50"
            >
                <option value="">Select Course</option>
                {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseData.courseShortName}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-4 text-gray-400 pointer-events-none"/>
        </div>

        {/* INPUT: MOBILE & EMAIL */}
        <div className="grid grid-cols-1 gap-3">
             <div className="relative">
                <div className="absolute left-3.5 top-3.5 text-gray-400 font-bold text-sm">+91</div>
                <input 
                    type="tel" 
                    name="mobile" 
                    maxLength="10" 
                    onChange={handleChange} 
                    placeholder="Mobile Number"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-bold transition-all" 
                />
             </div>
             <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input 
                    type="email" 
                    name="email" 
                    onChange={handleChange} 
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 focus:bg-white outline-none text-sm font-medium transition-all" 
                />
             </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 mt-4 active:scale-95 transition-transform flex justify-center items-center gap-2 hover:brightness-110 disabled:grayscale"
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={20} /> Creating Profile...
                </>
            ) : (
                <>
                    Complete Registration <CheckCircle size={20} />
                </>
            )}
        </button>

      </form>
    </motion.div>
  );
};

export default SignupForm;
